import { useEffect, useRef } from "react";
import type { Map, Marker, TileLayer } from "leaflet";
import { GREEN, BLUE, AMBER } from "../variable";
import { InsightChip } from "./insightChip";
import type { Property } from "./types";
import "leaflet/dist/leaflet.css";

// ── Property locations from mock.json (real Bangkok coordinates) ─────────────
export const MOCK_PROPERTIES: (Property & {
    lat: number;
    lng: number;
    commuteMinutes: number;
    sizeSqm: number;
})[] = [
    {
        id: 1, lat: 13.7431, lng: 100.5841,
        name: "The Monument Thong Lo", address: "Thong Lo, Watthana",
        price: "฿35M", beds: 2, baths: 2, sqft: "124", score: 88,
        badge: "Excellent Fit 🏡", badgeColor: GREEN,
        insights: [
            { icon: "🏥", label: "Hospital 450m", color: GREEN },
            { icon: "🐾", label: "Pet Park", color: GREEN },
            { icon: "☕", label: "Cafe 50m", color: GREEN },
        ],
        grad: `linear-gradient(135deg, #0F766E, #10B981)`,
        commuteMinutes: 15, sizeSqm: 124,
    },
    {
        id: 2, lat: 13.6621, lng: 100.6542,
        name: "Whizdom The Forestias", address: "Bang Na - Trad KM.7",
        price: "฿7.5M", beds: 1, baths: 1, sqft: "45", score: 78,
        badge: "Excellent Fit 🏡", badgeColor: BLUE,
        insights: [
            { icon: "🌿", label: "Green Space 50m", color: GREEN },
            { icon: "🏋️", label: "Gym 100m", color: BLUE },
            { icon: "🔒", label: "High Security", color: BLUE },
        ],
        grad: `linear-gradient(135deg, #1E3A8A, #3B82F6)`,
        commuteMinutes: 35, sizeSqm: 45,
    },
    {
        id: 3, lat: 13.7475, lng: 100.6821,
        name: "Nantawan Rama 9", address: "Krungthep Kreetha",
        price: "฿45M", beds: 4, baths: 3, sqft: "350", score: 72,
        badge: "Good Match 👍", badgeColor: BLUE,
        insights: [
            { icon: "🏠", label: "350 sq.m.", color: GREEN },
            { icon: "🌳", label: "Quiet 35dB", color: GREEN },
        ],
        grad: `linear-gradient(135deg, #064E3B, #10B981)`,
        commuteMinutes: 45, sizeSqm: 350,
    },
    {
        id: 4, lat: 13.7172, lng: 100.5843,
        name: "Ideo Mobi Sukhumvit 40", address: "Ekkamai",
        price: "฿5.2M", beds: 1, baths: 1, sqft: "35", score: 65,
        badge: "Good Match 👍", badgeColor: AMBER,
        insights: [
            { icon: "🏥", label: "Hospital 850m", color: AMBER },
            { icon: "🚇", label: "BTS 600m", color: BLUE },
        ],
        risk: "No pets allowed",
        grad: `linear-gradient(135deg, #78350F, #F59E0B)`,
        commuteMinutes: 12, sizeSqm: 35,
    },
    {
        id: 5, lat: 13.7388, lng: 100.6065,
        name: "Metris Pattanakarn", address: "Pattanakarn",
        price: "฿3.9M", beds: 1, baths: 1, sqft: "30", score: 73,
        badge: "Good Match 👍", badgeColor: GREEN,
        insights: [
            { icon: "🐾", label: "Pet Park + Vet 150m", color: GREEN },
            { icon: "☕", label: "Cafe 300m", color: GREEN },
        ],
        grad: `linear-gradient(135deg, #0F766E, #10B981)`,
        commuteMinutes: 25, sizeSqm: 30,
    },
    {
        id: 6, lat: 13.6558, lng: 100.6725,
        name: "Centro Bangna", address: "Bang Na",
        price: "฿8.9M", beds: 3, baths: 2, sqft: "190", score: 58,
        badge: "Fair Match 🤔", badgeColor: AMBER,
        insights: [
            { icon: "🏠", label: "190 sq.m. House", color: GREEN },
            { icon: "🚗", label: "Parking", color: BLUE },
        ],
        risk: "Hospital 4.2km away",
        grad: `linear-gradient(135deg, #78350F, #F59E0B)`,
        commuteMinutes: 40, sizeSqm: 190,
    },
    {
        id: 7, lat: 13.7371, lng: 100.5604,
        name: "Ashton Asoke", address: "Sukhumvit 21",
        price: "฿9.5M", beds: 1, baths: 1, sqft: "34", score: 66,
        badge: "Good Match 👍", badgeColor: BLUE,
        insights: [
            { icon: "🚇", label: "BTS 50m", color: GREEN },
            { icon: "☕", label: "Cafe 20m", color: GREEN },
            { icon: "🏥", label: "Hospital 600m", color: GREEN },
        ],
        risk: "High noise 75dB",
        grad: `linear-gradient(135deg, #1E3A8A, #3B82F6)`,
        commuteMinutes: 5, sizeSqm: 34,
    },
    {
        id: 8, lat: 13.7125, lng: 100.5132,
        name: "Rhythm Charoenkrung", address: "Charoenkrung",
        price: "฿7.2M", beds: 1, baths: 1, sqft: "48", score: 70,
        badge: "Good Match 👍", badgeColor: BLUE,
        insights: [
            { icon: "🏫", label: "School 100m", color: GREEN },
            { icon: "🏋️", label: "Gym 150m", color: BLUE },
        ],
        grad: `linear-gradient(135deg, #1E3A8A, #3B82F6)`,
        commuteMinutes: 20, sizeSqm: 48,
    },
    {
        id: 9, lat: 13.8211, lng: 100.5635,
        name: "The Line Phahonyothin Park", address: "Lat Phrao",
        price: "฿4.8M", beds: 1, baths: 1, sqft: "32", score: 62,
        badge: "Good Match 👍", badgeColor: AMBER,
        insights: [
            { icon: "🌿", label: "Green Space 80m", color: GREEN },
            { icon: "🏋️", label: "Gym 300m", color: BLUE },
        ],
        grad: `linear-gradient(135deg, #78350F, #F59E0B)`,
        commuteMinutes: 22, sizeSqm: 32,
    },
    {
        id: 10, lat: 13.7511, lng: 100.6905,
        name: "Nivara Luxury Pool Villa", address: "Krungthep Kreetha",
        price: "฿65M", beds: 5, baths: 4, sqft: "520", score: 54,
        badge: "Fair Match 🤔", badgeColor: AMBER,
        insights: [
            { icon: "🏊", label: "Pool Villa", color: GREEN },
            { icon: "🌳", label: "Quiet 30dB", color: GREEN },
        ],
        risk: "Hospital 5.5km away",
        grad: `linear-gradient(135deg, #78350F, #F59E0B)`,
        commuteMinutes: 55, sizeSqm: 520,
    },
];

