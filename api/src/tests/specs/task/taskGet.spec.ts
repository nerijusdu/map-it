import chai from 'chai';
import 'mocha';
import supertest from 'supertest';
import app from '../../../app';
import { Category, Roadmap, Task, User } from '../../../models';
import resources from '../../../resources';
import * as database from '../../../services/databaseService';
import entityFactory from '../../helpers/entityFactory';

chai.should();

let server: supertest.SuperTest<supertest.Test>;
let user: User;
let roadmap: Roadmap;
let category: Category;
let token: string;
before(async () => {
  server = supertest.agent(app);
  await database.initPromise;
  user = await entityFactory.createAccount();
  roadmap = await entityFactory.createRoadmap(user.id);
  category = await entityFactory.createCategory(roadmap.id);
  token = entityFactory.loginWithAccount(user).token;
});
after(async () => {
  await database.close();
});

describe('Task get all tests', () => {
  it('should get tasks for user', async () => {
    const usersTask = await entityFactory.createTask(roadmap.id);
    const differentUser = await entityFactory.createAccount();
    const differentRoadmap = await entityFactory.createRoadmap(differentUser.id);
    await entityFactory.createCategory(differentRoadmap.id);
    await entityFactory.createTask(differentRoadmap.id);

    const response = await server.get('/api/tasks').set('Authorization', `Bearer ${token}`);
    response.status.should.equal(200);
    response.body.should.be.an('array');
    response.body.length.should.equal(1);

    const task = response.body[0] as Task;
    task.id.should.equal(usersTask.id);
  });
});

describe('Task get by id tests', () => {
  it('should get task by id', async () => {
    const usersTask = await entityFactory.createTask(roadmap.id);

    const response = await server.get(`/api/tasks/${usersTask.id}`).set('Authorization', `Bearer ${token}`);
    response.status.should.equal(200);

    const task = response.body as Task;
    task.id.should.equal(usersTask.id);
    task.title.should.equal(usersTask.title);
    task.description.should.equal(usersTask.description);
    task.startDate.should.equal(usersTask.startDate.toISOString());
    task.endDate.should.equal(usersTask.endDate.toISOString());
    chai.should().exist(task.category);
    chai.should().exist(task.roadmap);
    task.category.id.should.equal(category.id);
    task.roadmap.id.should.equal(roadmap.id);
  });

  it('should fail when task belongs to another user', async () => {
    const differentUser = await entityFactory.createAccount();
    const differentRoadmap = await entityFactory.createRoadmap(differentUser.id);
    await entityFactory.createCategory(differentRoadmap.id);
    const differentTask = await entityFactory.createTask(differentRoadmap.id);

    const response = await server.get(`/api/tasks/${differentTask.id}`).set('Authorization', `Bearer ${token}`);
    response.status.should.equal(400);
    response.body.message.should.equal(resources.Generic_EntityNotFound(Task.name));
  });

  it('should fail when task does not exist', async () => {
    const response = await server.get('/api/tasks/-1').set('Authorization', `Bearer ${token}`);
    response.status.should.equal(400);
    response.body.message.should.equal(resources.Generic_EntityNotFound(Task.name));
  });
});
