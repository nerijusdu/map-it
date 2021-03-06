import { IsDateString, IsDefined, IsOptional, Length } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { Category } from './category';
import { Epic } from './epic';
import { Milestone } from './milestone';
import { OwnedEntity } from './ownedEntity';
import { RoadmapUser } from './roadmapUser';
import { Task } from './task';

@Entity()
export class Roadmap extends OwnedEntity {

  @Column()
  @IsDefined()
  @Length(3)
  public title: string;

  @Column({nullable: true})
  @Length(0, 2000)
  @IsOptional()
  public description: string;

  @Column({ type: Date })
  @IsDateString()
  @IsDefined()
  public startDate: Date;

  @Column({ type: Date })
  @IsDateString()
  @IsDefined()
  public endDate: Date;

  @OneToMany(() => Task, task => task.roadmap)
  public tasks: Task[];

  @OneToMany(() => Category, category => category.roadmap)
  public categories: Category[];

  @OneToMany(() => Milestone, milestone => milestone.roadmap)
  public milestones: Milestone[];

  @OneToMany(() => Epic, epic => epic.roadmap)
  public epics: Epic[];

  @OneToMany(() => RoadmapUser, roadmapUser => roadmapUser.roadmap)
  public roadmapUsers: RoadmapUser[];

  public readonly?: boolean;
}
