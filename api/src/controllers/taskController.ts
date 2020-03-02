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

router.get('/:taskId/comments', response(async (req, res) => {
  const result = await taskService(req.user!).getComments(req.params.taskId);
  return res.json(result);
}));

router.post('/:taskId/comments', response(async (req, res) => {
  const result = await taskService(req.user!).postComment({
    ...req.body,
    taskId: req.params.taskId
  });
  return res.json(result);
}));

export default router;
