import api from '../../services/api';

const initialState = {
  googleAccountLinked: false
};

const getters = {};

const actions = {
  async init({ commit }) {
    const res = await api.getSettings({ ignoreLoading: true });
    if (!res) {
      return;
    }

    commit('mSaveSettings', res.data);
  }
};

const mutations = {
  mSaveSettings(state, data) {
    state.googleAccountLinked = data.googleAccountLinked;
  }
};

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
};
