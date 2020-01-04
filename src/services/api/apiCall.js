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
      .then(res => this.handleErrors(res, options))
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
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  parseResponse = res => res.json()
    .then(data => ({
      statusText: res.statusText,
      status: res.status,
      ok: res.ok,
      data
    }))

  defaultErrorHandler = (res) => {
    this.store.dispatch('app/showError', res.data.message);
    if (res.status === 401) {
      this.store.dispatch('app/logout', router);
    }
    return null;
  }

  handleErrors = (res, options) => {
    if (!res.ok) {
      if (options.errorHandler) {
        return options.errorHandler(res, this.defaultErrorHandler);
      }

      return this.defaultErrorHandler(res);
    }
    if (res.statusText === 'CACHED' && this.store.state.app.isOnline) {
      this.store.dispatch('app/toggleOnline', false);
    }
    if (res.statusText === 'OK' && !this.store.state.app.isOnline) {
      this.store.dispatch('app/toggleOnline', true);
    }
    return res;
  }
}

const instance = new ApiCall(store);

export default instance.call;
