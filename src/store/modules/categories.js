import api from '../../services/api';

const initialState = {
  items: [],
  editCategoryId: null,
  previewCategoryId: null
};

export const getters = {
  categoryToEdit: (state) => {
    if (!state.editCategoryId) {
      return null;
    }

    const category = state.items.find(t => t.id === state.editCategoryId);

    return category || null;
  },
  categoryToPreview: (state) => {
    if (!state.previewCategoryId) {
      return null;
    }

    const category = state.items.find(t => t.id === state.previewCategoryId);

    return category || null;
  }
};

export const actions = {
  editCategory({ state, commit }, { categoryId, modal }) {
    if (categoryId) {
      modal.show('addTask');
      modal.hide('previewCategory');
    } else if (state.previewCategoryId) {
      modal.show('previewCategory');
    }
    commit('mEditCategory', categoryId);
  },
  previewCategory({ commit }, { categoryId, modal }) {
    if (categoryId) {
      modal.show('previewCategory');
    }
    commit('mPreviewCategory', categoryId);
  },
  async saveCategory({ rootState, commit }, category) {
    category.roadmapId = rootState.roadmap.current.id;

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
  }
};

export const mutations = {
  mLoad(state, categories) {
    state.items = categories;
  },
  mReset(state) {
    state.items = initialState.items;
    state.previewCategoryId = initialState.previewCategoryId;
    state.editCategoryId = initialState.editCategoryId;
  },
  mEditCategory(state, categoryId) {
    state.editCategoryId = categoryId;
  },
  mPreviewCategory(state, categoryId) {
    state.previewCategoryId = categoryId;
  },
  mAddCategory(state, category) {
    state.items.push(category);
  },
  mUpdateCategory(state, category) {
    const i = state.items.findIndex(c => c.id === category.id);
    state.items = [
      ...state.items.slice(0, i),
      category,
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
