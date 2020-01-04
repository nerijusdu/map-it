import { Router } from 'express';
import notificationService from '../services/notificationService';
import respose from '../utils/respose';

const router = Router();

router.post('/subscribe', respose(async (req, res) => {
  await notificationService(req.user!).subscribe(req.body);
  return res.json({});
}));

router.post('/unsubscribe', respose(async (req, res) => {
  await notificationService().unsubscribe(req.body);
  return res.json({});
}));

export default router;
