import { Router } from 'express';
import respose from '../helpers/respose';
import roadmapService from '../services/roadmapService';

const router = Router();

router.get('/', respose(async (req, res) => {
  const result = await roadmapService(req.user).getAll();
  return res.json(result);
}));

router.get('/:id', respose(async (req, res) => {
  const result = await roadmapService(req.user).getById(req.params.id);
  return res.json(result);
}));

router.post('/', respose(async (req, res) => {
  const result = await roadmapService(req.user).save(req.body);
  return res.json(result);
}));

router.put('/:id', respose(async (req, res) => {
  const result = await roadmapService(req.user).update(req.params.id, req.body);
  return res.json(result);
}));

router.delete('/:id', respose(async (req, res) => {
  const result = await roadmapService(req.user).delete(req.params.id);
  return res.json(result);
}));

export const RoadmapController = router;
