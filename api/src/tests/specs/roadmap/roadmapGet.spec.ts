import { expect } from 'chai';
import 'mocha';
import supertest from 'supertest';
import app from '../../../app';
import { Roadmap, User } from '../../../models';
import resources from '../../../resources';
import * as database from '../../../services/util/databaseService';
import entityFactory from '../../helpers/entityFactory';

const url: string = '/api/roadmaps';

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

    const response = await server.get(url).set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
    expect(response.body.length).to.equal(1);

    const roadmap = response.body[0] as Roadmap;
    expect(roadmap.id).to.equal(usersRoadmap.id);
  });

  it('should get shared roadmaps', async () => {
    const anotherUser = await entityFactory.createAccount();
    const sharedRoadmap = await entityFactory.createRoadmap(anotherUser.id);
    await entityFactory.linkRoadmapToUser(sharedRoadmap, user);

    const response = await server.get(url).set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');

    const roadmap = response.body.find((x: Roadmap) => x.id === sharedRoadmap.id);
    expect(roadmap).to.exist;
  });
});

describe('Roadmap get by id tests', () => {
  it('should get roadmap by id', async () => {
    const usersRoadmap = await entityFactory.createRoadmap(user.id);

    const response = await server.get(`${url}/${usersRoadmap.id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(200);
    const roadmap = response.body as Roadmap;
    expect(roadmap.id).to.equal(usersRoadmap.id);
    expect(roadmap.userId).to.equal(usersRoadmap.userId);
    expect(roadmap.title).to.equal(usersRoadmap.title);
    expect(roadmap.description).to.equal(usersRoadmap.description);
    expect(roadmap.startDate).to.equal(usersRoadmap.startDate.toISOString());
    expect(roadmap.endDate).to.equal(usersRoadmap.endDate.toISOString());
  });

  it('should get roadmap with categories by id', async () => {
    const roadmap = await entityFactory.createRoadmap(user.id);
    const category = await entityFactory.createCategory(roadmap.id);
    const differentRoadmap = await entityFactory.createRoadmap(user.id);
    await entityFactory.createCategory(differentRoadmap.id);

    const response = await server.get(`${url}/${roadmap.id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(200);
    const fetchedRoadmap = response.body as Roadmap;
    expect(fetchedRoadmap.categories).to.be.an('array');
    expect(fetchedRoadmap.categories.length).to.equal(1);
    expect(fetchedRoadmap.categories[0].id).to.equal(category.id);
  });

  it('should get roadmap with subcategories by id', async () => {
    const roadmap = await entityFactory.createRoadmap(user.id);
    const category = await entityFactory.createCategory(roadmap.id);
    const subcategory = await entityFactory.createCategory(roadmap.id, x => {
      x.parentCategoryId = category.id;
      return x;
    });
    const differentRoadmap = await entityFactory.createRoadmap(user.id);
    await entityFactory.createCategory(differentRoadmap.id);

    const response = await server.get(`${url}/${roadmap.id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(200);
    const fetchedRoadmap = response.body as Roadmap;
    expect(fetchedRoadmap.categories).to.be.an('array');
    expect(fetchedRoadmap.categories.length).to.equal(2);
    expect(fetchedRoadmap.categories.find(x => x.id === category.id)).to.exist;
    expect(fetchedRoadmap.categories.find(x => x.id === subcategory.id)).to.exist;
  });

  it('should get roadmap with tasks by id', async () => {
    const roadmap = await entityFactory.createRoadmap(user.id);
    await entityFactory.createCategory(roadmap.id);
    const task = await entityFactory.createTask(roadmap.id);
    const differentRoadmap = await entityFactory.createRoadmap(user.id);
    await entityFactory.createCategory(differentRoadmap.id);
    await entityFactory.createTask(differentRoadmap.id);

    const response = await server.get(`${url}/${roadmap.id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(200);
    const fetchedRoadmap = response.body as Roadmap;
    expect(fetchedRoadmap.tasks).to.be.an('array');
    expect(fetchedRoadmap.tasks.length).to.equal(1);
    expect(fetchedRoadmap.tasks[0].id).to.equal(task.id);
  });

  it('should get roadmap with milestones by id', async () => {
    const roadmap = await entityFactory.createRoadmap(user.id);
    const milestone = await entityFactory.createMilestone(roadmap.id);
    const differentRoadmap = await entityFactory.createRoadmap(user.id);
    await entityFactory.createCategory(differentRoadmap.id);

    const response = await server.get(`${url}/${roadmap.id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(200);
    const fetchedRoadmap = response.body as Roadmap;
    expect(fetchedRoadmap.milestones).to.be.an('array');
    expect(fetchedRoadmap.milestones.length).to.equal(1);
    expect(fetchedRoadmap.milestones[0].id).to.equal(milestone.id);
  });

  it('should get roadmap with epics by id', async () => {
    const roadmap = await entityFactory.createRoadmap(user.id);
    const epic = await entityFactory.createEpic(roadmap.id);
    const differentRoadmap = await entityFactory.createRoadmap(user.id);
    await entityFactory.createCategory(differentRoadmap.id);

    const response = await server.get(`${url}/${roadmap.id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(200);
    const fetchedRoadmap = response.body as Roadmap;
    expect(fetchedRoadmap.epics).to.be.an('array');
    expect(fetchedRoadmap.epics.length).to.equal(1);
    expect(fetchedRoadmap.epics[0].id).to.equal(epic.id);
  });

  it('should fail when roadmap belongs to another user', async () => {
    const differentUser = await entityFactory.createAccount();
    const differentRoadmap = await entityFactory.createRoadmap(differentUser.id);

    const response = await server.get(`${url}/${differentRoadmap.id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal(resources.Generic_EntityNotFound(Roadmap.name));
  });

  it('should fail when roadmap does not exist', async () => {
    const response = await server.get(`${url}/-1`).set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal(resources.Generic_EntityNotFound(Roadmap.name));
  });

  it('should get sharedRoadmap', async () => {
    const anotherUser = await entityFactory.createAccount();
    const sharedRoadmap = await entityFactory.createRoadmap(anotherUser.id);
    await entityFactory.linkRoadmapToUser(sharedRoadmap, user);

    const response = await server.get(`${url}/${sharedRoadmap.id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(200);
  });
});

describe('Roadmap get users', () => {
  it('should get users for roadmap', async () => {
    const roadmap = await entityFactory.createRoadmap(user.id);
    const anotherUser = await entityFactory.createAccount();
    await entityFactory.linkRoadmapToUser(roadmap, anotherUser);

    const response = await server.get(`${url}/${roadmap.id}/users`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
    expect(response.body.length).to.equal(2);
    const user1 = (response.body as any[]).find(x => x.id === user.id);
    const user2 = (response.body as any[]).find(x => x.id === anotherUser.id);
    expect(user1).to.exist;
    expect(user1.name).to.equal(user.name);
    expect(user1.email).to.equal(user.email);
    expect(user2).to.exist;
    expect(user2.name).to.equal(anotherUser.name);
    expect(user2.email).to.equal(anotherUser.email);
  });
});
