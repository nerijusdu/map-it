import { Task, User } from "../models";
import { EntityServiceBase } from "./entityServiceBase";
import roadmapService from "./roadmapService";

class TaskService extends EntityServiceBase<Task> {
  constructor(user?: User) {
    super(Task, user);
  }

  public save(task: Task) {
    return roadmapService(this.user)
      .getById(task.roadmapId)
      .then(() => super.save(task));
  }
}

export default (user?: User) => new TaskService(user);