// ── Component ─────────────────────────────────────────────────────────────────
export function MapPanel({ selected, onSelect }: { selected: number; onSelect: (id: number) => void }) {
    const mapRef = useRef<Map | null>(null);
    const markersRef = useRef<Map<number, Marker>>(new globalThis.Map());
    const containerRef = useRef<HTMLDivElement>(null);
    const tileRef = useRef<TileLayer | null>(null);

    const prop = MOCK_PROPERTIES.find(p => p.id === selected) ?? MOCK_PROPERTIES[0]!;
    const apiKey = import.meta.env.VITE_MAP_OSM_API as string;

    // ── Init Leaflet map once ────────────────────────────────────────────────
    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;

        // Lazy-import Leaflet to avoid SSR issues
        import("leaflet").then(L => {
            if (!containerRef.current || mapRef.current) return;

            // Fix default icon paths
            delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            });

            const map = L.map(containerRef.current!, {
                center: [13.7400, 100.5900],
                zoom: 11,
                zoomControl: true,
                scrollWheelZoom: true,
            });

            mapRef.current = map;

            // Stadia Maps tile with API key (OSM-based)
            const tileUrl = apiKey
                ? `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${apiKey}`
                : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

            const attribution = apiKey
                ? '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

            tileRef.current = L.tileLayer(tileUrl, { attribution, maxZoom: 18 });
            tileRef.current.addTo(map);

            // Add markers for each property
            MOCK_PROPERTIES.forEach(p => {
                const color = p.score >= 85 ? "#10B981" : p.score >= 70 ? "#3B82F6" : "#F59E0B";

                const markerIcon = L.divIcon({
                    className: "",
                    html: `<div style="
                        background:${color};border:2.5px solid white;
                        border-radius:10px;padding:3px 8px;
                        font-size:12px;font-weight:900;color:white;
                        box-shadow:0 2px 10px ${color}88;
                        white-space:nowrap;cursor:pointer;
                        transition:transform 0.15s;
                    ">${p.score}%</div>`,
                    iconAnchor: [24, 14],
                });

                const marker = L.marker([p.lat, p.lng], { icon: markerIcon })
                    .addTo(map)
                    .on("click", () => onSelect(p.id));

                markersRef.current.set(p.id, marker);
            });
        });

        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
            markersRef.current.clear();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Pan map to selected property ─────────────────────────────────────────
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !prop) return;
        map.setView([prop.lat, prop.lng], 13, { animate: true });

        // Highlight selected marker
        import("leaflet").then(L => {
            markersRef.current.forEach((marker, id) => {
                const p = MOCK_PROPERTIES.find(x => x.id === id)!;
                const color = p.score >= 85 ? "#10B981" : p.score >= 70 ? "#3B82F6" : "#F59E0B";
                const isSelected = id === selected;
                const icon = L.divIcon({
                    className: "",
                    html: `<div style="
                        background:${color};
                        border:${isSelected ? "3px solid white" : "2px solid rgba(255,255,255,0.7)"};
                        border-radius:10px;padding:3px 8px;
                        font-size:${isSelected ? "13px" : "11px"};font-weight:900;color:white;
                        box-shadow:${isSelected ? `0 4px 18px ${color}99` : `0 2px 8px ${color}55`};
                        transform:${isSelected ? "scale(1.25)" : "scale(1)"};
                        white-space:nowrap;cursor:pointer;
                        transition:transform 0.15s;
                    ">${p.score}%</div>`,
                    iconAnchor: [24, 14],
                });
                marker.setIcon(icon);
            });
        });
    }, [selected, prop]);

    return (
        <div className="relative w-full h-full rounded-2xl overflow-hidden" style={{ minHeight: 400 }}>
            {/* Leaflet Map */}
            <div ref={containerRef} className="w-full h-full" style={{ minHeight: 400 }} />

            {/* Selected property detail card */}
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl p-4 z-[1000]"
                style={{ background: "rgba(255,255,255,0.94)", backdropFilter: "blur(16px)", boxShadow: "0 8px 32px rgba(0,0,0,0.14)" }}>
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-black" style={{ color: BLUE }}>{prop.name}</div>
                        <div className="text-xs mb-2" style={{ color: "#94A3B8" }}>
                            {prop.address} · {prop.commuteMinutes} min commute · {prop.sizeSqm} sq.m.
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {prop.insights.map(ins => <InsightChip key={ins.label} {...ins} />)}
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
        </div>
    );
}
