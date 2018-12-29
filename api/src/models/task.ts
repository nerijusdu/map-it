import { IsDateString, IsDefined, IsOptional, Length } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Category } from './category';
import { OwnedEntity } from './ownedEntity';
import { Roadmap } from './roadmap';

@Entity()
export class Task extends OwnedEntity {

  @Column()
  @IsDefined()
  @Length(3)
  public title: string;

  @Column({ nullable: true })
  @Length(0, 500)
  @IsOptional()
  public description: string;

  @Column({ type: Date })
  @IsDateString()
  public startDate: Date;

  @Column({ type: Date })
  @IsDateString()
  public endDate: Date;

  @Column()
  @IsDefined()
  public roadmapId: number;

  @ManyToOne(() => Roadmap)
  public roadmap: Roadmap;

  @Column()
  @IsDefined()
  public categoryId: number;

  @ManyToOne(() => Category)
  public category: Category;
}
