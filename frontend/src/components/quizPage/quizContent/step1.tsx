import { SelectCard } from "../selectCard";

interface Step1Props {
    family: string[];
    toggle: (v: string) => void;
}

export function Step1({ family, toggle }: Step1Props) {
    return (
        <>
            <p className="text-sm mb-8" style={{ color: "#64748B" }}>
                Select all household members. We'll tailor health-compatible neighborhoods for everyone living with you.
            </p>
            <div className="grid grid-cols-4 gap-4">
                {[
                    { icon: "👶", label: "Infant (0–2)" },
                    { icon: "🧒", label: "Young Child (3–12)" },
                    { icon: "🧑‍🎓", label: "Teen (13–17)" },
                    { icon: "🧑", label: "Adult (18–64)" },
                    { icon: "👴", label: "Elderly (65+)" },
                    { icon: "🧓", label: "Senior (75+)" },
                    { icon: "🤰", label: "Expecting" },
                    { icon: "🧑‍🦽", label: "Mobility Needs" },
                ].map(item => (
                    <SelectCard key={item.label} {...item}
                        selected={family.includes(item.label)}
                        onClick={() => toggle(item.label)} />
                ))}
            </div>
        </>
    );
}
