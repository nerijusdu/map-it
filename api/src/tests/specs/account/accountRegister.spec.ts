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
      .post('/account/register')
      .send(user);

    response.status.should.equal(200);
    const createdUser =  await database
      .connection()
      .manager
      .findOne(User, {
        email: user.email,
        name: user.name
      });

    chai.should().exist(createdUser);
    const passCorrect = await createdUser!.comparePasswords(user.password);
    passCorrect.should.equal(true);
  });

  it('should validate user data correctly', async () => {
    const response = await server.post('/account/register');

    response.status.should.equal(400);
    response.body.message.should.equal(resources.Generic_ValidationError);
    response.body.data.should.be.an('array');

    const emailErrors = response.body.data.find((x: any) => x.property === 'email');
    chai.should().exist(emailErrors);
    emailErrors.errors.should.have.lengthOf(2);

    const nameErrors = response.body.data.find((x: any) => x.property === 'name');
    chai.should().exist(nameErrors);
    nameErrors.errors.should.have.lengthOf(2);

    const passwordErrors = response.body.data.find((x: any) => x.property === 'password');
    chai.should().exist(passwordErrors);
    passwordErrors.errors.should.have.lengthOf(2);
  });

  it('should not create account with existing email', async () => {
    const user = {
      email: '',
      name: 'name',
      password: 'password'
    };

    const existingUser = await entityFactory.createAccount();
    user.email = existingUser.email;

    const response = await server.post('/account/register').send(user);

    response.status.should.equal(400);
    response.body.message.should.equal(resources.Registration_EmailExists);
  });
});
