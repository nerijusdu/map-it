import { Router } from 'express';
import notificationService from '../services/notificationService';
import respose from '../utils/respose';

const router = Router();

router.post('/subscribe', respose(async (req, res) => {
  await notificationService(req.user!).subscribe(req.body);
  return res.json({});
}));

router.get('/test', respose(async (req, res) => {
  const result = await notificationService().sendNotification(req.query.user, {
    title: 'test push',
    body: 'have some content',
    url: '/#/roadmaps'
  });
  return res.json({ success: result });
}));

export default router;
