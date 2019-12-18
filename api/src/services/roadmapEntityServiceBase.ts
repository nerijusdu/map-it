import { FindOneOptions } from 'typeorm';
import { HttpError, Roadmap, User } from '../models';
import { IRoadmapEntity } from '../models/IRoadmapEntity';
import resources from '../resources';
import validate from '../utils/validate';
import { connection } from './databaseService';
import { IEntityServiceBase } from './entityServiceBase';

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
    await this.canEdit(entity.roadmapId);
    return connection().manager.save(this.entity, entity);
  }

  public async delete(id: number) {
    const entity = await this.getById(id);
    await this.canEdit(entity.roadmapId);
    return connection().manager.remove(entity);
  }

  protected async canEdit(roadmapId: number) {
    const roadmap = await connection().createQueryBuilder<Roadmap>(Roadmap, 'roadmap')
      .leftJoinAndSelect('roadmap.roadmapUsers', 'ru')
      .where('roadmap.id = :id AND (roadmap.user = :userId OR ru.userId = :userId)',
        { id: roadmapId, userId: this.user.id })
      .getOne();

    if (!roadmap) {
      throw new HttpError(resources.Generic_EntityNotFound('Roadmap'), 400);
    }

    const roadmapUser = roadmap.roadmapUsers.find((x) => x.userId === this.user.id);
    if (roadmap.userId !== this.user.id && (!roadmapUser || !roadmapUser!.readonly)) {
      throw new HttpError(resources.Generic_ValidationError, 400);
    }
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
