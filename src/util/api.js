import apiCall from './apiCall';

export default {
  login(userInfo) {
    return apiCall('/account/login', {
      method: 'POST',
      body: JSON.stringify(userInfo)
    });
  },
  getUserInfo() {
    return apiCall('/account/verify');
  }
};
