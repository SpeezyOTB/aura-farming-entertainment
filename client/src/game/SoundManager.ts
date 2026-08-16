// Sound URLs from uploaded assets
const SOUNDS: Record<string, string> = {
  'ryu-punch':    'https://fightergame-j95rkwu8.manus.space/manus-storage/ryu-punch_d44c82b1.wav',
  'ryu-punch2':   'https://fightergame-j95rkwu8.manus.space/manus-storage/ryu-punch2_1af02088.wav',
  'ryu-punch3':   'https://fightergame-j95rkwu8.manus.space/manus-storage/ryu-punch3_28c8d1e5.wav',
  'ryu-kick':     'https://fightergame-j95rkwu8.manus.space/manus-storage/ryu-kick_54a922da.wav',
  'ryu-kick2':    'https://fightergame-j95rkwu8.manus.space/manus-storage/ryu-kick2_3aab2c17.wav',
  'akari-punch':  'https://fightergame-j95rkwu8.manus.space/manus-storage/akari-punch_9e51292f.wav',
  'akari-punch2': 'https://fightergame-j95rkwu8.manus.space/manus-storage/akari-punch2_89c37cb8.wav',
  'akari-punch3': 'https://fightergame-j95rkwu8.manus.space/manus-storage/akari-punch3_7df347a0.wav',
  'akari-kick':   'https://fightergame-j95rkwu8.manus.space/manus-storage/akari-kick_f2975ee0.wav',
  'akari-kick2':  'https://fightergame-j95rkwu8.manus.space/manus-storage/akari-kick2_9b80cfad.wav',
  'punch-impact':  'https://fightergame-j95rkwu8.manus.space/manus-storage/impact_01_e1547f67.wav',
  'punch-impact2': 'https://fightergame-j95rkwu8.manus.space/manus-storage/impact_02_8f18ac1f.wav',
  'punch-impact3': 'https://fightergame-j95rkwu8.manus.space/manus-storage/impact_03_aac30bde.wav',
  'punch-impact4': 'https://fightergame-j95rkwu8.manus.space/manus-storage/impact_04_f44774e3.wav',
  'punch-impact5': 'https://fightergame-j95rkwu8.manus.space/manus-storage/impact_05_e7b631ff.wav',
  'punch-impact6': 'https://fightergame-j95rkwu8.manus.space/manus-storage/impact_06_3ff432c7.wav',
  'kick-impact':   'https://fightergame-j95rkwu8.manus.space/manus-storage/impact_07_9ce226dd.wav',
  'kick-impact2':  'https://fightergame-j95rkwu8.manus.space/manus-storage/impact_08_e1a31e3d.wav',
  'kick-impact3':  'https://fightergame-j95rkwu8.manus.space/manus-storage/impact_09_e03cae0d.wav',
  'kick-impact4':  'https://fightergame-j95rkwu8.manus.space/manus-storage/impact_10_1da8ee95.wav',
  'kick-impact5':  'https://fightergame-j95rkwu8.manus.space/manus-storage/impact_11_09a944c8.wav',
  'kick-impact6':  'https://fightergame-j95rkwu8.manus.space/manus-storage/impact_12_f815f95e.wav',
  'kick-impact7':  'https://fightergame-j95rkwu8.manus.space/manus-storage/impact_13_0ab2fef0.wav',
  'footstep':      'https://fightergame-j95rkwu8.manus.space/manus-storage/footstep_01_c497650a.wav',
  'footstep2':     'https://fightergame-j95rkwu8.manus.space/manus-storage/footstep_02_651cbaa1.wav',
  'footstep3':     'https://fightergame-j95rkwu8.manus.space/manus-storage/footstep_03_a453b8d6.wav',
  'footstep4':     'https://fightergame-j95rkwu8.manus.space/manus-storage/footstep_04_d3f8ef0b.wav',
  'footstep5':     'https://fightergame-j95rkwu8.manus.space/manus-storage/footstep_05_f35d0cb6.wav',
  'footstep6':     'https://fightergame-j95rkwu8.manus.space/manus-storage/footstep_06_a61fd92e.wav',
  'footstep7':     'https://fightergame-j95rkwu8.manus.space/manus-storage/footstep_07_f031adf9.wav',
  'footstep8':     'https://fightergame-j95rkwu8.manus.space/manus-storage/footstep_08_6d70bb18.wav',
  'footstep9':     'https://fightergame-j95rkwu8.manus.space/manus-storage/footstep_09_2524ddba.wav',
  'miss-whoosh':   'https://fightergame-j95rkwu8.manus.space/manus-storage/miss-whoosh_b5e60314.wav',
  // ── Hit reaction variants ──────────────────────────────────────────────────











  // ── Hit reaction grunts (g-{char}-{1-7}) ────────────────────────────────────
  'g-ryu-1':     'https://fightergame-j95rkwu8.manus.space/manus-storage/gd-ryu-1_e94a3a87.wav',
  'g-ryu-2':     'https://fightergame-j95rkwu8.manus.space/manus-storage/gd-ryu-2_faf7c978.wav',
  'g-ryu-3':     'https://fightergame-j95rkwu8.manus.space/manus-storage/gd-ryu-3_1fdd63cc.wav',
  'g-ryu-4':     'https://fightergame-j95rkwu8.manus.space/manus-storage/gd-ryu-4_a83f8d81.wav',
  'g-ryu-5':     'https://fightergame-j95rkwu8.manus.space/manus-storage/gd-ryu-5_c6d95e0d.wav',
  'g-ryu-6':     'https://fightergame-j95rkwu8.manus.space/manus-storage/gd-ryu-6_c4d1e7de.wav',
  'g-ryu-7':     'https://fightergame-j95rkwu8.manus.space/manus-storage/gd-ryu-7_bcc3a6e4.wav',
  'g-akari-1':   'https://fightergame-j95rkwu8.manus.space/manus-storage/gd-akari-1_d45f4e0f.wav',
  'g-akari-2':   'https://fightergame-j95rkwu8.manus.space/manus-storage/gd-akari-2_233eae13.wav',
  'g-akari-3':   'https://fightergame-j95rkwu8.manus.space/manus-storage/gd-akari-3_5d6d2c88.wav',
  'g-akari-4':   'https://fightergame-j95rkwu8.manus.space/manus-storage/gd-akari-4_46896713.wav',
  'g-akari-5':   'https://fightergame-j95rkwu8.manus.space/manus-storage/gd-akari-5_cd232d14.wav',
  'g-akari-6':   'https://fightergame-j95rkwu8.manus.space/manus-storage/gd-akari-6_6d25a72b.wav',
  'g-akari-7':   'https://fightergame-j95rkwu8.manus.space/manus-storage/gd-akari-7_3fafcd02.wav',
  'g-galva-1':   'https://fightergame-j95rkwu8.manus.space/manus-storage/gd-galva-1_807608c5.wav',
  'g-galva-2':   'https://fightergame-j95rkwu8.manus.space/manus-storage/gd-galva-2_de67f503.wav',
  'g-galva-3':   'https://fightergame-j95rkwu8.manus.space/manus-storage/gd-galva-3_29a16cb0.wav',
  'g-galva-4':   'https://fightergame-j95rkwu8.manus.space/manus-storage/gd-galva-4_b199b3be.wav',
  'g-galva-5':   'https://fightergame-j95rkwu8.manus.space/manus-storage/gd-galva-5_6c850dac.wav',
  'g-galva-6':   'https://fightergame-j95rkwu8.manus.space/manus-storage/gd-galva-6_0eecdda2.wav',
  'g-galva-7':   'https://fightergame-j95rkwu8.manus.space/manus-storage/gd-galva-7_8da5ac83.wav',
  'g-kai-1':     'https://fightergame-j95rkwu8.manus.space/manus-storage/gd-kai-1_8333a8b6.wav',
  'g-kai-2':     'https://fightergame-j95rkwu8.manus.space/manus-storage/gd-kai-2_d146c528.wav',
  'g-kai-3':     'https://fightergame-j95rkwu8.manus.space/manus-storage/gd-kai-3_8321bd6e.wav',
  'g-kai-4':     'https://fightergame-j95rkwu8.manus.space/manus-storage/gd-kai-4_e25f1ecc.wav',
  'g-kai-5':     'https://fightergame-j95rkwu8.manus.space/manus-storage/gd-kai-5_4f146f62.wav',
  'g-kai-6':     'https://fightergame-j95rkwu8.manus.space/manus-storage/gd-kai-6_b6b2d4d6.wav',
  'g-kai-7':     'https://fightergame-j95rkwu8.manus.space/manus-storage/gd-kai-7_f12e1a94.wav',
  'g-shuraku-1': 'https://fightergame-j95rkwu8.manus.space/manus-storage/gd-shuraku-1_5c7a7654.wav',
  'g-shuraku-2': 'https://fightergame-j95rkwu8.manus.space/manus-storage/gd-shuraku-2_ee8eda4a.wav',
  'g-shuraku-3': 'https://fightergame-j95rkwu8.manus.space/manus-storage/gd-shuraku-3_224ff075.wav',
  'g-shuraku-4': 'https://fightergame-j95rkwu8.manus.space/manus-storage/gd-shuraku-4_8f9f5ee5.wav',
  'g-shuraku-5': 'https://fightergame-j95rkwu8.manus.space/manus-storage/gd-shuraku-5_119d0346.wav',
  'g-shuraku-6': 'https://fightergame-j95rkwu8.manus.space/manus-storage/gd-shuraku-6_d6e2c8c2.wav',
  'g-shuraku-7': 'https://fightergame-j95rkwu8.manus.space/manus-storage/gd-shuraku-7_fbf1c2c4.wav',
  // ── Extra footsteps ─────────────────────────────────────────────────────────
  'footstep10':         'https://fightergame-j95rkwu8.manus.space/manus-storage/footstep_10_e8f85fed.wav',
  'footstep11':         'https://fightergame-j95rkwu8.manus.space/manus-storage/footstep_11_c5365160.wav',
  'footstep12':         'https://fightergame-j95rkwu8.manus.space/manus-storage/footstep_12_63fe9c5d.wav',
  'footstep13':         'https://fightergame-j95rkwu8.manus.space/manus-storage/footstep_13_b1f3a109.wav',
  'footstep14':         'https://fightergame-j95rkwu8.manus.space/manus-storage/footstep_14_cb878bcf.wav',
  'footstep15':         'https://fightergame-j95rkwu8.manus.space/manus-storage/footstep_15_fafd4ea7.wav',
  'swoosh':        'https://fightergame-j95rkwu8.manus.space/manus-storage/swoosh_01_69ef8fa9.wav',
  'swoosh2':       'https://fightergame-j95rkwu8.manus.space/manus-storage/swoosh_02_990e8076.wav',
  'swoosh3':       'https://fightergame-j95rkwu8.manus.space/manus-storage/swoosh_03_d80bebea.wav',
  'swoosh4':       'https://fightergame-j95rkwu8.manus.space/manus-storage/swoosh_04_531ad3d9.wav',
  'swoosh5':       'https://fightergame-j95rkwu8.manus.space/manus-storage/swoosh_05_861a5fd5.wav',
  'swoosh6':       'https://fightergame-j95rkwu8.manus.space/manus-storage/swoosh_06_6090d6b4.wav',
  'swoosh7':       'https://fightergame-j95rkwu8.manus.space/manus-storage/swoosh_07_c5020237.wav',
  'swoosh8':       'https://fightergame-j95rkwu8.manus.space/manus-storage/swoosh_08_099c4284.wav',
  'swoosh9':       'https://fightergame-j95rkwu8.manus.space/manus-storage/swoosh_09_d2f0f995.wav',
  'swoosh10':      'https://fightergame-j95rkwu8.manus.space/manus-storage/swoosh_10_feaed95b.wav',
  'swoosh11':      'https://fightergame-j95rkwu8.manus.space/manus-storage/swoosh_11_08938793.wav',
  'swoosh12':      'https://fightergame-j95rkwu8.manus.space/manus-storage/swoosh_12_33311698.wav',
  'jump':         'https://fightergame-j95rkwu8.manus.space/manus-storage/jump_c411b0b1.wav',
  'block':        'https://fightergame-j95rkwu8.manus.space/manus-storage/block_edf4c046.wav',
  'block-impact': 'https://fightergame-j95rkwu8.manus.space/manus-storage/block-impact_ec5aff90.wav',
  'energy-full':  'https://fightergame-j95rkwu8.manus.space/manus-storage/energy-full_3b3bd242.wav',
  'ko':           'https://fightergame-j95rkwu8.manus.space/manus-storage/ko_5b91acbb.wav',
  'countdown-beep':  'https://fightergame-j95rkwu8.manus.space/manus-storage/countdown-beep_7e3701d6.wav',
  'fight-announce':  'https://fightergame-j95rkwu8.manus.space/manus-storage/fight-announce_da26066a.wav',
  'ui-click':        'https://fightergame-j95rkwu8.manus.space/manus-storage/ui-click_5a63fcad.wav',
  'fight-start':     'https://fightergame-j95rkwu8.manus.space/manus-storage/fight-start_57a8e184.wav',
  'dragon-fight':    'https://fightergame-j95rkwu8.manus.space/manus-storage/dragon-fight2_4555641d.wav',
  'ryu-win':         'https://fightergame-j95rkwu8.manus.space/manus-storage/ryu-win-dry_db5868de.wav',
  'akari-win':       'https://fightergame-j95rkwu8.manus.space/manus-storage/akari-win-dry_78606886.wav',
  'ryu-lose':        'https://fightergame-j95rkwu8.manus.space/manus-storage/ryu-lose-dry_2385c5a8.wav',
  'akari-lose':      'https://fightergame-j95rkwu8.manus.space/manus-storage/akari-lose-dry_c428709d.wav',
  'galva-punch':   'https://fightergame-j95rkwu8.manus.space/manus-storage/galva-punch_1fb25134.wav',
  'galva-kick':    'https://fightergame-j95rkwu8.manus.space/manus-storage/galva-kick_683513e5.wav',
  'galva-win':     'https://fightergame-j95rkwu8.manus.space/manus-storage/galva-win-dry_59ecf617.wav',
  'galva-lose':    'https://fightergame-j95rkwu8.manus.space/manus-storage/galva-lose-dry_17ba595f.wav',
  'kai-punch':     'https://fightergame-j95rkwu8.manus.space/manus-storage/kai-punch_f555e8dc.wav',
  'kai-kick':      'https://fightergame-j95rkwu8.manus.space/manus-storage/kai-kick_32e6daa9.wav',
  'kai-win':       'https://fightergame-j95rkwu8.manus.space/manus-storage/kai-win-dry_cbe11c63.wav',
  'kai-lose':      'https://fightergame-j95rkwu8.manus.space/manus-storage/kai-lose-dry_036005d2.wav',
  'shuraku-punch': 'https://fightergame-j95rkwu8.manus.space/manus-storage/shuraku-punch_e9ade7e3.wav',
  'shuraku-kick':  'https://fightergame-j95rkwu8.manus.space/manus-storage/shuraku-kick_f0013bdd.wav',
  'shuraku-win':   'https://fightergame-j95rkwu8.manus.space/manus-storage/shuraku-win-dry_70c0586e.wav',
  'shuraku-lose':  'https://fightergame-j95rkwu8.manus.space/manus-storage/shuraku-lose-dry_6176aea1.wav',
  'lightning-blast':   'https://fightergame-j95rkwu8.manus.space/manus-storage/lightning-blast_34ac3e89.wav',
  'lightning-crackle': 'https://fightergame-j95rkwu8.manus.space/manus-storage/lightning-crackle_e496342f.wav',
  'galva-teleport-vanish':   'https://fightergame-j95rkwu8.manus.space/manus-storage/galva-teleport_vanish_b4a5dba7.wav',
  'galva-teleport-reappear': 'https://fightergame-j95rkwu8.manus.space/manus-storage/galva-teleport_reappear_3732faf2.wav',
  'shadow-barrier':    'https://fightergame-j95rkwu8.manus.space/manus-storage/shadow-barrier_f48dea68.wav',
  'tornado-whoosh':    'https://fightergame-j95rkwu8.manus.space/manus-storage/tornado-whoosh_f1b3adb0.wav',
  'ryu-powerup':     'https://fightergame-j95rkwu8.manus.space/manus-storage/ryu-powerup-dry_60e0e425.wav',
  'akari-powerup':   'https://fightergame-j95rkwu8.manus.space/manus-storage/akari-powerup-dry_b56190ee.wav',
  'galva-powerup':   'https://fightergame-j95rkwu8.manus.space/manus-storage/galva-powerup-dry_0845a541.wav',
  'kai-powerup': 'https://fightergame-j95rkwu8.manus.space/manus-storage/kai-powerup-dry_6608e33e.wav'
  ,
  'kai-powerup2-old': 'https://fightergame-j95rkwu8.manus.space/manus-storage/kai-powerup2_42320f89.wav',
  'shuraku-powerup': 'https://fightergame-j95rkwu8.manus.space/manus-storage/shuraku-powerup-dry_77caad46.wav',
};

