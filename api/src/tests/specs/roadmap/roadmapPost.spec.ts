import { expect } from 'chai';
import 'mocha';
import shortid from 'shortid';
import supertest from 'supertest';
import app from '../../../app';
import { Roadmap, User, RoadmapUser } from '../../../models';
import * as database from '../../../services/databaseService';
import entityFactory from '../../helpers/entityFactory';
import respose from '../../../helpers/respose';

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

describe('Roadmap post tests', () => {
  it('should create roadmap', async () => {
    const roadmap = new Roadmap();
    roadmap.title = shortid.generate();
    roadmap.description = shortid.generate();
    roadmap.userId = user.id;
    roadmap.startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(roadmap.startDate.getMonth() + 6);
    roadmap.endDate = endDate;

    const response = await server
      .post(url)
      .set('Authorization', `Bearer ${token}`)
      .send(roadmap);

    expect(response.status).to.equal(200);
    const id = response.body.id;
    expect(id).to.be.a('number');
    const createdRoadmap = await database
      .connection()
      .manager
      .findOne(Roadmap, id);

    expect(createdRoadmap).to.exist;
    expect(createdRoadmap!.title).to.equal(roadmap.title);
    expect(createdRoadmap!.description).to.equal(roadmap.description);
    expect(createdRoadmap!.userId).to.equal(roadmap.userId);
    expect(createdRoadmap!.startDate.toISOString()).to.equal(roadmap.startDate.toISOString());
    expect(createdRoadmap!.endDate.toISOString()).to.equal(roadmap.endDate.toISOString());
  });

  it('should edit roadmap', async () => {
    const roadmap = await entityFactory.createRoadmap(user.id);

    const newTitle = shortid.generate();
    roadmap.title = newTitle;

    const response = await server
      .post(url)
      .set('Authorization', `Bearer ${token}`)
      .send(roadmap);

    expect(response.status).to.equal(200);
    const id = response.body.id;
    expect(id).to.be.a('number');
    const editedRoadmap = await database
      .connection()
      .manager
      .findOne(Roadmap, id);

    expect(editedRoadmap).to.exist;
    expect(editedRoadmap!.title).to.equal(roadmap.title);
  });

  it('should add user to roadmap', async () => {
    const roadmap = await entityFactory.createRoadmap(user.id);
    const anotherUser = await entityFactory.createAccount();

    const response = await server
      .post(`${url}/assign`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        roadmapId: roadmap.id,
        userId: anotherUser.id,
        readonly: true
      });

    expect(response.status).to.equal(200);
    const roadmapUser = await database
      .connection()
      .manager
      .findOne(RoadmapUser, { where: { userId: anotherUser.id, roadmapId: roadmap.id } });
    expect(roadmapUser).to.exist;
    expect(roadmapUser!.readonly).to.equal(true);
  });
});

describe('Roadmap delete tests', () => {
  it('should delete roadmap', async () => {
    const roadmap = await entityFactory.createRoadmap(user.id);

    const response = await server
      .delete(`${url}/${roadmap.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).to.equal(200);

    const deletedRoadmap = await database
      .connection()
      .manager
      .findOne(Roadmap, roadmap.id);

    expect(deletedRoadmap).to.not.exist;
  });

  it('should not delete roadmap of different user', async () => {
    const differentUser = await entityFactory.createAccount();
    const differentRoadmap = await entityFactory.createRoadmap(differentUser.id);

    const response = await server
      .delete(`${url}/${differentRoadmap.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).to.equal(200);

    const deletedRoadmap = await database
      .connection()
      .manager
      .findOne(Roadmap, differentRoadmap.id);

    expect(deletedRoadmap).to.exist;
  });
});
