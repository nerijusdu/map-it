import apiCall from './apiCall';
import qs from './qs';

export default {
  getLogs(params, options) {
    return apiCall(`/logs?${qs(params)}`, {
      method: 'GET',
      query: params
    }, options);
  }
};
