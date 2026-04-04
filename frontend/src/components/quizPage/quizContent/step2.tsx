import { SelectCard } from "../selectCard";
import { GREEN } from "../../variable";

interface Step2Props {
    pets: string[];
    toggle: (v: string) => void;
    setPets: (pets: string[]) => void;
}

export function Step2({ pets, toggle, setPets }: Step2Props) {
    return (
        <>
            <p className="text-sm mb-8" style={{ color: "#64748B" }}>
                We'll prioritize listings near pet parks, dog-friendly trails, and top-rated veterinary clinics.
            </p>
            <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                    { icon: "🐕", label: "Dog" },
                    { icon: "🐈", label: "Cat" },
                    { icon: "🐇", label: "Rabbit" },
                    { icon: "🦜", label: "Bird" },
                    { icon: "🐠", label: "Fish / Reptile" },
                    { icon: "🐹", label: "Small Animal" },
                ].map(item => (
                    <SelectCard key={item.label} {...item}
                        selected={pets.includes(item.label)}
                        onClick={() => toggle(item.label)} />
                ))}
            </div>
            <button onClick={() => setPets(pets.includes("None") ? [] : ["None"])}
                className="px-6 py-3 rounded-2xl border-2 text-sm font-semibold transition-all cursor-pointer hover:opacity-80"
                style={{
                    borderColor: pets.includes("None") ? GREEN : "#E2E8F0",
                    background: pets.includes("None") ? "rgba(16,185,129,0.07)" : "transparent",
                    color: "#64748B",
                }}>
                No pets
            </button>
        </>
    );
}
