import type { Request, Response } from 'express';
import { calculateLifeFitScore, getScoreLabel } from '../service/lifefitEngine.js';
import type { UserProfile, PropertyData } from '../models/types.js';

export async function scoreController(req: Request, res: Response): Promise<void> {
    const { userProfile, property } = req.body as {
        userProfile: UserProfile;
        property: PropertyData;
    };

    if (!userProfile || !property) {
        res.status(400).json({ error: 'Missing required fields: userProfile, property' });
        return;
    }

    try {
        const breakdown = calculateLifeFitScore(userProfile, property);
        const label = getScoreLabel(breakdown.total);

        res.json({
            score: breakdown.total,
            label,
            passed: breakdown.passed,
            breakdown: {
                health:    breakdown.health,
                budget:    breakdown.budget,
                family:    breakdown.family,
                pet:       breakdown.pet,
                lifestyle: breakdown.lifestyle,
            },
            ...(breakdown.failReason ? { failReason: breakdown.failReason } : {}),
        });
    } catch (err) {
        console.error('[ScoreController] Error:', err);
        res.status(500).json({ error: 'Internal scoring engine error' });
    }
}
