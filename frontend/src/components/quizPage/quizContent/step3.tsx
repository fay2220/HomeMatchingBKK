import { HealthRow } from "../healthRow";

interface Step3Props {
    health: string[];
    toggle: (v: string) => void;
}

export function Step3({ health, toggle }: Step3Props) {
    return (
        <>
            <p className="text-sm mb-8" style={{ color: "#64748B" }}>
                Your health priorities help us surface neighborhoods with better air quality, hospital proximity, and accessible infrastructure.
            </p>
            <div className="grid grid-cols-2 gap-3">
                {[
                    { icon: "🫁", label: "Respiratory Conditions", sublabel: "Asthma, COPD, allergies — prioritize low PM2.5 zones" },
                    { icon: "♿", label: "Mobility & Accessibility", sublabel: "Elevators, ramps, wide sidewalks, step-free access" },
                    { icon: "❤️", label: "Cardiovascular Health", sublabel: "Near cardiac centers, walkable, low-stress neighborhoods" },
                    { icon: "🧠", label: "Mental Wellness", sublabel: "Green spaces, low noise levels, quiet residential areas" },
                    { icon: "🤧", label: "Allergy Sensitivity", sublabel: "Air purity, pollen data, clean indoor environments" },
                    { icon: "💊", label: "Chronic Condition Management", sublabel: "Proximity to pharmacies, specialist clinics, dialysis" },
                    { icon: "🦮", label: "Visual / Hearing Impairment", sublabel: "Audio crosswalks, tactile paving, accessible transit" },
                    { icon: "🩺", label: "Post-Surgery Recovery", sublabel: "Short-term care, quiet environment, near rehab centers" },
                ].map(item => (
                    <HealthRow key={item.label} {...item}
                        selected={health.includes(item.label)}
                        onClick={() => toggle(item.label)} />
                ))}
            </div>
        </>
    );
}
