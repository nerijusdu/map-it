import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import authService from "../services/authService";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public email: string;

  @Column()
  public password: string;

  public comparePasswords = (input: string) => {
    return authService.verifyPassword(input, this.password);
  }
}
