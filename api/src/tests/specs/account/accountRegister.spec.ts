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
before(async () => {
  server = supertest.agent(app);
  await database.initPromise;
});
after(async () => {
  await database.close();
});

describe('Account registration tests', () =>  {
  it('should create user account', (done) => {
    const user = {
      email: 'test@account.com',
      name: 'name',
      password: 'password'
    };

    server
      .post('/account/register')
      .send(user)
      .then((res) => {
        res.status.should.equal(200);
      })
      .then(() => database.connection().manager.findOne(User, {
        email: user.email,
        name: user.name
      }))
      .then((createdUser) => {
        chai.should().exist(createdUser);
        return createdUser!.comparePasswords(user.password);
      })
      .then((pass) => {
        pass.should.equal(true);
      })
      .finally(() => done());
  });

  it('should validate user data correctly', (done) => {
    server
      .post('/account/register')
      .then((res) => {
        res.status.should.equal(400);
        res.body.message.should.equal(resources.Generic_ValidationError);
        res.body.data.should.be.an('array');

        const emailErrors = res.body.data.find((x: any) => x.property === 'email');
        chai.should().exist(emailErrors);
        emailErrors.errors.should.have.lengthOf(2);

        const nameErrors = res.body.data.find((x: any) => x.property === 'name');
        chai.should().exist(nameErrors);
        nameErrors.errors.should.have.lengthOf(2);

        const passwordErrors = res.body.data.find((x: any) => x.property === 'password');
        chai.should().exist(passwordErrors);
        passwordErrors.errors.should.have.lengthOf(2);
      })
      .finally(() => done());
  });

  it('should not create account with existing email', (done) => {
    const user = {
      email: '',
      name: 'name',
      password: 'password'
    };

    entityFactory
      .createAccount()
      .then((existingUser) => {
        user.email = existingUser.email;

        return server.post('/account/register').send(user);
      })
      .then((res) => {
        res.status.should.equal(400);
        res.body.message.should.equal(resources.Registration_EmailExists);
      })
      .finally(() => done());
  });
});
