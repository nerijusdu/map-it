import webpush from 'web-push';
import { vapidKeys } from '../config';
import { HttpError, User, UserNotification } from '../models';
import { connection } from './databaseService';

webpush.setVapidDetails(
  'mailto:test@test.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

class NotificationService {
  constructor(private user?: User) {}

  public async subscribe(subscription: webpush.PushSubscription) {
    if (!this.user) {
      throw new HttpError('Not logged in.', 400, { retryAfterLogin: true });
    }

    // TODO: support multiple subscriptions
    let userNotification = await connection()
      .manager
      .findOne(UserNotification, { where: { userId: this.user.id }});

    if (!userNotification) {
      userNotification = new UserNotification();
      userNotification.userId = this.user.id;
    }

    userNotification.endpoint = subscription.endpoint;
    userNotification.p256dhKey = subscription.keys.p256dh;
    userNotification.authKey = subscription.keys.auth;

    connection().manager.save(userNotification);
  }

  public async sendNotification(userId: number, payload: INotificationPayload) {
    const userNotification = await connection()
      .manager
      .findOne(UserNotification, { where: { userId }});

    if (!userNotification) {
      return false;
    }

    await webpush.sendNotification({
      endpoint: userNotification.endpoint,
      keys: {
        p256dh: userNotification.p256dhKey,
        auth: userNotification.authKey
      }
    }, JSON.stringify(payload));

    return true;
  }
}

interface INotificationPayload {
  title: string;
  body?: string;
  url?: string;
}

export default (user?: User) => new NotificationService(user);
