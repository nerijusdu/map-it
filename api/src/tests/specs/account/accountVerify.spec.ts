import chai from 'chai';
import 'mocha';
import supertest from 'supertest';
import app from '../../../app';
import * as database from '../../../services/databaseService';
import entityFactory from '../../helpers/entityFactory';

chai.should();

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

    const response = await server.get('/account/verify').set('Authorization', `Bearer ${token}`);

    response.status.should.equal(200);
    response.body.email.should.equal(user.email);
    response.body.token.should.equal(token);
  });

  it('should fail with incorrect token', async () => {
    const response = await server.get('/account/verify').set('Authorization', 'Bearer someRandom.Incorrect.Token');
    response.status.should.equal(401);
  });
});
