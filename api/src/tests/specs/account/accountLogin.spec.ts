import chai from 'chai';
import 'mocha';
import supertest from 'supertest';
import app from '../../../app';
import { User } from '../../../models';
import resources from '../../../resources';
import * as database from '../../../services/databaseService';
import entityFactory from '../../helpers/entityFactory';

chai.should();

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

describe('Account login tests', () => {
  it('should login to existing account', async () => {
    const response = await server
      .post('/api/account/login')
      .send({
        email: existingUser.email,
        password: entityFactory.defaultPassword
      });

    response.status.should.equal(200);
    response.body.email.should.equal(existingUser.email);
    response.body.token.should.be.a('string');
  });

  it('should fail when email is incorrect', async () => {
    const response = await server
      .post('/api/account/login')
      .send({
        email: 'a' + existingUser.email,
        password: entityFactory.defaultPassword
      });

    response.status.should.equal(400);
    response.body.message.should.equal(resources.Login_EmailIncorrect);
  });

  it('should fail when password is incorrect', async () => {
    const response = await server
      .post('/api/account/login')
      .send({
        email: existingUser.email,
        password: 'a' + entityFactory.defaultPassword
      });

    response.status.should.equal(400);
    response.body.message.should.equal(resources.Login_PasswordIncorrect);
  });
});
