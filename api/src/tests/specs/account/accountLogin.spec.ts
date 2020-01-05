import { expect } from 'chai';
import 'mocha';
import supertest from 'supertest';
import app from '../../../app';
import { User } from '../../../models';
import resources from '../../../resources';
import * as database from '../../../services/util/databaseService';
import entityFactory from '../../helpers/entityFactory';

const url: string = '/api/account/login';

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
    const response = await server.post(url)
      .send({
        email: existingUser.email,
        password: entityFactory.defaultPassword
      });

    expect(response.status).to.equal(200);
    expect(response.body.email).to.equal(existingUser.email);
    expect(response.body.token).to.be.a('string');
  });

  it('should fail when email is incorrect', async () => {
    const response = await server.post(url)
      .send({
        email: 'a' + existingUser.email,
        password: entityFactory.defaultPassword
      });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal(resources.Login_EmailIncorrect);
  });

  it('should fail when password is incorrect', async () => {
    const response = await server.post(url)
      .send({
        email: existingUser.email,
        password: 'a' + entityFactory.defaultPassword
      });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal(resources.Login_PasswordIncorrect);
  });
});
