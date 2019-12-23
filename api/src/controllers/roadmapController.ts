import roadmapService from '../services/roadmapService';
import crudRouter from '../utils/crudRouter';
import respose from '../utils/respose';

const router = crudRouter(roadmapService);

router.post('/assign', respose(async (req, res) => {
  const result = await roadmapService(req.user!).assignUser(req.body);
  return res.json(result);
}));

export default router;
