import { Application } from 'express';
import AccountController from './accountController';
import ActionsController from './actionsController';
import CategoryController from './categoryController';
import EpicController from './epicController';
import LogsController from './logsController';
import MilestoneController from './milestoneController';
import NotificationController from './notificationController';
import RoadmapController from './roadmapController';
import TaskController from './taskController';
import UserController from './userController';

export const registerControllers = (app: Application) => {
  app.use('/api/roadmaps', RoadmapController);
  app.use('/api/account', AccountController);
  app.use('/api/tasks', TaskController);
  app.use('/api/categories', CategoryController);
  app.use('/api/milestones', MilestoneController);
  app.use('/api/epics', EpicController);
  app.use('/api/users', UserController);
  app.use('/api/logs', LogsController);
  app.use('/api/notifications', NotificationController);
  app.use('/api/actions', ActionsController);
};
