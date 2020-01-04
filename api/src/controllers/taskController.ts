import taskService from '../services/taskService';
import crudRouter from '../utils/crudRouter';
import response from '../utils/response';

const router = crudRouter(taskService, ['category', 'roadmap']);

router.get('/:id/complete', response(async (req, res) => {
  await taskService(req.user!).complete(req.params.id, req.query.revert === 'true');
  return res.json({});
}));

export default router;
