import moment from 'moment';
import api from '../../services/api';
import { roadmapMonthFormat } from '../../constants';
import converters from '../../services/converterService';
import formatService from '../../services/formatService';
import router from '../../router';

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
    const start = moment(state.current.startDate);
    const end = moment(state.current.endDate);

    let id = 1;
    while (start.isSameOrBefore(end)) {
      months.push({
        id,
        label: start.format(roadmapMonthFormat),
        width: formatService.calculateWidthPercentage(
          {
            startDate: moment(state.current.startDate),
            endDate: moment(state.current.endDate)
          },
          {
            startDate: start,
            endDate: moment(start).endOf('month')
          })
      });
      start.add(1, 'month').startOf('month');
      id += 1;
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
      startDate: new Date(roadmap.startDate),
      endDate: new Date(roadmap.endDate)
    };
  },
  roadmapTimeFrame: state => ({
    startDate: moment(state.current.startDate),
    endDate: moment(state.current.endDate)
  }),
  selectedRoadmap: state => state.current.id,
  readonly: state => state.current.readonly
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
  async selectRoadmap({ commit }, { roadmapId, ignoreRouter }) {
    const result = await api.getRoadmapById(roadmapId);
    if (!result || !result.ok) {
      return false;
    }

    window.localStorage.setItem('roadmapId', roadmapId);

    commit('mSelectRoadmap', result.data);
    commit('milestones/mLoad', result.data.milestones, { root: true });
    commit('epics/mLoad', result.data.epics, { root: true });
    commit('categories/mLoad', result.data.categories, { root: true });
    commit('tasks/mLoad', result.data.tasks, { root: true });
    if (!ignoreRouter) {
      router.push(`/timeline/${roadmapId}`);
    }

    return true;
  },
  async init({ commit, state, dispatch }) {
    if (state.isInitialized || state.isInitialising) {
      return;
    }

    commit('mToggleInitialising', true);
    commit('app/mToggleLoading', true, { root: true });
    const res = await api.getRoadmaps({ ignoreLoading: true });
    if (!res) {
      commit('app/mToggleLoading', false, { root: true });
      commit('mToggleInitialising', true);
      return;
    }

    commit('mSetRoadmaps', res.data.map(x => converters.roadmapFromApi(x)));

    if (res.data.length === 0) {
      commit('app/mToggleLoading', false, { root: true });
      commit('mToggleInitialising', true);
      return;
    }

    const selectedRoadmapId = window.localStorage.getItem('roadmapId');
    const id = selectedRoadmapId ? parseInt(selectedRoadmapId, 10) : res.data[0].id;

    const success = await dispatch('selectRoadmap', { roadmapId: id, ignoreRouter: true });
    if (success) {
      commit('mInit');
    }
    commit('app/mToggleLoading', false, { root: true });
    commit('mToggleInitialising', false);
  },
  reset({ commit }) {
    commit('mReset');
    commit('milestones/mReset', null, { root: true });
    commit('epics/mReset', null, { root: true });
    commit('categories/mReset', null, { root: true });
    commit('tasks/mReset', null, { root: true });
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
    state.current = { ...roadmap };
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
    state.editRoadmapId = null;
    state.isInitialized = false;
    state.isInitialising = false;
  }
};

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
};
