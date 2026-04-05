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

// Ensure the Prisma client instance is shared or imported
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function scoreAllController(req: Request, res: Response): Promise<void> {
    const { userProfile } = req.body as { userProfile: UserProfile };

    if (!userProfile) {
        res.status(400).json({ error: 'Missing userProfile' });
        return;
    }

    try {
        const properties = await prisma.property.findMany();
        
        const results = properties.map((p: any) => {
            // Prisma returns Json fields as raw JS objects when queried
            const typedProperty: PropertyData = {
                ...p,
                type: p.type as "condo" | "house" | "townhouse" | "villa",
                securityLevel: p.securityLevel as any,
                communityStyle: p.communityStyle as any,
                description: p.description ?? undefined,
                imageUrl: p.imageUrl ?? undefined,
                images: (p.images as string[]) ?? undefined,
                nearPlaces: p.nearPlaces as any,
                workplaceCommuteMins: p.workplaceCommuteMins as any,
            };

            const breakdown = calculateLifeFitScore(userProfile, typedProperty);
            const score = breakdown.total;
            const GREEN = "#10B981";
            const BLUE = "#3B82F6";
            const AMBER = "#F59E0B";

            // Basic insight mock based on features
            const insights = [];
            if (typedProperty.nearPlaces.hospital && typedProperty.nearPlaces.hospital < 1000) {
                insights.push({ icon: "🏥", label: `Hospital ${typedProperty.nearPlaces.hospital}m`, color: GREEN });
            }
            if (typedProperty.isPetFriendly) {
                insights.push({ icon: "🐾", label: "Pet Friendly", color: BLUE });
            }
            if (typedProperty.workplaceCommuteMins && userProfile.workplace) {
                const mins = typedProperty.workplaceCommuteMins[userProfile.workplace];
                if (mins) insights.push({ icon: "🚆", label: `${mins} min commute`, color: BLUE });
            }

            return {
                id: p.id,
                lat: p.locationLat,
                lng: p.locationLng,
                name: p.name,
                address: p.location,
                price: `฿${(p.price / 1000000).toFixed(1)}M`,
                beds: Math.max(1, Math.floor(p.sizeSqm / 25)),
                baths: Math.max(1, Math.floor(p.sizeSqm / 30)),
                sqft: p.sizeSqm.toString(),
                score: breakdown.total,
                badge: getScoreLabel(breakdown.total),
                badgeColor: score >= 85 ? GREEN : score >= 70 ? BLUE : AMBER,
                insights,
                grad: `linear-gradient(135deg, #1E3A8A, #3B82F6)`,
                commuteMinutes: 15,
                sizeSqm: p.sizeSqm,
                passed: breakdown.passed,
                failReason: breakdown.failReason
            };
        });

        // Filter and sort by score descending
        const visible = results.filter((r: any) => r.passed).sort((a: any, b: any) => b.score - a.score);
        res.json({ results: visible });
    } catch (err) {
        console.error('[ScoreController] Error fetching all:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
