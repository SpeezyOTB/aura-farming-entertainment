/* ============================================================
 * DFX Demo — Full-screen iframe embed of the Dragon Fist X game
 * aurafarmingentertainment.com/dfx/demo
 * ============================================================ */
import { Link } from "wouter";

export default function DFXDemo() {
  return (
    <div className="fixed inset-0 bg-black flex flex-col" style={{ zIndex: 9999 }}>
      {/* Slim top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[oklch(0.06_0.01_285)] border-b border-white/10 flex-shrink-0">
        <Link href="/dfx" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
          <span>←</span>
          <span style={{ fontFamily: "'Orbitron', monospace" }} className="text-xs tracking-widest uppercase">Dragon Fist X</span>
        </Link>
        <span className="text-xs text-white/30 tracking-widest uppercase" style={{ fontFamily: "'Orbitron', monospace" }}>
          Demo
        </span>
        <a
          href="https://fightergame-j95rkwu8.manus.space"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-white/40 hover:text-white transition-colors tracking-wide"
          style={{ fontFamily: "'Orbitron', monospace" }}
        >
          Open Full ↗
        </a>
      </div>
      {/* Full-screen iframe */}
      <iframe
        src="https://fightergame-j95rkwu8.manus.space"
        title="Dragon Fist X Game Demo"
        className="flex-1 w-full border-0"
        allow="autoplay; gamepad; fullscreen"
        allowFullScreen
      />
    </div>
  );
}
