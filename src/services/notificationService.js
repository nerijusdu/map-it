import api from './api';
import { publicVapidKey } from '../constants';

let registration;
const noVapidKey = !publicVapidKey || publicVapidKey === 'undefined';

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

const subscribe = subscription => api.subscribeToNotifications(subscription, {
  ignoreLoading: true,
  errorHandler: (res, defaultErrorHandler) => res.status === 401 ? null : defaultErrorHandler(res)
});

const setupPushNotifications = async (workerRegister) => {
  if (noVapidKey) return;
  if (!registration) {
    registration = workerRegister;
  }

  const subscription = await workerRegister.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  });

  await subscribe(subscription);
};

const onLogin = async () => {
  if (!registration || noVapidKey) return;

  const state = await registration.pushManager.permissionState({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  });
  if (state === 'granted') {
    await setupPushNotifications(registration);
  }
};

const onLogout = async () => {
  if (!registration || noVapidKey) return;

  const state = await registration.pushManager.permissionState({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  });
  const subscription = await registration.pushManager.getSubscription();
  if (state === 'granted' && subscription) {
    await api.unsubscribeFromNotifications(subscription, { ignoreLoading: true });
  }
};

export default {
  setupPushNotifications,
  onLogin,
  onLogout
};
