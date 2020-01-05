import { expect } from 'chai';
import 'mocha';
import shortid from 'shortid';
import supertest from 'supertest';
import app from '../../../app';
import { User } from '../../../models';
import * as database from '../../../services/util/databaseService';
import entityFactory from '../../helpers/entityFactory';

const url: string = '/api/users';

let server: supertest.SuperTest<supertest.Test>;
let user: User;
let token: string;
before(async () => {
  server = supertest.agent(app);
  await database.initPromise;
  user = await entityFactory.createAccount();
  token = entityFactory.loginWithAccount(user).token;
});
after(async () => {
  await database.close();
});

describe('Users get tests', () => {
  it('should fetch users filtering by email and name', async () => {
    const prefix = shortid.generate();
    const user1 = await entityFactory.createAccount((x) => {
      x.name = prefix + shortid.generate();
      return x;
    });
    const user2 = await entityFactory.createAccount((x) => {
      x.email = prefix + shortid.generate();
      return x;
    });
    const user3 = await entityFactory.createAccount((x) => {
      // Only search in start of the string
      x.name = shortid.generate() + prefix;
      return x;
    });

    const response = await server
      .get(`${url}?searchTerm=${prefix}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.exist;
    expect(response.body).to.be.an('array');
    expect(response.body.length).to.equal(2);
    expect(response.body.find((x: User) => x.id === user1.id)).to.exist;
    expect(response.body.find((x: User) => x.id === user2.id)).to.exist;
    expect(response.body.find((x: User) => x.id === user3.id)).to.not.exist;
  });
});
