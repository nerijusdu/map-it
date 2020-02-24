import webpush from 'web-push';
import { vapidKeys } from '../config';
import { HttpError, User, UserNotification } from '../models';
import { connection } from './util/databaseService';

webpush.setVapidDetails(
  'mailto:test@test.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

class NotificationService {
  constructor(private user?: User) {}

  public async subscribe(subscription: webpush.PushSubscription) {
    if (!this.user) {
      throw new HttpError('Not logged in.', 400);
    }

    const userNotification = await connection()
      .manager
      .findOne(UserNotification, { where: {
        userId: this.user.id,
        endpoint: subscription.endpoint,
        p256dhKey: subscription.keys.p256dh,
        authKey: subscription.keys.auth
      }});

    if (userNotification) {
      return;
    }

    const newUserNotification = new UserNotification();
    newUserNotification.userId = this.user.id;
    newUserNotification.endpoint = subscription.endpoint;
    newUserNotification.p256dhKey = subscription.keys.p256dh;
    newUserNotification.authKey = subscription.keys.auth;

    await connection().manager.save(newUserNotification);
  }

  public async unsubscribe(subscription: webpush.PushSubscription) {
    await connection().manager.delete(UserNotification, {
      endpoint: subscription.endpoint,
      p256dhKey: subscription.keys.p256dh,
      authKey: subscription.keys.auth
    });
  }

  public async sendNotification(userId: number, payload: INotificationPayload) {
    const userNotifications = await connection()
      .manager
      .find(UserNotification, { where: { userId }});

    if (!userNotifications) {
      return false;
    }

    userNotifications.forEach(un =>
      webpush.sendNotification({
        endpoint: un.endpoint,
        keys: {
          p256dh: un.p256dhKey,
          auth: un.authKey
        }
      }, JSON.stringify(payload))
    );

    return true;
  }
}

interface INotificationPayload {
  title: string;
  body?: string;
  url?: string;
}

export default (user?: User) => new NotificationService(user);
