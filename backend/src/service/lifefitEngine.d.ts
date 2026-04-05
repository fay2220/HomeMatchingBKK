import type { UserProfile, PropertyData, ScoreBreakdown } from '../models/types.js';
export declare function calculateLifeFitScore(user: UserProfile, property: PropertyData): ScoreBreakdown;
/** Map total score to a human-readable label */
export declare function getScoreLabel(score: number): string;
//# sourceMappingURL=lifefitEngine.d.ts.map