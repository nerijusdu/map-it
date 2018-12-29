import { Column, Entity, ManyToOne } from 'typeorm';
import { EntityBase } from './entityBase';
import { Roadmap } from './roadmap';

@Entity()
export class Category extends EntityBase {
  @Column()
  public title: string;

  @Column()
  public color: string;

  @Column()
  public roadmapId: number;

  @ManyToOne(() => Roadmap)
  public roadmap: Roadmap;
}
