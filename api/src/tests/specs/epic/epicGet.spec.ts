import { expect } from 'chai';
import 'mocha';
import supertest from 'supertest';
import app from '../../../app';
import { Epic, User } from '../../../models';
import resources from '../../../resources';
import * as database from '../../../services/databaseService';
import entityFactory from '../../helpers/entityFactory';

const url: string = '/api/epics';

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

describe('Epic get all tests', () => {
  it('should get epics for user', async () => {
    const usersRoadmap = await entityFactory.createRoadmap(user.id);
    const usersEpic = await entityFactory.createEpic(usersRoadmap.id);
    const differentUser = await entityFactory.createAccount();
    const differentRoadmap = await entityFactory.createRoadmap(differentUser.id);
    await entityFactory.createEpic(differentRoadmap.id);

    const response = await server.get(url).set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
    expect(response.body.length).to.equal(1);

    const epic = response.body[0] as Epic;
    expect(epic.id).to.equal(usersEpic.id);
  });
});

describe('Epic get by id tests', () => {
  it('should get epic by id', async () => {
    const usersRoadmap = await entityFactory.createRoadmap(user.id);
    const usersEpic = await entityFactory.createEpic(usersRoadmap.id);

    const response = await server.get(`${url}/${usersEpic.id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(200);
    const epic = response.body as Epic;
    expect(epic.id).to.equal(usersEpic.id);
    expect(epic.roadmapId).to.equal(usersEpic.roadmapId);
    expect(epic.userId).to.equal(usersEpic.userId);
    expect(epic.title).to.equal(usersEpic.title);
    expect(epic.color).to.equal(usersEpic.color);
    expect(epic.roadmap).to.exist;
    expect(epic.roadmap.id).to.equal(usersRoadmap.id);
  });

  it('should fail when epic belongs to another user', async () => {
    const differentUser = await entityFactory.createAccount();
    const differentRoadmap = await entityFactory.createRoadmap(differentUser.id);
    const differentEpic = await entityFactory.createEpic(differentRoadmap.id);

    const response = await server
      .get(`${url}/${differentEpic.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal(resources.Generic_EntityNotFound(Epic.name));
  });

  it('should fail when epic does not exist', async () => {
    const response = await server.get(`${url}/-1`).set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal(resources.Generic_EntityNotFound(Epic.name));
  });
});
