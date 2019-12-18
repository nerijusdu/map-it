import { Router } from 'express';
import userService from '../services/userService';
import respose from '../utils/respose';

const router = Router();

router.get('/', respose(async (req, res) => {
  const result = await userService(req.user!).getAll(req.query);
  return res.json(result);
}));

export const UserController = router;
