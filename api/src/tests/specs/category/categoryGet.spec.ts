import { expect } from 'chai';
import 'mocha';
import supertest from 'supertest';
import app from '../../../app';
import { Category, User } from '../../../models';
import resources from '../../../resources';
import * as database from '../../../services/databaseService';
import entityFactory from '../../helpers/entityFactory';

const url: string = '/api/categories';

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

describe('Category get all tests', () => {
  it('should get categories for user', async () => {
    const usersRoadmap = await entityFactory.createRoadmap(user.id);
    const usersCategory = await entityFactory.createCategory(usersRoadmap.id);
    const differentUser = await entityFactory.createAccount();
    const differentRoadmap = await entityFactory.createRoadmap(differentUser.id);
    await entityFactory.createCategory(differentRoadmap.id);

    const response = await server.get(url).set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
    expect(response.body.length).to.equal(1);

    const category = response.body[0] as Category;
    expect(category.id).to.equal(usersCategory.id);
  });

  it('should get category of shared roadmap', async () => {
    const anotherUser = await entityFactory.createAccount();
    const usersRoadmap = await entityFactory.createRoadmap(anotherUser.id);
    const usersCategory = await entityFactory.createCategory(usersRoadmap.id);
    await entityFactory.linkRoadmapToUser(usersRoadmap, user);

    const response = await server.get(url).set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');

    const entity = response.body.find((x: Category) => x.id === usersCategory.id);
    expect(entity).to.exist;
  });
});

describe('Category get by id tests', () => {
  it('should get category by id', async () => {
    const usersRoadmap = await entityFactory.createRoadmap(user.id);
    const usersCategory = await entityFactory.createCategory(usersRoadmap.id);

    const response = await server.get(`${url}/${usersCategory.id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(200);
    const category = response.body as Category;
    expect(category.id).to.equal(usersCategory.id);
    expect(category.roadmapId).to.equal(usersCategory.roadmapId);
    expect(category.userId).to.equal(usersCategory.userId);
    expect(category.title).to.equal(usersCategory.title);
    expect(category.description).to.equal(usersCategory.description);
    expect(category.color).to.equal(usersCategory.color);
    expect(category.roadmap).to.exist;
    expect(category.roadmap.id).to.equal(usersRoadmap.id);
  });

  it('should fail when category belongs to another user', async () => {
    const differentUser = await entityFactory.createAccount();
    const differentRoadmap = await entityFactory.createRoadmap(differentUser.id);
    const differentCategory = await entityFactory.createCategory(differentRoadmap.id);

    const response = await server
      .get(`${url}/${differentCategory.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal(resources.Generic_EntityNotFound(Category.name));
  });

  it('should fail when category does not exist', async () => {
    const response = await server.get(`${url}/-1`).set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal(resources.Generic_EntityNotFound(Category.name));
  });

  it('should get category of shared roadmap', async () => {
    const anotherUser = await entityFactory.createAccount();
    const usersRoadmap = await entityFactory.createRoadmap(anotherUser.id);
    const usersCategory = await entityFactory.createCategory(usersRoadmap.id);
    await entityFactory.linkRoadmapToUser(usersRoadmap, user);

    const response = await server.get(`${url}/${usersCategory.id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(200);
  });
});
