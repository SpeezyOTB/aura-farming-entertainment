/* ============================================================
 * Footer — Aura Farming Entertainment
 * Design: Aura Pulse — dark footer with brand accent line
 * ============================================================ */
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-[oklch(0.06_0.01_285)] border-t border-white/10 mt-0">
      <div className="container py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img
              src="/manus-storage/afe-logo-icon_5624d13c.png"
              alt="AFE Logo"
              className="w-8 h-8 object-contain"
            />
            <div>
              <p
                className="text-xs font-bold tracking-widest text-white"
                style={{ fontFamily: "'Orbitron', monospace" }}
              >
                AURA FARMING ENTERTAINMENT
              </p>
              <p className="text-xs text-white/40 mt-0.5">Your Aura. Your Legend.</p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-6">
            {[
              { href: "/", label: "Home" },
              { href: "/shadow-khan", label: "Shadow'Khan TCG" },
              { href: "/dragon-fist-x", label: "Dragon Fist X" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-white/50 hover:text-white transition-colors duration-200 tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} Aura Farming Entertainment. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[oklch(0.55_0.28_290)]" />
            <span className="w-2 h-2 rounded-full bg-[oklch(0.72_0.22_140)]" />
            <span className="w-2 h-2 rounded-full bg-[oklch(0.55_0.22_25)]" />
          </div>
        </div>
      </div>
    </footer>
  );
}
