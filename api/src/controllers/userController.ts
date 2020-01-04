import { Router } from 'express';
import userService from '../services/userService';
import response from '../utils/response';

const router = Router();

router.get('/', response(async (req, res) => {
  const result = await userService(req.user!).getAll(req.query);
  return res.json(result);
}));

export default router;
