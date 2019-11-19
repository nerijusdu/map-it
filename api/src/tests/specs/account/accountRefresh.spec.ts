import { expect } from 'chai';
import 'mocha';
import supertest from 'supertest';
import app from '../../../app';
import { User } from '../../../models';
import * as database from '../../../services/databaseService';
import entityFactory from '../../helpers/entityFactory';

const url: string = '/api/account/refresh';
let server: supertest.SuperTest<supertest.Test>;
let existingUser: User;
before(async () => {
  server = supertest.agent(app);
  await database.initPromise;
  existingUser = await entityFactory.createAccount();
});
after(async () => {
  await database.close();
});

const login = async (user: User) => {
  const result = await server.post('/api/account/login')
  .send({
    email: user.email,
    password: entityFactory.defaultPassword
  });

  return result.body;
};

describe('Account refresh tests', () => {
  it('should refresh token', async () => {
    const userData = await login(existingUser);

    const response = await server.post(url)
      .send({
        email: userData.email,
        refreshToken: userData.refreshToken
      });

    expect(response.status).to.equal(200);
    expect(response.body.email).to.equal(userData.email);
    expect(response.body.refreshToken).to.exist;
    expect(response.body.expiresAt).to.exist;
    expect(response.body.token).to.exist;
  });

  it('should remove old refresh token', async () => {
    const userData = await login(existingUser);
    await server.post(url)
      .send({
        email: userData.email,
        refreshToken: userData.refreshToken
      });

    const response = await server.post(url)
      .send({
        email: userData.email,
        refreshToken: userData.refreshToken
      });

    expect(response.status).to.equal(401);
  });

  it('should return valid token', async () => {
    const userData = await login(existingUser);

    const response = await server.post(url)
      .send({
        email: userData.email,
        refreshToken: userData.refreshToken
      });

    const verification = await server.get('/api/account/verify')
      .set('Authorization', `Bearer ${response.body.token}`);

    expect(verification.status).to.equal(200);
    expect(verification.body.email).to.equal(userData.email);
    expect(verification.body.token).to.equal(response.body.token);
  });

  it('should fail when user is deleted', async () => {
    const user = await entityFactory.createAccount();
    const userData = await login(user);
    await database.connection().manager.delete(User, { id: user.id });

    const response = await server.post(url)
      .send({
        email: userData.email,
        refreshToken: userData.refreshToken
      });

    expect(response.status).to.equal(400);
  });
});
