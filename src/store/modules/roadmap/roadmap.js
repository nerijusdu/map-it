import moment from 'moment';
import api from '../../../services/api';
import { roadmapMonthFormat } from '../../../constants';
import converters from '../../../services/converterService';

const initialState = {
  current: {},
  all: [],
  isInitialized: false,
  isInitialising: false,
  editRoadmapId: null
};

export const getters = {
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
  }),
  selectedRoadmap: state => state.current.id
};

export const actions = {
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
  async selectRoadmap({ commit }, roadmapId) {
    const result = await api.getRoadmapById(roadmapId);
    if (!result || !result.ok) {
      return false;
    }

    window.localStorage.setItem('roadmapId', roadmapId);

    commit('mSelectRoadmap', result.data);
    return true;
  },
  init({ commit, state, dispatch }) {
    if (state.isInitialized || state.isInitialising) {
      return;
    }

    commit('mToggleInitialising', true);
    commit('app/mToggleLoading', true, { root: true });
    api.getRoadmaps({ ignoreLoading: true })
      .then((res) => {
        if (!res) {
          return null;
        }

        commit('mSetRoadmaps', res.data.map(x => converters.roadmapFromApi(x)));

        if (res.data.length === 0) {
          return null;
        }

        const selectedRoadmapId = window.localStorage.getItem('roadmapId');
        const id = selectedRoadmapId ? parseInt(selectedRoadmapId, 10) : res.data[0].id;

        return dispatch('selectRoadmap', id);
      })
      .then((res) => {
        if (res) {
          commit('mInit');
        }
      })
      .finally(() => {
        commit('app/mToggleLoading', false, { root: true });
        commit('mToggleInitialising', false);
      });
  },
  reset({ commit }) {
    commit('mReset');
  }
};

export const mutations = {
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
  },
  mInit(state) {
    state.isInitialized = true;
  },
  mToggleInitialising(state, isInitialising) {
    state.isInitialising = isInitialising;
  },
  mReset(state) {
    state.all = [];
    state.current = {};
    state.editTaskId = null;
    state.previewTaskId = null;
    state.previewCategoryId = null;
    state.editRoadmapId = null;
    state.isInitialized = false;
    state.isInitialising = false;
  }
};

export default {
  state: initialState,
  getters,
  actions,
  mutations
};
