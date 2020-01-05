import apiCall from './apiCall';

export default {
  subscribeToNotifications(subscription, options) {
    return apiCall('/notifications/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription)
    }, options);
  },
  unsubscribeFromNotifications(subscription, options) {
    return apiCall('/notifications/unsubscribe', {
      method: 'POST',
      body: JSON.stringify(subscription)
    }, options);
  }
};
