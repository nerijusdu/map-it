import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import authService from "../services/authService";
import { EntityBase } from "./entityBase";
import { Roadmap } from "./roadmap";

@Entity()
export class User extends EntityBase {
  @Column()
  public email: string;

  @Column()
  public password: string;

  @OneToMany(() => Roadmap, (roadmap) => roadmap.user)
  public roadmaps: Roadmap[];

  public comparePasswords = (input: string) => {
    return authService.verifyPassword(input, this.password);
  }
}