export function isSuspended() {
  return false; // placeholder — checked externally via ctx.state
}

const WIND_URL = 'https://fightergame-j95rkwu8.manus.space/manus-storage/wind_loop_710f2911.mp3';

export class SoundManager {
  private ctx: AudioContext | null = null;
  private buffers: Map<string, AudioBuffer> = new Map();
  private windNode: AudioBufferSourceNode | null = null;
  private fightMusicNode: AudioBufferSourceNode | null = null;
  private fightMusicBuf: AudioBuffer | null = null;
  private activeNodes: AudioBufferSourceNode[] = [];
  private windGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private duckTimer: ReturnType<typeof setTimeout> | null = null;
  private masterGain: GainNode | null = null;
  private muted = false;
  private resumePollId = 0;
  private windBuf: AudioBuffer | null = null;

  async init() {
    try {
      this.ctx = new AudioContext();
    } catch (e) {
      console.warn('[SoundManager] AudioContext failed:', e);
      return;
    }

    // iOS: when a USB audio device (e.g. PS5 controller) is plugged in,
    // iOS switches the audio route and suspends the AudioContext.
    // We recover by listening for visibilitychange and polling every 2s.
    document.addEventListener('visibilitychange', this.handleVisibility);
    this.startResumePoll();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.8;
    this.masterGain.connect(this.ctx.destination);

    // Load all SFX
    await Promise.all(
      Object.entries(SOUNDS).map(async ([key, url]) => {
        try {
          const res = await fetch(url);
          const arr = await res.arrayBuffer();
          const buf = await this.ctx!.decodeAudioData(arr);
          this.buffers.set(key, buf);
        } catch (e) { console.warn('[SoundManager] SFX load failed:', key, e); }
      })
    );

    // Load fight music (rock — plays during battle)
    try {
      const fmRes = await fetch('https://fightergame-j95rkwu8.manus.space/manus-storage/select-music_e27b765f.mp3');
      const fmArr = await fmRes.arrayBuffer();
      this.fightMusicBuf = await this.ctx.decodeAudioData(fmArr);
    } catch (e) { console.warn('[SoundManager] Fight music load failed:', e); }
    // Load and loop wind ambient
    try {
      const res = await fetch(WIND_URL);
      const arr = await res.arrayBuffer();
      const buf = await this.ctx.decodeAudioData(arr);
      this.windBuf = buf;
      this.windGain = this.ctx.createGain();
      this.windGain.gain.value = 0.45; // audible during gameplay
      this.windGain.connect(this.masterGain);
      this.startWind(buf);
    } catch (e) { console.warn('[SoundManager] Wind load failed:', e); }
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

  private startWind(buf: AudioBuffer) {
    if (!this.ctx || !this.windGain) return;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    src.connect(this.windGain);
    src.start();
    this.windNode = src;
  }

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

  play(key: string, volume = 1.0) {
    if (this.muted || !this.ctx || !this.masterGain) return;
    const buf = this.buffers.get(key);
    if (!buf) return;
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
    toneGain.gain.setValueAtTime(profiles.tone * volume, now);
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
    noiseGain.gain.setValueAtTime(profiles.noise * volume, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + profiles.duration);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    osc.start(now);
    noise.start(now);
    osc.stop(now + profiles.duration);
    noise.stop(now + profiles.duration);
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
  playRandom(keys: string[], volume = 1.0) {
    const key = keys[Math.floor(Math.random() * keys.length)];
    this.play(key, volume);
  }

  resume() {
    this.ctx?.resume().catch(() => {});
  }
  stopAll() {
    for (const node of this.activeNodes) {
      try { node.stop(); } catch (_) {}
    }
    this.activeNodes = [];
  }
  stopAllAudio() {
    this.stopAll();
    this.stopFightMusic();
    try { this.windNode?.stop(); } catch (_) {}
    this.windNode = null;
  }

  dispose() {
    this.stopFightMusic();
    this.windNode?.stop();
    clearTimeout(this.resumePollId);
    document.removeEventListener('visibilitychange', this.handleVisibility);
    this.ctx?.close();
  }
}
