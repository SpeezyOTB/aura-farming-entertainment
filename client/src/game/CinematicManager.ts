/**
 * CinematicManager — handles full-power activation cutscenes
 *
 * When a fighter's energy bar maxes out:
 * 1. Game loop pauses (freeze frame)
 * 2. Camera zooms into the fighter over 0.4s
 * 3. Character-specific aura burst fills the screen
 * 4. Power-up line text appears with character name
 * 5. Camera pulls back over 0.4s
 * 6. Game resumes
 *
 * Total cutscene duration: ~2.5 seconds
 */

export interface CinematicConfig {
  name: string;
  color: string;
  energyColor: string;
  powerLine: string;
  spriteX: number;
  spriteY: number;
  spriteW: number;
  spriteH: number;
  img: HTMLImageElement | null;
  facingRight: boolean;
}

type CinematicPhase = 'zoom-in' | 'burst' | 'hold' | 'zoom-out' | 'done';

export class CinematicManager {
  private phase: CinematicPhase = 'done';
  private phaseTimer = 0;
  private config: CinematicConfig | null = null;
  private particles: { x: number; y: number; vx: number; vy: number; r: number; a: number; color: string }[] = [];
  private zoom = 1;
  private zoomCX = 640;
  private zoomCY = 360;

  get isActive() { return this.phase !== 'done'; }

  stop() {
    this.phase = 'done';
    this.particles = [];
    this.zoom = 1;
  }

  trigger(cfg: CinematicConfig) {
    this.config = cfg;
    this.phase = 'zoom-in';
    this.phaseTimer = 0;
    this.zoom = 1;
    this.zoomCX = cfg.spriteX + cfg.spriteW / 2;
    this.zoomCY = cfg.spriteY + cfg.spriteH / 2;
    this.particles = [];
  }

  update(dt: number) {
    if (this.phase === 'done') return;
    this.phaseTimer += dt;

    switch (this.phase) {
      case 'zoom-in':
        this.zoom = 1 + (this.phaseTimer / 0.4) * 1.2; // zoom to 2.2x
        if (this.phaseTimer >= 0.4) {
          this.phase = 'burst';
          this.phaseTimer = 0;
          this.zoom = 2.2;
          this.spawnBurstParticles();
        }
        break;
      case 'burst':
        if (this.phaseTimer >= 0.3) { this.phase = 'hold'; this.phaseTimer = 0; }
        break;
      case 'hold':
        if (this.phaseTimer >= 1.2) { this.phase = 'zoom-out'; this.phaseTimer = 0; }
        break;
      case 'zoom-out':
        this.zoom = 2.2 - (this.phaseTimer / 0.5) * 1.2;
        if (this.phaseTimer >= 0.5) { this.phase = 'done'; this.zoom = 1; }
        break;
    }

    // Update particles
    this.particles = this.particles.filter(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.a -= dt * 0.8;
      p.r += dt * 20;
      return p.a > 0;
    });
  }

  private spawnBurstParticles() {
    if (!this.config) return;
    const cx = this.zoomCX;
    const cy = this.zoomCY;
    const color = this.config.energyColor;
    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 80 + Math.random() * 320;
      this.particles.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: 4 + Math.random() * 12,
        a: 0.8 + Math.random() * 0.2,
        color,
      });
    }
  }

  render(ctx: CanvasRenderingContext2D, canvasW: number, canvasH: number) {
    if (this.phase === 'done' || !this.config) return;
    const cfg = this.config;

    ctx.save();

    // ── Zoom transform ──────────────────────────────────────
    if (this.zoom !== 1) {
      ctx.translate(this.zoomCX, this.zoomCY);
      ctx.scale(this.zoom, this.zoom);
      ctx.translate(-this.zoomCX, -this.zoomCY);
    }

    // ── Character-specific background aura ─────────────────
    const auraAlpha = this.phase === 'zoom-in' ? (this.phaseTimer / 0.4) * 0.6
      : this.phase === 'zoom-out' ? (1 - this.phaseTimer / 0.5) * 0.6
      : 0.6;

    const aura = ctx.createRadialGradient(
      this.zoomCX, this.zoomCY, 0,
      this.zoomCX, this.zoomCY, 400
    );
    aura.addColorStop(0, cfg.energyColor + 'cc');
    aura.addColorStop(0.3, cfg.energyColor + '55');
    aura.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalAlpha = auraAlpha;
    ctx.fillStyle = aura;
    ctx.fillRect(0, 0, canvasW / this.zoom, canvasH / this.zoom);

    // ── Burst particles ─────────────────────────────────────
    for (const p of this.particles) {
      ctx.globalAlpha = p.a;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    // ── HUD overlay (not zoomed) ────────────────────────────
    if (this.phase === 'hold' || this.phase === 'burst') {
      const textAlpha = this.phase === 'burst'
        ? Math.min(1, this.phaseTimer / 0.2)
        : this.phaseTimer > 0.8 ? Math.max(0, 1 - (this.phaseTimer - 0.8) / 0.4) : 1;

      // Dark vignette behind text
      ctx.save();
      ctx.globalAlpha = textAlpha * 0.55;
      ctx.fillStyle = 'rgba(0,0,0,0.8)';
      ctx.fillRect(0, canvasH * 0.28, canvasW, canvasH * 0.44);
      ctx.restore();

      // Character name
      ctx.save();
      ctx.globalAlpha = textAlpha;
      ctx.textAlign = 'center';
      ctx.fillStyle = cfg.color;
      ctx.shadowColor = cfg.energyColor;
      ctx.shadowBlur = 40;
      ctx.font = "bold 72px 'Bebas Neue', Impact, sans-serif";
      ctx.fillText(cfg.name.toUpperCase(), canvasW / 2, canvasH * 0.42);

      // Power line
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = cfg.energyColor;
      ctx.shadowBlur = 20;
      ctx.font = "italic 28px Georgia, serif";
      ctx.fillText(`"${cfg.powerLine}"`, canvasW / 2, canvasH * 0.54);

      // FULL POWER label
      ctx.fillStyle = cfg.energyColor;
      ctx.shadowBlur = 30;
      ctx.font = "bold 22px 'Bebas Neue', Impact, sans-serif";
      ctx.letterSpacing = '6px';
      ctx.fillText('— FULL POWER ACTIVATED —', canvasW / 2, canvasH * 0.62);
      ctx.restore();
    }
  }
}
