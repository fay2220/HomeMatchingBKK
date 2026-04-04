import { Router } from 'express';
import { scoreController } from '../controllers/score.controller.ts';

const router = Router();

// POST /api/score
router.post('/', scoreController);

export default router;
