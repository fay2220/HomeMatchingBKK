import { GREEN, BLUE, AMBER } from "../variable";
import { PROPERTIES } from "./data";
import { InsightChip } from "./insightChip";

// Map pin positions for each property (percentage-based so they scale)
const PIN_POSITIONS = [
    { x: 40, y: 45 },
    { x: 65, y: 25 },
    { x: 25, y: 65 },
    { x: 72, y: 60 },
];

export function MapPanel({ selected, onSelect }: { selected: number; onSelect: (id: number) => void }) {
    const prop = PROPERTIES.find(p => p.id === selected) ?? PROPERTIES[0];
    return (
        <div className="relative w-full h-full rounded-2xl overflow-hidden"
            style={{ background: "linear-gradient(135deg, #e8f5e9 0%, #e3f2fd 50%, #f1f8e9 100%)", minHeight: 400 }}>

            {/* Road grid */}
            <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.25 }}>
                {[15, 30, 45, 60, 75].map(p => (
                    <line key={`h${p}`} x1="0%" y1={`${p}%`} x2="100%" y2={`${p}%`} stroke="#90A4AE" strokeWidth="2" />
                ))}
                {[10, 25, 40, 55, 70, 85].map(p => (
                    <line key={`v${p}`} x1={`${p}%`} y1="0%" x2={`${p}%`} y2="100%" stroke="#90A4AE" strokeWidth="2" />
                ))}
                {/* River */}
                <path d="M 0 330 Q 300 290 600 310 T 1200 295"
                    stroke="#90CAF9" strokeWidth="18" fill="none" strokeOpacity="0.4" />
            </svg>

            {/* Property pins */}
            {PROPERTIES.map((p, i) => {
                const pos = PIN_POSITIONS[i];
                const isSelected = p.id === selected;
                const c = p.score >= 85 ? GREEN : p.score >= 70 ? "#3B82F6" : AMBER;
                return (
                    <div key={p.id} onClick={() => onSelect(p.id)}
                        className="absolute flex flex-col items-center cursor-pointer transition-all"
                        style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%,-50%)" }}>
                        <div className="px-2.5 py-1.5 rounded-xl text-xs font-black text-white"
                            style={{
                                background: c,
                                transform: isSelected ? "scale(1.2)" : "scale(1)",
                                boxShadow: isSelected ? `0 6px 20px ${c}66` : "0 2px 8px rgba(0,0,0,0.2)",
                                border: isSelected ? "2px solid white" : "none",
                                transition: "transform 0.2s, box-shadow 0.2s",
                            }}>
                            {p.score}%
                        </div>
                        <div className="w-2 h-2 rounded-full mt-0.5" style={{ background: c }} />
                    </div>
                );
            })}

            {/* Selected property detail card */}
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl p-4"
                style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-black" style={{ color: BLUE }}>{prop.name}</div>
                        <div className="text-xs mb-2" style={{ color: "#94A3B8" }}>{prop.address}</div>
                        <div className="flex flex-wrap gap-1">
                            {prop.insights.map(ins => <InsightChip key={ins.label} {...ins} />)}
                        </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <div className="text-lg font-black"
                            style={{ color: prop.score >= 85 ? GREEN : prop.score >= 70 ? "#3B82F6" : AMBER }}>
                            {prop.score}%
                        </div>
                        <div className="text-sm font-black" style={{ color: BLUE }}>{prop.price}/mo</div>
                    </div>
                </div>
                {prop.risk && (
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold mt-2" style={{ color: "#92400E" }}>
                        <span style={{ color: AMBER }}>⚠️</span> {prop.risk}
                    </div>
                )}
                <button className="w-full mt-3 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer transition-opacity hover:opacity-90"
                    style={{ background: `linear-gradient(135deg, ${GREEN}, #059669)` }}>
                    View Full Details →
                </button>
            </div>
        </div>
    );
}
