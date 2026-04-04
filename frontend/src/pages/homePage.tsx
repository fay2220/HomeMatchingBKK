import { useLocation } from "wouter";
import { BLUE, GREEN } from "../components/variable";

export function HomePage() {
    const [, setLocation] = useLocation();

    return (
        <div
            className="flex flex-col items-center justify-center w-full min-h-screen relative overflow-hidden"
            style={{ fontFamily: "'Inter', 'Montserrat', sans-serif" }}
        >
            {/* Animated background */}
            <div className="absolute inset-0 -z-10" style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #064e3b 100%)"
            }} />

            {/* Ambient blobs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full -z-10 blur-3xl opacity-20"
                style={{ background: GREEN }} />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full -z-10 blur-3xl opacity-15"
                style={{ background: BLUE }} />

            {/* Grid overlay */}
            <div className="absolute inset-0 -z-10 opacity-5"
                style={{
                    backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                    backgroundSize: "60px 60px"
                }} />

            {/* Main content */}
            <div className="flex flex-col items-center text-center px-8 max-w-3xl">

                {/* Badge */}
                <div className="mb-8 px-4 py-2 rounded-full border text-xs font-bold tracking-widest uppercase"
                    style={{ borderColor: "rgba(16,185,129,0.4)", color: "#10B981", background: "rgba(16,185,129,0.08)" }}>
                    🏙️ Health-Driven Housing Platform · Bangkok
                </div>

                {/* Project name */}
                <h1 className="font-black mb-4 leading-none tracking-tight"
                    style={{
                        fontSize: "clamp(3rem, 8vw, 6rem)",
                        background: "linear-gradient(135deg, #ffffff 0%, #10B981 50%, #3B82F6 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}>
                    HomeMatching
                    <span style={{
                        background: `linear-gradient(135deg, ${GREEN}, #059669)`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}>BKK</span>
                </h1>

                {/* Tagline */}
                <p className="text-lg mb-4 font-medium" style={{ color: "rgba(255,255,255,0.65)", maxWidth: 480 }}>
                    Find your perfect home based on <span style={{ color: "#10B981" }}>health</span>,{" "}
                    <span style={{ color: "#3B82F6" }}>lifestyle</span>, and{" "}
                    <span style={{ color: "#F59E0B" }}>family</span> needs
                </p>

                <p className="text-sm mb-12" style={{ color: "rgba(255,255,255,0.35)" }}>
                    Powered by the LifeFit Score Engine™ · 10+ Properties in Bangkok
                </p>

                {/* CTA Button */}
                <button
                    onClick={() => setLocation("/quiz")}
                    className="group relative px-10 py-4 rounded-2xl font-black text-white text-lg cursor-pointer transition-all duration-300 hover:scale-105"
                    style={{
                        background: `linear-gradient(135deg, ${GREEN} 0%, #059669 100%)`,
                        boxShadow: `0 8px 40px rgba(16,185,129,0.45)`,
                    }}
                >
                    <span className="relative z-10 flex items-center gap-3">
                        Get Started
                        <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                </button>

                {/* Feature pills */}
                <div className="flex flex-wrap items-center justify-center gap-3 mt-12">
                    {[
                        { icon: "❤️", label: "Health Matching" },
                        { icon: "🐾", label: "Pet-Friendly" },
                        { icon: "👴", label: "Elderly Care" },
                        { icon: "🗺️", label: "Live Map View" },
                        { icon: "📊", label: "LifeFit Score™" },
                    ].map(item => (
                        <div key={item.label}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold"
                            style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>
                            {item.icon} {item.label}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
