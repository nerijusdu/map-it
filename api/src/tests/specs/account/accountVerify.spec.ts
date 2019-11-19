import { expect } from 'chai';
import 'mocha';
import supertest from 'supertest';
import app from '../../../app';
import * as database from '../../../services/databaseService';
import entityFactory from '../../helpers/entityFactory';

const url: string = '/api/account/verify';

let server: supertest.SuperTest<supertest.Test>;
before(async () => {
  server = supertest.agent(app);
  await database.initPromise;
});
after(async () => {
  await database.close();
});

describe('Account verify tests', () => {
  it('should verify token', async () => {
    const user = await entityFactory.createAccount();
    const token = entityFactory.loginWithAccount(user).token;

    const response = await server.get(url).set('Authorization', `Bearer ${token}`);

    expect(response.status).to.equal(200);
    expect(response.body.email).to.equal(user.email);
    expect(response.body.token).to.equal(token);
  });

  it('should fail with incorrect token', async () => {
    const response = await server.get(url).set('Authorization', 'Bearer someRandom.Incorrect.Token');
    expect(response.status).to.equal(401);
  });
});
