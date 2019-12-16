import crudRouter from '../helpers/crudRouter';
import respose from '../helpers/respose';
import roadmapService from '../services/roadmapService';

const router = crudRouter(roadmapService);

router.post('/assign', respose(async (req, res) => {
  const result = await roadmapService(req.user!).assignUser(req.body);
  return res.json(result);
}));

export const RoadmapController = router;
