import chai from 'chai';
import 'mocha';
import supertest from 'supertest';
import app from '../../../app';
import { Roadmap, User } from '../../../models';
import resources from '../../../resources';
import * as database from '../../../services/databaseService';
import entityFactory from '../../helpers/entityFactory';
import '../../helpers/requestType';

chai.should();

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

describe('Roadmap get all tests', () => {
  it('should get roadmaps for user', async () => {
    const usersRoadmap = await entityFactory.createRoadmap(user.id);
    const differentUser = await entityFactory.createAccount();
    await entityFactory.createRoadmap(differentUser.id);

    const response = await server.get('/roadmaps').set('Authorization', `Bearer ${token}`);
    response.status.should.equal(200);
    response.body.should.be.an('array');
    response.body.length.should.equal(1);

    const roadmap = response.body[0] as Roadmap;
    roadmap.id.should.equal(usersRoadmap.id);
  });
});

describe('Roadmap get by id tests', () => {
  it('should get roadmap by id', async () => {
    const usersRoadmap = await entityFactory.createRoadmap(user.id);

    const response = await server.get(`/roadmaps/${usersRoadmap.id}`).set('Authorization', `Bearer ${token}`);
    response.status.should.equal(200);
    const roadmap = response.body as Roadmap;
    roadmap.id.should.equal(usersRoadmap.id);
    roadmap.userId.should.equal(usersRoadmap.userId);
    roadmap.title.should.equal(usersRoadmap.title);
    roadmap.description.should.equal(usersRoadmap.description);
    roadmap.startDate.should.equal(usersRoadmap.startDate.toISOString());
    roadmap.endDate.should.equal(usersRoadmap.endDate.toISOString());
  });

  it('should get roadmap with categories by id', async () => {
    const roadmap = await entityFactory.createRoadmap(user.id);
    const category = await entityFactory.createCategory(roadmap.id);
    const differentRoadmap = await entityFactory.createRoadmap(user.id);
    await entityFactory.createCategory(differentRoadmap.id);

    const response = await server.get(`/roadmaps/${roadmap.id}`).set('Authorization', `Bearer ${token}`);
    response.status.should.equal(200);
    const fetchedRoadmap = response.body as Roadmap;
    fetchedRoadmap.categories.should.be.an('array');
    fetchedRoadmap.categories.length.should.equal(1);
    fetchedRoadmap.categories[0].id.should.equal(category.id);
  });

  it('should get roadmap with tasks by id', async () => {
    const roadmap = await entityFactory.createRoadmap(user.id);
    await entityFactory.createCategory(roadmap.id);
    const task = await entityFactory.createTask(roadmap.id);
    const differentRoadmap = await entityFactory.createRoadmap(user.id);
    await entityFactory.createCategory(differentRoadmap.id);
    await entityFactory.createTask(differentRoadmap.id);

    const response = await server.get(`/roadmaps/${roadmap.id}`).set('Authorization', `Bearer ${token}`);
    response.status.should.equal(200);
    const fetchedRoadmap = response.body as Roadmap;
    fetchedRoadmap.tasks.should.be.an('array');
    fetchedRoadmap.tasks.length.should.equal(1);
    fetchedRoadmap.tasks[0].id.should.equal(task.id);
  });

  it('should fail when roadmap belongs to another user', async () => {
    const differentUser = await entityFactory.createAccount();
    const differentRoadmap = await entityFactory.createRoadmap(differentUser.id);

    const response = await server.get(`/roadmaps/${differentRoadmap.id}`).set('Authorization', `Bearer ${token}`);
    response.status.should.equal(400);
    response.body.message.should.equal(resources.Generic_EntityNotFound(Roadmap.name));
  });

  it('should fail when roadmap does not exist', async () => {
    const response = await server.get('/roadmaps/-1').set('Authorization', `Bearer ${token}`);
    response.status.should.equal(400);
    response.body.message.should.equal(resources.Generic_EntityNotFound(Roadmap.name));
  });
});
