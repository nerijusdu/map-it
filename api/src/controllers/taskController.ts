import taskService from '../services/taskService';
import crudRouter from '../utils/crudRouter';
import respose from '../utils/respose';

const router = crudRouter(taskService, ['category', 'roadmap']);

router.get('/:id/complete', respose(async (req, res) => {
  await taskService(req.user!).complete(req.params.id, req.query.revert);
  return res.json({});
}));

export default router;
