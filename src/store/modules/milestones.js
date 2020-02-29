import api from '../../services/api';

const initialState = {
  items: [],
  editMilestoneId: null,
  previewMilestoneId: null
};

export const getters = {
  milestoneToEdit: (state) => {
    if (!state.editMilestoneId) {
      return null;
    }

    const milestone = state.items.find(t => t.id === state.editMilestoneId);

    return milestone || null;
  },
  milestoneToPreview: (state) => {
    if (!state.previewMilestoneId) {
      return null;
    }

    const milestone = state.items.find(t => t.id === state.previewMilestoneId);

    return milestone || null;
  }
};

export const actions = {
  editMilestone({ state, commit }, { milestoneId, modal }) {
    if (milestoneId) {
      modal.show('addTask');
      modal.hide('previewMilestone');
    } else if (state.previewMilestoneId) {
      modal.show('previewMilestone');
    }
    commit('mEditMilestone', milestoneId);
  },
  previewMilestone({ commit }, { milestoneId, modal }) {
    if (milestoneId) {
      modal.show('previewMilestone');
    }
    commit('mPreviewMilestone', milestoneId);
  },
  async saveMilestone({ rootState, commit }, milestone) {
    milestone.roadmapId = rootState.roadmap.current.id;

    const isNew = !milestone.id;
    const result = await api.saveMilestone(milestone);
    if (!result || !result.ok) {
      return false;
    }

    if (isNew) {
      commit('mAddMilestone', result.data);
    } else {
      commit('mUpdateMilestone', result.data);
    }
    return true;
  }
};

export const mutations = {
  mLoad(state, milestones) {
    state.items = milestones;
  },
  mReset(state) {
    state.items = initialState.items;
    state.editMilestoneId = initialState.editMilestoneId;
    state.previewMilestoneId = initialState.previewMilestoneId;
  },
  mEditMilestone(state, milestoneId) {
    state.editMilestoneId = milestoneId;
  },
  mPreviewMilestone(state, milestoneId) {
    state.previewMilestoneId = milestoneId;
  },
  mAddMilestone(state, milestone) {
    state.items.push(milestone);
  },
  mUpdateMilestone(state, milestone) {
    const i = state.items.findIndex(c => c.id === milestone.id);
    state.items = [
      ...state.items.slice(0, i),
      milestone,
      ...state.items.slice(i + 1)
    ];
  }
};

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
};
