/**
 * FighterGame.tsx
 * Design: Ember Shodō Arena — cinematic anime arcade fighter, warm sunset stage,
 * sharp ember-and-shadow HUD geometry, and readable mythic combat feedback.
 * Full-screen canvas game with React HUD overlay.
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from '@/game/GameEngine';
import { SoundManager } from '@/game/SoundManager';
import type { GameState, GameMode } from '@/game/types';
import type { FighterConfig } from '@/game/types';
import {
  CANVAS_WIDTH, CANVAS_HEIGHT, MAX_HEALTH, MAX_ENERGY, BOOST_DURATION,
} from '@/game/constants';

// ── Asset URLs ────────────────────────────────────────────────
const BG_URL       = 'https://fightergame-j95rkwu8.manus.space/manus-storage/dojo-bg_5f9dc991.png';
const RYU_SPRITE   = 'https://fightergame-j95rkwu8.manus.space/manus-storage/ryu-stage-alpha-v2_e7f4a6ad.png';
const AKARI_SPRITE = 'https://fightergame-j95rkwu8.manus.space/manus-storage/akari-stage-sprite-matted_5a68ed62.png';
const RYU_ICON     = 'https://fightergame-j95rkwu8.manus.space/manus-storage/ryu-icon_28b074e0.png';
const AKARI_ICON   = 'https://fightergame-j95rkwu8.manus.space/manus-storage/akari-icon_f2d516a1.png';
const GALVA_SPRITE = 'https://fightergame-j95rkwu8.manus.space/manus-storage/galva_bc16a2a0.png';
const KAI_SPRITE   = 'https://fightergame-j95rkwu8.manus.space/manus-storage/kai_94245d01.png';
const SHURAKU_SPRITE = 'https://fightergame-j95rkwu8.manus.space/manus-storage/shuraku_59416bbc.png';

// UI sounds via plain Audio elements (no AudioContext needed)
const UI_CLICK_URL    = 'https://fightergame-j95rkwu8.manus.space/manus-storage/ui-click_5a63fcad.wav';
const FIGHT_START_URL = 'https://fightergame-j95rkwu8.manus.space/manus-storage/fight-start_57a8e184.wav';
const CHAR_SELECT_VOICES: Record<string, string> = {
  ryu:     'https://fightergame-j95rkwu8.manus.space/manus-storage/ryu-select-dry_b6332a11.wav',
  akari:   'https://fightergame-j95rkwu8.manus.space/manus-storage/akari-select-dry_17c37207.wav',
  kai:     'https://fightergame-j95rkwu8.manus.space/manus-storage/kai-select-dry_d5a1b4cb.wav',
  galva:   'https://fightergame-j95rkwu8.manus.space/manus-storage/galva-select-dry_d204de11.wav',
  shuraku: 'https://fightergame-j95rkwu8.manus.space/manus-storage/shuraku-select-dry_ab900573.wav',
};
function playUISound(url: string, vol = 1) {
  try { const a = new Audio(url); a.volume = vol; a.play().catch(() => {}); } catch { /* ignore */ }
}
// ── Character metadata (voice lines, win pose) ────────────────
const CHAR_META: Record<string, { winLine: string; loseLine: string; winPose: string; color: string }> = {
  ryu:     { winLine: "This power is mine to control.", loseLine: "No way... I'll get you next time!", winPose: "\u270a",  color: '#f59e0b' },
  akari:   { winLine: "At least you tried.",           loseLine: "Hmph. Don't get used to it.",       winPose: "\U0001f60f", color: '#ec4899' },
  galva:   { winLine: "What's the matter? You look shocked!", loseLine: "Tch... don't get used to that.", winPose: "\u26a1", color: '#00cfff' },
  kai:     { winLine: "Hm. I'm not impressed.",        loseLine: "...Interesting. You've earned a rematch.", winPose: "\U0001f32a", color: '#60c8ff' },
  shuraku: { winLine: "This world is mine.",           loseLine: "You merely delayed the inevitable.", winPose: "\U0001f30c", color: '#8800ff' },
};

// ── Character definitions ─────────────────────────────────────
const CHARS: Record<string, Omit<FighterConfig, 'id' | 'startX' | 'facingRight'>> = {
  ryu: {
    name: 'Ryu',
    title: 'The Spirit of Icarus',
    color: '#f59e0b',
    energyColor: '#ff4500',
    spriteUrl: RYU_SPRITE,
    iconUrl: RYU_ICON,
    moveSpeedMult: 1.04,
    hasIcarusStyle: true,
  },
  akari: {
    name: 'Akari',
    title: 'The Spirit of Aphrodite',
    color: '#ec4899',
    energyColor: '#ff69b4',
    spriteUrl: AKARI_SPRITE,
    iconUrl: AKARI_ICON,
    moveSpeedMult: 1.10,
    hasAphroditeStyle: true,
  },
  galva: {
    name: 'Galva',
    title: 'The Spirit of Lightning',
    color: '#00cfff',
    energyColor: '#00cfff',
    spriteUrl: GALVA_SPRITE,
    iconUrl: GALVA_SPRITE,
    punchDamageBonus: 1,
    kickDamageBonus: 1,
    moveSpeedMult: 0.85,
    boostInfinite: true,
    hasLightningBlast: true,
    hasGroundSlam: true,
    hasLightningBarrier: true,
    hasTeleport: true,
  },
  kai: {
    name: 'Kai',
    title: 'The Tempest Master',
    color: '#60c8ff',
    energyColor: '#a0e8ff',
    spriteUrl: KAI_SPRITE,
    iconUrl: KAI_SPRITE,
    moveSpeedMult: 1.12,
    jumpVelocityMult: 1.2,
    boostDuration: 25,
    hasAerialKick: true,
    hasTornado: true,
    hasTempestStyle: true,
  },
  shuraku: {
    name: 'Shuraku',
    title: 'The Dark Sovereign',
    color: '#8800ff',
    energyColor: '#cc44ff',
    spriteUrl: SHURAKU_SPRITE,
    iconUrl: SHURAKU_SPRITE,
    maxHealth: 185,
    punchDamageBonus: 1,
    kickDamageBonus: 2,
    moveSpeedMult: 0.88,
    boostDuration: 25,
    hasShadowBarrier: true,
    hasGrab: true,
    hasDominionStyle: true,
  },
};

// ── HUD sub-components ────────────────────────────────────────
interface HUDData {
  name: string; title: string; health: number; maxHealth: number; energy: number;
  boostActive: boolean; boostTimer: number; boostCooldown: number;
  consecutiveHits: number; color: string;
  energyColor: string; iconUrl: string;
  comboCount: number;
  hitFlash: number;
}

