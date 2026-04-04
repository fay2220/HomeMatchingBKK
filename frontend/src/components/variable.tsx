export type Step = 0 | 1 | 2 | 3 | 4 | 5;
export const GREEN = "#10B981";
export const BLUE = "#1E3A8A";
export const AMBER = "#F59E0B";

export const STEPS = [
    { id: 0, label: "Family Profile", icon: "👥", desc: "Tell us who lives with you" },
    { id: 1, label: "Pet Profile", icon: "🐾", desc: "Any furry companions?" },
    { id: 2, label: "Health Needs", icon: "❤️", desc: "Medical and wellness priorities" },
    { id: 3, label: "Budget", icon: "💰", desc: "Price range and commute" },
    { id: 4, label: "Lifestyle", icon: "🌳", desc: "What matters in your neighborhood" },
    { id: 5, label: "Results", icon: "✨", desc: "Your LifeFit profile is ready" },
];

export interface UserPreferences {
    family: string[];
    pets: string[];
    health: string[];
    budget: { min: number, max: number };
    commute: number;
    lifestyle: string[];
}