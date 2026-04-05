// ─── Proximity Thresholds (meters) ────────────────────────────────────────────
const THRESHOLDS = {
    hospital: 1500,
    vet: 1000,
    gym: 1000,
    cafe: 600,
    school: 1200,
    greenSpace: 600,
    commuteStation: 800,
    shopping: 1500,
};
// ─── Helpers ──────────────────────────────────────────────────────────────────
function clamp(val, min = 0, max = 100) {
    return Math.max(min, Math.min(max, val));
}
/** Linear proximity score: 100 at threshold, decays to 0 at threshold + halfRange */
function proximityScore(dist, threshold, halfRange = 1000) {
    if (dist === undefined)
        return 20;
    if (dist <= threshold)
        return 100;
    const over = dist - threshold;
    return clamp(100 - (over / halfRange) * 100);
}
// ─── Phase 1: Hard-Fail Filters ───────────────────────────────────────────────
function hardFail(user, property) {
    if (property.price > user.budget.max) {
        return `Price ฿${property.price.toLocaleString()} exceeds max budget ฿${user.budget.max.toLocaleString()}`;
    }
    if (property.sizeSqm < user.houseSize.min) {
        return `Property size ${property.sizeSqm} sq.m. is smaller than minimum required ${user.houseSize.min} sq.m.`;
    }
    if (user.pets.some(p => p !== 'none') && !property.isPetFriendly) {
        return `Property is not pet-friendly`;
    }
    return null;
}
// ─── Phase 2a: Health Score (weight 30%) ──────────────────────────────────────
// Conditions vs what they need:
//   Respiratory        → low PM2.5 (heavy), quiet secondary
//   Mobility           → universalDesign (mandatory), elevator
//   Cardiovascular     → quiet + near hospital
//   Mental Wellness    → greenSpace + quiet
//   Allergy Sensitivity→ low PM2.5 (similar to respiratory)
//   Chronic Condition  → near hospital / clinic
//   Visual/Hearing     → near commuteStation (accessible transit)
//   Post-Surgery       → near hospital + quiet + universalDesign
function scoreHealth(user, property) {
    if (user.health.length === 0 || user.health.every(h => h === 'none'))
        return 75;
    const near = property.nearPlaces;
    const scores = [];
    const pm25Score = property.pm25 <= 25 ? 100 :
        property.pm25 <= 35 ? 85 :
            property.pm25 <= 45 ? 65 :
                property.pm25 <= 65 ? 40 : 10;
    const noiseScore = clamp(100 - property.noiseLevel);
    const hospitalScore = proximityScore(near.hospital, THRESHOLDS.hospital, 1500);
    const greenScore = proximityScore(near.greenSpace, THRESHOLDS.greenSpace, 800);
    const stationScore = proximityScore(near.commuteStation, THRESHOLDS.commuteStation, 1000);
    for (const cond of user.health) {
        switch (cond) {
            case 'Respiratory Conditions':
            case 'Allergy Sensitivity':
                scores.push(pm25Score * 0.65 + noiseScore * 0.35);
                break;
            case 'Mobility & Accessibility':
                if (!property.hasUniversalDesign) {
                    scores.push(15); // near-zero — property unusable
                }
                else {
                    let s = 80;
                    if (property.hasElevator)
                        s += 15;
                    if (property.noiseLevel <= 50)
                        s += 5;
                    scores.push(clamp(s));
                }
                break;
            case 'Cardiovascular Health':
                scores.push(noiseScore * 0.5 + hospitalScore * 0.5);
                break;
            case 'Mental Wellness':
                scores.push(greenScore * 0.6 + noiseScore * 0.4);
                break;
            case 'Chronic Condition Management':
            case 'Post-Surgery Recovery':
                // hospital proximity is king; quietness matters too
                scores.push(hospitalScore * 0.7 + noiseScore * 0.3);
                break;
            case 'Visual / Hearing Impairment':
                // accessible transit + universal design
                {
                    let s = stationScore * 0.6;
                    if (property.hasUniversalDesign)
                        s += 40;
                    scores.push(clamp(s));
                }
                break;
            default:
                scores.push(70);
        }
    }
    return clamp(scores.reduce((a, b) => a + b, 0) / scores.length);
}
// ─── Phase 2b: Budget & Commute Score (weight 25%) ────────────────────────────
function scoreBudget(user, property) {
    // Budget fit — linear within range, bonus for staying under mid-point
    const range = user.budget.max - user.budget.min;
    let budgetScore;
    if (range <= 0) {
        budgetScore = property.price <= user.budget.max ? 100 : 0;
    }
    else {
        const fit = 1 - (property.price - user.budget.min) / range;
        budgetScore = clamp(fit * 100);
    }
    // Commute: look up the user's chosen workplace in the property's commute map
    let commuteScore = 70; // neutral if no workplace chosen or no matching key
    const userWorkplace = user.workplace?.trim();
    if (userWorkplace && property.workplaceCommuteMins) {
        const t = property.workplaceCommuteMins[userWorkplace];
        if (t !== undefined) {
            // 0–15 min = 100, 15–user.commute = linear, beyond = 0
            if (t <= 15) {
                commuteScore = 100;
            }
            else if (t >= user.commute + 20) {
                commuteScore = 0;
            }
            else {
                const k = 0.055;
                commuteScore = clamp(100 * Math.exp(-k * (t - 15)));
            }
        }
    }
    return clamp(budgetScore * 0.45 + commuteScore * 0.55);
}
// ─── Phase 2c: Family Score (weight 15%) ──────────────────────────────────────
// Rules:
//   • More people → bigger house preferred (sizeSqm per person bonus)
//   • Vulnerable (infant, elderly, senior, expecting, mobility) → hospital bonus
//   • Youth & adults (young child, teen, adult) → school + transit + shopping bonus
function scoreFamily(user, property) {
    const { family, peopleCount } = user;
    const near = property.nearPlaces;
    // ── Size adequacy: recommended 20 sq.m. per person ──
    const recommended = peopleCount * 20;
    const sizeRatio = property.sizeSqm / recommended;
    const sizeScore = sizeRatio >= 1.5 ? 100 :
        sizeRatio >= 1.0 ? 70 + (sizeRatio - 1.0) * 60 :
            clamp(sizeRatio * 70);
    if (family.length === 0) {
        // Just use size and a mild hospital score
        return clamp(sizeScore * 0.5 + proximityScore(near.hospital, THRESHOLDS.hospital, 1500) * 0.5);
    }
    // ── Determine family archetype ──
    const VULNERABLE = ['Infant (0–2)', 'Elderly (65+)', 'Senior (75+)', 'Expecting', 'Mobility Needs'];
    const YOUTH = ['Young Child (3–12)', 'Teen (13–17)', 'Adult (18–64)'];
    const hasVulnerable = family.some(m => VULNERABLE.includes(m));
    const hasYouth = family.some(m => YOUTH.includes(m));
    const hospitalScore = proximityScore(near.hospital, THRESHOLDS.hospital, 1500);
    const schoolScore = proximityScore(near.school, THRESHOLDS.school, 1200);
    const stationScore = proximityScore(near.commuteStation, THRESHOLDS.commuteStation, 1000);
    const shoppingScore = proximityScore(near.shopping, THRESHOLDS.shopping, 2000);
    const quietScore = clamp(100 - property.noiseLevel);
    let locationScore;
    if (hasVulnerable && hasYouth) {
        // Mixed family: balanced weights
        locationScore = hospitalScore * 0.30 + schoolScore * 0.25 + stationScore * 0.15 + quietScore * 0.20 + shoppingScore * 0.10;
    }
    else if (hasVulnerable) {
        // Elderly-leaning: hospital + quiet dominate
        locationScore = hospitalScore * 0.45 + quietScore * 0.35 + shoppingScore * 0.10 + stationScore * 0.10;
    }
    else {
        // Youth / Adults: school + transit + shopping
        locationScore = schoolScore * 0.35 + stationScore * 0.30 + shoppingScore * 0.20 + quietScore * 0.15;
    }
    // Size matters more for large families (>3 people)
    const sizeWeight = Math.min(0.4, 0.2 + (peopleCount - 1) * 0.05);
    return clamp(locationScore * (1 - sizeWeight) + sizeScore * sizeWeight);
}
// ─── Phase 2d: Pet Score (weight 15%) ─────────────────────────────────────────
// • No pets → 100 (no constraint)
// • Not pet-friendly → 0 (Hard-fail handled above, but keep guard here)
// • 3+ distinct pet types → large-space bonus
// • Vet proximity + pet park = bonuses
function scorePet(user, property) {
    const activePets = user.pets.filter(p => p !== 'none');
    if (activePets.length === 0)
        return 100;
    if (!property.isPetFriendly)
        return 0;
    let score = 65; // base for being pet-friendly
    const near = property.nearPlaces;
    const vetScore = proximityScore(near.vet, THRESHOLDS.vet, 1500);
    score += vetScore * 0.20; // up to +20
    if (property.hasPetPark)
        score += 12;
    // 3+ pet types = need lots of space
    if (activePets.length >= 3) {
        const spaceBonus = property.sizeSqm >= 150 ? 8 :
            property.sizeSqm >= 80 ? 4 : 0;
        score += spaceBonus;
    }
    return clamp(score);
}
// ─── Phase 2e: Lifestyle Score (weight 15%) ───────────────────────────────────
//
// Lifestyle items are grouped into SYNERGY CLUSTERS.
// Selecting multiple items in the same cluster → bonus multiplier.
// Items in CONFLICTING clusters partially cancel each other.
//
// Clusters:
//   NATURE       : Green Spaces, Bike-Friendly, High Walkability
//   URBAN        : City Connectivity, Restaurant Scene, Café Culture, Shopping Nearby
//   QUIET        : Quiet & Low Noise
//   WELLNESS     : Near Hospital, Recreation Facilities, Top Schools
//   TRANSIT      : Transit Access
//
// Conflict pairs (lower each other's weight):
//   NATURE ↔ URBAN (nature-seeking vs fast city)
//   QUIET  ↔ URBAN (quiet vs lively city)
//
// Cross-category priority: If family profile includes vulnerable members,
// "Near Hospital" in lifestyle gets weight boosted to 0.25 regardless.
const LIFESTYLE_CLUSTERS = {
    NATURE: ['Green Spaces', 'Bike-Friendly', 'High Walkability'],
    URBAN: ['City Connectivity', 'Restaurant Scene', 'Café Culture', 'Shopping Nearby'],
    QUIET: ['Quiet & Low Noise'],
    WELLNESS: ['Near Hospital', 'Recreation Facilities', 'Top Schools'],
    TRANSIT: ['Transit Access'],
};
function scoreLifestyle(user, property) {
    if (user.lifestyle.length === 0)
        return 75;
    const near = property.nearPlaces;
    const sel = new Set(user.lifestyle);
    // ── Compute raw match score for each preference ──────────────────────────
    const rawScore = (pref) => {
        switch (pref) {
            case 'Green Spaces': return proximityScore(near.greenSpace, THRESHOLDS.greenSpace, 800);
            case 'Bike-Friendly': return clamp(100 - property.noiseLevel + (near.greenSpace && near.greenSpace <= 1000 ? 10 : 0));
            case 'High Walkability': return proximityScore(near.commuteStation, THRESHOLDS.commuteStation, 800) * 0.5
                + proximityScore(near.cafe, THRESHOLDS.cafe, 600) * 0.5;
            case 'City Connectivity': return proximityScore(near.commuteStation, THRESHOLDS.commuteStation, 800);
            case 'Restaurant Scene': return proximityScore(near.cafe, THRESHOLDS.cafe, 600);
            case 'Café Culture': return proximityScore(near.cafe, THRESHOLDS.cafe, 600);
            case 'Shopping Nearby': return proximityScore(near.shopping, THRESHOLDS.shopping, 2000);
            case 'Quiet & Low Noise': return clamp(100 - property.noiseLevel);
            case 'Near Hospital': return proximityScore(near.hospital, THRESHOLDS.hospital, 1500);
            case 'Recreation Facilities': return proximityScore(near.gym, THRESHOLDS.gym, 1000);
            case 'Top Schools': return proximityScore(near.school, THRESHOLDS.school, 1200);
            case 'Transit Access': return proximityScore(near.commuteStation, THRESHOLDS.commuteStation, 800);
            default: return 70;
        }
    };
    // ── Determine cluster selections ─────────────────────────────────────────
    const inCluster = (cluster) => cluster.filter(p => sel.has(p));
    const natureCount = inCluster(LIFESTYLE_CLUSTERS.NATURE).length;
    const urbanCount = inCluster(LIFESTYLE_CLUSTERS.URBAN).length;
    const quietCount = inCluster(LIFESTYLE_CLUSTERS.QUIET).length;
    const wellnessCount = inCluster(LIFESTYLE_CLUSTERS.WELLNESS).length;
    // ── Conflict penalty (0.0 = no conflict, 1.0 = max conflict) ─────────────
    const natureUrbanConflict = (natureCount > 0 && urbanCount > 0) ?
        Math.min(natureCount, urbanCount) * 0.10 : 0;
    const quietUrbanConflict = (quietCount > 0 && urbanCount > 0) ?
        urbanCount * 0.12 : 0;
    const conflictPenalty = Math.min(0.35, natureUrbanConflict + quietUrbanConflict);
    // ── Synergy bonus (same cluster, multiple picks) ──────────────────────────
    const synergyBonus = (natureCount >= 2 ? 5 : 0) +
        (urbanCount >= 3 ? 5 : 0) +
        (wellnessCount >= 2 ? 5 : 0);
    // ── Cross-category priority: vulnerable family boosts "Near Hospital" ─────
    const VULNERABLE = ['Infant (0–2)', 'Elderly (65+)', 'Senior (75+)', 'Expecting', 'Mobility Needs'];
    const hasVulnFamily = user.family.some(m => VULNERABLE.includes(m));
    // ── Weighted average of raw scores ───────────────────────────────────────
    const entries = Array.from(sel);
    let totalWeight = 0;
    let weightedSum = 0;
    for (const pref of entries) {
        const raw = rawScore(pref);
        let weight = 1.0;
        // Boost "Near Hospital" when vulnerable family present
        if (pref === 'Near Hospital' && hasVulnFamily)
            weight = 2.5;
        // Urban prefs penalised if conflict
        if (LIFESTYLE_CLUSTERS.URBAN.includes(pref) && conflictPenalty > 0)
            weight *= (1 - conflictPenalty);
        // Nature prefs penalised if urban conflict
        if (LIFESTYLE_CLUSTERS.NATURE.includes(pref) && natureUrbanConflict > 0)
            weight *= (1 - natureUrbanConflict * 0.5);
        weightedSum += raw * weight;
        totalWeight += weight;
    }
    const base = totalWeight > 0 ? weightedSum / totalWeight : 70;
    return clamp(base + synergyBonus);
}
// ─── Main Engine ──────────────────────────────────────────────────────────────
export function calculateLifeFitScore(user, property) {
    const failReason = hardFail(user, property);
    if (failReason) {
        return { health: 0, budget: 0, family: 0, pet: 0, lifestyle: 0, total: 0, passed: false, failReason };
    }
    const health = scoreHealth(user, property);
    const budget = scoreBudget(user, property);
    const family = scoreFamily(user, property);
    const pet = scorePet(user, property);
    const lifestyle = scoreLifestyle(user, property);
    // Weights: Health 30 | Budget 25 | Family 15 | Pet 15 | Lifestyle 15
    let total = health * 0.30 +
        budget * 0.25 +
        family * 0.15 +
        pet * 0.15 +
        lifestyle * 0.15;
    // Phase 2f: Location Penalty
    // If user specified a preferred district and this property is outside it, deduct 10 points.
    if (user.preferredDistrict && user.preferredDistrict !== property.district) {
        total -= 10;
    }
    total = clamp(total);
    return {
        health: Math.round(health),
        budget: Math.round(budget),
        family: Math.round(family),
        pet: Math.round(pet),
        lifestyle: Math.round(lifestyle),
        total: Math.round(total),
        passed: true,
    };
}
/** Map total score to a human-readable label */
export function getScoreLabel(score) {
    if (score >= 90)
        return 'Perfect Match ✨';
    if (score >= 75)
        return 'Excellent Fit 🏡';
    if (score >= 60)
        return 'Good Match 👍';
    if (score >= 45)
        return 'Fair Match 🤔';
    if (score >= 30)
        return 'Weak Match ⚠️';
    return 'Poor Match ❌';
}
//# sourceMappingURL=lifefitEngine.js.map