function HealthBar({ value, maxHealth, flip, hitFlash }: { value: number; maxHealth?: number; flip?: boolean; hitFlash: number }) {
  const pct = Math.max(0, (value / (maxHealth ?? MAX_HEALTH)) * 100);
  const col = pct > 50 ? '#22c55e' : pct > 25 ? '#eab308' : '#ef4444';
  return (
    <div className={`relative h-5 w-full overflow-hidden bg-black/70 border border-white/25 ${flip ? '[direction:rtl]' : ''}`}
      style={{ boxShadow: hitFlash > 0 ? '0 0 0 2px rgba(255,255,255,0.85), 0 0 18px #ef4444' : undefined }}>
      <div className="h-full transition-all duration-150 ease-out"
        style={{ width: `${pct}%`, background: `linear-gradient(90deg,${col}99,${col})`, boxShadow: `0 0 8px ${col}` }} />
      <span className={`absolute inset-0 flex items-center text-white text-xs font-black drop-shadow ${flip ? 'justify-start pl-2' : 'justify-end pr-2'}`}>
        {Math.ceil(value)}
      </span>
    </div>
  );
}

function EnergyBar({ value, boostActive, boostTimer, boostCooldown, energyColor, flip, gain }:
  { value: number; boostActive: boolean; boostTimer: number; boostCooldown: number; energyColor: string; flip?: boolean; gain?: { tick: number; amount: number } }) {
  const pct = Math.max(0, (value / MAX_ENERGY) * 100);
  const onCooldown = !boostActive && boostCooldown > 0;
  return (
    <div className={`relative h-3 w-full overflow-hidden bg-black/60 border border-white/15 ${gain ? 'energy-meter-gain' : ''} ${flip ? '[direction:rtl]' : ''}`}
      style={{ '--energy-color': energyColor } as React.CSSProperties}>
      {boostActive
        ? <div className="h-full animate-pulse"
            style={{ width: `${(boostTimer/BOOST_DURATION)*100}%`, background: `linear-gradient(90deg,${energyColor},#fff8)`, boxShadow: `0 0 14px ${energyColor}` }} />
        : onCooldown
        ? <div className="h-full transition-all duration-1000"
            style={{ width: `${Math.max(0, 100 - (boostCooldown/32)*100)}%`, background: 'linear-gradient(90deg,#444,#666)', boxShadow: 'none' }} />
        : <div className="h-full transition-all duration-150"
            style={{ width: `${pct}%`, background: `linear-gradient(90deg,${energyColor}88,${energyColor})`, boxShadow: `0 0 8px ${energyColor}` }} />
      }
      {gain && !boostActive && !onCooldown && (
        <>
          <div key={`flow-${gain.tick}`} className="energy-meter-flow absolute inset-y-0 w-2/5 pointer-events-none"
            style={{ background: `linear-gradient(90deg, transparent, #fff, ${energyColor}, transparent)` }} />
          <span key={`gain-${gain.tick}`} className={`energy-gain-label absolute -top-5 z-10 text-[10px] font-black tracking-wide ${flip ? 'left-1' : 'right-1'}`}
            style={{ color: energyColor, textShadow: `0 0 8px ${energyColor}` }}>+{gain.amount} ⚡</span>
        </>
      )}
    </div>
  );
}

