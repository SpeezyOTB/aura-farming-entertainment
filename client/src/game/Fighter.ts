import {
  AIR_MOVE_SPEED, BACKDASH_DURATION, BACKDASH_SPEED,
  BOOST_DAMAGE_MULT, BOOST_DURATION, CHARGE_RATE,
  DASH_DURATION, DASH_SPEED, ENERGY_PER_KICK, ENERGY_PER_PUNCH,
  FIGHTER_HEIGHT, FIGHTER_WIDTH, GRAVITY, GROUND_Y,
  JUMP_VELOCITY, KICK_DAMAGE, KICK_DURATION, KICK_REACH,
  KICK_HIT_STUN, KICK_KNOCKBACK, KICK_LAUNCH_VY, KICK_STARTUP, KICK_ACTIVE,
  MAX_ENERGY, MAX_HEALTH, MOVE_SPEED, PUNCH_DAMAGE, PUNCH_DURATION, PUNCH_REACH,
  PUNCH_HIT_STUN, PUNCH_KNOCKBACK, PUNCH_STARTUP, PUNCH_ACTIVE,
  STAGE_LEFT, STAGE_RIGHT, BLOCK_DAMAGE_MULT,
  BACKJUMP_VX, BACKJUMP_VY, LAND_SQUASH,
  PRONE_RECOVERY_TIME, CHARGED_PUNCH_MULT, CHARGED_KICK_MULT,
  CHARGE_HOLD_TIME, COUNTER_WINDOW,
} from './constants';
import type { FighterConfig, FighterState } from './types';

// ── Hair strand simulation ─────────────────────────────────────
interface HairStrand {
  ox: number; oy: number;  // offset from head center
  vx: number; vy: number;
  len: number;
}

// ── Cloth point simulation ─────────────────────────────────────
interface ClothPoint {
  ox: number; oy: number;
  vx: number; vy: number;
}

export class Fighter {
  id: 1 | 2;
  name: string;
  title: string;
  color: string;
  energyColor: string;
  spriteUrl: string;
  iconUrl: string;

  x: number;
  y: number;
  vx = 0;
  vy = 0;
  facingRight: boolean;

  health: number;
  energy = 0;
  state: FighterState = 'idle';
  stateTimer = 0;
  attackPhase: 'startup' | 'active' | 'recovery' | 'none' = 'none';
  isOnGround = true;
  isBlocking = false;
  boostActive = false;
  boostTimer = 0;
  attackLanded = false;
  hitFlash = 0;
  consecutiveHits = 0;  // counts toward full power
  boostCooldown = 0;    // 32s cooldown after boost expires
  cinematicFired = false; // prevent cinematic from re-triggering
  squashTimer = 0;  // landing squash effect
  counterWindowTimer = 0; // time window after being hit where counter is allowed
  chargeHoldTimer = 0;    // how long punch/kick button has been held
  isChargingAttack = false; // true while holding for a charged attack
  chargedAttackType: 'punch' | 'kick' | null = null;
  lastVx = 0;       // for hair/cloth simulation
  lastVy = 0;

  // Double-tap dash detection
  private lastTapDir: 'left' | 'right' | null = null;
  private lastTapTime = 0;
  private dashCooldown = 0;

  // Particles
  particles: Particle[] = [];
  dustParticles: DustParticle[] = [];

  // Hair strands (simulated)
  _startX = 200;
  hairStrands: HairStrand[] = [];
  // Cloth points (gi/clothing)
  clothPoints: ClothPoint[] = [];
  mouthOpen: number = 0;
  private speakTimer: number = 0;
  private speakDuration: number = 0;

  // ── Per-character stat overrides ──────────────────────────
  readonly maxHealth: number;
  readonly punchDamageBonus: number;
  readonly kickDamageBonus: number;
  readonly moveSpeedMult: number;
  readonly jumpVelocityMult: number;
  readonly boostDurationOverride: number | null;
  readonly boostInfinite: boolean;
  readonly hasLightningBlast: boolean;
  readonly hasShadowBarrier: boolean;
  readonly hasAerialKick: boolean;
  readonly hasTornado: boolean;
  readonly hasGrab: boolean;
  readonly hasLightningBarrier: boolean;
  readonly hasTeleport: boolean;
  readonly hasIcarusStyle: boolean;
  readonly hasAphroditeStyle: boolean;
  readonly hasTempestStyle: boolean;

  // ── Ryu: Icarus fighting style ─────────────────────────────
  // Ryu settles into a low guard between exchanges, then converts that coiled
  // posture into short, flame-laced lunges. This is presentation and tempo,
  // not a defensive invulnerability state.
  icarusStanceBlend = 0;
  aphroditeStanceBlend = 0;
  tempestStanceBlend = 0;
  attackVariant: 'normal' | 'icarus-jab' | 'phoenix-heel' | 'skybreaker' | 'ashen-sweep' | 'rose-jab' | 'petal-kick' | 'venus-spin' | 'silk-sweep' | 'wind-jab' | 'tempest-kick' | 'cyclone-wheel' | 'reed-sweep' | 'tempest-counter' = 'normal';
  comboDamageOverride: number | null = null;

  // ── Ability state ─────────────────────────────────────────
  barrierActive = false;
  barrierTimer = 0;
  barrierCooldown = 0;
  lightningBarrierTimer = 0;  // auto-fires every 15s for Galva
  lightningBarrierActive = false;
  lightningBarrierCooldown = 0;
  grabTarget: Fighter | null = null;  // Shuraku grab target
  throwTimer = 0;
  tornadoActive = false;
  tornadoTimer = 0;
  tempestGuardTimer = 0;
  tempestGuardCooldown = 0;
  // Galva lightning teleport
  teleportCooldown = 0;     // 15s cooldown
  teleportPhase: 'none' | 'vanish' | 'reappear' = 'none';
  teleportTimer = 0;
  teleportFlashX = 0;       // x where vanish flash plays
  teleportFlashY = 0;
  teleportReappearX = 0;    // x where reappear flash plays
  teleportReappearY = 0;
  teleportFlashAlpha = 0;

