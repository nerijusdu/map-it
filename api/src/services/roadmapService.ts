import { HttpError, Roadmap, RoadmapUser, User } from '../models';
import resources from '../resources';
import accountService from './accountService';
import { connection } from './databaseService';
import { EntityServiceBase } from './entityServiceBase';

class RoadmapService extends EntityServiceBase<Roadmap> {
  constructor(user?: User) {
    super(Roadmap, user);
  }

  public async getAll() {
    return await connection().createQueryBuilder(Roadmap, 'roadmap')
      .leftJoin('roadmap.roadmapUsers', 'ru')
      .where('roadmap.user = :userId OR ru.userId = :userId', { userId: this.user!.id })
      .orderBy('roadmap.id', 'ASC')
      .getMany();
  }

  public async getById(id: number, options?: any): Promise<any> {
    const roadmap = await connection().createQueryBuilder(Roadmap, 'roadmap')
      .leftJoinAndSelect('roadmap.tasks', 'tasks')
      .leftJoinAndSelect('roadmap.categories', 'categories')
      .leftJoinAndSelect('roadmap.milestones', 'milestones')
      .leftJoinAndSelect('roadmap.epics', 'epics')
      .leftJoin('roadmap.roadmapUsers', 'ru')
      .where('roadmap.id = :id AND (roadmap.user = :userId OR ru.userId = :userId)', { id, userId: this.user!.id })
      .orderBy('epics.id', 'ASC')
      .addOrderBy('categories.epicId', 'ASC')
      .addOrderBy('categories.id', 'ASC')
      .addOrderBy('tasks.id', 'ASC')
      .getOne();

    if (!roadmap) {
      throw new HttpError(resources.Generic_EntityNotFound(this.entity.name), 400);
    }

    return roadmap;
  }

  public async assignUser(data: IAddUserDto) {
    const roadmap: Roadmap = await super.getById(data.roadmapId);
    const user: User = await accountService(this.user).getById(data.userId);
    const roadmapUser = new RoadmapUser();
    roadmapUser.roadmap = roadmap;
    roadmapUser.user = user;
    roadmapUser.readonly = data.readonly;

    return connection().manager.save(RoadmapUser, roadmapUser);
  }
}

interface IAddUserDto {
  roadmapId: number;
  userId: number;
  readonly?: boolean;
}

export default (user?: User) => new RoadmapService(user);
