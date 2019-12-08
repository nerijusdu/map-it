import { Roadmap } from './roadmap';
import { User } from './user';

export interface IRoadmapEntity {
  id: number;
  roadmapId: number;
  roadmap: Roadmap;
  userId: number;
  user: User;
}
