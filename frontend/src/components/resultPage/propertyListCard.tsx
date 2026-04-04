import { GREEN, BLUE, AMBER } from "../variable";
import type { Property } from "./types";
import { InsightChip } from "./insightChip";

export function PropertyListCard({
    name, address, price, beds, baths, sqft,
    score, badge, badgeColor, insights, risk, grad,
    selected, onClick,
}: Property & { selected: boolean; onClick: () => void }) {
    const scoreColor = score >= 85 ? GREEN : score >= 70 ? "#3B82F6" : AMBER;
    return (
        <div onClick={onClick}
            className="flex gap-4 p-4 rounded-2xl mb-3 cursor-pointer transition-all"
            style={{
                background: selected ? "#ffffff" : "rgba(255,255,255,0.7)",
                border: selected ? `2px solid ${GREEN}` : "1.5px solid #F1F5F9",
                boxShadow: selected ? "0 6px 24px rgba(16,185,129,0.18)" : "0 2px 8px rgba(0,0,0,0.04)",
            }}>

            {/* Thumbnail */}
            <div className="w-28 h-24 rounded-xl flex-shrink-0 relative overflow-hidden"
                style={{ background: grad }}>
                <div className="absolute inset-0 flex items-end justify-around px-1 pb-1">
                    {[0.5, 0.85, 0.65, 1, 0.7].map((h, i) => (
                        <div key={i} className="rounded-t"
                            style={{ width: 14, height: `${h * 60}%`, background: "rgba(255,255,255,0.3)" }} />
                    ))}
                </div>
                <div className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 55%)" }} />
                <div className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${badgeColor}CC`, color: "white" }}>{badge}</div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                        <div className="text-sm font-bold" style={{ color: "#1F2937" }}>{name}</div>
                        <div className="text-xs" style={{ color: "#94A3B8" }}>{address}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <div className="text-lg font-black" style={{ color: BLUE }}>{price}</div>
                        <div className="text-[10px]" style={{ color: "#94A3B8" }}>/mo</div>
                    </div>
                </div>
                <div className="flex gap-3 text-xs mb-2" style={{ color: "#64748B" }}>
                    <span>🛏 {beds}bd</span>
                    <span>🛁 {baths}ba</span>
                    <span>📐 {sqft} ft²</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                    {insights.map(ins => <InsightChip key={ins.label} {...ins} />)}
                </div>
                {risk && (
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold" style={{ color: "#92400E" }}>
                        <span style={{ color: AMBER }}>⚠️</span> {risk}
                    </div>
                )}
            </div>

            {/* LifeFit Score column */}
            <div className="flex flex-col items-center justify-center flex-shrink-0 w-14">
                <div className="text-xl font-black" style={{ color: scoreColor }}>{score}%</div>
                <div className="text-[9px] font-semibold text-center" style={{ color: "#94A3B8" }}>LifeFit Score</div>
                <div className="mt-2 w-10 h-1.5 rounded-full overflow-hidden" style={{ background: "#F1F5F9" }}>
                    <div className="h-full rounded-full" style={{ width: `${score}%`, background: scoreColor }} />
                </div>
            </div>
        </div>
    );
}
