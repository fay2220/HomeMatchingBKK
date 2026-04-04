import { GREEN, AMBER } from "../variable";
import type { Property } from "./types";

export const PROPERTIES: Property[] = [
    {
        id: 1,
        name: "The Greenway Residences",
        address: "14 Riverfront Ave, Zone 3A",
        price: "$3,450", beds: 2, baths: 2, sqft: "1,100", score: 94,
        badge: "⭐ TOP PICK", badgeColor: AMBER,
        insights: [
            { icon: "🏥", label: "Hospital 0.4mi", color: GREEN },
            { icon: "💨", label: "Low PM2.5", color: GREEN },
            { icon: "🐾", label: "Pet Park", color: GREEN },
        ],
        risk: "PM2.5 spikes Dec–Feb",
        grad: "linear-gradient(135deg, #0F766E, #10B981)",
    },
    {
        id: 2,
        name: "Skyline Pines Condo",
        address: "220 Highland Blvd, Zone 2B",
        price: "$2,890", beds: 1, baths: 1, sqft: "820", score: 76,
        badge: "Good Match", badgeColor: "#3B82F6",
        insights: [
            { icon: "♿", label: "Accessible", color: "#3B82F6" },
            { icon: "🚇", label: "Metro 0.2mi", color: "#3B82F6" },
        ],
        risk: "Weekend highway noise",
        grad: "linear-gradient(135deg, #1E3A8A, #3B82F6)",
    },
    {
        id: 3,
        name: "Elmore Park Apartments",
        address: "5 Garden Row, Zone 1C",
        price: "$4,100", beds: 3, baths: 2, sqft: "1,400", score: 88,
        badge: "Recommended", badgeColor: GREEN,
        insights: [
            { icon: "🌳", label: "Park Adjacent", color: GREEN },
            { icon: "🏫", label: "Top School 0.3mi", color: "#3B82F6" },
            { icon: "🐾", label: "Dog Park", color: GREEN },
        ],
        grad: "linear-gradient(135deg, #064E3B, #10B981)",
    },
    {
        id: 4,
        name: "Harbor View Tower",
        address: "88 Marina Dr, Zone 4A",
        price: "$3,200", beds: 2, baths: 1, sqft: "950", score: 71,
        badge: "Moderate", badgeColor: AMBER,
        insights: [
            { icon: "🌊", label: "Waterfront", color: "#3B82F6" },
            { icon: "🚇", label: "Ferry Access", color: "#3B82F6" },
        ],
        risk: "Flood Zone B — check insurance",
        grad: "linear-gradient(135deg, #1e40af, #60A5FA)",
    },
];

export const FILTERS = ["All", "LifeFit 80+", "Pet Parks", "Low PM2.5", "Transit"];
