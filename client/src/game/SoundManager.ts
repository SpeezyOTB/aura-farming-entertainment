// Sound URLs from uploaded assets
import { ELEVENLABS_ANIME_SFX } from './ElevenLabsAnimeSfx';
import { DFX_VOICE_LINES } from './DFXVoiceLines';

const SOUNDS: Record<string, string> = {
  'ryu-punch':    ELEVENLABS_ANIME_SFX.approvedPunchWhiff,
  'ryu-punch2':   ELEVENLABS_ANIME_SFX.approvedPunchWhiff,
  'ryu-punch3':   ELEVENLABS_ANIME_SFX.approvedPunchWhiff,
  'ryu-kick':     ELEVENLABS_ANIME_SFX.approvedKickWhiff,
  'ryu-kick2':    ELEVENLABS_ANIME_SFX.approvedKickWhiff,
  'akari-punch':  ELEVENLABS_ANIME_SFX.approvedPunchWhiff,
  'akari-punch2': ELEVENLABS_ANIME_SFX.approvedPunchWhiff,
  'akari-punch3': ELEVENLABS_ANIME_SFX.approvedPunchWhiff,
  'akari-kick':   ELEVENLABS_ANIME_SFX.approvedKickWhiff,
  'akari-kick2':  ELEVENLABS_ANIME_SFX.approvedKickWhiff,
  'punch-impact':  ELEVENLABS_ANIME_SFX.approvedPunchHit,
  'punch-impact2': ELEVENLABS_ANIME_SFX.approvedPunchHit,
  'punch-impact3': ELEVENLABS_ANIME_SFX.approvedPunchHit,
  'punch-impact4': ELEVENLABS_ANIME_SFX.approvedPunchHit,
  'punch-impact5': ELEVENLABS_ANIME_SFX.approvedPunchHit,
  'punch-impact6': ELEVENLABS_ANIME_SFX.approvedPunchHit,
  'kick-impact':   ELEVENLABS_ANIME_SFX.approvedKickHit,
  'kick-impact2':  ELEVENLABS_ANIME_SFX.approvedKickHit,
  'kick-impact3':  ELEVENLABS_ANIME_SFX.approvedKickHit,
  'kick-impact4':  ELEVENLABS_ANIME_SFX.approvedKickHit,
  'kick-impact5':  ELEVENLABS_ANIME_SFX.approvedKickHit,
  'kick-impact6':  ELEVENLABS_ANIME_SFX.approvedKickHit,
  'kick-impact7':  ELEVENLABS_ANIME_SFX.approvedKickHit,
  'punch-whiff':   ELEVENLABS_ANIME_SFX.approvedPunchWhiff,
  'kick-whiff':    ELEVENLABS_ANIME_SFX.approvedKickWhiff,
  'punch-block':   ELEVENLABS_ANIME_SFX.approvedPunchBlock,
  'kick-block':    ELEVENLABS_ANIME_SFX.approvedKickBlock,
  'punch-whiff-alt': ELEVENLABS_ANIME_SFX.alternatePunchWhiff,
  'kick-whiff-alt':  ELEVENLABS_ANIME_SFX.alternateKickWhiff,
  'punch-impact-alt': ELEVENLABS_ANIME_SFX.alternatePunchHit,
  'kick-impact-alt':  ELEVENLABS_ANIME_SFX.alternateKickHit,
  'punch-block-alt':  ELEVENLABS_ANIME_SFX.alternatePunchBlock,
  'kick-block-alt':   ELEVENLABS_ANIME_SFX.alternateKickBlock,
  'ryu-punch-a':   ELEVENLABS_ANIME_SFX.ryuPunchA,
  'ryu-punch-b':   ELEVENLABS_ANIME_SFX.ryuPunchB,
  'approved-shared-punch-1': ELEVENLABS_ANIME_SFX.approvedSharedPunch1,
  'approved-shared-punch-2': ELEVENLABS_ANIME_SFX.approvedSharedPunch2,
  'approved-shared-punch-3': ELEVENLABS_ANIME_SFX.approvedSharedPunch3,
  'approved-shared-punch-4': ELEVENLABS_ANIME_SFX.approvedSharedPunch4,
  'akari-punch-a': ELEVENLABS_ANIME_SFX.akariPunchA,
  'akari-punch-b': ELEVENLABS_ANIME_SFX.akariPunchB,
  'galva-punch-a': ELEVENLABS_ANIME_SFX.galvaPunchA,
  'galva-punch-b': ELEVENLABS_ANIME_SFX.galvaPunchB,
  'kai-punch-a':   ELEVENLABS_ANIME_SFX.kaiPunchA,
  'kai-punch-b':   ELEVENLABS_ANIME_SFX.kaiPunchB,
  'shuraku-punch-a': ELEVENLABS_ANIME_SFX.shurakuPunchA,
  'shuraku-punch-b': ELEVENLABS_ANIME_SFX.shurakuPunchB,
  'footstep':      ELEVENLABS_ANIME_SFX.actionPlant,
  'footstep2':     ELEVENLABS_ANIME_SFX.actionPlant,
  'footstep3':     ELEVENLABS_ANIME_SFX.actionPlant,
  'footstep4':     ELEVENLABS_ANIME_SFX.actionPlant,
  'footstep5':     ELEVENLABS_ANIME_SFX.actionPlant,
  'footstep6':     ELEVENLABS_ANIME_SFX.actionPlant,
  'footstep7':     ELEVENLABS_ANIME_SFX.actionPlant,
  'footstep8':     ELEVENLABS_ANIME_SFX.actionPlant,
  'footstep9':     ELEVENLABS_ANIME_SFX.actionPlant,
  'miss-whoosh':   ELEVENLABS_ANIME_SFX.approvedPunchWhiff,
  // ── Hit reaction variants ──────────────────────────────────────────────────











  // ── Hit reaction grunts (g-{char}-{1-7}) ────────────────────────────────────
  'g-ryu-1': ELEVENLABS_ANIME_SFX.approvedPunchHit, 'g-ryu-2': ELEVENLABS_ANIME_SFX.approvedPunchHit, 'g-ryu-3': ELEVENLABS_ANIME_SFX.approvedPunchHit,
  'g-ryu-4': ELEVENLABS_ANIME_SFX.approvedPunchHit, 'g-ryu-5': ELEVENLABS_ANIME_SFX.approvedPunchHit, 'g-ryu-6': ELEVENLABS_ANIME_SFX.approvedPunchHit, 'g-ryu-7': ELEVENLABS_ANIME_SFX.approvedPunchHit,
  'g-akari-1': ELEVENLABS_ANIME_SFX.approvedPunchHit, 'g-akari-2': ELEVENLABS_ANIME_SFX.approvedPunchHit, 'g-akari-3': ELEVENLABS_ANIME_SFX.approvedPunchHit,
  'g-akari-4': ELEVENLABS_ANIME_SFX.approvedPunchHit, 'g-akari-5': ELEVENLABS_ANIME_SFX.approvedPunchHit, 'g-akari-6': ELEVENLABS_ANIME_SFX.approvedPunchHit, 'g-akari-7': ELEVENLABS_ANIME_SFX.approvedPunchHit,
  'g-galva-1': ELEVENLABS_ANIME_SFX.approvedPunchHit, 'g-galva-2': ELEVENLABS_ANIME_SFX.approvedPunchHit, 'g-galva-3': ELEVENLABS_ANIME_SFX.approvedPunchHit,
  'g-galva-4': ELEVENLABS_ANIME_SFX.approvedPunchHit, 'g-galva-5': ELEVENLABS_ANIME_SFX.approvedPunchHit, 'g-galva-6': ELEVENLABS_ANIME_SFX.approvedPunchHit, 'g-galva-7': ELEVENLABS_ANIME_SFX.approvedPunchHit,
  'g-kai-1': ELEVENLABS_ANIME_SFX.approvedPunchHit, 'g-kai-2': ELEVENLABS_ANIME_SFX.approvedPunchHit, 'g-kai-3': ELEVENLABS_ANIME_SFX.approvedPunchHit,
  'g-kai-4': ELEVENLABS_ANIME_SFX.approvedPunchHit, 'g-kai-5': ELEVENLABS_ANIME_SFX.approvedPunchHit, 'g-kai-6': ELEVENLABS_ANIME_SFX.approvedPunchHit, 'g-kai-7': ELEVENLABS_ANIME_SFX.approvedPunchHit,
  'g-shuraku-1': ELEVENLABS_ANIME_SFX.approvedPunchHit, 'g-shuraku-2': ELEVENLABS_ANIME_SFX.approvedPunchHit, 'g-shuraku-3': ELEVENLABS_ANIME_SFX.approvedPunchHit,
  'g-shuraku-4': ELEVENLABS_ANIME_SFX.approvedPunchHit, 'g-shuraku-5': ELEVENLABS_ANIME_SFX.approvedPunchHit, 'g-shuraku-6': ELEVENLABS_ANIME_SFX.approvedPunchHit, 'g-shuraku-7': ELEVENLABS_ANIME_SFX.approvedPunchHit,
  // ── Extra footsteps ─────────────────────────────────────────────────────────
  'footstep10': ELEVENLABS_ANIME_SFX.actionPlant, 'footstep11': ELEVENLABS_ANIME_SFX.actionPlant, 'footstep12': ELEVENLABS_ANIME_SFX.actionPlant,
  'footstep13': ELEVENLABS_ANIME_SFX.actionPlant, 'footstep14': ELEVENLABS_ANIME_SFX.actionPlant, 'footstep15': ELEVENLABS_ANIME_SFX.actionPlant,
  'swoosh':        ELEVENLABS_ANIME_SFX.movementDash,
  'swoosh2':       ELEVENLABS_ANIME_SFX.movementDash,
  'swoosh3':       ELEVENLABS_ANIME_SFX.movementDash,
  'swoosh4':       ELEVENLABS_ANIME_SFX.movementDash,
  'swoosh5':       ELEVENLABS_ANIME_SFX.movementDash,
  'swoosh6':       ELEVENLABS_ANIME_SFX.movementDash,
  'swoosh7':       ELEVENLABS_ANIME_SFX.movementDash,
  'swoosh8':       ELEVENLABS_ANIME_SFX.movementDash,
  'swoosh9':       ELEVENLABS_ANIME_SFX.movementDash,
  'swoosh10':      ELEVENLABS_ANIME_SFX.movementDash,
  'swoosh11':      ELEVENLABS_ANIME_SFX.movementDash,
  'swoosh12':      ELEVENLABS_ANIME_SFX.movementDash,
  'jump':         ELEVENLABS_ANIME_SFX.jumpLaunch,
  'block':        ELEVENLABS_ANIME_SFX.approvedPunchBlock,
  'block-impact': ELEVENLABS_ANIME_SFX.approvedPunchBlock,
  'energy-full':  ELEVENLABS_ANIME_SFX.fightStart,
  'ko':           ELEVENLABS_ANIME_SFX.throwLanding,
  'countdown-beep':  ELEVENLABS_ANIME_SFX.countdownTick,
  'fight-announce':  ELEVENLABS_ANIME_SFX.fightStart,
  'ui-click':        ELEVENLABS_ANIME_SFX.uiCharacterSelect,
  'fight-start':     ELEVENLABS_ANIME_SFX.fightStart,
  'dragon-fight':    ELEVENLABS_ANIME_SFX.fightStart,
  'ryu-win': DFX_VOICE_LINES.ryuWin, 'akari-win': DFX_VOICE_LINES.akariWin,
  'ryu-lose': DFX_VOICE_LINES.ryuLose, 'akari-lose': DFX_VOICE_LINES.akariLose,
  'galva-punch':   ELEVENLABS_ANIME_SFX.approvedPunchWhiff,
  'galva-kick':    ELEVENLABS_ANIME_SFX.approvedKickWhiff,
  'galva-win': DFX_VOICE_LINES.galvaWin, 'galva-lose': DFX_VOICE_LINES.galvaLose,
  'kai-punch':     ELEVENLABS_ANIME_SFX.approvedPunchWhiff,
  'kai-kick':      ELEVENLABS_ANIME_SFX.approvedKickWhiff,
  'kai-win': DFX_VOICE_LINES.kaiWin, 'kai-lose': DFX_VOICE_LINES.kaiLose,
  'shuraku-punch': ELEVENLABS_ANIME_SFX.approvedPunchWhiff,
  'shuraku-kick':  ELEVENLABS_ANIME_SFX.approvedKickWhiff,
  'shuraku-win': DFX_VOICE_LINES.shurakuWin, 'shuraku-lose': DFX_VOICE_LINES.shurakuLose,
  'lightning-blast':   ELEVENLABS_ANIME_SFX.galvaLightningBurst,
  'lightning-crackle': ELEVENLABS_ANIME_SFX.galvaLightningBurst,
  'galva-teleport-vanish':   ELEVENLABS_ANIME_SFX.galvaTeleport,
  'galva-teleport-reappear': ELEVENLABS_ANIME_SFX.galvaTeleport,
  'shadow-barrier':    ELEVENLABS_ANIME_SFX.guardClash,
  'tornado-whoosh':    ELEVENLABS_ANIME_SFX.kaiTempestCounter,
  'shuraku-grapple':   ELEVENLABS_ANIME_SFX.shurakuGrapple,
  'galva-ground-slam': ELEVENLABS_ANIME_SFX.galvaGroundSlam,
  'throw-landing':     ELEVENLABS_ANIME_SFX.throwLanding,
  'ryu-powerup': DFX_VOICE_LINES.ryuPowerup, 'akari-powerup': DFX_VOICE_LINES.akariPowerup,
  'galva-powerup': DFX_VOICE_LINES.galvaPowerup, 'kai-powerup': DFX_VOICE_LINES.kaiPowerup,
  'kai-powerup2-old': DFX_VOICE_LINES.kaiPowerup, 'shuraku-powerup': DFX_VOICE_LINES.shurakuPowerup,
};

