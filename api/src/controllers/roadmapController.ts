import { Router } from 'express';
import roadmapService from '../services/roadmapService';

const router = Router();

router.get('/', (req, res, next) => {
  roadmapService(req.user)
    .getAll()
    .then((response) => res.send(response))
    .catch(next);
});

router.get('/:id', (req, res, next) => {
  roadmapService(req.user)
    .getById(req.params.id, { relations: ["tasks"]})
    .then((result) => res.send(result))
    .catch(next);
});

export const RoadmapController = router;
