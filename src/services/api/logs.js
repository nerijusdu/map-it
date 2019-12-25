import apiCall from './apiCall';
import qs from './qs';

export default {
  getLogs(params, options) {
    return apiCall(`/logs?${qs(params)}`, {}, options);
  },
  getLogById(logId, options) {
    return apiCall(`/logs/${logId}`, {}, options);
  }
};
