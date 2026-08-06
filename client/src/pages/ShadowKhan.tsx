/* ============================================================
 * Shadow'Khan TCG Page — Aura Farming Entertainment
 * Design: Aura Pulse — green aura theme, direct link to shadowkhantcg.com
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

export default function ShadowKhan() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePlay = () => {
    window.open("https://www.shadowkhantcg.com", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-[oklch(0.08_0.01_285)] text-white">

      {/* ── Hero ── */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/manus-storage/shadow-khan-banner_6926713d.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.08_0.01_285)] via-[oklch(0.08_0.01_285/0.5)] to-[oklch(0.08_0.01_285/0.2)]" />
        {/* Green aura radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 50% 60%, oklch(0.72 0.22 140 / 0.12) 0%, transparent 70%)",
          }}
        />
        <div className="container relative z-10 pb-16 pt-32">
          <motion.div initial="hidden" animate="visible">
            <motion.p
              custom={0}
              variants={fadeUp}
              className="text-xs font-bold tracking-[0.3em] text-[oklch(0.72_0.22_140)] mb-3 uppercase"
              style={{ fontFamily: "'Orbitron', monospace" }}
            >
              Trading Card Game
            </motion.p>
            <motion.h1
              custom={1}
              variants={fadeUp}
              className="text-6xl sm:text-7xl font-bold mb-4"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              Shadow<span style={{ color: "oklch(0.72 0.22 140)" }}>'Khan</span> TCG
            </motion.h1>
            <motion.p
              custom={2}
              variants={fadeUp}
              className="text-lg text-white/70 max-w-xl"
            >
              A two-player online card game. Drain your opponent's deck until they have nothing left to draw.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Game Info ── */}
      {/* Diagonal divider: hero → content */}
      <div
        className="h-16 pointer-events-none"
        style={{
          background: "oklch(0.08 0.01 285)",
          clipPath: "polygon(0 0, 100% 50%, 100% 100%, 0 100%)",
          marginTop: "-1px",
        }}
      />
      <section className="py-20 relative overflow-hidden">
        {/* Violet parent-brand aura anchor */}
        <div
          className="absolute top-0 right-0 w-96 h-96 pointer-events-none"
          style={{
            background: "radial-gradient(circle, oklch(0.55 0.28 290 / 0.06) 0%, transparent 70%)",
          }}
        />
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-start">

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <h2
                className="text-4xl font-bold text-white mb-6"
                style={{ fontFamily: "'Rajdhani', sans-serif" }}
              >
                Enter the Shadow Realm
              </h2>
              <p className="text-white/70 leading-relaxed mb-4">
                Shadow'Khan is a strategic two-player online card game where the goal is to
                completely drain your opponent's deck. Every card you play chips away at their
                resources — leaving them with nothing left to draw.
              </p>
              <p className="text-white/70 leading-relaxed mb-8">
                Master the shadows. Outmaneuver your opponent. Claim victory through superior
                strategy and relentless pressure. The Shadow Realm awaits those bold enough to enter.
              </p>

              {/* Feature list */}
              <div className="space-y-3 mb-10">
                {[
                  "Two-player online card battles",
                  "Strategic deck-drain gameplay",
                  "Create or join matches instantly",
                  "Free to play — no download required",
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-3">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: "oklch(0.72 0.22 140)", boxShadow: "0 0 8px oklch(0.72 0.22 140 / 0.8)" }}
                    />
                    <span className="text-white/80 text-sm">{feat}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={handlePlay}
                className="inline-flex items-center gap-3 px-8 py-4 rounded font-bold text-sm tracking-wider uppercase transition-all duration-200 active:scale-[0.97] hover:shadow-[0_0_40px_oklch(0.72_0.22_140/0.4)]"
                style={{
                  fontFamily: "'Orbitron', monospace",
                  background: "oklch(0.72 0.22 140)",
                  color: "oklch(0.08 0.01 285)",
                  boxShadow: "0 0 24px oklch(0.72 0.22 140 / 0.35)",
                }}
              >
                <span>Play Shadow'Khan Now</span>
                <span className="text-base">↗</span>
              </button>
              <p className="text-xs text-white/30 mt-3">Opens shadowkhantcg.com in a new tab</p>
            </motion.div>

            {/* Preview card */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
              className="relative"
            >
              <div
                className="rounded-xl overflow-hidden border border-[oklch(0.72_0.22_140/0.3)]"
                style={{ boxShadow: "0 0 60px oklch(0.72 0.22 140 / 0.15)" }}
              >
                <img
                  src="/manus-storage/shadow-khan-banner_6926713d.jpg"
                  alt="Shadow'Khan TCG gameplay"
                  className="w-full object-cover"
                />
              </div>
              {/* Floating badge */}
              <div
                className="absolute -bottom-4 -right-4 px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase"
                style={{
                  fontFamily: "'Orbitron', monospace",
                  background: "oklch(0.72 0.22 140)",
                  color: "oklch(0.08 0.01 285)",
                }}
              >
                Play Free
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Big CTA Banner ── */}
      {/* Diagonal divider */}
      <div
        className="h-16 pointer-events-none"
        style={{
          background: "oklch(0.08 0.01 285)",
          clipPath: "polygon(0 50%, 100% 0, 100% 100%, 0 100%)",
          marginTop: "-1px",
        }}
      />
      <section className="py-20 relative overflow-hidden" style={{ marginTop: "-1px" }}>
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 100% at 50% 50%, oklch(0.72 0.22 140 / 0.08) 0%, transparent 70%)",
          }}
        />
        <div className="absolute inset-0 border-y border-[oklch(0.72_0.22_140/0.15)]" />
        <div className="container relative z-10 text-center">
          <h2
            className="text-5xl sm:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            The Shadow Realm Awaits
          </h2>
          <p className="text-white/60 mb-8 max-w-md mx-auto">
            Your opponent's deck won't drain itself. Enter the Shadow Realm and claim your victory.
          </p>
          <button
            onClick={handlePlay}
            className="inline-flex items-center gap-3 px-10 py-4 rounded font-bold text-sm tracking-wider uppercase transition-all duration-200 active:scale-[0.97]"
            style={{
              fontFamily: "'Orbitron', monospace",
              background: "oklch(0.72 0.22 140)",
              color: "oklch(0.08 0.01 285)",
              boxShadow: "0 0 40px oklch(0.72 0.22 140 / 0.4)",
            }}
          >
            Claim Your Shadow ↗
          </button>
        </div>
      </section>

    </div>
  );
}
