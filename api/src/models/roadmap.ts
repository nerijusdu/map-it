import { Column, Entity, OneToMany } from "typeorm";
import { OwnedEntity } from "./ownedEntity";
import { Task } from "./task";

@Entity()
export class Roadmap extends OwnedEntity {
  @Column()
  public title: string;

  @Column({nullable: true})
  public description: string;

  @OneToMany(() => Task, (task) => task.roadmap)
  public tasks: Task[];
}
