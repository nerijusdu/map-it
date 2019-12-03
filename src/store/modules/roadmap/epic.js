import api from '../../../services/api';

const initialState = {
  editEpicId: null,
  previewEpicId: null
};

export const getters = {
  epicToEdit: (state) => {
    if (!state.editEpicId) {
      return null;
    }

    const epic = state.current.epics.find(t => t.id === state.editEpicId);

    return epic || null;
  },
  epicToPreview: (state) => {
    if (!state.previewEpicId) {
      return null;
    }

    const epic = state.current.epics.find(t => t.id === state.previewEpicId);

    return epic || null;
  }
};

export const actions = {
  editEpic({ state, commit }, { epicId, modal }) {
    if (epicId) {
      modal.show('addTask');
      modal.hide('previewEpic');
    } else if (state.previewEpicId) {
      modal.show('previewEpic');
    }
    commit('mEditEpic', epicId);
  },
  previewEpic({ commit }, { epicId, modal }) {
    if (epicId) {
      modal.show('previewEpic');
    }
    commit('mPreviewEpic', epicId);
  },
  async saveEpic({ state, commit }, epic) {
    epic.roadmapId = state.current.id;

    const isNew = !epic.id;
    const result = await api.saveEpic(epic);
    if (!result || !result.ok) {
      return false;
    }

    if (isNew) {
      commit('mAddEpic', result.data);
    } else {
      commit('mUpdateEpic', result.data);
    }
    return true;
  }
};

export const mutations = {
  mEditEpic(state, epicId) {
    state.editEpicId = epicId;
  },
  mPreviewEpic(state, epicId) {
    state.previewEpicId = epicId;
  },
  mAddEpic(state, epic) {
    state.current.epics.push(epic);
  },
  mUpdateEpic(state, epic) {
    const i = state.current.epics.findIndex(c => c.id === epic.id);
    state.current.epics = [
      ...state.current.epics.slice(0, i),
      epic,
      ...state.current.epics.slice(i + 1)
    ];
  }
};

export default {
  state: initialState,
  getters,
  actions,
  mutations
};
