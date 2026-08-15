import type { Fighter } from './Fighter';
import { FIGHTER_WIDTH } from './constants';

// ── CPU AI — Budokai 3 style: reactive, dynamic, back-and-forth ──────────────
type Personality = 'ryu' | 'akari' | 'galva' | 'kai' | 'shuraku';

export class CpuAI {
  private personality: Personality;
  private startDelay = 0.7 + Math.random() * 0.6;
  private actionTimer = 0;
  private pauseTimer = 0;
  private blockTimer = 0;
  private comboCount = 0;
  private reactionCooldown = 0;

  constructor(personality: Personality = 'ryu') {
    this.personality = personality;
  }

  reset() {
    this.startDelay = 0.7 + Math.random() * 0.6;
    this.actionTimer = 0; this.pauseTimer = 0;
    this.blockTimer = 0; this.comboCount = 0; this.reactionCooldown = 0;
  }

  update(cpu: Fighter, opp: Fighter, dt: number) {
    if (!cpu.isAlive || !opp.isAlive) return;
    if (this.startDelay > 0) { this.startDelay -= dt; return; }

    this.actionTimer = Math.max(0, this.actionTimer - dt);
    this.pauseTimer  = Math.max(0, this.pauseTimer  - dt);
    this.blockTimer  = Math.max(0, this.blockTimer  - dt);
    this.reactionCooldown = Math.max(0, this.reactionCooldown - dt);

    const dist = Math.abs(cpu.centerX - opp.centerX);
    const goLeft = cpu.centerX > opp.centerX;
    const attackRange = FIGHTER_WIDTH + 100;
    const closeRange  = FIGHTER_WIDTH + 60;

    // ── Reactive block: if opponent is attacking and in range ──────────────
    if (this.reactionCooldown <= 0 && dist < attackRange + 30 && opp.isAttacking) {
      if (Math.random() < this.getReactionChance()) {
        this.blockTimer = 0.18 + Math.random() * 0.12;
        this.reactionCooldown = 0.4 + Math.random() * 0.3;
      }
    }

    // ── Hold block ─────────────────────────────────────────────────────────
    if (this.blockTimer > 0) {
      cpu.startBlock();
      return;
    }
    cpu.stopBlock();

    // ── Natural pause between bursts ───────────────────────────────────────
    if (this.pauseTimer > 0 || cpu.isStunned || cpu.isAttacking) return;

    switch (this.personality) {
      case 'ryu':     this.updateRyu(cpu, opp, dist, attackRange, closeRange, goLeft); break;
      case 'akari':   this.updateAkari(cpu, opp, dist, attackRange, closeRange, goLeft); break;
      case 'galva':   this.updateGalva(cpu, opp, dist, attackRange, closeRange, goLeft); break;
      case 'kai':     this.updateKai(cpu, opp, dist, attackRange, closeRange, goLeft); break;
      case 'shuraku': this.updateShuraku(cpu, opp, dist, attackRange, closeRange, goLeft); break;
    }
  }

  private getReactionChance(): number {
    switch (this.personality) {
      case 'akari':   return 0.72;
      case 'shuraku': return 0.65;
      case 'kai':     return 0.60;
      case 'ryu':     return 0.35;
      case 'galva':   return 0.25;
      default:        return 0.40;
    }
  }

