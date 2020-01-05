import roadmapService from '../services/roadmapService';
import crudRouter from '../utils/crudRouter';
import response from '../utils/response';

const router = crudRouter(roadmapService);

router.post('/assign', response(async (req, res) => {
  const result = await roadmapService(req.user!).assignUser(req.body);
  return res.json(result);
}));

export default router;
