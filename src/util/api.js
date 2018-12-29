import apiCall from './apiCall';

export default {
  login(userInfo, options) {
    return apiCall('/account/login', {
      method: 'POST',
      body: JSON.stringify(userInfo)
    }, options);
  },
  getUserInfo(options) {
    return apiCall('/account/verify', options);
  },
  getRoadmapById(id, options) {
    return apiCall(`/roadmap/${id}`, options);
  },
  getRoadmaps(options) {
    return apiCall('/roadmap', options);
  },
  register(userInfo, options) {
    return apiCall('/account/register', {
      method: 'POST',
      body: JSON.stringify(userInfo)
    }, options);
  }
};
