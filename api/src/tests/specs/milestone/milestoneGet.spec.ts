import { expect } from 'chai';
import 'mocha';
import supertest from 'supertest';
import app from '../../../app';
import { Milestone, User } from '../../../models';
import resources from '../../../resources';
import * as database from '../../../services/databaseService';
import entityFactory from '../../helpers/entityFactory';

const url: string = '/api/milestones';

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

describe('Milestone get all tests', () => {
  it('should get milestones for user', async () => {
    const usersRoadmap = await entityFactory.createRoadmap(user.id);
    const usersMilestone = await entityFactory.createMilestone(usersRoadmap.id);
    const differentUser = await entityFactory.createAccount();
    const differentRoadmap = await entityFactory.createRoadmap(differentUser.id);
    await entityFactory.createMilestone(differentRoadmap.id);

    const response = await server.get(url).set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
    expect(response.body.length).to.equal(1);

    const milestone = response.body[0] as Milestone;
    expect(milestone.id).to.equal(usersMilestone.id);
  });
});

describe('Milestone get by id tests', () => {
  it('should get milestone by id', async () => {
    const usersRoadmap = await entityFactory.createRoadmap(user.id);
    const usersMilestone = await entityFactory.createMilestone(usersRoadmap.id);

    const response = await server.get(`${url}/${usersMilestone.id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(200);
    const milestone = response.body as Milestone;
    expect(milestone.id).to.equal(usersMilestone.id);
    expect(milestone.roadmapId).to.equal(usersMilestone.roadmapId);
    expect(milestone.userId).to.equal(usersMilestone.userId);
    expect(milestone.title).to.equal(usersMilestone.title);
    expect(milestone.date).to.equal(usersMilestone.date.toISOString());
    expect(milestone.color).to.equal(usersMilestone.color);
    expect(milestone.roadmap).to.exist;
    expect(milestone.roadmap.id).to.equal(usersRoadmap.id);
  });

  it('should fail when milestone belongs to another user', async () => {
    const differentUser = await entityFactory.createAccount();
    const differentRoadmap = await entityFactory.createRoadmap(differentUser.id);
    const differentMilestone = await entityFactory.createMilestone(differentRoadmap.id);

    const response = await server
      .get(`${url}/${differentMilestone.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal(resources.Generic_EntityNotFound(Milestone.name));
  });

  it('should fail when milestone does not exist', async () => {
    const response = await server.get(`${url}/-1`).set('Authorization', `Bearer ${token}`);
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal(resources.Generic_EntityNotFound(Milestone.name));
  });
});
