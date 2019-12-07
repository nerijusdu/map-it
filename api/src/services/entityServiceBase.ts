import validate from '../helpers/validate';
import { HttpError, User } from '../models';
import resources from '../resources';
import { connection } from './databaseService';

export class EntityServiceBase<TEntity> {
  // tslint:disable-next-line:ban-types
  constructor(protected entity: Function, protected user?: User) {
  }

  public getAll(options?: any) {
    options = options || {};
    return connection()
      .manager
      .find(this.entity, {
        where: {
          userId: this.user!.id
        },
        order: {
          id: 'ASC'
        },
        ...options
      });
  }

  public async getById(id: number, options?: any) {
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

  public async update(id: number, entity: TEntity) {
    await validate(entity);
    return connection().manager.update(this.entity, { id, userId: this.user!.id }, entity);
  }

  public delete(id: number) {
    return connection()
      .manager
      .delete(this.entity, { id, userId: this.user!.id });
  }
}
