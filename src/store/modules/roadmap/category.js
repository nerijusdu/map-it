import api from '../../../services/api';

const initialState = {
  editCategoryId: null,
  previewCategoryId: null
};

export const getters = {
  categoryToEdit: (state) => {
    if (!state.editCategoryId) {
      return null;
    }

    const category = state.current.categories.find(t => t.id === state.editCategoryId);

    return category || null;
  },
  categoryToPreview: (state) => {
    if (!state.previewCategoryId) {
      return null;
    }

    const category = state.current.categories.find(t => t.id === state.previewCategoryId);

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
  }
};

export const mutations = {
  mEditCategory(state, categoryId) {
    state.editCategoryId = categoryId;
  },
  mPreviewCategory(state, categoryId) {
    state.previewCategoryId = categoryId;
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
  }
};

export default {
  state: initialState,
  getters,
  actions,
  mutations
};
