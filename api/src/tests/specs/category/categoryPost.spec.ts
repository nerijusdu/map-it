import { expect } from 'chai';
import 'mocha';
import shortid from 'shortid';
import supertest from 'supertest';
import app from '../../../app';
import { Category, Roadmap, User } from '../../../models';
import * as database from '../../../services/databaseService';
import entityFactory from '../../helpers/entityFactory';

const url: string = '/api/categories';

let server: supertest.SuperTest<supertest.Test>;
let user: User;
let roadmap: Roadmap;
let token: string;
before(async () => {
  server = supertest.agent(app);
  await database.initPromise;
  user = await entityFactory.createAccount();
  roadmap = await entityFactory.createRoadmap(user.id);
  token = entityFactory.loginWithAccount(user).token;
});
after(async () => {
  await database.close();
});

describe('Category post tests', () => {
  it('should create category', async () => {
    const category = new Category();
    category.title = shortid.generate();
    category.color = shortid.generate();
    category.description = shortid.generate();
    category.roadmapId = roadmap.id;

    const response = await server.post(url)
      .set('Authorization', `Bearer ${token}`)
      .send(category);

    expect(response.status).to.equal(200);
    const id = response.body.id;
    expect(id).to.be.a('number');
    const createdCategory = await database
      .connection()
      .manager
      .findOne(Category, id);

    expect(createdCategory).to.exist;
    expect(createdCategory!.title).to.equal(category.title);
    expect(createdCategory!.color).to.equal(category.color);
    expect(createdCategory!.description).to.equal(category.description);
    expect(createdCategory!.roadmapId).to.equal(category.roadmapId);
    expect(createdCategory!.userId).to.equal(user.id);
  });

  it('should edit category', async () => {
    const category = await entityFactory.createCategory(roadmap.id);

    const newTitle = shortid.generate();
    category.title = newTitle;

    const response = await server.post(url)
      .set('Authorization', `Bearer ${token}`)
      .send(category);

    expect(response.status).to.equal(200);
    const editedCategory = await database
      .connection()
      .manager
      .findOne(Category, category.id);

    expect(editedCategory).to.exist;
    expect(editedCategory!.title).to.equal(category.title);
  });
});

describe('Category delete tests', () => {
  it('should delete category', async () => {
    const category = await entityFactory.createCategory(roadmap.id);

    const response = await server
      .delete(`${url}/${category.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).to.equal(200);

    const deletedCategory = await database
      .connection()
      .manager
      .findOne(Category, category.id);

    expect(deletedCategory).to.not.exist;
  });

  it('should not delete category of different user', async () => {
    const differentUser = await entityFactory.createAccount();
    const differentRoadmap = await entityFactory.createRoadmap(differentUser.id);
    const differentCategory = await entityFactory.createCategory(differentRoadmap.id);

    const response = await server
      .delete(`${url}/${differentCategory.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).to.equal(200);

    const deletedCategory = await database
      .connection()
      .manager
      .findOne(Category, differentCategory.id);

    expect(deletedCategory).to.exist;
  });
});
