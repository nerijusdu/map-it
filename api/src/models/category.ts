import { IsDefined, IsOptional, Length } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { OwnedEntity } from './ownedEntity';
import { Roadmap } from './roadmap';

@Entity()
export class Category extends OwnedEntity {

  @Column()
  @IsDefined()
  @Length(3)
  public title: string;

  @Column({ nullable: true })
  @Length(0, 2000)
  @IsOptional()
  public description: string;

  @Column()
  @IsDefined()
  public color: string;

  @Column({ nullable: true })
  @IsOptional()
  public parentCategoryId?: number;

  @ManyToOne(() => Category, { onDelete: 'CASCADE', nullable: true })
  public parentCategory?: Category;

  @Column()
  @IsDefined()
  public roadmapId: number;

  @ManyToOne(() => Roadmap, { onDelete: 'CASCADE' })
  public roadmap: Roadmap;
}
