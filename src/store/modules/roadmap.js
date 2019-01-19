import moment from 'moment';
import api from '@/util/api';
import { roadmapMonthFormat } from '@/util/constants';
import converters from '@/util/converters';

const initialState = {
  current: {},
  all: [],
  editTaskId: null,
  previewTaskId: null,
  editRoadmapId: null
};

export const getters = {
  tasksByCategory: state => categoryId => state.current.tasks.filter(t => t.categoryId === categoryId),
  roadmapMonths: (state) => {
    const months = [];
    const start = moment(state.current.startDate).startOf('month');
    const end = moment(state.current.endDate).endOf('month');

    while (start.isSameOrBefore(end)) {
      months.push(start.format(roadmapMonthFormat));
      start.add(1, 'month');
    }

    return months;
  },
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
      startDate: task.startDate.toDate(),
      endDate: task.endDate.toDate()
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
      category: state.current.categories.find(c => c.id === task.categoryId)
    };
  },
  roadmapToEdit: (state) => {
    if (!state.editRoadmapId) {
      return null;
    }

    const roadmap = state.all.find(r => r.id === state.editRoadmapId);
    if (!roadmap) {
      return null;
    }

    return {
      ...roadmap,
      startDate: roadmap.startDate.toDate(),
      endDate: roadmap.endDate.toDate()
    };
  },
  roadmapTimeFrame: state => ({
    startDate: state.current.startDate,
    endDate: state.current.endDate
  })
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
  async saveCategory({ state, commit }, category) {
    category.roadmapId = state.current.id;

    const isNew = !category.id;
    const result = await api.saveCategory(category);
    if (!result || !result.ok) {
      return false;
    }

    if (isNew) {
      commit('mAddCategory', result.data);
    } else {
      commit('mUpdateCategory', result.data);
    }
    return true;
  },
  async saveRoadmap({ commit }, roadmap) {
    const isNew = !roadmap.id;
    const result = await api.saveRoadmap(roadmap);
    if (!result || !result.ok) {
      return false;
    }

    roadmap = converters.roadmapFromApi(result.data);
    if (isNew) {
      commit('mAddRoadmap', roadmap);
    } else {
      commit('mUpdateRoadmap', roadmap);
    }

    return true;
  },
  editRoadmap({ commit }, { roadmapId, modal }) {
    modal.show('addRoadmap');
    commit('mEditRoadmap', roadmapId);
  },
  async deleteRoadmap({ commit }, roadmapId) {
    const result = await api.deleteRoadmap(roadmapId);
    if (!result || !result.ok) {
      return false;
    }

    commit('mDeleteRoadmap', roadmapId);
    return true;
  },
  init({ commit }) {
    commit('app/mToggleLoading', true, { root: true });
    api.getRoadmaps({ ignoreLoading: true })
      .then((res) => {
        if (!res) {
          return null;
        }

        commit('mSetRoadmaps', res.data.map(x => converters.roadmapFromApi(x)));

        return res.data.length > 0
          ? api.getRoadmapById(res.data[0].id, { ignoreLoading: true })
          : null;
      })
      .then((res) => {
        if (res) {
          commit('mSelectRoadmap', res.data);
        }
      })
      .finally(() => commit('app/mToggleLoading', false, { root: true }));
  },
};

export const mutations = {
  mAddTask(state, task) {
    state.current.tasks.push(task);
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
  },
  mAddRoadmap(state, roadmap) {
    state.all.push(roadmap);
  },
  mUpdateRoadmap(state, roadmap) {
    const i = state.all.findIndex(r => r.id === roadmap.id);
    state.all = [
      ...state.all.slice(0, i),
      roadmap,
      ...state.all.slice(i + 1)
    ];
  },
  mEditRoadmap(state, roadmapId) {
    state.editRoadmapId = roadmapId;
  },
  mDeleteRoadmap(state, roadmapId) {
    const i = state.all.findIndex(r => r.id === roadmapId);
    state.all = [
      ...state.all.slice(0, i),
      ...state.all.slice(i + 1)
    ];
  },
  mAddCategory(state, category) {
    state.current.categories.push(category);
  },
  mUpdateCategory(state, category) {
    const i = state.current.categories.findIndex(c => c.id === category.id);
    state.current.categories = [
      ...state.current.categories.slice(0, i),
      category,
      ...state.current.categories.slice(i + 1)
    ];
  },
  mSelectRoadmap(state, roadmap) {
    state.current = {
      ...roadmap,
      startDate: moment(roadmap.startDate),
      endDate: moment(roadmap.endDate),
      tasks: roadmap.tasks.map(task => ({
        ...task,
        startDate: moment(task.startDate),
        endDate: moment(task.endDate)
      }))
    };
  },
  mSetRoadmaps(state, roadmaps) {
    state.all = roadmaps;
  }
};

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
};
