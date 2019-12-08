import { RequestHandler, Router } from 'express';
import { AnyEntity, User } from '../models';
import { IRoadmapEntity } from '../models/IRoadmapEntity';
import { IEntityServiceBase } from '../services/entityServiceBase';
import respose from './respose';

export default (entityService: (user: User) => IEntityServiceBase<any>,
                relations?: string[],
                overrides?: IOverrides) => {
  const router = Router();
  overrides = overrides || {};

  router.get('/', overrides.getAll || respose(async (req, res) => {
    const result = await entityService(req.user!).getAll();
    return res.json(result);
  }));

  router.get('/:id', overrides.get || respose(async (req, res) => {
    const result = await entityService(req.user!).getById(req.params.id, { relations });
    return res.json(result);
  }));

  router.post('/', overrides.post || respose(async (req, res) => {
    const result = await entityService(req.user!).save(req.body);
    return res.json(result);
  }));

  router.delete('/:id', overrides.delete || respose(async (req, res) => {
    const result = await entityService(req.user!).delete(req.params.id);
    return res.json(result);
  }));

  return router;
};

interface IOverrides {
  getAll?: RequestHandler;
  get?: RequestHandler;
  post?: RequestHandler;
  delete?: RequestHandler;
}
