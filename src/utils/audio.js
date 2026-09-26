// Comprehensive Procedural Automotive Cinema Audio Engine
// Architecture:
// 1. AMBIENCE & ROOM TONE (32Hz sub-resonance + subtle atmospheric air drift)
// 2. 360° CIRCULAR ATELIER ACOUSTICS (stereo spatialization following camera orbit)
// 3. VEHICLE PRESENCE (physical chassis weight & low room resonance)
// 4. 6.2L LT1 V8 POWERTRAIN (crossplane lope & NPP exhaust — ONLY active during performance chapter 0.65-0.78)
// 5. CAMERA MOVEMENT & AIR FLOW (aerodynamic air rush modulated by scrub velocity)
// 6. LIGHTING & BI-XENON OPTICS (soft electrical relay strike at 0.53 + bloom tail + light sweep)
// 7. TYPOGRAPHY MASS & REVEAL (filtered air textures & low-mid mass displacement)
// 8. TRANSITIONS & OPTICAL STRESS (chromatic smear & microscopic particle grain)
// 9. RESTRAINT / SILENCE (Pause scene 0.88-0.94 drops to crystalline stillness)
// 10. UI ACOUSTICS (damped pneumatic detent & precision luxury clicks)

class CinematicAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.initialized = false;

    // Master Bus & Dynamic Limiter
    this.masterGain = null;
    this.limiter = null;

    // Independent Layer Buses (Section 33)
    this.ambienceBus = null;
    this.roomBus = null;
    this.vehicleBus = null;
    this.engineBus = null;
    this.cameraAirBus = null;
    this.lightingBus = null;
    this.typographyBus = null;
    this.transitionBus = null;
    this.uiBus = null;

    // Spatial Panner for 360° Circular Atelier
    this.roomPanner = null;

    // Layer 1: Ambience Nodes
    this.subBassOsc = null;
    this.roomToneFilter = null;
    this.roomToneNoise = null;
    this.roomToneLfo = null;
    this.roomToneLfoGain = null;

    // Layer 2: Atelier Acoustic Bed Nodes
    this.atelierNoise = null;
    this.atelierFilter = null;

    // Layer 3: Vehicle Presence Nodes
    this.chassisOsc = null;
    this.chassisFilter = null;

    // Layer 4: LT1 V8 Combustion Nodes (Active only in performance section)
    this.v8CylinderOsc = null;
    this.v8HarmonicOsc = null;
    this.lopeLFO = null;
    this.lopeGain = null;
    this.v8Shaper = null;
    this.exhaustFilter = null;
    this.exhaustRaspFilter = null;

    // Layer 5: Camera Air Noise
    this.airNoise = null;
    this.airFilter = null;

    // Scrub & State Tracking
    this.lastProgress = 0;
    this.lastEventTime = 0;
    this.triggeredEvents = new Set();
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      const now = this.ctx.currentTime;

      // Master output bus with smooth dynamics limiter
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, now);

      this.limiter = this.ctx.createDynamicsCompressor();
      this.limiter.threshold.setValueAtTime(-3, now);
      this.limiter.knee.setValueAtTime(6, now);
      this.limiter.ratio.setValueAtTime(12, now);
      this.limiter.attack.setValueAtTime(0.003, now);
      this.limiter.release.setValueAtTime(0.15, now);

      this.masterGain.connect(this.limiter);
      this.limiter.connect(this.ctx.destination);

      // --- CREATE 9 INDEPENDENT MIX BUSES ---
      this.ambienceBus = this.ctx.createGain();
      this.ambienceBus.gain.setValueAtTime(0.45, now);
      this.ambienceBus.connect(this.masterGain);

      this.roomBus = this.ctx.createGain();
      this.roomBus.gain.setValueAtTime(0.35, now);
      // Stereo Panner for 360° studio spatial orbit
      if (this.ctx.createStereoPanner) {
        this.roomPanner = this.ctx.createStereoPanner();
        this.roomPanner.pan.setValueAtTime(0, now);
        this.roomBus.connect(this.roomPanner);
        this.roomPanner.connect(this.masterGain);
      } else {
        this.roomBus.connect(this.masterGain);
      }

      this.vehicleBus = this.ctx.createGain();
      this.vehicleBus.gain.setValueAtTime(0.30, now);
      this.vehicleBus.connect(this.masterGain);

      this.engineBus = this.ctx.createGain();
      this.engineBus.gain.setValueAtTime(0.0, now); // Silent by default! Only wakes up in performance chapter
      this.engineBus.connect(this.masterGain);

      this.cameraAirBus = this.ctx.createGain();
      this.cameraAirBus.gain.setValueAtTime(0.0, now);
      this.cameraAirBus.connect(this.masterGain);

      this.lightingBus = this.ctx.createGain();
      this.lightingBus.gain.setValueAtTime(0.40, now);
      this.lightingBus.connect(this.masterGain);

      this.typographyBus = this.ctx.createGain();
      this.typographyBus.gain.setValueAtTime(0.35, now);
      this.typographyBus.connect(this.masterGain);

      this.transitionBus = this.ctx.createGain();
      this.transitionBus.gain.setValueAtTime(0.35, now);
      this.transitionBus.connect(this.masterGain);

      this.uiBus = this.ctx.createGain();
      this.uiBus.gain.setValueAtTime(0.35, now);
      this.uiBus.connect(this.masterGain);

      // --- LAYER 1: AMBIENCE & SUB-TONE ---
      this.subBassOsc = this.ctx.createOscillator();
      this.subBassOsc.type = 'sine';
      this.subBassOsc.frequency.setValueAtTime(32, now);
      this.subBassOsc.connect(this.ambienceBus);
      this.subBassOsc.start();

      // Atmospheric Breathing Room Tone
      this.roomToneNoise = this._createPinkNoiseGenerator();
      this.roomToneFilter = this.ctx.createBiquadFilter();
      this.roomToneFilter.type = 'lowpass';
      this.roomToneFilter.frequency.setValueAtTime(95, now);
      this.roomToneFilter.Q.setValueAtTime(1.5, now);

      this.roomToneLfo = this.ctx.createOscillator();
      this.roomToneLfo.type = 'sine';
      this.roomToneLfo.frequency.setValueAtTime(0.08, now); // Slow 12-second breath cycle

      this.roomToneLfoGain = this.ctx.createGain();
      this.roomToneLfoGain.gain.setValueAtTime(25, now);

      this.roomToneLfo.connect(this.roomToneLfoGain);
      this.roomToneLfoGain.connect(this.roomToneFilter.frequency);
      this.roomToneNoise.connect(this.roomToneFilter);
      this.roomToneFilter.connect(this.ambienceBus);

      this.roomToneLfo.start();

      // --- LAYER 2: CIRCULAR ATELIER ACOUSTICS ---
      this.atelierNoise = this._createPinkNoiseGenerator();
      this.atelierFilter = this.ctx.createBiquadFilter();
      this.atelierFilter.type = 'bandpass';
      this.atelierFilter.frequency.setValueAtTime(380, now);
      this.atelierFilter.Q.setValueAtTime(2.2, now);

      this.atelierNoise.connect(this.atelierFilter);
      this.atelierFilter.connect(this.roomBus);

      // --- LAYER 3: VEHICLE CHASSIS PRESENCE ---
      this.chassisOsc = this.ctx.createOscillator();
      this.chassisOsc.type = 'triangle';
      this.chassisOsc.frequency.setValueAtTime(54, now);

      this.chassisFilter = this.ctx.createBiquadFilter();
      this.chassisFilter.type = 'lowpass';
      this.chassisFilter.frequency.setValueAtTime(110, now);

      this.chassisOsc.connect(this.chassisFilter);
      this.chassisFilter.connect(this.vehicleBus);
      this.chassisOsc.start();

      // --- LAYER 4: 6.2L LT1 V8 POWERTRAIN (Crossplane Firing lope) ---
      this.v8CylinderOsc = this.ctx.createOscillator();
      this.v8CylinderOsc.type = 'sawtooth';
      this.v8CylinderOsc.frequency.setValueAtTime(48, now);

      this.v8HarmonicOsc = this.ctx.createOscillator();
      this.v8HarmonicOsc.type = 'triangle';
      this.v8HarmonicOsc.frequency.setValueAtTime(96, now);

      this.v8Shaper = this.ctx.createWaveShaper();
      this.v8Shaper.curve = this._makeDistortionCurve(16);

      this.lopeLFO = this.ctx.createOscillator();
      this.lopeLFO.type = 'sine';
      this.lopeLFO.frequency.setValueAtTime(12.5, now);

      this.lopeGain = this.ctx.createGain();
      this.lopeGain.gain.setValueAtTime(0.22, now);

      this.exhaustFilter = this.ctx.createBiquadFilter();
      this.exhaustFilter.type = 'bandpass';
      this.exhaustFilter.frequency.setValueAtTime(185, now);
      this.exhaustFilter.Q.setValueAtTime(3.8, now);

      this.exhaustRaspFilter = this.ctx.createBiquadFilter();
      this.exhaustRaspFilter.type = 'peaking';
      this.exhaustRaspFilter.frequency.setValueAtTime(420, now);
      this.exhaustRaspFilter.gain.setValueAtTime(5.5, now);
      this.exhaustRaspFilter.Q.setValueAtTime(2.8, now);

      this.v8CylinderOsc.connect(this.v8Shaper);
      this.v8HarmonicOsc.connect(this.v8Shaper);
      this.v8Shaper.connect(this.exhaustFilter);
      this.exhaustFilter.connect(this.exhaustRaspFilter);
      this.exhaustRaspFilter.connect(this.engineBus);

      this.lopeLFO.connect(this.lopeGain);
      this.lopeGain.connect(this.engineBus.gain);

      this.v8CylinderOsc.start();
      this.v8HarmonicOsc.start();
      this.lopeLFO.start();

      // --- LAYER 5: CAMERA MOVEMENT & AIR DISPLACEMENT ---
      this.airNoise = this._createPinkNoiseGenerator();
      this.airFilter = this.ctx.createBiquadFilter();
      this.airFilter.type = 'bandpass';
      this.airFilter.frequency.setValueAtTime(320, now);
      this.airFilter.Q.setValueAtTime(1.4, now);

      this.airNoise.connect(this.airFilter);
      this.airFilter.connect(this.cameraAirBus);

      this.initialized = true;
    } catch (e) {
      console.warn('Cinematic audio initialization notice:', e);
    }
  }

  // Pink noise generator for organic atmospheric sound design
  _createPinkNoiseGenerator() {
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99 * b0 + white * 0.05;
      b1 = 0.95 * b1 + white * 0.15;
      b2 = 0.85 * b2 + white * 0.3;
      output[i] = (b0 + b1 + b2) * 0.35;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    noise.start(0);
    return noise;
  }

  _makeDistortionCurve(amount = 16) {
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

  // Precision starter ignition sequence when toggling audio ON
  _playIgnitionSound() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Precision relay solenoid click
    const clickOsc = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(1100, now);
    clickOsc.frequency.exponentialRampToValueAtTime(140, now + 0.07);

    clickGain.gain.setValueAtTime(0.28, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    clickOsc.connect(clickGain);
    clickGain.connect(this.masterGain);
    clickOsc.start(now);
    clickOsc.stop(now + 0.09);

    // Deep sub acoustic swell
    const swellOsc = this.ctx.createOscillator();
    const swellGain = this.ctx.createGain();
    swellOsc.type = 'sine';
    swellOsc.frequency.setValueAtTime(45, now + 0.06);
    swellOsc.frequency.exponentialRampToValueAtTime(32, now + 0.4);

    swellGain.gain.setValueAtTime(0.0, now);
    swellGain.gain.setValueAtTime(0.22, now + 0.07);
    swellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    swellOsc.connect(swellGain);
    swellGain.connect(this.masterGain);
    swellOsc.start(now + 0.06);
    swellOsc.stop(now + 0.5);
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
      const now = this.ctx.currentTime;
      if (!this.isMuted) {
        this.masterGain.gain.setTargetAtTime(0.35, now, 0.12);
        this._playIgnitionSound();
      } else {
        this.masterGain.gain.setTargetAtTime(0, now, 0.15);
      }
    }
    return !this.isMuted;
  }

  /**
   * Sound Intensity Curve (Requested in prompt Section 49):
   * 00% - 08%: 0.14 (near silence, quiet room tone)
   * 10% - 18%: 0.24 (ambient emergence, vehicle presence)
   * 20% - 35%: 0.34 (CORVETTE entry, atelier acoustics open)
   * 40% - 45%: 0.50 (360° orbit, camera movement air)
   * 50% - 55%: 0.40 (macro intimacy, headlight ignition)
   * 60% - 65%: 0.60 (light sweep transition)
   * 70% - 78%: 0.52 (performance energy: 6.2L LT1 V8)
   * 80% - 86%: 0.35 (rear quad exhaust resonance)
   * 88% - 94%: 0.08 (PAUSE SCENE — near-total silence / crystalline negative space)
   * 95% - 100%: 0.30 (final hero establishing calm)
   */
  _getSoundIntensity(p) {
    if (p < 0.08) return 0.14 + (p / 0.08) * 0.10;
    if (p < 0.18) return 0.24;
    if (p < 0.35) return 0.34;
    if (p < 0.45) return 0.50;
    if (p < 0.55) return 0.40;
    if (p < 0.65) return 0.60;
    if (p < 0.78) return 0.52;
    if (p < 0.88) return 0.35;
    if (p <= 0.94) return 0.08; // Crystalline silence during PURE FORM
    return 0.30;
  }

  /**
   * Master Continuous Audio Timeline Loop
   * Synchronized directly with scroll progress and scrub velocity
   */
  update(progress, velocity) {
    if (!this.initialized || this.isMuted || !this.ctx) return;

    const p = Math.max(0, Math.min(1, progress || 0));
    const v = Math.min(Math.abs(velocity || 0), 2.5); // Normalized velocity
    const now = this.ctx.currentTime;

    const intensity = this._getSoundIntensity(p);

    // 1. Modulate Master Ambience Bus
    const targetAmbience = 0.28 * intensity + v * 0.06;
    this.ambienceBus.gain.setTargetAtTime(targetAmbience, now, 0.08);

    // 2. Modulate 360° Circular Atelier Room Bus & Spatial Panning
    let targetRoom = 0.18 * intensity;
    if (p >= 0.88 && p <= 0.94) {
      targetRoom = 0.02; // Silence in pause
    }
    this.roomBus.gain.setTargetAtTime(targetRoom, now, 0.1);

    // Spatial Panner: Maps camera orbit trajectory around the car
    // Camera passes right (+X) -> panner gently shifts left (-0.22), and vice versa
    if (this.roomPanner) {
      let targetPan = 0;
      if (p >= 0.00 && p <= 0.35) {
        targetPan = -0.15; // Front-right camera
      } else if (p > 0.35 && p <= 0.48) {
        targetPan = -0.24; // Side-right profile
      } else if (p > 0.48 && p <= 0.60) {
        targetPan = 0.18;  // Macro dive driver-side
      } else if (p > 0.60 && p <= 0.76) {
        targetPan = -0.14; // Powertrain 3/4
      } else if (p > 0.76 && p <= 0.90) {
        targetPan = 0.20;  // Rear exhaust left-low
      } else {
        targetPan = -0.10;
      }
      this.roomPanner.pan.setTargetAtTime(targetPan, now, 0.15);
    }

    // 3. Modulate Vehicle Chassis Presence Bus
    // Grows when camera approaches the bodywork (0.22 ground skimmer, 0.54 headlight, 0.84 exhaust)
    let vehiclePresence = 0.16;
    if ((p >= 0.20 && p <= 0.28) || (p >= 0.50 && p <= 0.58) || (p >= 0.80 && p <= 0.86)) {
      vehiclePresence = 0.32;
    } else if (p >= 0.88 && p <= 0.94) {
      vehiclePresence = 0.04;
    }
    this.vehicleBus.gain.setTargetAtTime(vehiclePresence * intensity, now, 0.08);

    // 4. Modulate 6.2L LT1 V8 Engine Bus — STRICTLY RESTRICTED TO PERFORMANCE MOMENTS (0.64-0.78)
    let targetEngineGain = 0.0;
    if (p >= 0.64 && p <= 0.78) {
      // Peaks during powertrain inspection
      const engineFactor = Math.sin(((p - 0.64) / 0.14) * Math.PI);
      targetEngineGain = (0.18 + v * 0.25) * engineFactor;

      const baseFreq = 48 + v * 38;
      const lopeRate = 12.5 + v * 10;
      this.v8CylinderOsc.frequency.setTargetAtTime(baseFreq, now, 0.05);
      this.v8HarmonicOsc.frequency.setTargetAtTime(baseFreq * 2, now, 0.05);
      this.lopeLFO.frequency.setTargetAtTime(lopeRate, now, 0.05);

      const targetExhaust = 185 + v * 220;
      this.exhaustFilter.frequency.setTargetAtTime(targetExhaust, now, 0.05);
    } else if (p >= 0.78 && p <= 0.86) {
      // Warm exhaust burble at rear quad pipes
      const exhaustFactor = Math.sin(((p - 0.78) / 0.08) * Math.PI);
      targetEngineGain = (0.12 + v * 0.14) * exhaustFactor;
      this.v8CylinderOsc.frequency.setTargetAtTime(44, now, 0.08);
      this.exhaustFilter.frequency.setTargetAtTime(140, now, 0.08);
    } else {
      targetEngineGain = 0.0; // Completely silent outside performance moments!
    }
    this.engineBus.gain.setTargetAtTime(targetEngineGain, now, 0.08);

    // 5. Modulate Camera Movement & Aerodynamic Air Flow Bus
    // Follows scrub velocity `v` with soft decay
    const targetAirGain = (v > 0.05) ? Math.min(0.24, v * 0.12) : 0.0;
    const targetAirFreq = 300 + v * 480;
    this.cameraAirBus.gain.setTargetAtTime(targetAirGain, now, 0.06);
    this.airFilter.frequency.setTargetAtTime(targetAirFreq, now, 0.06);

    // 6. Threshold-Synchronized Sound Events (Discrete moments)
    this._checkSynchronizedEvents(p, now);

    this.lastProgress = p;
  }

  // Backward-compatible alias
  updateScrollIntensity(velocity) {
    this.update(this.lastProgress, velocity);
  }

  // Discrete synchronized event triggers with debouncing
  _checkSynchronizedEvents(p, now) {
    // A. Headlight Ignition (0.52 - 0.56)
    if (p >= 0.52 && p <= 0.56 && !this.triggeredEvents.has('headlight')) {
      if (now - this.lastEventTime > 1.2) {
        this._playHeadlightIgnition();
        this.triggeredEvents.add('headlight');
        this.lastEventTime = now;
      }
    } else if (p < 0.48 || p > 0.60) {
      this.triggeredEvents.delete('headlight');
    }

    // B. Light Sweep Transition (0.56 - 0.62)
    if (p >= 0.56 && p <= 0.62 && !this.triggeredEvents.has('lightsweep')) {
      if (now - this.lastEventTime > 1.2) {
        this._playLightSweepSound();
        this.triggeredEvents.add('lightsweep');
        this.lastEventTime = now;
      }
    } else if (p < 0.52 || p > 0.66) {
      this.triggeredEvents.delete('lightsweep');
    }

    // C. CORVETTE Typographic Mass Arrival (0.16 - 0.22)
    if (p >= 0.16 && p <= 0.22 && !this.triggeredEvents.has('corvette-type')) {
      if (now - this.lastEventTime > 1.5) {
        this._playTypographyMass(75, 48, 0.18);
        this.triggeredEvents.add('corvette-type');
        this.lastEventTime = now;
      }
    } else if (p < 0.12 || p > 0.26) {
      this.triggeredEvents.delete('corvette-type');
    }

    // D. 360° Studio Reveal Acoustic Swell (0.38 - 0.44)
    if (p >= 0.38 && p <= 0.44 && !this.triggeredEvents.has('360-reveal')) {
      if (now - this.lastEventTime > 1.5) {
        this._play360RevealAcoustic();
        this.triggeredEvents.add('360-reveal');
        this.lastEventTime = now;
      }
    } else if (p < 0.34 || p > 0.48) {
      this.triggeredEvents.delete('360-reveal');
    }

    // E. Experimental Particle Dispersion (0.92 - 0.95)
    if (p >= 0.92 && p <= 0.95 && !this.triggeredEvents.has('particle-dispersion')) {
      if (now - this.lastEventTime > 1.5) {
        this._playParticleDisperseSound();
        this.triggeredEvents.add('particle-dispersion');
        this.lastEventTime = now;
      }
    } else if (p < 0.88 || p > 0.97) {
      this.triggeredEvents.delete('particle-dispersion');
    }
  }

  // Bi-Xenon Headlight Electrical Activation & Bloom Tail (Section 9 & 10)
  _playHeadlightIgnition() {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;

      // Soft high-voltage ballast discharge click
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      clickOsc.type = 'sine';
      clickOsc.frequency.setValueAtTime(1400, now);
      clickOsc.frequency.exponentialRampToValueAtTime(320, now + 0.05);

      clickGain.gain.setValueAtTime(0.18, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      clickOsc.connect(clickGain);
      clickGain.connect(this.lightingBus);
      clickOsc.start(now);
      clickOsc.stop(now + 0.07);

      // Warm electrical bloom tail (480 Hz resonant tone sustaining softly)
      const bloomOsc = this.ctx.createOscillator();
      const bloomGain = this.ctx.createGain();
      bloomOsc.type = 'sine';
      bloomOsc.frequency.setValueAtTime(380, now + 0.02);
      bloomOsc.frequency.linearRampToValueAtTime(440, now + 0.3);

      bloomGain.gain.setValueAtTime(0.0, now);
      bloomGain.gain.setValueAtTime(0.12, now + 0.04);
      bloomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

      bloomOsc.connect(bloomGain);
      bloomGain.connect(this.lightingBus);
      bloomOsc.start(now + 0.02);
      bloomOsc.stop(now + 0.45);
    } catch {
      // AudioContext interrupted
    }
  }

  // Delicate Spectral Light Sweep (Section 11)
  _playLightSweepSound() {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const noise = this._createPinkNoiseGenerator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      filter.type = 'bandpass';
      filter.Q.setValueAtTime(3.2, now);
      filter.frequency.setValueAtTime(350, now);
      filter.frequency.exponentialRampToValueAtTime(820, now + 0.25);
      filter.frequency.exponentialRampToValueAtTime(450, now + 0.55);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.14, now + 0.22);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.58);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.lightingBus);
    } catch {
      // AudioContext interrupted
    }
  }

  // Monumental Typography Mass Displacement (Section 17 & 19)
  _playTypographyMass(startFreq = 75, endFreq = 48, volume = 0.18) {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.35);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

      osc.connect(gain);
      gain.connect(this.typographyBus);
      osc.start(now);
      osc.stop(now + 0.45);
    } catch {
      // AudioContext interrupted
    }
  }

  // 360° Studio Reveal Acoustic Expansion (Section 13)
  _play360RevealAcoustic() {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(62, now);
      osc.frequency.linearRampToValueAtTime(84, now + 0.4);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc.connect(gain);
      gain.connect(this.roomBus);
      osc.start(now);
      osc.stop(now + 0.6);
    } catch {
      // AudioContext interrupted
    }
  }

  // Microscopic Particle Dispersion (Section 24)
  _playParticleDisperseSound() {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const noise = this._createPinkNoiseGenerator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1800, now);

      gain.gain.setValueAtTime(0.0, now);
      gain.gain.linearRampToValueAtTime(0.045, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.transitionBus);
    } catch {
      // AudioContext interrupted
    }
  }

  // Refined Damped Pneumatic Detent for Viewpoint Locks (Section 38)
  playMagneticDetent() {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(115, now);
      osc.frequency.exponentialRampToValueAtTime(36, now + 0.055);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.uiBus);

      osc.start(now);
      osc.stop(now + 0.065);
    } catch {
      // AudioContext interrupted
    }
  }

  // Tactile Precision Tick for Spec / Decal Selection (Section 37)
  playUiTick() {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(850, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.025);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.uiBus);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch {
      // AudioContext interrupted
    }
  }
}

export const cinematicAudio = new CinematicAudioEngine();
