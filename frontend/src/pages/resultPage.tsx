import { useState, useEffect } from "react";
import { GREEN, BLUE } from "../components/variable";
import { FILTERS } from "../components/resultPage/data";
import { PropertyListCard } from "../components/resultPage/propertyListCard";
import { MapPanel } from "../components/resultPage/mapPanel";
import type { Property } from "../components/resultPage/types";

// ─── Page ─────────────────────────────────────────────────────────────────────

export function PropertiesPage() {
    const [selected, setSelected] = useState<number>(0);
    const [activeFilter, setActiveFilter] = useState<string>("All");
    
    // Dynamic data state
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const profileStr = sessionStorage.getItem('userProfile');
                // Default fallback if no profile exists (e.g., direct navigation)
                const userProfile = profileStr ? JSON.parse(profileStr) : {
                    budget: { min: 2000000, max: 10000000 },
                    houseSize: { min: 30, max: 200 },
                    peopleCount: 1,
                    family: [],
                    pets: ['none'],
                    health: ['none'],
                    commute: 30,
                    workplace: 'อโศก',
                    lifestyle: []
                };

                const res = await fetch('http://localhost:3000/api/score/all', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userProfile })
                });

                if (!res.ok) throw new Error('Failed to fetch scores');
                
                const data = await res.json();
                setProperties(data.results || []);
                if (data.results?.length > 0) {
                    setSelected(data.results[0].id);
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load property scores.');
            } finally {
                setLoading(false);
            }
        };
        fetchScores();
    }, []);

    if (loading) {
        return <div className="flex h-screen items-center justify-center font-bold text-gray-500">Calculating your LifeFit matches...</div>;
    }
    if (error) {
        return <div className="flex h-screen items-center justify-center font-bold text-red-500">{error}</div>;
    }

    return (
        <div
            className="flex flex-col w-full"
            style={{
                fontFamily: "'Inter', 'Montserrat', sans-serif",
                background: "#F8FAFC",
                height: "100dvh",   // fill the viewport exactly
                overflow: "hidden",
            }}
        >
            {/* ── Top bar ─────────────────────────────────────────────────── */}
            <div
                className="flex items-center justify-between px-7 py-3 border-b flex-shrink-0"
                style={{
                    background: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(12px)",
                    borderColor: "#E2E8F0",
                }}
            >
                <div>
                    <div className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "#94A3B8" }}>
                        {properties.length} properties found
                    </div>
                    <h1 className="text-xl font-black" style={{ color: BLUE }}>
                        HomeMatchingBKK{" "}
                        <span className="text-sm font-medium" style={{ color: "#94A3B8" }}>— Explore Properties</span>
                    </h1>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-end">
                    {FILTERS.map(f => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                            style={{
                                background: activeFilter === f ? GREEN : "#F1F5F9",
                                color: activeFilter === f ? "white" : "#64748B",
                            }}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Split panel ─────────────────────────────────────────────── */}
            <div className="flex flex-1 min-h-0">

                {/* Property list — left, scrollable */}
                <div
                    className="w-96 flex-shrink-0 flex flex-col"
                    style={{ borderRight: "1px solid #E2E8F0" }}
                >
                    {/* Fixed sub-header */}
                    <div className="flex items-center justify-between px-4 py-2 flex-shrink-0"
                        style={{ borderBottom: "1px solid #F1F5F9" }}>
                        <span className="text-xs font-bold" style={{ color: BLUE }}>Matched for You</span>
                        <span className="text-xs cursor-pointer" style={{ color: "#94A3B8" }}>Sort: Best Match ▾</span>
                    </div>

                    {/* Scrollable list */}
                    <div className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth: "thin" }}>
                        {properties.map(p => (
                            <PropertyListCard
                                key={p.id}
                                {...p}
                                selected={p.id === selected}
                                onClick={() => setSelected(p.id)}
                            />
                        ))}
                    </div>
                </div>

                {/* Map — right, fills remaining space */}
                <div className="flex-1 p-4 min-w-0">
                    <MapPanel properties={properties} selected={selected} onSelect={setSelected} />
                </div>

            </div>
        </div>
    );
}