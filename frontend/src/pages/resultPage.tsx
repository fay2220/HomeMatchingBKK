import { useState } from "react";
import { GREEN, BLUE } from "../components/variable";
import { FILTERS, PROPERTIES } from "../components/resultPage/data";
import { PropertyListCard } from "../components/resultPage/propertyListCard";
import { MapPanel } from "../components/resultPage/mapPanel";

// ─── Page ─────────────────────────────────────────────────────────────────────

export function PropertiesPage() {
    const [selected, setSelected] = useState<number>(1);
    const [activeFilter, setActiveFilter] = useState<string>("All");

    return (
        <div className="flex flex-col w-full min-h-screen" style={{ fontFamily: "'Inter', 'Montserrat', sans-serif", background: "#F8FAFC" }}>
            {/* Top bar */}
            <div className="flex items-center justify-between px-7 py-4 border-b flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderColor: "#E2E8F0" }}>
                <div>
                    <div className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "#94A3B8" }}>
                        847 properties found
                    </div>
                    <h1 className="text-xl font-black" style={{ color: BLUE }}>Explore Properties</h1>
                </div>
                <div className="flex items-center gap-2">
                    {FILTERS.map(f => (
                        <button key={f} onClick={() => setActiveFilter(f)}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                            style={{
                                background: activeFilter === f ? GREEN : "#F1F5F9",
                                color: activeFilter === f ? "white" : "#64748B",
                            }}>
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Split panel */}
            <div className="flex flex-1 overflow-hidden">

                {/* Property list — left */}
                <div className="w-96 flex-shrink-0 overflow-auto p-4"
                    style={{ borderRight: "1px solid #E2E8F0" }}>
                    <div className="flex items-center justify-between mb-3 px-1">
                        <span className="text-xs font-bold" style={{ color: BLUE }}>Matched for You</span>
                        <span className="text-xs cursor-pointer" style={{ color: "#94A3B8" }}>Sort: Best Match ▾</span>
                    </div>
                    {PROPERTIES.map(p => (
                        <PropertyListCard key={p.id} {...p}
                            selected={p.id === selected}
                            onClick={() => setSelected(p.id)} />
                    ))}
                </div>

                {/* Map — right */}
                <div className="flex-1 p-4">
                    <MapPanel selected={selected} onSelect={setSelected} />
                </div>

            </div>
        </div>
    );
}