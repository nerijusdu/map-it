import moment from 'moment';
import { HttpError, Roadmap, Task, User } from '../models';
import resources from '../resources';
import categoryService from './categoryService';
import { connection } from './databaseService';
import notificationService from './notificationService';
import { RoadmapEntityServiceBase } from './roadmapEntityServiceBase';
import roadmapService from './roadmapService';

class TaskService extends RoadmapEntityServiceBase<Task> {
  constructor(user: User) {
    super(Task, user);
  }

  public async save(task: Task) {
    const taskInstance = new Task(task);
    taskInstance.userId = this.user!.id;

    const res = await categoryService(this.user).getById(task.categoryId);

    if (!res || res.roadmapId !== task.roadmapId) {
      throw new HttpError(resources.Task_CategoryNotFound, 400);
    }

    const roadmap: Roadmap = await roadmapService(this.user).getById(task.roadmapId);
    if (moment(task.endDate).isAfter(roadmap.endDate) ||
        moment(task.endDate).isBefore(roadmap.startDate) ||
        moment(task.startDate).isAfter(roadmap.endDate) ||
        moment(task.startDate).isBefore(roadmap.startDate)) {
      throw new HttpError(resources.Generic_ValidationError, 400);
    }

    return super.save(taskInstance);
  }

  public async complete(id: number, revert: boolean) {
    const task = await super.getById(id);
    await super.canEdit(task.roadmapId);
    await connection()
      .manager
      .update(Task, { id }, { isCompleted: !revert });

    if (!revert && this.user.id !== task.userId) {
      await notificationService().sendNotification(task.userId, {
        title: `Task completed`,
        body: `${task.title} was completed by ${this.user.name}`,
        url: `/#/timeline/${task.roadmapId}`
      });
    }
  }
}

export default (user: User) => new TaskService(user);
