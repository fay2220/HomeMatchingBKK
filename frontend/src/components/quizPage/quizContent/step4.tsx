import type { ChangeEvent } from "react";
import { GREEN, BLUE } from "../../variable";

interface Step4Props {
    budget: { min: number, max: number };
    setBudget: (val: { min: number, max: number }) => void;
    commute: number;
    setCommute: (val: number) => void;
    houseSize: { min: number, max: number };
    setHouseSize: (val: { min: number, max: number }) => void;
    workplace: string;
    setWorkplace: (v: string) => void;
}

// ── Input style helper ─────────────────────────────────────────────────────────
const numInputClass = "w-28 px-2 py-1.5 rounded-xl text-sm font-bold text-center focus:outline-none transition-all";
const numInputStyle = (active: boolean) => ({
    border: `2px solid ${active ? "#10B981" : "#E2E8F0"}`,
    color: "#1F2937",
    background: "white",
});

const BANGKOK_PLACES = [
    "สีลม / สาทร", "สุขุมวิท", "อโศก", "พระราม 9", "รัชดา", "ลาดพร้าว", "บางนา",
    "ดอนเมือง", "หมอชิต", "มักกะสัน", "อนุสาวรีย์ชัย", "วิภาวดี", "พระราม 2",
    "บางแค", "บางบอน", "เพชรเกษม", "จรัญฯ", "พระราม 4", "เจริญกรุง",
    "ธนบุรี", "บางกอกน้อย", "นนทบุรี", "ปทุมธานี", "สมุทรปราการ",
].sort();

