import { Request, Response, Router } from 'express';
import { User } from '../models';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  User
    .findById(req.user!._id)
    .select('roadmaps')
    .populate('roadmaps')
    .then((response) => res.send(response!.roadmaps));
});

export const RoadmapController = router;
