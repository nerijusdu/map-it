import { Milestone, User } from '../models';
import { EntityServiceBase } from './entityServiceBase';
import roadmapService from './roadmapService';

class MilestoneService extends EntityServiceBase<Milestone> {
  constructor(user?: User) {
    super(Milestone, user);
  }

  public async save(milestone: Milestone) {
    const milestoneInstance = new Milestone(milestone);
    milestoneInstance.userId = this.user!.id;

    await roadmapService(this.user).getById(milestone.roadmapId);
    return super.save(milestoneInstance);
  }
}

export default (user?: User) => new MilestoneService(user);
