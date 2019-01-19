import { errorTime } from '../../constants';
import router from '../../router';

const initialState = {
  user: {
    token: null,
    email: null
  },
  isInitialized: false,
  isLoading: false,
  message: {
    text: '',
    isError: false
  }
};

export const getters = {

};

export const actions = {
  getToken({ state, commit }) {
    if (state.user.token) {
      return state.user.token;
    }

    const token = window.localStorage.getItem('token');
    if (token) {
      commit('mSaveUser', { token });
      // TODO: validate and update token
    }

    return token;
  },
  saveUser({ commit }, data) {
    if (!data || !data.token || !data.email) {
      return;
    }

    window.localStorage.setItem('token', data.token);
    commit('mSaveUser', data);
  },
  showError({ commit }, error) {
    if (error) {
      setTimeout(() => commit('mShowMessage', { text: '' }), errorTime);
    }
    commit('mShowMessage', {
      text: error,
      isError: true
    });
  },
  showMessage({ commit }, message) {
    if (message) {
      setTimeout(() => commit('mShowMessage', { text: '' }), errorTime);
    }
    commit('mShowMessage', {
      text: message,
      isError: false
    });
  },
  logout({ commit }) {
    window.localStorage.removeItem('token');
    commit('mSaveUser', { token: null, email: null });
    router.push('Login');
  },
  init({ commit, dispatch, state }) {
    if (state.isInitialized || !state.user.token) {
      return;
    }

    dispatch('roadmap/init', null, { root: true });
    commit('mInit');
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
  },
  mShowMessage(state, error) {
    state.message = error;
  },
  mInit(state) {
    state.isInitialized = true;
  }
};

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
};
