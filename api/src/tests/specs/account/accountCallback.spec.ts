import { expect } from 'chai';
import mockfs from 'mock-fs';
import shortid from 'shortid';
import supertest from 'supertest';
import { ImportMock } from 'ts-mock-imports';
import app from '../../../app';
import { User } from '../../../models';
import * as database from '../../../services/util/databaseService';
import * as fetch from '../../../utils/fetch';
import entityFactory from '../../helpers/entityFactory';

const url: string = '/api/account/callback';

let fetchMock = ImportMock.mockFunction(fetch, 'default', { json: () => ({}) });
const mockFetch = (returns: any) => {
  fetchMock.restore();
  fetchMock = ImportMock.mockFunction(fetch, 'default', {
    json: () => returns
  });
};

let server: supertest.SuperTest<supertest.Test>;
let existingUser: User;
before(async () => {
  server = supertest.agent(app);
  await database.initPromise;
  existingUser = await entityFactory.createAccount();
});

after(async () => {
  mockfs.restore();
  await database.close();
});

describe('Google callback tests', () => {
  before(() => {
    fetchMock.restore();
    fetchMock = ImportMock.mockFunction(fetch, 'default', {
      json: () => ({ access_token: shortid.generate() })
    });
  });
  after(() => {
    fetchMock.restore();
  });

  it('should link google account with map-it account', async () => {
    const id = shortid.generate();

    mockFetch({ access_token: shortid.generate(), id });

    const response = await server.get(`${url}?state=${existingUser.id}`);
    expect(response.status).to.equal(302);

    const user = await database
      .connection()
      .manager
      .findOne(User, existingUser.id);

    expect(user!.uniqueIdentifier).to.equal(id);
  });

  it('should login with google', async () => {
    const id = shortid.generate();
    const user = await entityFactory.createAccount((x) => {
      x.uniqueIdentifier = id;
      return x;
    });

    mockFetch({ access_token: shortid.generate(), id });

    const response = await server.get(`${url}?state=0`);
    expect(response.status).to.equal(302);
    expect(response.header.location).to.be.string;

    const authCode = response.header.location.split('code=')[1];
    const updatedUser = await database
      .connection()
      .manager
      .findOne(User, user.id);

    expect(updatedUser!.authCode).to.equal(authCode);
  });

  it('should create an account with google', async () => {
    const id = shortid.generate();
    const email = shortid.generate();
    const name = shortid.generate();

    mockFetch({
      access_token: shortid.generate(),
      id, email, name
    });

    const response = await server.get(`${url}?state=0`);
    expect(response.status).to.equal(302);
    expect(response.header.location).to.be.string;

    const authCode = response.header.location.split('code=')[1];
    const newUser = await database
      .connection()
      .manager
      .findOne(User, { authCode });

    expect(newUser).to.exist;
    expect(newUser!.uniqueIdentifier).to.equal(id);
    expect(newUser!.name).to.equal(name);
    expect(newUser!.email).to.equal(email);
  });
});
