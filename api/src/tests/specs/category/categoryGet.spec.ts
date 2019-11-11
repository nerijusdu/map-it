import chai from 'chai';
import 'mocha';
import supertest from 'supertest';
import app from '../../../app';
import { Category, User } from '../../../models';
import resources from '../../../resources';
import * as database from '../../../services/databaseService';
import entityFactory from '../../helpers/entityFactory';

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

describe('Category get all tests', () => {
  it('should get categories for user', async () => {
    const usersRoadmap = await entityFactory.createRoadmap(user.id);
    const usersCategory = await entityFactory.createCategory(usersRoadmap.id);
    const differentUser = await entityFactory.createAccount();
    const differentRoadmap = await entityFactory.createRoadmap(differentUser.id);
    await entityFactory.createCategory(differentRoadmap.id);

    const response = await server.get('/categories').set('Authorization', `Bearer ${token}`);
    response.status.should.equal(200);
    response.body.should.be.an('array');
    response.body.length.should.equal(1);

    const category = response.body[0] as Category;
    category.id.should.equal(usersCategory.id);
  });
});

describe('Category get by id tests', () => {
  it('should get category by id', async () => {
    const usersRoadmap = await entityFactory.createRoadmap(user.id);
    const usersCategory = await entityFactory.createCategory(usersRoadmap.id);

    const response = await server.get(`/categories/${usersCategory.id}`).set('Authorization', `Bearer ${token}`);
    response.status.should.equal(200);
    const category = response.body as Category;
    category.id.should.equal(usersCategory.id);
    category.roadmapId.should.equal(usersCategory.roadmapId);
    category.userId.should.equal(usersCategory.userId);
    category.title.should.equal(usersCategory.title);
    category.description.should.equal(usersCategory.description);
    category.color.should.equal(usersCategory.color);
    chai.should().exist(category.roadmap);
    category.roadmap.id.should.equal(usersRoadmap.id);
  });

  it('should fail when category belongs to another user', async () => {
    const differentUser = await entityFactory.createAccount();
    const differentRoadmap = await entityFactory.createRoadmap(differentUser.id);
    const differentCategory = await entityFactory.createCategory(differentRoadmap.id);

    const response = await server.get(`/categories/${differentCategory.id}`).set('Authorization', `Bearer ${token}`);
    response.status.should.equal(400);
    response.body.message.should.equal(resources.Generic_EntityNotFound(Category.name));
  });

  it('should fail when category does not exist', async () => {
    const response = await server.get('/categories/-1').set('Authorization', `Bearer ${token}`);
    response.status.should.equal(400);
    response.body.message.should.equal(resources.Generic_EntityNotFound(Category.name));
  });
});
