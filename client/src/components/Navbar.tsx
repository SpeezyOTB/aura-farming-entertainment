/* ============================================================
 * Navbar — Aura Farming Entertainment
 * Design: Aura Pulse — slim top bar, transparent over hero,
 * solidifies on scroll. Orbitron font for nav items.
 * ============================================================ */
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shadow-khan", label: "Shadow'Khan TCG" },
    { href: "/dragon-fist-x", label: "Dragon Fist X" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? "bg-[oklch(0.08_0.01_285/0.95)] backdrop-blur-xl border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 flex-shrink-0">
            <img
              src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663841309695/TaJmNUcewyfbFuHC.png"
              alt="Aura Farming Entertainment Logo"
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 rounded-full bg-[oklch(0.55_0.28_290/0.3)] blur-md group-hover:bg-[oklch(0.55_0.28_290/0.5)] transition-all duration-300" />
          </div>
          <span
            className="font-accent text-sm font-bold tracking-widest text-white hidden sm:block"
            style={{ fontFamily: "'Orbitron', monospace" }}
          >
            AURA FARMING
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 text-xs font-semibold tracking-widest uppercase transition-all duration-200 rounded ${
                location === link.href
                  ? "text-[oklch(0.72_0.22_140)] text-glow-green"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
              style={{ fontFamily: "'Orbitron', monospace" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[oklch(0.08_0.01_285/0.98)] backdrop-blur-xl">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-6 py-4 text-xs font-semibold tracking-widest uppercase border-b border-white/5 transition-colors duration-200 ${
                location === link.href
                  ? "text-[oklch(0.72_0.22_140)]"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
              style={{ fontFamily: "'Orbitron', monospace" }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
