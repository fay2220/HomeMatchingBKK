// ─── NearPlaces ───────────────────────────────────────────────────────────────
export interface NearPlaces {
    hospital?: number;        // meters
    vet?: number;
    gym?: number;
    cafe?: number;
    school?: number;
    greenSpace?: number;
    commuteStation?: number;  // BTS/MRT/Bus stop
    shopping?: number;        // mall / market
}

// ─── User Profile ─────────────────────────────────────────────────────────────
export type HealthCondition =
    | 'Respiratory Conditions'       // Asthma, COPD — PM2.5 heavy weight
    | 'Mobility & Accessibility'     // elevator/ramp/universal design
    | 'Cardiovascular Health'        // cardiac — quiet area, near hospital
    | 'Mental Wellness'              // green space, low noise
    | 'Allergy Sensitivity'          // clean air, low PM2.5
    | 'Chronic Condition Management' // near clinic/pharmacy
    | 'Visual / Hearing Impairment'  // accessible transit
    | 'Post-Surgery Recovery'        // near hospital + quiet
    | 'none';

export type PetType =
    | 'Dog'
    | 'Cat'
    | 'Rabbit / Small Animal'
    | 'Bird'
    | 'Fish / Reptile'
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
    | 'Green Spaces'
    | 'Transit Access'
    | 'Top Schools'
    | 'Shopping Nearby'
    | 'High Walkability'
    | 'Near Hospital'
    | 'Restaurant Scene'
    | 'Quiet & Low Noise'
    | 'Café Culture'
    | 'Bike-Friendly'
    | 'Recreation Facilities'
    | 'City Connectivity';

export interface UserProfile {
    budget: { min: number; max: number };     // THB
    houseSize: { min: number; max: number };  // sq.m.
    peopleCount: number;
    family: FamilyMember[];
    pets: PetType[];
    health: HealthCondition[];
    commute: number;                          // max acceptable minutes
    workplace: string;                        // e.g. "อโศก" — matches workplaceCommuteMins key
    preferredDistrict?: string;               // e.g. "วัฒนา" — from Step1 location dropdown
    lifestyle: LifestylePreference[];
}

// ─── Property ─────────────────────────────────────────────────────────────────
export type SecurityLevel = 'low' | 'medium' | 'high';
export type CommunityStyle = 'urban' | 'suburban' | 'resort' | 'quiet' | 'mixed';

export interface PropertyData {
    id?: number;
    name: string;
    type: string;           // "condo" | "house" | "townhouse" | "villa"
    description?: string;   // display text for detail view
    location: string;       // human-readable address / area
    district: string;       // Bangkok เขต (e.g. "วัฒนา") — matches step1 dropdown
    locationLat: number;
    locationLng: number;
    imageUrl?: string;      // primary thumbnail URL
    images?: string[];      // carousel image URLs

    price: number;          // THB
    sizeSqm: number;        // sq.m.

    // Facilities
    isPetFriendly: boolean;
    hasUniversalDesign: boolean;
    hasPetPark: boolean;
    hasParking: boolean;
    hasElevator: boolean;

    // Environmental
    pm25: number;           // µg/m³
    noiseLevel: number;     // dB (0–100)

    // Character
    securityLevel: SecurityLevel;
    communityStyle: CommunityStyle;

    // Proximity distances in meters
    nearPlaces: NearPlaces;

    // Pre-calculated commute minutes to Bangkok work zones
    // Key matches the BANGKOK_PLACES list in step4.tsx
    workplaceCommuteMins: Record<string, number>;
}

// ─── Score Output ─────────────────────────────────────────────────────────────
export interface ScoreBreakdown {
    health: number;     // 0–100
    budget: number;     // 0–100
    family: number;     // 0–100
    pet: number;        // 0–100
    lifestyle: number;  // 0–100
    total: number;      // 0–100 final weighted score
    passed: boolean;
    failReason?: string;
}
