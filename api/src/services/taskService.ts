import moment from 'moment';
import { Comment, HttpError, Roadmap, Task, User } from '../models';
import resources from '../resources';
import validate from '../utils/validate';
import accountService from './accountService';
import categoryService from './categoryService';
import notificationService from './notificationService';
import { RoadmapEntityServiceBase } from './roadmapEntityServiceBase';
import roadmapService from './roadmapService';
import { connection } from './util/databaseService';

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

    taskInstance.startDate = new Date(task.startDate);
    taskInstance.endDate = new Date(task.endDate);

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

  public getByName(name: string) {
    return this.getAllQuery()
      .andWhere('LOWER(entity.title) LIKE LOWER(:title)', { title: `${name}%`})
      .getOne();
  }

  public async assign(taskId: number, userId?: number) {
    const task = await this.getById(taskId);
    if (!userId) {
      await connection().manager.update(Task, { id: task.id }, { assigneeId: undefined });
      return;
    }

    const user = await accountService().getById(userId);

    await this.canEdit(task.roadmapId, user.id);

    await connection().manager.update(Task, { id: task.id }, { assigneeId: user.id });
  }

  public async getComments(taskId: number) {
    const taskWithComments = await this.getByIdQuery(taskId)
      .leftJoinAndSelect('entity.comments', 'comment')
      .leftJoin('comment.user', 'user')
      .addSelect('user.name')
      .addSelect('user.email')
      .getOne();

    if (!taskWithComments) {
      throw new HttpError(resources.Generic_EntityNotFound(this.entity.name), 400);
    }

    return taskWithComments.comments;
  }

  public async postComment(comment: Comment) {
    const newComment = new Comment(comment);
    newComment.userId = this.user.id;
    const task = await this.getById(newComment.taskId);

    await validate(newComment);
    await this.canEdit(task.roadmapId);

    const savedComment = await connection().manager.save(newComment);
    return connection().createQueryBuilder<Comment>(Comment, 'comment')
      .where('comment.id = :id', { id: savedComment.id })
      .innerJoin('comment.user', 'user')
      .addSelect('user.name')
      .addSelect('user.email')
      .getOne();
  }
}

export default (user: User) => new TaskService(user);
