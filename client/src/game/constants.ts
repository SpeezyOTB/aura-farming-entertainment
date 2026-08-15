export const CANVAS_WIDTH  = 1280;
export const CANVAS_HEIGHT = 720;
export const GROUND_Y      = 590;
export const STAGE_LEFT    = 40;
export const STAGE_RIGHT   = CANVAS_WIDTH - 40;
// Larger silhouettes make attacks and body spacing readable at a glance.
export const FIGHTER_WIDTH  = 132;
export const FIGHTER_HEIGHT = 238;

// ── Physics ────────────────────────────────────────────────────
export const GRAVITY         = 2400;   // snappier fall
export const JUMP_VELOCITY   = -650;   // just clears a punch/kick height (~100px)
export const MOVE_SPEED      = 370;
export const DASH_SPEED      = 830;    // foot dash burst
export const DASH_DURATION   = 0.18;   // seconds
export const BACKDASH_SPEED  = -640;
export const BACKDASH_DURATION = 0.15;
export const BACKJUMP_VX     = -420;   // back-jump horizontal
export const BACKJUMP_VY     = -600;   // back-jump vertical
export const AIR_MOVE_SPEED  = 260;    // aerial horizontal control
export const LAND_SQUASH     = 0.09;   // readable landing squash duration

// ── Combat ────────────────────────────────────────────────────
export const MAX_HEALTH      = 250;
export const MAX_ENERGY      = 50;
export const PUNCH_DAMAGE    = 1;
export const KICK_DAMAGE     = 2;
export const BLOCK_DAMAGE_MULT = 0.0;  // blocking = zero damage
export const ENERGY_PER_PUNCH = 5;
export const ENERGY_PER_KICK  = 7;
export const BOOST_DURATION   = 15;
export const BOOST_DAMAGE_MULT = 2;

// Punch: fast startup, short stun
export const PUNCH_STARTUP   = 0.05;   // frames before hitbox active
export const PUNCH_ACTIVE    = 0.08;   // hitbox active window
export const PUNCH_RECOVERY  = 0.09;   // recovery after hit/whiff
export const PUNCH_DURATION  = PUNCH_STARTUP + PUNCH_ACTIVE + PUNCH_RECOVERY;
export const PUNCH_HIT_STUN  = 0.12;   // defender stun
export const PUNCH_KNOCKBACK = 150;    // horizontal push

// Kick: slower startup, longer stun, launches on boost
export const KICK_STARTUP    = 0.09;
export const KICK_ACTIVE     = 0.10;
export const KICK_RECOVERY   = 0.15;
export const KICK_DURATION   = KICK_STARTUP + KICK_ACTIVE + KICK_RECOVERY;
export const KICK_HIT_STUN   = 0.22;   // longer stun than punch
export const KICK_KNOCKBACK  = 235;
export const KICK_LAUNCH_VY  = -480;   // vertical launch when boosted

export const PUNCH_REACH     = 112;
export const KICK_REACH      = 145;

// ── Charge ────────────────────────────────────────────────────
export const PRONE_RECOVERY_TIME = 3.0;   // auto get-up after 3 seconds
export const CHARGED_PUNCH_MULT  = 2.5;   // damage multiplier for charged punch
export const CHARGED_KICK_MULT   = 3.0;   // damage multiplier for charged kick
export const CHARGE_HOLD_TIME    = 0.8;   // seconds to hold for a charged attack
export const COUNTER_WINDOW      = 0.15;  // seconds after being hit where counter is possible
export const CHARGE_RATE     = 3.5;    // energy per second while charging

// ── Particles ─────────────────────────────────────────────────
export const HAIR_STRAND_COUNT = 6;    // strands per fighter
export const CLOTH_POINT_COUNT = 4;    // cloth sim points
