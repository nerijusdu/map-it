import { Router } from 'express';
import notificationService from '../services/notificationService';
import response from '../utils/response';

const router = Router();

router.post('/subscribe', response(async (req, res) => {
  await notificationService(req.user!).subscribe(req.body);
  return res.json({});
}));

router.post('/unsubscribe', response(async (req, res) => {
  await notificationService().unsubscribe(req.body);
  return res.json({});
}, { isPublic: true }));

export default router;
