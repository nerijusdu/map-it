import { Column, Entity, ManyToOne } from 'typeorm';
import { EntityBase } from './entityBase';
import { Roadmap } from './roadmap';
import { User } from './user';

@Entity()
export class RoadmapUser extends EntityBase {
  @Column()
  public roadmapId: number;

  @ManyToOne(() => Roadmap, roadmap => roadmap.roadmapUsers, { onDelete: 'CASCADE' })
  public roadmap: Roadmap;

  @Column()
  public userId: number;

  @ManyToOne(() => User, user => user.sharedRoadmaps)
  public user: User;

  @Column({ default: false })
  public readonly?: boolean;
}
