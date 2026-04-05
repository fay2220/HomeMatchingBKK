import { calculateLifeFitScore, getScoreLabel } from '../service/lifefitEngine.js';
export async function scoreController(req, res) {
    const { userProfile, property } = req.body;
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
                health: breakdown.health,
                budget: breakdown.budget,
                family: breakdown.family,
                pet: breakdown.pet,
                lifestyle: breakdown.lifestyle,
            },
            ...(breakdown.failReason ? { failReason: breakdown.failReason } : {}),
        });
    }
    catch (err) {
        console.error('[ScoreController] Error:', err);
        res.status(500).json({ error: 'Internal scoring engine error' });
    }
}
//# sourceMappingURL=score.controller.js.map