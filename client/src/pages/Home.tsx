/* ============================================================
 * Home Page — Aura Farming Entertainment
 * Design: Aura Pulse — hero with cosmic energy bg, project cards,
 * about section. Dark theme, purple/green/red brand colors.
 * ============================================================ */
import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function Home() {
  const particleRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = particleRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; color: string; alpha: number }[] = [];
    const colors = ["#9333ea", "#22c55e", "#ef4444", "#a855f7", "#16a34a"];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[oklch(0.08_0.01_285)] text-white">

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663841309695/VDDWVFyKVQaybPkx.jpg')" }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.08_0.01_285/0.6)] via-[oklch(0.08_0.01_285/0.4)] to-[oklch(0.08_0.01_285)]" />
        {/* Particle canvas */}
        <canvas ref={particleRef} className="absolute inset-0 w-full h-full pointer-events-none" />

        {/* Content */}
        <div className="container relative z-10 pt-24 pb-32">
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <motion.p
              custom={0}
              variants={fadeUp}
              className="text-xs font-bold tracking-[0.3em] text-[oklch(0.72_0.22_140)] mb-4 uppercase"
              style={{ fontFamily: "'Orbitron', monospace" }}
            >
              Aura Farming Entertainment
            </motion.p>

            <motion.h1
              custom={1}
              variants={fadeUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-3"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              Welcome to Aura Farming Entertainment
            </motion.h1>

            <motion.h2
              custom={2}
              variants={fadeUp}
              className="text-2xl sm:text-3xl font-semibold mb-6"
              style={{ fontFamily: "'Rajdhani', sans-serif", color: "oklch(0.75 0.25 290)" }}
            >
              The Next Generation of Media
            </motion.h2>

            <motion.p
              custom={3}
              variants={fadeUp}
              className="text-lg text-white/70 max-w-xl mb-10 leading-relaxed"
            >
              We craft next-generation anime games and trading card experiences
              that let you harness your inner power. Step into worlds where your
              aura defines your destiny.
            </motion.p>

            <motion.div custom={4} variants={fadeUp} className="flex flex-wrap gap-4">
              <Link
                href="/shadowkhantcg"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded font-semibold text-sm tracking-wider uppercase transition-all duration-200 active:scale-[0.97]"
                style={{
                  fontFamily: "'Orbitron', monospace",
                  background: "oklch(0.55 0.28 290)",
                  boxShadow: "0 0 24px oklch(0.55 0.28 290 / 0.5)",
                }}
              >
                Shadow'Khan TCG
              </Link>
              <Link
                href="/dfx"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded font-semibold text-sm tracking-wider uppercase border border-[oklch(0.55_0.22_25/0.6)] text-white hover:border-[oklch(0.55_0.22_25)] hover:shadow-[0_0_20px_oklch(0.55_0.22_25/0.3)] transition-all duration-200 active:scale-[0.97]"
                style={{ fontFamily: "'Orbitron', monospace" }}
              >
                Dragon Fist X
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[oklch(0.08_0.01_285)] to-transparent" />
      </section>

      {/* ── Projects Section ── */}
      <section className="py-24 bg-[oklch(0.08_0.01_285)] relative overflow-hidden">
        {/* Violet aura radial — parent brand anchor */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 70% 50% at 50% 0%, oklch(0.55 0.28 290 / 0.07) 0%, transparent 70%)",
          }}
        />
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-14"
          >
            <p
              className="text-xs font-bold tracking-[0.3em] text-[oklch(0.55_0.28_290)] mb-3 uppercase"
              style={{ fontFamily: "'Orbitron', monospace" }}
            >
              Our Universe
            </p>
            <h2
              className="text-5xl font-bold text-white"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              Enter the Worlds We Build
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Shadow Khan Card */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            >
              <Link href="/shadowkhantcg" className="block group">
                <div className="relative overflow-hidden rounded-lg border border-[oklch(0.72_0.22_140/0.3)] hover:border-[oklch(0.72_0.22_140/0.7)] transition-all duration-300 hover:shadow-[0_0_40px_oklch(0.72_0.22_140/0.2)]">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663841309695/zUUViDXJddUsiKHy.jpg"
                      alt="Shadow'Khan TCG"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.08_0.01_285)] via-transparent to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span
                      className="text-xs font-bold tracking-widest text-[oklch(0.72_0.22_140)] uppercase mb-2 block"
                      style={{ fontFamily: "'Orbitron', monospace" }}
                    >
                      Trading Card Game
                    </span>
                    <h3
                      className="text-3xl font-bold text-white mb-2"
                      style={{ fontFamily: "'Rajdhani', sans-serif" }}
                    >
                      Shadow'Khan TCG
                    </h3>
                    <p className="text-sm text-white/60">
                      A two-player online card game. Drain your opponent's deck until they have nothing left to draw.
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-[oklch(0.72_0.22_140)] text-xs font-semibold tracking-wider uppercase group-hover:gap-3 transition-all duration-200">
                      <span>Play Now</span>
                      <span>→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Dragon Fist X Card */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            >
              <div className="relative overflow-hidden rounded-lg border border-[oklch(0.55_0.22_25/0.3)] hover:border-[oklch(0.55_0.22_25/0.7)] transition-all duration-300 hover:shadow-[0_0_40px_oklch(0.55_0.22_25/0.2)]">
                <div className="aspect-video overflow-hidden">
                  <img
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663841309695/EPvhyfNHwWIWXtli.jpg"
                    alt="Dragon Fist X"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.05_0.01_285)] via-[oklch(0.05_0.01_285/0.4)] to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span
                    className="text-xs font-bold tracking-widest text-[oklch(0.55_0.22_25)] uppercase mb-2 block"
                    style={{ fontFamily: "'Orbitron', monospace" }}
                  >
                    Anime / Video Game
                  </span>
                  <h3
                    className="text-3xl font-bold text-white mb-2"
                    style={{ fontFamily: "'Rajdhani', sans-serif" }}
                  >
                    Dragon Fist X
                  </h3>
                  <p className="text-sm text-white/60 mb-4">
                    An epic anime-inspired fighting game where warriors harness dragon energy to dominate their foes.
                  </p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Link
                      href="/dfx"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold tracking-wider uppercase transition-all duration-200 active:scale-[0.97] border border-white/30 hover:border-white/60 text-white/80 hover:text-white"
                      style={{ fontFamily: "'Orbitron', monospace" }}
                    >
                      Watch Teaser Trailer
                    </Link>
                    <a
                        href="https://aurafarmingentertainment.com/games/dragonfistx"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold tracking-wider uppercase transition-all duration-200 active:scale-[0.97] hover:shadow-[0_0_16px_oklch(0.55_0.22_25/0.5)]"
                      style={{
                        fontFamily: "'Orbitron', monospace",
                        background: "oklch(0.55 0.22 25)",
                        color: "oklch(0.97 0 0)",
                      }}
                    >
                      Play Demo
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── About Section ── */}
      {/* Diagonal divider: projects → about */}
      <div
        className="h-20 pointer-events-none"
        style={{
          background: "oklch(0.08 0.01 285)",
          clipPath: "polygon(0 0, 100% 40%, 100% 100%, 0 100%)",
        }}
      />
      <section className="relative py-24 overflow-hidden" style={{ marginTop: "-1px" }}>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663841309695/CiYFqARsMytBkFsE.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.08_0.01_285)] via-[oklch(0.08_0.01_285/0.8)] to-[oklch(0.08_0.01_285/0.6)]" />
        <div className="container relative z-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <p
                className="text-xs font-bold tracking-[0.3em] text-[oklch(0.55_0.22_25)] mb-3 uppercase"
                style={{ fontFamily: "'Orbitron', monospace" }}
              >
              About Us
              </p>
              <h2
                className="text-5xl font-bold text-white mb-6"
                style={{ fontFamily: "'Rajdhani', sans-serif" }}
              >
                Built From Vision,
                <br />
                <span style={{ color: "oklch(0.75 0.25 290)" }}>Driven by Purpose</span>
              </h2>
              <p className="text-white/70 leading-relaxed mb-4">
                Aura Farming Entertainment is a subdivision of{" "}
                <span className="text-white/90 font-semibold">International Playing Field LLC</span>,
                founded by Joseph Johnson — known professionally as{" "}
                <span className="text-white/90 font-semibold">Speezy OTB</span>. Joseph is the
                creator of Shadow'Khan TCG and Dragon Fist X, two properties he first conceived at
                the age of 13. Over the years, he has taken the time to carefully refine these
                concepts, and is now bringing them to life through a combination of traditional
                creative methods and modern technology.
              </p>
              <p className="text-white/70 leading-relaxed mb-4">
                In 2015, Joseph lost his eyesight — yet his creative vision never wavered. He has
                continued to develop, build, and push forward, proving that the most powerful
                stories are born from resilience.
              </p>
              <p className="text-white/70 leading-relaxed mb-8">
                The mission of Aura Farming Entertainment is to become a major force in the
                entertainment industry by delivering fresh, unique takes on classic mediums —
                spanning video games, trading card games, and animation. Every project is built
                with an emphasis on eye-catching visuals and emotionally resonant storytelling,
                offering audiences worlds that feel both timeless and entirely new.
              </p>
              <div className="flex flex-wrap gap-8">
                {[
                  { value: "2", label: "Active Projects", color: "oklch(0.55 0.28 290)" },
                  { value: "10+", label: "Years in Development", color: "oklch(0.72 0.22 140)" },
                  { value: "1", label: "Unstoppable Vision", color: "oklch(0.55 0.22 25)" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p
                      className="text-4xl font-bold mb-1"
                      style={{ fontFamily: "'Rajdhani', sans-serif", color: stat.color }}
                    >
                      {stat.value}
                    </p>
                    <p className="text-xs text-white/50 tracking-wider uppercase">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
