/**
 * Web Audio API Synthesizer & Sound FX
 * Generates an ethereal, romantic acoustic music box ambience and gentle UI sounds.
 * Requires zero external audio downloads, avoiding broken file links.
 */

class RomanticAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isMusicPlaying: boolean = false;
  private musicIntervalId: number | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private externalAudio: HTMLAudioElement | null = null;
  private noteIndex: number = 0;

  // Gentle romantic music box arpeggio frequencies (Hz)
  private readonly melodyNotes: number[] = [
    293.66, 369.99, 440.00, 587.33, // D major
    220.00, 277.18, 329.63, 440.00, // A major
    246.94, 293.66, 369.99, 493.88, // B minor
    185.00, 220.00, 277.18, 369.99, // F# minor
    196.00, 246.94, 293.66, 392.00, // G major
    220.00, 293.66, 369.99, 440.00, // D major / A
    196.00, 246.94, 293.66, 392.00, // G major
    220.00, 277.18, 329.63, 440.00, // A sus
    329.63, 369.99, 440.00, 587.33,
    440.00, 493.88, 587.33, 659.25,
    392.00, 440.00, 493.88, 587.33,
    293.66, 369.99, 440.00, 587.33,
  ];

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(1, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
        this.musicGain.connect(this.masterGain);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public async startMusic(customUrl?: string) {
    if (this.isMusicPlaying) return;
    this.isMusicPlaying = true;

    if (customUrl && customUrl.trim() !== '') {
      try {
        if (!this.externalAudio) {
          this.externalAudio = new Audio(customUrl);
          this.externalAudio.loop = true;
          this.externalAudio.volume = this.isMuted ? 0 : 0.35;
        }
        await this.externalAudio.play();
        return;
      } catch (err) {
        console.warn('Custom audio playback fallback to synthesizer', err);
      }
    }

    const ctx = this.getContext();
    if (!ctx) return;

    if (this.musicGain) {
      const now = ctx.currentTime;
      this.musicGain.gain.cancelScheduledValues(now);
      this.musicGain.gain.setValueAtTime(0.001, now);
      this.musicGain.gain.exponentialRampToValueAtTime(this.isMuted ? 0.0001 : 0.16, now + 1.5);
    }

    // Play synthesized warm music box notes
    this.noteIndex = 0;
    this.playNextMusicNote();
    this.musicIntervalId = window.setInterval(() => {
      this.playNextMusicNote();
    }, 550);
  }

  private playNextMusicNote() {
    if (!this.isMusicPlaying || this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.musicGain) return;

    const freq = this.melodyNotes[this.noteIndex % this.melodyNotes.length];
    this.noteIndex++;

    const now = ctx.currentTime;

    // Primary bell tone
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);

    // Warm sine wave with subtle triangle harmonic
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Envelope: quick gentle attack, soft ringing decay
    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(0.2, now + 0.03);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

    osc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.musicGain);

    osc.start(now);
    osc.stop(now + 1.9);

    // Very soft harmonic overtone for music box sparkle
    if (this.noteIndex % 3 === 0) {
      const harmOsc = ctx.createOscillator();
      const harmGain = ctx.createGain();
      harmOsc.type = 'triangle';
      harmOsc.frequency.setValueAtTime(freq * 2, now);

      harmGain.gain.setValueAtTime(0, now);
      harmGain.gain.linearRampToValueAtTime(0.04, now + 0.02);
      harmGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      harmOsc.connect(harmGain);
      harmGain.connect(this.musicGain);

      harmOsc.start(now);
      harmOsc.stop(now + 1.3);
    }
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicIntervalId) {
      clearInterval(this.musicIntervalId);
      this.musicIntervalId = null;
    }
    if (this.externalAudio) {
      this.externalAudio.pause();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    const ctx = this.getContext();

    if (this.masterGain && ctx) {
      const now = ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : 1, now + 0.15);
    }

    if (this.externalAudio) {
      this.externalAudio.volume = this.isMuted ? 0 : 0.35;
    }

    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playEnvelopeOpenSound() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;

    // Soft paper rustle via filtered noise
    const bufferSize = ctx.sampleRate * 0.35;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.12));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(450, now + 0.3);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(now);

    // Warm subtle glockenspiel ping
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now + 0.05); // C5
    oscGain.gain.setValueAtTime(0.06, now + 0.05);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

    osc.connect(oscGain);
    oscGain.connect(this.sfxGain);
    osc.start(now + 0.05);
    osc.stop(now + 0.65);
  }

  public playCandleIgniteSound() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, now); // E5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.09, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.55);
  }

  public playCandleBlowSound() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;

    // Breath puff sound
    const bufferSize = ctx.sampleRate * 0.45;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);
    filter.frequency.linearRampToValueAtTime(200, now + 0.4);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(now);
  }

  public playCakeCutSound() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;

    // Soft chime sequence for cutting
    const notes = [659.25, 783.99, 987.77];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      noteGain.gain.setValueAtTime(0.07, now + idx * 0.08);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.8);

      osc.connect(noteGain);
      noteGain.connect(this.sfxGain!);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.85);
    });
  }

  public playCelebrationChime() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;
    const chord = [523.25, 659.25, 783.99, 1046.50]; // C major celebratory chord

    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.08, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + idx * 0.05);
      osc.stop(now + 1.5);
    });
  }

  public playPandaMunchSound() {
    this.playPandaChewingSequence();
  }

  /**
   * Synchronized realistic chewing and munching sound effect
   * Simulates teeth biting into fluffy cake sponge, strawberry squish, and cute nom-nom chewing smacks.
   */
  public playPandaChewingSequence() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;

    // 4 rhythmic chews: Big initial chomp -> Nom -> Nom -> Swallow smack
    const chewTimes = [0, 0.36, 0.72, 1.08];

    chewTimes.forEach((delay, index) => {
      const startTime = now + delay;

      // 1. Crisp crumb texture (Filtered noise burst for teeth breaking through cake sponge)
      const noiseBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.08), ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseBuffer.length; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.02));
      }
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(index === 0 ? 1750 : 1300, startTime);
      noiseFilter.Q.setValueAtTime(3.5, startTime);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(index === 0 ? 0.16 : 0.09, startTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.07);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.sfxGain!);

      noiseSource.start(startTime);
      noiseSource.stop(startTime + 0.08);

      // 2. Resonant Mouth Tonal Pop ("chomp" / "nom" body resonance)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = index % 2 === 0 ? 'sine' : 'triangle';
      const baseFreq = index === 0 ? 340 : index === 1 ? 270 : index === 2 ? 310 : 250;
      osc.frequency.setValueAtTime(baseFreq, startTime);
      osc.frequency.exponentialRampToValueAtTime(110, startTime + 0.09);

      oscGain.gain.setValueAtTime(index === 0 ? 0.15 : 0.11, startTime);
      oscGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);

      osc.connect(oscGain);
      oscGain.connect(this.sfxGain!);

      osc.start(startTime);
      osc.stop(startTime + 0.11);

      // 3. Cute strawberry jelly & cream squish (higher harmonic formant smack)
      const smackOsc = ctx.createOscillator();
      const smackGain = ctx.createGain();

      smackOsc.type = 'sine';
      smackOsc.frequency.setValueAtTime(850 + index * 50, startTime + 0.015);
      smackOsc.frequency.exponentialRampToValueAtTime(320, startTime + 0.06);

      smackGain.gain.setValueAtTime(index === 0 ? 0.08 : 0.05, startTime + 0.015);
      smackGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.065);

      smackOsc.connect(smackGain);
      smackGain.connect(this.sfxGain!);

      smackOsc.start(startTime + 0.015);
      smackOsc.stop(startTime + 0.07);
    });
  }

  /**
   * Distant, warm cinematic firework pop / resonant rumble
   * Soft, non-intrusive ambient celebration sound
   */
  public playDistantFireworkPop() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;

    const now = ctx.currentTime;

    // Distant muffled bass thud
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.35);

    oscGain.gain.setValueAtTime(0.08, now);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

    osc.connect(oscGain);
    oscGain.connect(this.sfxGain!);
    osc.start(now);
    osc.stop(now + 0.4);

    // Soft shimmering sparkle crackle
    const noiseBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.35), ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.1));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(950, now);
    filter.Q.setValueAtTime(2.0, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain!);

    noise.start(now);
  }
}

export const romanticAudio = new RomanticAudioEngine();
