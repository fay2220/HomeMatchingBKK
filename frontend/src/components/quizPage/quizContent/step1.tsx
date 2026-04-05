import { SelectCard } from "../selectCard";
import { BLUE } from "../../variable";

const BANGKOK_DISTRICTS = [
    "พระนคร", "ดุสิต", "หนองจอก", "บางรัก", "บางเขน", "ลาดกระบัง",
    "ยานนาวา", "สัมพันธวงศ์", "พระโขนง", "มีนบุรี", "ลาดพร้าว",
    "วังทองหลาง", "คลองสาน", "ตลิ่งชัน", "บางกอกน้อย", "บางกอกใหญ่",
    "ห้วยขวาง", "คลองเตย", "สวนหลวง", "จอมทอง", "ดอนเมือง",
    "ราษฎร์บูรณะ", "หลักสี่", "ลาดกระบัง", "บึงกุ่ม", "สาทร",
    "บางซื่อ", "จตุจักร", "บางเขน", "ดินแดง", "บึงกุ่ม", "ปทุมวัน",
    "ป้อมปราบฯ", "พระโขนง", "มีนบุรี", "ลาดกระบัง", "ยานนาวา",
    "สัมพันธวงศ์", "พระนคร", "ธนบุรี", "บางกอกใหญ่", "หลักสี่",
    "ลาดพร้าว", "วังทองหลาง", "คลองสาน", "ตลิ่งชัน",
    "บางพลัด", "ราชเทวี", "ประเวศ", "คลองเตย", "สวนหลวง",
    "บางนา", "ทวีวัฒนา", "ทุ่งครุ", "บางบอน",
    "วัฒนา", "คันนายาว", "สาทร", "บางรัก",
].filter((v, i, a) => a.indexOf(v) === i).sort(); // deduplicate + sort

interface Step1Props {
    peopleCount: number;
    setPeopleCount: (v: number) => void;
    family: string[];
    toggle: (v: string) => void;
    location: string;
    setLocation: (v: string) => void;
}

export function Step1({ peopleCount, setPeopleCount, family, toggle, location, setLocation }: Step1Props) {
    return (
        <>
            <p className="text-sm mb-6" style={{ color: "#64748B" }}>
                Select all household members. We'll tailor health-compatible neighborhoods for everyone living with you.
            </p>

            {/* Number of People */}
            <div className="mb-8">
                <div className="text-sm font-bold mb-2" style={{ color: "#1F2937" }}>Number of People Living</div>
                <div className="flex items-center gap-4">
                    <button onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))} className="w-10 h-10 rounded-full border-2 border-slate-200 flex flex-col justify-center items-center text-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors">-</button>
                    <div className="text-lg font-black w-8 text-center">{peopleCount}</div>
                    <button onClick={() => setPeopleCount(peopleCount + 1)} className="w-10 h-10 rounded-full border-2 border-slate-200 flex flex-col justify-center items-center text-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors">+</button>
                </div>
            </div>

            {/* Preferred Location */}
            <div className="mb-8">
                <div className="text-sm font-bold mb-1" style={{ color: "#1F2937" }}>Preferred Location in Bangkok</div>
                <div className="text-xs mb-3" style={{ color: "#64748B" }}>เลือกเขตที่ต้องการอยู่อาศัย (ไม่บังคับ)</div>
                <div className="relative">
                    <select
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        className="w-full appearance-none px-4 py-3 pr-10 rounded-2xl text-sm font-semibold focus:outline-none cursor-pointer transition-all"
                        style={{
                            background: "white",
                            border: location ? `2px solid #10B981` : "2px solid #E2E8F0",
                            color: location ? "#1F2937" : "#94A3B8",
                            boxShadow: location ? "0 2px 12px rgba(16,185,129,0.15)" : "none",
                        }}
                    >
                        <option value="">— ไม่ระบุเขต / Any district —</option>
                        {BANGKOK_DISTRICTS.map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                    {/* Arrow icon */}
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "#94A3B8" }}>▼</div>
                </div>
                {location && (
                    <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded-full font-semibold" style={{ background: "rgba(16,185,129,0.1)", color: "#059669" }}>
                            📍 เขต{location}
                        </span>
                        <button onClick={() => setLocation("")} className="text-xs cursor-pointer" style={{ color: "#94A3B8" }}>✕ ล้าง</button>
                    </div>
                )}
            </div>

            {/* Family members */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { icon: "👶", label: "Infant (0–2)" },
                    { icon: "🧒", label: "Young Child (3–12)" },
                    { icon: "🧑‍🎓", label: "Teen (13–17)" },
                    { icon: "🧑", label: "Adult (18–64)" },
                    { icon: "👴", label: "Elderly (65+)" },
                    { icon: "🧓", label: "Senior (75+)" },
                    { icon: "🤰", label: "Expecting" },
                    { icon: "🧑‍🦽", label: "Mobility Needs" },
                ].map(item => (
                    <SelectCard key={item.label} {...item}
                        selected={family.includes(item.label)}
                        onClick={() => toggle(item.label)} />
                ))}
            </div>

            {/* Location context note */}
            {location && (
                <div className="mt-6 p-3 rounded-xl text-xs" style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)", color: "#1E3A8A" }}>
                    <span style={{ color: BLUE }}>ℹ️</span>{" "}
                    ระบบจะกรองที่พักในเขต<strong>{location}</strong>และพื้นที่ใกล้เคียงก่อนเป็นลำดับแรก
                </div>
            )}
        </>
    );
}
