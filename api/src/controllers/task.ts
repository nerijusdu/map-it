import { Router } from 'express';
import taskService from '../services/taskService';

const router = Router();

router.get('/', (req, res, next) => {
  taskService(req.user)
    .getAll()
    .then((response) => res.send(response))
    .catch(next);
});

router.get('/:id', (req, res, next) => {
  taskService(req.user)
    .getById(req.params.id)
    .then((result) => res.send(result))
    .catch(next);
});

export const TaskController = router;