export function Step4({ budget, setBudget, commute, setCommute, houseSize, setHouseSize, workplace, setWorkplace }: Step4Props) {
    const MIN_BUDGET = 500000;
    const SLIDER_MAX_BUDGET = 50000000;   // slider cap: 50M
    const ABS_MAX_BUDGET   = 200000000;  // input cap: 200M

    const handleMinSlider = (e: ChangeEvent<HTMLInputElement>) => {
        const val = Math.min(Number(e.target.value), budget.max - 500000);
        setBudget({ ...budget, min: val });
    };
    const handleMaxSlider = (e: ChangeEvent<HTMLInputElement>) => {
        const val = Math.max(Number(e.target.value), budget.min + 500000);
        setBudget({ ...budget, max: val });
    };
    const handleMinInput = (e: ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value.replace(/,/g, ""));
        if (!isNaN(val) && val >= MIN_BUDGET && val < budget.max) setBudget({ ...budget, min: val });
    };
    const handleMaxInput = (e: ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value.replace(/,/g, ""));
        if (!isNaN(val) && val <= ABS_MAX_BUDGET && val > budget.min) setBudget({ ...budget, max: val });
    };

    const formatB = (n: number) => n >= 1000000
        ? `${(n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1)}M`
        : `${(n / 1000).toFixed(0)}k`;

    const getPercent = (value: number) =>
        Math.round(((value - MIN_BUDGET) / (SLIDER_MAX_BUDGET - MIN_BUDGET)) * 100);

    const sliderMin = Math.min(budget.min, SLIDER_MAX_BUDGET);
    const sliderMax = Math.min(budget.max, SLIDER_MAX_BUDGET);

    const MIN_SIZE = 24;
    const MAX_SIZE = 500;

    const handleMinSizeSlider = (e: ChangeEvent<HTMLInputElement>) => {
        const val = Math.min(Number(e.target.value), houseSize.max - 5);
        setHouseSize({ ...houseSize, min: val });
    };
    const handleMaxSizeSlider = (e: ChangeEvent<HTMLInputElement>) => {
        const val = Math.max(Number(e.target.value), houseSize.min + 5);
        setHouseSize({ ...houseSize, max: val });
    };
    const handleMinSizeInput = (e: ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        if (!isNaN(val) && val >= MIN_SIZE && val < houseSize.max) setHouseSize({ ...houseSize, min: val });
    };
    const handleMaxSizeInput = (e: ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        if (!isNaN(val) && val <= MAX_SIZE && val > houseSize.min) setHouseSize({ ...houseSize, max: val });
    };

    const getSizePercent = (value: number) =>
        Math.round(((value - MIN_SIZE) / (MAX_SIZE - MIN_SIZE)) * 100);

    return (
        <div className="max-w-xl">
            <h2 className="text-xl font-black mb-8" style={{ color: BLUE }}>Budget & Location</h2>

            {/* ── Budget ──────────────────────────────────────────────────────── */}
            <div className="mb-12">
                <div className="text-sm font-bold mb-1" style={{ color: "#1F2937" }}>Property Budget (THB)</div>
                <div className="text-xs mb-4" style={{ color: "#64748B" }}>เลื่อนแถบหรือพิมพ์ตัวเลขโดยตรง</div>

                {/* Number inputs */}
                <div className="flex items-center gap-3 mb-5">
                    <div className="flex flex-col items-center gap-1">
                        <label className="text-[10px] font-semibold" style={{ color: "#94A3B8" }}>ขั้นต่ำ</label>
                        <input
                            type="number"
                            value={budget.min}
                            min={MIN_BUDGET}
                            max={budget.max - 500000}
                            step={100000}
                            onChange={handleMinInput}
                            className={numInputClass}
                            style={numInputStyle(true)}
                        />
                    </div>
                    <div className="flex-1 text-center text-xs font-black" style={{ color: GREEN }}>
                        ฿{formatB(budget.min)} — ฿{formatB(budget.max)}
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <label className="text-[10px] font-semibold" style={{ color: "#94A3B8" }}>สูงสุด</label>
                        <input
                            type="number"
                            value={budget.max}
                            min={budget.min + 500000}
                            max={ABS_MAX_BUDGET}
                            step={100000}
                            onChange={handleMaxInput}
                            className={numInputClass}
                            style={numInputStyle(true)}
                        />
                    </div>
                </div>

                {/* Dual slider — capped at 50M, input can go beyond */}
                <div className="relative h-6 flex items-center mb-2">
                    <div className="absolute w-full h-2 rounded-full" style={{ background: "#E2E8F0" }} />
                    <div className="absolute h-2 rounded-full" style={{
                        background: GREEN,
                        left: `${getPercent(sliderMin)}%`,
                        width: `${getPercent(sliderMax) - getPercent(sliderMin)}%`
                    }} />
                    <input type="range" min={MIN_BUDGET} max={SLIDER_MAX_BUDGET} step="500000" value={sliderMin}
                        onChange={handleMinSlider}
                        className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#10B981] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
                        style={{ zIndex: sliderMin > SLIDER_MAX_BUDGET - 1000000 ? 5 : 3 }}
                    />
                    <input type="range" min={MIN_BUDGET} max={SLIDER_MAX_BUDGET} step="500000" value={sliderMax}
                        onChange={handleMaxSlider}
                        className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#10B981] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
                        style={{ zIndex: 4 }}
                    />
                </div>
                <div className="flex justify-between text-[10px] font-bold" style={{ color: "#94A3B8" }}>
                    <span>฿500k</span>
                    <span className="text-[10px]" style={{ color: budget.max > SLIDER_MAX_BUDGET ? GREEN : "#94A3B8" }}>
                        {budget.max > SLIDER_MAX_BUDGET ? `📝 กำหนดเอง ฿${formatB(budget.max)}` : "฿50M"}
                    </span>
                </div>
            </div>

            {/* ── House Size ──────────────────────────────────────────────────── */}
            <div className="mb-12">
                <div className="text-sm font-bold mb-1" style={{ color: "#1F2937" }}>House Size (sq.m.)</div>
                <div className="text-xs mb-4" style={{ color: "#64748B" }}>เลื่อนแถบหรือพิมพ์ตัวเลขโดยตรง (24–500 ตร.ม.)</div>

                {/* Number inputs */}
                <div className="flex items-center gap-3 mb-5">
                    <div className="flex flex-col items-center gap-1">
                        <label className="text-[10px] font-semibold" style={{ color: "#94A3B8" }}>ขนาดต่ำสุด</label>
                        <input
                            type="number"
                            value={houseSize.min}
                            min={MIN_SIZE}
                            max={houseSize.max - 5}
                            step={1}
                            onChange={handleMinSizeInput}
                            className={numInputClass}
                            style={numInputStyle(true)}
                        />
                    </div>
                    <div className="flex-1 text-center text-xs font-black" style={{ color: GREEN }}>
                        {houseSize.min} — {houseSize.max} sq.m.
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <label className="text-[10px] font-semibold" style={{ color: "#94A3B8" }}>ขนาดสูงสุด</label>
                        <input
                            type="number"
                            value={houseSize.max}
                            min={houseSize.min + 5}
                            max={MAX_SIZE}
                            step={1}
                            onChange={handleMaxSizeInput}
                            className={numInputClass}
                            style={numInputStyle(true)}
                        />
                    </div>
                </div>

                {/* Dual slider */}
                <div className="relative h-6 flex items-center mb-2">
                    <div className="absolute w-full h-2 rounded-full" style={{ background: "#E2E8F0" }} />
                    <div className="absolute h-2 rounded-full" style={{
                        background: GREEN,
                        left: `${getSizePercent(houseSize.min)}%`,
                        width: `${getSizePercent(houseSize.max) - getSizePercent(houseSize.min)}%`
                    }} />
                    <input type="range" min={MIN_SIZE} max={MAX_SIZE} step="1" value={houseSize.min}
                        onChange={handleMinSizeSlider}
                        className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#10B981] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
                        style={{ zIndex: houseSize.min > MAX_SIZE - 20 ? 5 : 3 }}
                    />
                    <input type="range" min={MIN_SIZE} max={MAX_SIZE} step="1" value={houseSize.max}
                        onChange={handleMaxSizeSlider}
                        className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#10B981] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
                        style={{ zIndex: 4 }}
                    />
                </div>
                <div className="flex justify-between text-[10px] font-bold" style={{ color: "#94A3B8" }}>
                    <span>24 sq.m.</span><span>500 sq.m.</span>
                </div>
            </div>

            {/* ── Workplace / Destination ──────────────────────────────────────── */}
            <div className="mb-12">
                <div className="text-sm font-bold mb-1" style={{ color: "#1F2937" }}>ปกติเดินทางไปทำงาน / เรียนที่ไหน?</div>
                <div className="text-xs mb-3" style={{ color: "#64748B" }}>เลือกย่านหรือสถานที่หลักที่ต้องเดินทางบ่อย</div>
                <div className="relative">
                    <select
                        value={workplace}
                        onChange={e => setWorkplace(e.target.value)}
                        className="w-full appearance-none px-4 py-3 pr-10 rounded-2xl text-sm font-semibold focus:outline-none cursor-pointer transition-all"
                        style={{
                            background: "white",
                            border: workplace ? `2px solid ${BLUE}` : "2px solid #E2E8F0",
                            color: workplace ? "#1F2937" : "#94A3B8",
                            boxShadow: workplace ? "0 2px 12px rgba(59,130,246,0.15)" : "none",
                        }}
                    >
                        <option value="">— ไม่แน่ใจ / ยังไม่กำหนด —</option>
                        {BANGKOK_PLACES.map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "#94A3B8" }}>▼</div>
                </div>
                {workplace && (
                    <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded-full font-semibold" style={{ background: "rgba(59,130,246,0.1)", color: "#1D4ED8" }}>
                            💼 {workplace}
                        </span>
                        <button onClick={() => setWorkplace("")} className="text-xs cursor-pointer" style={{ color: "#94A3B8" }}>✕ ล้าง</button>
                    </div>
                )}
                <div className="mt-3 text-[11px] rounded-xl p-2.5" style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.12)", color: "#64748B" }}>
                    ℹ️ ระบบจะคำนวณเวลาเดินทางโดยประมาณจากที่พักไปยังย่านที่เลือก และนำมาคิดคะแนน Commute ใน LifeFit Score
                </div>
            </div>

            {/* ── Commute ─────────────────────────────────────────────────────── */}
            <div>
                <div className="flex justify-between items-end mb-5">
                    <div>
                        <div className="text-sm font-bold" style={{ color: "#1F2937" }}>Max Commute Time</div>
                        <div className="text-xs" style={{ color: "#64748B" }}>เวลาเดินทางสูงสุดที่รับได้ (นาที)</div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            value={commute}
                            min={10}
                            max={120}
                            step={5}
                            onChange={e => setCommute(Math.max(10, Math.min(120, Number(e.target.value))))}
                            className={numInputClass}
                            style={{ ...numInputStyle(false), width: 72, border: `2px solid ${BLUE}` }}
                        />
                        <span className="text-sm font-bold" style={{ color: BLUE }}>mins</span>
                    </div>
                </div>

                <div className="relative h-6 flex items-center mb-2">
                    <div className="absolute w-full h-2 rounded-full" style={{ background: "#E2E8F0" }} />
                    <div className="absolute h-2 rounded-full" style={{
                        background: BLUE, left: 0,
                        width: `${((commute - 10) / 110) * 100}%`
                    }} />
                    <input type="range" min={10} max={120} step="5" value={commute}
                        onChange={(e) => setCommute(Number(e.target.value))}
                        className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#1E3A8A] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
                    />
                </div>
                <div className="flex justify-between text-[10px] font-bold" style={{ color: "#94A3B8" }}>
                    <span>10m</span><span>60m</span><span>120m</span>
                </div>
            </div>
        </div>
    );
}
