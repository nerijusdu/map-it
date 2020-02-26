import taskService from '../services/taskService';
import crudRouter from '../utils/crudRouter';
import response from '../utils/response';

const router = crudRouter(taskService, ['category', 'roadmap']);

// TODO: use PUT method
router.get('/:id/complete', response(async (req, res) => {
  await taskService(req.user!).complete(req.params.id, req.query.revert === 'true');
  return res.json({});
}));

router.put('/:taskId/assign/:userId', response(async (req, res) => {
  await taskService(req.user!).assign(req.params.taskId, req.params.userId);
  return res.json({});
}));

router.put('/:taskId/unassign', response(async (req, res) => {
  await taskService(req.user!).assign(req.params.taskId);
  return res.json({});
}));

export default router;
