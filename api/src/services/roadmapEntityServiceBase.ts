import { FindManyOptions, FindOneOptions } from 'typeorm';
import validate from '../helpers/validate';
import { HttpError, User } from '../models';
import { IRoadmapEntity } from '../models/IRoadmapEntity';
import resources from '../resources';
import { connection } from './databaseService';
import { IEntityServiceBase } from './entityServiceBase';
import roadmapService from './roadmapService';

export class RoadmapEntityServiceBase<TEntity extends IRoadmapEntity> implements IEntityServiceBase<TEntity> {
  // tslint:disable-next-line: ban-types
  constructor(protected entity: Function, protected user: User) {
  }

  public getAll() {
    return this.getAllQuery().getMany();
  }

  public async getById(id: number, options?: FindOneOptions<TEntity>) {
    let query = this.getByIdQuery(id);
    if (options && options.relations) {
      options.relations.forEach((rel) => {
        if (rel === 'roadmap' || rel === 'roadmapUsers') {
          return;
        }
        query = query.leftJoinAndSelect(`entity.${rel}`, rel);
      });
    }
    const res = await query.getOne();

    if (!res) {
      throw new HttpError(resources.Generic_EntityNotFound(this.entity.name), 400);
    }
    return res;
  }

  public async save(entity: TEntity) {
    entity.userId = this.user.id;
    await validate(entity);
    await roadmapService(this.user).getById(entity.roadmapId);
    return connection().manager.save(this.entity, entity);
  }

  public async delete(id: number) {
    const entity = await this.getById(id);
    return connection().manager.remove(entity);
  }

  protected getAllQuery() {
    return connection().createQueryBuilder<TEntity>(this.entity, 'entity')
      .innerJoinAndSelect('entity.roadmap', 'roadmap')
      .leftJoin('roadmap.roadmapUsers', 'ru')
      .where('(roadmap.userId = :userId OR ru.userId = :userId)', { userId: this.user.id });
  }

  protected getByIdQuery(id: number) {
    return this.getAllQuery().andWhere('entity.id = :id', { id });
  }
}
