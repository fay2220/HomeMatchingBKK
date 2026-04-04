import { SelectCard } from "../selectCard";

interface Step1Props {
    peopleCount: number;
    setPeopleCount: (v: number) => void;
    family: string[];
    toggle: (v: string) => void;
}

export function Step1({ peopleCount, setPeopleCount, family, toggle }: Step1Props) {
    return (
        <>
            <p className="text-sm mb-6" style={{ color: "#64748B" }}>
                Select all household members. We'll tailor health-compatible neighborhoods for everyone living with you.
            </p>

            <div className="mb-8">
                <div className="text-sm font-bold mb-2" style={{ color: "#1F2937" }}>Number of People Living</div>
                <div className="flex items-center gap-4">
                    <button onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))} className="w-10 h-10 rounded-full border-2 border-slate-200 flex flex-col justify-center items-center text-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors">-</button>
                    <div className="text-lg font-black w-8 text-center">{peopleCount}</div>
                    <button onClick={() => setPeopleCount(peopleCount + 1)} className="w-10 h-10 rounded-full border-2 border-slate-200 flex flex-col justify-center items-center text-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors">+</button>
                </div>
            </div>

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
