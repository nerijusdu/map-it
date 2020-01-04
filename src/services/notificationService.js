import api from './api';
import { publicVapidKey } from '../constants';

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    // eslint-disable-next-line no-useless-escape
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const subscribe = async (subscription) => {
  window.localStorage.removeItem('pushNotificationSubscription');

  await api.subscribeToNotifications(subscription, {
    ignoreLoading: true,
    errorHandler: (res, defaultErrorHandler) => {
      if (res.status === 401) {
        window.localStorage.setItem('pushNotificationSubscription', JSON.stringify(subscription));
        return null;
      }

      return defaultErrorHandler(res);
    }
  });
};

const setupPushNotifications = async (workerRegister) => {
  const subscription = await workerRegister.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  });

  await subscribe(subscription);
};

export default {
  setupPushNotifications,
  subscribe
};
