import type { ChangeEvent } from "react";
import { GREEN, BLUE } from "../../variable";

interface Step4Props {
    budget: { min: number, max: number };
    setBudget: (val: { min: number, max: number }) => void;
    commute: number;
    setCommute: (val: number) => void;
    houseSize: { min: number, max: number };
    setHouseSize: (val: { min: number, max: number }) => void;
}

export function Step4({ budget, setBudget, commute, setCommute, houseSize, setHouseSize }: Step4Props) {
    const MIN_BUDGET = 100000;
    const MAX_BUDGET = 100000000;

    const handleMinChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = Math.min(Number(e.target.value), budget.max - 100000);
        setBudget({ ...budget, min: val });
    };

    const handleMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = Math.max(Number(e.target.value), budget.min + 100000);
        setBudget({ ...budget, max: val });
    };

    const formatB = (n: number) => n >= 1000000 ? `${(n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1)}M` : `${(n / 1000).toFixed(0)}k`;

    const getPercent = (value: number) => Math.round(((value - MIN_BUDGET) / (MAX_BUDGET - MIN_BUDGET)) * 100);

    const MIN_SIZE = 24;
    const MAX_SIZE = 240;

    const handleMinSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = Math.min(Number(e.target.value), houseSize.max - 5);
        setHouseSize({ ...houseSize, min: val });
    };

    const handleMaxSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = Math.max(Number(e.target.value), houseSize.min + 5);
        setHouseSize({ ...houseSize, max: val });
    };

    const getSizePercent = (value: number) => Math.round(((value - MIN_SIZE) / (MAX_SIZE - MIN_SIZE)) * 100);

    return (
        <div className="max-w-xl">
            <h2 className="text-xl font-black mb-8" style={{ color: BLUE }}>Budget & Location</h2>

            {/* Budget */}
            <div className="mb-12">
                <div className="flex justify-between items-end mb-5">
                    <div>
                        <div className="text-sm font-bold" style={{ color: "#1F2937" }}>Property Budget (THB)</div>
                        <div className="text-xs" style={{ color: "#64748B" }}>Select your comfortable price range</div>
                    </div>
                    <div className="text-lg font-black" style={{ color: GREEN }}>
                        ฿{formatB(budget.min)} - ฿{formatB(budget.max)}
                    </div>
                </div>

                <div className="relative h-6 flex items-center mb-2">
                    <div className="absolute w-full h-2 rounded-full" style={{ background: "#E2E8F0" }} />
                    <div className="absolute h-2 rounded-full" style={{
                        background: GREEN,
                        left: `${getPercent(budget.min)}%`,
                        width: `${getPercent(budget.max) - getPercent(budget.min)}%`
                    }} />

                    <input
                        type="range"
                        min={MIN_BUDGET}
                        max={MAX_BUDGET}
                        step="100000"
                        value={budget.min}
                        onChange={handleMinChange}
                        className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#10B981] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
                        style={{ zIndex: budget.min > MAX_BUDGET - 500000 ? 5 : 3 }}
                    />
                    <input
                        type="range"
                        min={MIN_BUDGET}
                        max={MAX_BUDGET}
                        step="100000"
                        value={budget.max}
                        onChange={handleMaxChange}
                        className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#10B981] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
                        style={{ zIndex: 4 }}
                    />
                </div>
                <div className="flex justify-between text-[10px] font-bold" style={{ color: "#94A3B8" }}>
                    <span>฿100k</span>
                    <span>฿100M</span>
                </div>
            </div>

            {/* House Size */}
            <div className="mb-12">
                <div className="flex justify-between items-end mb-5">
                    <div>
                        <div className="text-sm font-bold" style={{ color: "#1F2937" }}>House Size (sq.m.)</div>
                        <div className="text-xs" style={{ color: "#64748B" }}>Select preferred living space size</div>
                    </div>
                    <div className="text-lg font-black" style={{ color: GREEN }}>
                        {houseSize.min} - {houseSize.max} sq.m.
                    </div>
                </div>

                <div className="relative h-6 flex items-center mb-2">
                    <div className="absolute w-full h-2 rounded-full" style={{ background: "#E2E8F0" }} />
                    <div className="absolute h-2 rounded-full" style={{
                        background: GREEN,
                        left: `${getSizePercent(houseSize.min)}%`,
                        width: `${getSizePercent(houseSize.max) - getSizePercent(houseSize.min)}%`
                    }} />

                    <input
                        type="range"
                        min={MIN_SIZE}
                        max={MAX_SIZE}
                        step="1"
                        value={houseSize.min}
                        onChange={handleMinSizeChange}
                        className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#10B981] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
                        style={{ zIndex: houseSize.min > MAX_SIZE - 20 ? 5 : 3 }}
                    />
                    <input
                        type="range"
                        min={MIN_SIZE}
                        max={MAX_SIZE}
                        step="1"
                        value={houseSize.max}
                        onChange={handleMaxSizeChange}
                        className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#10B981] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
                        style={{ zIndex: 4 }}
                    />
                </div>
                <div className="flex justify-between text-[10px] font-bold" style={{ color: "#94A3B8" }}>
                    <span>24 sq.m.</span>
                    <span>240 sq.m.</span>
                </div>
            </div>

            {/* Commute */}
            <div>
                <div className="flex justify-between items-end mb-5">
                    <div>
                        <div className="text-sm font-bold" style={{ color: "#1F2937" }}>Max Commute Time</div>
                        <div className="text-xs" style={{ color: "#64748B" }}>Minutes to work or frequent places</div>
                    </div>
                    <div className="text-lg font-black" style={{ color: BLUE }}>
                        {commute} mins
                    </div>
                </div>

                <div className="relative h-6 flex items-center mb-2">
                    <div className="absolute w-full h-2 rounded-full" style={{ background: "#E2E8F0" }} />
                    <div className="absolute h-2 rounded-full" style={{
                        background: BLUE,
                        left: 0,
                        width: `${((commute - 10) / 110) * 100}%`
                    }} />

                    <input
                        type="range"
                        min={10}
                        max={120}
                        step="5"
                        value={commute}
                        onChange={(e) => setCommute(Number(e.target.value))}
                        className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#1E3A8A] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
                    />
                </div>
                <div className="flex justify-between text-[10px] font-bold" style={{ color: "#94A3B8" }}>
                    <span>10m</span>
                    <span>60m</span>
                    <span>120m</span>
                </div>
            </div>
        </div>
    );
}
