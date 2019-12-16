import { Router } from 'express';
import respose from '../helpers/respose';
import userService from '../services/userService';

const router = Router();

router.get('/', respose(async (req, res) => {
  const result = await userService(req.user!).getAll(req.query);
  return res.json(result);
}));

export const UserController = router;
