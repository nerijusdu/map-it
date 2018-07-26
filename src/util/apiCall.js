import store from '@/store';
import { apiUrl } from './constants';

const defaultHeaders = new Headers({
  'Content-Type': 'application/json'
});

const appendToken = (headers) => {
  const token = store.getters['app/getToken'];
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
};

const parseResponse = res => res
  .json()
  .then(data => ({
    status: res.status,
    ok: res.ok,
    data
  }));

const handleErrors = (res) => {
  if (!res.ok) {
    console.log('error: ', res.data.message);
    return null;
  }
  return res;
};

export default (url, settings) => {
  const options = settings || {};
  const headers = options.headers || defaultHeaders;
  appendToken(headers);

  return fetch(`${apiUrl}${url}`, {
    ...options,
    headers
  })
    .then(parseResponse)
    .then(handleErrors)
    .catch((err) => {
      console.log('Unhandled error: ', err);
      return null;
    });
};
