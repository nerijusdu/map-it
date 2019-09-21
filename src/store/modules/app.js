import moment from 'moment';
import api from '@/services/api';
import { errorTime } from '@/constants';

const initialState = {
  user: {
    token: null,
    refreshToken: null,
    email: null,
    expiresAt: moment()
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
      const refreshToken = window.localStorage.getItem('refreshToken');
      const email = window.localStorage.getItem('email');
      commit('mSaveUser', { token, refreshToken, email });
      // TODO: validate and update token
    }

    return token;
  },
  async refreshToken({ state, dispatch }) {
    let { email, refreshToken } = state.user;
    if (!email || !refreshToken) {
      refreshToken = window.localStorage.getItem('refreshToken');
      email = window.localStorage.getItem('email');
    }
    if (!email || !refreshToken) {
      return false;
    }

    const result = await api.refreshToken({
      email,
      refreshToken
    });
    if (!result || !result.ok) {
      return false;
    }

    dispatch('saveUser', result.data);
    return result.data.token;
  },
  saveUser({ commit }, data) {
    if (!data || !data.token || !data.email) {
      return;
    }

    window.localStorage.setItem('token', data.token);
    window.localStorage.setItem('refreshToken', data.refreshToken);
    window.localStorage.setItem('email', data.email);
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
  logout({ commit, dispatch }, router) {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('refreshToken');
    window.localStorage.removeItem('email');
    commit('mSaveUser', { token: null, refreshToken: null, email: null });
    commit('mLogout');
    dispatch('roadmap/reset', null, { root: true });
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
      refreshToken: data.refreshToken,
      email: data.email,
      expiresAt: moment(data.expiresAt)
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
  },
  mLogout(state) {
    state.isInitialized = false;
  }
};

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
};
