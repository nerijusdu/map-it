import { HttpError, Task, User } from '../models';
import resources from '../resources';
import categoryService from './categoryService';
import { EntityServiceBase } from './entityServiceBase';
import roadmapService from './roadmapService';

class TaskService extends EntityServiceBase<Task> {
  constructor(user?: User) {
    super(Task, user);
  }

  public save(task: Task) {
    const taskInstance = new Task(task);
    taskInstance.userId = this.user!.id;

    return categoryService(this.user)
      .getAll({
        where: {
          id: task.categoryId,
          roadmapId: task.roadmapId
        }
      })
      .then((res) => {
        if (!res || res.length === 0) {
          throw new HttpError(resources.Task_CategoryNotFound, 400);
        }
        return super.save(taskInstance);
      });
  }

  public async update(id: number, updates: Task) {
    await super.getById(id);
    if (updates.roadmapId) {
      roadmapService(this.user).getById(updates.roadmapId);
    }
    if (updates.categoryId) {
      categoryService(this.user).getById(updates.categoryId);
    }
    delete updates.id;
    delete updates.userId;
    return super.update(id, updates);
  }
}

export default (user?: User) => new TaskService(user);
