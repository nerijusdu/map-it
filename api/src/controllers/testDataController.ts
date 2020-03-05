import { Router } from 'express';
import testDataService from '../services/util/testDataService';
import response from '../utils/response';

const router = Router();

router.get('/seed', response(async (req, res) => {
  if (process.env.NODE_ENV === 'prod') {
    return res.status(404).send('<pre>Cannot GET /api/test-data/seed</pre>');
  }

  await testDataService().seed();
  return res.status(200).json();
}, { isPublic: true }));

export default router;
