import { Router } from 'express';
import respose from '../utils/respose';

const router = Router();

router.get('/', respose(async (req, res) => {
  res.json();
}));

export default router;
