/**
 * CelShader — Canvas 2D cel/toon shading post-processor
 * Uses regular <canvas> elements for maximum browser/iOS/Safari compatibility.
 *
 * Technique per frame:
 * 1. Draw sprite onto offA canvas
 * 2. Quantize pixel colors into hard toon bands
 * 3. Build outline mask on offB by dilating the silhouette
 * 4. Composite outline + quantized sprite onto destination
 */
export class CelShader {
  private offA: HTMLCanvasElement;
  private offB: HTMLCanvasElement;
  private ctxA: CanvasRenderingContext2D;
  private ctxB: CanvasRenderingContext2D;
  private enabled = true;

  constructor(private w: number, private h: number) {
    this.offA = document.createElement('canvas');
    this.offB = document.createElement('canvas');
    this.offA.width  = w;
    this.offA.height = h;
    this.offB.width  = w;
    this.offB.height = h;
    const ctxA = this.offA.getContext('2d');
    const ctxB = this.offB.getContext('2d');
    if (!ctxA || !ctxB) {
      this.enabled = false;
      // Assign dummy contexts to satisfy TS; draw() will bail early
      this.ctxA = ctxA as unknown as CanvasRenderingContext2D;
      this.ctxB = ctxB as unknown as CanvasRenderingContext2D;
    } else {
      this.ctxA = ctxA;
      this.ctxB = ctxB;
    }
  }

  draw(
    destCtx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    dx: number, dy: number, dw: number, dh: number,
    outlineColor = '#1a0030',
    outlineWidth = 3,
    bands = 3,
    flipX = false,
    scaleX = 1,
    scaleY = 1,
  ) {
    if (!this.enabled) {
      // Fallback: plain draw
      destCtx.save();
      destCtx.translate(dx + dw / 2, dy + dh);
      destCtx.scale(flipX ? -scaleX : scaleX, scaleY);
      destCtx.drawImage(img, -dw / 2, -dh, dw, dh);
      destCtx.restore();
      return;
    }

    try {
      // Ensure offscreen canvases are large enough
      if (this.offA.width < dw || this.offA.height < dh) {
        this.offA.width  = Math.max(this.offA.width,  Math.ceil(dw));
        this.offA.height = Math.max(this.offA.height, Math.ceil(dh));
        this.offB.width  = this.offA.width;
        this.offB.height = this.offA.height;
      }

      const { ctxA, ctxB } = this;
      const iw = Math.ceil(dw);
      const ih = Math.ceil(dh);

      // ── Step 1: Draw sprite onto offA ──────────────────────
      ctxA.clearRect(0, 0, iw, ih);
      ctxA.save();
      if (flipX) { ctxA.translate(iw, 0); ctxA.scale(-1, 1); }
      ctxA.drawImage(img, 0, 0, iw, ih);
      ctxA.restore();

      // ── Step 2: Color quantization (toon bands) ────────────
      const imgData = ctxA.getImageData(0, 0, iw, ih);
      const d = imgData.data;
      const step = Math.floor(256 / bands);
      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] < 10) continue;
        d[i]     = Math.min(255, Math.round(d[i]     / step) * step);
        d[i + 1] = Math.min(255, Math.round(d[i + 1] / step) * step);
        d[i + 2] = Math.min(255, Math.round(d[i + 2] / step) * step);
      }
      ctxA.putImageData(imgData, 0, 0);

      // ── Step 3: Build outline mask on offB ─────────────────
      ctxB.clearRect(0, 0, iw, ih);
      const r = outlineWidth;
      const offsets: [number, number][] = [
        [-r, -r], [0, -r], [r, -r],
        [-r,  0],           [r,  0],
        [-r,  r], [0,  r], [r,  r],
      ];
      for (const [ox, oy] of offsets) {
        ctxB.drawImage(this.offA, ox, oy);
      }
      ctxB.save();
      ctxB.globalCompositeOperation = 'source-in';
      ctxB.fillStyle = outlineColor;
      ctxB.fillRect(0, 0, iw, ih);
      ctxB.restore();
      ctxB.save();
      ctxB.globalCompositeOperation = 'destination-out';
      ctxB.drawImage(this.offA, 0, 0);
      ctxB.restore();

      // ── Step 4: Composite onto destination ─────────────────
      destCtx.save();
      destCtx.translate(dx + dw / 2, dy + dh);
      destCtx.scale(flipX ? -scaleX : scaleX, scaleY);
      destCtx.drawImage(this.offB, -dw / 2, -dh, iw, ih);
      destCtx.drawImage(this.offA, -dw / 2, -dh, iw, ih);
      destCtx.restore();

    } catch (err) {
      // On any error, disable cel shading and fall back to plain draw
      console.warn('[CelShader] Disabled due to error:', err);
      this.enabled = false;
      destCtx.save();
      destCtx.translate(dx + dw / 2, dy + dh);
      destCtx.scale(flipX ? -scaleX : scaleX, scaleY);
      destCtx.drawImage(img, -dw / 2, -dh, dw, dh);
      destCtx.restore();
    }
  }
}
