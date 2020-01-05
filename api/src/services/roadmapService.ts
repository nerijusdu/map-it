import { HttpError, Roadmap, RoadmapUser, User } from '../models';
import resources from '../resources';
import validate from '../utils/validate';
import accountService from './accountService';
import { connection } from './databaseService';
import { IEntityServiceBase } from './entityServiceBase';
import notificationService from './notificationService';

class RoadmapService implements IEntityServiceBase<Roadmap> {
  constructor(private user: User) {
  }

  public async getAll() {
    const roadmaps = await connection().createQueryBuilder(Roadmap, 'roadmap')
      .leftJoinAndSelect('roadmap.roadmapUsers', 'ru')
      .where('roadmap.user = :userId OR ru.userId = :userId', { userId: this.user.id })
      .orderBy('roadmap.id', 'ASC')
      .getMany();

    return roadmaps.map((x) => ({
      ...x,
      readonly: x.roadmapUsers.some((y) => (Boolean)(y.userId === this.user.id && y.readonly))
    }));
  }

  public async getById(id: number): Promise<Roadmap> {
    const roadmap = await connection().createQueryBuilder<Roadmap>(Roadmap, 'roadmap')
      .leftJoinAndSelect('roadmap.tasks', 'tasks')
      .leftJoinAndSelect('roadmap.categories', 'categories')
      .leftJoinAndSelect('roadmap.milestones', 'milestones')
      .leftJoinAndSelect('roadmap.epics', 'epics')
      .leftJoinAndSelect('roadmap.roadmapUsers', 'ru')
      .leftJoinAndSelect('ru.user', 'roadmapUsers')
      .addSelect('roadmapUsers.id')
      .where('roadmap.id = :id AND (roadmap.user = :userId OR ru.userId = :userId)', { id, userId: this.user.id })
      .orderBy('epics.id', 'ASC')
      .addOrderBy('categories.epicId', 'ASC')
      .addOrderBy('categories.id', 'ASC')
      .addOrderBy('tasks.id', 'ASC')
      .getOne();

    if (!roadmap) {
      throw new HttpError(resources.Generic_EntityNotFound('Roadmap'), 400);
    }

    return {
      ...roadmap,
      readonly: roadmap.roadmapUsers.some((x) => (Boolean)(x.userId === this.user.id && x.readonly))
    };
  }

  public async getEntityById(id: number) {
    const roadmap = await connection().createQueryBuilder<Roadmap>(Roadmap, 'roadmap')
      .leftJoinAndSelect('roadmap.roadmapUsers', 'ru')
      .leftJoinAndSelect('ru.user', 'roadmapUsers')
      .addSelect('roadmapUsers.id')
      .where('roadmap.id = :id AND (roadmap.user = :userId OR ru.userId = :userId)', { id, userId: this.user.id })
      .getOne();

    if (!roadmap) {
      throw new HttpError(resources.Generic_EntityNotFound('Roadmap'), 400);
    }

    return roadmap;
  }

  public async save(entity: Roadmap) {
    await validate(entity);
    entity.userId = this.user.id;
    return connection().manager.save(Roadmap, entity);
  }

  public async delete(id: number) {
    const entity = await this.getEntityById(id);
    return connection().manager.remove(entity);
  }

  public async assignUser(data: IAddUserDto) {
    const roadmap: Roadmap = await this.getById(data.roadmapId);
    const user: User = await accountService(this.user).getById(data.userId);

    if (data.revert) {
      return connection().manager.delete(RoadmapUser, { roadmapId: data.roadmapId, userId: data.userId });
    }

    const roadmapUser = new RoadmapUser();
    roadmapUser.roadmap = roadmap;
    roadmapUser.user = user;
    roadmapUser.readonly = data.readonly;

    const result = await connection().manager.save(RoadmapUser, roadmapUser);
    if (result) {
      await notificationService().sendNotification(user.id, {
        title: 'New roadmap added',
        body: `You have been added to ${roadmap.title} roadmap by ${this.user.name}`,
        url: `/#/roadmaps/${roadmap.id}`
      });
    }

    return result;
  }
}

interface IAddUserDto {
  roadmapId: number;
  userId: number;
  readonly?: boolean;
  revert?: boolean;
}

export default (user: User) => new RoadmapService(user);
