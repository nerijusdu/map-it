import { Router } from 'express';
import respose from '../helpers/respose';
import categoryService from '../services/categoryService';

const router = Router();

router.get('/', respose(async (req, res) => {
  const result = await categoryService(req.user).getAll();
  return res.json(result);
}));

router.get('/:id', respose(async (req, res) => {
  const result = await categoryService(req.user).getById(req.params.id, {
    relations: ['roadmap']
  });
  return res.json(result);
}));

router.post('/', respose(async (req, res) => {
  const result = await categoryService(req.user).save(req.body);
  return res.json(result);
}));

router.delete('/:id', respose(async (req, res) => {
  const result = await categoryService(req.user).delete(req.params.id);
  return res.json(result);
}));

export const CategoryController = router;
