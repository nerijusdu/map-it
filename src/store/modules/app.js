import moment from 'moment';
import api from '@/services/api';
import { errorTime } from '@/constants';

const initialState = {
  user: {
    id: window.localStorage.getItem('userId'),
    token: window.localStorage.getItem('token'),
    refreshToken: window.localStorage.getItem('refreshToken'),
    email: window.localStorage.getItem('email'),
    expiresAt: moment(window.localStorage.getItem('tokenExpiresAt'))
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
  async getToken({ state, commit, dispatch }) {
    const now = moment();
    if (state.user.token) {
      return state.user.expiresAt.isBefore(now, 'second')
        ? dispatch('refreshToken')
        : state.user.token;
    }

    const id = window.localStorage.getItem('userId');
    const token = window.localStorage.getItem('token');
    const expiresAt = window.localStorage.getItem('tokenExpiresAt');
    const refreshToken = window.localStorage.getItem('refreshToken');
    const email = window.localStorage.getItem('email');
    if (token && expiresAt && moment(expiresAt).isAfter(now, 'second')) {
      commit('mSaveUser', { token, refreshToken, email, id });
      return token;
    }

    return dispatch('refreshToken');
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
  saveUser({ commit, dispatch }, data) {
    if (!data || !data.token || !data.email) {
      return;
    }

    window.localStorage.setItem('userId', data.id);
    window.localStorage.setItem('token', data.token);
    window.localStorage.setItem('refreshToken', data.refreshToken);
    window.localStorage.setItem('email', data.email);
    window.localStorage.setItem('tokenExpiresAt', data.expiresAt);
    commit('mSaveUser', data);
    dispatch('roadmap/init', null, { root: true });
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
  logout({ commit, dispatch, state }, router) {
    const refreshToken = state.user.refreshToken || window.localStorage.getItem('refreshToken');
    const email = state.user.email || window.localStorage.getItem('email');
    api.logout(refreshToken, email);

    window.localStorage.removeItem('userId');
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('refreshToken');
    window.localStorage.removeItem('email');
    window.localStorage.removeItem('tokenExpiresAt');
    commit('mSaveUser', { token: null, refreshToken: null, email: null });
    commit('mLogout');
    dispatch('roadmap/reset', null, { root: true });
    router.push('Login');
  },
  async init({ commit, state, dispatch }) {
    if (state.isInitialized) {
      return;
    }
    if (state.user.token) {
      await dispatch('roadmap/init', null, { root: true });
    }

    commit('mInit');
  }
};

export const mutations = {
  mSaveUser(state, data) {
    state.user = {
      id: data.id,
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
