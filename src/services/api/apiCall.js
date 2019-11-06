import moment from 'moment';
import store from '../../store';
import router from '../../router';
import { apiUrl } from '../../constants';

export class ApiCall {
  constructor(_store) {
    this.store = _store || store;
  }

  defaultHeaders = () => new Headers({
    'Content-Type': 'application/json'
  })

  call = async (url, requestSettings, options) => {
    // eslint-disable-next-line
    options = options || {};
    // eslint-disable-next-line
    requestSettings = requestSettings || {};
    const headers = requestSettings.headers || this.defaultHeaders();

    if (!options.ignoreLoading) {
      this.store.commit('app/mToggleLoading', true);
    }

    await this.appendToken(headers, options);

    return fetch(`${apiUrl}${url}`, {
      ...requestSettings,
      headers
    })
      .then(this.parseResponse)
      .then(this.handleErrors)
      .catch((err) => {
        this.store.dispatch('app/showError', 'Something went wrong!');
        console.error(err);
        return null;
      })
      .finally(() => {
        if (!options.ignoreLoading) {
          this.store.commit('app/mToggleLoading', false);
        }
      });
  }

  appendToken = async (headers, options) => {
    if (options.ignoreAuth) {
      return;
    }

    const token = await this.store.dispatch('app/getToken');
    const expiresAt = moment(this.store.state.app.user.expiresAt);
    if (token && expiresAt && expiresAt.isAfter(moment(), 'second')) {
      headers.set('Authorization', `Bearer ${token}`);
      return;
    }

    const newToken = await this.store.dispatch('app/refreshToken');
    if (newToken) {
      headers.set('Authorization', `Bearer ${newToken}`);
    }
  }

  parseResponse = res => res.json()
    .then(data => ({
      status: res.status,
      ok: res.ok,
      data
    }))

  handleErrors = (res) => {
    if (!res.ok) {
      this.store.dispatch('app/showError', res.data.message);
      if (res.status === 401) {
        this.store.dispatch('app/logout', router);
      }
      return null;
    }
    return res;
  }
}

const instance = new ApiCall(store);

export default instance.call;
