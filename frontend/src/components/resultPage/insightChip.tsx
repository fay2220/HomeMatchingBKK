import { GREEN } from "../variable";
import type { Insight } from "./types";

export function InsightChip({ icon, label, color = GREEN }: Insight) {
    return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold"
            style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
            {icon} {label}
        </span>
    );
}
