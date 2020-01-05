import { expect } from 'chai';
import 'mocha';
import shortid from 'shortid';
import supertest from 'supertest';
import app from '../../../app';
import { User, UserNotification } from '../../../models';
import * as database from '../../../services/util/databaseService';
import entityFactory from '../../helpers/entityFactory';

const url: string = '/api/notifications';

let server: supertest.SuperTest<supertest.Test>;
let user: User;
let token: string;
before(async () => {
  server = supertest.agent(app);
  await database.initPromise;
  user = await entityFactory.createAccount();
  token = entityFactory.loginWithAccount(user).token;
});
after(async () => {
  await database.close();
});

describe('Notification post tests', () => {
  it('should subscribe to notifications', async () => {
    const subscription = {
      endpoint: shortid.generate(),
      keys: {
        auth: shortid.generate(),
        p256dh: shortid.generate()
      }
    };

    const response = await server
      .post(`${url}/subscribe`)
      .set('Authorization', `Bearer ${token}`)
      .send(subscription);
    expect(response.status).to.equal(200);

    const createdEntity = await database.connection()
      .manager
      .findOne(UserNotification, { where: {
        userId: user.id,
        endpoint: subscription.endpoint,
        p256dhKey: subscription.keys.p256dh,
        authKey: subscription.keys.auth
      }});

    expect(createdEntity).to.exist;
  });

  it('should not create duplicate subscription', async () => {
    const existingSubscription = await entityFactory
      .createNotificationSubscription(user.id);
    const subscription = {
      endpoint: existingSubscription.endpoint,
      keys: {
        auth: existingSubscription.authKey,
        p256dh: existingSubscription.p256dhKey
      }
    };

    const response = await server
      .post(`${url}/subscribe`)
      .set('Authorization', `Bearer ${token}`)
      .send(subscription);
    expect(response.status).to.equal(200);

    const count = await database.connection()
      .manager
      .count(UserNotification, { where: {
        userId: user.id,
        endpoint: subscription.endpoint,
        p256dhKey: subscription.keys.p256dh,
        authKey: subscription.keys.auth
      }});

    expect(count).to.be.equal(1);
  });

  it('should unsubscribe from notifications', async () => {
    const existingSubscription = await entityFactory
      .createNotificationSubscription(user.id);
    const subscription = {
      endpoint: existingSubscription.endpoint,
      keys: {
        auth: existingSubscription.authKey,
        p256dh: existingSubscription.p256dhKey
      }
    };

    const response = await server
      .post(`${url}/unsubscribe`)
      .set('Authorization', `Bearer ${token}`)
      .send(subscription);
    expect(response.status).to.equal(200);

    const subscriptionEntity = await database.connection()
      .manager
      .findOne(UserNotification, { where: {
        userId: user.id,
        endpoint: subscription.endpoint,
        p256dhKey: subscription.keys.p256dh,
        authKey: subscription.keys.auth
      }});

    expect(subscriptionEntity).to.not.exist;
  });

  it('should not throw error when subscription is not found', async () => {
    const subscription = {
      endpoint: shortid.generate(),
      keys: {
        auth: shortid.generate(),
        p256dh: shortid.generate()
      }
    };

    const response = await server
      .post(`${url}/unsubscribe`)
      .set('Authorization', `Bearer ${token}`)
      .send(subscription);
    expect(response.status).to.equal(200);
  });
});
