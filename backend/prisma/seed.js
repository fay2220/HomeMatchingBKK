import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
async function main() {
    const raw = readFileSync(join(__dirname, '../mock.json'), 'utf-8');
    const properties = JSON.parse(raw);
    console.log(`🌱 Seeding ${properties.length} properties...`);
    for (const p of properties) {
        await prisma.property.upsert({
            where: { id: p.id },
            update: {
                name: p.name,
                type: p.type,
                description: p.description,
                location: p.location,
                district: p.district,
                locationLat: p.locationLat,
                locationLng: p.locationLng,
                imageUrl: p.imageUrl,
                images: p.images ?? [],
                price: p.price,
                sizeSqm: p.sizeSqm,
                isPetFriendly: p.isPetFriendly,
                hasUniversalDesign: p.hasUniversalDesign,
                hasPetPark: p.hasPetPark,
                hasParking: p.hasParking,
                hasElevator: p.hasElevator,
                pm25: p.pm25,
                noiseLevel: p.noiseLevel,
                securityLevel: p.securityLevel,
                communityStyle: p.communityStyle,
                nearPlaces: p.nearPlaces,
                workplaceCommuteMins: p.workplaceCommuteMins,
            },
            create: {
                id: p.id,
                name: p.name,
                type: p.type,
                description: p.description,
                location: p.location,
                district: p.district,
                locationLat: p.locationLat,
                locationLng: p.locationLng,
                imageUrl: p.imageUrl,
                images: p.images ?? [],
                price: p.price,
                sizeSqm: p.sizeSqm,
                isPetFriendly: p.isPetFriendly,
                hasUniversalDesign: p.hasUniversalDesign,
                hasPetPark: p.hasPetPark,
                hasParking: p.hasParking,
                hasElevator: p.hasElevator,
                pm25: p.pm25,
                noiseLevel: p.noiseLevel,
                securityLevel: p.securityLevel,
                communityStyle: p.communityStyle,
                nearPlaces: p.nearPlaces,
                workplaceCommuteMins: p.workplaceCommuteMins,
            },
        });
        console.log(`  ✅ ${p.id}. ${p.name}`);
    }
    console.log('🎉 Seed complete!');
}
main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map