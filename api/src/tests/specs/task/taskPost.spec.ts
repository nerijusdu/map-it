import chai from 'chai';
import 'mocha';
import shortid from 'shortid';
import supertest from 'supertest';
import app from '../../../app';
import { Category, Roadmap, Task, User } from '../../../models';
import resources from '../../../resources';
import * as database from '../../../services/databaseService';
import entityFactory from '../../helpers/entityFactory';
import '../../helpers/requestType';

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

describe('Task post tests', () => {
  it('should create task', async () => {
    const task = new Task();
    task.title = shortid.generate();
    task.description = shortid.generate();
    task.roadmapId = roadmap.id;
    task.categoryId = category.id;
    task.startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(task.startDate.getMonth() + 3);
    task.endDate = endDate;

    const response = await server
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send(task);

    response.status.should.equal(200);
    const id = response.body.id;
    id.should.be.a('number');
    const createdTask = await database
      .connection()
      .manager
      .findOne(Task, id);

    chai.should().exist(createdTask);
    createdTask!.title.should.equal(task.title);
    createdTask!.description.should.equal(task.description);
    createdTask!.roadmapId.should.equal(task.roadmapId);
    createdTask!.categoryId.should.equal(task.categoryId);
    createdTask!.startDate.toISOString().should.equal(task.startDate.toISOString());
    createdTask!.endDate.toISOString().should.equal(task.endDate.toISOString());
    createdTask!.userId.should.equal(user.id);
  });

  it('should fail when category is incorrect', async () => {
    const differentRoadmap = await entityFactory.createRoadmap(user.id);
    const differentCategory = await entityFactory.createCategory(differentRoadmap.id);

    const task = new Task();
    task.title = shortid.generate();
    task.roadmapId = roadmap.id;
    task.categoryId = differentCategory.id;
    task.startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(task.startDate.getMonth() + 3);
    task.endDate = endDate;

    const response = await server
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send(task);

    response.status.should.equal(400);
    response.body.message.should.equal(resources.Task_CategoryNotFound);
  });

  it('should fail when roadmap is incorrect', async () => {
    const differentRoadmap = await entityFactory.createRoadmap(user.id);

    const task = new Task();
    task.title = shortid.generate();
    task.roadmapId = differentRoadmap.id;
    task.categoryId = category.id;
    task.startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(task.startDate.getMonth() + 3);
    task.endDate = endDate;

    const response = await server
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send(task);

    response.status.should.equal(400);
    response.body.message.should.equal(resources.Task_CategoryNotFound);
  });

  it('should edit task', async () => {
    const task = await entityFactory.createTask(roadmap.id);

    const newTitle = shortid.generate();
    task.title = newTitle;

    const response = await server
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send(task);

    response.status.should.equal(200);
    const editedTask = await database
      .connection()
      .manager
      .findOne(Task, task.id);

    chai.should().exist(editedTask);
    editedTask!.title.should.equal(task.title);
  });
});

describe('Task delete tests', () => {
  it('should delete task', async () => {
    const task = await entityFactory.createTask(roadmap.id);

    const response = await server
      .delete(`/tasks/${task.id}`)
      .set('Authorization', `Bearer ${token}`);

    response.status.should.equal(200);

    const deletedTask = await database
      .connection()
      .manager
      .findOne(Task, task.id);

    chai.should().not.exist(deletedTask);
  });

  it('should not delete task of different user', async () => {
    const differentUser = await entityFactory.createAccount();
    const differentRoadmap = await entityFactory.createRoadmap(differentUser.id);
    await entityFactory.createCategory(differentRoadmap.id);
    const task = await entityFactory.createTask(differentRoadmap.id);

    const response = await server
      .delete(`/tasks/${task.id}`)
      .set('Authorization', `Bearer ${token}`);

    response.status.should.equal(200);

    const deletedTask = await database
      .connection()
      .manager
      .findOne(Task, task.id);

    chai.should().exist(deletedTask);
  });
});
