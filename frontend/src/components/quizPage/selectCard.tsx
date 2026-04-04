import { GREEN } from "../variable";

export function SelectCard({ icon, label, selected, onClick }:
    { icon: string; label: string; selected: boolean; onClick: () => void }) {
    return (
        <button onClick={onClick}
            className="flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all cursor-pointer w-full"
            style={{
                borderColor: selected ? GREEN : "#E2E8F0",
                background: selected ? "rgba(16,185,129,0.07)" : "rgba(255,255,255,0.8)",
                boxShadow: selected ? "0 4px 20px rgba(16,185,129,0.18)" : "0 2px 8px rgba(0,0,0,0.04)",
                transform: selected ? "translateY(-2px)" : "none",
            }}>
            <span style={{ fontSize: 40 }}>{icon}</span>
            <span className="text-sm font-semibold text-center" style={{ color: selected ? GREEN : "#374151" }}>{label}</span>
            {selected && (
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: GREEN }}>✓</div>
            )}
        </button>
    );
}