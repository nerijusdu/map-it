const initialState = {
  user: {
    token: null,
    email: null
  }
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
  }
};

export const mutations = {
  mSaveUser(state, data) {
    state.user = {
      token: data.token,
      email: data.email
    };
  }
};

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
};
