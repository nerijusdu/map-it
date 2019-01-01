import shortid from 'shortid';
import { Category, Roadmap, Task, User } from '../../models';
import authService from '../../services/authService';
import { connection } from '../../services/databaseService';

const defaultPassword = 'Test123';

const createAccount = (modifier?: (u: User) => User) => {
  let user = new User();
  user.name = shortid.generate();
  user.email = shortid.generate() + '@email.com';

  return authService
    .encryptPassword(defaultPassword)
    .then((pass) => {
      if (!pass) {
        throw new Error('Password hashing failed');
      }
      user.password = pass;

      if (modifier) {
        user = modifier(user);
      }

      return connection().manager.save(user);
    });
};

const loginWithAccount = (user: User) => ({
  email: user.email,
  token: authService.createToken({ payload: user })
});

const createCategory = (roadmapId: number, modifier?: (c: Category) => Category) => {
  let category = new Category();
  category.title = shortid.generate();
  category.color = shortid.generate();
  category.description = shortid.generate();
  category.roadmapId = roadmapId;

  return connection()
    .manager
    .findOne(Roadmap, roadmapId)
    .then((roadmap) => {
      category.userId = roadmap!.userId;
      if (modifier) {
        category = modifier(category);
      }

      return connection().manager.save(category);
    });
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

const createTask = (roadmapId: number, modifier?: (t: Task) => Task) => {
  let task = new Task();
  task.title = shortid.generate();
  task.description = shortid.generate();
  task.roadmapId = roadmapId;
  task.startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(task.startDate.getMonth() + 3);
  task.endDate = endDate;

  return connection()
    .manager
    .findOne(Roadmap, roadmapId, { relations: ['categories'] })
    .then((roadmap) => {
      task.userId = roadmap!.userId;
      task.categoryId = roadmap!.categories[0].id;
      if (modifier) {
        task = modifier(task);
      }

      return connection().manager.save(task);
    });
};

export default {
  defaultPassword,
  createAccount,
  loginWithAccount,
  createCategory,
  createRoadmap,
  createTask
};
