import { IsDefined, IsEmail, Length } from "class-validator";
import { Column, Entity, OneToMany } from "typeorm";
import authService from "../services/authService";
import { EntityBase } from "./entityBase";
import { Roadmap } from "./roadmap";

@Entity()
export class User extends EntityBase {

  @Column({ unique: true })
  @IsEmail()
  @IsDefined()
  public email: string;

  @Column()
  @Length(6)
  @IsDefined()
  public password: string;

  @Column()
  @Length(3)
  @IsDefined()
  public name: string;

  @OneToMany(() => Roadmap, (roadmap) => roadmap.user)
  public roadmaps: Roadmap[];

  public comparePasswords = (input: string) => {
    return authService.verifyPassword(input, this.password);
  }
}
