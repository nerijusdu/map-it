import { IsDate, IsDefined, IsOptional, Length } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Category } from './category';
import { IRoadmapEntity } from './IRoadmapEntity';
import { OwnedEntity } from './ownedEntity';
import { Roadmap } from './roadmap';
import { User } from './user';

@Entity()
export class Task extends OwnedEntity implements IRoadmapEntity {

  @Column()
  @IsDefined()
  @Length(3)
  public title: string;

  @Column({ nullable: true })
  @Length(0, 2000)
  @IsOptional()
  public description: string;

  @Column({ type: Date })
  @IsDate()
  public startDate: Date;

  @Column({ type: Date })
  @IsDate()
  public endDate: Date;

  @Column({ default: false })
  public isCompleted: boolean;

  @Column({ nullable: true })
  @IsOptional()
  public assigneeId?: number;

  @ManyToOne(() => User, { nullable: true })
  public assignee?: User;

  @Column()
  @IsDefined()
  public roadmapId: number;

  @ManyToOne(() => Roadmap, { onDelete: 'CASCADE' })
  public roadmap: Roadmap;

  @Column()
  @IsDefined()
  public categoryId: number;

  @ManyToOne(() => Category, { onDelete: 'CASCADE' })
  public category: Category;
}
