export interface Insight {
    icon: string;
    label: string;
    color: string;
}

export interface Property {
    id: number;
    name: string;
    address: string;
    price: string;
    beds: number;
    baths: number;
    sqft: string;
    score: number;
    badge: string;
    badgeColor: string;
    insights: Insight[];
    risk?: string;
    grad: string;
}
