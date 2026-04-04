import type {
    UserProfile,
    PropertyData,
    ScoreBreakdown,
    NearPlaces,
    FamilyMember,
    HealthCondition,
    LifestylePreference,
} from '../models/types';

// ─── Proximity Thresholds (meters) ────────────────────────────────────────────
const THRESHOLDS = {
    hospital:       1500,
    vet:            1000,
    gym:            1000,
    cafe:            500,
    school:         1000,
    greenSpace:      500,
    commuteStation: 1000,
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clamp(val: number, min = 0, max = 100): number {
    return Math.max(min, Math.min(max, val));
}

/** true if distance is defined AND within the given threshold */
function isNear(dist: number | undefined, threshold: number): boolean {
    return dist !== undefined && dist <= threshold;
}

// ─── Phase 1: Hard-Fail Filters ───────────────────────────────────────────────

function hardFail(user: UserProfile, property: PropertyData): string | null {
    if (property.price > user.budget.max) {
        return `Price ฿${property.price.toLocaleString()} exceeds max budget ฿${user.budget.max.toLocaleString()}`;
    }
    if (property.sizeSqm < user.houseSize.min) {
        return `Property size ${property.sizeSqm} sq.m. is smaller than minimum required ${user.houseSize.min} sq.m.`;
    }
    return null;
}

// ─── Phase 2a: Health & Mobility Score (weight 35%) ───────────────────────────

function scoreHealth(user: UserProfile, property: PropertyData): number {
    let score = 0;

    // PM2.5 base score
    const { pm25 } = property;
    let airScore: number;
    if (pm25 <= 15)      airScore = 100;
    else if (pm25 <= 25) airScore = 85;
    else if (pm25 <= 35) airScore = 65;
    else if (pm25 <= 55) airScore = 40;
    else                  airScore = 10;

    // Respiratory condition doubles PM2.5 weight
    const hasRespiratory = user.health.includes('respiratory');
    const airWeight = hasRespiratory ? 0.6 : 0.4;
    score += airScore * airWeight;

    // Noise
    const noiseScore = clamp(100 - property.noiseLevel);
    score += noiseScore * (1 - airWeight);

    // Mobility penalty
    const hasMobility =
        user.health.includes('mobility') ||
        user.family.includes('Mobility Needs' as FamilyMember);

    if (hasMobility) {
        if (!property.hasUniversalDesign) {
            // Heavy penalty: -65% of current score
            score *= 0.35;
        }
        // Elevator bonus for mobility users
        if (property.hasElevator) score = clamp(score + 5);
    }

    // Cardiac: quiet environment helps
    if (user.health.includes('cardiac') && property.noiseLevel <= 45) {
        score = clamp(score + 8);
    }

    return clamp(score);
}

// ─── Phase 2b: Budget & Commute Score (weight 25%) ────────────────────────────

function scoreBudget(user: UserProfile, property: PropertyData): number {
    // Budget fit: how centred the price is within range
    const range = user.budget.max - user.budget.min;
    let budgetScore: number;
    if (range <= 0) {
        budgetScore = property.price <= user.budget.max ? 100 : 0;
    } else {
        const fit = 1 - (property.price - user.budget.min) / range;
        budgetScore = clamp(fit * 100);
    }

    // Commute decay: 0–20 min = 100, exponential drop after that
    const t = property.commuteMinutes;
    const k = 0.055; // decay constant — reaches ~5 at 90 min
    let commuteScore: number;
    if (t <= 20) {
        commuteScore = 100;
    } else if (t >= user.commute + 30) {
        commuteScore = 0;
    } else {
        commuteScore = clamp(100 * Math.exp(-k * (t - 20)));
    }

    return clamp(budgetScore * 0.45 + commuteScore * 0.55);
}

// ─── Phase 2c: Family Structure Score (weight 15%) ───────────────────────────

function scoreFamily(user: UserProfile, property: PropertyData): number {
    const { family } = user;
    const near = property.nearPlaces;

    const hasElderly = family.some(m =>
        (m as string) === 'Elderly (65+)' || (m as string) === 'Senior (75+)'
    );
    const hasInfant = family.some(m =>
        (m as string) === 'Infant (0–2)' || (m as string) === 'Young Child (3–12)'
    );

    // Default weights
    let weights = { hospital: 0.25, quiet: 0.25, school: 0.25, greenSpace: 0.25 };

    if (hasElderly) {
        weights = { hospital: 0.45, quiet: 0.30, school: 0.05, greenSpace: 0.20 };
    } else if (hasInfant) {
        weights = { hospital: 0.25, quiet: 0.20, school: 0.35, greenSpace: 0.20 };
    }

    const hospitalScore = isNear(near.hospital, THRESHOLDS.hospital) ? 100 : 
        near.hospital ? clamp(100 - ((near.hospital - THRESHOLDS.hospital) / 500) * 30) : 20;

    const quietScore = property.noiseLevel <= 45 ? 100 : 
        clamp(100 - (property.noiseLevel - 45) * 2.5);

    const schoolScore = isNear(near.school, THRESHOLDS.school) ? 100 :
        near.school ? clamp(100 - ((near.school - THRESHOLDS.school) / 500) * 40) : 30;

    const greenScore = isNear(near.greenSpace, THRESHOLDS.greenSpace) ? 100 :
        near.greenSpace ? clamp(100 - ((near.greenSpace - THRESHOLDS.greenSpace) / 300) * 40) : 30;

    return clamp(
        hospitalScore * weights.hospital +
        quietScore * weights.quiet +
        schoolScore * weights.school +
        greenScore * weights.greenSpace
    );
}

// ─── Phase 2d: Pet Profile Score (weight 15%) ─────────────────────────────────

function scorePet(user: UserProfile, property: PropertyData): number {
    const hasPets = user.pets.length > 0 && !user.pets.every(p => p === 'none');

    if (!hasPets) return 100; // no pets = no penalty, full score

    if (!property.isPetFriendly) return 0; // hard 0 if pets not allowed

    let score = 70; // base score for being pet-friendly

    const near = property.nearPlaces;

    // Vet proximity bonus
    if (isNear(near.vet, THRESHOLDS.vet)) score += 15;
    else if (near.vet && near.vet <= 2000) score += 8;

    // Pet park bonus
    if (property.hasPetPark) score += 15;

    return clamp(score);
}

// ─── Phase 2e: Lifestyle Score (weight 10%) ───────────────────────────────────

function scoreLifestyle(user: UserProfile, property: PropertyData): number {
    if (user.lifestyle.length === 0) return 80; // neutral if no preference

    const near = property.nearPlaces;

    const preferenceMap: Record<LifestylePreference, () => boolean> = {
        cafe:        () => isNear(near.cafe, THRESHOLDS.cafe),
        gym:         () => isNear(near.gym, THRESHOLDS.gym),
        school:      () => isNear(near.school, THRESHOLDS.school),
        green_space: () => isNear(near.greenSpace, THRESHOLDS.greenSpace),
        pet_park:    () => property.hasPetPark,
    };

    const matched = user.lifestyle.filter(pref => {
        const fn = preferenceMap[pref];
        return fn ? fn() : false;
    }).length;

    return clamp((matched / user.lifestyle.length) * 100);
}

// ─── Main Engine ──────────────────────────────────────────────────────────────

export function calculateLifeFitScore(
    user: UserProfile,
    property: PropertyData
): ScoreBreakdown {
    // Phase 1: Hard filters
    const failReason = hardFail(user, property);
    if (failReason) {
        return { health: 0, budget: 0, family: 0, pet: 0, lifestyle: 0, total: 0, passed: false, failReason };
    }

    // Phase 2: Category scores
    const health    = scoreHealth(user, property);
    const budget    = scoreBudget(user, property);
    const family    = scoreFamily(user, property);
    const pet       = scorePet(user, property);
    const lifestyle = scoreLifestyle(user, property);

    // Weighted aggregation
    const total = clamp(
        health    * 0.35 +
        budget    * 0.25 +
        family    * 0.15 +
        pet       * 0.15 +
        lifestyle * 0.10
    );

    return {
        health:    Math.round(health),
        budget:    Math.round(budget),
        family:    Math.round(family),
        pet:       Math.round(pet),
        lifestyle: Math.round(lifestyle),
        total:     Math.round(total),
        passed:    true,
    };
}

/** Map total score to a human-readable label */
export function getScoreLabel(score: number): string {
    if (score >= 90) return 'Perfect Match ✨';
    if (score >= 75) return 'Excellent Fit 🏡';
    if (score >= 60) return 'Good Match 👍';
    if (score >= 45) return 'Fair Match 🤔';
    if (score >= 30) return 'Weak Match ⚠️';
    return 'Poor Match ❌';
}
