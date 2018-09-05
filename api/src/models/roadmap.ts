import { Column, Entity } from "typeorm";
import { OwnedEntity } from "./ownedEntity";

@Entity()
export class Roadmap extends OwnedEntity {
  @Column()
  public title: string;

  @Column({nullable: true})
  public description: string;
}
