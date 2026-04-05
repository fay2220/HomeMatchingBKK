import { Router } from 'express';
import { scoreController, scoreAllController } from '../controllers/score.controller.js';

const router = Router();

// POST /api/score
router.post('/', scoreController);

// POST /api/score/all
router.post('/all', scoreAllController);

export default router;
