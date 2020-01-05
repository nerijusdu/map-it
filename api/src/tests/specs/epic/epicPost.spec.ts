import { expect } from 'chai';
import 'mocha';
import shortid from 'shortid';
import supertest from 'supertest';
import app from '../../../app';
import { Category, Epic, Roadmap, User } from '../../../models';
import * as database from '../../../services/util/databaseService';
import entityFactory from '../../helpers/entityFactory';

const url: string = '/api/epics';

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

describe('Epic post tests', () => {
  it('should create epic', async () => {
    const category = await entityFactory.createCategory(roadmap.id);
    const epic = new Epic();
    epic.title = shortid.generate();
    epic.color = shortid.generate();
    epic.roadmapId = roadmap.id;

    const response = await server.post(url)
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...epic,
        categoryIds: [category.id]
      });

    expect(response.status).to.equal(200);
    const id = response.body.id;
    expect(id).to.be.a('number');
    const createdEpic = await database
      .connection()
      .manager
      .findOne(Epic, id, { relations: ['categories'] });

    expect(createdEpic).to.exist;
    expect(createdEpic!.title).to.equal(epic.title);
    expect(createdEpic!.color).to.equal(epic.color);
    expect(createdEpic!.roadmapId).to.equal(epic.roadmapId);
    expect(createdEpic!.userId).to.equal(user.id);
    expect(createdEpic!.categories).to.exist;
    expect(createdEpic!.categories[0]).to.exist;
    expect(createdEpic!.categories[0].id).to.equal(category.id);
  });

  it('should edit epic', async () => {
    const epic = await entityFactory.createEpic(roadmap.id);

    const newTitle = shortid.generate();
    epic.title = newTitle;

    const response = await server.post(url)
      .set('Authorization', `Bearer ${token}`)
      .send(epic);

    expect(response.status).to.equal(200);
    const editedEpic = await database
      .connection()
      .manager
      .findOne(Epic, epic.id);

    expect(editedEpic).to.exist;
    expect(editedEpic!.title).to.equal(epic.title);
  });
});

describe('Epic delete tests', () => {
  it('should delete epic', async () => {
    const epic = await entityFactory.createEpic(roadmap.id);

    const response = await server
      .delete(`${url}/${epic.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).to.equal(200);

    const deletedEpic = await database
      .connection()
      .manager
      .findOne(Epic, epic.id);

    expect(deletedEpic).to.not.exist;
  });

  it('should not delete epic of different user', async () => {
    const differentUser = await entityFactory.createAccount();
    const differentRoadmap = await entityFactory.createRoadmap(differentUser.id);
    const differentEpic = await entityFactory.createEpic(differentRoadmap.id);

    const response = await server
      .delete(`${url}/${differentEpic.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).to.equal(400);

    const deletedEpic = await database
      .connection()
      .manager
      .findOne(Epic, differentEpic.id);

    expect(deletedEpic).to.exist;
  });

  it('should delete epic and leave categories', async () => {
    const category = await entityFactory.createCategory(roadmap.id);
    const epic = await entityFactory.createEpic(roadmap.id, (x) => {
      x.categories = [category];
      return x;
    });

    const response = await server
      .delete(`${url}/${epic.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).to.equal(200);

    const deletedEpic = await database
      .connection()
      .manager
      .findOne(Epic, epic.id);

    expect(deletedEpic).to.not.exist;

    const updatedCategory = await database
      .connection()
      .manager
      .findOne(Category, category.id);

    expect(updatedCategory).to.exist;
    expect(updatedCategory!.epic).to.not.exist;
  });
});
