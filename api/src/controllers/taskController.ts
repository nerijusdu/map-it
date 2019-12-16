import crudRouter from '../helpers/crudRouter';
import respose from '../helpers/respose';
import taskService from '../services/taskService';

const router = crudRouter(taskService, ['category', 'roadmap']);

router.get('/:id/complete', respose(async (req, res) => {
  await taskService(req.user!).complete(req.params.id, req.query.revert);
  return res.json({});
}));

export const TaskController = router;
