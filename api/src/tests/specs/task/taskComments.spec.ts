import { expect } from 'chai';
import 'mocha';
import shortid from 'shortid';
import supertest from 'supertest';
import app from '../../../app';
import { Comment, Roadmap, Task, User } from '../../../models';
import * as database from '../../../services/util/databaseService';
import entityFactory from '../../helpers/entityFactory';

const url: string = '/api/tasks';

let server: supertest.SuperTest<supertest.Test>;
let user: User;
let roadmap: Roadmap;
let token: string;
let task: Task;
before(async () => {
  server = supertest.agent(app);
  await database.initPromise;
  user = await entityFactory.createAccount();
  roadmap = await entityFactory.createRoadmap(user.id);
  await entityFactory.createCategory(roadmap.id);
  task = await entityFactory.createTask(roadmap.id);
  token = entityFactory.loginWithAccount(user).token;
});
after(async () => {
  await database.close();
});

describe('Task comments tests', () => {
  it('should get task comments', async () => {
    const comment = await entityFactory.createComment(task, user);

    const response = await server.get(`${url}/${task.id}/comments`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
    expect(response.body.length).to.equal(1);
    expect(response.body[0].text).to.equal(comment.text);
    expect(response.body[0].userId).to.equal(comment.userId);
  });

  it('should post a comment', async () => {
    const text = shortid.generate();
    const response = await server.post(`${url}/${task.id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ text });

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('object');
    expect(response.body.id).to.exist;

    const newComment = await database.connection()
      .manager
      .findOne(Comment, response.body.id);

    expect(newComment).to.exist;
    expect(newComment!.text).to.equal(text);
    expect(newComment!.userId).to.equal(user.id);
    expect(newComment!.taskId).to.equal(task.id);
  });

  it('should not allow to comment for user with no access to task', async () => {
    const user2 = await entityFactory.createAccount();
    const task2 = await entityFactory.createTask(roadmap.id);
    const token2 = entityFactory.loginWithAccount(user2);

    const response = await server.post(`${url}/${task2.id}/comments`)
      .set('Authorization', `Bearer ${token2}`)
      .send({ text: shortid.generate() });

    expect(response.status).to.equal(401);

    const taskComments = await database.connection().manager
      .find(Comment, { where: { taskId: task2.id } });

    expect(taskComments.length).to.equal(0);
  });
});
