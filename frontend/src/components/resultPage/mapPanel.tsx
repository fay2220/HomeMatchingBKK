import { useEffect, useRef, useState } from "react";
import type { Map, Marker, TileLayer } from "leaflet";
import { GREEN, BLUE, AMBER } from "../variable";
import { InsightChip } from "./insightChip";
import type { Property } from "./types";
import "leaflet/dist/leaflet.css";

// ── Tile Styles ───────────────────────────────────────────────────────────────
const TILE_STYLES = [
    { id: "light",     label: "🗺️ Light",     stadia: "alidade_smooth",      osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" },
    { id: "dark",      label: "🌙 Dark",      stadia: "alidade_smooth_dark",  osm: null },
    { id: "satellite", label: "🛰️ Satellite", stadia: "alidade_satellite",    osm: null },
    { id: "toner",     label: "⬛ Toner",     stadia: "stamen_toner",         osm: null },
] as const;

type TileStyleId = typeof TILE_STYLES[number]["id"];

// ── Component ─────────────────────────────────────────────────────────────────
export function MapPanel({ properties, selected, onSelect }: { properties: any[], selected: number, onSelect: (id: number) => void }) {
    const mapRef = useRef<Map | null>(null);
    const markersRef = useRef<globalThis.Map<number, Marker>>(new globalThis.Map());
    const containerRef = useRef<HTMLDivElement>(null);
    const tileRef = useRef<TileLayer | null>(null);
    const [tileStyle, setTileStyle] = useState<TileStyleId>("light");

    const prop = properties.find(p => p.id === selected) ?? properties[0];
    const apiKey = import.meta.env.VITE_MAP_OSM_API as string;

    /** Build tile URL for a given style */
    const getTileUrl = (styleId: TileStyleId): { url: string; attribution: string } => {
        const s = TILE_STYLES.find(t => t.id === styleId)!;
        if (apiKey) {
            return {
                url: `https://tiles.stadiamaps.com/tiles/${s.stadia}/{z}/{x}/{y}{r}.png?api_key=${apiKey}`,
                attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            };
        }
        return {
            url: s.osm ?? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        };
    };

    // ── Init Leaflet map once ────────────────────────────────────────────────
    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;

        import("leaflet").then(L => {
            if (!containerRef.current || mapRef.current) return;

            delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            });

            const map = L.map(containerRef.current!, {
                center: [13.7400, 100.5900], zoom: 11,
                zoomControl: true, scrollWheelZoom: true,
            });
            mapRef.current = map;

            const { url, attribution } = getTileUrl("light");
            tileRef.current = L.tileLayer(url, { attribution, maxZoom: 18 });
            tileRef.current.addTo(map);
        });

        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
            markersRef.current.clear();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Switch tile layer when style changes ──────────────────────────────────
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;
        import("leaflet").then(L => {
            if (tileRef.current) map.removeLayer(tileRef.current);
            const { url, attribution } = getTileUrl(tileStyle);
            tileRef.current = L.tileLayer(url, { attribution, maxZoom: 18 });
            tileRef.current.addTo(map);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tileStyle]);

    // ── Pan + highlight on selection change ───────────────────────────────────
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !properties) return;
        
        import("leaflet").then(L => {
            markersRef.current.forEach(m => m.remove());
            markersRef.current.clear();

            properties.forEach(p => {
                const color = p.score >= 85 ? "#10B981" : p.score >= 70 ? "#3B82F6" : "#F59E0B";
                const isSel = p.id === selected;
                const icon = L.divIcon({
                    className: "",
                    html: `<div style="background:${color};border:${isSel ? "3px solid white" : "2px solid rgba(255,255,255,0.7)"};border-radius:10px;padding:3px 8px;font-size:${isSel ? 13 : 11}px;font-weight:900;color:white;box-shadow:${isSel ? `0 4px 18px ${color}99` : `0 2px 8px ${color}55`};transform:${isSel ? "scale(1.25)" : "scale(1)"};white-space:nowrap;cursor:pointer;transition:transform 0.15s">${p.score}%</div>`,
                    iconAnchor: [24, 14],
                });
                const marker = L.marker([p.lat, p.lng], { icon })
                    .addTo(map).on("click", () => onSelect(p.id));
                markersRef.current.set(p.id, marker);
            });
            
            if (prop) {
                map.setView([prop.lat, prop.lng], 13, { animate: true });
            }
        });
    }, [selected, properties]);

    return (
        <div className="relative w-full h-full rounded-2xl overflow-hidden" style={{ minHeight: 400 }}>

            {/* Style Switcher */}
            <div className="absolute top-3 right-3 z-[1000] flex gap-1.5">
                {TILE_STYLES.map(s => (
                    <button
                        key={s.id}
                        onClick={() => setTileStyle(s.id)}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all"
                        style={{
                            background: tileStyle === s.id ? "rgba(16,185,129,0.95)" : "rgba(255,255,255,0.88)",
                            color: tileStyle === s.id ? "white" : "#374151",
                            backdropFilter: "blur(8px)",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            border: tileStyle === s.id ? "2px solid rgba(255,255,255,0.4)" : "1.5px solid rgba(0,0,0,0.08)",
                        }}
                    >
                        {s.label}
                    </button>
                ))}
            </div>

            {/* Leaflet Map */}
            <div ref={containerRef} className="w-full h-full" style={{ minHeight: 400 }} />

            {/* Selected property card */}
            {prop && (
                <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-80 rounded-2xl p-4 z-[1000] bg-white/95 backdrop-blur-md shadow-2xl transition-all border border-white/50">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-black" style={{ color: BLUE }}>{prop.name}</div>
                            <div className="text-xs mb-2" style={{ color: "#94A3B8" }}>
                                {prop.address} · {prop.commuteMinutes ?? 15} min commute · {prop.sizeSqm} sq.m.
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {prop.insights?.map((ins: any) => <InsightChip key={ins.label} {...ins} />)}
                            </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <div className="text-lg font-black"
                                style={{ color: prop.score >= 85 ? GREEN : prop.score >= 70 ? "#3B82F6" : AMBER }}>
                                {prop.score}%
                            </div>
                            <div className="text-sm font-black" style={{ color: BLUE }}>{prop.price}</div>
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
            )}
        </div>
    );
}
