import { Router } from 'express';
import respose from '../helpers/respose';
import taskService from '../services/taskService';

const router = Router();

router.get('/', respose(async (req, res) => {
  const result = await taskService(req.user).getAll();
  return res.json(result);
}));

router.get('/:id', respose(async (req, res) => {
  const result = await taskService(req.user).getById(req.params.id, {
    relations: ['category', 'roadmap']
  });
  return res.json(result);
}));

router.post('/', respose(async (req, res) => {
  const result = await taskService(req.user).save(req.body);
  return res.json(result);
}));

router.delete('/:id', respose(async (req, res) => {
  const result = await taskService(req.user).delete(req.params.id);
  return res.json(result);
}));

router.get('/:id/complete', respose(async (req, res) => {
  await taskService(req.user).complete(req.params.id, req.query.revert);
  return res.json({});
}));

export const TaskController = router;
