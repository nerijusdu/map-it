import moment from 'moment';
import api from '../../services/api';
import converters from '../../services/converterService';
import formatService from '../../services/formatService';

const initialState = {
  items: [],
  editTaskId: null,
  previewTaskId: null,
};

export const getters = {
  tasksByCategory: (state, _, rootState) => categoryId => state.items
    .filter(t => t.categoryId === categoryId)
    .map(t => ({
      ...t,
      startDate: moment(t.startDate),
      endDate: moment(t.endDate),
      width: formatService.calculateWidthPercentage(
        {
          startDate: moment(rootState.roadmap.current.startDate),
          endDate: moment(rootState.roadmap.current.endDate)
        },
        {
          startDate: moment(t.startDate),
          endDate: moment(t.endDate)
        }),
      leftMargin: formatService.calculateWidthPercentage(
        {
          startDate: moment(rootState.roadmap.current.startDate),
          endDate: moment(rootState.roadmap.current.endDate)
        },
        {
          startDate: moment(rootState.roadmap.current.startDate),
          endDate: moment(t.startDate)
        }, true)
    })),
  taskToEdit: (state) => {
    if (!state.editTaskId) {
      return null;
    }

    const task = state.items.find(t => t.id === state.editTaskId);
    if (!task) {
      return null;
    }

    return {
      ...task,
      startDate: new Date(task.startDate),
      endDate: new Date(task.endDate)
    };
  },
  taskToPreview: (state, _, rootState) => {
    if (!state.previewTaskId) {
      return null;
    }

    const task = state.items.find(t => t.id === state.previewTaskId);
    if (!task) {
      return null;
    }

    return {
      ...task,
      startDate: moment(task.startDate),
      endDate: moment(task.endDate),
      category: rootState.categories.items.find(c => c.id === task.categoryId)
    };
  }
};

export const actions = {
  async saveTask({ rootState, commit }, task) {
    task.roadmapId = rootState.roadmap.current.id;

    const isNew = !task.id;
    const result = await api.saveTask(task);
    if (!result || !result.ok) {
      return false;
    }

    task = converters.taskFromApi(result.data);
    if (isNew) {
      commit('mAddTask', task);
    } else {
      commit('mUpdateTask', task);
    }

    return true;
  },
  async deleteTask({ commit }, id) {
    const result = await api.deleteTask(id);
    if (!result || !result.ok) {
      return false;
    }

    commit('mDeleteTask', id);
    return true;
  },
  editTask({ state, commit }, { taskId, modal }) {
    if (taskId) {
      modal.show('addRoadmapEntity');
      modal.hide('previewTask');
    } else if (state.previewTaskId) {
      modal.show('previewTask');
    }
    commit('mEditTask', taskId);
  },
  previewTask({ commit }, { taskId, modal }) {
    if (taskId) {
      modal.show('previewTask');
    }
    commit('mPreviewTask', taskId);
  },
  async completeTask({ commit }, { id, isCompleted }) {
    if (!id) {
      return;
    }

    const result = await api.completeTask(id, isCompleted, { ignoreLoading: true });
    if (!result || !result.ok) {
      return;
    }

    commit('mCompleteTask', { id, isCompleted });
  },
  async assignUserToTask({ commit, state }, { userId, taskId }) {
    const options = { ignoreLoading: true };
    if (userId) {
      await api.assignUserToTask(userId, taskId, options);
    }
    else {
      await api.unassignFromTask(taskId, options);
    }

    const task = state.items.find(t => t.id === taskId);
    commit('mUpdateTask', {
      ...task,
      assigneeId: userId
    });
  }
};

export const mutations = {
  mLoad(state, tasks) {
    state.items = tasks;
  },
  mReset(state) {
    state.items = initialState.items;
    state.editTaskId = initialState.editTaskId;
    state.previewTaskId = initialState.previewTaskId;
  },
  mCompleteTask(state, { id, isCompleted }) {
    const i = state.items.findIndex(t => t.id === id);
    state.items[i].isCompleted = isCompleted;
  },
  mAddTask(state, task) {
    state.items.push(task);
  },
  mDeleteTask(state, id) {
    const i = state.items.findIndex(t => t.id === id);
    state.items = [
      ...state.items.slice(0, i),
      ...state.items.slice(i + 1)
    ];
  },
  mUpdateTask(state, task) {
    const i = state.items.findIndex(t => t.id === task.id);
    state.items = [
      ...state.items.slice(0, i),
      task,
      ...state.items.slice(i + 1)
    ];
  },
  mEditTask(state, taskId) {
    state.editTaskId = taskId;
  },
  mPreviewTask(state, taskId) {
    state.previewTaskId = taskId;
  }
};

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
};
