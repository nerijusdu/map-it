import { HttpError, Roadmap, User } from '../models';
import resources from '../resources';
import { connection } from './databaseService';
import { EntityServiceBase } from './entityServiceBase';

class RoadmapService extends EntityServiceBase<Roadmap> {
  constructor(user?: User) {
    super(Roadmap, user);
  }

  public async getById(id: number, options?: any): Promise<any> {
    const roadmap = await connection().createQueryBuilder(Roadmap, 'roadmaps')
      .leftJoinAndSelect('roadmaps.tasks', 'tasks')
      .leftJoinAndSelect('roadmaps.categories', 'categories')
      .leftJoinAndSelect('roadmaps.milestones', 'milestones')
      .where('roadmaps.id = :id and roadmaps.user = :userId', { id, userId: this.user!.id })
      .orderBy('roadmaps.id', 'ASC')
      .addOrderBy('categories.id', 'ASC')
      .addOrderBy('tasks.id', 'ASC')
      .getOne();

    if (!roadmap) {
      throw new HttpError(resources.Generic_EntityNotFound(this.entity.name), 400);
    }

    return roadmap;
  }

  public save(roadmap: Roadmap) {
    const roadmapInstance = new Roadmap(roadmap);
    roadmapInstance.userId = this.user!.id;

    return super.save(roadmapInstance);
  }
}

export default (user?: User) => new RoadmapService(user);
