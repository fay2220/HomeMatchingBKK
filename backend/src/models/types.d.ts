export interface NearPlaces {
    hospital?: number;
    vet?: number;
    gym?: number;
    cafe?: number;
    school?: number;
    greenSpace?: number;
    commuteStation?: number;
    shopping?: number;
}
export type HealthCondition = 'Respiratory Conditions' | 'Mobility & Accessibility' | 'Cardiovascular Health' | 'Mental Wellness' | 'Allergy Sensitivity' | 'Chronic Condition Management' | 'Visual / Hearing Impairment' | 'Post-Surgery Recovery' | 'none';
export type PetType = 'Dog' | 'Cat' | 'Rabbit / Small Animal' | 'Bird' | 'Fish / Reptile' | 'none';
export type FamilyMember = 'Infant (0–2)' | 'Young Child (3–12)' | 'Teen (13–17)' | 'Adult (18–64)' | 'Elderly (65+)' | 'Senior (75+)' | 'Expecting' | 'Mobility Needs';
export type LifestylePreference = 'Green Spaces' | 'Transit Access' | 'Top Schools' | 'Shopping Nearby' | 'High Walkability' | 'Near Hospital' | 'Restaurant Scene' | 'Quiet & Low Noise' | 'Café Culture' | 'Bike-Friendly' | 'Recreation Facilities' | 'City Connectivity';
export interface UserProfile {
    budget: {
        min: number;
        max: number;
    };
    houseSize: {
        min: number;
        max: number;
    };
    peopleCount: number;
    family: FamilyMember[];
    pets: PetType[];
    health: HealthCondition[];
    commute: number;
    workplace: string;
    preferredDistrict?: string;
    lifestyle: LifestylePreference[];
}
export type SecurityLevel = 'low' | 'medium' | 'high';
export type CommunityStyle = 'urban' | 'suburban' | 'resort' | 'quiet' | 'mixed';
export interface PropertyData {
    id?: number;
    name: string;
    type: string;
    description?: string;
    location: string;
    district: string;
    locationLat: number;
    locationLng: number;
    imageUrl?: string;
    images?: string[];
    price: number;
    sizeSqm: number;
    isPetFriendly: boolean;
    hasUniversalDesign: boolean;
    hasPetPark: boolean;
    hasParking: boolean;
    hasElevator: boolean;
    pm25: number;
    noiseLevel: number;
    securityLevel: SecurityLevel;
    communityStyle: CommunityStyle;
    nearPlaces: NearPlaces;
    workplaceCommuteMins: Record<string, number>;
}
export interface ScoreBreakdown {
    health: number;
    budget: number;
    family: number;
    pet: number;
    lifestyle: number;
    total: number;
    passed: boolean;
    failReason?: string;
}
//# sourceMappingURL=types.d.ts.map