function FighterHUD({ d, flip, energyGain }: { d: HUDData; flip?: boolean; energyGain?: { tick: number; amount: number } }) {
  return (
    <div className={`flex items-center gap-2 w-full px-2 py-1 ${flip ? 'flex-row-reverse' : ''}`}
      style={{
        background: 'linear-gradient(90deg, rgba(6,4,8,0.78), rgba(34,15,8,0.36))',
        clipPath: flip
          ? 'polygon(7% 0,100% 0,100% 100%,0 100%,0 22%)'
          : 'polygon(0 0,93% 0,100% 22%,100% 100%,0 100%)',
      }}>
      {/* Profile icon */}
      <div className="relative shrink-0">
        <img src={d.iconUrl} alt={d.name}
          className="w-14 h-14 rounded-full object-cover border-2"
          style={{ borderColor: d.color, boxShadow: `0 0 12px ${d.color}` }} />
        {d.boostActive && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-black px-1 rounded-full whitespace-nowrap animate-bounce"
            style={{ background: d.energyColor, color: '#fff' }}>
            ⚡{Math.ceil(d.boostTimer)}s
          </div>
        )}
      </div>
      {/* Bars */}
      <div className="flex-1 flex flex-col gap-1">
        <div className={`flex items-baseline gap-1 ${flip ? 'flex-row-reverse' : ''}`}>
          <span className="text-white font-black text-sm tracking-widest uppercase"
            style={{ textShadow: `0 0 8px ${d.color}` }}>{d.name}</span>
          <span className="text-white/50 text-[10px] truncate">{d.title}</span>
        </div>
        <HealthBar value={d.health} maxHealth={d.maxHealth} flip={flip} hitFlash={d.hitFlash} />
        <div className={`flex items-center gap-1 ${flip ? 'flex-row-reverse' : ''}`}>
          <span className="text-[10px] font-semibold whitespace-nowrap" style={{ color: d.energyColor }}>⚡ ENERGY</span>
          <div className="flex-1">
            <EnergyBar value={d.energy} boostActive={d.boostActive} boostTimer={d.boostTimer} boostCooldown={d.boostCooldown} energyColor={d.energyColor} flip={flip} gain={energyGain} />
          </div>
          {!d.boostActive && d.boostCooldown <= 0 && d.energy > 0 && (
            <span className="text-[10px] font-semibold" style={{ color: d.energyColor }}>{d.energy}/{MAX_ENERGY}</span>
          )}
          {!d.boostActive && d.boostCooldown > 0 && (
            <span className="text-[10px] font-semibold text-gray-400">⏳{Math.ceil(d.boostCooldown)}s</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Character Select Screen ───────────────────────────────────
function CharSelect({ onSelect, onVoicePlay }: { onSelect: (p1: string, p2: string, mode: GameMode) => void; onVoicePlay?: (url: string) => void }) {
  const [p1Char, setP1Char] = useState<string>('ryu');
  const [p2Char, setP2Char] = useState<string>('akari');
  const [mode, setMode] = useState<GameMode>('cpu');

  const charKeys = Object.keys(CHARS);

  const handleCharSelect = (setter: (k: string) => void, key: string) => {
    playUISound(UI_CLICK_URL, 0.5);
    // Duck music and play character select voice clip
    const voiceUrl = CHAR_SELECT_VOICES[key];
    if (voiceUrl) {
      setTimeout(() => {
        if (onVoicePlay) onVoicePlay(voiceUrl);
        else playUISound(voiceUrl, 1.0);
      }, 80);
    }
    setter(key);
  };
  const handleModeSelect = (m: GameMode) => {
    playUISound(UI_CLICK_URL, 0.4);
    setMode(m);
  };
  const handleFight = () => {
    playUISound(FIGHT_START_URL, 0.8);
    onSelect(p1Char, p2Char, mode);
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-6 px-4"
      style={{ background: 'radial-gradient(ellipse at center, #2a1000 0%, #0a0500 100%)' }}>

      {/* Title with logo */}
      <div className="text-center flex flex-col items-center gap-2">
        <img src="https://fightergame-j95rkwu8.manus.space/manus-storage/dragonfistXlogo_96131b2b.PNG" alt="Dragon Fist X"
          className="w-32 h-32 object-contain drop-shadow-lg"
          style={{ filter: 'drop-shadow(0 0 18px #f59e0b88)' }} />
        <p className="text-amber-400 text-sm tracking-widest">SELECT YOUR FIGHTER</p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-3">
        {(['pvp','cpu','cvc'] as GameMode[]).map(m => (
          <button key={m} 
            type="button"
            aria-pressed={mode === m}
            aria-label={m === 'pvp' ? 'Player vs Player mode' : m === 'cpu' ? 'Player vs CPU mode' : 'Spectator Mode - CPU vs CPU'}
            onClick={() => handleModeSelect(m)}
            className="px-6 py-2 rounded font-black text-sm tracking-widest uppercase transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background: mode === m ? 'linear-gradient(135deg,#f59e0b,#ef4444)' : 'rgba(255,255,255,0.08)',
              color: '#fff',
              boxShadow: mode === m ? '0 0 20px #f59e0b' : 'none',
              border: '1px solid rgba(255,255,255,0.15)',
            }}>
            <span aria-hidden="true">{m === 'pvp' ? '⚔️ Player vs Player' : m === 'cpu' ? '🤖 Player vs CPU' : '👁️ Spectator Mode'}</span>
          </button>
        ))}
      </div>

      {/* Character panels */}
      <div className="flex gap-8 items-start">
        {[
          { label: mode === 'cvc' ? 'CPU 1' : 'PLAYER 1', pick: p1Char, setPick: setP1Char, flip: false },
          { label: mode === 'cpu' ? 'CPU' : mode === 'cvc' ? 'CPU 2' : 'PLAYER 2', pick: p2Char, setPick: setP2Char, flip: true },
        ].map(({ label, pick, setPick, flip }) => (
          <div key={label} className="flex flex-col items-center gap-3">
            <span className="text-white/60 text-xs font-bold tracking-widest">{label}</span>
            <div className="flex gap-3">
              {charKeys.map(k => {
                const c = CHARS[k];
                const sel = pick === k;
                return (
                  <button key={k} 
                    type="button"
                    aria-pressed={sel}
                    aria-label={`Select ${c.name}, ${c.title}`}
                    onClick={() => handleCharSelect(setPick, k)}
                    className="flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-150 hover:scale-105 cursor-pointer"
                    style={{
                      border: sel ? `2px solid ${c.color}` : '2px solid rgba(255,255,255,0.1)',
                      background: sel ? `${c.color}22` : 'rgba(0,0,0,0.4)',
                      boxShadow: sel ? `0 0 20px ${c.color}88` : 'none',
                    }}>
                    <img src={c.spriteUrl} alt={c.name}
                      className={`w-24 h-36 object-contain ${flip ? 'scale-x-[-1]' : ''}`} />
                    <span className="text-white font-black text-xs tracking-widest">{c.name}</span>
                    <span className="text-white/50 text-[9px] text-center max-w-[90px]">{c.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Fight button */}
      <button 
        type="button"
        aria-label={`Start fight: ${CHARS[p1Char]?.name ?? p1Char} versus ${mode === 'pvp' ? CHARS[p2Char]?.name ?? p2Char : 'CPU'}`}
        onClick={handleFight}
        className="px-14 py-4 font-black text-2xl tracking-widest text-white rounded-lg uppercase transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer"
        style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)', boxShadow: '0 0 30px #f59e0b', fontFamily: "'Bebas Neue', sans-serif" }}>
        FIGHT!
      </button>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-6 text-xs text-white/50 mt-2">
        <div className="space-y-0.5">
          <p className="text-white/80 font-bold mb-1">🎮 P1 — Keyboard</p>
          <p><kbd className="bg-white/10 px-1 rounded">A/D</kbd> Move &nbsp; <kbd className="bg-white/10 px-1 rounded">W</kbd> Jump</p>
          <p><kbd className="bg-white/10 px-1 rounded">S</kbd> Block &nbsp; <kbd className="bg-white/10 px-1 rounded">F</kbd> Punch &nbsp; <kbd className="bg-white/10 px-1 rounded">G</kbd> Kick</p>
          <p><kbd className="bg-white/10 px-1 rounded">→ + G</kbd> Roundhouse &nbsp; <kbd className="bg-white/10 px-1 rounded">S + G</kbd> Sweep</p>
          <p><kbd className="bg-white/10 px-1 rounded">E</kbd> Special Move &nbsp; <kbd className="bg-white/10 px-1 rounded">C</kbd> Charge</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-white/80 font-bold mb-1">🎮 P2 — Keyboard</p>
          <p><kbd className="bg-white/10 px-1 rounded">←/→</kbd> Move &nbsp; <kbd className="bg-white/10 px-1 rounded">↑</kbd> Jump</p>
          <p><kbd className="bg-white/10 px-1 rounded">↓</kbd> Block &nbsp; <kbd className="bg-white/10 px-1 rounded">L</kbd> Punch &nbsp; <kbd className="bg-white/10 px-1 rounded">K</kbd> Kick</p>
          <p><kbd className="bg-white/10 px-1 rounded">Toward + K</kbd> Roundhouse &nbsp; <kbd className="bg-white/10 px-1 rounded">↓ + K</kbd> Sweep</p>
          <p><kbd className="bg-white/10 px-1 rounded">P</kbd> Special Move &nbsp; <kbd className="bg-white/10 px-1 rounded">O</kbd> Charge</p>
        </div>
      </div>
      <p className="text-amber-500/70 text-xs">🎮 PS5 / Xbox controllers also supported — plug in and press any button!</p>
    </div>
  );
}

// ── Main Game Component ───────────────────────────────────────
// ── Victory Screen ────────────────────────────────────────────
function VictoryScreen({
  winnerName, winnerKey, loserName, loserKey,
  winnerImg, loserImg, onRematch, onSelect,
}: {
  winnerName: string; winnerKey: string; loserName: string; loserKey: string;
  winnerImg: string; loserImg: string;
  onRematch: () => void; onSelect: () => void;
}) {
  const wMeta = CHAR_META[winnerKey] ?? { winLine: "I win!", winPose: "✊" };
  const lMeta = CHAR_META[loserKey] ?? { loseLine: "Next time...", winPose: "" };
  const winnerColor = (CHAR_META[winnerKey] ?? CHAR_META["ryu"]).color;
  const isRyuVictory = winnerKey === 'ryu';
  const winnerVisual = CHARS[winnerKey]?.spriteUrl ?? winnerImg;
  const [ryuVictoryPose, setRyuVictoryPose] = useState<'guard' | 'rise'>('guard');
  useEffect(() => {
    if (!isRyuVictory) return;
    setRyuVictoryPose('guard');
    const timer = window.setTimeout(() => setRyuVictoryPose('rise'), 900);
    return () => window.clearTimeout(timer);
  }, [isRyuVictory, winnerKey]);
  return (
    <div className="flex flex-col items-center gap-4 w-full px-4">
      <div className="font-black text-5xl text-white tracking-widest text-center"
        style={{ fontFamily: "'Bebas Neue',sans-serif", textShadow: `0 0 40px ${winnerColor}` }}>
        {winnerName} WINS!
      </div>
      <div className="flex items-end justify-center gap-8 w-full max-w-lg">
        <div className="flex flex-col items-center gap-2 flex-1">
          {isRyuVictory ? (
            <div className="relative h-40 w-40 overflow-hidden rounded-xl border-2 bg-black/40"
              style={{ borderColor: '#ff8a00', boxShadow: '0 0 28px #ff5a00, inset 0 -26px 30px rgba(0,0,0,0.72)' }}>
              <div className="absolute inset-x-2 h-5 rounded-[50%] border border-orange-300/50"
                style={{ bottom: ryuVictoryPose === 'guard' ? '12px' : '7px', boxShadow: '0 0 18px #ff4d00, 0 0 38px #f59e0b', transition: 'bottom 820ms cubic-bezier(0.23, 1, 0.32, 1)' }} />
              <img src={winnerVisual} alt="Ryu holding a low guard stance"
                className="absolute h-44 w-44 max-w-none -translate-x-1/2 object-contain"
                style={{
                  bottom: ryuVictoryPose === 'guard' ? '-7px' : '1px',
                  left: '83%',
                  filter: `drop-shadow(0 0 ${ryuVictoryPose === 'guard' ? '10px' : '18px'} #ff5a00)`,
                  transform: ryuVictoryPose === 'guard'
                    ? 'translateX(-50%) translateY(9px) scale(1.16,0.78) skewX(-7deg)'
                    : 'translateX(-50%) translateY(-1px) scale(1.02,1.03) skewX(0deg)',
                  transition: 'bottom 880ms cubic-bezier(0.23, 1, 0.32, 1), transform 880ms cubic-bezier(0.23, 1, 0.32, 1), filter 650ms ease-out',
                }} />
              <div aria-hidden="true" className="absolute left-[58%] text-xl"
                style={{
                  bottom: ryuVictoryPose === 'guard' ? '23px' : '89px',
                  opacity: ryuVictoryPose === 'guard' ? 0 : 1,
                  transform: `translateX(-50%) scale(${ryuVictoryPose === 'guard' ? 0.72 : 1.16})`,
                  filter: 'drop-shadow(0 0 10px #ff5a00)',
                  transition: 'bottom 780ms cubic-bezier(0.23, 1, 0.32, 1), opacity 260ms ease-out 460ms, transform 520ms cubic-bezier(0.23, 1, 0.32, 1) 330ms',
                }}>✊</div>
              <div className="absolute bottom-9 left-8 h-1.5 w-14 -rotate-6 rounded-full bg-orange-100/80 shadow-[0_0_12px_#ff5a00]" />
              <div className="absolute bottom-9 right-7 h-1.5 w-14 rotate-[-16deg] rounded-full bg-orange-100/75 shadow-[0_0_12px_#ff5a00]" />
              <span className="absolute bottom-1 left-0 right-0 text-center text-[9px] font-black tracking-[0.25em] text-orange-200">
                {ryuVictoryPose === 'guard' ? 'LOW GUARD' : 'DRAGON RISE'}
              </span>
            </div>
          ) : (
            <>
              <div className="text-2xl">{wMeta.winPose}</div>
              <img src={winnerImg} alt={winnerName}
                className="w-28 h-28 object-cover rounded-full border-4"
                style={{ borderColor: winnerColor, boxShadow: `0 0 24px ${winnerColor}` }} />
            </>
          )}
          <div className="font-black text-sm tracking-widest" style={{ color: winnerColor }}>{winnerName}</div>
          <div className="text-white/80 text-xs italic text-center max-w-[140px]">{wMeta.winLine}</div>
        </div>
        <div className="font-black text-2xl text-white/30 pb-8">VS</div>
        <div className="flex flex-col items-center gap-2 flex-1 opacity-50">
          <div className="text-2xl">💀</div>
          <img src={loserImg} alt={loserName}
            className="w-20 h-20 object-cover rounded-full border-4 grayscale"
            style={{ borderColor: "#555" }} />
          <div className="font-black text-sm tracking-widest text-white/60">{loserName}</div>
          <div className="text-white/50 text-xs italic text-center max-w-[140px]">{lMeta.loseLine}</div>
        </div>
      </div>
      <div className="flex gap-4 mt-2">
        <button type="button" onClick={onRematch}
          className="px-8 py-3 font-black text-lg tracking-widest text-white rounded-lg uppercase hover:scale-105 active:scale-95 transition-all cursor-pointer"
          style={{ background: `linear-gradient(135deg,${winnerColor},#ef4444)`, boxShadow: `0 0 20px ${winnerColor}` }}>
          REMATCH
        </button>
        <button type="button" onClick={onSelect}
          className="px-8 py-3 font-black text-lg tracking-widest text-white rounded-lg uppercase hover:scale-105 active:scale-95 transition-all cursor-pointer"
          style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
          CHAR SELECT
        </button>
      </div>
    </div>
  );
}

// ── On-screen Touch Controller ────────────────────────────────
function TouchPad({ engineRef, scale: _scale, paused }: { engineRef: React.RefObject<GameEngine | null>; scale: number; paused: boolean }) {
  const press = (action: string, down: boolean) => {
    if (paused) return;
    const eng = engineRef.current;
    if (!eng) return;
    const p1 = eng.p1;
    if (!p1) return;
    if (action === 'left')  { if (down) p1.moveLeft(0.016); else if (p1.state === 'walk') p1.state = 'idle'; }
    if (action === 'right') { if (down) p1.moveRight(0.016); else if (p1.state === 'walk') p1.state = 'idle'; }
    if (action === 'jump'  && down) p1.jump();
    if (action === 'punch' && down) p1.punch();
    if (action === 'kick'  && down) p1.kick();
    if (action === 'block') { if (down) p1.startBlock(); else p1.stopBlock(); }
  };
  const btn = (label: string, action: string, cls = '') => (
    <button type="button" aria-label={label}
      onPointerDown={e => { e.preventDefault(); press(action, true); }}
      onPointerUp={e => { e.preventDefault(); press(action, false); }}
      onPointerLeave={e => { e.preventDefault(); press(action, false); }}
      className={`select-none touch-none font-black text-white rounded-full flex items-center justify-center cursor-pointer active:scale-90 transition-transform ${cls}`}
      style={{ background: 'rgba(255,255,255,0.12)', border: '2px solid rgba(255,255,255,0.25)' }}>
      {label}
    </button>
  );
  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 flex justify-between items-end px-4 pb-4">
      <div className="flex flex-col items-center gap-1">
        <div className="flex justify-center">{btn('↑', 'jump', 'w-12 h-12 text-lg')}</div>
        <div className="flex gap-1">{btn('←', 'left', 'w-12 h-12 text-lg')}<div className="w-12 h-12" />{btn('→', 'right', 'w-12 h-12 text-lg')}</div>
        <div className="flex justify-center">{btn('🛡', 'block', 'w-12 h-12 text-lg')}</div>
      </div>
      <div className="flex flex-col items-end gap-2">
        {btn('KICK', 'kick', 'w-16 h-12 text-sm')}
        {btn('PUNCH', 'punch', 'w-16 h-12 text-sm')}
      </div>
    </div>
  );
}

export default function FighterGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const soundRef  = useRef<SoundManager | null>(null);
  const hudRaf    = useRef<number>(0);
  const previousEnergy = useRef({ p1: 0, p2: 0 });

  const [screen, setScreen] = useState<'select' | 'fight'>('select');
  const [gameOver, setGameOver] = useState<GameState | null>(null);
  const [scale, setScale] = useState(1);
  const [p1Data, setP1Data] = useState<HUDData | null>(null);
  const [p2Data, setP2Data] = useState<HUDData | null>(null);
  const [roundTime, setRoundTime] = useState(99);
  const [modeLabel, setModeLabel] = useState('');
  const [currentMode, setCurrentMode] = useState<GameMode>('cpu');
  const [isPaused, setIsPaused] = useState(false);
  const [showPauseControls, setShowPauseControls] = useState(false);
  const [energyGains, setEnergyGains] = useState<{ p1?: { tick: number; amount: number }; p2?: { tick: number; amount: number } }>({});

  // Share link state
  const [showShare, setShowShare] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Loading state
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // Select screen music
  const selectMusicRef = useRef<HTMLAudioElement | null>(null);

  const handleSelectVoice = useCallback((url: string) => {
    const music = selectMusicRef.current;
    if (music) {
      music.volume = 0.03; // duck to nearly silent
      const a = new Audio(url);
      a.volume = 1.0;
      a.play().catch(() => {});
      a.onended = () => {
        // Fade music back up to 0.15 over ~400ms
        let v = 0.03;
        const step = () => {
          v = Math.min(v + 0.015, 0.15);
          if (selectMusicRef.current) selectMusicRef.current.volume = v;
          if (v < 0.15) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      };
    } else {
      const a = new Audio(url);
      a.volume = 1.0;
      a.play().catch(() => {});
    }
  }, []);

  // Pending fight config — set before screen switch so canvas is mounted
  const pendingFight = useRef<{ p1Key: string; p2Key: string; mode: GameMode } | null>(null);

  // Audio suspended state (PS5 USB-C route change)
  const [audioSuspended, setAudioSuspended] = useState(false);

  // Touch controller input state (shared with GameEngine via injection)
  const touchState = useRef({ left: false, right: false, up: false, block: false, punch: false, kick: false });

  useEffect(() => {
    const resize = () => {
      const widthFit = window.innerWidth / CANVAS_WIDTH;
      const heightFit = window.innerHeight / CANVAS_HEIGHT;
      const portrait = window.innerHeight > window.innerWidth * 1.15;
      // In portrait, crop the side edges rather than shrinking the two fighters
      // into a thin strip. The engine camera keeps the actual exchange centered.
      const fightScale = portrait
        ? Math.min(1.12, Math.max(widthFit, heightFit * 0.96))
        : Math.min(widthFit, heightFit, 1);
      setScale(fightScale);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Poll for audio suspension every 1.5s (PS5 USB-C audio route change)
  useEffect(() => {
    if (screen !== 'fight') return;
    const id = setInterval(() => {
      const sm = soundRef.current as any;
      const ctx = sm?.ctx as AudioContext | null;
      setAudioSuspended(!!ctx && ctx.state === 'suspended');
    }, 1500);
    return () => clearInterval(id);
  }, [screen]);

  const restoreAudio = () => {
    const sm = soundRef.current as any;
    sm?.ctx?.resume().catch(() => {});
    setAudioSuspended(false);
  };

  const togglePause = useCallback(() => {
    const paused = engineRef.current?.togglePause();
    if (typeof paused === 'boolean') {
      setIsPaused(paused);
      setShowPauseControls(false);
    }
  }, []);

  useEffect(() => {
    if (screen !== 'fight') return;
    const onKeyDown = (event: KeyboardEvent) => {
      // P remains Player 2's special-move control in local versus mode.
      const canUsePForPause = currentMode !== 'pvp';
      if (event.repeat || (event.code !== 'Escape' && !(event.code === 'KeyP' && canUsePForPause))) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      togglePause();
    };
    window.addEventListener('keydown', onKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', onKeyDown, { capture: true });
  }, [screen, currentMode, togglePause]);

  useEffect(() => {
    if (screen === 'select') {
      // Create audio element immediately but play on first user interaction
      const audio = new Audio('https://fightergame-j95rkwu8.manus.space/manus-storage/select-music_e27b765f.mp3');
      audio.loop = true;
      audio.volume = 0.15;
      selectMusicRef.current = audio;
      // Try immediate play (works if user already interacted)
      const tryPlay = () => {
        audio.play().catch(() => {
          // Autoplay blocked — wait for any user interaction
          const resume = () => {
            audio.play().catch(() => {});
            document.removeEventListener('click', resume);
            document.removeEventListener('keydown', resume);
            document.removeEventListener('touchstart', resume);
          };
          document.addEventListener('click', resume, { once: true });
          document.addEventListener('keydown', resume, { once: true });
          document.addEventListener('touchstart', resume, { once: true });
        });
      };
      const tid = window.setTimeout(tryPlay, 100);
      return () => {
        window.clearTimeout(tid);
        selectMusicRef.current?.pause();
        selectMusicRef.current = null;
      };
    } else {
      selectMusicRef.current?.pause();
      selectMusicRef.current = null;
    }
  }, [screen]);

  // Once screen switches to 'fight', canvas is now mounted — start engine
  useEffect(() => {
    if (screen !== 'fight') return;
    const cfg = pendingFight.current;
    if (!cfg) return;
    pendingFight.current = null;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Stop select music
    selectMusicRef.current?.pause();

    // The sound manager was created directly by the FIGHT button gesture.
    // This effect only resumes it after the canvas mounts.
    if (!soundRef.current) {
      const sm = new SoundManager();
      soundRef.current = sm;
      sm.init().catch(e => console.warn('[FighterGame] SoundManager init error:', e));
    } else {
      soundRef.current.resume();
    }

    const p1Cfg: FighterConfig = {
      ...(CHARS[cfg.p1Key] as Omit<FighterConfig,'id'|'startX'|'facingRight'>),
      id: 1, startX: 270, facingRight: true,
    };
    const p2Cfg: FighterConfig = {
      ...(CHARS[cfg.p2Key] as Omit<FighterConfig,'id'|'startX'|'facingRight'>),
      id: 2, startX: 878, facingRight: false,
    };

    const eng = new GameEngine(canvas, p1Cfg, p2Cfg, BG_URL, cfg.mode, soundRef.current!);
    eng.onStateChange = (s) => {
      setGameOver(s);
      setIsPaused(false);
      cancelAnimationFrame(hudRaf.current);
    };
    engineRef.current = eng;
    eng.start();
    // Development-only showcase: captures the staged Shuraku grapple for visual verification.
    const params = new URLSearchParams(window.location.search);
    if (params.get('showcase') === 'grapple' && cfg.p1Key === 'shuraku') {
      window.setTimeout(() => {
        eng.p1.x = 500;
        eng.p2.x = 625;
        eng.p1.facingRight = true;
        eng.p2.facingRight = false;
        eng.p1.grab(eng.p2);
      }, 80);
    }
    if (params.get('showcase') === 'slam' && cfg.p1Key === 'galva') {
      window.setTimeout(() => {
        eng.p1.x = 500;
        eng.p2.x = 650;
        eng.p1.facingRight = true;
        eng.p2.facingRight = false;
        eng.p1.boostActive = true;
        eng.p1.boostTimer = 2;
        eng.p1.activateGroundSlam();
      }, 80);
    }
    if (params.get('showcase') === 'ryu-win' && cfg.p1Key === 'ryu') {
      window.setTimeout(() => {
        eng.p2.health = 0;
        (eng as any).endRound?.();
      }, 180);
    }
    setGameOver(null);
    setIsPaused(false);
    setShowPauseControls(false);
    previousEnergy.current = { p1: 0, p2: 0 };
    setEnergyGains({});
    setCurrentMode(cfg.mode);
    setModeLabel(cfg.mode === 'cpu' ? 'VS CPU' : cfg.mode === 'cvc' ? 'SPECTATOR' : 'VS PLAYER');
    hudRaf.current = requestAnimationFrame(pollHUD);
    setLoading(false);
    setLoadProgress(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  const pollHUD = useCallback(() => {
    const eng = engineRef.current;
    if (!eng) return;
    const mk = (f: typeof eng.p1): HUDData => ({
      name: f.name, title: f.title, health: f.health, energy: f.energy,
      maxHealth: f.maxHealth, boostActive: f.boostActive, boostTimer: f.boostTimer, boostCooldown: f.boostCooldown,
      consecutiveHits: f.consecutiveHits,
      color: f.color, energyColor: f.energyColor, iconUrl: f.iconUrl,
      comboCount: f.id === 1 ? (eng as any).p1ComboCount ?? 0 : (eng as any).p2ComboCount ?? 0,
      hitFlash: f.hitFlash,
    });
    const nextP1 = mk(eng.p1);
    const nextP2 = mk(eng.p2);
    const p1Gain = nextP1.boostActive ? 0 : nextP1.energy - previousEnergy.current.p1;
    const p2Gain = nextP2.boostActive ? 0 : nextP2.energy - previousEnergy.current.p2;
    if (p1Gain > 0 || p2Gain > 0) {
      const tick = performance.now();
      setEnergyGains(prev => ({
        p1: p1Gain > 0 ? { tick, amount: Math.round(p1Gain) } : prev.p1,
        p2: p2Gain > 0 ? { tick, amount: Math.round(p2Gain) } : prev.p2,
      }));
    }
    previousEnergy.current = { p1: nextP1.energy, p2: nextP2.energy };
    setP1Data(nextP1);
    setP2Data(nextP2);
    setRoundTime(Math.ceil(eng.roundTimer));
    hudRaf.current = requestAnimationFrame(pollHUD);
  }, []);

  const startFight = useCallback(async (p1Key: string, p2Key: string, mode: GameMode) => {
    engineRef.current?.stop();
    cancelAnimationFrame(hudRaf.current);
    // Stop select music immediately on fight start
    selectMusicRef.current?.pause();
    selectMusicRef.current = null;

    // Create and prime the small approved reaction set inside the FIGHT gesture.
    if (!soundRef.current) {
      const sm = new SoundManager();
      soundRef.current = sm;
      void sm.init().catch(e => console.warn('[FighterGame] SoundManager init error:', e));
    }
    soundRef.current.resume();

    // Show loading bar, store config, then switch screen so canvas mounts
    setLoading(true);
    setLoadProgress(0);
    pendingFight.current = { p1Key, p2Key, mode };
    setIsPaused(false);
    setShowPauseControls(false);

    // Animate loading bar over ~600ms then switch screen
    let p = 0;
    const tick = () => {
      p = Math.min(p + (Math.random() * 18 + 8), 95);
      setLoadProgress(p);
      if (p < 95) setTimeout(tick, 60);
      else {
        setLoadProgress(100);
        setTimeout(() => setScreen('fight'), 120);
      }
    };
    setTimeout(tick, 60);
  }, [pollHUD]);

  // Deterministic visual test route used only by ?demo screenshots. Adding
  // ?demo=kai, ?demo=shuraku, or ?demo=galva opens that fighter versus Akari for effect verification.
  const demoStarted = useRef(false);
  useEffect(() => {
    const demoParam = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('demo') : null;
    const isDemo = demoParam !== null;
    if (!isDemo || screen !== 'select' || demoStarted.current) return;
    demoStarted.current = true;
    const fighter = demoParam === 'kai' || demoParam === 'shuraku' || demoParam === 'galva' ? demoParam : 'ryu';
    const showcase = new URLSearchParams(window.location.search).get('showcase');
    const timer = window.setTimeout(() => startFight(fighter, 'akari', showcase ? 'pvp' : 'cvc'), 30);
    return () => window.clearTimeout(timer);
  }, [screen, startFight]);

  const backToSelect = useCallback(() => {
    engineRef.current?.stop();
    cancelAnimationFrame(hudRaf.current);
    // Fully dispose sound engine so wind/ambient stops cleanly
    soundRef.current?.dispose();
    soundRef.current = null;
    engineRef.current = null;
    setScreen('select');
    setGameOver(null);
    setLoading(false);
    setLoadProgress(0);
    setIsPaused(false);
    setShowPauseControls(false);
  }, []);

  useEffect(() => () => {
    engineRef.current?.stop();
    soundRef.current?.dispose();
    cancelAnimationFrame(hudRaf.current);
  }, []);

  if (screen === 'select') {
    return (
      <>
        <CharSelect onSelect={startFight} />
        {/* Loading overlay — shown while transitioning to fight */}
        {loading && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none"
            style={{ background: 'rgba(10,5,0,0.75)' }}>
            <p className="text-amber-400 font-black text-lg tracking-widest mb-4 uppercase">
              Preparing Fight...
            </p>
            <div className="w-64 h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-75"
                style={{
                  width: `${loadProgress}%`,
                  background: 'linear-gradient(90deg, #f59e0b, #ef4444)',
                  boxShadow: '0 0 10px #f59e0b',
                }} />
            </div>
            <p className="text-white/30 text-xs mt-2">{Math.round(loadProgress)}%</p>
          </div>
        )}
      </>
    );
  }

  const winnerName = gameOver?.winner === 1 ? p1Data?.name : gameOver?.winner === 2 ? p2Data?.name : null;

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#0a0500' }}>

      {/* HUD */}
      {p1Data && p2Data && (
        <div className="absolute top-0 z-10 flex items-start gap-3 px-3 pt-2"
          style={{ width: `min(${CANVAS_WIDTH * scale}px, 100vw)`, left: '50%', transform: 'translateX(-50%)' }}>
          <div className="flex-1"><FighterHUD d={p1Data} energyGain={energyGains.p1} /></div>
          <div className="flex flex-col items-center min-w-[56px] pt-1">
            <div className="text-white font-black text-3xl tabular-nums"
              style={{ fontFamily: "'Bebas Neue',sans-serif", textShadow: '0 0 20px #f59e0b' }}>
              {roundTime}
            </div>
            <div className="text-amber-400 text-[9px] font-bold tracking-widest">{modeLabel}</div>
          </div>
          <div className="flex-1"><FighterHUD d={p2Data} flip energyGain={energyGains.p2} /></div>
        </div>
      )}

      {/* Combo counter overlays */}
      {p1Data && p1Data.comboCount >= 2 && (
        <div className="absolute z-20 pointer-events-none"
          style={{ left: `calc(50% - ${CANVAS_WIDTH * scale / 2}px + ${40 * scale}px)`, top: `${120 * scale}px` }}>
          <div className="font-black text-center animate-bounce"
            style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: `${Math.min(2.2, 1.2 + p1Data.comboCount * 0.1) * scale}rem`,
              color: p1Data.energyColor, textShadow: `0 0 20px ${p1Data.energyColor}, 0 2px 4px #000` }}>
            {p1Data.comboCount}-HIT COMBO!
          </div>
        </div>
      )}
      {p2Data && p2Data.comboCount >= 2 && (
        <div className="absolute z-20 pointer-events-none"
          style={{ right: `calc(50% - ${CANVAS_WIDTH * scale / 2}px + ${40 * scale}px)`, top: `${120 * scale}px` }}>
          <div className="font-black text-center animate-bounce"
            style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: `${Math.min(2.2, 1.2 + p2Data.comboCount * 0.1) * scale}rem`,
              color: p2Data.energyColor, textShadow: `0 0 20px ${p2Data.energyColor}, 0 2px 4px #000` }}>
            {p2Data.comboCount}-HIT COMBO!
          </div>
        </div>
      )}

      {/* Canvas — outer box participates in layout at the scaled size; the inner
          stage retains the fixed logical resolution for the game engine. */}
      <div style={{ width: CANVAS_WIDTH * scale, height: CANVAS_HEIGHT * scale, position: 'relative', flex: '0 0 auto' }}>
        <div style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT, position: 'absolute', left: 0, top: 0, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="block" />

          {/* Match pause overlay — the engine keeps the rendered frame and every simulation system frozen. */}
          {isPaused && !gameOver && (
            <div className="absolute inset-0 z-30 flex items-center justify-center p-5"
              style={{ background: 'rgba(8,4,14,0.78)', backdropFilter: 'blur(3px)' }}>
              <div className="w-full max-w-sm border border-amber-300/50 px-6 py-7 text-center shadow-2xl"
                style={{ background: 'linear-gradient(145deg, rgba(40,15,8,0.96), rgba(21,8,36,0.98))', boxShadow: '0 0 36px rgba(245,158,11,0.35)' }}>
                <p className="text-amber-300 text-xs font-black tracking-[0.35em]">DRAGON FIST X</p>
                <h2 className="mt-2 text-5xl font-black tracking-widest text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>PAUSED</h2>
                <p className="mt-2 text-xs text-white/60">Match clock, AI, fighters, attacks, projectiles, and effects are frozen.</p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button type="button" onClick={togglePause} className="col-span-2 px-5 py-3 font-black tracking-widest text-white transition-transform hover:scale-[1.02] active:scale-95"
                    style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)', boxShadow: '0 0 18px #f59e0b77' }}>RESUME</button>
                  <button type="button" onClick={() => { soundRef.current?.stopAllAudio?.(); engineRef.current?.start(); setIsPaused(false); hudRaf.current = requestAnimationFrame(pollHUD); }}
                    className="px-3 py-3 font-black text-xs tracking-widest text-white border border-white/20 hover:bg-white/10">RESTART</button>
                  <button type="button" onClick={backToSelect}
                    className="px-3 py-3 font-black text-xs tracking-widest text-white border border-white/20 hover:bg-white/10">SELECT</button>
                  <button type="button" onClick={() => setShowPauseControls(v => !v)}
                    className="col-span-2 px-3 py-3 font-black text-xs tracking-widest text-amber-200 border border-amber-300/35 hover:bg-amber-100/10">CONTROLS</button>
                </div>
                {showPauseControls && (
                  <div className="mt-4 border-t border-white/15 pt-4 text-left text-[11px] leading-5 text-white/75">
                    <p><b className="text-white">Pause:</b> Esc, or P outside Player-versus-Player mode</p>
                    <p><b className="text-white">P1:</b> A/D move, W jump, S block, F punch, G kick, E special</p>
                    <p><b className="text-white">P2:</b> ←/→ move, ↑ jump, ↓ block, L punch, K kick, P special</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Game Over overlay */}
          {gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center"
              style={{ background: 'rgba(10,5,0,0.82)' }}>
              {winnerName ? (
                <VictoryScreen
                  winnerName={winnerName}
                  winnerKey={gameOver.winner === 1 ? (p1Data?.name.toLowerCase() ?? 'ryu') : (p2Data?.name.toLowerCase() ?? 'akari')}
                  loserName={gameOver.winner === 1 ? p2Data?.name ?? '' : p1Data?.name ?? ''}
                  loserKey={gameOver.winner === 1 ? (p2Data?.name.toLowerCase() ?? 'akari') : (p1Data?.name.toLowerCase() ?? 'ryu')}
                  winnerImg={gameOver.winner === 1 ? (p1Data?.iconUrl ?? '') : (p2Data?.iconUrl ?? '')}
                  loserImg={gameOver.winner === 1 ? (p2Data?.iconUrl ?? '') : (p1Data?.iconUrl ?? '')}
                  onRematch={() => {
                    soundRef.current?.stopAllAudio?.();
                    engineRef.current?.start?.();
                    setGameOver(null);
                    hudRaf.current = requestAnimationFrame(pollHUD);
                  }}
                  onSelect={backToSelect}
                />
              ) : (
                <div className="text-center">
                  <div className="font-black text-6xl text-white mb-6" style={{ fontFamily: "'Bebas Neue',sans-serif", textShadow: '0 0 40px #f59e0b' }}>DRAW!</div>
                  <div className="flex gap-4 justify-center">
                    <button type="button" onClick={() => {
                        soundRef.current?.stopAllAudio?.();
                        engineRef.current?.start?.();
                        setGameOver(null);
                        hudRaf.current = requestAnimationFrame(pollHUD);
                      }}
                      className="px-8 py-3 font-black text-lg tracking-widest text-white rounded-lg uppercase hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)', boxShadow: '0 0 20px #f59e0b' }}>REMATCH</button>
                    <button type="button" onClick={backToSelect}
                      className="px-8 py-3 font-black text-lg tracking-widest text-white rounded-lg uppercase hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>CHAR SELECT</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>


      {/* Audio suspended warning */}
      {audioSuspended && (
        <button type="button" onClick={restoreAudio}
          className="absolute top-2 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 rounded-full font-bold text-xs text-black cursor-pointer animate-bounce"
          style={{ background: '#f59e0b', boxShadow: '0 0 12px #f59e0b' }}>
          🔇 Audio paused — tap to restore
        </button>
      )}

      {/* A pause control is always available, including spectator mode and mobile layouts. */}
      <button type="button" aria-label={isPaused ? 'Resume game' : 'Pause game'} onClick={togglePause}
        className="absolute right-3 top-20 z-30 flex h-11 min-w-11 items-center justify-center rounded-full border border-white/35 bg-black/65 px-3 font-black text-white shadow-lg active:scale-90"
        style={{ boxShadow: '0 0 14px rgba(245,158,11,0.45)' }}>
        {isPaused ? '▶' : 'Ⅱ'}
      </button>

      {/* On-screen touch controller — hidden in Spectator Mode */}
      {currentMode !== 'cvc' && <TouchPad engineRef={engineRef} scale={scale} paused={isPaused} />}

      {/* Bottom bar */}
      <div className="absolute bottom-2 flex items-center gap-4 text-[11px] text-amber-700 hidden sm:flex">
        <span>P1: WASD+F/G/S &nbsp;|&nbsp; P2: Arrows+L/K/↓ &nbsp;|&nbsp; ⚡ Max energy = 2× damage (15s)</span>
        <button onClick={() => setShowShare(v => !v)}
          type="button"
          aria-label="Share game link"
          aria-expanded={showShare}
          className="text-amber-500 hover:text-amber-300 font-bold transition-colors cursor-pointer">
          🔗 Share Link
        </button>
      </div>

      {/* Share modal */}
      {showShare && (
        <div className="absolute inset-0 flex items-center justify-center z-20"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          role="dialog"
          aria-modal="true"
          aria-label="Share game link dialog"
          onClick={() => setShowShare(false)}
        >
          <div className="bg-zinc-900 border border-amber-500/30 rounded-xl p-6 max-w-md w-full mx-4"
            onClick={e => e.stopPropagation()}>
            <h2 className="text-white font-black text-xl mb-2">⚔️ Dragon Fist X — Challenge a Friend</h2>
            <p className="text-white/60 text-sm mb-4">Share this link — both players open it on the same device (keyboard) or use two controllers on the same browser.</p>
            <div className="flex gap-2">
              <input readOnly value={shareUrl}
                aria-label="Game share URL"
                className="flex-1 bg-black/50 text-white text-xs px-3 py-2 rounded border border-white/10 select-all" />
              <button onClick={() => { navigator.clipboard.writeText(shareUrl); }}
                type="button"
                aria-label="Copy share link to clipboard"
                className="px-4 py-2 bg-amber-500 text-black font-black text-xs rounded hover:bg-amber-400 transition-colors cursor-pointer">
                COPY
              </button>
            </div>
            <p className="text-white/40 text-xs mt-3">💡 For true online PvP, a backend multiplayer server would be needed — this demo supports local 2-player on one device.</p>
          </div>
        </div>
      )}
    </div>
  );
}
