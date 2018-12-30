import { HttpError, Task, User } from '../models';
import resources from '../resources';
import categoryService from './categoryService';
import { EntityServiceBase } from './entityServiceBase';

class TaskService extends EntityServiceBase<Task> {
  constructor(user?: User) {
    super(Task, user);
  }

  public save(task: Task) {
    const taskInstance = new Task(task);
    taskInstance.userId = this.user!.id;

    return categoryService(this.user)
      .getAll({
        id: task.categoryId,
        roadmapId: task.roadmapId
      })
      .then((res) => {
        if (!res || res.length === 0) {
          throw new HttpError(resources.Task_CategoryNotFound, 400);
        }
        return super.save(taskInstance);
      });
  }
}

export default (user?: User) => new TaskService(user);