  // ── RYU: low-guard pressure, short punch strings, rising finishers ────────
  private updateRyu(cpu: Fighter, _opp: Fighter,
    dist: number, attackRange: number, closeRange: number, goLeft: boolean) {
    const r = Math.random();
    if (dist > attackRange + 60) {
      goLeft ? cpu.moveLeft(0.016) : cpu.moveRight(0.016);
      if (r < 0.18) { cpu.tryDash(goLeft ? 'left' : 'right', performance.now()/1000); this.pauseTimer = 0.16; }
    } else if (dist <= closeRange) {
      if (this.comboCount === 0 && r < 0.42) {
        cpu.punch(); this.comboCount = 1;
        this.actionTimer = 0.13 + Math.random() * 0.06;
      } else if (this.comboCount === 1 && r < 0.68) {
        cpu.punch(); this.comboCount = 2;
        this.actionTimer = 0.14 + Math.random() * 0.07;
      } else if (this.comboCount >= 2 && r < 0.80) {
        // Skybreaker: Ryu's flame-laced wide finisher.
        cpu.roundhouse(); this.comboCount = 0;
        this.pauseTimer = 0.30 + Math.random() * 0.18;
      } else if (r < 0.87) {
        // Ashen sweep keeps opponents honest when they stand too close.
        cpu.sweep(); this.comboCount = 0;
        this.pauseTimer = 0.34 + Math.random() * 0.20;
      } else if (r < 0.94) {
        cpu.tryDash(goLeft ? 'right' : 'left', performance.now()/1000);
        this.comboCount = 0; this.pauseTimer = 0.45 + Math.random() * 0.35;
      } else {
        (cpu as any).forwardJump?.() || cpu.jump(); this.pauseTimer = 0.5;
      }
    } else {
      if (r < 0.55) { goLeft ? cpu.moveLeft(0.016) : cpu.moveRight(0.016); }
      else if (r < 0.72) { cpu.punch(); this.comboCount = 1; this.pauseTimer = 0.18; }
      else if (r < 0.84) { cpu.roundhouse(); this.comboCount = 0; this.pauseTimer = 0.32; }
      else { this.pauseTimer = 0.20 + Math.random() * 0.22; }
    }
  }

  // ── AKARI: evasive counter rhythm, ribbon strings, spinning finishes ───────
  private updateAkari(cpu: Fighter, _opp: Fighter,
    dist: number, attackRange: number, closeRange: number, goLeft: boolean) {
    const r = Math.random();
    if (dist > attackRange + 40) {
      goLeft ? cpu.moveLeft(0.016) : cpu.moveRight(0.016);
      if (r < 0.12) { cpu.tryDash(goLeft ? 'left' : 'right', performance.now()/1000); this.pauseTimer = 0.18; }
    } else if (dist <= closeRange) {
      if (this.comboCount === 0 && r < 0.35) {
        cpu.punch(); this.comboCount = 1; this.actionTimer = 0.13 + Math.random() * 0.06;
      } else if (this.comboCount === 1 && r < 0.62) {
        cpu.kick(); this.comboCount = 2; this.actionTimer = 0.15 + Math.random() * 0.06;
      } else if (this.comboCount >= 2 && r < 0.80) {
        // Venus Turn: the wide spinning finisher after a short exchange.
        cpu.roundhouse(); this.comboCount = 0;
        this.pauseTimer = 0.30 + Math.random() * 0.18;
      } else if (r < 0.88) {
        cpu.tryDash(goLeft ? 'right' : 'left', performance.now()/1000);
        this.comboCount = 0; this.pauseTimer = 0.40 + Math.random() * 0.28;
      } else if (r < 0.95) {
        cpu.sweep(); this.comboCount = 0; this.pauseTimer = 0.34 + Math.random() * 0.22;
      } else {
        this.pauseTimer = 0.22 + Math.random() * 0.18; this.comboCount = 0;
      }
    } else {
      if (r < 0.48) { goLeft ? cpu.moveLeft(0.016) : cpu.moveRight(0.016); }
      else if (r < 0.66) { cpu.punch(); this.comboCount = 1; this.pauseTimer = 0.18; }
      else if (r < 0.78) { cpu.tryDash(goLeft ? 'right' : 'left', performance.now()/1000); this.pauseTimer = 0.30; }
      else { this.pauseTimer = 0.24 + Math.random() * 0.18; }
    }
  }

  // ── GALVA: slow deliberate approach, heavy hits, lightning at range ────────
  private updateGalva(cpu: Fighter, opp: Fighter,
    dist: number, attackRange: number, closeRange: number, goLeft: boolean) {
    const r = Math.random();
    // Teleport: 12% chance at any range when off cooldown (not always, but can happen)
    if (r < 0.12 && (cpu as any).teleportCooldown <= 0) {
      if ((cpu as any).activateTeleport?.(opp)) { this.pauseTimer = 0.5; return; }
    }
    if (dist > attackRange + 120) {
      goLeft ? cpu.moveLeft(0.016) : cpu.moveRight(0.016);
      if (r < 0.18) { (cpu as any).shootLightning?.(); this.pauseTimer = 0.7; }
    } else if (dist <= closeRange + 20) {
      if (r < 0.40) { cpu.punch(); this.pauseTimer = 0.45 + Math.random() * 0.2; }
      else if (r < 0.60) { cpu.kick(); this.pauseTimer = 0.55 + Math.random() * 0.25; }
      else if (r < 0.72) {
        cpu.tryDash(goLeft ? 'right' : 'left', performance.now()/1000); this.pauseTimer = 0.3;
        setTimeout(() => (cpu as any).shootLightning?.(), 350);
      } else { this.pauseTimer = 0.5 + Math.random() * 0.4; }
    } else {
      if (r < 0.50) { goLeft ? cpu.moveLeft(0.016) : cpu.moveRight(0.016); }
      else if (r < 0.65) { (cpu as any).shootLightning?.(); this.pauseTimer = 0.7; }
      else { this.pauseTimer = 0.4; }
    }
  }

