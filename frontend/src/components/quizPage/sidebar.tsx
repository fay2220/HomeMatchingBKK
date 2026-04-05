import { useLocation } from "wouter";
import { GREEN, BLUE, type Step, STEPS } from "../variable";




export function Sidebar({ step, selections }: { step: Step; selections: Record<string, string[]> }) {
    const [, navigate] = useLocation();
    return (
        <div className="w-72 flex-shrink-0 flex flex-col"
            style={{ background: `linear-gradient(160deg, ${BLUE} 0%, #1e40af 100%)`, minHeight: "100%" }}>

            {/* Logo — click to go Home */}
            <div className="px-8 pt-8 pb-6 border-b border-white/10">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-3 cursor-pointer group"
                    style={{ background: "none", border: "none", padding: 0 }}
                >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: GREEN }}>
                        <span style={{ fontSize: 18 }}>🏡</span>
                    </div>
                    <div className="text-left">
                        <div className="text-white font-black text-base leading-tight group-hover:text-green-300 transition-colors">HomeMatchingBKK</div>
                        <div className="text-blue-300 text-[10px]">LifeFit Engine™</div>
                    </div>
                </button>
            </div>

            {/* Step list */}
            <div className="px-6 py-6 flex-1">
                <p className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-5">Your Journey</p>
                <div className="flex flex-col gap-2">
                    {STEPS.map((s) => {
                        const done = s.id < step;
                        const active = s.id === step;
                        return (
                            <div key={s.id} className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all"
                                style={{
                                    background: active ? "rgba(16,185,129,0.18)" : done ? "rgba(255,255,255,0.06)" : "transparent",
                                    border: active ? "1.5px solid rgba(16,185,129,0.4)" : "1.5px solid transparent",
                                }}>
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                                    style={{
                                        background: done ? GREEN : active ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.1)",
                                        color: done || active ? "white" : "#94A3B8",
                                        fontWeight: 700,
                                    }}>
                                    {done ? "✓" : s.icon}
                                </div>
                                <div>
                                    <div className="text-sm font-semibold"
                                        style={{ color: active ? "#6EE7B7" : done ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)" }}>
                                        {s.label}
                                    </div>
                                    <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{s.desc}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Profile summary */}
            <div className="px-6 pb-8">
                <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-300 mb-3">Profile Summary</p>
                    {Object.entries(selections).map(([key, vals]) =>
                        vals.length > 0 ? (
                            <div key={key} className="flex items-start gap-2 mb-2">
                                <span style={{ color: GREEN, fontSize: 11 }}>✓</span>
                                <span className="text-[11px] text-blue-200">
                                    {key}: {vals.slice(0, 2).join(", ")}{vals.length > 2 ? ` +${vals.length - 2}` : ""}
                                </span>
                            </div>
                        ) : null
                    )}
                    {Object.values(selections).every(v => v.length === 0) && (
                        <p className="text-[11px] text-blue-400">Complete the steps to build your profile.</p>
                    )}
                </div>
            </div>
        </div>
    );
}