import chai from 'chai';
import 'mocha';
import supertest from 'supertest';
import app from '../../../app';
import { User } from '../../../models';
import resources from '../../../resources';
import * as database from '../../../services/databaseService';
import entityFactory from '../../helpers/entityFactory';
import '../../helpers/requestType';

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
  it('should login to existing account', (done) => {
    server
      .post('/account/login')
      .send({
        email: existingUser.email,
        password: entityFactory.defaultPassword
      })
      .then((res) => {
        res.status.should.equal(200);
        res.body.email.should.equal(existingUser.email);
        res.body.token.should.be.a('string');
      })
      .finally(() => done());
  });

  it('should fail when email is incorrect', (done) => {
    server
      .post('/account/login')
      .send({
        email: 'a' + existingUser.email,
        password: entityFactory.defaultPassword
      })
      .then((res) => {
        res.status.should.equal(400);
        res.body.message.should.equal(resources.Login_EmailIncorrect);
      })
      .finally(() => done());
  });

  it('should fail when password is incorrect', (done) => {
    server
      .post('/account/login')
      .send({
        email: existingUser.email,
        password: 'a' + entityFactory.defaultPassword
      })
      .then((res) => {
        res.status.should.equal(400);
        res.body.message.should.equal(resources.Login_PasswordIncorrect);
      })
      .finally(() => done());
  });
});
