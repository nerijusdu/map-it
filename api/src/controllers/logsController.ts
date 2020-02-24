import { Router } from 'express';
import logsService from '../services/logsService';
import response from '../utils/response';

const router = Router();

router.get('/', response(async (req, res) => {
  const result = await logsService().getAll(req.query);
  return res.json(result);
}, { isAdmin: true }));

router.get('/:log_id', response(async (req, res) => {
  const result = await logsService().getById(req.params.log_id);
  return res.json(result);
}, { isAdmin: true }));

router.delete('/', response(async (res, req) => {
  await logsService().clear();
  return req.json({});
}, { isAdmin: true }));

export default router;
