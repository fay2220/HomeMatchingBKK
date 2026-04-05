import { useState } from "react";
import { useLocation } from "wouter";
import { Sidebar } from "../components/quizPage/sidebar";
import { STEPS, GREEN, BLUE, type Step } from "../components/variable";
import { Step1 } from "../components/quizPage/quizContent/step1";
import { Step2 } from "../components/quizPage/quizContent/step2";
import { Step3 } from "../components/quizPage/quizContent/step3";
import { Step4 } from "../components/quizPage/quizContent/step4";
import { Step5 } from "../components/quizPage/quizContent/step5";
import { Step6 } from "../components/quizPage/quizContent/step6";

// ─── Main Component ───────────────────────────────────────────────────────────

export function QuizPage() {
    const [, setLocation] = useLocation();
    const [step, setStep] = useState<Step>(0);
    const [peopleCount, setPeopleCount] = useState<number>(1);
    const [family, setFamily] = useState<string[]>([]);
    const [pets, setPets] = useState<string[]>([]);
    const [health, setHealth] = useState<string[]>([]);
    const [budget, setBudget] = useState<{ min: number, max: number }>({ min: 500000, max: 50000000 });
    const [houseSize, setHouseSize] = useState<{ min: number, max: number }>({ min: 24, max: 240 });
    const [commute, setCommute] = useState<number>(30);
    const [lifestyle, setLifestyle] = useState<string[]>([]);
    const [location, setLocationState] = useState<string>("");

    const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
        set(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);

    const stepComponents = [
        <Step1 key="1" peopleCount={peopleCount} setPeopleCount={setPeopleCount} family={family} toggle={(v) => toggle(family, setFamily, v)} location={location} setLocation={setLocationState} />,
        <Step2 key="2" pets={pets} setPets={setPets} toggle={(v) => toggle(pets, setPets, v)} />,
        <Step3 key="3" health={health} toggle={(v) => toggle(health, setHealth, v)} />,
        <Step4 key="4" budget={budget} setBudget={setBudget} commute={commute} setCommute={setCommute} houseSize={houseSize} setHouseSize={setHouseSize} />,
        <Step5 key="5" lifestyle={lifestyle} toggle={(v) => toggle(lifestyle, setLifestyle, v)} />,
        <Step6 key="6" setLocation={setLocation} />
    ];

    const formatB = (n: number) => n >= 1000000 ? `${(n/1000000).toFixed(n % 1000000 === 0 ? 0 : 1)}M` : `${(n/1000).toFixed(0)}k`;

    const selections: Record<string, string[]> = { 
        Family: [
            ...(location ? [`📍 เขต${location}`] : []),
            ...(peopleCount > 0 ? [`${peopleCount} People`] : []),
            ...family
        ], 
        Pets: pets, 
        Health: health, 
        Budget: budget.max > 500000 ? [`฿${formatB(budget.min)}-฿${formatB(budget.max)}`, `${houseSize.min}-${houseSize.max} SQM`, `<${commute}m commute`] : [],
        Lifestyle: lifestyle 
    };
    const selectedCount = [family, pets, health, ["Budget & Commute"], lifestyle][step] ?? [];

    return (
        <div className="flex w-full min-h-screen"
            style={{ fontFamily: "'Inter', 'Montserrat', sans-serif", background: "#F8FAFC" }}>

            <Sidebar step={step} selections={selections} />

            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Top bar */}
                <div className="flex items-center justify-between px-10 py-5 border-b"
                    style={{ borderColor: "#E2E8F0", background: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)" }}>
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#94A3B8" }}>
                            Step {step + 1} of {STEPS.length}
                        </div>
                        <h1 className="text-2xl font-black" style={{ color: BLUE }}>{STEPS[step].label}</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                            {STEPS.map((_, i) => (
                                <div key={i} className="h-1.5 rounded-full transition-all"
                                    style={{ width: i === step ? 32 : 8, background: i <= step ? GREEN : "#E2E8F0" }} />
                            ))}
                        </div>
                        <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white"
                            style={{ background: `linear-gradient(135deg, ${BLUE}, #1e40af)` }}>S</div>
                    </div>
                </div>

                {/* Step Content */}
                <div className="flex-1 overflow-auto px-10 py-8">
                    {stepComponents[step]}
                </div>

                {/* Footer Nav */}
                {step < 5 && (
                    <div className="flex items-center justify-between px-10 py-5 border-t"
                        style={{ borderColor: "#E2E8F0", background: "white" }}>
                        <button onClick={() => setStep(s => Math.max(s - 1, 0) as Step)}
                            className="px-6 py-3 rounded-2xl border-2 text-sm font-semibold transition-all cursor-pointer"
                            style={{ borderColor: "#E2E8F0", color: "#64748B", visibility: step === 0 ? "hidden" : "visible" }}>
                            ← Back
                        </button>
                        <div className="text-xs" style={{ color: "#94A3B8" }}>
                            {selectedCount.length} selected
                        </div>
                        <button onClick={() => setStep(s => Math.min(s + 1, 5) as Step)}
                            className="px-8 py-3 rounded-2xl text-white font-bold text-sm transition-all cursor-pointer"
                            style={{ background: `linear-gradient(135deg, ${GREEN}, #059669)`, boxShadow: "0 4px 16px rgba(16,185,129,0.35)" }}>
                            {step === 4 ? "Generate My LifeFit Score →" : "Continue →"}
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}