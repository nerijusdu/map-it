import { expect } from 'chai';
import 'mocha';
import shortid from 'shortid';
import supertest from 'supertest';
import app from '../../../app';
import { Category, Roadmap, Task, User } from '../../../models';
import resources from '../../../resources';
import * as database from '../../../services/util/databaseService';
import entityFactory from '../../helpers/entityFactory';

const url: string = '/api/tasks';

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

    const response = await server.post(url)
      .set('Authorization', `Bearer ${token}`)
      .send(task);

    expect(response.status).to.equal(200);
    const id = response.body.id;
    expect(id).to.be.a('number');
    const createdTask = await database
      .connection()
      .manager
      .findOne(Task, id);

    expect(createdTask).to.exist;
    expect(createdTask!.title).to.equal(task.title);
    expect(createdTask!.description).to.equal(task.description);
    expect(createdTask!.roadmapId).to.equal(task.roadmapId);
    expect(createdTask!.categoryId).to.equal(task.categoryId);
    expect(createdTask!.startDate.toISOString()).to.equal(task.startDate.toISOString());
    expect(createdTask!.endDate.toISOString()).to.equal(task.endDate.toISOString());
    expect(createdTask!.userId).to.equal(user.id);
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

    const response = await server.post(url)
      .set('Authorization', `Bearer ${token}`)
      .send(task);

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal(resources.Task_CategoryNotFound);
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
      .post(url)
      .set('Authorization', `Bearer ${token}`)
      .send(task);

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal(resources.Task_CategoryNotFound);
  });

  it('should edit task', async () => {
    const task = await entityFactory.createTask(roadmap.id);

    const newTitle = shortid.generate();
    task.title = newTitle;

    const response = await server
      .post(url)
      .set('Authorization', `Bearer ${token}`)
      .send(task);

    expect(response.status).to.equal(200);
    const editedTask = await database
      .connection()
      .manager
      .findOne(Task, task.id);

    expect(editedTask).to.exist;
    expect(editedTask!.title).to.equal(task.title);
  });

  it('should fail editing task on readonly shared map', async () => {
    const anotherUser = await entityFactory.createAccount();
    const anotherRoadmap = await entityFactory.createRoadmap(anotherUser.id);
    await entityFactory.createCategory(anotherRoadmap.id);
    await entityFactory.linkRoadmapToUser(anotherRoadmap, user, true);
    const task = await entityFactory.createTask(anotherRoadmap.id);

    const oldTitle = task.title;
    task.title = shortid.generate();

    const response = await server
      .post(url)
      .set('Authorization', `Bearer ${token}`)
      .send(task);

    expect(response.status).to.equal(400);
    const editedTask = await database
      .connection()
      .manager
      .findOne(Task, task.id);

    expect(editedTask).to.exist;
    expect(editedTask!.title).to.equal(oldTitle);
  });

  it('should only allow to create tasks inside roadmaps timeframe', async () => {
    const task = new Task();
    task.title = shortid.generate();
    task.description = shortid.generate();
    task.roadmapId = roadmap.id;
    task.categoryId = category.id;
    task.startDate = new Date(roadmap.startDate);
    task.startDate.setMonth(roadmap.startDate.getMonth() - 1);
    const endDate = new Date();
    endDate.setMonth(task.startDate.getMonth() + 3);
    task.endDate = endDate;

    const response = await server.post(url)
      .set('Authorization', `Bearer ${token}`)
      .send(task);

    expect(response.status).to.equal(400);
  });
});

describe('Task delete tests', () => {
  it('should delete task', async () => {
    const task = await entityFactory.createTask(roadmap.id);

    const response = await server
      .delete(`${url}/${task.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).to.equal(200);

    const deletedTask = await database
      .connection()
      .manager
      .findOne(Task, task.id);

    expect(deletedTask).to.not.exist;
  });

  it('should not delete task of different user', async () => {
    const differentUser = await entityFactory.createAccount();
    const differentRoadmap = await entityFactory.createRoadmap(differentUser.id);
    await entityFactory.createCategory(differentRoadmap.id);
    const task = await entityFactory.createTask(differentRoadmap.id);

    const response = await server
      .delete(`${url}/${task.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).to.equal(400);

    const deletedTask = await database
      .connection()
      .manager
      .findOne(Task, task.id);

    expect(deletedTask).to.exist;
  });

  it('should fail deleting task on readonly shared map', async () => {
    const differentUser = await entityFactory.createAccount();
    const differentRoadmap = await entityFactory.createRoadmap(differentUser.id);
    await entityFactory.createCategory(differentRoadmap.id);
    await entityFactory.linkRoadmapToUser(differentRoadmap, user, true);
    const task = await entityFactory.createTask(differentRoadmap.id);

    const response = await server
      .delete(`${url}/${task.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).to.equal(400);

    const deletedTask = await database
      .connection()
      .manager
      .findOne(Task, task.id);

    expect(deletedTask).to.exist;
  });
});
