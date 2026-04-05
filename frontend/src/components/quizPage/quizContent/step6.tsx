import { GREEN, BLUE } from "../../variable";

interface Step6Props {
    onFinish: () => void;
}

export function Step6({ onFinish }: Step6Props) {
    return (
        <div className="flex flex-col items-center justify-center h-full py-12 text-center max-w-xl mx-auto">
            <div className="w-28 h-28 rounded-full flex items-center justify-center mb-6 text-5xl"
                style={{ background: `linear-gradient(135deg, ${GREEN}, #059669)`, boxShadow: "0 12px 40px rgba(16,185,129,0.35)" }}>
                ✓
            </div>
            <h2 className="text-3xl font-black mb-3" style={{ color: BLUE }}>Profile Complete!</h2>
            <p className="text-base mb-8" style={{ color: "#64748B" }}>
                Your AI is now analyzing 200+ neighborhood health signals across 847 properties to generate your personalized LifeFit Score.
            </p>
            <div className="w-full rounded-2xl p-5 mb-6 text-left"
                style={{ background: "rgba(16,185,129,0.07)", border: "1.5px solid rgba(16,185,129,0.2)" }}>
                <div className="flex items-center gap-3 mb-3">
                    <span style={{ fontSize: 20 }}>🧬</span>
                    <span className="font-bold" style={{ color: BLUE }}>AI Analysis In Progress</span>
                </div>
                <div className="flex flex-col gap-2 text-sm" style={{ color: "#64748B" }}>
                    {[
                        "Analyzing air quality & PM2.5 levels...",
                        "Mapping hospital & clinic proximity...",
                        "Scoring walkability & transit access...",
                        "Cross-referencing pet-friendly zones...",
                    ].map((msg, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <span style={{ color: GREEN }}>✓</span> {msg}
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={onFinish}
                className="px-10 py-4 rounded-2xl font-bold text-white text-base cursor-pointer hover:opacity-90 transition-all"
                style={{ background: `linear-gradient(135deg, ${BLUE}, #1e40af)`, boxShadow: "0 6px 20px rgba(30,58,138,0.3)" }}>
                View My LifeFit Dashboard →
            </button>
        </div>
    );
}
