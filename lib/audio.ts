// Comprehensive Web Audio engine for background music & sound effects
// Pure Web Audio API: 100% standalone, zero network dependency, instant start/mute.

class AudioManager {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private masterGain: GainNode | null = null;

  public isMusicPlaying: boolean = false;
  public isMusicEnabled: boolean = true;
  public isSoundEnabled: boolean = true;

  private musicInterval: any = null;
  private step: number = 0;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.7;
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.25;
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.35;
      this.sfxGain.connect(this.masterGain);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.isSoundEnabled = enabled;
  }

  public setMusicEnabled(enabled: boolean) {
    this.isMusicEnabled = enabled;
    if (!enabled) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
  }

  public toggleMusic(): boolean {
    this.setMusicEnabled(!this.isMusicEnabled);
    return this.isMusicEnabled;
  }

  public toggleSound(): boolean {
    this.setSoundEnabled(!this.isSoundEnabled);
    return this.isSoundEnabled;
  }

  // --- SOUND EFFECTS ---
  public playBounce() {
    if (!this.isSoundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const freq = 220 + Math.random() * 80;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Audio not permitted yet
    }
  }

  public playElimination() {
    if (!this.isSoundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.18);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start();
      osc.stop(now + 0.18);
    } catch {
      // Audio not permitted yet
    }
  }

  public playWinnerFanfare() {
    if (!this.isSoundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;

      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const noteTime = now + idx * 0.09;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0, noteTime);
        gain.gain.linearRampToValueAtTime(0.2, noteTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + (idx === notes.length - 1 ? 1.2 : 0.35));

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(noteTime);
        osc.stop(noteTime + (idx === notes.length - 1 ? 1.2 : 0.35));
      });
    } catch {
      // Audio not permitted yet
    }
  }

  public playStart() {
    if (!this.isSoundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start();
      osc.stop(now + 0.15);
    } catch {
      // Audio not permitted yet
    }
  }

  // --- PROCEDURAL SYNTHWAVE / BATTLE MUSIC ---
  public startMusic() {
    if (this.isMusicPlaying || !this.isMusicEnabled) return;
    try {
      this.initContext();
      if (!this.ctx || !this.musicGain) return;

      this.isMusicPlaying = true;
      this.step = 0;

      // 124 BPM -> 16th note = 120.96 ms
      const sixteenthTime = 60 / 124 / 4;

      // Bassline in Am: A1, C2, D2, F2, E2
      const bassProgression = [
        110.0, 110.0, 110.0, 110.0,
        130.81, 130.81, 130.81, 130.81,
        146.83, 146.83, 146.83, 146.83,
        164.81, 164.81, 123.47, 123.47
      ];

      const leadArp = [
        440, 523.25, 659.25, 880,
        523.25, 659.25, 880, 1046.5,
        587.33, 698.46, 880, 1174.66,
        659.25, 783.99, 987.77, 1318.51
      ];

      this.musicInterval = setInterval(() => {
        if (!this.isMusicPlaying || !this.isMusicEnabled || !this.ctx || !this.musicGain) return;

        const now = this.ctx.currentTime;
        const current16th = this.step % 16;
        const bar = Math.floor(this.step / 16) % 4;

        // 1. Kick on beat 0, 4, 8, 12
        if (current16th % 4 === 0) {
          const kickOsc = this.ctx.createOscillator();
          const kickGain = this.ctx.createGain();

          kickOsc.frequency.setValueAtTime(130, now);
          kickOsc.frequency.exponentialRampToValueAtTime(35, now + 0.08);

          kickGain.gain.setValueAtTime(0.25, now);
          kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

          kickOsc.connect(kickGain);
          kickGain.connect(this.musicGain);

          kickOsc.start(now);
          kickOsc.stop(now + 0.08);
        }

        // 2. Hi-hat on offbeats
        if (current16th % 2 === 1) {
          const hhOsc = this.ctx.createOscillator();
          const hhGain = this.ctx.createGain();

          hhOsc.type = 'triangle';
          hhOsc.frequency.setValueAtTime(8000, now);
          hhGain.gain.setValueAtTime(0.03, now);
          hhGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

          hhOsc.connect(hhGain);
          hhGain.connect(this.musicGain);

          hhOsc.start(now);
          hhOsc.stop(now + 0.03);
        }

        // 3. Synth Bass
        const bassFreq = bassProgression[current16th] / 2;
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();

        bassOsc.type = 'sawtooth';
        bassOsc.frequency.setValueAtTime(bassFreq, now);

        bassGain.gain.setValueAtTime(0.07, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + sixteenthTime * 0.9);

        bassOsc.connect(bassGain);
        bassGain.connect(this.musicGain);

        bassOsc.start(now);
        bassOsc.stop(now + sixteenthTime * 0.9);

        // 4. Melodic Arp accent on higher bars
        if (bar >= 1 && current16th % 2 === 0) {
          const leadFreq = leadArp[current16th];
          const leadOsc = this.ctx.createOscillator();
          const leadGain = this.ctx.createGain();

          leadOsc.type = 'sine';
          leadOsc.frequency.setValueAtTime(leadFreq, now);

          leadGain.gain.setValueAtTime(0.035, now);
          leadGain.gain.exponentialRampToValueAtTime(0.0001, now + sixteenthTime * 1.2);

          leadOsc.connect(leadGain);
          leadGain.connect(this.musicGain);

          leadOsc.start(now);
          leadOsc.stop(now + sixteenthTime * 1.2);
        }

        this.step++;
      }, sixteenthTime * 1000);
    } catch {
      // Audio context might need user interaction first
    }
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

// Global singleton instance
export const audio = typeof window !== 'undefined' ? new AudioManager() : (null as any);

