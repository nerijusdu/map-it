import { Router, Request, Response } from 'express';

const router: Router = Router();

router.get('/:id', (req: Request, res: Response) => {
    res.send({
        id: req.params.id,
        title: 'Roadmap'
    });
});

export const RoadmapController: Router = router;