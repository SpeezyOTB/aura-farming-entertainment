/* ============================================================
 * Dragon Fist X Page — Aura Farming Entertainment
 * Design: Aura Pulse — red/crimson dragon energy theme
 * ============================================================ */
import { useEffect } from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function DragonFistX() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[oklch(0.08_0.01_285)] text-white">

      {/* ── Hero ── */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/manus-storage/dragon-fist-x-banner_a4ca3ea0.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.08_0.01_285)] via-[oklch(0.08_0.01_285/0.5)] to-[oklch(0.08_0.01_285/0.2)]" />
        {/* Red aura radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 50% 60%, oklch(0.55 0.22 25 / 0.15) 0%, transparent 70%)",
          }}
        />
        <div className="container relative z-10 pb-16 pt-32">
          <motion.div initial="hidden" animate="visible">
            <motion.p
              custom={0}
              variants={fadeUp}
              className="text-xs font-bold tracking-[0.3em] text-[oklch(0.55_0.22_25)] mb-3 uppercase"
              style={{ fontFamily: "'Orbitron', monospace" }}
            >
              Anime / Video Game — In Development
            </motion.p>
            <motion.h1
              custom={1}
              variants={fadeUp}
              className="text-6xl sm:text-7xl font-bold mb-4"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              Dragon <span style={{ color: "oklch(0.7 0.22 25)" }}>Fist X</span>
            </motion.h1>
            <motion.p
              custom={2}
              variants={fadeUp}
              className="text-lg text-white/70 max-w-xl"
            >
              An anime-inspired fighting game where warriors channel the power of dragons to become legends.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── About the Game ── */}
      {/* Diagonal divider: hero → content */}
      <div
        className="h-16 pointer-events-none"
        style={{
          background: "oklch(0.08 0.01 285)",
          clipPath: "polygon(0 50%, 100% 0, 100% 100%, 0 100%)",
          marginTop: "-1px",
        }}
      />
      <section className="py-20 relative overflow-hidden">
        {/* Violet parent-brand aura anchor */}
        <div
          className="absolute top-0 left-0 w-96 h-96 pointer-events-none"
          style={{
            background: "radial-gradient(circle, oklch(0.55 0.28 290 / 0.06) 0%, transparent 70%)",
          }}
        />
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-start">

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative"
            >
              <div
                className="rounded-xl overflow-hidden border border-[oklch(0.55_0.22_25/0.3)]"
                style={{ boxShadow: "0 0 60px oklch(0.55 0.22 25 / 0.15)" }}
              >
                <img
                  src="/manus-storage/dragon-fist-x-banner_a4ca3ea0.jpg"
                  alt="Dragon Fist X"
                  className="w-full object-cover"
                />
              </div>
              {/* Status badge */}
              <div
                className="absolute -bottom-4 -left-4 px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase flex items-center gap-2"
                style={{
                  fontFamily: "'Orbitron', monospace",
                  background: "oklch(0.12 0.015 285)",
                  border: "1px solid oklch(0.55 0.22 25 / 0.5)",
                  color: "oklch(0.7 0.22 25)",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: "oklch(0.7 0.22 25)" }}
                />
                In Development
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            >
              <h2
                className="text-4xl font-bold text-white mb-6"
                style={{ fontFamily: "'Rajdhani', sans-serif" }}
              >
                Harness the Dragon Within
              </h2>
              <p className="text-white/70 leading-relaxed mb-4">
                Dragon Fist X is an anime-inspired action fighting game currently in development
                at Aura Farming Entertainment. Players take on the role of warriors who channel
                the ancient power of dragons through their aura.
              </p>
              <p className="text-white/70 leading-relaxed mb-8">
                Combining the visual storytelling of anime with deep fighting game mechanics,
                Dragon Fist X aims to deliver an experience that feels both cinematic and
                intensely competitive. Every fighter has a unique dragon aura — master yours
                to dominate the battlefield.
              </p>

              {/* Feature list */}
              <div className="space-y-3 mb-10">
                {[
                  "Anime-inspired art style and storytelling",
                  "Unique dragon aura system per fighter",
                  "Deep fighting game mechanics",
                  "Rich lore and world-building",
                  "Currently in active development",
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-3">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: "oklch(0.7 0.22 25)", boxShadow: "0 0 8px oklch(0.7 0.22 25 / 0.8)" }}
                    />
                    <span className="text-white/80 text-sm">{feat}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Coming Soon Banner ── */}
      {/* Diagonal divider */}
      <div
        className="h-16 pointer-events-none"
        style={{
          background: "oklch(0.08 0.01 285)",
          clipPath: "polygon(0 0, 100% 50%, 100% 100%, 0 100%)",
          marginTop: "-1px",
        }}
      />
      <section className="py-20 relative overflow-hidden" style={{ marginTop: "-1px" }}>
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 100% at 50% 50%, oklch(0.55 0.22 25 / 0.08) 0%, transparent 70%)",
          }}
        />
        <div className="absolute inset-0 border-y border-[oklch(0.55_0.22_25/0.15)]" />
        <div className="container relative z-10 text-center">
          <p
            className="text-xs font-bold tracking-[0.3em] text-[oklch(0.55_0.28_290)] mb-4 uppercase"
            style={{ fontFamily: "'Orbitron', monospace" }}
          >
            Awakening Soon
          </p>
          <h2
            className="text-5xl sm:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            The Dragon Awakens
          </h2>
          <p className="text-white/60 mb-8 max-w-md mx-auto">
            The dragon energy is building. Your aura is calling. Stay locked in for trailers, early access, and the awakening.
          </p>
          <div
            className="inline-flex items-center gap-3 px-8 py-3 rounded border text-sm font-semibold tracking-wider uppercase"
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
      </section>

    </div>
  );
}
