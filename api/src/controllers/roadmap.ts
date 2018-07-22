import { Request, Response, Router } from 'express';
import Roadmap from '../models/roadmap';

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
    Roadmap
        .findOne()
        .then((response) => res.send(response));
});

export const RoadmapController: Router = router;
