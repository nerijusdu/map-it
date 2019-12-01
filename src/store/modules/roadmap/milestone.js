import api from '../../../services/api';

const initialState = {
  editMilestoneId: null,
  previewMilestoneId: null
};

export const getters = {
  milestoneToEdit: (state) => {
    if (!state.editMilestoneId) {
      return null;
    }

    const milestone = state.current.milestones.find(t => t.id === state.editMilestoneId);

    return milestone || null;
  },
  milestoneToPreview: (state) => {
    if (!state.previewMilestoneId) {
      return null;
    }

    const milestone = state.current.milestones.find(t => t.id === state.previewMilestoneId);

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
  async saveMilestone({ state, commit }, milestone) {
    milestone.roadmapId = state.current.id;

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
  mEditMilestone(state, milestoneId) {
    state.editMilestoneId = milestoneId;
  },
  mPreviewMilestone(state, milestoneId) {
    state.previewMilestoneId = milestoneId;
  },
  mAddMilestone(state, milestone) {
    state.current.milestones.push(milestone);
  },
  mUpdateMilestone(state, milestone) {
    const i = state.current.milestones.findIndex(c => c.id === milestone.id);
    state.current.milestones = [
      ...state.current.milestones.slice(0, i),
      milestone,
      ...state.current.milestones.slice(i + 1)
    ];
  }
};

export default {
  state: initialState,
  getters,
  actions,
  mutations
};
