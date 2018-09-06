import { HttpError, User } from "../models";
import { connection } from "./databaseService";

export class EntityServiceBase<TEntity> {
  // tslint:disable-next-line:ban-types
  constructor(protected entity: Function, protected user?: User) {
  }

  public getAll(options?: any) {
    options = options || {};
    return connection()
      .manager
      .find(this.entity, { userId: this.user!.id, ...options });
  }

  public getById(id: number, options?: any) {
    options = options || {};
    return connection()
      .manager
      .findOne(this.entity, id, { where: { userId: this.user!.id }, ...options })
      .then((res) => {
        if (!res) {
          throw new HttpError(this.entity.name + ' not found', 400);
        }
        return res;
      });
  }

  public save(entity: TEntity) {
    return connection()
      .manager
      .save(this.entity, entity)
      .catch(() => {
        throw new HttpError("Request data is incorrect.", 400);
      });
  }

  public delete(id: number) {
    return connection()
      .manager
      .delete(this.entity, { id, userId: this.user!.id });
  }
}
