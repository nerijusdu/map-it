import { Column, Entity } from 'typeorm';
import { OwnedEntity } from './ownedEntity';

@Entity()
export class UserNotification extends OwnedEntity {

  @Column()
  public endpoint: string;

  @Column()
  public p256dhKey: string;

  @Column()
  public authKey: string;
}
