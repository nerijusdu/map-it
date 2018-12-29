import { errorTime } from '@/util/constants';
import router from '@/router';

const initialState = {
  user: {
    token: null,
    email: null
  },
  isLoading: false,
  message: {
    text: '',
    isError: false
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
  }
};

export default {
  namespaced: true,
  state: initialState,
  getters,
  actions,
  mutations
};