export function isSuspended() {
  return false; // placeholder — checked externally via ctx.state
}

export class SoundManager {
  private ctx: AudioContext | null = null;
  private buffers: Map<string, AudioBuffer> = new Map();
  private mediaPools: Map<string, HTMLAudioElement[]> = new Map();
  private fightMusicNode: AudioBufferSourceNode | null = null;
  private fightMusicBuf: AudioBuffer | null = null;
  private activeNodes: AudioBufferSourceNode[] = [];
  private musicGain: GainNode | null = null;
  private duckTimer: ReturnType<typeof setTimeout> | null = null;
  private masterGain: GainNode | null = null;
  private muted = false;
  private resumePollId = 0;

  async init() {
    try {
      this.ctx = new AudioContext();
    } catch (e) {
      console.warn('[SoundManager] AudioContext failed:', e);
      return;
    }

    // Resume synchronously from the FIGHT button's user gesture before any playback.
    void this.ctx.resume().catch(() => {});

    // iOS: when a USB audio device (e.g. PS5 controller) is plugged in,
    // iOS switches the audio route and suspends the AudioContext.
    // We recover by listening for visibilitychange and polling every 2s.
    document.addEventListener('visibilitychange', this.handleVisibility);
    this.startResumePoll();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.8;
    this.masterGain.connect(this.ctx.destination);

    const allSounds = Object.entries(SOUNDS) as [string, string][];
    // `fetch` plus `decodeAudioData` is rejected by the external asset host in browsers.
    // HTMLMediaElement is allowed to stream the same files, including the signed storage redirects.
    for (const [key, url] of allSounds) this.prepareMediaPool(key, url);
    this.unlockMediaPlayback();
  }

