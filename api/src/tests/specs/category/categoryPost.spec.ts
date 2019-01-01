import chai from 'chai';
import 'mocha';
import shortid from 'shortid';
import supertest from 'supertest';
import app from '../../../app';
import { Category, Roadmap, User } from '../../../models';
import * as database from '../../../services/databaseService';
import entityFactory from '../../helpers/entityFactory';
import '../../helpers/requestType';

chai.should();

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

    const response = await server
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send(category);

    response.status.should.equal(200);
    const id = response.body.id;
    id.should.be.a('number');
    const createdCategory = await database
      .connection()
      .manager
      .findOne(Category, id);

    chai.should().exist(createdCategory);
    createdCategory!.title = category.title;
    createdCategory!.color = category.color;
    createdCategory!.description = category.description;
    createdCategory!.roadmapId = category.roadmapId;
    createdCategory!.userId = category.userId;
  });

  it('should edit category', async () => {
    const category = await entityFactory.createCategory(roadmap.id);

    const newTitle = shortid.generate();
    category.title = newTitle;

    const response = await server
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send(category);

    response.status.should.equal(200);
    const editedCategory = await database
      .connection()
      .manager
      .findOne(Category, category.id);

    chai.should().exist(editedCategory);
    editedCategory!.title = category.title;
  });
});

describe('Category delete tests', () => {
  it('should delete category', async () => {
    const category = await entityFactory.createCategory(roadmap.id);

    const response = await server
      .delete(`/categories/${category.id}`)
      .set('Authorization', `Bearer ${token}`);

    response.status.should.equal(200);

    const deletedCategory = await database
      .connection()
      .manager
      .findOne(Category, category.id);

    chai.should().not.exist(deletedCategory);
  });

  it('should not delete category of different user', async () => {
    const differentUser = await entityFactory.createAccount();
    const differentRoadmap = await entityFactory.createRoadmap(differentUser.id);
    const differentCategory = await entityFactory.createCategory(differentRoadmap.id);

    const response = await server
      .delete(`/categories/${differentCategory.id}`)
      .set('Authorization', `Bearer ${token}`);

    response.status.should.equal(200);

    const deletedCategory = await database
      .connection()
      .manager
      .findOne(Category, differentCategory.id);

    chai.should().exist(deletedCategory);
  });
});
