import { Router } from 'express';
import { Task } from '../models';

const router = Router();

router.get('/:id', (req, res) => {
  Task
    .findById(req.params.id)
    .where({ ownerId: req.user!._id })
    .populate('category')
    .then((response) => res.send(response));
});

export const TaskController = router;
