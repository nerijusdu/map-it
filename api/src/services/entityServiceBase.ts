import { DeleteResult, FindManyOptions, FindOneOptions } from 'typeorm';
import validate from '../helpers/validate';
import { HttpError, User } from '../models';
import { OwnedEntity } from '../models/ownedEntity';
import resources from '../resources';
import { connection } from './databaseService';

export class EntityServiceBase<TEntity extends OwnedEntity> implements IEntityServiceBase<TEntity> {
  // tslint:disable-next-line:ban-types
  constructor(protected entity: Function, protected user?: User) {
  }

  public getAll(options?: FindManyOptions<TEntity>) {
    options = options || {};
    return connection()
      .manager
      .find<TEntity>(this.entity, {
        where: {
          userId: this.user!.id
        },
        order: {
          id: 'ASC'
        },
        ...options
      });
  }

  public async getById(id: number, options?: FindOneOptions<TEntity>) {
    options = options || {};
    const res = await connection()
      .manager
      .findOne<TEntity>(this.entity, id, { where: { userId: this.user!.id }, ...options });

    if (!res) {
      throw new HttpError(resources.Generic_EntityNotFound(this.entity.name), 400);
    }
    return res;
  }

  public async save(entity: TEntity) {
    await validate(entity);
    return connection().manager.save(this.entity, entity);
  }

  public async delete(id: number) {
    const entity = await this.getById(id);
    return connection().manager.remove(entity);
  }
}

export interface IEntityServiceBase<TEntity> {
  getAll: (options?: FindOneOptions<TEntity>) => Promise<TEntity[]>;
  getById: (id: number, options?: FindOneOptions<TEntity>) => Promise<TEntity>;
  save: (entity: TEntity) => Promise<TEntity>;
  delete: (id: number) => Promise<TEntity>;
}
