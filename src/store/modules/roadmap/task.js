import moment from 'moment';
import api from '../../../services/api';
import converters from '../../../services/converterService';

const initialState = {
  editTaskId: null,
  previewTaskId: null,
};

export const getters = {
  tasksByCategory: state => categoryId => state.current.tasks
    .filter(t => t.categoryId === categoryId)
    .map(t => ({ ...t, startDate: moment(t.startDate), endDate: moment(t.endDate) })),
  taskToEdit: (state) => {
    if (!state.editTaskId) {
      return null;
    }

    const task = state.current.tasks.find(t => t.id === state.editTaskId);
    if (!task) {
      return null;
    }

    return {
      ...task,
      startDate: new Date(task.startDate),
      endDate: new Date(task.endDate)
    };
  },
  taskToPreview: (state) => {
    if (!state.previewTaskId) {
      return null;
    }

    const task = state.current.tasks.find(t => t.id === state.previewTaskId);
    if (!task) {
      return null;
    }

    return {
      ...task,
      startDate: moment(task.startDate),
      endDate: moment(task.endDate),
      category: state.current.categories.find(c => c.id === task.categoryId)
    };
  }
};

export const actions = {
  async saveTask({ state, commit }, task) {
    task.roadmapId = state.current.id;

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
      modal.show('addTask');
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
    const result = await api.completeTask(id, isCompleted, { ignoreLoading: true });
    if (!result || !result.ok) {
      return;
    }

    commit('mCompleteTask', { id, isCompleted });
  }
};

export const mutations = {
  mCompleteTask(state, { id, isCompleted }) {
    const i = state.current.tasks.findIndex(t => t.id === id);
    state.current.tasks[i].isCompleted = isCompleted;
  },
  mAddTask(state, task) {
    state.current.tasks.push(task);
  },
  mDeleteTask(state, id) {
    const i = state.current.tasks.findIndex(t => t.id === id);
    state.current.tasks = [
      ...state.current.tasks.slice(0, i),
      ...state.current.tasks.slice(i + 1)
    ];
  },
  mUpdateTask(state, task) {
    const i = state.current.tasks.findIndex(t => t.id === task.id);
    state.current.tasks = [
      ...state.current.tasks.slice(0, i),
      task,
      ...state.current.tasks.slice(i + 1)
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
  state: initialState,
  getters,
  actions,
  mutations
};
