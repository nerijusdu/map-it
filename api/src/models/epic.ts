import { IsDefined, IsOptional, Length } from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Category } from './category';
import { IRoadmapEntity } from './IRoadmapEntity';
import { OwnedEntity } from './ownedEntity';
import { Roadmap } from './roadmap';

@Entity()
export class Epic extends OwnedEntity implements IRoadmapEntity {

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

  @OneToMany(() => Category, category => category.epic)
  public categories: Category[];

  @Column()
  @IsDefined()
  public roadmapId: number;

  @ManyToOne(() => Roadmap, { onDelete: 'CASCADE' })
  public roadmap: Roadmap;
}
