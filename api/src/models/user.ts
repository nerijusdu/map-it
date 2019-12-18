import { IsDefined, IsEmail, IsOptional, Length } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import authService from '../services/authService';
import { EntityBase } from './entityBase';
import { Roadmap } from './roadmap';
import { RoadmapUser } from './roadmapUser';

@Entity()
export class User extends EntityBase {

  @Column({ unique: true })
  @IsEmail()
  @IsDefined()
  public email: string;

  @Column({ select: false })
  @Length(6)
  @IsDefined()
  public password: string;

  @Column()
  @Length(3)
  @IsDefined()
  public name: string;

  @Column({ default: false })
  public isAdmin: boolean;

  @Column({ nullable: true, select: false })
  @IsOptional()
  public refreshToken?: string;

  @OneToMany(() => Roadmap, (roadmap) => roadmap.user)
  public roadmaps: Roadmap[];

  @OneToMany(() => RoadmapUser, (ru) => ru.user)
  public sharedRoadmaps: RoadmapUser[];

  public comparePasswords = (input: string) => {
    return authService.verifyPassword(input, this.password);
  }
}
