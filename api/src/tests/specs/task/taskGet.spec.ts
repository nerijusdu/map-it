import { expect } from 'chai';
import 'mocha';
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

describe('Task get all tests', () => {
  it('should get tasks for user', async () => {
    const usersTask = await entityFactory.createTask(roadmap.id);
    const differentUser = await entityFactory.createAccount();
    const differentRoadmap = await entityFactory.createRoadmap(differentUser.id);
    await entityFactory.createCategory(differentRoadmap.id);
    await entityFactory.createTask(differentRoadmap.id);

    const response = await server.get(url).set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
    expect(response.body.length).to.equal(1);

    const task = response.body[0] as Task;
    expect(task.id).to.equal(usersTask.id);
  });

  it('should get tasks of shared roadmap', async () => {
    const anotherUser = await entityFactory.createAccount();
    const usersRoadmap = await entityFactory.createRoadmap(anotherUser.id);
    await entityFactory.createCategory(usersRoadmap.id);
    const task = await entityFactory.createTask(usersRoadmap.id);
    await entityFactory.linkRoadmapToUser(usersRoadmap, user);

    const response = await server.get(url).set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');

    const entity = response.body.find((x: Task) => x.id === task.id);
    expect(entity).to.exist;
  });
});

describe('Task get by id tests', () => {
  it('should get task by id', async () => {
    const usersTask = await entityFactory.createTask(roadmap.id);

    const response = await server.get(`${url}/${usersTask.id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(200);

    const task = response.body as Task;
    expect(task.id).to.equal(usersTask.id);
    expect(task.title).to.equal(usersTask.title);
    expect(task.description).to.equal(usersTask.description);
    expect(task.startDate).to.equal(usersTask.startDate.toISOString());
    expect(task.endDate).to.equal(usersTask.endDate.toISOString());
    expect(task.category).to.exist;
    expect(task.roadmap).to.exist;
    expect(task.category.id).to.equal(category.id);
    expect(task.roadmap.id).to.equal(roadmap.id);
  });

  it('should fail when task belongs to another user', async () => {
    const differentUser = await entityFactory.createAccount();
    const differentRoadmap = await entityFactory.createRoadmap(differentUser.id);
    await entityFactory.createCategory(differentRoadmap.id);
    const differentTask = await entityFactory.createTask(differentRoadmap.id);

    const response = await server.get(`${url}/${differentTask.id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal(resources.Generic_EntityNotFound(Task.name));
  });

  it('should fail when task does not exist', async () => {
    const response = await server.get(`${url}/-1`).set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal(resources.Generic_EntityNotFound(Task.name));
  });

  it('should get epic of shared roadmap', async () => {
    const anotherUser = await entityFactory.createAccount();
    const usersRoadmap = await entityFactory.createRoadmap(anotherUser.id);
    await entityFactory.createCategory(usersRoadmap.id);
    const task = await entityFactory.createTask(usersRoadmap.id);
    await entityFactory.linkRoadmapToUser(usersRoadmap, user);

    const response = await server.get(`${url}/${task.id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(200);
  });
});

describe('Task complete tests', () => {
  it('should complete task', async () => {
    const task = await entityFactory.createTask(roadmap.id);

    const result = await server.get(`${url}/${task.id}/complete`)
      .set('Authorization', `Bearer ${token}`);

    expect(result.status).to.equal(200);

    const completedTask = await database
      .connection()
      .manager
      .findOne(Task, task.id);

    expect(completedTask!.isCompleted).to.be.true;
  });

  it('should revert completed task', async () => {
    const task = await entityFactory.createTask(roadmap.id, (x) => {
      x.isCompleted = true;
      return x;
    });

    const result = await server.get(`${url}/${task.id}/complete?revert=true`)
      .set('Authorization', `Bearer ${token}`);

    expect(result.status).to.equal(200);

    const completedTask = await database
      .connection()
      .manager
      .findOne(Task, task.id);

    expect(completedTask!.isCompleted).to.be.false;
  });

  it('should fail when completing non existing task', async () => {
    const result = await server.get(`${url}/-1/complete`)
      .set('Authorization', `Bearer ${token}`);

    expect(result.status).to.equal(400);
  });

  it('should fail when task does not belong to user', async () => {
    const task = await entityFactory.createTask(roadmap.id);
    const differentUser = await entityFactory.createAccount();
    const differentToken = entityFactory.loginWithAccount(differentUser).token;
    const result = await server.get(`${url}/${task.id}/complete`)
      .set('Authorization', `Bearer ${differentToken}`);

    expect(result.status).to.equal(400);
  });
});
