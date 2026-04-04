import { Router } from 'express';
import { scoreController } from '../controllers/score.controller.js';

const router = Router();

// POST /api/score
router.post('/', scoreController);

export default router;
