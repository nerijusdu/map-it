import { IsDefined, IsEmail, IsOptional, Length } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import authService from '../services/util/authService';
import { EntityBase } from './entityBase';
import { Roadmap } from './roadmap';
import { RoadmapUser } from './roadmapUser';

@Entity()
export class User extends EntityBase {

  @Column({ unique: true })
  @IsEmail()
  @IsDefined()
  public email: string;

  @Column({ select: false, nullable: true })
  @Length(6)
  public password?: string;

  @Column({ unique: true, nullable: true })
  @IsOptional()
  public uniqueIdentifier?: string;

  @Column({ nullable: true })
  public authCode?: string;

  @Column()
  @Length(3)
  @IsDefined()
  public name: string;

  @Column({ default: false })
  public isAdmin: boolean;

  @Column({ nullable: true, select: false })
  @IsOptional()
  public refreshToken?: string;

  @OneToMany(() => Roadmap, roadmap => roadmap.user)
  public roadmaps: Roadmap[];

  @OneToMany(() => RoadmapUser, ru => ru.user)
  public sharedRoadmaps: RoadmapUser[];

  public comparePasswords = (input: string) => {
    return authService.verifyPassword(input, this.password!);
  }
}
