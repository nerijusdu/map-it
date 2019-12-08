import { Milestone, User } from '../models';
import { RoadmapEntityServiceBase } from './roadmapEntityServiceBase';

class MilestoneService extends RoadmapEntityServiceBase<Milestone> {
  constructor(user: User) {
    super(Milestone, user);
  }
}

export default (user: User) => new MilestoneService(user);
