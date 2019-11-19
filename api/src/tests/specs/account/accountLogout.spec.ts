import { expect } from 'chai';
import 'mocha';
import shortid from 'shortid';
import supertest from 'supertest';
import app from '../../../app';
import { User } from '../../../models';
import * as database from '../../../services/databaseService';
import entityFactory from '../../helpers/entityFactory';

const url: string = '/api/account/logout';
const refreshUrl: string = '/api/account/refresh';

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

describe('Account logout tests', () => {
  it('should remove refresh token from store', async () => {
    const userData = await login(existingUser);
    const refreshToken = userData.refreshToken;

    const response = await server.post(url).send({ refreshToken });
    expect(response.status).to.equal(200);

    const refreshResult = await server.post(refreshUrl)
      .send({
        email: userData.email,
        refreshToken
      });

    expect(refreshResult.status).to.equal(401);
  });

  it('should not throw error when no token is provided', async () => {
    const response = await server.post(url);
    expect(response.status).to.equal(200);
  });

  it('should not throw error when incorrect token is provided', async () => {
    const response = await server.post(url)
      .send({ refreshToken: shortid.generate() });
    expect(response.status).to.equal(200);
  });
});
