// Comprehensive Procedural Automotive Cinema Audio Synthesizer
// Synthesizes authentic Crossplane V8 combustion lope, dual-mode exhaust resonance,
// induction airflow rush, starter ignition sequence, and deep cinematic sub-bass.

class CinematicAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.initialized = false;

    // Audio Nodes
    this.masterGain = null;
    this.v8Gain = null;
    this.exhaustGain = null;
    this.inductionGain = null;
    this.subGain = null;

    // Oscillators & Filters
    this.v8CylinderOsc = null;
    this.v8HarmonicOsc = null;
    this.lopeLFO = null;
    this.lopeGain = null;
    this.exhaustFilter = null;
    this.exhaustRaspFilter = null;
    this.inductionFilter = null;
    this.noiseNode = null;
    this.subBassOsc = null;

    this.currentRPM = 750; // Idle RPM
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();

      // Master output bus with smooth limiter
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // --- 1. DEEP CINEMATIC SUB-BASS BED (34 Hz) ---
      this.subBassOsc = this.ctx.createOscillator();
      this.subBassOsc.type = 'sine';
      this.subBassOsc.frequency.setValueAtTime(34, this.ctx.currentTime);

      this.subGain = this.ctx.createGain();
      this.subGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

      this.subBassOsc.connect(this.subGain);
      this.subGain.connect(this.masterGain);
      this.subBassOsc.start();

      // --- 2. V8 COMBUSTION LOPE (Crossplane Firing Order) ---
      // Crossplane V8 idle ~750 RPM -> 4 combustion pulses per revolution = ~50 Hz base,
      // with a 12.5 Hz staggered lope characteristic of American pushrod V8s
      this.v8CylinderOsc = this.ctx.createOscillator();
      this.v8CylinderOsc.type = 'sawtooth';
      this.v8CylinderOsc.frequency.setValueAtTime(48, this.ctx.currentTime);

      this.v8HarmonicOsc = this.ctx.createOscillator();
      this.v8HarmonicOsc.type = 'triangle';
      this.v8HarmonicOsc.frequency.setValueAtTime(96, this.ctx.currentTime);

      // Waveshaper for cylinder compression distortion
      const shaper = this.ctx.createWaveShaper();
      shaper.curve = this._makeDistortionCurve(18);

      // Combustion lope LFO (~12.5 Hz idle modulation)
      this.lopeLFO = this.ctx.createOscillator();
      this.lopeLFO.type = 'sine';
      this.lopeLFO.frequency.setValueAtTime(12.5, this.ctx.currentTime);

      this.lopeGain = this.ctx.createGain();
      this.lopeGain.gain.setValueAtTime(0.28, this.ctx.currentTime);

      this.v8Gain = this.ctx.createGain();
      this.v8Gain.gain.setValueAtTime(0.45, this.ctx.currentTime);

      this.v8CylinderOsc.connect(shaper);
      this.v8HarmonicOsc.connect(shaper);

      // Modulate V8 gain with combustion lope
      this.lopeLFO.connect(this.lopeGain);
      this.lopeGain.connect(this.v8Gain.gain);

      shaper.connect(this.v8Gain);
      this.lopeLFO.start();
      this.v8CylinderOsc.start();
      this.v8HarmonicOsc.start();

      // --- 3. DUAL-MODE ACTIVE EXHAUST RESONANCE (Quad Pipes) ---
      // Primary chamber resonance (185 Hz)
      this.exhaustFilter = this.ctx.createBiquadFilter();
      this.exhaustFilter.type = 'bandpass';
      this.exhaustFilter.frequency.setValueAtTime(185, this.ctx.currentTime);
      this.exhaustFilter.Q.setValueAtTime(4.2, this.ctx.currentTime);

      // Secondary stainless steel quad pipe metallic rasp (420 Hz)
      this.exhaustRaspFilter = this.ctx.createBiquadFilter();
      this.exhaustRaspFilter.type = 'peaking';
      this.exhaustRaspFilter.frequency.setValueAtTime(420, this.ctx.currentTime);
      this.exhaustRaspFilter.gain.setValueAtTime(6.0, this.ctx.currentTime);
      this.exhaustRaspFilter.Q.setValueAtTime(3.0, this.ctx.currentTime);

      this.exhaustGain = this.ctx.createGain();
      this.exhaustGain.gain.setValueAtTime(0.5, this.ctx.currentTime);

      this.v8Gain.connect(this.exhaustFilter);
      this.exhaustFilter.connect(this.exhaustRaspFilter);
      this.exhaustRaspFilter.connect(this.exhaustGain);
      this.exhaustGain.connect(this.masterGain);

      // --- 4. AERODYNAMIC AIR INDUCTION NOISE (Hood Scoop & Intake) ---
      this.noiseNode = this._createNoiseGenerator();
      this.inductionFilter = this.ctx.createBiquadFilter();
      this.inductionFilter.type = 'bandpass';
      this.inductionFilter.frequency.setValueAtTime(650, this.ctx.currentTime);
      this.inductionFilter.Q.setValueAtTime(1.8, this.ctx.currentTime);

      this.inductionGain = this.ctx.createGain();
      this.inductionGain.gain.setValueAtTime(0.02, this.ctx.currentTime);

      this.noiseNode.connect(this.inductionFilter);
      this.inductionFilter.connect(this.inductionGain);
      this.inductionGain.connect(this.masterGain);

      this.initialized = true;
    } catch (e) {
      console.warn('AudioContext initialization warning:', e);
    }
  }

  // Non-linear waveshaping transfer curve for combustion compression
  _makeDistortionCurve(amount = 20) {
    const k = amount;
    const n = 256;
    const curve = new Float32Array(n);
    const deg = Math.PI / 180;
    for (let i = 0; i < n; ++i) {
      const x = (i * 2) / n - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  // Procedural white/pink airflow buffer
  _createNoiseGenerator() {
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99 * b0 + white * 0.05;
      b1 = 0.95 * b1 + white * 0.15;
      b2 = 0.85 * b2 + white * 0.3;
      output[i] = (b0 + b1 + b2) * 0.4;
    }
    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    whiteNoise.start(0);
    return whiteNoise;
  }

  // Starter ignition sequence when toggling audio ON
  _playIgnitionSound() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // High mechanical relay solenoid click
    const clickOsc = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(1400, now);
    clickOsc.frequency.exponentialRampToValueAtTime(120, now + 0.08);

    clickGain.gain.setValueAtTime(0.4, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    clickOsc.connect(clickGain);
    clickGain.connect(this.masterGain);
    clickOsc.start(now);
    clickOsc.stop(now + 0.1);

    // Starter crank surge
    const starterOsc = this.ctx.createOscillator();
    const starterGain = this.ctx.createGain();
    starterOsc.type = 'sawtooth';
    starterOsc.frequency.setValueAtTime(65, now + 0.08);
    starterOsc.frequency.exponentialRampToValueAtTime(110, now + 0.35);

    starterGain.gain.setValueAtTime(0.0, now);
    starterGain.gain.setValueAtTime(0.3, now + 0.08);
    starterGain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    starterOsc.connect(starterGain);
    starterGain.connect(this.masterGain);
    starterOsc.start(now + 0.08);
    starterOsc.stop(now + 0.45);

    // V8 throat-clearing throttle surge settling into idle
    if (this.v8CylinderOsc) {
      this.v8CylinderOsc.frequency.setValueAtTime(120, now + 0.35);
      this.v8CylinderOsc.frequency.exponentialRampToValueAtTime(48, now + 1.2);
    }
  }

  toggle() {
    if (!this.initialized) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      if (!this.isMuted) {
        this.masterGain.gain.setTargetAtTime(0.24, this.ctx.currentTime, 0.1);
        this._playIgnitionSound();
      } else {
        this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.15);
      }
    }
    return !this.isMuted;
  }

  // Dynamic scrub modulation: Pitch, firing frequency, exhaust bark, and air intake rush
  updateScrollIntensity(velocity) {
    if (!this.initialized || this.isMuted || !this.ctx) return;

    const v = Math.min(Math.abs(velocity || 0), 2.0); // Normalized velocity
    const now = this.ctx.currentTime;

    // Calculate target simulated engine RPM (Idle 750 RPM -> Throttle surge up to 3,800 RPM)
    const targetRPM = 750 + v * 1550;
    this.currentRPM += (targetRPM - this.currentRPM) * 0.12;

    // Base cylinder firing frequency (48 Hz idle -> up to 135 Hz under heavy throttle)
    const baseFreq = 48 + v * 44;
    const harmonicFreq = baseFreq * 2;
    const lopeFreq = 12.5 + v * 14; // Combustion pulse rate accelerates

    this.v8CylinderOsc.frequency.setTargetAtTime(baseFreq, now, 0.04);
    this.v8HarmonicOsc.frequency.setTargetAtTime(harmonicFreq, now, 0.04);
    this.lopeLFO.frequency.setTargetAtTime(lopeFreq, now, 0.04);

    // Dual-mode exhaust bypass valves opening under throttle
    const targetExhaustFilter = 185 + v * 280;
    const targetExhaustRasp = 420 + v * 480;
    this.exhaustFilter.frequency.setTargetAtTime(targetExhaustFilter, now, 0.04);
    this.exhaustRaspFilter.frequency.setTargetAtTime(targetExhaustRasp, now, 0.04);

    // Aerodynamic induction air intake rush
    const targetInductionGain = 0.02 + v * 0.14;
    const targetInductionFilter = 650 + v * 950;
    this.inductionGain.gain.setTargetAtTime(targetInductionGain, now, 0.05);
    this.inductionFilter.frequency.setTargetAtTime(targetInductionFilter, now, 0.05);
  }

  /**
   * Subtle mechanical / pneumatic detent sound when snapping to a viewpoint
   */
  playMagneticDetent() {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(42, now + 0.09);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // AudioContext interrupted or not allowed
    }
  }
}

export const cinematicAudio = new CinematicAudioEngine();

