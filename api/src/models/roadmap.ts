import { Column, Entity, OneToMany } from 'typeorm';
import { Category } from './category';
import { OwnedEntity } from './ownedEntity';
import { Task } from './task';

@Entity()
export class Roadmap extends OwnedEntity {
  @Column()
  public title: string;

  @Column({nullable: true})
  public description: string;

  @Column({ type: Date })
  public startDate: Date;

  @Column({ type: Date })
  public endDate: Date;

  @OneToMany(() => Task, (task) => task.roadmap)
  public tasks: Task[];

  @OneToMany(() => Category, (category) => category.roadmap)
  public categories: Category[];
}
