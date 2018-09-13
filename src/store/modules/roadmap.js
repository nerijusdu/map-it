import moment from 'moment';
import shortId from 'shortid';
import api from '@/util/api';
import { roadmapMonthFormat } from '@/util/constants';

const initialState = {
  current: {},
  editTaskId: null,
  previewTaskId: null
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
      categoryId: state.current.categories.find(c => c.id === task.categoryId)
    };
  },
  roadmapTimeFrame: state => ({
    startDate: state.current.startDate,
    endDate: state.current.endDate
  })
};

export const actions = {
  saveTask({ state, commit }, task) {
    const item = state.current.tasks.find(t => t.id === task.id);

    if (!item) {
      commit('mAddTask', task);
    } else {
      commit('mUpdateTask', task);
    }
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
  saveCategory({ state, commit }, category) {
    const item = state.current.categories.find(c => c.id === category.id);

    if (!item) {
      commit('mAddCategory', category);
    } else {
      commit('mUpdateCategory', category);
    }
  },
  init({ commit }) {
    commit('app/mToggleLoading', true, { root: true });
    api.getRoadmaps({ ignoreLoading: true })
      .then(res => res && res.data.length > 0
        ? api.getRoadmapById(res.data[0].id, { ignoreLoading: true })
        : null
      )
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
    state.current.tasks.push({
      ...task,
      id: shortId.generate()
    });
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
  mAddCategory(state, category) {
    state.current.categories.push({
      ...category,
      id: shortId.generate()
    });
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
  }
};

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
};
