// ─── NearPlaces ───────────────────────────────────────────────────────────────
export interface NearPlaces {
    hospital?: number;        // meters
    vet?: number;
    gym?: number;
    cafe?: number;
    school?: number;
    greenSpace?: number;
    commuteStation?: number;
}

// ─── User Profile ─────────────────────────────────────────────────────────────
export type HealthCondition = 'respiratory' | 'mobility' | 'cardiac' | 'none';

export type PetType =
    | 'Dog'
    | 'Cat'
    | 'Other'
    | 'none';

export type FamilyMember =
    | 'Infant (0–2)'
    | 'Young Child (3–12)'
    | 'Teen (13–17)'
    | 'Adult (18–64)'
    | 'Elderly (65+)'
    | 'Senior (75+)'
    | 'Expecting'
    | 'Mobility Needs';

export type LifestylePreference =
    | 'cafe'
    | 'gym'
    | 'school'
    | 'green_space'
    | 'pet_park';

export interface UserProfile {
    budget: { min: number; max: number };     // THB
    houseSize: { min: number; max: number };  // sq.m.
    peopleCount: number;
    family: FamilyMember[];
    pets: PetType[];
    health: HealthCondition[];
    commute: number;                          // max acceptable minutes
    lifestyle: LifestylePreference[];
}

// ─── Property ─────────────────────────────────────────────────────────────────
export type SecurityLevel = 'low' | 'medium' | 'high';
export type CommunityStyle = 'urban' | 'suburban' | 'resort' | 'quiet' | 'mixed';

export interface PropertyData {
    id?: number;
    name: string;
    type: string;              // "condo" | "house" | "townhouse" | "villa" | ...
    location: string;          // human-readable address / district
    locationLat: number;
    locationLng: number;
    imageUrl?: string;

    price: number;             // THB
    sizeSqm: number;           // sq.m.

    // Facilities
    isPetFriendly: boolean;
    hasUniversalDesign: boolean;
    hasPetPark: boolean;
    hasParking: boolean;
    hasElevator: boolean;

    // Environmental
    pm25: number;              // µg/m³
    noiseLevel: number;        // dB (0–100)

    // Character
    securityLevel: SecurityLevel;
    communityStyle: CommunityStyle;

    // Proximity distances in meters
    nearPlaces: NearPlaces;

    // Pre-calculated commute in minutes
    commuteMinutes: number;
}

// ─── Score Output ─────────────────────────────────────────────────────────────
export interface ScoreBreakdown {
    health: number;     // 0–100
    budget: number;     // 0–100
    family: number;     // 0–100
    pet: number;        // 0–100
    lifestyle: number;  // 0–100
    total: number;      // 0–100 final weighted score
    passed: boolean;    // false if hard-failed by Phase 1 filters
    failReason?: string;
}