  // Projectiles
  projectiles: {
    x: number; y: number; vx: number; vy: number;
    color: string; radius: number; ttl: number; damage: number;
  }[] = [];


  constructor(cfg: FighterConfig) {
    this.id = cfg.id;
    this.name = cfg.name;
    this.title = cfg.title;
    this.color = cfg.color;
    this.energyColor = cfg.energyColor;
    this.spriteUrl = cfg.spriteUrl;
    this.iconUrl = cfg.iconUrl;
    this._startX = cfg.startX;
    this.x = cfg.startX;
    this.y = GROUND_Y - FIGHTER_HEIGHT;
    this.facingRight = cfg.facingRight;
    this.maxHealth         = cfg.maxHealth ?? MAX_HEALTH;
    this.health            = this.maxHealth;
    this.punchDamageBonus  = cfg.punchDamageBonus ?? 0;
    this.kickDamageBonus   = cfg.kickDamageBonus ?? 0;
    this.moveSpeedMult     = cfg.moveSpeedMult ?? 1.0;
    this.jumpVelocityMult  = cfg.jumpVelocityMult ?? 1.0;
    this.boostDurationOverride = cfg.boostDuration ?? null;
    this.boostInfinite     = cfg.boostInfinite ?? false;
    this.hasLightningBlast = cfg.hasLightningBlast ?? false;
    this.hasShadowBarrier  = cfg.hasShadowBarrier ?? false;
    this.hasAerialKick     = cfg.hasAerialKick ?? false;
    this.hasTornado        = cfg.hasTornado ?? false;
    this.hasGrab           = cfg.hasGrab ?? false;
    this.hasLightningBarrier = cfg.hasLightningBarrier ?? false;
    this.hasTeleport = cfg.hasTeleport ?? false;
    this.hasIcarusStyle = cfg.hasIcarusStyle ?? false;
    this.hasAphroditeStyle = cfg.hasAphroditeStyle ?? false;
    this.hasTempestStyle = cfg.hasTempestStyle ?? false;
    this.initHairAndCloth();
  }