  // ── KAI: quick dashes, aerial attacks, tornado special ───────────────────
  private updateKai(cpu: Fighter, _opp: Fighter,
    dist: number, attackRange: number, closeRange: number, goLeft: boolean) {
    const r = Math.random();
    if (dist > attackRange + 50) {
      if (r < 0.30) { cpu.tryDash(goLeft ? 'left' : 'right', performance.now()/1000); this.pauseTimer = 0.15; }
      else { goLeft ? cpu.moveLeft(0.016) : cpu.moveRight(0.016); }
    } else if (dist <= closeRange) {
      if (r < 0.28) {
        (cpu as any).forwardJump?.() || cpu.jump(); this.pauseTimer = 0.3;
        setTimeout(() => cpu.kick(), 180);
      } else if (r < 0.50) {
        cpu.punch(); this.actionTimer = 0.20; this.comboCount++;
        if (this.comboCount >= 3) { this.comboCount = 0; this.pauseTimer = 0.5 + Math.random() * 0.3; }
      } else if (r < 0.65) {
        cpu.kick(); this.comboCount = 0; this.pauseTimer = 0.35 + Math.random() * 0.2;
      } else if (r < 0.75) {
        (cpu as any).activateTornado?.(); this.pauseTimer = 0.8;
      } else {
        (cpu as any).backJump?.() || cpu.tryDash(goLeft ? 'right' : 'left', performance.now()/1000);
        this.pauseTimer = 0.4 + Math.random() * 0.3; this.comboCount = 0;
      }
    } else {
      if (r < 0.55) { goLeft ? cpu.moveLeft(0.016) : cpu.moveRight(0.016); }
      else if (r < 0.70) { cpu.punch(); this.pauseTimer = 0.3; }
      else { this.pauseTimer = 0.25; }
    }
  }

  // ── SHURAKU: patient, punishes mistakes, shadow barrier, grab ────────────
  private updateShuraku(cpu: Fighter, opp: Fighter,
    dist: number, attackRange: number, closeRange: number, goLeft: boolean) {
    const r = Math.random();
    const oppLowHealth = opp.health < opp.maxHealth * 0.35;
    if (dist > attackRange + 30) {
      goLeft ? cpu.moveLeft(0.016) : cpu.moveRight(0.016);
      if (r < 0.10) { (cpu as any).activateShadowBarrier?.(); this.pauseTimer = 0.5; }
    } else if (dist <= closeRange) {
      if (oppLowHealth && r < 0.25) {
        cpu.punch(); this.pauseTimer = 0.15;
        setTimeout(() => cpu.kick(), 120);
      } else if (r < 0.38) {
        cpu.punch(); this.pauseTimer = 0.42 + Math.random() * 0.2;
      } else if (r < 0.55) {
        cpu.kick(); this.pauseTimer = 0.48 + Math.random() * 0.25;
      } else if (r < 0.68) {
        (cpu as any).backJump?.() || cpu.tryDash(goLeft ? 'right' : 'left', performance.now()/1000);
        this.pauseTimer = 0.6 + Math.random() * 0.4;
      } else { this.pauseTimer = 0.4 + Math.random() * 0.3; }
    } else {
      if (r < 0.45) { goLeft ? cpu.moveLeft(0.016) : cpu.moveRight(0.016); }
      else if (r < 0.60) { cpu.punch(); this.pauseTimer = 0.45; }
      else if (r < 0.72) { (cpu as any).activateShadowBarrier?.(); this.pauseTimer = 0.6; }
      else { this.pauseTimer = 0.35; }
    }
  }
}
