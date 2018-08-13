import store from '@/store';
import { apiUrl } from './constants';

export class ApiCall {
  constructor(_store) {
    this.store = _store || store;
  }

  defaultHeaders = new Headers({
    'Content-Type': 'application/json'
  })

  call = (url, settings) => {
    const options = settings || {};
    const headers = options.headers || this.defaultHeaders;
    this.appendToken(headers);

    return fetch(`${apiUrl}${url}`, {
      ...options,
      headers
    })
      .then(this.parseResponse)
      .then(this.handleErrors)
      .catch((err) => {
        console.warn('Unhandled error: ', err);
        return null;
      });
  }

  appendToken = (headers) => {
    const token = this.store.getters['app/getToken'];
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
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
      console.warn('error: ', res.data.message);
      return null;
    }
    return res;
  }
}

const instance = new ApiCall(store);

export default instance.call;
