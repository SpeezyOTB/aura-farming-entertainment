/* ============================================================
 * Dragon Fist X — Game Demo Page
 * Route: /dragon-fist-x/game
 * Design: Aura Pulse — full-screen iframe embed of the game
 * ============================================================ */
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function DragonFistXGame() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[oklch(0.05_0.01_285)] text-white flex flex-col">

      {/* ── Slim header bar ── */}
      <div
        className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 mt-16"
        style={{ background: "oklch(0.07 0.01 285)" }}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/dragon-fist-x"
            className="text-white/50 hover:text-white transition-colors duration-200 text-xs tracking-wider flex items-center gap-1"
            style={{ fontFamily: "'Orbitron', monospace" }}
          >
            ← Back
          </Link>
          <span className="text-white/20">|</span>
          <span
            className="text-xs font-bold tracking-widest uppercase"
            style={{ fontFamily: "'Orbitron', monospace", color: "oklch(0.7 0.22 25)" }}
          >
            Dragon Fist X — Demo
          </span>
        </div>
        <div
          className="flex items-center gap-2 text-xs text-white/40"
          style={{ fontFamily: "'Orbitron', monospace" }}
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: "oklch(0.7 0.22 25)" }}
          />
          LIVE DEMO
        </div>
      </div>

      {/* ── Game iframe ── */}
      <div className="flex-1 relative" style={{ minHeight: "calc(100vh - 120px)" }}>
        {/* Loading state */}
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10"
            style={{ background: "oklch(0.05 0.01 285)" }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 rounded-full border-2 border-transparent mb-4"
              style={{
                borderTopColor: "oklch(0.7 0.22 25)",
                borderRightColor: "oklch(0.55 0.28 290)",
              }}
            />
            <p
              className="text-xs tracking-widest uppercase text-white/50"
              style={{ fontFamily: "'Orbitron', monospace" }}
            >
              Loading Dragon Fist X...
            </p>
          </div>
        )}

        {/* Red aura glow behind iframe */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 40% at 50% 50%, oklch(0.55 0.22 25 / 0.06) 0%, transparent 70%)",
          }}
        />

        <iframe
          src="https://fightergame-j95rkwu8.manus.space"
          title="Dragon Fist X Game Demo"
          className="w-full h-full border-0 relative z-10"
          style={{ minHeight: "calc(100vh - 120px)" }}
          allow="gamepad; autoplay"
          onLoad={() => setLoaded(true)}
        />
      </div>

    </div>
  );
}
