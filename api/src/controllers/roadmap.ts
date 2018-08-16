import { Router } from 'express';
import { Roadmap } from '../models';

const router = Router();

router.get('/', (req, res) => {
  Roadmap
    .find({ ownerId: req.user!._id })
    .select('-categories -tasks')
    .then((response) => res.send(response));
});

router.get('/:id', (req, res) => {
  Roadmap
    .findById(req.params.id)
    .where({ ownerId: req.user!._id })
    .populate('tasks')
    .populate('categories')
    .then((response) => res.send(response));
});

export const RoadmapController = router;
