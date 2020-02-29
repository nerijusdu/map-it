import api from '../../services/api';

const initialState = {
  items: [],
  editEpicId: null,
  previewEpicId: null
};

export const getters = {
  epicToEdit: (state) => {
    if (!state.editEpicId) {
      return null;
    }

    const epic = state.items.find(t => t.id === state.editEpicId);

    return epic || null;
  },
  epicToPreview: (state, _, rootState) => {
    if (!state.previewEpicId) {
      return null;
    }

    const epic = state.items.find(t => t.id === state.previewEpicId);
    if (!epic) {
      return null;
    }

    return {
      ...epic,
      categories: rootState.categories.items.filter(x => x.epicId === epic.id)
    };
  },
  epicList: (state, _, rootState) => state.items.map((epic) => {
    const categories = rootState.categories.items
      .filter(x => x.epicId === epic.id)
      .map(x => x.id);
    const allCategories = rootState.categories.items
      .filter(x => categories.includes(x.id) || categories.includes(x.parentCategoryId))
      .map(x => x.id);

    const emptyCategories = new Set([...allCategories]);
    rootState.categories.items.forEach((x) => {
      if (allCategories.includes(x.id) && x.parentCategoryId) {
        emptyCategories.delete(x.parentCategoryId);
      }
    });
    const tasks = rootState.roadmap.current.tasks.filter((x) => {
      const includes = allCategories.includes(x.categoryId);
      if (includes) {
        emptyCategories.delete(x.categoryId);
      }
      return includes;
    });

    return {
      ...epic,
      categoryCount: categories.length,
      taskCount: tasks.length,
      emptyCategories: emptyCategories.size
    };
  })
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
  async saveEpic({ rootState, commit }, epic) {
    epic.roadmapId = rootState.roadmap.current.id;

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
  mLoad(state, epics) {
    state.items = epics;
  },
  mReset(state) {
    state.items = initialState.items;
    state.previewEpicId = initialState.previewEpicId;
    state.editEpicId = initialState.editEpicId;
  },
  mEditEpic(state, epicId) {
    state.editEpicId = epicId;
  },
  mPreviewEpic(state, epicId) {
    state.previewEpicId = epicId;
  },
  mAddEpic(state, epic) {
    state.items.push(epic);
  },
  mUpdateEpic(state, epic) {
    const i = state.items.findIndex(c => c.id === epic.id);
    state.items = [
      ...state.items.slice(0, i),
      epic,
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
