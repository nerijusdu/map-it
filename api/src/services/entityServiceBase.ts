import { FindOneOptions } from 'typeorm';

export interface IEntityServiceBase<TEntity> {
  getAll: (options?: FindOneOptions<TEntity>) => Promise<TEntity[]>;
  getById: (id: number, options?: FindOneOptions<TEntity>) => Promise<TEntity>;
  save: (entity: TEntity) => Promise<TEntity>;
  delete: (id: number) => Promise<TEntity>;
}
