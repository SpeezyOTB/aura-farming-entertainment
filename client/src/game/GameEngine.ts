import { Fighter } from './Fighter';
import { InputManager } from './InputManager';
import { GamepadManager } from './GamepadManager';
import { SoundManager } from './SoundManager';
import { CpuAI } from './CpuAI';
import { CelShader } from './CelShader';
import { CinematicManager } from './CinematicManager';
import { ComboEngine } from './ComboEngine';
import type { FighterConfig, GameState, GameMode } from './types';
import {
  CANVAS_HEIGHT, CANVAS_WIDTH, FIGHTER_HEIGHT, FIGHTER_WIDTH,
  GROUND_Y, KICK_DAMAGE, PUNCH_DAMAGE, CHARGE_HOLD_TIME,
} from './constants';

function rectsOverlap(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number }
) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export class GameEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  input: InputManager;
  gamepad: GamepadManager;
  sound: SoundManager;
  cpu: CpuAI | null = null;
  cpu2: CpuAI | null = null;
  mode: GameMode;

  p1: Fighter;
  p2: Fighter;

  gameState: GameState = { running: false, winner: 0 as 0 | 1 | 2 };
  roundTimer = 99;
  private roundEnded = false;
  countdown = 3;
  countdownTimer = 1.0;
  countdownDone = false;

  private rafId = 0;
  private lastTime = 0;
  private bgImage: HTMLImageElement | null = null;
  private p1Image: HTMLImageElement | null = null;
  private p2Image: HTMLImageElement | null = null;
  private celShader: CelShader = new CelShader(FIGHTER_WIDTH + 8, FIGHTER_HEIGHT + 8);
  private cinematic = new CinematicManager();

  // Hit sparks
  sparks: { x: number; y: number; ttl: number; color: string; size: number }[] = [];
  // Presentation feedback — brief freezes and small camera shake make impacts legible.
  private hitStop = 0;
  private screenShakeTimer = 0;
  private screenShakeIntensity = 0;
  private cameraCenterX = CANVAS_WIDTH / 2;
  private readonly cameraZoom = 1.10;
  private readonly autoDemo = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('demo');

  // Combo engines
  private p1Combo: ComboEngine;
  private p2Combo: ComboEngine;

  // Footstep throttle
  private dt = 0;
  private p1FootTimer = 0;
  private p2FootTimer = 0;
  private p1PunchHeld = false;
  private p1KickHeld = false;
  private p2PunchHeld = false;
  private p2KickHeld = false;
  // Grunt cooldown: prevents stacking multiple grunts on the same hit
  private p1GruntTimer = 0;
  private p2GruntTimer = 0;
  // Combo counter
  p1ComboCount = 0;
  p2ComboCount = 0;
  private p1ComboTimer = 0;  // reset after 1.5s without a hit
  private p2ComboTimer = 0;

  onStateChange?: (state: GameState) => void;

  constructor(
    canvas: HTMLCanvasElement,
    p1Config: FighterConfig,
    p2Config: FighterConfig,
    bgUrl: string,
    mode: GameMode,
    sound: SoundManager
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.input = new InputManager();
    this.gamepad = new GamepadManager();
    this.sound = sound;
    this.mode = mode;
    this.p1 = new Fighter(p1Config);
    this.p2 = new Fighter(p2Config);
    if (mode === 'cpu' || mode === 'cvc') {
      const n2 = p2Config.name.toLowerCase();
      const p2personality = n2.includes('akari') ? 'akari' : n2.includes('galva') ? 'galva' : n2.includes('shuraku') ? 'shuraku' : n2.includes('kai') ? 'kai' : 'ryu';
      this.cpu = new CpuAI(p2personality);
    }
    if (mode === 'cvc') {
      const n1 = p1Config.name.toLowerCase();
      const p1personality = n1.includes('akari') ? 'akari' : n1.includes('galva') ? 'galva' : n1.includes('shuraku') ? 'shuraku' : n1.includes('kai') ? 'kai' : 'ryu';
      this.cpu2 = new CpuAI(p1personality);
    }

    this.p1Combo = new ComboEngine(p1Config.name);
    this.p2Combo = new ComboEngine(p2Config.name);

    const loadImg = (src: string, cb: (img: HTMLImageElement) => void) => {
      const img = new Image(); img.src = src; img.onload = () => cb(img);
    };
    loadImg(bgUrl, img => { this.bgImage = img; });
    loadImg(p1Config.spriteUrl, img => { this.p1Image = img; });
    loadImg(p2Config.spriteUrl, img => { this.p2Image = img; });
  }

  start() {
    // Reset fighters to full health/energy
    this.p1.reset();
    this.p2.reset();
    this.gameState = { running: false, winner: 0 };
    this.roundEnded = false;
    this.countdown = 3;
    this.countdownTimer = 1.0;
    this.countdownDone = false;
    this.roundTimer = 99;
    this.sparks = [];
    this.hitStop = 0;
    this.screenShakeTimer = 0;
    this.screenShakeIntensity = 0;
    this.cameraCenterX = CANVAS_WIDTH / 2;
    this.pulseWaves = [];
    this.p1Combo.clear();
    this.p2Combo.clear();
    this.cpu?.reset();
    this.cpu2?.reset();
    this.sound.stopFightMusic();
    this.cinematic.stop();
    this.lastTime = performance.now();
    if (this.autoDemo) {
      this.countdown = 0;
      this.countdownDone = true;
      this.gameState.running = true;
    }
    this.sound.resume();
    this.rafId = requestAnimationFrame(this.loop);
  }

  stop() {
    cancelAnimationFrame(this.rafId);
    this.input.dispose();
  }

  private loop = (now: number) => {
    const dt = Math.min((now - this.lastTime) / 1000, 0.05);
    this.lastTime = now;
    this.update(dt);
    if (!this.countdownDone) {
      this.renderBg();
      this.renderCountdown();
    } else {
      this.render();
    }
    this.rafId = requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    // Countdown phase — block all game logic until done
    if (!this.countdownDone) {
      this.countdownTimer -= dt;
      if (this.countdownTimer <= 0) {
        if (this.countdown > 0) {
          this.countdown--;
          this.countdownTimer = 1.0;
          this.sound.play('countdown-beep', 0.7);
        } else {
          this.countdownDone = true;
          this.gameState.running = true;
          this.sound.play('dragon-fight', 1.0);
        }
      }
      return;
    }
    if (!this.gameState.running) return;
    this.updateCamera(dt);
    if (this.screenShakeTimer > 0) this.screenShakeTimer = Math.max(0, this.screenShakeTimer - dt);
    if (this.hitStop > 0) {
      this.hitStop = Math.max(0, this.hitStop - dt);
      this.input.flush();
      return;
    }
    this.roundTimer -= dt;
    if (this.roundTimer <= 0) { this.roundTimer = 0; if (!this.roundEnded) this.endRound(); return; }

    this.processInput(dt);
    if (this.cpu) this.cpu.update(this.p2, this.p1, dt);
    if (this.cpu2) this.cpu2.update(this.p1, this.p2, dt);

    this.p1.update(dt);
    this.p2.update(dt);

    // Auto-face
    this.p1.facingRight = this.p1.centerX < this.p2.centerX;
    this.p2.facingRight = this.p2.centerX < this.p1.centerX;

    this.resolveBodyCollision();
    this.resolveAttacks();
    this.resolveGroundSlam(this.p1, this.p2);
    this.resolveGroundSlam(this.p2, this.p1);

    // Footstep sounds
    this.p1FootTimer -= dt;
    if (this.p1.state === 'walk' && this.p1FootTimer <= 0) {
      this.sound.playRandom(['footstep','footstep2','footstep3','footstep4','footstep5','footstep6','footstep7','footstep8','footstep9'], 0.4);
      this.p1FootTimer = 0.28;
    }
    this.p2FootTimer -= dt;
    if (this.p2.state === 'walk' && this.p2FootTimer <= 0) {
      this.sound.playRandom(['footstep','footstep2','footstep3','footstep4','footstep5','footstep6','footstep7','footstep8','footstep9'], 0.35);
      this.p2FootTimer = 0.28;
    }

    // Process combo steps
    // Tick grunt cooldowns
    this.p1GruntTimer = Math.max(0, this.p1GruntTimer - dt);
    this.p2GruntTimer = Math.max(0, this.p2GruntTimer - dt);
    // Combo counter decay
    if (this.p1ComboTimer > 0) { this.p1ComboTimer -= dt; if (this.p1ComboTimer <= 0) this.p1ComboCount = 0; }
    if (this.p2ComboTimer > 0) { this.p2ComboTimer -= dt; if (this.p2ComboTimer <= 0) this.p2ComboCount = 0; }
    const now = performance.now() / 1000;
    this.executeComboSteps(this.p1, this.p2, this.p1Combo, now);
    this.executeComboSteps(this.p2, this.p1, this.p2Combo, now);
    // Resolve lightning barrier
    this.resolveLightningBarrier(this.p1, this.p2);
    this.resolveLightningBarrier(this.p2, this.p1);
    // Resolve grab throw
    this.resolveGrabThrow(this.p1);
    this.resolveGrabThrow(this.p2);
    // Resolve teleport phase transitions
    this.resolveTeleport(this.p1, this.p2, dt);
    this.resolveTeleport(this.p2, this.p1, dt);

    this.sparks = this.sparks.filter(s => { s.ttl -= dt; return s.ttl > 0; });
    if (!this.roundEnded && (!this.p1.isAlive || !this.p2.isAlive)) this.endRound();
    this.input.flush();
  }

  private processInput(dt: number) {
    // In Spectator Mode (cvc) both fighters are AI-controlled — skip all player input
    if (this.mode === 'cvc') return;
    const { p1, p2, input, gamepad } = this;
    const gp1 = gamepad.getState(0);
    const gp2 = gamepad.getState(1);

    // ── P1: WASD + F/G/S  OR  Gamepad 0 ──
    const p1Left  = input.isDown('KeyA') || (gp1?.left ?? false);
    const p1Right = input.isDown('KeyD') || (gp1?.right ?? false);
    const p1Block = input.isDown('KeyS') || (gp1?.block ?? false);

    const now = performance.now() / 1000;
    if (input.wasPressed('KeyA')) p1.tryDash('left', now);
    if (input.wasPressed('KeyD')) p1.tryDash('right', now);
    if (p1Left) p1.moveLeft(dt);
    else if (p1Right) p1.moveRight(dt);
    else if (p1.state === 'walk' && p1.isOnGround) p1.state = 'idle';

    if (input.wasPressed('KeyW') || (gp1?.upJust ?? false)) {
      const movingFwd = (p1.facingRight && input.isDown('KeyD')) || (!p1.facingRight && input.isDown('KeyA'));
      if (movingFwd) {
        if (p1.forwardJump()) this.sound.play('jump', 0.5);
      } else {
        if (p1.jump()) this.sound.play('jump', 0.5);
      }
    }
    if (input.wasPressed('KeyQ')) { if (p1.backJump()) this.sound.play('jump', 0.5); }
    if (input.wasPressed('KeyZ')) { p1.backdash(); }
    if (input.isDown('KeyC')) p1.startCharge(); else p1.stopCharge();
    const p1Forward = (p1.facingRight && p1Right) || (!p1.facingRight && p1Left);
    const playP1Punch = () => {
      if (p1.punch()) {
        this.sound.playRandom(this.getPunchGrunts(p1.name), 0.9);
        this.sound.playRandom(['swoosh','swoosh2','swoosh3','swoosh4','swoosh5','swoosh6','swoosh7','swoosh8','swoosh9','swoosh10','swoosh11','swoosh12'], p1.isChargingAttack ? 0.8 : 0.55);
      }
    };
    const playP1Kick = () => {
      const downKick = input.isDown('KeyS') || (gp1?.down ?? false);
      const performed = downKick && !p1.isChargingAttack ? p1.sweep()
        : p1Forward && !p1.isChargingAttack ? p1.roundhouse()
        : p1.kick();
      if (performed) {
        this.sound.playRandom(this.getKickGrunts(p1.name), 0.9);
        this.sound.playRandom(['swoosh','swoosh2','swoosh3','swoosh4','swoosh5','swoosh6','swoosh7','swoosh8','swoosh9','swoosh10','swoosh11','swoosh12'], p1.isChargingAttack ? 0.85 : 0.60);
      }
    };
    if (input.wasPressed('KeyF')) {
      this.p1Combo.recordInput('punch', performance.now() / 1000);
      this.p1PunchHeld = true; p1.chargeHoldTimer = 0;
    }
    if (this.p1PunchHeld && input.isDown('KeyF')) p1.chargeHoldTimer += dt;
    if (input.wasReleased('KeyF') && this.p1PunchHeld) {
      this.p1PunchHeld = false;
      p1.isChargingAttack = p1.chargeHoldTimer >= CHARGE_HOLD_TIME;
      p1.chargedAttackType = 'punch';
      playP1Punch(); p1.chargeHoldTimer = 0;
    }
    if (gp1?.punchJust) {
      this.p1Combo.recordInput('punch', performance.now() / 1000);
      p1.isChargingAttack = false; p1.chargedAttackType = null; playP1Punch();
    }
    if (input.wasPressed('KeyG')) {
      this.p1Combo.recordInput('kick', performance.now() / 1000);
      this.p1KickHeld = true; p1.chargeHoldTimer = 0;
    }
    if (this.p1KickHeld && input.isDown('KeyG')) p1.chargeHoldTimer += dt;
    if (input.wasReleased('KeyG') && this.p1KickHeld) {
      this.p1KickHeld = false;
      p1.isChargingAttack = p1.chargeHoldTimer >= CHARGE_HOLD_TIME;
      p1.chargedAttackType = 'kick';
      playP1Kick(); p1.chargeHoldTimer = 0;
    }
    if (gp1?.kickJust) {
      this.p1Combo.recordInput('kick', performance.now() / 1000);
      p1.isChargingAttack = false; p1.chargedAttackType = null; playP1Kick();
    }
    if (p1Block) p1.startBlock(); else p1.stopBlock();
    // P1 get-up from prone (X key)
    if (input.wasPressed('KeyX')) p1.tryGetUp();
    // E key / gamepad special: character-specific special moves.
    if (input.wasPressed('KeyE') || (gp1?.specialJust ?? false)) {
      if (p1.hasTempestStyle) {
        const specialUsed = p1.boostActive ? p1.activateTornado() : p1.activateTempestGuard();
        if (specialUsed) this.sound.play('tornado-whoosh', 0.72);
      } else if (p1.hasGrab) {
        if (p1.grab(p2)) {
          this.sound.play('shuraku-punch', 0.78);
          this.sound.play('block-impact', 0.65);
        }
      } else if (p1.hasLightningBlast) {
        const closeEnough = Math.abs(p1.centerX - p2.centerX) <= FIGHTER_WIDTH * 2.25;
        if (p1.boostActive && closeEnough && p1.activateGroundSlam()) {
          this.sound.play('lightning-crackle', 0.9);
        } else if (p1.activateTeleport(p2)) {
          this.sound.play('galva-teleport-vanish', 0.9);
        }
      } else if ((p1 as any).activateTeleport) {
        const opp = this.p1 === p1 ? this.p2 : this.p1;
        if ((p1 as any).activateTeleport(opp)) {
          this.sound.play('galva-teleport-vanish', 0.9);
        }
      }
    }

    if (this.mode === 'pvp') {
      // ── P2: Arrow keys + L/K/↓  OR  Gamepad 1 ──
      const p2Left  = input.isDown('ArrowLeft') || (gp2?.left ?? false);
      const p2Right = input.isDown('ArrowRight') || (gp2?.right ?? false);
      const p2Block = input.isDown('ArrowDown') || (gp2?.block ?? false);

      if (input.wasPressed('ArrowLeft')) p2.tryDash('left', now);
      if (input.wasPressed('ArrowRight')) p2.tryDash('right', now);
      if (p2Left) p2.moveLeft(dt);
      else if (p2Right) p2.moveRight(dt);
      else if (p2.state === 'walk' && p2.isOnGround) p2.state = 'idle';

      if (input.wasPressed('ArrowUp') || (gp2?.upJust ?? false)) {
        const movingFwd2 = (p2.facingRight && input.isDown('ArrowRight')) || (!p2.facingRight && input.isDown('ArrowLeft'));
        if (movingFwd2) {
          if (p2.forwardJump()) this.sound.play('jump', 0.5);
        } else {
          if (p2.jump()) this.sound.play('jump', 0.5);
        }
      }
      if (input.wasPressed('KeyU')) { if (p2.backJump()) this.sound.play('jump', 0.5); }
      if (input.wasPressed('KeyI')) { p2.backdash(); }
      if (input.isDown('KeyO')) p2.startCharge(); else p2.stopCharge();
      const p2Forward = (p2.facingRight && p2Right) || (!p2.facingRight && p2Left);
      const playP2Punch = () => {
        if (p2.punch()) {
          this.sound.playRandom(this.getPunchGrunts(p2.name), 0.9);
          this.sound.playRandom(['swoosh','swoosh2','swoosh3','swoosh4','swoosh5','swoosh6','swoosh7','swoosh8','swoosh9','swoosh10','swoosh11','swoosh12'], p2.isChargingAttack ? 0.8 : 0.55);
        }
      };
      const playP2Kick = () => {
        const downKick = input.isDown('ArrowDown') || (gp2?.down ?? false);
        const performed = downKick && !p2.isChargingAttack ? p2.sweep()
          : p2Forward && !p2.isChargingAttack ? p2.roundhouse()
          : p2.kick();
        if (performed) {
          this.sound.playRandom(this.getKickGrunts(p2.name), 0.9);
          this.sound.playRandom(['swoosh','swoosh2','swoosh3','swoosh4','swoosh5','swoosh6','swoosh7','swoosh8','swoosh9','swoosh10','swoosh11','swoosh12'], p2.isChargingAttack ? 0.85 : 0.60);
        }
      };
      if (input.wasPressed('KeyL')) { this.p2Combo.recordInput('punch', performance.now() / 1000); this.p2PunchHeld = true; p2.chargeHoldTimer = 0; }
      if (this.p2PunchHeld && input.isDown('KeyL')) p2.chargeHoldTimer += dt;
      if (input.wasReleased('KeyL') && this.p2PunchHeld) {
        this.p2PunchHeld = false; p2.isChargingAttack = p2.chargeHoldTimer >= CHARGE_HOLD_TIME; p2.chargedAttackType = 'punch'; playP2Punch(); p2.chargeHoldTimer = 0;
      }
      if (gp2?.punchJust) { this.p2Combo.recordInput('punch', performance.now() / 1000); p2.isChargingAttack = false; p2.chargedAttackType = null; playP2Punch(); }
      if (input.wasPressed('KeyK')) { this.p2Combo.recordInput('kick', performance.now() / 1000); this.p2KickHeld = true; p2.chargeHoldTimer = 0; }
      if (this.p2KickHeld && input.isDown('KeyK')) p2.chargeHoldTimer += dt;
      if (input.wasReleased('KeyK') && this.p2KickHeld) {
        this.p2KickHeld = false; p2.isChargingAttack = p2.chargeHoldTimer >= CHARGE_HOLD_TIME; p2.chargedAttackType = 'kick'; playP2Kick(); p2.chargeHoldTimer = 0;
      }
      if (gp2?.kickJust) { this.p2Combo.recordInput('kick', performance.now() / 1000); p2.isChargingAttack = false; p2.chargedAttackType = null; playP2Kick(); }
      if (p2Block) p2.startBlock(); else p2.stopBlock();
      // P2 get-up from prone (M key)
      if (input.wasPressed('KeyM')) p2.tryGetUp();
      if (input.wasPressed('KeyP') || (gp2?.specialJust ?? false)) {
        if (p2.hasTempestStyle) {
          const specialUsed = p2.boostActive ? p2.activateTornado() : p2.activateTempestGuard();
          if (specialUsed) this.sound.play('tornado-whoosh', 0.72);
        } else if (p2.hasGrab) {
          if (p2.grab(p1)) {
            this.sound.play('shuraku-punch', 0.78);
            this.sound.play('block-impact', 0.65);
          }
        } else if (p2.hasLightningBlast) {
          const closeEnough = Math.abs(p2.centerX - p1.centerX) <= FIGHTER_WIDTH * 2.25;
          if (p2.boostActive && closeEnough && p2.activateGroundSlam()) {
            this.sound.play('lightning-crackle', 0.9);
          } else if (p2.activateTeleport(p1)) {
            this.sound.play('galva-teleport-vanish', 0.9);
          }
        } else if ((p2 as any).activateTeleport) {
          const opp = this.p2 === p2 ? this.p1 : this.p2;
          if ((p2 as any).activateTeleport(opp)) this.sound.play('galva-teleport-vanish', 0.9);
        }
      }
    }
  }

  private resolveTeleport(galva: Fighter, opp: Fighter, dt: number) {
    if (galva.teleportPhase === 'none') return;
    galva.teleportTimer -= dt;
    galva.teleportFlashAlpha = Math.max(0, galva.teleportTimer / 0.18);

    if (galva.teleportPhase === 'vanish' && galva.teleportTimer <= 0) {
      // Teleport: move to reappear position
      galva.x = galva.teleportReappearX;
      galva.y = galva.teleportReappearY;
      galva.isOnGround = true;
      galva.vy = 0;
      galva.teleportPhase = 'reappear';
      galva.teleportTimer = 0.25;
      galva.teleportFlashAlpha = 1.0;
      galva.state = 'idle';
      galva.stateTimer = 0;
      // Play reappear sound
      this.sound.play('galva-teleport-reappear', 0.9);
      // Spawn reappear sparks
      for (let i = 0; i < 20; i++) {
        this.sparks.push({
          x: galva.x + FIGHTER_WIDTH/2 + (Math.random()-0.5)*60,
          y: galva.y + FIGHTER_HEIGHT/2 + (Math.random()-0.5)*40,
          ttl: 0.3 + Math.random()*0.3,
          color: '#00cfff',
          size: 6 + Math.random()*10,
        });
      }
    } else if (galva.teleportPhase === 'reappear' && galva.teleportTimer <= 0) {
      galva.teleportPhase = 'none';
      galva.teleportFlashAlpha = 0;
    }
  }

  private resolveBodyCollision() {
    const left = this.p1.centerX <= this.p2.centerX ? this.p1 : this.p2;
    const right = left === this.p1 ? this.p2 : this.p1;
    const minimumCenterGap = FIGHTER_WIDTH * 0.74;
    const overlap = minimumCenterGap - (right.centerX - left.centerX);
    if (overlap <= 0) return;
    // Split the correction so bodies never clip through each other or jitter at close range.
    left.x -= overlap * 0.5;
    right.x += overlap * 0.5;
    left.x = Math.max(40, left.x);
    right.x = Math.min(CANVAS_WIDTH - 40 - FIGHTER_WIDTH, right.x);
    if (left.vx > 0) left.vx *= 0.35;
    if (right.vx < 0) right.vx *= 0.35;
  }

  private updateCamera(dt: number) {
    const midpoint = (this.p1.centerX + this.p2.centerX) * 0.5;
    const target = Math.max(CANVAS_WIDTH * 0.38, Math.min(CANVAS_WIDTH * 0.62, midpoint));
    this.cameraCenterX += (target - this.cameraCenterX) * Math.min(1, dt * 5.5);
  }

  private triggerImpact(heavy = false) {
    this.hitStop = Math.max(this.hitStop, heavy ? 0.065 : 0.035);
    this.screenShakeTimer = Math.max(this.screenShakeTimer, heavy ? 0.14 : 0.075);
    this.screenShakeIntensity = Math.max(this.screenShakeIntensity, heavy ? 7 : 3.5);
  }

  private resolveAttacks() {
    const check = (attacker: Fighter, defender: Fighter) => {
      const atk = attacker.getAttackRect();
      if (!atk) return;
      const body = defender.getBodyRect();
      // Miss whoosh: attack is active but doesn't overlap defender
      if (!rectsOverlap(atk, body) && attacker.attackPhase === 'active' && !attacker.attackLanded) {
        if (Math.random() < 0.4) this.sound.play('miss-whoosh', 0.3);
      }
      if (rectsOverlap(atk, body)) {
        // Kai's Tempest Guard is a narrow, timing-based parry. It trades no armor
        // for a guaranteed close-range counter if the player reads an incoming hit.
        if (defender.isTempestGuarding()) {
          defender.tempestGuardTimer = 0;
          defender.state = 'kick';
          defender.stateTimer = 0.34;
          defender.attackPhase = 'active';
          defender.attackLanded = false;
          defender.attackVariant = 'tempest-counter';
          defender.vx += (defender.facingRight ? 1 : -1) * 95;
          defender.spawnTempestWind(16, '#e2fbff');
          attacker.state = 'hit';
          attacker.stateTimer = 0.48;
          attacker.vx = (attacker.centerX > defender.centerX ? 1 : -1) * 280;
          attacker.hitFlash = 0.16;
          defender.onAttackLanded();
          this.sound.play('tornado-whoosh', 0.78);
          this.sound.play('block-impact', 0.85);
          this.triggerImpact(true);
          return;
        }
        const isKick = attacker.state === 'kick' || attacker.state === 'airkick'
          || attacker.state === 'roundhouse' || attacker.state === 'sweep';
        const isRoundhouse = attacker.state === 'roundhouse';
        const isSweep = attacker.state === 'sweep';
        let base = isKick
          ? KICK_DAMAGE + attacker.kickDamageBonus
          : PUNCH_DAMAGE + attacker.punchDamageBonus;
        if (attacker.comboDamageOverride !== null) base = attacker.comboDamageOverride;
        if (attacker.attackVariant === 'icarus-jab') base += 1;
        if (attacker.attackVariant === 'phoenix-heel') base += 1;
        if (attacker.attackVariant === 'skybreaker') base += 2;
        if (attacker.attackVariant === 'ashen-sweep') base += 1;
        if (attacker.attackVariant === 'petal-kick') base += 1;
        if (attacker.attackVariant === 'venus-spin') base += 2;
        if (attacker.attackVariant === 'silk-sweep') base += 1;
        if (attacker.attackVariant === 'wind-jab') base += 1;
        if (attacker.attackVariant === 'tempest-kick') base += 1;
        if (attacker.attackVariant === 'cyclone-wheel') base += 2;
        if (attacker.attackVariant === 'reed-sweep') base += 1;
        if (attacker.attackVariant === 'tempest-counter') base += 2;
        const isCharged = attacker.isChargingAttack && attacker.chargedAttackType === (isKick ? 'kick' : 'punch');
        // Sweep always trips opponent into prone; roundhouse has 1.5x knockback
        if (isSweep && !defender.isBlocking) {
          defender.state = 'prone';
          defender.stateTimer = 3.0;
          defender.vx = (defender.facingRight ? -1 : 1) * 180;
          defender.consecutiveHits = 0;
          defender.energy = 0;
          defender.hitFlash = 0.1;
          const sweepDmg = Math.max(1, Math.round(attacker.boostActive ? base * 2 : base));
          defender.health = Math.max(0, defender.health - sweepDmg);
          attacker.onAttackLanded();
          this.triggerImpact(true);
          // Increment combo counter for this attacker
          if (attacker === this.p1) { this.p1ComboCount++; this.p1ComboTimer = 1.5; }
          else { this.p2ComboCount++; this.p2ComboTimer = 1.5; }
          if (!defender.isAlive) { this.sound.play('ko', 0.9); }
          this.sound.playRandom(['kick-impact','kick-impact2','kick-impact3'], 0.85);
          // Sparks
          const bdy = defender.getBodyRect();
          const sweepColor = attacker.hasIcarusStyle ? '#ff7918' : attacker.hasAphroditeStyle ? '#ffc0e6' : attacker.hasTempestStyle ? '#9cf2ff' : '#fff';
          for (let i = 0; i < 12; i++) this.sparks.push({ x: bdy.x + bdy.w/2 + (Math.random()-0.5)*30, y: bdy.y + bdy.h*0.8 + (Math.random()-0.5)*10, ttl: 0.2+Math.random()*0.2, color: sweepColor, size: 4+Math.random()*8 });
          attacker.comboDamageOverride = null;
          return; // skip normal receiveHit
        }
        const dmg = defender.receiveHit(base, attacker.boostActive, isKick, isCharged);
        if (isCharged) attacker.isChargingAttack = false;
        if (dmg > 0) {
          attacker.onAttackLanded();
          this.triggerImpact(isRoundhouse || isCharged || attacker.boostActive);
          if (attacker === this.p1) { this.p1ComboCount++; this.p1ComboTimer = 1.5; }
          else { this.p2ComboCount++; this.p2ComboTimer = 1.5; }
          if (isRoundhouse) defender.vx *= 1.35;
          // Random impact variant
          if (isKick) {
            this.sound.playRandom(['kick-impact','kick-impact2','kick-impact3','kick-impact4','kick-impact5','kick-impact6','kick-impact7'], 0.85);
          } else {
            this.sound.playRandom(['punch-impact','punch-impact2','punch-impact3','punch-impact4','punch-impact5','punch-impact6'], 0.82);
          }
          // Block sound if defender is blocking
          if (defender.isBlocking) {
            this.sound.play('block-impact', 0.75);
          } else {
            // Weighted grunt selection: 30% silent, 35% soft (1-2), 25% medium (3-4), 10% hard (5-7)
            const isP1 = defender === this.p1;
            const gTimer = isP1 ? this.p1GruntTimer : this.p2GruntTimer;
            if (gTimer <= 0) {
              const r = Math.random();
              if (r >= 0.30) { // 70% chance to play a grunt
                const grunts = this.getHitGrunts(defender.name);
                let key: string;
                if (r < 0.65) { key = grunts[Math.floor(Math.random() * 2)]; }       // soft (1-2)
                else if (r < 0.90) { key = grunts[2 + Math.floor(Math.random() * 2)]; } // medium (3-4)
                else { key = grunts[4 + Math.floor(Math.random() * 3)]; }              // hard (5-7)
                this.sound.play(key, 0.85);
              }
              if (isP1) this.p1GruntTimer = 0.12; else this.p2GruntTimer = 0.12;
            }
          }
          // Check if attacker just activated full power (boost just turned on)
          if (attacker.boostActive && !attacker.attackLanded) {
            // attackLanded was just set to true by onAttackLanded which may have triggered boost
          }
          // Detect fresh boost activation this frame (fire once per boost cycle)
          if (attacker.boostActive && !attacker.cinematicFired && dmg > 0) {
            attacker.cinematicFired = true;
            this.sound.play('energy-full', 0.9);
            this.triggerEnergyPulse(attacker);
            this.triggerCinematic(attacker);
          }
          const cx = body.x + body.w / 2;
          const cy = body.y + body.h * 0.3;
          const col = attacker.boostActive ? attacker.energyColor
            : attacker.hasIcarusStyle ? '#ff7a18'
            : attacker.hasAphroditeStyle ? '#ff65ad'
            : attacker.hasTempestStyle ? '#8deeff'
            : '#fff';
          const sparkCount = attacker.attackVariant === 'skybreaker' || attacker.attackVariant === 'venus-spin' || attacker.attackVariant === 'cyclone-wheel' || attacker.attackVariant === 'tempest-counter' ? 16 : 8;
          for (let i = 0; i < sparkCount; i++) {
            this.sparks.push({
              x: cx + (Math.random()-0.5)*30,
              y: cy + (Math.random()-0.5)*20,
              ttl: 0.2 + Math.random()*0.2,
              color: col,
              size: 4 + Math.random()*8,
            });
          }
          if (!defender.isAlive) this.sound.play('ko', 0.9);
          attacker.comboDamageOverride = null;
        }
      }
    };
    check(this.p1, this.p2);
    check(this.p2, this.p1);
  }

  private executeComboSteps(attacker: Fighter, defender: Fighter, combo: ComboEngine, now: number) {
    const steps = combo.update(now, attacker);
    for (const step of steps) {
      if (step.type === 'grab') {
        if (attacker.grab(defender)) {
          this.sound.play('block-impact', 0.7); // grab sound
        }
        continue;
      }
      const isKick = step.type === 'kick' || step.type === 'airkick' || step.type === 'roundhouse' || step.type === 'sweep';
      const isAir  = step.type === 'airpunch' || step.type === 'airkick';
      attacker.comboDamageOverride = step.damage ?? null;
      if (attacker.hasIcarusStyle) {
        attacker.attackVariant = step.type === 'roundhouse' ? 'skybreaker'
          : step.type === 'sweep' ? 'ashen-sweep'
          : step.type === 'kick' ? 'phoenix-heel'
          : step.type === 'punch' ? 'icarus-jab'
          : 'normal';
      } else if (attacker.hasAphroditeStyle) {
        attacker.attackVariant = step.type === 'roundhouse' ? 'venus-spin'
          : step.type === 'sweep' ? 'silk-sweep'
          : step.type === 'kick' ? 'petal-kick'
          : step.type === 'punch' ? 'rose-jab'
          : 'normal';
      } else if (attacker.hasTempestStyle) {
        attacker.attackVariant = step.type === 'roundhouse' ? 'cyclone-wheel'
          : step.type === 'sweep' ? 'reed-sweep'
          : step.type === 'kick' ? 'tempest-kick'
          : step.type === 'punch' ? 'wind-jab'
          : 'normal';
      }
      if (isAir && !attacker.isOnGround) {
        if (step.vyBoost) attacker.vy += step.vyBoost;
        attacker.state = step.type;
        attacker.stateTimer = isKick ? 0.35 : 0.28;
        attacker.attackPhase = 'active';
        attacker.attackLanded = false;
      } else if (!isAir && attacker.isOnGround) {
        attacker.state = step.type;
        const isRH = step.type === 'roundhouse';
        const isSW = step.type === 'sweep';
        attacker.stateTimer = isRH ? 0.42 : isSW ? 0.38 : isKick ? 0.35 : 0.28;
        attacker.attackPhase = 'active';
        attacker.attackLanded = false;
      }
      // Combo steps never inherit a previously held charged-attack flag.
      if (attacker.attackPhase === 'active') attacker.isChargingAttack = false;
      const grunts = isKick ? this.getKickGrunts(attacker.name) : this.getPunchGrunts(attacker.name);
      this.sound.playRandom(grunts, 0.85);
      this.sound.playRandom(['swoosh','swoosh2','swoosh3','swoosh4','swoosh5','swoosh6'], 0.55);
    }
  }

  private resolveLightningBarrier(galva: Fighter, opp: Fighter) {
    if (!galva.lightningBarrierActive) return;
    const dist = Math.abs(galva.centerX - opp.centerX);
    if (dist < 140) {
      // Stun and push opponent
      opp.state = 'hit';
      opp.stateTimer = 0.5;
      opp.vx = (opp.centerX > galva.centerX ? 1 : -1) * 350;
      opp.health = Math.max(0, opp.health - 1);
      opp.hitFlash = 0.15;
      this.sound.play('lightning-blast', 0.8);
    }
  }

  private resolveGrabThrow(fighter: Fighter) {
    if (fighter.state !== 'grab' || !fighter.grabTarget) return;

    const target = fighter.grabTarget;
    const direction = fighter.facingRight ? 1 : -1;
    // Keep the restrained opponent close to Shuraku and visibly engaged in the hold.
    target.x = fighter.centerX + direction * FIGHTER_WIDTH * 0.42 - FIGHTER_WIDTH / 2;
    target.y = fighter.y + 6;
    target.vx = 0;
    target.vy = 0;
    target.isOnGround = true;
    target.state = 'grabbed';
    target.stateTimer = Math.max(0.05, fighter.stateTimer);
    target.grabbedBy = fighter;
    target.grappleStruggleTimer = Math.max(0.05, fighter.stateTimer);

    // Apply one controlled damage tick during the restraint, then complete the throw.
    if (!fighter.grappleSqueezeApplied && fighter.stateTimer <= 0.58) {
      const damage = fighter.boostActive ? 5 : 3;
      target.health = Math.max(0, target.health - damage);
      target.hitFlash = 0.14;
      target.consecutiveHits = 0;
      target.energy = 0;
      fighter.grappleSqueezeApplied = true;
      fighter.onAttackLanded();
      this.sound.play('block-impact', 0.82);
      this.triggerImpact(true);
      for (let i = 0; i < 10; i++) {
        this.sparks.push({
          x: target.centerX + (Math.random() - 0.5) * 34,
          y: target.y + FIGHTER_HEIGHT * (0.22 + Math.random() * 0.32),
          ttl: 0.16 + Math.random() * 0.16,
          color: '#d1a0ff',
          size: 4 + Math.random() * 7,
        });
      }
    }

    if (fighter.stateTimer <= 0) {
      fighter.executeThrow();
      this.sound.play('ko', 0.5);
      this.triggerImpact(true);
    }
  }

  private resolveGroundSlam(fighter: Fighter, opponent: Fighter) {
    if (!fighter.groundSlamActive || fighter.groundSlamLanded || fighter.groundSlamTimer > 0.38) return;
    fighter.groundSlamLanded = true;
    const slamX = fighter.centerX;
    const slamY = GROUND_Y - 8;
    const distance = Math.abs(opponent.centerX - slamX);
    const range = FIGHTER_WIDTH * 2.45;

    this.pulseWaves.push({ x: slamX, radius: 0, maxRadius: 250, color: '#62e9ff', alpha: 0.86 });
    this.pulseWaves.push({ x: slamX, radius: 0, maxRadius: 160, color: '#ffffff', alpha: 0.72 });
    for (let i = 0; i < 26; i++) {
      const angle = (i / 26) * Math.PI * 2;
      const radius = 12 + Math.random() * 24;
      this.sparks.push({
        x: slamX + Math.cos(angle) * radius,
        y: slamY - Math.random() * 36,
        ttl: 0.20 + Math.random() * 0.25,
        color: i % 3 === 0 ? '#ffffff' : '#5eeaff',
        size: 5 + Math.random() * 10,
      });
    }
    this.sound.play('lightning-blast', 0.95);
    this.triggerImpact(true);

    if (distance > range) return;
    const direction = opponent.centerX > slamX ? 1 : -1;
    const damage = opponent.isBlocking ? 3 : 9;
    opponent.health = Math.max(0, opponent.health - damage);
    opponent.hitFlash = 0.18;
    opponent.consecutiveHits = 0;
    opponent.energy = 0;
    opponent.vx = direction * (opponent.isBlocking ? 260 : 420);
    if (!opponent.isBlocking && opponent.isAlive) {
      opponent.state = 'launch';
      opponent.vy = -360;
      opponent.isOnGround = false;
      opponent.stateTimer = 0.75;
    }
    fighter.onAttackLanded();
    if (!opponent.isAlive) {
      opponent.state = 'ko';
      opponent.stateTimer = 999;
      this.sound.play('ko', 0.9);
    }
  }

  private endRound() {
    if (this.roundEnded) return;
    this.roundEnded = true;
    // Stop cinematic immediately so it doesn't bleed into win screen
    this.cinematic.stop();
    this.sound.stopFightMusic();
    this.sound.stopAll();
    this.gameState.running = false;
    if (!this.p1.isAlive && !this.p2.isAlive) this.gameState.winner = 0;
    else if (!this.p2.isAlive || this.p1.health > this.p2.health) this.gameState.winner = 1;
    else this.gameState.winner = 2;
    // Play winner/loser voice lines
    const w = this.gameState.winner;
    if (w === 1) {
      setTimeout(() => { this.sound.play(this.getWinSound(this.p1.name), 1.0); }, 600);
    } else if (w === 2) {
      setTimeout(() => { this.sound.play(this.getWinSound(this.p2.name), 1.0); }, 600);
    }
    this.onStateChange?.(this.gameState);
  }



  // ── Sound routing helpers ─────────────────────────────────
  private getPunchGrunts(name: string): string[] {
    const n = name.toLowerCase();
    if (n === 'ryu')     return ['ryu-punch','ryu-punch2','ryu-punch3'];
    if (n === 'akari')   return ['akari-punch','akari-punch2','akari-punch3'];
    if (n === 'galva')   return ['galva-punch'];
    if (n === 'kai')     return ['kai-punch'];
    if (n === 'shuraku') return ['shuraku-punch'];
    return ['punch-impact','punch-impact2','punch-impact3','punch-impact4','punch-impact5','punch-impact6'];
  }
  private getHitGrunts(name: string): string[] {
    const n = name.toLowerCase();
    if (n.includes('ryu'))     return ['g-ryu-1','g-ryu-2','g-ryu-3','g-ryu-4','g-ryu-5','g-ryu-6','g-ryu-7'];
    if (n.includes('akari'))   return ['g-akari-1','g-akari-2','g-akari-3','g-akari-4','g-akari-5','g-akari-6','g-akari-7'];
    if (n.includes('galva'))   return ['g-galva-1','g-galva-2','g-galva-3','g-galva-4','g-galva-5','g-galva-6','g-galva-7'];
    if (n.includes('kai'))     return ['g-kai-1','g-kai-2','g-kai-3','g-kai-4','g-kai-5','g-kai-6','g-kai-7'];
    if (n.includes('shuraku')) return ['g-shuraku-1','g-shuraku-2','g-shuraku-3','g-shuraku-4','g-shuraku-5','g-shuraku-6','g-shuraku-7'];
    return ['g-ryu-1','g-ryu-2','g-ryu-3','g-ryu-4','g-ryu-5','g-ryu-6','g-ryu-7'];
  }

  private getKickGrunts(name: string): string[] {
    const n = name.toLowerCase();
    if (n === 'ryu')     return ['ryu-kick','ryu-kick2'];
    if (n === 'akari')   return ['akari-kick','akari-kick2'];
    if (n === 'galva')   return ['galva-kick'];
    if (n === 'kai')     return ['kai-kick'];
    if (n === 'shuraku') return ['shuraku-kick'];
    return ['kick-impact','kick-impact2','kick-impact3','kick-impact4','kick-impact5','kick-impact6','kick-impact7'];
  }
  private getHitSound(name: string): string {
    const n = name.toLowerCase();
    if (n === 'ryu')     return 'ryu-hit';
    if (n === 'akari')   return 'akari-hit';
    if (n === 'galva')   return 'galva-hit';
    if (n === 'kai')     return 'kai-hit';
    if (n === 'shuraku') return 'shuraku-hit';
    return 'ryu-hit';
  }
  private getPowerUpSound(name: string): string {
    const n = name.toLowerCase();
    if (n === 'ryu')     return 'ryu-powerup';
    if (n === 'akari')   return 'akari-powerup';
    if (n === 'galva')   return 'galva-powerup';
    if (n === 'kai')     return 'kai-powerup';
    if (n === 'shuraku') return 'shuraku-powerup';
    return 'energy-full';
  }

  private getPowerLine(name: string): string {
    const n = name.toLowerCase();
    if (n === 'ryu')     return 'This must be the true power of Icarus!';
    if (n === 'akari')   return 'Spirit of the Dragon — Aphrodite!!';
    if (n === 'galva')   return "You fool! There's no turning back!!";
    if (n === 'kai')     return 'Tempest chose me for a reason.';
    if (n === 'shuraku') return 'I am darkness... embodied.';
    return 'Full power!';
  }

  private getWinSound(name: string): string {
    const n = name.toLowerCase();
    if (n === 'ryu')     return 'ryu-win';
    if (n === 'akari')   return 'akari-win';
    if (n === 'galva')   return 'galva-win';
    if (n === 'kai')     return 'kai-win';
    if (n === 'shuraku') return 'shuraku-win';
    return 'ryu-win';
  }

  // ── Projectile collision resolution ──────────────────────
  private resolveProjectiles() {
    const checkProjectiles = (attacker: Fighter, defender: Fighter) => {
      for (let i = attacker.projectiles.length - 1; i >= 0; i--) {
        const proj = attacker.projectiles[i];
        const body = defender.getBodyRect();
        if (proj.x > body.x && proj.x < body.x + body.w &&
            proj.y > body.y && proj.y < body.y + body.h) {
          // Hit!
          const dmg = defender.receiveHit(proj.damage, false, false);
          if (dmg > 0) {
            this.sound.play('lightning-blast', 0.7);
            for (let j = 0; j < 12; j++) {
              this.sparks.push({
                x: proj.x + (Math.random()-0.5)*30,
                y: proj.y + (Math.random()-0.5)*20,
                ttl: 0.3 + Math.random()*0.2,
                color: proj.color,
                size: 5 + Math.random()*10,
              });
            }
          }
          attacker.projectiles.splice(i, 1);
        }
        // Barrier blocks projectiles
        if (defender.barrierActive) {
          const bx = defender.x + FIGHTER_WIDTH / 2;
          const by = defender.y + FIGHTER_HEIGHT / 2;
          const dist = Math.sqrt((proj.x - bx)**2 + (proj.y - by)**2);
          if (dist < 80) {
            attacker.projectiles.splice(i, 1);
            this.sound.play('block-impact', 0.6);
          }
        }
      }
    };
    checkProjectiles(this.p1, this.p2);
    checkProjectiles(this.p2, this.p1);
  }

  // ── Barrier knockback ─────────────────────────────────────
  private resolveBarrier() {
    const checkBarrier = (shuraku: Fighter, other: Fighter) => {
      if (!shuraku.barrierActive) return;
      const cx = shuraku.x + FIGHTER_WIDTH / 2;
      const cy = shuraku.y + FIGHTER_HEIGHT / 2;
      const ox = other.x + FIGHTER_WIDTH / 2;
      const oy = other.y + FIGHTER_HEIGHT / 2;
      const dist = Math.sqrt((ox - cx)**2 + (oy - cy)**2);
      if (dist < 90) {
        // Knockback
        const dir = ox > cx ? 1 : -1;
        other.vx = dir * 600;
        other.vy = -300;
        other.isOnGround = false;
        other.state = 'hit';
        other.stateTimer = 0.3;
        other.hitFlash = 0.1;
      }
    };
    checkBarrier(this.p1, this.p2);
    checkBarrier(this.p2, this.p1);
  }

  // ── Energy pulse waves ────────────────────────────────────
  private pulseWaves: { x: number; radius: number; maxRadius: number; color: string; alpha: number }[] = [];
  private sunGlareAngle = 0;

  triggerCinematic(f: Fighter) {
    const img = f.id === 1 ? this.p1Image : this.p2Image;
    this.cinematic.trigger({
      name: f.name,
      color: f.color,
      energyColor: f.energyColor,
      powerLine: this.getPowerLine(f.name),
      spriteX: f.x,
      spriteY: f.y,
      spriteW: FIGHTER_WIDTH,
      spriteH: FIGHTER_HEIGHT,
      img,
      facingRight: f.facingRight,
    });
    // Play power-up voice line after short delay
    setTimeout(() => this.sound.play(this.getPowerUpSound(f.name), 1.0), 300);
  }

  triggerEnergyPulse(f: Fighter) {
    const cx = f.x + FIGHTER_WIDTH / 2;
    const color = f.energyColor;
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.pulseWaves.push({ x: cx, radius: 0, maxRadius: 320 + i * 60, color, alpha: 0.7 - i * 0.15 });
      }, i * 120);
    }
  }

  // ── Rendering ─────────────────────────────────────────────
  private render() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    if (this.bgImage) {
      ctx.drawImage(this.bgImage, 0, 0, canvas.width, canvas.height);
    } else {
      const g = ctx.createLinearGradient(0,0,0,canvas.height);
      g.addColorStop(0,'#1a0a00'); g.addColorStop(1,'#000');
      ctx.fillStyle = g; ctx.fillRect(0,0,canvas.width,canvas.height);
    }

    // Frame the action tightly while leaving the React HUD anchored to the screen.
    const shakeStrength = this.screenShakeTimer > 0 ? this.screenShakeIntensity * (this.screenShakeTimer / 0.14) : 0;
    const shakeX = shakeStrength ? (Math.random() - 0.5) * shakeStrength : 0;
    const shakeY = shakeStrength ? (Math.random() - 0.5) * shakeStrength * 0.45 : 0;
    ctx.save();
    ctx.translate(canvas.width / 2 + shakeX, canvas.height * 0.67 + shakeY);
    ctx.scale(this.cameraZoom, this.cameraZoom);
    ctx.translate(-this.cameraCenterX, -(GROUND_Y - 145));

    // Ground glow
    ctx.fillStyle = 'rgba(255,180,60,0.08)';
    ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);
    const gline = ctx.createLinearGradient(0,0,canvas.width,0);
    gline.addColorStop(0,'rgba(255,150,30,0)');
    gline.addColorStop(0.5,'rgba(255,180,60,0.9)');
    gline.addColorStop(1,'rgba(255,150,30,0)');
    ctx.strokeStyle = gline; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0,GROUND_Y); ctx.lineTo(canvas.width,GROUND_Y); ctx.stroke();

    // Sky ambient particles
    this.renderSkyParticles();
    // Sunlight glare
    this.renderSunGlare();
    // Energy pulse waves
    this.renderPulseWaves();
    // Dust particles (ground level)
    this.renderDustParticles(this.p1);
    this.renderDustParticles(this.p2);
    // Energy particles
    this.renderParticles(this.p1);
    this.renderParticles(this.p2);

    // Icarus guard aura — drawn behind the body so it reads as a stance silhouette.
    this.renderIcarusStance(this.p1);
    this.renderIcarusStance(this.p2);
    this.renderAphroditeStance(this.p1);
    this.renderAphroditeStance(this.p2);
    this.renderTempestStance(this.p1);
    this.renderTempestStance(this.p2);
    this.renderDominionStance(this.p1);
    this.renderDominionStance(this.p2);
    this.renderGalvaLightning(this.p1);
    this.renderGalvaLightning(this.p2);

    // Fighters
    this.renderFighter(this.p1, this.p1Image);
    this.renderFighter(this.p2, this.p2Image);
    // Hair and cloth overlay
    this.renderHairCloth(this.p1);
    this.renderHairCloth(this.p2);

    // Special effects
    this.renderProjectiles(this.p1);
    this.renderProjectiles(this.p2);
    this.renderBarrier(this.p1);
    this.renderBarrier(this.p2);
    this.renderLightningBarrier(ctx, this.p1);
    this.renderLightningBarrier(ctx, this.p2);
    this.renderGroundSlam(this.p1);
    this.renderGroundSlam(this.p2);
    this.renderTornado(this.p1);
    this.renderTornado(this.p2);
    // Lightning teleport flashes
    this.renderTeleportFlash(this.p1);
    this.renderTeleportFlash(this.p2);

    // Hit sparks
    for (const s of this.sparks) {
      const a = s.ttl / 0.4;
      ctx.save();
      ctx.globalAlpha = a;
      ctx.fillStyle = s.color;
      ctx.shadowColor = s.color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * a, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }


  private renderPulseWaves() {
    const { ctx } = this;
    this.pulseWaves = this.pulseWaves.filter(w => {
      w.radius += 8;
      w.alpha -= 0.012;
      if (w.radius > w.maxRadius || w.alpha <= 0) return false;
      const progress = w.radius / w.maxRadius;
      ctx.save();
      ctx.globalAlpha = w.alpha * (1 - progress * 0.5);
      ctx.strokeStyle = w.color;
      ctx.shadowColor = w.color;
      ctx.shadowBlur = 18;
      ctx.lineWidth = 4 - progress * 2;
      ctx.beginPath();
      ctx.ellipse(w.x, GROUND_Y, w.radius, w.radius * 0.28, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      return true;
    });
  }

  private renderSunGlare() {
    const { ctx, canvas } = this;
    this.sunGlareAngle += 0.003;
    const sunX = canvas.width * 0.75 + Math.sin(this.sunGlareAngle * 0.4) * 60;
    const sunY = 60 + Math.sin(this.sunGlareAngle * 0.3) * 20;
    const glare = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 120);
    glare.addColorStop(0, 'rgba(255,240,180,0.22)');
    glare.addColorStop(0.4, 'rgba(255,200,80,0.08)');
    glare.addColorStop(1, 'rgba(255,180,40,0)');
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = glare;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 120, 0, Math.PI * 2);
    ctx.fill();
    const streak = ctx.createLinearGradient(sunX - 300, sunY, sunX + 300, sunY);
    streak.addColorStop(0, 'rgba(255,220,120,0)');
    const streakAlpha = 0.06 + Math.sin(this.sunGlareAngle * 2) * 0.02;
    streak.addColorStop(0.5, `rgba(255,220,120,${streakAlpha.toFixed(3)})`);
    streak.addColorStop(1, 'rgba(255,220,120,0)');
    ctx.fillStyle = streak;
    ctx.fillRect(sunX - 300, sunY - 2, 600, 4);
    const flareX = canvas.width / 2 - (sunX - canvas.width / 2) * 0.5;
    const flareY = canvas.height / 2 - (sunY - canvas.height / 2) * 0.5;
    const flare2 = ctx.createRadialGradient(flareX, flareY, 0, flareX, flareY, 30);
    flare2.addColorStop(0, 'rgba(200,220,255,0.12)');
    flare2.addColorStop(1, 'rgba(200,220,255,0)');
    ctx.fillStyle = flare2;
    ctx.beginPath();
    ctx.arc(flareX, flareY, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }


  private renderProjectiles(f: Fighter) {
    const { ctx } = this;
    for (const p of f.projectiles) {
      const a = Math.min(1, p.ttl / 0.3);
      ctx.save();
      ctx.globalAlpha = a;
      // Lightning bolt shape
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 24;
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 4;
      ctx.beginPath();
      const dir = p.vx > 0 ? 1 : -1;
      // Jagged lightning path
      ctx.moveTo(p.x - dir * p.radius, p.y);
      ctx.lineTo(p.x - dir * p.radius * 0.5, p.y - 8);
      ctx.lineTo(p.x + dir * p.radius * 0.3, p.y + 4);
      ctx.lineTo(p.x + dir * p.radius, p.y - 6);
      ctx.stroke();
      // Core glow
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
      g.addColorStop(0, p.color);
      g.addColorStop(1, 'rgba(0,200,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  private renderTeleportFlash(f: Fighter) {
    if (f.teleportPhase === 'none' || f.teleportFlashAlpha <= 0) return;
    const { ctx } = this;
    const isVanish = f.teleportPhase === 'vanish';
    const fx = isVanish ? f.teleportFlashX : (f.x + FIGHTER_WIDTH / 2);
    const fy = isVanish ? f.teleportFlashY : (f.y + FIGHTER_HEIGHT / 2);
    const alpha = f.teleportFlashAlpha;
    const t = performance.now() / 1000;

    ctx.save();
    // Bright white-cyan flash burst
    ctx.globalAlpha = alpha * 0.9;
    ctx.globalCompositeOperation = 'screen';
    const grad = ctx.createRadialGradient(fx, fy, 0, fx, fy, 120);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.2, 'rgba(100,220,255,0.9)');
    grad.addColorStop(0.6, 'rgba(0,180,255,0.4)');
    grad.addColorStop(1, 'rgba(0,100,200,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(fx, fy, 120, 0, Math.PI * 2);
    ctx.fill();

    // Lightning bolt spikes radiating outward
    ctx.globalAlpha = alpha * 0.8;
    ctx.strokeStyle = '#88eeff';
    ctx.shadowColor = '#00cfff';
    ctx.shadowBlur = 20;
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + t * 4;
      const len = 40 + 30 * Math.sin(t * 8 + i);
      const mx = fx + Math.cos(angle) * len * 0.5;
      const my = fy + Math.sin(angle) * len * 0.5;
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(mx + (Math.random()-0.5)*12, my + (Math.random()-0.5)*12);
      ctx.lineTo(fx + Math.cos(angle) * len, fy + Math.sin(angle) * len);
      ctx.stroke();
    }
    ctx.restore();
  }

  private renderBarrier(f: Fighter) {
    if (!f.barrierActive) return;
    const { ctx } = this;
    const cx = f.x + FIGHTER_WIDTH / 2;
    const cy = f.y + FIGHTER_HEIGHT / 2;
    const t = Date.now() / 1000;
    const pulse = 0.6 + Math.sin(t * 8) * 0.2;
    ctx.save();
    ctx.globalAlpha = pulse;
    // Outer dark ring
    const g = ctx.createRadialGradient(cx, cy, 50, cx, cy, 90);
    g.addColorStop(0, 'rgba(80,0,120,0)');
    g.addColorStop(0.7, 'rgba(100,0,160,0.35)');
    g.addColorStop(1, 'rgba(180,0,255,0.7)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, 90, 0, Math.PI * 2);
    ctx.fill();
    // Shadow tendrils
    ctx.strokeStyle = 'rgba(160,0,220,0.8)';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#8800ff';
    ctx.shadowBlur = 20;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + t * 2;
      const r1 = 60 + Math.sin(t * 5 + i) * 10;
      const r2 = 85 + Math.sin(t * 3 + i * 1.3) * 8;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
      ctx.lineTo(cx + Math.cos(angle + 0.3) * r2, cy + Math.sin(angle + 0.3) * r2);
      ctx.stroke();
    }
    ctx.restore();
  }

  private renderTornado(f: Fighter) {
    if (!f.tornadoActive) return;
    const { ctx } = this;
    const cx = f.x + FIGHTER_WIDTH / 2;
    const t = Date.now() / 1000;
    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.strokeStyle = '#a0e8ff';
    ctx.shadowColor = '#60c8ff';
    ctx.shadowBlur = 12;
    // Spinning wind rings at different heights
    for (let i = 0; i < 5; i++) {
      const y = f.y + FIGHTER_HEIGHT * (0.1 + i * 0.18);
      const rx = (20 + i * 8) * (0.7 + Math.sin(t * 6 + i) * 0.3);
      const ry = rx * 0.3;
      const alpha = 0.8 - i * 0.12;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 2 + i * 0.5;
      ctx.beginPath();
      ctx.ellipse(cx, y, rx, ry, t * 3 + i * 0.5, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Wind particles
    for (let i = 0; i < 3; i++) {
      const angle = t * 5 + (i / 3) * Math.PI * 2;
      const r = 30 + i * 15;
      const px = cx + Math.cos(angle) * r;
      const py = f.y + FIGHTER_HEIGHT * 0.5 + Math.sin(angle * 0.5) * 30;
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = '#a0e8ff';
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  private renderParticles(f: Fighter) {
    const { ctx } = this;
    for (const p of f.particles) {
      const a = p.life / p.maxLife;
      ctx.save();
      ctx.globalAlpha = a * 0.85;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * a, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    }
  }

  private renderFighter(f: Fighter, img: HTMLImageElement | null) {
    const { ctx } = this;
    ctx.save();

    // During teleport vanish phase, fighter is invisible
    if (f.teleportPhase === 'vanish') { ctx.restore(); return; }
    if (f.hitFlash > 0) ctx.filter = 'brightness(4) saturate(0)';
    if (f.boostActive) {
      ctx.shadowColor = f.energyColor;
      ctx.shadowBlur = 48;
    }
    // Galva: lightning crackle aura when boosted
    if (f.boostActive && f.hasLightningBlast) {
      ctx.shadowColor = '#00cfff';
      ctx.shadowBlur = 60;
    }
    if (f.state === 'ko') ctx.filter = 'grayscale(1) brightness(0.4)';
    if (f.state === 'charge') { ctx.shadowColor = f.energyColor; ctx.shadowBlur = 22; }
    if (f.state === 'dash' || f.state === 'backdash') ctx.globalAlpha = 0.88;
    const squashT = f.squashTimer > 0 ? f.squashTimer / 0.06 : 0;
    const icarusStance = f.hasIcarusStyle ? f.icarusStanceBlend : 0;
    const aphroditeStance = f.hasAphroditeStyle ? f.aphroditeStanceBlend : 0;
    const tempestStance = f.hasTempestStyle ? f.tempestStanceBlend : 0;
    const dominionStance = f.hasDominionStyle ? f.dominionStanceBlend : 0;
    const scaleX = 1 + squashT * 0.14 + icarusStance * 0.025 - aphroditeStance * 0.02 - tempestStance * 0.015 + dominionStance * 0.018;
    const scaleY = 1 - squashT * 0.11 - icarusStance * 0.045 + aphroditeStance * 0.018 + tempestStance * 0.024 + dominionStance * 0.03;
    const stanceY = icarusStance * 6 - aphroditeStance * 2 + tempestStance * 2 - dominionStance * 3;

    // Contact shadow anchors transparent sprites to the stone stage.
    if (f.isOnGround && f.state !== 'ko') {
      ctx.save();
      ctx.globalAlpha = 0.34;
      ctx.fillStyle = '#12080a';
      ctx.filter = 'blur(4px)';
      ctx.beginPath();
      ctx.ellipse(f.x + FIGHTER_WIDTH / 2, GROUND_Y - 5, FIGHTER_WIDTH * 0.42, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (f.state === 'grabbed') {
      const struggle = Math.sin(performance.now() / 70) * 0.035;
      ctx.translate(f.centerX, f.y + FIGHTER_HEIGHT * 0.52);
      ctx.rotate(struggle);
      ctx.translate(-f.centerX, -(f.y + FIGHTER_HEIGHT * 0.52));
    }

    if (img) {
      // ── Cel-shade rendering ──────────────────────────────────
      this.celShader.draw(
        ctx, img,
        f.x, f.y + stanceY, FIGHTER_WIDTH, FIGHTER_HEIGHT,
        '#1a0030',  // deep purple-black outline
        3,          // outline width px
        3,          // toon color bands
        !f.facingRight,
        scaleX, scaleY,
      );
    } else {
      ctx.fillStyle = f.id === 1 ? '#f59e0b' : '#ec4899';
      ctx.fillRect(f.x, f.y + stanceY, FIGHTER_WIDTH * scaleX, FIGHTER_HEIGHT * scaleY);
    }

    ctx.restore();
    if (f.state === 'grabbed') this.renderGrabStruggle(f);
    // State icon above head
    const icon = f.state === 'grabbed' ? '😱'
               : f.state === 'thrown'  ? '💨'
               : f.state === 'prone'  ? '💫'
               : f.state === 'block' ? '🛡️'
      : (f.state === 'punch' || f.state === 'airpunch') ? '👊'
      : (f.state === 'kick' || f.state === 'airkick') ? '🦵'
      : f.state === 'hit' ? '💥'
      : f.state === 'launch' ? '⬆️'
      : f.state === 'ko' ? '💀'
      : f.state === 'charge' ? '⚡'
      : f.state === 'dash' ? '💨' : '';
    if (icon) {
      ctx.font = '22px serif';
      ctx.textAlign = 'center';
      ctx.fillText(icon, f.x + FIGHTER_WIDTH/2, f.y - 10);
    }
  }

  private renderIcarusStance(f: Fighter) {
    if (!f.hasIcarusStyle) return;
    const intensity = Math.max(f.icarusStanceBlend, f.attackVariant === 'normal' ? 0 : 0.75);
    if (intensity < 0.04) return;

    const { ctx } = this;
    const t = performance.now() / 1000;
    const cx = f.x + FIGHTER_WIDTH / 2;
    const cy = f.y + FIGHTER_HEIGHT * 0.56;
    const back = f.facingRight ? -1 : 1;
    const attackFlare = f.attackVariant === 'skybreaker' ? 1.35 : f.attackVariant === 'normal' ? 1 : 1.16;

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = (0.14 + 0.20 * intensity) * attackFlare;
    const glow = ctx.createRadialGradient(cx, cy, 10, cx, cy, 84);
    glow.addColorStop(0, 'rgba(255,238,160,0.75)');
    glow.addColorStop(0.38, 'rgba(255,126,24,0.32)');
    glow.addColorStop(1, 'rgba(255,56,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 78, 58, 0, 0, Math.PI * 2);
    ctx.fill();

    // Three tapered flame feathers create Ryu's recognizable wing-like guard.
    ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      const y = cy - 26 + i * 22;
      const lift = 30 + i * 12 + Math.sin(t * 8 + i) * 7;
      const tipX = cx + back * (58 + i * 18);
      const tipY = y - lift;
      ctx.strokeStyle = i === 0 ? '#fff0a8' : i === 1 ? '#ff9a1a' : '#ff4b12';
      ctx.shadowColor = '#ff5a12';
      ctx.shadowBlur = 16;
      ctx.lineWidth = 3.4 - i * 0.45;
      ctx.beginPath();
      ctx.moveTo(cx + back * 10, y + 10);
      ctx.quadraticCurveTo(cx + back * (26 + i * 8), y - lift * 0.1, tipX, tipY);
      ctx.stroke();
    }
    ctx.restore();
  }

  private renderAphroditeStance(f: Fighter) {
    if (!f.hasAphroditeStyle) return;
    const intensity = Math.max(f.aphroditeStanceBlend, f.attackVariant === 'normal' ? 0 : 0.75);
    if (intensity < 0.04) return;

    const { ctx } = this;
    const t = performance.now() / 1000;
    const cx = f.x + FIGHTER_WIDTH / 2;
    const cy = f.y + FIGHTER_HEIGHT * 0.55;
    const spin = f.attackVariant === 'venus-spin' ? 1.4 : 1;

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = (0.13 + 0.18 * intensity) * spin;
    const glow = ctx.createRadialGradient(cx, cy, 8, cx, cy, 76);
    glow.addColorStop(0, 'rgba(255,236,248,0.72)');
    glow.addColorStop(0.38, 'rgba(255,112,183,0.30)');
    glow.addColorStop(1, 'rgba(255,48,150,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 70, 55, 0, 0, Math.PI * 2);
    ctx.fill();

    // Orbiting petals make the stance feel light on its feet and circular.
    for (let i = 0; i < 6; i++) {
      const angle = t * (2.7 * spin) + i * Math.PI / 3;
      const rx = 42 + (i % 2) * 10;
      const ry = 28 + ((i + 1) % 2) * 8;
      const px = cx + Math.cos(angle) * rx;
      const py = cy + Math.sin(angle) * ry;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(angle + Math.PI * 0.5);
      ctx.fillStyle = i % 2 ? '#ff71b4' : '#ffd1ea';
      ctx.shadowColor = '#ff4fa3';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.ellipse(0, 0, 7, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  private renderTempestStance(f: Fighter) {
    if (!f.hasTempestStyle) return;
    const intensity = Math.max(f.tempestStanceBlend, f.attackVariant === 'normal' ? 0 : 0.72);
    if (intensity < 0.04) return;

    const { ctx } = this;
    const t = performance.now() / 1000;
    const cx = f.x + FIGHTER_WIDTH / 2;
    const cy = f.y + FIGHTER_HEIGHT * 0.58;
    const forward = f.facingRight ? 1 : -1;

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = 0.12 + 0.16 * intensity;
    const glow = ctx.createRadialGradient(cx, cy, 8, cx, cy, 78);
    glow.addColorStop(0, 'rgba(232,253,255,0.78)');
    glow.addColorStop(0.42, 'rgba(98,222,255,0.30)');
    glow.addColorStop(1, 'rgba(43,161,255,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 72, 52, 0, 0, Math.PI * 2);
    ctx.fill();

    // Three narrow wind lines give Kai a compact, forward-ready silhouette.
    ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      const y = cy - 24 + i * 21;
      const drift = Math.sin(t * 7 + i * 1.7) * 8;
      ctx.strokeStyle = i === 1 ? '#e6fdff' : '#77e7ff';
      ctx.shadowColor = '#55dfff';
      ctx.shadowBlur = 13;
      ctx.lineWidth = 2.6 - i * 0.35;
      ctx.beginPath();
      ctx.moveTo(cx - forward * 24, y + drift * 0.25);
      ctx.quadraticCurveTo(cx + forward * 8, y - 10 - drift, cx + forward * (52 + i * 12), y - 4 + drift * 0.35);
      ctx.stroke();
    }
    if (f.isTempestGuarding()) {
      ctx.globalAlpha = 0.8;
      ctx.strokeStyle = '#ffffff';
      ctx.shadowColor = '#aef5ff';
      ctx.shadowBlur = 24;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, 50, t * 8, t * 8 + Math.PI * 1.55);
      ctx.stroke();
    }
    ctx.restore();
  }

  private renderDominionStance(f: Fighter) {
    if (!f.hasDominionStyle) return;
    const intensity = f.dominionStanceBlend;
    if (intensity < 0.04) return;

    const { ctx } = this;
    const t = performance.now() / 1000;
    const cx = f.centerX;
    const cy = f.y + FIGHTER_HEIGHT * 0.52;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = 0.10 + intensity * 0.18;
    const aura = ctx.createRadialGradient(cx, cy, 10, cx, cy, 90);
    aura.addColorStop(0, 'rgba(240,220,255,0.52)');
    aura.addColorStop(0.40, 'rgba(142,42,230,0.27)');
    aura.addColorStop(1, 'rgba(48,0,94,0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 82, 66, 0, 0, Math.PI * 2);
    ctx.fill();

    // Slow, vertical shadow bands keep the stance imposing rather than frantic.
    for (let i = 0; i < 3; i++) {
      const x = cx + (i - 1) * 32 + Math.sin(t * 1.8 + i) * 5;
      ctx.globalAlpha = 0.22 + intensity * 0.12;
      ctx.strokeStyle = i === 1 ? '#e5c9ff' : '#923eff';
      ctx.shadowColor = '#7c22d5';
      ctx.shadowBlur = 15;
      ctx.lineWidth = 2.7;
      ctx.beginPath();
      ctx.moveTo(x, cy + 38);
      ctx.quadraticCurveTo(x + Math.sin(t * 2 + i) * 10, cy, x + (i - 1) * 8, cy - 52);
      ctx.stroke();
    }
    ctx.restore();
  }

  private renderGrabStruggle(f: Fighter) {
    if (!f.grabbedBy) return;
    const { ctx } = this;
    const holder = f.grabbedBy;
    const t = performance.now() / 1000;
    const shoulderY = f.y + FIGHTER_HEIGHT * 0.30;
    const handY = holder.y + FIGHTER_HEIGHT * 0.35;
    const dir = holder.centerX > f.centerX ? 1 : -1;

    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = '#effaff';
    ctx.shadowColor = '#bcdfff';
    ctx.shadowBlur = 7;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    for (const arm of [-1, 1]) {
      const sx = f.centerX + arm * FIGHTER_WIDTH * 0.20;
      const elbowX = f.centerX + dir * 24 + arm * 18 + Math.sin(t * 12 + arm) * 4;
      const elbowY = shoulderY + 38 + Math.sin(t * 10 + arm) * 5;
      const handX = holder.centerX - dir * FIGHTER_WIDTH * 0.22;
      ctx.beginPath();
      ctx.moveTo(sx, shoulderY);
      ctx.quadraticCurveTo(elbowX, elbowY, handX, handY);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(handX, handY, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  private renderGalvaLightning(f: Fighter) {
    if (!f.hasLightningBlast) return;
    const isPunch = f.state === 'punch' || f.state === 'airpunch';
    const isKick = f.state === 'kick' || f.state === 'airkick' || f.state === 'roundhouse' || f.state === 'sweep';
    if (!isPunch && !isKick && !f.boostActive) return;

    const { ctx } = this;
    const t = performance.now() / 1000;
    const dir = f.facingRight ? 1 : -1;
    const bodyX = f.centerX;
    const bodyY = f.y + FIGHTER_HEIGHT * 0.50;

    const bolt = (sx: number, sy: number, ex: number, ey: number, width: number, alpha: number) => {
      const mx = (sx + ex) * 0.5 + (Math.random() - 0.5) * 14;
      const my = (sy + ey) * 0.5 + (Math.random() - 0.5) * 16;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(mx, my);
      ctx.lineTo(ex, ey);
      ctx.stroke();
    };

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.strokeStyle = '#9af3ff';
    ctx.shadowColor = '#00cfff';
    ctx.shadowBlur = f.boostActive ? 26 : 16;
    ctx.lineCap = 'round';

    // Full power makes Galva's body continuously arc with electricity.
    if (f.boostActive) {
      ctx.globalAlpha = 0.30 + Math.sin(t * 16) * 0.10;
      const aura = ctx.createRadialGradient(bodyX, bodyY, 10, bodyX, bodyY, 98);
      aura.addColorStop(0, 'rgba(230,255,255,0.55)');
      aura.addColorStop(0.48, 'rgba(0,207,255,0.22)');
      aura.addColorStop(1, 'rgba(0,120,255,0)');
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.ellipse(bodyX, bodyY, 82, 116, 0, 0, Math.PI * 2);
      ctx.fill();
      for (let i = 0; i < 9; i++) {
        const angle = t * 8 + (i / 9) * Math.PI * 2;
        const sx = bodyX + Math.cos(angle) * 28;
        const sy = bodyY + Math.sin(angle) * 54;
        const ex = bodyX + Math.cos(angle) * (48 + (i % 3) * 12);
        const ey = bodyY + Math.sin(angle) * (76 + (i % 2) * 12);
        bolt(sx, sy, ex, ey, 2.2, 0.55);
      }
    }

    // Punches leave a focused electrical fan trailing backward from the fist.
    if (isPunch) {
      const handX = bodyX + dir * FIGHTER_WIDTH * 0.43;
      const handY = f.y + FIGHTER_HEIGHT * 0.34;
      for (let i = 0; i < 5; i++) {
        const spread = (i - 2) * 13;
        bolt(handX, handY, handX - dir * (38 + i * 8), handY + spread, 2.5 - i * 0.16, 0.72);
      }
    }

    // Kicks pull longer electrical arcs behind the moving leg.
    if (isKick) {
      const footX = bodyX + dir * FIGHTER_WIDTH * 0.46;
      const footY = f.y + FIGHTER_HEIGHT * 0.70;
      for (let i = 0; i < 4; i++) {
        bolt(footX, footY + (i - 1.5) * 8, footX - dir * (52 + i * 13), footY + (i - 1.5) * 16, 2.8 - i * 0.25, 0.68);
      }
    }
    ctx.restore();
  }

  private renderGroundSlam(f: Fighter) {
    if (!f.groundSlamActive) return;
    const { ctx } = this;
    const t = performance.now() / 1000;
    const progress = 1 - Math.max(0, Math.min(1, f.groundSlamTimer / 0.72));
    const cx = f.centerX;
    const groundY = GROUND_Y - 8;
    const impactScale = f.groundSlamLanded ? 1 : Math.min(1, progress * 2.7);

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.shadowColor = '#00cfff';
    ctx.shadowBlur = 28;

    // A narrow bolt descends into the point of impact before the shockwave fires.
    ctx.globalAlpha = 0.42 + Math.sin(t * 34) * 0.16;
    ctx.strokeStyle = '#c9fbff';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(cx + Math.sin(t * 20) * 10, groundY - 190);
    ctx.lineTo(cx - 16, groundY - 118);
    ctx.lineTo(cx + 14, groundY - 54);
    ctx.lineTo(cx, groundY);
    ctx.stroke();

    const radial = ctx.createRadialGradient(cx, groundY, 0, cx, groundY, 150 * impactScale);
    radial.addColorStop(0, 'rgba(255,255,255,0.92)');
    radial.addColorStop(0.2, 'rgba(88,234,255,0.62)');
    radial.addColorStop(1, 'rgba(0,170,255,0)');
    ctx.fillStyle = radial;
    ctx.globalAlpha = 0.86;
    ctx.beginPath();
    ctx.ellipse(cx, groundY, 150 * impactScale, 38 * impactScale, 0, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + t * 5;
      const r = 46 + impactScale * 62;
      ctx.globalAlpha = 0.60;
      ctx.strokeStyle = i % 2 ? '#5eeaff' : '#ffffff';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * 12, groundY + Math.sin(a) * 6);
      ctx.lineTo(cx + Math.cos(a + 0.15) * r * 0.58, groundY + Math.sin(a + 0.15) * 10);
      ctx.lineTo(cx + Math.cos(a) * r, groundY + Math.sin(a) * 16);
      ctx.stroke();
    }
    ctx.restore();
  }

  private renderDustParticles(f: Fighter) {
    const { ctx } = this;
    for (const p of f.dustParticles) {
      const a = (p.life / p.maxLife) * 0.5;
      ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#c8a87a';
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size * (p.life / p.maxLife), p.size * 0.45 * (p.life / p.maxLife), 0, 0, Math.PI*2);
      ctx.fill(); ctx.restore();
    }
  }

  private skyParticles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; color: string }[] = [];
  private skyTimer = 0;
  private renderSkyParticles() {
    const { ctx, canvas } = this;
    this.skyTimer -= 1/60;
    if (this.skyTimer <= 0) {
      this.skyTimer = 0.5 + Math.random() * 0.7;
      const colors = ['#ff9966','#ffcc88','#ff6699','#ffddaa','#ffe4b5'];
      this.skyParticles.push({ x: Math.random() * canvas.width, y: 20 + Math.random() * (GROUND_Y * 0.55), vx: (Math.random() - 0.3) * 22, vy: Math.random() * 7 + 3, size: 2 + Math.random() * 4, alpha: 0.12 + Math.random() * 0.22, color: colors[Math.floor(Math.random() * colors.length)] });
    }
    this.skyParticles = this.skyParticles.filter(p => {
      p.x += p.vx / 60; p.y += p.vy / 60; p.alpha -= 0.0007;
      if (p.x < 0 || p.x > canvas.width || p.y > GROUND_Y || p.alpha <= 0) return false;
      ctx.save(); ctx.globalAlpha = p.alpha; ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.ellipse(p.x, p.y, p.size, p.size * 0.5, 0, 0, Math.PI*2); ctx.fill(); ctx.restore();
      return true;
    });
  }

  private renderHairCloth(f: Fighter) {
    if (!f.hairStrands || !f.hairStrands.length) return;
    const { ctx } = this;
    const headX = f.x + FIGHTER_WIDTH / 2;
    const headY = f.y + 20;
    const isRyu = f.name === 'RYU';
    const hairColor = isRyu ? '#8B4513' : '#ff69b4';
    const clothColor = isRyu ? '#f5c842' : '#e8e8e8';
    ctx.save();
    ctx.globalAlpha = 0.7;
    for (const s of f.hairStrands) {
      ctx.beginPath();
      ctx.moveTo(headX, headY);
      ctx.quadraticCurveTo(headX + s.ox * 0.55, headY + s.oy * 0.5 - 3, headX + s.ox, headY + s.oy);
      ctx.strokeStyle = hairColor; ctx.lineWidth = 1.8; ctx.lineCap = 'round'; ctx.stroke();
    }
    const hemY = f.y + FIGHTER_HEIGHT * 0.62;
    const pts = f.clothPoints;
    if (pts && pts.length >= 2) {
      ctx.beginPath();
      ctx.moveTo(f.x + pts[0].ox + FIGHTER_WIDTH/2, hemY + pts[0].oy * 0.28);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(f.x + pts[i].ox + FIGHTER_WIDTH/2, hemY + pts[i].oy * 0.28);
      ctx.strokeStyle = clothColor; ctx.lineWidth = 2.2; ctx.globalAlpha = 0.38; ctx.stroke();
    }
    ctx.restore();
  }

  private renderLightningBarrier(ctx: CanvasRenderingContext2D, f: Fighter) {
    if (!f.lightningBarrierActive) return;
    const cx = f.x + FIGHTER_WIDTH / 2;
    const cy = f.y + FIGHTER_HEIGHT / 2;
    const r = 110;
    const t = performance.now() / 1000;
    ctx.save();
    ctx.globalAlpha = 0.35 + 0.15 * Math.sin(t * 12);
    // Outer glow ring
    const grad = ctx.createRadialGradient(cx, cy, r * 0.7, cx, cy, r);
    grad.addColorStop(0, 'rgba(100,200,255,0.0)');
    grad.addColorStop(0.7, 'rgba(80,180,255,0.4)');
    grad.addColorStop(1, 'rgba(150,230,255,0.8)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 6 + 4 * Math.sin(t * 8);
    ctx.shadowColor = '#88eeff';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    // Lightning arcs
    for (let i = 0; i < 6; i++) {
      const a1 = (i / 6) * Math.PI * 2 + t * 3;
      const a2 = a1 + 0.4 + 0.2 * Math.sin(t * 7 + i);
      ctx.strokeStyle = 'rgba(180,240,255,0.9)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a1) * r * 0.85, cy + Math.sin(a1) * r * 0.85);
      ctx.lineTo(cx + Math.cos(a2) * r, cy + Math.sin(a2) * r);
      ctx.stroke();
    }
    ctx.restore();
  }

  private renderBg() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (this.bgImage) {
      ctx.drawImage(this.bgImage, 0, 0, canvas.width, canvas.height);
    } else {
      const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
      g.addColorStop(0, '#1a0a00'); g.addColorStop(1, '#000');
      ctx.fillStyle = g; ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    this.renderFighter(this.p1, this.p1Image);
    this.renderFighter(this.p2, this.p2Image);
  }

  private renderCinematic() {
    this.cinematic.render(this.ctx, this.canvas.width, this.canvas.height);
  }

  private renderCountdown() {
    const { ctx, canvas } = this;
    const label = this.countdown > 0 ? String(this.countdown) : 'FIGHT!';
    const progress = 1 - Math.max(0, Math.min(1, this.countdownTimer));
    const sc = 0.7 + progress * 0.5;
    const alpha = this.countdown > 0
      ? Math.min(1, progress * 4)
      : Math.max(0, 1 - progress * 2.5);
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    const fontSize = Math.round(160 * sc);
    ctx.font = `bold ${fontSize}px Impact, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = this.countdown > 0 ? '#ffffff' : '#f59e0b';
    ctx.shadowColor = this.countdown > 0 ? '#aaaaff' : '#f59e0b';
    ctx.shadowBlur = 50;
    ctx.fillText(label, canvas.width / 2, canvas.height / 2);
    ctx.restore();
  }
}
