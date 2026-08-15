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

const LOGO = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663841309695/TaJmNUcewyfbFuHC.png";
const DFX_BANNER = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663841309695/EPvhyfNHwWIWXtli.jpg";
const DFX_VIDEO = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663841309695/QHLLIIbCPXyLoWHt.mp4";

export default function DragonFistX() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-[oklch(0.08_0.01_285)] text-white">

      {/* ── Hero ── */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${DFX_BANNER}')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.08_0.01_285)] via-[oklch(0.08_0.01_285/0.55)] to-[oklch(0.08_0.01_285/0.15)]" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 60%, oklch(0.55 0.22 25 / 0.15) 0%, transparent 70%)" }} />
        <div className="container relative z-10 pb-16 pt-32">
          <motion.div initial="hidden" animate="visible">
            {/* Logo above title */}
            <motion.div custom={0} variants={fadeUp} className="mb-5">
              <img src={LOGO} alt="Aura Farming Entertainment" className="h-16 w-auto object-contain" />
            </motion.div>
            <motion.p custom={1} variants={fadeUp} className="text-xs font-bold tracking-[0.3em] text-[oklch(0.7_0.22_25)] mb-3 uppercase" style={{ fontFamily: "'Orbitron', monospace" }}>
              Anime / Video Game · In Development · Aura Farming Entertainment
            </motion.p>
            <motion.h1 custom={2} variants={fadeUp} className="text-6xl sm:text-7xl font-bold mb-4" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              Dragon <span style={{ color: "oklch(0.7 0.22 25)", textShadow: "0 0 30px oklch(0.55 0.22 25 / 0.6)" }}>Fist X</span>
            </motion.h1>
            <motion.p custom={3} variants={fadeUp} className="text-lg text-white/70 max-w-xl">
              A coming-of-age action saga spanning anime and video game — where a boy fused with an ancient dragon must save a world still healing from catastrophe.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Story & Lore ── */}
      <div className="h-16 pointer-events-none" style={{ background: "oklch(0.08 0.01 285)", clipPath: "polygon(0 0, 100% 50%, 100% 100%, 0 100%)", marginTop: "-1px" }} />
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 pointer-events-none" style={{ background: "radial-gradient(circle, oklch(0.55 0.22 25 / 0.06) 0%, transparent 70%)" }} />
        <div className="container">

          {/* Story Synopsis */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-16">
            <p className="text-xs font-bold tracking-[0.3em] text-[oklch(0.7_0.22_25)] mb-3 uppercase" style={{ fontFamily: "'Orbitron', monospace" }}>The Story</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              One Boy. One Dragon. <span style={{ color: "oklch(0.7 0.22 25)" }}>One Destiny.</span>
            </h2>
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-5 text-white/75 leading-relaxed text-[15px]">
                <p>
                  In the year 2767, the world is still rebuilding from a catastrophe that nearly ended human civilization seven centuries ago. Cities survive beneath massive bio-domes. The Outskirts remain wild and unforgiving. And somewhere in this fractured world, an ordinary boy named <strong className="text-white">Ryu</strong> is about to have his life changed forever.
                </p>
                <p>
                  Through circumstances beyond his control, Ryu becomes <strong className="text-white">fused with the spirit of an ancient magical dragon</strong> — a being of immense power that has slept for centuries, waiting for the right vessel. The fusion is involuntary, overwhelming, and irreversible. Ryu now carries within him a force he barely understands and cannot yet control.
                </p>
                <p>
                  But there is no time to adjust. An <strong className="text-white">evil dragon</strong> has awakened with a singular purpose: to plunge the already-fragile world into chaos. Ancient in its malice and devastating in its power, this threat is unlike anything humanity's rebuilt civilization is prepared to face.
                </p>
              </div>
              <div className="space-y-5 text-white/75 leading-relaxed text-[15px]">
                <p>
                  Ryu is not alone. Allies emerge — each with their own motivations, abilities, and scars from a world that has never fully healed. Together, they represent humanity's best — and perhaps only — chance at stopping what's coming.
                </p>
                <p>
                  But the question that drives every chapter, every battle, every choice is not whether Ryu has the power. It's whether he has the <strong className="text-white">wisdom, the will, and the time</strong> to learn how to use it before it's too late.
                </p>
                <p className="italic text-white/50 border-l-2 border-[oklch(0.55_0.22_25/0.5)] pl-4">
                  "He didn't ask for this power. But the world needs him to master it."
                </p>
                <p>
                  Dragon Fist X is a multi-platform property — developed simultaneously as an <strong className="text-white">anime series</strong> and a <strong className="text-white">video game</strong> — designed to deliver a cohesive narrative experience across both mediums. The game allows players to live the story; the anime expands the world beyond it.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Property Overview */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-16">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Format", value: "Anime + Video Game", icon: "🎮" },
                { label: "Genre", value: "Action / Coming-of-Age", icon: "⚔️" },
                { label: "Setting", value: "Post-Apocalyptic, Year 2767", icon: "🌍" },
                { label: "Status", value: "In Active Development", icon: "🔥" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl p-5 border border-[oklch(0.55_0.22_25/0.2)] bg-[oklch(0.11_0.01_285)]">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <p className="text-xs text-white/40 uppercase tracking-widest mb-1" style={{ fontFamily: "'Orbitron', monospace" }}>{item.label}</p>
                  <p className="text-white font-semibold text-sm">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Teaser Video */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <p className="text-xs font-bold tracking-[0.3em] text-[oklch(0.7_0.22_25)] mb-3 uppercase" style={{ fontFamily: "'Orbitron', monospace" }}>Official Teaser</p>
            <h2 className="text-3xl font-bold text-white mb-6" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Watch the Teaser Trailer</h2>
            <div className="relative rounded-xl overflow-hidden border border-[oklch(0.55_0.22_25/0.4)]" style={{ boxShadow: "0 0 80px oklch(0.55 0.22 25 / 0.2)" }}>
              <video src={DFX_VIDEO} controls autoPlay muted loop playsInline className="w-full" style={{ display: "block" }} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Play Demo Section ── */}
      <div className="h-16 pointer-events-none" style={{ background: "oklch(0.08 0.01 285)", clipPath: "polygon(0 50%, 100% 0, 100% 100%, 0 100%)", marginTop: "-1px" }} />
      <section className="py-20 relative overflow-hidden" style={{ marginTop: "-1px" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 100% at 50% 50%, oklch(0.55 0.22 25 / 0.07) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 border-y border-[oklch(0.55_0.22_25/0.12)]" />
        <div className="container relative z-10 text-center">
          <p className="text-xs font-bold tracking-[0.3em] text-[oklch(0.55_0.28_290)] mb-3 uppercase" style={{ fontFamily: "'Orbitron', monospace" }}>Available Now</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Play the Demo</h2>
          <p className="text-white/60 mb-8 max-w-md mx-auto">
            Experience Dragon Fist X firsthand. Choose your fighter, go Player vs CPU or Player vs Player, and feel the dragon energy for yourself.
          </p>
          <a
            href="/dragonfistx"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-4 rounded font-bold text-sm tracking-wider uppercase transition-all duration-200 active:scale-[0.97]"
            style={{ fontFamily: "'Orbitron', monospace", background: "oklch(0.55 0.22 25)", color: "oklch(0.97 0 0)", boxShadow: "0 0 40px oklch(0.55 0.22 25 / 0.4)" }}
          >
            ⚔️ Enter the Arena
          </a>
        </div>
      </section>

    </div>
  );
}
