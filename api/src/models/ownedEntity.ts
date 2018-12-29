import { IsDefined } from 'class-validator';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';

@Entity()
export class OwnedEntity {

  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn()
  public createdOn: Date;

  @Column()
  @IsDefined()
  public userId: number;

  @ManyToOne(() => User)
  public user: User;

  constructor(obj?: OwnedEntity) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}
