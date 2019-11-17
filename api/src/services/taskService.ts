import moment from 'moment';
import { HttpError, Roadmap, Task, User } from '../models';
import resources from '../resources';
import categoryService from './categoryService';
import { connection } from './databaseService';
import { EntityServiceBase } from './entityServiceBase';
import roadmapService from './roadmapService';

class TaskService extends EntityServiceBase<Task> {
  constructor(user?: User) {
    super(Task, user);
  }

  public async save(task: Task) {
    const taskInstance = new Task(task);
    taskInstance.userId = this.user!.id;

    const res = await categoryService(this.user)
      .getAll({
        where: {
          id: task.categoryId,
          roadmapId: task.roadmapId
        }
      });

    if (!res || res.length === 0) {
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

  public async update(id: number, updates: Task) {
    await super.getById(id);
    if (updates.roadmapId) {
      await roadmapService(this.user).getById(updates.roadmapId);
    }
    if (updates.categoryId) {
      await categoryService(this.user).getById(updates.categoryId);
    }
    delete updates.id;
    delete updates.userId;
    return super.update(id, updates);
  }

  public async complete(id: number, revert?: boolean) {
    await connection()
      .manager
      .update(Task, { id, userId: this.user!.id }, { isCompleted: !revert });
  }
}

export default (user?: User) => new TaskService(user);
