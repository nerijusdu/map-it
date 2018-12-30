import chai from 'chai';
import 'mocha';
import supertest from 'supertest';
import app from '../../app';
import * as database from '../../services/databaseService';
import '../helpers/requestType';

const expect = chai.expect;
const server = supertest.agent(app);
before(async () => {
  await database.initPromise;
});
after(async () => {
  await database.close();
});

describe('Account tests', () =>  {
  it('should create user account', (done) => {
    server
      .post('/account/register')
      .send({
        email: 'test@account.com',
        name: 'name',
        password: 'password'
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        done();
      });
  });
});
