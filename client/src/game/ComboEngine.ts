// ── ComboEngine — tracks input history and fires character-specific combos ──
import type { Fighter } from './Fighter';

export type ComboInput = 'punch' | 'kick' | 'jump' | 'roundhouse' | 'sweep' | 'punch_landed' | 'kick_landed';

interface ComboStep {
  type: 'punch' | 'kick' | 'roundhouse' | 'sweep' | 'airpunch' | 'airkick' | 'grab';
  delay: number;       // seconds before this step fires
  damage?: number;     // override damage
  vxBoost?: number;    // horizontal velocity to apply
  vyBoost?: number;    // vertical velocity to apply
  label?: string;      // for debugging
}

interface ComboPattern {
  name: string;
  inputs: ComboInput[];   // sequence that triggers this combo
  windowMs: number;       // time window between inputs
  steps: ComboStep[];
  requiresGround?: boolean;
  requiresAir?: boolean;
}

// ── Per-character combo definitions ──────────────────────────────────────────
const COMBOS: Record<string, ComboPattern[]> = {
  ryu: [
    {
      name: 'icarus-one-two',
      inputs: ['punch', 'punch'],
      windowMs: 500,
      requiresGround: true,
      steps: [
        { type: 'punch', delay: 0,    damage: 2, label: 'Icarus lead hand' },
        { type: 'punch', delay: 0.16, damage: 3, label: 'Icarus cross' },
      ],
    },
    {
      name: 'phoenix-heel',
      inputs: ['kick', 'kick'],
      windowMs: 500,
      requiresGround: true,
      steps: [
        { type: 'kick', delay: 0,    damage: 3, label: 'phoenix heel' },
        { type: 'roundhouse', delay: 0.20, damage: 5, label: 'burning roundhouse' },
      ],
    },
    {
      name: 'icarus-rush',
      inputs: ['punch', 'punch', 'kick'],
      windowMs: 600,
      requiresGround: true,
      steps: [
        { type: 'punch', delay: 0,    damage: 2, label: 'lead jab' },
        { type: 'punch', delay: 0.14, damage: 3, label: 'driving cross' },
        { type: 'roundhouse', delay: 0.18, damage: 6, label: 'Skybreaker finish' },
      ],
    },
    {
      name: 'ash-fall',
      inputs: ['kick', 'punch', 'kick'],
      windowMs: 600,
      requiresGround: true,
      steps: [
        { type: 'kick',  delay: 0,    damage: 3, label: 'low heel' },
        { type: 'punch', delay: 0.17, damage: 2, label: 'body cross' },
        { type: 'sweep', delay: 0.18, damage: 4, label: 'Ashen Sweep' },
      ],
    },
    {
      name: 'jumping-kick',
      inputs: ['jump', 'kick'],
      windowMs: 800,
      requiresAir: true,
      steps: [
        { type: 'airkick', delay: 0, vyBoost: -80, label: 'jumping kick' },
      ],
    },
  ],
  akari: [
    {
      name: 'venus-turn',
      inputs: ['kick', 'kick'],
      windowMs: 500,
      requiresGround: true,
      steps: [
        { type: 'kick',       delay: 0,    damage: 3, label: 'petal step' },
        { type: 'roundhouse', delay: 0.18, damage: 5, label: 'Venus Turn' },
      ],
    },
    {
      name: 'aphrodite-waltz',
      inputs: ['punch', 'kick', 'kick'],
      windowMs: 700,
      requiresGround: true,
      steps: [
        { type: 'punch',     delay: 0,    damage: 2, label: 'rose jab' },
        { type: 'kick',      delay: 0.15, damage: 3, label: 'silk knee' },
        { type: 'roundhouse',delay: 0.18, damage: 6, label: 'Aphrodite Waltz finish' },
      ],
    },
    {
      name: 'ribbon-fall',
      inputs: ['punch', 'punch', 'kick', 'kick'],
      windowMs: 600,
      requiresGround: true,
      steps: [
        { type: 'punch', delay: 0,    damage: 2, label: 'right hook' },
        { type: 'punch', delay: 0.12, damage: 2, label: 'left jab' },
        { type: 'kick',  delay: 0.14, damage: 3, label: 'ribbon heel' },
        { type: 'sweep', delay: 0.18, damage: 4, label: 'Silk Sweep' },
      ],
    },
    {
      name: 'rose-reversal',
      inputs: ['kick', 'punch', 'kick'],
      windowMs: 600,
      requiresGround: true,
      steps: [
        { type: 'kick',  delay: 0,    damage: 3, label: 'checking kick' },
        { type: 'punch', delay: 0.14, damage: 2, label: 'turning palm' },
        { type: 'roundhouse', delay: 0.18, damage: 6, label: 'Rose Reversal finish' },
      ],
    },
    {
      name: 'rose-pair',
      inputs: ['punch', 'punch'],
      windowMs: 450,
      requiresGround: true,
      steps: [
        { type: 'punch', delay: 0,    damage: 2, label: 'rose lead' },
        { type: 'punch', delay: 0.14, damage: 3, label: 'rose cross' },
      ],
    },
  ],
  kai: [
    {
      name: 'tempest-eightfold',
      inputs: ['punch', 'punch', 'punch', 'kick'],
      windowMs: 700,
      requiresGround: true,
      steps: [
        { type: 'punch',    delay: 0,    label: 'wind-line jab' },
        { type: 'punch',    delay: 0.12, label: 'crosswind straight' },
        { type: 'punch',    delay: 0.12, label: 'turning palm' },
        { type: 'airkick',  delay: 0.17, damage: 5, vyBoost: -120, label: 'tempest crescent' },
      ],
    },
    {
      name: 'reed-breaker',
      inputs: ['punch', 'punch', 'kick'],
      windowMs: 600,
      requiresGround: true,
      steps: [
        { type: 'punch', delay: 0,    label: 'measured lead' },
        { type: 'punch', delay: 0.13, label: 'shoulder feint' },
        { type: 'sweep', delay: 0.18, damage: 3, label: 'reed-breaker sweep' },
      ],
    },
    {
      name: 'wind-rider',
      inputs: ['jump', 'kick'],
      windowMs: 800,
      requiresAir: true,
      steps: [
        { type: 'airkick', delay: 0, damage: 5, vyBoost: -60, label: 'wind-rider axe kick' },
      ],
    },
    {
      name: 'cyclone-wheel',
      inputs: ['kick', 'kick'],
      windowMs: 500,
      requiresGround: true,
      steps: [
        { type: 'kick', delay: 0,    label: 'side cut' },
        { type: 'kick', delay: 0.18, damage: 5, label: 'cyclone wheel' },
      ],
    },
    {
      name: 'triple-punch-aerial-roundhouse',
      inputs: ['punch', 'punch_landed', 'punch_landed'],
      windowMs: 700,
      requiresGround: true,
      steps: [
        { type: 'punch',   delay: 0,    label: 'punch 1' },
        { type: 'punch',   delay: 0.15, label: 'punch 2' },
        { type: 'punch',   delay: 0.15, label: 'punch 3' },
        { type: 'airkick', delay: 0.20, damage: 7, vyBoost: -200, label: 'aerial roundhouse' },
      ],
    },
  ],
  galva: [
    {
      name: 'galva-signature',
      inputs: ['punch', 'kick'],
      windowMs: 500,
      requiresGround: true,
      steps: [
        { type: 'punch',     delay: 0,    damage: 3, label: 'heavy straight' },
        { type: 'roundhouse',delay: 0.22, damage: 5, label: 'lightning knee' },
      ],
    },
    {
      name: 'galva-sweep',
      inputs: ['punch', 'punch', 'kick'],
      windowMs: 600,
      requiresGround: true,
      steps: [
        { type: 'punch', delay: 0,    damage: 3, label: 'jab 1' },
        { type: 'punch', delay: 0.20, damage: 3, label: 'jab 2' },
        { type: 'sweep', delay: 0.22, damage: 3, label: 'sweep' },
      ],
    },
    {
      name: 'lightning-combo',
      inputs: ['punch', 'punch'],
      windowMs: 500,
      requiresGround: true,
      steps: [
        { type: 'punch', delay: 0,    damage: 3, label: 'lightning jab 1' },
        { type: 'punch', delay: 0.20, damage: 3, label: 'lightning jab 2' },
      ],
    },
  ],
  shuraku: [
    {
      name: 'shuraku-signature',
      inputs: ['punch', 'punch', 'kick'],
      windowMs: 600,
      requiresGround: true,
      steps: [
        { type: 'punch', delay: 0,    damage: 2, label: 'shadow jab 1' },
        { type: 'punch', delay: 0.16, damage: 2, label: 'shadow jab 2' },
        { type: 'sweep', delay: 0.20, damage: 3, label: 'shadow sweep' },
      ],
    },
    {
      name: 'grab-throw',
      inputs: ['punch', 'kick'],
      windowMs: 400,
      requiresGround: true,
      steps: [
        { type: 'grab', delay: 0, damage: 1, label: 'grab' },
      ],
    },
  ],
};

