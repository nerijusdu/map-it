import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

@Entity()
export class OwnedEntity {

  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn()
  public createdOn: Date;

  @Column({ nullable: true })
  public userId: number;

  @ManyToOne(() => User)
  public user: User;
}
