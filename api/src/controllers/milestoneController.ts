import { Router } from 'express';
import respose from '../helpers/respose';
import milestoneService from '../services/milestoneService';

const router = Router();

router.get('/', respose(async (req, res) => {
  const result = await milestoneService(req.user).getAll();
  return res.json(result);
}));

router.get('/:id', respose(async (req, res) => {
  const result = await milestoneService(req.user).getById(req.params.id, {
    relations: ['roadmap']
  });
  return res.json(result);
}));

router.post('/', respose(async (req, res) => {
  const result = await milestoneService(req.user).save(req.body);
  return res.json(result);
}));

router.delete('/:id', respose(async (req, res) => {
  const result = await milestoneService(req.user).delete(req.params.id);
  return res.json(result);
}));

export const MilestoneController = router;
