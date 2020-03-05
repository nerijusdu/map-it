import { CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EntityBase {

  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn()
  public createdOn: Date;

  constructor(obj?: any) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}
