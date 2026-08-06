/* ============================================================
 * Dragon Fist X Page — Aura Farming Entertainment
 * Design: Aura Pulse — full-screen teaser video experience
 * ============================================================ */
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function DragonFistX() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[oklch(0.08_0.01_285)] text-white flex flex-col">

      {/* ── Full-screen video section ── */}
      <section className="flex-1 flex flex-col items-center justify-center pt-20 pb-12 px-4 relative overflow-hidden">
        {/* Red aura radial glow background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 50%, oklch(0.55 0.22 25 / 0.1) 0%, transparent 70%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 w-full max-w-4xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <p
              className="text-xs font-bold tracking-[0.3em] text-[oklch(0.7_0.22_25)] mb-3 uppercase"
              style={{ fontFamily: "'Orbitron', monospace" }}
            >
              Anime / Video Game — In Development
            </p>
            <h1
              className="text-6xl sm:text-7xl font-bold mb-3"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              Dragon <span style={{ color: "oklch(0.7 0.22 25)", textShadow: "0 0 30px oklch(0.55 0.22 25 / 0.6)" }}>Fist X</span>
            </h1>
            <p className="text-white/60 text-lg">Official Teaser</p>
          </div>

          {/* Video player */}
          <div
            className="relative rounded-xl overflow-hidden border border-[oklch(0.55_0.22_25/0.4)]"
            style={{
              boxShadow: "0 0 80px oklch(0.55 0.22 25 / 0.25), 0 0 160px oklch(0.55 0.22 25 / 0.1)",
            }}
          >
            <video
              src="/manus-storage/dfx-teaser_e24a3f48.mp4"
              controls
              autoPlay
              muted
              loop
              playsInline
              className="w-full"
              style={{ display: "block" }}
            />
          </div>

          {/* Footer note */}
          <div className="text-center mt-6">
            <div
              className="inline-flex items-center gap-3 px-6 py-2.5 rounded border text-xs font-semibold tracking-wider uppercase"
              style={{
                fontFamily: "'Orbitron', monospace",
                borderColor: "oklch(0.55 0.22 25 / 0.4)",
                color: "oklch(0.7 0.22 25)",
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "oklch(0.7 0.22 25)" }}
              />
              Development in Progress
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
