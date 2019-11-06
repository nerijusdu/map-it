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
    .getById(req.params.id, { relations: ['category', 'roadmap']})
    .then((result) => res.send(result))
    .catch(next);
});

router.post('/', (req, res, next) => {
  taskService(req.user)
    .save(req.body)
    .then((result) => res.send(result))
    .catch(next);
});

router.put('/:id', (req, res, next) => {
  taskService(req.user)
    .update(req.params.id, req.body)
    .then((result) => res.send(result))
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  taskService(req.user)
    .delete(req.params.id)
    .then((result) => res.send(result))
    .catch(next);
});

router.get('/:id/complete', (req, res, next) => {
  taskService(req.user)
    .complete(req.params.id, req.query.revert)
    .then((result) => res.send(result))
    .catch(next);
});

export const TaskController = router;
