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

  public getById(id: number, options?: any) {
    options = options || {};
    return connection()
      .manager
      .findOne(this.entity, id, { where: { userId: this.user!.id }, ...options })
      .then((res) => {
        if (!res) {
          throw new HttpError(resources.Generic_EntityNotFound(this.entity.name), 400);
        }
        return res;
      });
  }

  public save(entity: TEntity) {
    return validate(entity)
      .then(() => connection().manager.save(this.entity, entity));
  }

  public delete(id: number) {
    return connection()
      .manager
      .delete(this.entity, { id, userId: this.user!.id });
  }
}
