import { Router } from 'express';
import logsService from '../services/logsService';
import respose from '../utils/respose';

const router = Router();

router.get('/', respose(async (req, res) => {
  const result = await logsService().getAll(req.query);
  return res.json(result);
}));

router.get('/:log_id', respose(async (req, res) => {
  const result = await logsService().getById(req.params.log_id);
  return res.json(result);
}));

export default router;
