import { IsDateString, IsDefined, IsOptional, Length } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Category } from './category';
import { IRoadmapEntity } from './IRoadmapEntity';
import { OwnedEntity } from './ownedEntity';
import { Roadmap } from './roadmap';

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
  @IsDateString()
  public startDate: Date;

  @Column({ type: Date })
  @IsDateString()
  public endDate: Date;

  @Column({ default: false })
  public isCompleted: boolean;

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
