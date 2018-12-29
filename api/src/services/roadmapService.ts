import { Roadmap, User } from '../models';
import { EntityServiceBase } from './entityServiceBase';

class RoadmapService extends EntityServiceBase<Roadmap> {
  constructor(user?: User) {
    super(Roadmap, user);
  }

  public save(roadmap: Roadmap) {
    const roadmapInstance = new Roadmap(roadmap);
    roadmapInstance.userId = this.user!.id;

    return super.save(roadmapInstance);
  }
}

export default (user?: User) => new RoadmapService(user);
