export type UserProfile = {
  budget?: { min: number; max: number };
  propertyType?: string;
  size?: string;
  workLocation?: string;
  commuteTime?: number;
  workStyle?: string;
  hasCar?: boolean;
  lifestyle?: string;
  exerciseFrequency?: string;
  
  // Preferences
  foodPreferences?: string[];
  sportsInterests?: string[];
  hobbies?: string[];
  socialStyle?: string;
  weekendActivities?: string[];
  importantPlaces?: string[];
  personalityType?: string;
  stressRelief?: string[];
  
  // Family
  familyStructure?: string;
  hasChildren?: boolean;
  hasElderly?: boolean;
  hasPatient?: boolean;
  healthConditions?: string[];
  
  // Pets
  hasPet?: boolean;
  petType?: string;
  petNeeds?: string[];
  specialNeeds?: string[];
};

export type Property = {
  id: string;
  name: string;
  location: string;
  district: string;
  price: number;
  type: string;
  size: number;
  icon?: string;
  image?: string;
  facilities: string[];
  nearbyHospital?: { name: string; distance: number; isPartner: boolean };
  nearbyClinic?: number;
  nearbyPetHospital?: { name: string; distance: number };
  hasPark?: boolean;
  parkDistance?: number;
  hasGym?: boolean;
  hasElevator?: boolean;
  hasParking?: boolean;
  pollution?: { pm25: number };
  commuteTime?: { [key: string]: number };
  nearbyPlaces?: {
    restaurants?: number;
    cafes?: number;
    malls?: number;
    markets?: number;
    schools?: number;
    temples?: number;
    sportsFields?: string[];
  };
  specificLocations?: {
    restaurants?: string[];
    cafes?: string[];
    malls?: string[];
    markets?: string[];
    schools?: string[];
    temples?: string[];
    sportsFields?: string[];
    fitness?: string[];
    others?: string[];
  };
  securityLevel?: string;
  communityStyle?: string;
  noiseLevel?: string;
};
