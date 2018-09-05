import { HttpError, User } from "../models";
import { connection } from "./databaseService";

export class EntityServiceBase {
  constructor(protected entity: Function, protected user?: User) {
  }

  public getAll() {
    return connection()
      .manager
      .find(this.entity, { userId: this.user!.id });
  }

  public getById(id: number) {
    return connection()
      .manager
      .findOne(this.entity, id, { where: { userId: this.user!.id } })
      .then((res) => {
        if (!res) {
          throw new HttpError(this.entity.name + ' not found', 400);
        }
        return res;
      });
  }
}
