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
  register(userInfo, options) {
    return apiCall('/account/register', {
      method: 'POST',
      body: JSON.stringify(userInfo)
    }, options);
  }
};
