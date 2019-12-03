import { Router } from 'express';
import respose from '../helpers/respose';
import epicService from '../services/epicService';

const router = Router();

router.get('/', respose(async (req, res) => {
  const result = await epicService(req.user).getAll();
  return res.json(result);
}));

router.get('/:id', respose(async (req, res) => {
  const result = await epicService(req.user).getById(req.params.id, {
    relations: ['roadmap']
  });
  return res.json(result);
}));

router.post('/', respose(async (req, res) => {
  const result = await epicService(req.user).saveWithCategories(req.body, req.body.categoryIds);
  return res.json(result);
}));

router.delete('/:id', respose(async (req, res) => {
  const result = await epicService(req.user).delete(req.params.id);
  return res.json(result);
}));

export const EpicController = router;
