import { SelectCard } from "../selectCard";

interface Step4Props {
    lifestyle: string[];
    toggle: (v: string) => void;
}

export function Step4({ lifestyle, toggle }: Step4Props) {
    return (
        <>
            <p className="text-sm mb-8" style={{ color: "#64748B" }}>
                Choose the lifestyle factors that matter most. We'll weight your LifeFit Score accordingly.
            </p>
            <div className="grid grid-cols-4 gap-4">
                {[
                    { icon: "🌳", label: "Green Spaces" },
                    { icon: "🚇", label: "Transit Access" },
                    { icon: "🏫", label: "Top Schools" },
                    { icon: "🛒", label: "Shopping Nearby" },
                    { icon: "🏃", label: "High Walkability" },
                    { icon: "🏥", label: "Near Hospital" },
                    { icon: "🍽️", label: "Restaurant Scene" },
                    { icon: "🔇", label: "Quiet & Low Noise" },
                    { icon: "☕", label: "Café Culture" },
                    { icon: "🚴", label: "Bike-Friendly" },
                    { icon: "🏊", label: "Recreation Facilities" },
                    { icon: "🌇", label: "City Connectivity" },
                ].map(item => (
                    <SelectCard key={item.label} {...item}
                        selected={lifestyle.includes(item.label)}
                        onClick={() => toggle(item.label)} />
                ))}
            </div>
        </>
    );
}
