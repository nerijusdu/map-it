import apiCall from './apiCall';

export default {
  login(userInfo, options) {
    return apiCall('/account/login', {
      method: 'POST',
      body: JSON.stringify(userInfo)
    }, options);
  },
  getUserInfo(options) {
    return apiCall('/account/verify', {}, options);
  },
  register(userInfo, options) {
    return apiCall('/account/register', {
      method: 'POST',
      body: JSON.stringify(userInfo)
    }, options);
  },
  refreshToken(userInfo, options) {
    return apiCall('/account/refresh', {
      method: 'POST',
      body: JSON.stringify(userInfo)
    }, {
      ignoreAuth: true,
      ignoreLoading: true,
      ...options
    });
  },
  logout(refreshToken, email, options) {
    return apiCall('/account/logout', {
      method: 'POST',
      body: JSON.stringify({
        refreshToken,
        email
      })
    }, {
      ...options,
      ignoreAuth: true
    });
  },
  getSettings(options) {
    return apiCall('/account/settings', {}, options);
  }
};
