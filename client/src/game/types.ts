export type FighterState =
  | 'idle' | 'walk' | 'jump' | 'airpunch' | 'airkick'
  | 'dash' | 'backdash' | 'backjump'
  | 'punch' | 'kick' | 'roundhouse' | 'sweep'
  | 'charge'
  | 'block' | 'hit' | 'launch' | 'airborne'
  | 'ko' | 'dead'
  | 'prone'          // knocked down — immune to damage, gets up after 3s or on X
  | 'special'       // generic special move state
  | 'barrier'       // Shuraku shadow barrier
  | 'grab'          // Shuraku grab state
  | 'grabbed'       // target being grabbed
  | 'thrown'        // target flying after throw
  | 'teleport';     // Galva lightning teleport

export interface FighterConfig {
  id: 1 | 2;
  name: string;
  title: string;
  color: string;
  energyColor: string;
  spriteUrl: string;
  iconUrl: string;
  startX: number;
  facingRight: boolean;
  // ── Per-character stats (optional, fall back to defaults) ──
  maxHealth?: number;         // default 100
  punchDamageBonus?: number;  // added to base punch damage
  kickDamageBonus?: number;
  moveSpeedMult?: number;     // 1.0 = normal
  jumpVelocityMult?: number;
  boostDuration?: number;     // override global BOOST_DURATION
  boostInfinite?: boolean;    // Galva: boost never expires
  // ── Abilities ──────────────────────────────────────────────
  hasLightningBlast?: boolean;   // Galva
  hasShadowBarrier?: boolean;    // Shuraku
  hasAerialKick?: boolean;       // Kai
  hasTornado?: boolean;          // Kai
  hasGrab?: boolean;             // Shuraku
  hasLightningBarrier?: boolean; // Galva auto-barrier
  hasTeleport?: boolean;          // Galva lightning teleport
  hasIcarusStyle?: boolean;       // Ryu: Icarus guard stance, flame trails, signature finishers
  hasAphroditeStyle?: boolean;    // Akari: evasive stance, petal energy, spinning finishers
  hasTempestStyle?: boolean;      // Kai: precision martial-artist stance, counter guard, wind finishers
  hasDominionStyle?: boolean;     // Shuraku: composed powerhouse stance and shadow-pressure presentation
}

export interface GameState {
  running: boolean;
  winner: 0 | 1 | 2;
}

export type GameMode = 'pvp' | 'cpu' | 'cvc';
