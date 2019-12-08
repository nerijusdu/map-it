import { expect } from 'chai';
import 'mocha';
import moment from 'moment';
import shortid from 'shortid';
import supertest from 'supertest';
import app from '../../../app';
import { Milestone, Roadmap, User } from '../../../models';
import * as database from '../../../services/databaseService';
import entityFactory from '../../helpers/entityFactory';

const url: string = '/api/milestones';

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

describe('Milestone post tests', () => {
  it('should create milestone', async () => {
    const milestone = new Milestone();
    milestone.title = shortid.generate();
    milestone.color = shortid.generate();
    milestone.date = moment(roadmap.startDate).add(1, 'days').toDate();
    milestone.roadmapId = roadmap.id;

    const response = await server.post(url)
      .set('Authorization', `Bearer ${token}`)
      .send(milestone);

    expect(response.status).to.equal(200);
    const id = response.body.id;
    expect(id).to.be.a('number');
    const createdMilestone = await database
      .connection()
      .manager
      .findOne(Milestone, id);

    expect(createdMilestone).to.exist;
    expect(createdMilestone!.title).to.equal(milestone.title);
    expect(createdMilestone!.color).to.equal(milestone.color);
    expect(createdMilestone!.date.toISOString()).to.equal(milestone.date.toISOString());
    expect(createdMilestone!.roadmapId).to.equal(milestone.roadmapId);
    expect(createdMilestone!.userId).to.equal(user.id);
  });

  it('should edit milestone', async () => {
    const milestone = await entityFactory.createMilestone(roadmap.id);

    const newTitle = shortid.generate();
    milestone.title = newTitle;

    const response = await server.post(url)
      .set('Authorization', `Bearer ${token}`)
      .send(milestone);

    expect(response.status).to.equal(200);
    const editedMilestone = await database
      .connection()
      .manager
      .findOne(Milestone, milestone.id);

    expect(editedMilestone).to.exist;
    expect(editedMilestone!.title).to.equal(milestone.title);
  });
});

describe('Milestone delete tests', () => {
  it('should delete milestone', async () => {
    const milestone = await entityFactory.createMilestone(roadmap.id);

    const response = await server
      .delete(`${url}/${milestone.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).to.equal(200);

    const deletedMilestone = await database
      .connection()
      .manager
      .findOne(Milestone, milestone.id);

    expect(deletedMilestone).to.not.exist;
  });

  it('should not delete milestone of different user', async () => {
    const differentUser = await entityFactory.createAccount();
    const differentRoadmap = await entityFactory.createRoadmap(differentUser.id);
    const differentMilestone = await entityFactory.createMilestone(differentRoadmap.id);

    const response = await server
      .delete(`${url}/${differentMilestone.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).to.equal(400);

    const deletedMilestone = await database
      .connection()
      .manager
      .findOne(Milestone, differentMilestone.id);

    expect(deletedMilestone).to.exist;
  });
});