  private initHairAndCloth() {
    // 6 hair strands around the head
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI - Math.PI * 0.1;
      this.hairStrands.push({
        ox: Math.cos(angle) * 18,
        oy: Math.sin(angle) * 10 - 8,
        vx: 0, vy: 0,
        len: 14 + Math.random() * 12,
      });
    }
    // 4 cloth points for gi/clothing hem
    for (let i = 0; i < 4; i++) {
      this.clothPoints.push({
        ox: (i / 3 - 0.5) * FIGHTER_WIDTH * 0.8,
        oy: FIGHTER_HEIGHT * 0.55,
        vx: 0, vy: 0,
      });
    }
  }

  get centerX() { return this.x + FIGHTER_WIDTH / 2; }
  get isAlive()    { return this.health > 0; }
  get isAttacking(){ return this.state === 'punch' || this.state === 'kick' || this.state === 'roundhouse' || this.state === 'sweep' || this.state === 'airpunch' || this.state === 'airkick'; }
  get isStunned()  { return this.state === 'hit' || this.state === 'launch' || this.state === 'airborne' || this.state === 'grabbed' || this.state === 'thrown'; }
  get isProne()    { return this.state === 'prone'; }
  get isDashing()  { return this.state === 'dash' || this.state === 'backdash'; }

  // ── Movement ─────────────────────────────────────────────────
  moveLeft(dt: number) {
    if (!this.canMove()) return;
    if (this.isOnGround) {
      this.vx = -MOVE_SPEED * this.moveSpeedMult;
      this.state = 'walk';
    } else {
      this.vx = Math.max(this.vx - AIR_MOVE_SPEED * dt * 8, -AIR_MOVE_SPEED);
    }
  }
  moveRight(dt: number) {
    if (!this.canMove()) return;
    if (this.isOnGround) {
      this.vx = MOVE_SPEED * this.moveSpeedMult;
      this.state = 'walk';
    } else {
      this.vx = Math.min(this.vx + AIR_MOVE_SPEED * dt * 8, AIR_MOVE_SPEED);
    }
  }

  // Double-tap dash
  tryDash(dir: 'left' | 'right', now: number): boolean {
    if (!this.canMove() || !this.isOnGround || this.dashCooldown > 0) return false;
    if (this.lastTapDir === dir && now - this.lastTapTime < 0.28) {
      // Dash!
      this.vx = dir === 'right' ? DASH_SPEED : -DASH_SPEED;
      this.state = 'dash';
      this.stateTimer = DASH_DURATION;
      this.dashCooldown = 0.5;
      this.lastTapDir = null;
      this.spawnDashDust(dir);
      return true;
    }
    this.lastTapDir = dir;
    this.lastTapTime = now;
    return false;
  }

  // Back dash (away from opponent)
  backdash(): boolean {
    if (!this.canMove() || !this.isOnGround || this.dashCooldown > 0) return false;
    this.vx = this.facingRight ? BACKDASH_SPEED : -BACKDASH_SPEED;
    this.state = 'backdash';
    this.stateTimer = BACKDASH_DURATION;
    this.dashCooldown = 0.6;
    this.spawnDashDust(this.facingRight ? 'left' : 'right');
    return true;
  }

  jump() {
    if (!this.canMove() || !this.isOnGround) return false;
    this.vy = JUMP_VELOCITY * this.jumpVelocityMult;
    this.isOnGround = false;
    this.state = 'jump';
    this.spawnDashDust(this.facingRight ? 'right' : 'left');
    return true;
  }

  // Back jump — jump away from opponent
  forwardJump(): boolean {
    if (!this.isOnGround || !this.canMove()) return false;
    const mult = this.jumpVelocityMult ?? 1.0;
    this.vy = JUMP_VELOCITY * mult;
    this.vx = (this.facingRight ? 1 : -1) * 280; // leap forward
    this.isOnGround = false;
    this.state = 'jump';
    return true;
  }

  backJump(): boolean {
    if (!this.canMove() || !this.isOnGround) return false;
    this.vy = BACKJUMP_VY;
    this.vx = this.facingRight ? BACKJUMP_VX : -BACKJUMP_VX;
    this.isOnGround = false;
    this.state = 'jump';
    this.spawnDashDust(this.facingRight ? 'left' : 'right');
    return true;
  }

  startBlock() {
    if (!this.canMove()) return;
    this.isBlocking = true;
    this.state = 'block';
  }
  stopBlock() {
    this.isBlocking = false;
    if (this.state === 'block') this.state = 'idle';
  }

  // Charge energy
  startCharge() {
    if (!this.canMove() || !this.isOnGround) return;
    this.state = 'charge';
  }
  stopCharge() {
    if (this.state === 'charge') this.state = 'idle';
  }

  punch() {
    if (!this.canAttack()) return false;
    this.state = this.isOnGround ? 'punch' : 'airpunch';
    this.stateTimer = PUNCH_DURATION;
    this.attackPhase = 'startup';
    this.attackLanded = false;
    this.comboDamageOverride = null;
    this.attackVariant = this.hasIcarusStyle && this.isOnGround && this.icarusStanceBlend > 0.25 ? 'icarus-jab'
      : this.hasAphroditeStyle && this.isOnGround && this.aphroditeStanceBlend > 0.18 ? 'rose-jab'
      : this.hasTempestStyle && this.isOnGround && this.tempestStanceBlend > 0.18 ? 'wind-jab'
      : 'normal';
    if (this.attackVariant === 'icarus-jab') {
      this.vx += (this.facingRight ? 1 : -1) * 85;
      this.spawnIcarusEmbers(5, '#ff7a18');
    }
    if (this.attackVariant === 'rose-jab') {
      this.vx += (this.facingRight ? 1 : -1) * 60;
      this.spawnAphroditePetals(5, '#ff79be');
    }
    if (this.attackVariant === 'wind-jab') {
      this.vx += (this.facingRight ? 1 : -1) * 50;
      this.spawnTempestWind(4, '#b9f5ff');
    }
    return true;
  }
  kick() {
    if (!this.canAttack()) return false;
    this.state = this.isOnGround ? 'kick' : 'airkick';
    this.stateTimer = KICK_DURATION;
    this.attackPhase = 'startup';
    this.attackLanded = false;
    this.comboDamageOverride = null;
    this.attackVariant = this.hasIcarusStyle && this.isOnGround ? 'phoenix-heel'
      : this.hasAphroditeStyle && this.isOnGround ? 'petal-kick'
      : this.hasTempestStyle && this.isOnGround ? 'tempest-kick'
      : 'normal';
    if (this.attackVariant === 'phoenix-heel') this.spawnIcarusEmbers(4, '#ffb11b');
    if (this.attackVariant === 'petal-kick') this.spawnAphroditePetals(5, '#ff6fae');
    if (this.attackVariant === 'tempest-kick') this.spawnTempestWind(6, '#8ceeff');
    return true;
  }

  // Roundhouse: forward + kick — wider arc, more knockback, slightly slower
  roundhouse(): boolean {
    if (!this.canAttack() || !this.isOnGround) return false;
    this.state = 'roundhouse';
    this.stateTimer = KICK_DURATION * 1.25;
    this.attackPhase = 'startup';
    this.attackLanded = false;
    this.comboDamageOverride = null;
    this.attackVariant = this.hasIcarusStyle ? 'skybreaker' : this.hasAphroditeStyle ? 'venus-spin' : this.hasTempestStyle ? 'cyclone-wheel' : 'normal';
    if (this.attackVariant === 'skybreaker') {
      this.vx += (this.facingRight ? 1 : -1) * 125;
      this.spawnIcarusEmbers(10, '#ff6b1a');
    }
    if (this.attackVariant === 'venus-spin') {
      this.vx += (this.facingRight ? 1 : -1) * 90;
      this.spawnAphroditePetals(12, '#ff4da0');
    }
    if (this.attackVariant === 'cyclone-wheel') {
      this.vx += (this.facingRight ? 1 : -1) * 105;
      this.spawnTempestWind(12, '#6de4ff');
    }
    return true;
  }

  // Sweep: down + kick — low hit, trips opponent into prone
  sweep(): boolean {
    if (!this.canAttack() || !this.isOnGround) return false;
    this.state = 'sweep';
    this.stateTimer = KICK_DURATION * 1.1;
    this.attackPhase = 'startup';
    this.attackLanded = false;
    this.comboDamageOverride = null;
    this.attackVariant = this.hasIcarusStyle ? 'ashen-sweep' : this.hasAphroditeStyle ? 'silk-sweep' : this.hasTempestStyle ? 'reed-sweep' : 'normal';
    if (this.attackVariant === 'ashen-sweep') this.spawnIcarusEmbers(8, '#ff8a24');
    if (this.attackVariant === 'silk-sweep') this.spawnAphroditePetals(8, '#ffc0e6');
    if (this.attackVariant === 'reed-sweep') this.spawnTempestWind(8, '#9cf2ff');
    return true;
  }

  // ── Hit reception ─────────────────────────────────────────────
  receiveHit(baseDamage: number, attackerBoosted: boolean, isKick: boolean, isChargedAttack = false): number {
    if (!this.isAlive || this.state === 'ko') return 0;
    // Prone = completely immune to damage
    if (this.state === 'prone') return 0;
    // Blocking = zero damage
    if (this.isBlocking) {
      this.hitFlash = 0.05;
      return 0;
    }
    let dmg = baseDamage;
    if (attackerBoosted) dmg *= BOOST_DAMAGE_MULT;
    // Charged attacks deal bonus damage
    if (isChargedAttack) dmg *= isKick ? CHARGED_KICK_MULT : CHARGED_PUNCH_MULT;
    dmg = Math.max(1, Math.round(dmg));
    this.health = Math.max(0, this.health - dmg);
    this.hitFlash = 0.1;

    const stun = isKick ? KICK_HIT_STUN : PUNCH_HIT_STUN;
    const kb   = isKick ? KICK_KNOCKBACK : PUNCH_KNOCKBACK;

    // Charged attack = knockdown into prone
    if (isChargedAttack && this.isOnGround) {
      this.state = 'prone';
      this.stateTimer = PRONE_RECOVERY_TIME;
      this.vx = (this.facingRight ? -1 : 1) * kb * 1.8;
      this.counterWindowTimer = 0;
    } else if (isKick && attackerBoosted && this.isOnGround) {
      // Boosted kick = launch
      this.state = 'launch';
      this.vy = KICK_LAUNCH_VY;
      this.vx = (this.facingRight ? -1 : 1) * kb * 0.5;
      this.isOnGround = false;
      this.stateTimer = 0.8;
      this.counterWindowTimer = 0;
    } else {
      this.state = 'hit';
      this.stateTimer = stun;
      this.vx = (this.facingRight ? -1 : 1) * kb;
      // Open counter window — defender can punch/kick back during stun
      this.counterWindowTimer = COUNTER_WINDOW;
    }

    // Taking a hit breaks consecutive hit streak
    this.consecutiveHits = 0;
    this.energy = 0;

    if (this.health <= 0) { this.state = 'ko'; this.stateTimer = 999; }
    return dmg;
  }

  // Called by input system when player presses get-up (X key)
  tryGetUp(): boolean {
    if (this.state !== 'prone') return false;
    this.state = 'idle';
    this.stateTimer = 0;
    this.vx = 0;
    return true;
  }

  // ── Energy / Boost ────────────────────────────────────────────
  gainEnergy(_amount: number) {
    // Energy is now driven by consecutive hits — see onAttackLanded
  }
  activateBoost() {
    if (this.boostCooldown > 0) return;
    this.boostActive = true;
    this.boostTimer = this.boostInfinite ? 9999 : (this.boostDurationOverride ?? BOOST_DURATION);
    this.energy = MAX_ENERGY;
    this.consecutiveHits = 0;
    this.cinematicFired = false; // will be set true by GameEngine after cinematic triggers
  }
  reset() {
    this.health = this.maxHealth;
    this.energy = 0;
    this.boostActive = false;
    this.boostTimer = 0;
    this.boostCooldown = 0;
    this.consecutiveHits = 0;
    this.cinematicFired = false;
    this.state = 'idle';
    this.stateTimer = 0;
    this.x = this._startX;
    this.y = GROUND_Y - FIGHTER_HEIGHT;
    this.vx = 0;
    this.vy = 0;
    this.isOnGround = true;
    this.isBlocking = false;
    this.attackLanded = false;
    this.hitFlash = 0;
    this.counterWindowTimer = 0;
    this.chargeHoldTimer = 0;
    this.lightningBarrierActive = false;
    this.lightningBarrierTimer = 0;
    this.lightningBarrierCooldown = 0;
    this.grabTarget = null;
    this.teleportCooldown = 0;
    this.teleportPhase = 'none';
    this.teleportTimer = 0;
    this.isChargingAttack = false;
    this.chargedAttackType = null;
    this.icarusStanceBlend = 0;
    this.aphroditeStanceBlend = 0;
    this.tempestStanceBlend = 0;
    this.tempestGuardTimer = 0;
    this.tempestGuardCooldown = 0;
    this.attackVariant = 'normal';
    this.comboDamageOverride = null;
    this.hairStrands.forEach(s => { s.vx = 0; s.vy = 0; });
    this.clothPoints.forEach((p: {vx:number;vy:number}) => { p.vx = 0; p.vy = 0; });
  }

  onAttackLanded() {
    this.attackLanded = true;
    if (this.hasIcarusStyle && this.attackVariant !== 'normal') {
      const flame = this.attackVariant === 'skybreaker' ? '#ff3c00' : '#ff9d19';
      this.spawnIcarusEmbers(this.attackVariant === 'skybreaker' ? 14 : 8, flame);
    }
    if (this.hasAphroditeStyle && this.attackVariant !== 'normal') {
      const petals = this.attackVariant === 'venus-spin' ? 16 : 8;
      const pink = this.attackVariant === 'silk-sweep' ? '#ffd1ec' : '#ff65ad';
      this.spawnAphroditePetals(petals, pink);
    }
    if (this.hasTempestStyle && this.attackVariant !== 'normal') {
      const gusts = this.attackVariant === 'cyclone-wheel' ? 16 : this.attackVariant === 'tempest-counter' ? 14 : 8;
      this.spawnTempestWind(gusts, this.attackVariant === 'tempest-counter' ? '#ffffff' : '#8deeff');
    }
    if (this.boostActive || this.boostCooldown > 0) return;
    this.consecutiveHits += 1;
    // Energy bar fills proportionally: 10 hits = full
    this.energy = Math.min(MAX_ENERGY, (this.consecutiveHits / 10) * MAX_ENERGY);
    if (this.consecutiveHits >= 10) {
      this.activateBoost();
    }
  }

  // ── Particles ─────────────────────────────────────────────────
  spawnBoostParticles() {
    if (!this.boostActive) return;
    for (let i = 0; i < 3; i++) {
      this.particles.push({
        x: this.x + Math.random() * FIGHTER_WIDTH,
        y: this.y + Math.random() * FIGHTER_HEIGHT,
        vx: (Math.random() - 0.5) * 100,
        vy: -Math.random() * 160 - 60,
        life: 0.35 + Math.random() * 0.3,
        maxLife: 0.65,
        size: 5 + Math.random() * 9,
        color: this.energyColor,
      });
    }
  }

  // Ember burst used by Ryu's Icarus stance and signature attacks.
  spawnIcarusEmbers(count: number, color: string) {
    if (!this.hasIcarusStyle) return;
    const forward = this.facingRight ? 1 : -1;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: this.x + FIGHTER_WIDTH * (0.35 + Math.random() * 0.4),
        y: this.y + FIGHTER_HEIGHT * (0.25 + Math.random() * 0.55),
        vx: forward * (60 + Math.random() * 180) + (Math.random() - 0.5) * 70,
        vy: -40 - Math.random() * 170,
        life: 0.20 + Math.random() * 0.24,
        maxLife: 0.44,
        size: 3 + Math.random() * 6,
        color,
      });
    }
  }

  // Petal-like motes reinforce Akari's soft, circular Aphrodite-style momentum.
  spawnAphroditePetals(count: number, color: string) {
    if (!this.hasAphroditeStyle) return;
    const forward = this.facingRight ? 1 : -1;
    for (let i = 0; i < count; i++) {
      const side = (Math.random() - 0.5) * 2;
      this.particles.push({
        x: this.x + FIGHTER_WIDTH * (0.24 + Math.random() * 0.54),
        y: this.y + FIGHTER_HEIGHT * (0.18 + Math.random() * 0.62),
        vx: forward * (35 + Math.random() * 105) + side * 80,
        vy: -30 - Math.random() * 120,
        life: 0.26 + Math.random() * 0.30,
        maxLife: 0.56,
        size: 3 + Math.random() * 6,
        color,
      });
    }
  }

  // Kai's controlled wind trails reflect disciplined footwork instead of raw force.
  spawnTempestWind(count: number, color: string) {
    if (!this.hasTempestStyle) return;
    const forward = this.facingRight ? 1 : -1;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: this.x + FIGHTER_WIDTH * (0.22 + Math.random() * 0.56),
        y: this.y + FIGHTER_HEIGHT * (0.18 + Math.random() * 0.62),
        vx: forward * (45 + Math.random() * 130) + (Math.random() - 0.5) * 100,
        vy: -35 - Math.random() * 145,
        life: 0.20 + Math.random() * 0.28,
        maxLife: 0.48,
        size: 3 + Math.random() * 5,
        color,
      });
    }
  }

  spawnDashDust(dir: 'left' | 'right') {
    const cx = this.x + FIGHTER_WIDTH / 2;
    const gy = GROUND_Y;
    for (let i = 0; i < 6; i++) {
      this.dustParticles.push({
        x: cx + (Math.random() - 0.5) * 40,
        y: gy - Math.random() * 20,
        vx: (dir === 'left' ? 1 : -1) * (40 + Math.random() * 80),
        vy: -Math.random() * 60 - 20,
        life: 0.3 + Math.random() * 0.25,
        maxLife: 0.55,
        size: 8 + Math.random() * 14,
      });
    }
  }

  spawnLandDust() {
    const cx = this.x + FIGHTER_WIDTH / 2;
    for (let i = 0; i < 8; i++) {
      this.dustParticles.push({
        x: cx + (Math.random() - 0.5) * 60,
        y: GROUND_Y - 5,
        vx: (Math.random() - 0.5) * 120,
        vy: -Math.random() * 80 - 10,
        life: 0.35 + Math.random() * 0.2,
        maxLife: 0.55,
        size: 10 + Math.random() * 16,
      });
    }
  }

  // ── Update ────────────────────────────────────────────────────
  update(dt: number) {
    if (this.state === 'ko' || this.state === 'dead') {
      // KO — fall to ground
     if (!this.isOnGround) {
       this.vy += GRAVITY * dt;
       this.y += this.vy * dt;
       const gy = GROUND_Y - FIGHTER_HEIGHT;
       if (this.y >= gy) { this.y = gy; this.vy = 0; this.isOnGround = true; }
     }
      return;
    }
    // ── Barrier timer ──────────────────────────────────────
    if (this.barrierActive) {
      this.barrierTimer -= dt;
      if (this.barrierTimer <= 0) { this.barrierActive = false; this.barrierTimer = 0; }
    }
    if (this.barrierCooldown > 0) this.barrierCooldown -= dt;

    // ── Teleport cooldown tick ─────────────────────────────
    if (this.teleportCooldown > 0) this.teleportCooldown -= dt;

    // ── Tornado timer ──────────────────────────────────────
    if (this.tornadoActive) {
      this.tornadoTimer -= dt;
      if (this.tornadoTimer <= 0) { this.tornadoActive = false; this.tornadoTimer = 0; }
    }
    if (this.tempestGuardTimer > 0) this.tempestGuardTimer -= dt;
    if (this.tempestGuardCooldown > 0) this.tempestGuardCooldown -= dt;

    // ── Projectile movement ────────────────────────────────
    this.projectiles = this.projectiles.filter(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.ttl -= dt;
      return p.ttl > 0 && p.x > 0 && p.x < 1280;
    });

    // Mouth movement
    if (this.speakTimer > 0) {
      this.speakTimer -= dt;
      const phase = (this.speakDuration - this.speakTimer) / this.speakDuration;
      // Oscillate open/close rapidly while speaking, fade out at end
      const fade = Math.min(1, this.speakTimer * 4);
      this.mouthOpen = Math.abs(Math.sin(phase * Math.PI * 12)) * fade;
    } else {
      this.mouthOpen = Math.max(0, this.mouthOpen - dt * 8);
    }
    this.updateHairCloth(dt);

    // Ryu's low Icarus guard returns during neutral movement. It keeps his
    // silhouette visibly coiled, then feeds a small forward lunge into attacks.
    const canSettleIntoIcarus = this.hasIcarusStyle && this.isOnGround
      && (this.state === 'idle' || this.state === 'walk') && !this.isBlocking;
    const stanceTarget = canSettleIntoIcarus ? 1 : 0;
    const stanceSpeed = canSettleIntoIcarus ? 6.5 : 10;
    this.icarusStanceBlend += (stanceTarget - this.icarusStanceBlend) * Math.min(1, dt * stanceSpeed);

    // Akari’s Aphrodite guard stays upright and mobile, ready to turn a retreat
    // into a counter or a spinning kick without gaining any defensive immunity.
    const canSettleIntoAphrodite = this.hasAphroditeStyle && this.isOnGround
      && (this.state === 'idle' || this.state === 'walk') && !this.isBlocking;
    const aphroditeTarget = canSettleIntoAphrodite ? 1 : 0;
    const aphroditeSpeed = canSettleIntoAphrodite ? 7.5 : 12;
    this.aphroditeStanceBlend += (aphroditeTarget - this.aphroditeStanceBlend) * Math.min(1, dt * aphroditeSpeed);

    const canSettleIntoTempest = this.hasTempestStyle && this.isOnGround
      && (this.state === 'idle' || this.state === 'walk') && !this.isBlocking;
    const tempestTarget = canSettleIntoTempest ? 1 : 0;
    const tempestSpeed = canSettleIntoTempest ? 8.5 : 13;
    this.tempestStanceBlend += (tempestTarget - this.tempestStanceBlend) * Math.min(1, dt * tempestSpeed);

    // Boost tick
    if (this.boostActive) {
      if (!this.boostInfinite) {
        this.boostTimer -= dt;
        if (this.boostTimer <= 0) {
          this.boostActive = false;
          this.boostTimer = 0;
          this.energy = 0;
          this.boostCooldown = 32; // 32-second cooldown
          this.consecutiveHits = 0;
          this.cinematicFired = false;
        }
      }
      this.spawnBoostParticles();
    }

    // Galva lightning barrier auto-timer
    if (this.hasLightningBarrier) {
      if (this.lightningBarrierCooldown > 0) {
        this.lightningBarrierCooldown -= dt;
      } else if (!this.lightningBarrierActive) {
        this.lightningBarrierActive = true;
        this.lightningBarrierTimer = 2.0; // barrier lasts 2 seconds
        this.lightningBarrierCooldown = 15.0; // recharge every 15s
      }
      if (this.lightningBarrierActive) {
        this.lightningBarrierTimer -= dt;
        if (this.lightningBarrierTimer <= 0) {
          this.lightningBarrierActive = false;
          this.lightningBarrierTimer = 0;
        }
      }
    }

    // Charge energy
    if (this.state === 'charge') {
      // Charge no longer fills energy — consecutive hits do
    }

    // Dash cooldown
    if (this.dashCooldown > 0) this.dashCooldown -= dt;

    // Attack phase progression
    if (this.isAttacking) {
      const isPunch = this.state === 'punch' || this.state === 'airpunch';
      const isRoundhouse = this.state === 'roundhouse';
      const isSweep = this.state === 'sweep';
      const startup = isPunch ? PUNCH_STARTUP : isRoundhouse ? KICK_STARTUP * 1.2 : isSweep ? KICK_STARTUP * 0.9 : KICK_STARTUP;
      const active  = isPunch ? PUNCH_ACTIVE : isRoundhouse ? KICK_ACTIVE * 1.35 : isSweep ? KICK_ACTIVE * 1.1 : KICK_ACTIVE;
      const total = isPunch ? PUNCH_DURATION : isRoundhouse ? KICK_DURATION * 1.25 : isSweep ? KICK_DURATION * 1.1 : KICK_DURATION;
      const elapsed = total - this.stateTimer;
      if (elapsed < startup) this.attackPhase = 'startup';
      else if (elapsed < startup + active) this.attackPhase = 'active';
      else this.attackPhase = 'recovery';
    }

    // Counter window tick
    if (this.counterWindowTimer > 0) this.counterWindowTimer -= dt;

    // Prone auto-recovery
    if (this.state === 'prone' && this.stateTimer > 0) {
      this.stateTimer -= dt;
      if (this.stateTimer <= 0) { this.state = 'idle'; this.stateTimer = 0; this.vx = 0; }
    }

    // State timer
    if (this.stateTimer > 0 && this.state !== 'prone') {
      this.stateTimer -= dt;
      if (this.stateTimer <= 0) {
        this.stateTimer = 0;
        this.attackPhase = 'none';
        const s = this.state as string;
        if (s !== 'ko' && s !== 'dead' && s !== 'block' && s !== 'charge') {
          if (s === 'launch' || s === 'airborne') {
            this.state = 'airborne'; // stay airborne until ground
          } else {
            this.state = this.isOnGround ? 'idle' : 'jump';
          }
        }
        this.attackVariant = 'normal';
        this.comboDamageOverride = null;
      }
    }

    // Thrown state — take 1 damage on landing
    if (this.state === 'thrown' && this.isOnGround) {
      this.health = Math.max(0, this.health - 1);
      this.hitFlash = 0.15;
      this.state = 'prone';
      this.stateTimer = 2.0;
      if (this.health <= 0) { this.state = 'ko'; this.stateTimer = 999; }
    }

    // Gravity
    if (!this.isOnGround) this.vy += GRAVITY * dt;
    // Safety net: if isOnGround is true but position is above ground, re-enable gravity
    if (this.isOnGround && this.y < (GROUND_Y - FIGHTER_HEIGHT) - 2) {
      this.isOnGround = false;
    }

    // Position
    this.lastVx = this.vx;
    this.lastVy = this.vy;
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Ground collision
    const groundY = GROUND_Y - FIGHTER_HEIGHT;
    if (this.y >= groundY) {
      const wasAirborne = !this.isOnGround;
      this.y = groundY;
      if (wasAirborne && Math.abs(this.vy) > 180) {
        this.spawnLandDust();
        this.squashTimer = LAND_SQUASH;
      }
      this.vy = 0;
      this.isOnGround = true;
      if (this.state === 'jump' || this.state === 'launch' || this.state === 'airborne' || this.state === 'airpunch' || this.state === 'airkick') {
        this.state = 'idle';
        this.stateTimer = 0;
        this.attackPhase = 'none';
      }
    }

    // Stage bounds
    this.x = Math.max(STAGE_LEFT, Math.min(STAGE_RIGHT - FIGHTER_WIDTH, this.x));

    // Ground drag uses delta-time rather than a hard per-frame multiplier, so
    // movement glides to a readable stop instead of looking abruptly frozen.
    const isDash = this.state === 'dash' || this.state === 'backdash';
    if (this.isOnGround && !isDash && this.state !== 'walk') {
      this.vx *= Math.exp(-14 * dt);
    }
    if (Math.abs(this.vx) < 2) this.vx = 0;
    if (this.state === 'walk' && this.vx === 0) this.state = 'idle';

    // Squash timer
    if (this.squashTimer > 0) this.squashTimer -= dt;

    // Hit flash
    if (this.hitFlash > 0) this.hitFlash -= dt;
    if (this.boostCooldown > 0) this.boostCooldown -= dt;

    // Particles
    this.particles = this.particles.filter(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 60 * dt;
      p.life -= dt;
      return p.life > 0;
    });
    this.dustParticles = this.dustParticles.filter(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 120 * dt;
      p.vx *= 0.92;
      p.life -= dt;
      return p.life > 0;
    });

  }

  private updateHairCloth(dt: number) {
    // ── Realistic hair physics ──────────────────────────────
    // Compute acceleration this frame
    const rawAccelX = (this.vx - this.lastVx) / Math.max(dt, 0.016);
    const rawAccelY = (this.vy - this.lastVy) / Math.max(dt, 0.016);

    // State-based impulse multipliers
    let impulseX = rawAccelX;
    let impulseY = rawAccelY;
    const s = this.state as string;

    // Punching: sharp forward snap then recoil
    if (s === 'punch' || s === 'airpunch') {
      impulseX += (this.facingRight ? 1 : -1) * 280 * (this.attackPhase === 'startup' ? 1 : -0.4);
      impulseY += -60;
    }
    // Kicking: rotational whip — hair flies up and back
    if (s === 'kick' || s === 'airkick') {
      impulseX += (this.facingRight ? 1 : -1) * 180;
      impulseY += -120;
    }
    // Taking a hit: sudden jerk in hit direction
    if (s === 'hit' && this.hitFlash > 0.05) {
      impulseX += (this.facingRight ? 1 : -1) * -350;
      impulseY += -80;
    }
    // Launch: strong upward blast
    if (s === 'launch') {
      impulseX += (this.facingRight ? -1 : 1) * 200;
      impulseY += -500;
    }
    // Dash: hair streams back
    if (s === 'dash') {
      impulseX += (this.facingRight ? -1 : 1) * 420;
      impulseY += -30;
    }
    if (s === 'backdash') {
      impulseX += (this.facingRight ? 1 : -1) * 380;
      impulseY += -20;
    }
    // Jump: upward burst
    if (s === 'jump' && rawAccelY < -100) {
      impulseY += -300;
    }
    // Landing squash: hair bounces down then up
    if (this.squashTimer > 0) {
      impulseY += 400 * (this.squashTimer / 0.06);
    }

    // Ambient wind from movement speed
    const windX = this.vx * (this.isOnGround ? 0.04 : 0.07);
    const windY = this.vy * 0.025;

    // Spring stiffness varies by state (looser during action)
    const isAction = s === 'punch' || s === 'kick' || s === 'airpunch' || s === 'airkick' || s === 'dash' || s === 'backdash';
    const stiffness = isAction ? 3.5 : 5.5;
    const damping   = isAction ? 0.78 : 0.85;

    for (let i = 0; i < this.hairStrands.length; i++) {
      const strand = this.hairStrands[i];
      // Each strand has slightly different mass (tip strands react more)
      const mass = 0.6 + (i / this.hairStrands.length) * 0.8;
      const springX = -strand.ox * stiffness;
      const springY = -strand.oy * stiffness;
      strand.vx += (springX - impulseX * 0.06 / mass + windX) * dt * 14;
      strand.vy += (springY - impulseY * 0.04 / mass + windY + 35) * dt * 14;
      strand.vx *= damping;
      strand.vy *= damping;
      strand.ox += strand.vx * dt;
      strand.oy += strand.vy * dt;
      // Clamp to strand length
      const dist = Math.sqrt(strand.ox * strand.ox + strand.oy * strand.oy);
      if (dist > strand.len) {
        strand.ox = (strand.ox / dist) * strand.len;
        strand.oy = (strand.oy / dist) * strand.len;
      }
    }

    // Cloth points — looser, more dramatic
    const clothStiffness = isAction ? 1.8 : 2.8;
    const clothDamping   = isAction ? 0.72 : 0.80;
    for (const c of this.clothPoints) {
      c.vx += (-c.ox * clothStiffness - impulseX * 0.10 + windX * 1.8) * dt * 10;
      c.vy += (-c.oy * clothStiffness + 25 + windY - impulseY * 0.05) * dt * 10;
      c.vx *= clothDamping;
      c.vy *= clothDamping;
      c.ox += c.vx * dt;
      c.oy += c.vy * dt;
    }
  }


  // ── Ability: Lightning Blast ──────────────────────────────
  fireLightningBlast(): boolean {
    if (!this.hasLightningBlast || !this.canAttack()) return false;
    const dmg = (PUNCH_DAMAGE + this.punchDamageBonus) * (this.boostActive ? 2 : 1);
    this.projectiles.push({
      x: this.facingRight ? this.x + FIGHTER_WIDTH + 10 : this.x - 10,
      y: this.y + FIGHTER_HEIGHT * 0.3,
      vx: this.facingRight ? 900 : -900,
      vy: 0,
      color: '#00cfff',
      radius: 14,
      ttl: 1.2,
      damage: dmg,
    });
    this.state = 'special';
    this.stateTimer = 0.25;
    this.attackPhase = 'active';
    return true;
  }

  // ── Ability: Lightning Teleport (Galva) ──────────────────
  activateTeleport(opponent: Fighter): boolean {
    if (!this.hasTeleport || this.teleportCooldown > 0 || this.state === 'ko' || this.state === 'dead') return false;
    // Record vanish position
    this.teleportFlashX = this.x + FIGHTER_WIDTH / 2;
    this.teleportFlashY = this.y + FIGHTER_HEIGHT / 2;
    // Calculate reappear position: behind opponent (opposite side)
    const behindX = opponent.facingRight
      ? opponent.x - FIGHTER_WIDTH - 20   // opponent facing right → appear to their left
      : opponent.x + FIGHTER_WIDTH + 20;  // opponent facing left → appear to their right
    this.teleportReappearX = Math.max(20, Math.min(1260 - FIGHTER_WIDTH, behindX));
    this.teleportReappearY = GROUND_Y - FIGHTER_HEIGHT;
    this.teleportPhase = 'vanish';
    this.teleportTimer = 0.18;   // vanish flash duration
    this.teleportFlashAlpha = 1.0;
    this.teleportCooldown = 15;
    this.state = 'teleport';
    this.stateTimer = 0.18;
    return true;
  }

  // ── Ability: Shadow Barrier ───────────────────────────────
  activateShadowBarrier(): boolean {
    if (!this.hasShadowBarrier || this.barrierActive || this.barrierCooldown > 0) return false;
    this.barrierActive = true;
    this.barrierTimer = 5.0;
    this.barrierCooldown = 240; // 4 minutes
    this.state = 'barrier';
    this.stateTimer = 0.3;
    return true;
  }

  // ── Ability: Tornado ──────────────────────────────────────
  activateTornado(): boolean {
    if (!this.hasTornado || this.tornadoActive || !this.canAttack()) return false;
    this.tornadoActive = true;
    this.tornadoTimer = 2.0;
    this.state = 'special';
    this.stateTimer = 2.0;
    return true;
  }

  // Kai's high-skill special: a brief counter window with a modest cooldown.
  activateTempestGuard(): boolean {
    if (!this.hasTempestStyle || this.tempestGuardTimer > 0 || this.tempestGuardCooldown > 0 || !this.canAttack()) return false;
    this.tempestGuardTimer = 0.30;
    this.tempestGuardCooldown = 2.2;
    this.state = 'special';
    this.stateTimer = 0.30;
    this.attackVariant = 'tempest-counter';
    this.spawnTempestWind(9, '#d7faff');
    return true;
  }

  isTempestGuarding() {
    return this.hasTempestStyle && this.tempestGuardTimer > 0;
  }

  // ── Ability: Aerial Kick (high jump + kick) ───────────────
  aerialKick(): boolean {
    if (!this.hasAerialKick || !this.canAttack()) return false;
    this.vy = JUMP_VELOCITY * 1.5; // extra high
    this.isOnGround = false;
    this.state = 'airkick';
    this.stateTimer = 0.5;
    this.attackPhase = 'active';
    this.attackLanded = false;
    return true;
  }

  grab(target: Fighter): boolean {
    if (!this.hasGrab || !this.canAttack() || !this.isOnGround) return false;
    if (Math.abs(this.centerX - target.centerX) > 120) return false; // must be close
    this.state = 'grab';
    this.stateTimer = 0.4;
    this.grabTarget = target;
    target.state = 'grabbed';
    target.stateTimer = 0.4;
    return true;
  }

  executeThrow() {
    if (!this.grabTarget) return;
    const target = this.grabTarget;
    const throwDir = this.facingRight ? 1 : -1;
    target.state = 'thrown';
    target.vx = throwDir * 600;
    target.vy = -400;
    target.isOnGround = false;
    target.stateTimer = 1.0;
    this.grabTarget = null;
    this.state = 'idle';
  }

  canMove()   { return this.isAlive && !this.isStunned && !this.isAttacking && this.state !== 'charge' && this.state !== 'prone'; }
  canAttack() { return this.isAlive && !this.isAttacking && !this.isBlocking && this.state !== 'charge' && this.state !== 'prone' && (this.state !== 'hit' || this.counterWindowTimer > 0); }

  getAttackRect() {
    if (this.attackPhase !== 'active' || this.attackLanded) return null;
    const isRoundhouse = this.state === 'roundhouse';
    const isSweep = this.state === 'sweep';
    const isKick = this.state === 'kick' || this.state === 'airkick' || isRoundhouse || isSweep;
    const reach = isSweep ? KICK_REACH * 1.2 : isRoundhouse ? KICK_REACH * 1.3 : isKick ? KICK_REACH : PUNCH_REACH;
    const x = this.facingRight ? this.x + FIGHTER_WIDTH : this.x - reach;
    const y = isSweep ? this.y + FIGHTER_HEIGHT * 0.68 : isKick ? this.y + FIGHTER_HEIGHT * 0.5 : this.y + FIGHTER_HEIGHT * 0.15;
    const h = isSweep ? FIGHTER_HEIGHT * 0.26 : isKick ? FIGHTER_HEIGHT * 0.5 : FIGHTER_HEIGHT * 0.38;
    return { x, y, w: reach, h };
  }

  getBodyRect() {
    return { x: this.x + 10, y: this.y, w: FIGHTER_WIDTH - 20, h: FIGHTER_HEIGHT };
  }
}

export interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number; color: string;
}

export interface DustParticle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number;
}
