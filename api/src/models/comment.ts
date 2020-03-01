import { IsDefined, Length } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { OwnedEntity } from './ownedEntity';
import { Task } from './task';

@Entity()
export class Comment extends OwnedEntity {

  @Column()
  @Length(3, 2000)
  @IsDefined()
  public text: string;

  @Column()
  @IsDefined()
  public taskId: number;

  @ManyToOne(() => Task, { onDelete: 'CASCADE' })
  public task: Task;
}