export class ComboEngine {
  private inputHistory: { input: ComboInput; time: number }[] = [];
  private queuedSteps: { step: ComboStep; fireAt: number }[] = [];
  private characterName: string;

  constructor(characterName: string) {
    this.characterName = characterName.toLowerCase();
  }

  // Called by GameEngine when player presses punch or kick
  recordInput(input: ComboInput, now: number) {
    this.inputHistory.push({ input, time: now });
    // Keep only last 6 inputs within 1.5 seconds
    const cutoff = now - 1.5;
    this.inputHistory = this.inputHistory.filter(e => e.time > cutoff).slice(-6);
    this.tryMatchCombo(now);
  }

  private tryMatchCombo(now: number) {
    const patterns = COMBOS[this.characterName] ?? [];
    // Try longest patterns first
    const sorted = [...patterns].sort((a, b) => b.inputs.length - a.inputs.length);
    for (const pattern of sorted) {
      if (this.matchesPattern(pattern, now)) {
        this.queueSteps(pattern, now);
        this.inputHistory = []; // consume inputs
        return;
      }
    }
  }

  private matchesPattern(pattern: ComboPattern, now: number): boolean {
    const hist = this.inputHistory;
    const req = pattern.inputs;
    if (hist.length < req.length) return false;
    const tail = hist.slice(-req.length);
    // Check sequence matches
    for (let i = 0; i < req.length; i++) {
      if (tail[i].input !== req[i]) return false;
    }
    // Check timing window
    const span = tail[tail.length - 1].time - tail[0].time;
    return span * 1000 <= pattern.windowMs;
  }

  private queueSteps(pattern: ComboPattern, now: number) {
    let t = now;
    for (const step of pattern.steps) {
      t += step.delay;
      this.queuedSteps.push({ step, fireAt: t });
    }
  }

  // Called every frame — returns steps ready to fire
  update(now: number, fighter: Fighter): ComboStep[] {
    const ready: ComboStep[] = [];
    const remaining: typeof this.queuedSteps = [];
    for (const entry of this.queuedSteps) {
      if (now >= entry.fireAt) {
        ready.push(entry.step);
      } else {
        remaining.push(entry);
      }
    }
    this.queuedSteps = remaining;
    // Cancel queued steps if fighter is stunned or KO'd
    if (fighter.isStunned || fighter.state === 'ko' || fighter.state === 'prone') {
      this.queuedSteps = [];
    }
    return ready;
  }

  hasQueued(): boolean {
    return this.queuedSteps.length > 0;
  }

  clear() {
    this.inputHistory = [];
    this.queuedSteps = [];
  }
}
