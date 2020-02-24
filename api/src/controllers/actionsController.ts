import { Router } from 'express';
import googleActions from '../services/googleActionsService';

const router = Router();

router.post('/google', googleActions);

export default router;
