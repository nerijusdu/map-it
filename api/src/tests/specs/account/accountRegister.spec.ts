import { expect } from 'chai';
import 'mocha';
import supertest from 'supertest';
import app from '../../../app';
import { User } from '../../../models';
import resources from '../../../resources';
import * as database from '../../../services/databaseService';
import entityFactory from '../../helpers/entityFactory';

const url: string = '/api/account/register';

let server: supertest.SuperTest<supertest.Test>;
before(async () => {
  server = supertest.agent(app);
  await database.initPromise;
});
after(async () => {
  await database.close();
});

describe('Account registration tests', () =>  {
  it('should create user account', async () => {
    const user = {
      email: 'test@account.com',
      name: 'name',
      password: 'password'
    };

    const response = await server
      .post(url)
      .send(user);

    expect(response.status).to.equal(200);
    const createdUser =  await database
      .connection()
      .manager
      .findOne(User, {
        email: user.email,
        name: user.name
      });

    expect(createdUser).to.exist;
    const passCorrect = await createdUser!.comparePasswords(user.password);
    expect(passCorrect).to.equal(true);
  });

  it('should validate user data correctly', async () => {
    const response = await server.post(url);

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal(resources.Generic_ValidationError);
    expect(response.body.data).to.be.an('array');

    const emailErrors = response.body.data.find((x: any) => x.property === 'email');
    expect(emailErrors).to.exist;
    expect(emailErrors.errors).to.have.lengthOf(2);

    const nameErrors = response.body.data.find((x: any) => x.property === 'name');
    expect(nameErrors).to.exist;
    expect(nameErrors.errors).to.have.lengthOf(2);

    const passwordErrors = response.body.data.find((x: any) => x.property === 'password');
    expect(passwordErrors).to.exist;
    expect(passwordErrors.errors).to.have.lengthOf(2);
  });

  it('should not create account with existing email', async () => {
    const user = {
      email: '',
      name: 'name',
      password: 'password'
    };

    const existingUser = await entityFactory.createAccount();
    user.email = existingUser.email;

    const response = await server.post(url).send(user);

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal(resources.Registration_EmailExists);
  });
});
