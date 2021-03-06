import { IsDateString, IsDefined, Length } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IRoadmapEntity } from './IRoadmapEntity';
import { OwnedEntity } from './ownedEntity';
import { Roadmap } from './roadmap';

@Entity()
export class Milestone extends OwnedEntity implements IRoadmapEntity {
  @Column()
  @IsDefined()
  @Length(3)
  public title: string;

  @Column({ type: Date })
  @IsDateString()
  public date: Date;

  @Column({ default: '#1eb980' })
  @IsDefined()
  public color: string;

  @Column()
  @IsDefined()
  public roadmapId: number;

  @ManyToOne(() => Roadmap, { onDelete: 'CASCADE' })
  public roadmap: Roadmap;
}
