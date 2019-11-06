import { Roadmap, User } from '../models';
import { connection } from './databaseService';
import { EntityServiceBase } from './entityServiceBase';

class RoadmapService extends EntityServiceBase<Roadmap> {
  constructor(user?: User) {
    super(Roadmap, user);
  }

  public getById(id: number) {
    return connection().createQueryBuilder(Roadmap, 'roadmaps')
      .leftJoinAndSelect('roadmaps.tasks', 'tasks')
      .leftJoinAndSelect('roadmaps.categories', 'categories')
      .where('roadmaps.id = :id and roadmaps.user = :userId', { id, userId: this.user!.id })
      .orderBy('roadmaps.id', 'ASC')
      .addOrderBy('categories.id', 'ASC')
      .addOrderBy('tasks.id', 'ASC')
      .getOne();
  }

  public save(roadmap: Roadmap) {
    const roadmapInstance = new Roadmap(roadmap);
    roadmapInstance.userId = this.user!.id;

    return super.save(roadmapInstance);
  }

  public async update(id: number, updates: Roadmap) {
    await super.getById(id);
    delete updates.id;
    delete updates.userId;
    return super.update(id, updates);
  }
}

export default (user?: User) => new RoadmapService(user);
