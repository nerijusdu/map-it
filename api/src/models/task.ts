import { Column, Entity, ManyToOne } from "typeorm";
import { OwnedEntity } from "./ownedEntity";
import { Roadmap } from "./roadmap";

@Entity()
export class Task extends OwnedEntity {
  @Column()
  public title: string;

  @Column({ nullable: true })
  public description: string;

  @Column({ type: Date })
  public startDate: Date;

  @Column({ type: Date })
  public endDate: Date;

  @Column({ nullable: true })
  public roadmapId: number;

  @ManyToOne(() => Roadmap)
  public roadmap: Roadmap;
}
