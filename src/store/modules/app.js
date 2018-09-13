import api from '@/util/api';

const initialState = {
  user: {
    token: null,
    email: null
  },
  isLoading: false
};

export const getters = {
  getToken: state => state.user.token
};

export const actions = {
  saveUser({ commit }, data) {
    if (!data || !data.token || !data.email) {
      return;
    }

    window.localStorage.setItem('token', data.token);
    commit('mSaveUser', data);
  },
  initData({ commit }) {
    commit('mToggleLoading', true);
    api.getRoadmaps({ ignoreLoading: true })
      .then(res => res && res.data.length > 0
        ? api.getRoadmapById(res.data[0].id, { ignoreLoading: true })
        : null
      )
      .then((res) => {
        if (res) {
          commit('roadmap/mSelectRoadmap', res.data, { root: true });
        }
      })
      .finally(() => commit('mToggleLoading', false));
  }
};

export const mutations = {
  mSaveUser(state, data) {
    state.user = {
      token: data.token,
      email: data.email
    };
  },
  mToggleLoading(state, isLoading) {
    state.isLoading = isLoading;
  }
};

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
};
