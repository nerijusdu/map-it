import moment from 'moment';
import api from '@/services/api';
import { errorTime } from '@/constants';
import notificationService from '../../services/notificationService';

const initialState = {
  user: {
    id: window.localStorage.getItem('userId'),
    token: window.localStorage.getItem('token'),
    isAdmin: window.localStorage.getItem('isAdmin') === 'true',
    refreshToken: window.localStorage.getItem('refreshToken'),
    email: window.localStorage.getItem('email'),
    expiresAt: moment(window.localStorage.getItem('tokenExpiresAt'))
  },
  isRefreshingToken: false,
  isInitialized: false,
  isLoading: false,
  isOnline: true,
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
    const isAdmin = window.localStorage.getItem('isAdmin');
    if (token && expiresAt && moment(expiresAt).isAfter(now, 'second')) {
      commit('mSaveUser', { token, refreshToken, email, id, isAdmin });
      return token;
    }

    return dispatch('refreshToken');
  },
  async refreshToken({ state, dispatch, commit }) {
    let { email, refreshToken } = state.user;
    if (!email || !refreshToken) {
      refreshToken = window.localStorage.getItem('refreshToken');
      email = window.localStorage.getItem('email');
    }
    if (!email || !refreshToken) {
      return false;
    }

    if (state.isRefreshingToken) {
      return new Promise((resolve) => {
        setTimeout(async () => {
          const res = await dispatch('refreshToken');
          resolve(res);
        }, 500);
      });
    }

    commit('mRefreshTokenToggle', true);
    const result = await api.refreshToken({
      email,
      refreshToken
    });
    commit('mRefreshTokenToggle', false);
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
    window.localStorage.setItem('isAdmin', data.isAdmin);
    window.localStorage.setItem('refreshToken', data.refreshToken);
    window.localStorage.setItem('email', data.email);
    window.localStorage.setItem('tokenExpiresAt', data.expiresAt);
    commit('mSaveUser', data);
    dispatch('onLogin');
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
    notificationService.onLogout();

    window.localStorage.removeItem('userId');
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('isAdmin');
    window.localStorage.removeItem('refreshToken');
    window.localStorage.removeItem('email');
    window.localStorage.removeItem('tokenExpiresAt');
    commit('mSaveUser', { token: null, refreshToken: null, email: null });
    commit('mLogout');
    dispatch('roadmap/reset', null, { root: true });
    router.push('/login');
  },
  toggleOnline({ commit, dispatch, state }, isOnline) {
    if (state.isOnline && !isOnline) {
      dispatch('showError', 'Oof! You are offline. You can keep using the app, but some things might not be up to date.');
    }
    if (!state.isOnline && isOnline) {
      dispatch('showMessage', 'Yay! You are back online.');
    }
    commit('mToggleOnline', isOnline);
  },
  async onLogin({ dispatch }) {
    await dispatch('roadmap/init', null, { root: true });
    await notificationService.onLogin();
  },
  async init({ commit, state, dispatch }) {
    if (state.isInitialized) {
      return;
    }
    if (state.user.token) {
      await dispatch('onLogin');
    }

    commit('mInit');
  }
};

export const mutations = {
  mSaveUser(state, data) {
    state.user = {
      id: data.id,
      token: data.token,
      isAdmin: data.isAdmin,
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
  },
  mToggleOnline(state, isOnline) {
    state.isOnline = isOnline;
  },
  mRefreshTokenToggle(state, isRefreshing) {
    state.isRefreshingToken = isRefreshing;
  }
};

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
};
