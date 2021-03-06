
import shortid from 'shortid';
import {
  Category,
  Comment,
  Epic,
  Milestone,
  Roadmap,
  RoadmapUser,
  Task,
  User,
  UserNotification
} from '../../models';
import authService from '../../services/util/authService';
import { connection } from '../../services/util/databaseService';

const defaultPassword = 'Test123';

const createAccount = async (modifier?: (u: User) => User) => {
  let user = new User();
  user.name = shortid.generate();
  user.email = shortid.generate() + '@email.com';

  const pass = await authService.encryptPassword(defaultPassword);

  if (!pass) {
    throw new Error('Password hashing failed');
  }
  user.password = pass;

  if (modifier) {
    user = modifier(user);
  }

  return connection().manager.save(user);
};

const loginWithAccount = (user: User) => ({
  email: user.email,
  token: authService.createToken({ payload: user })
});

const createCategory = async (roadmapId: number, modifier?: (c: Category) => Category) => {
  let category = new Category();
  category.title = shortid.generate();
  category.color = shortid.generate();
  category.description = shortid.generate();
  category.roadmapId = roadmapId;

  const roadmap = await connection()
    .manager
    .findOne(Roadmap, roadmapId);

  category.userId = roadmap!.userId;
  if (modifier) {
    category = modifier(category);
  }

  return connection().manager.save(category);
};

const createRoadmap = (userId: number, modifier?: (r: Roadmap) => Roadmap) => {
  let roadmap = new Roadmap();
  roadmap.title = shortid.generate();
  roadmap.description = shortid.generate();
  roadmap.userId = userId;
  roadmap.startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(roadmap.startDate.getMonth() + 6);
  roadmap.endDate = endDate;

  if (modifier) {
    roadmap = modifier(roadmap);
  }

  return connection().manager.save(roadmap);
};

const createTask = async (roadmapId: number, modifier?: (t: Task) => Task) => {
  let task = new Task();
  task.title = shortid.generate();
  task.description = shortid.generate();
  task.roadmapId = roadmapId;
  task.startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(task.startDate.getMonth() + 3);
  task.endDate = endDate;

  const roadmap = await connection()
    .manager
    .findOne(Roadmap, roadmapId, { relations: ['categories'] });

  task.userId = roadmap!.userId;
  task.categoryId = roadmap!.categories[0].id;
  if (modifier) {
    task = modifier(task);
  }

  return connection().manager.save(task);
};

const createMilestone = async (roadmapId: number, modifier?: (t: Milestone) => Milestone) => {
  let milestone = new Milestone();
  milestone.title = shortid.generate();
  milestone.date = new Date();
  milestone.roadmapId = roadmapId;
  milestone.color = shortid.generate();

  const roadmap = await connection()
    .manager
    .findOne(Roadmap, roadmapId);

  milestone.userId = roadmap!.userId;
  if (modifier) {
    milestone = modifier(milestone);
  }

  return connection().manager.save(milestone);
};

const createEpic = async (roadmapId: number, modifier?: (t: Epic) => Epic) => {
  let epic = new Epic();
  epic.title = shortid.generate();
  epic.roadmapId = roadmapId;
  epic.color = shortid.generate();

  const roadmap = await connection()
    .manager
    .findOne(Roadmap, roadmapId);

  epic.userId = roadmap!.userId;
  if (modifier) {
    epic = modifier(epic);
  }

  return connection().manager.save(epic);
};

const linkRoadmapToUser = async (roadmap: Roadmap, user: User, readonly: boolean = false) => {
  const roadmapUser = new RoadmapUser();
  roadmapUser.roadmap = roadmap;
  roadmapUser.user = user;
  roadmapUser.readonly = readonly;

  return connection().manager.save(roadmapUser);
};

const createNotificationSubscription = async (userId: number) => {
  const subscription = new UserNotification();
  subscription.userId = userId;
  subscription.endpoint = shortid.generate();
  subscription.p256dhKey = shortid.generate();
  subscription.authKey = shortid.generate();

  return connection().manager.save(subscription);
};

const createComment = async (task: Task, commenter: User, modifier?: (x: Comment) => Comment) => {
  let comment = new Comment();
  comment.text = shortid.generate();
  comment.taskId = task.id;
  comment.userId = commenter.id;

  if (modifier) {
    comment = modifier(comment);
  }

  return connection().manager.save(comment);
};

export default {
  defaultPassword,
  createAccount,
  loginWithAccount,
  createCategory,
  createRoadmap,
  createTask,
  createMilestone,
  createEpic,
  linkRoadmapToUser,
  createNotificationSubscription,
  createComment
};