  private prepareMediaPool(key: string, url: string) {
    if (this.mediaPools.has(key)) return;
    const voices = Array.from({ length: 3 }, () => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      audio.load();
      return audio;
    });
    this.mediaPools.set(key, voices);
  }

  private playMedia(key: string, volume: number) {
    const voices = this.mediaPools.get(key);
    if (!voices?.length) return false;
    const voice = voices.find((audio) => audio.paused || audio.ended) ?? voices[0];
    voice.pause();
    voice.currentTime = 0;
    voice.volume = Math.max(0, Math.min(1, volume * 0.8));
    void voice.play().catch((error) => console.warn('[SoundManager] Media playback blocked:', key, error));
    return true;
  }

  private unlockMediaPlayback() {
    const voice = this.mediaPools.get('footstep')?.[0];
    if (!voice) return;
    voice.muted = true;
    voice.volume = 0;
    // This call occurs synchronously within the FIGHT click, preserving browser user activation.
    void voice.play().then(() => {
      voice.pause();
      voice.currentTime = 0;
      voice.muted = false;
      voice.volume = 1;
    }).catch((error) => console.warn('[SoundManager] Media unlock failed:', error));
  }

  private startResumePoll() {
    const poll = () => {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      this.resumePollId = window.setTimeout(poll, 2000);
    };
    this.resumePollId = window.setTimeout(poll, 2000);
  }

  private handleVisibility = () => {
    if (document.visibilityState === 'visible') {
      this.ctx?.resume().catch(() => {});
    }
  };

  startFightMusic() {
    if (!this.ctx || !this.fightMusicBuf || !this.masterGain) return;
    this.stopFightMusic();
    if (!this.musicGain) {
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.55;
      this.musicGain.connect(this.masterGain);
    }
    const src = this.ctx.createBufferSource();
    src.buffer = this.fightMusicBuf;
    src.loop = true;
    src.connect(this.musicGain);
    src.start();
    this.fightMusicNode = src;
  }
  stopFightMusic() {
    try { this.fightMusicNode?.stop(); } catch (_) {}
    this.fightMusicNode = null;
  }

  duck(durationMs = 1800) {
    if (!this.musicGain || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.musicGain.gain.cancelScheduledValues(now);
    this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
    this.musicGain.gain.linearRampToValueAtTime(0.08, now + 0.05); // duck fast
    this.musicGain.gain.linearRampToValueAtTime(0.55, now + durationMs / 1000); // restore
  }

  play(key: string, volume = 1.0): boolean {
    if (this.muted) return false;
    if (this.playMedia(key, volume)) return true;
    if (!this.ctx || !this.masterGain) return false;
    const buf = this.buffers.get(key);
    if (!buf) return false;
    const src = this.ctx.createBufferSource();
    const gain = this.ctx.createGain();
    gain.gain.value = volume;
    src.buffer = buf;
    src.connect(gain);
    gain.connect(this.masterGain);
    this.activeNodes.push(src);
    src.onended = () => { this.activeNodes = this.activeNodes.filter(n => n !== src); };
    // Duck fight music for voice lines and power-up sounds
    const isVoice = key.includes('-win') || key.includes('-lose') || key.includes('-powerup') || key === 'dragon-fight';
    if (isVoice) this.duck(buf.duration * 1000 + 400);
    src.start();
    return true;
  }

  /**
   * Short synthesized layers keep combat responsive even when a downloaded SFX
   * fails to load. They are intentionally bright and stylized rather than realistic.
   */
  playAnimeImpact(kind: 'punch' | 'kick' | 'block' | 'slam' | 'throw' | 'land' | 'grapple' | 'whoosh', volume = 1.0) {
    if (this.muted || !this.ctx || !this.masterGain) return;
    const profiles = {
      punch:   { start: 190, end: 72,  duration: 0.09, tone: 0.32, noise: 0.12, type: 'square' as OscillatorType },
      kick:    { start: 136, end: 38,  duration: 0.13, tone: 0.40, noise: 0.16, type: 'sawtooth' as OscillatorType },
      block:   { start: 560, end: 170, duration: 0.08, tone: 0.20, noise: 0.18, type: 'triangle' as OscillatorType },
      slam:    { start: 94,  end: 24,  duration: 0.24, tone: 0.54, noise: 0.27, type: 'sawtooth' as OscillatorType },
      throw:   { start: 150, end: 48,  duration: 0.18, tone: 0.42, noise: 0.22, type: 'square' as OscillatorType },
      land:    { start: 104, end: 28,  duration: 0.17, tone: 0.38, noise: 0.24, type: 'triangle' as OscillatorType },
      grapple: { start: 130, end: 58,  duration: 0.12, tone: 0.30, noise: 0.14, type: 'square' as OscillatorType },
      whoosh:  { start: 310, end: 105, duration: 0.11, tone: 0.10, noise: 0.12, type: 'triangle' as OscillatorType },
    }[kind];
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const toneGain = this.ctx.createGain();
    osc.type = profiles.type;
    osc.frequency.setValueAtTime(profiles.start, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(18, profiles.end), now + profiles.duration);
    toneGain.gain.setValueAtTime(profiles.tone * volume * 0.28, now);
    toneGain.gain.exponentialRampToValueAtTime(0.001, now + profiles.duration);
    osc.connect(toneGain);
    toneGain.connect(this.masterGain);

    const noiseBuffer = this.ctx.createBuffer(1, Math.ceil(this.ctx.sampleRate * profiles.duration), this.ctx.sampleRate);
    const samples = noiseBuffer.getChannelData(0);
    for (let i = 0; i < samples.length; i++) {
      const decay = 1 - i / samples.length;
      samples[i] = (Math.random() * 2 - 1) * decay * decay;
    }
    const noise = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const noiseGain = this.ctx.createGain();
    filter.type = kind === 'block' ? 'bandpass' : 'lowpass';
    filter.frequency.value = kind === 'block' ? 1800 : kind === 'whoosh' ? 1200 : 720;
    noise.buffer = noiseBuffer;
    noiseGain.gain.setValueAtTime(profiles.noise * volume * 0.28, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + profiles.duration);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    osc.start(now);
    noise.start(now);
    osc.stop(now + profiles.duration);
    noise.stop(now + profiles.duration);
  }

  /** A compact arena-step layer backs up the approved streamed movement clip. */
  playAnimeStep(volume = 1.0) {
    if (this.muted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(128, now);
    osc.frequency.exponentialRampToValueAtTime(54, now + 0.07);
    gain.gain.setValueAtTime(0.085 * volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  /** Escalating arcade-style countdown pings plus a brighter final fight cue. */
  playAnimeCountdown(remaining: number) {
    if (this.muted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const isFight = remaining <= 0;
    const start = isFight ? 310 : 420 + (3 - Math.max(0, Math.min(3, remaining))) * 105;
    const end = isFight ? 1360 : start * 1.32;
    const duration = isFight ? 0.26 : 0.11;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = isFight ? 'sawtooth' : 'square';
    osc.frequency.setValueAtTime(start, now);
    osc.frequency.exponentialRampToValueAtTime(end, now + duration);
    gain.gain.setValueAtTime(isFight ? 0.25 : 0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + duration);
  }

  // Play a random variant from a set of keys
  playRandom(keys: string[], volume = 1.0): boolean {
    const key = keys[Math.floor(Math.random() * keys.length)];
    return this.play(key, volume);
  }

  private lastEventVariant = new Map<string, string>();

  // Select a different loaded clip on consecutive uses of the same gameplay event.
  playNoRepeat(event: string, keys: string[], volume = 1.0): boolean {
    const available = keys.filter((key) => this.mediaPools.has(key) || this.buffers.has(key));
    if (!available.length) return false;
    const last = this.lastEventVariant.get(event);
    const choices = available.length > 1 ? available.filter((key) => key !== last) : available;
    const key = choices[Math.floor(Math.random() * choices.length)];
    this.lastEventVariant.set(event, key);
    return this.play(key, volume);
  }

  resume() {
    this.ctx?.resume().catch(() => {});
  }
  stopAll() {
    for (const node of this.activeNodes) {
      try { node.stop(); } catch (_) {}
    }
    this.activeNodes = [];
    for (const voices of Array.from(this.mediaPools.values())) {
      for (const voice of voices) {
        voice.pause();
        voice.currentTime = 0;
      }
    }
  }
  stopAllAudio() {
    this.stopAll();
    this.stopFightMusic();
  }

  dispose() {
    this.stopFightMusic();
    clearTimeout(this.resumePollId);
    document.removeEventListener('visibilitychange', this.handleVisibility);
    for (const voices of Array.from(this.mediaPools.values())) {
      for (const voice of voices) voice.pause();
    }
    this.mediaPools.clear();
    this.ctx?.close();
  }
}
