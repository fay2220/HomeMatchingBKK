import { GREEN } from "../variable";

export function HealthRow({ icon, label, sublabel, selected, onClick }:
    { icon: string; label: string; sublabel: string; selected: boolean; onClick: () => void }) {
    return (
        <button onClick={onClick}
            className="flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all w-full text-left"
            style={{
                borderColor: selected ? GREEN : "#E2E8F0",
                background: selected ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.8)",
                boxShadow: selected ? "0 4px 16px rgba(16,185,129,0.14)" : "0 1px 4px rgba(0,0,0,0.04)",
            }}>
            <span style={{ fontSize: 28 }}>{icon}</span>
            <div className="flex-1">
                <div className="text-sm font-semibold" style={{ color: "#1F2937" }}>{label}</div>
                <div className="text-xs" style={{ color: "#94A3B8" }}>{sublabel}</div>
            </div>
            <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                style={{ borderColor: selected ? GREEN : "#CBD5E1", background: selected ? GREEN : "transparent" }}>
                {selected && <span className="text-white text-xs font-bold">✓</span>}
            </div>
        </button>
    );
}