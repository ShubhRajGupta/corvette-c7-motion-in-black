/**
 * PROFESSIONAL AUDIO PIPELINE MANIFEST
 *
 * Declarative configuration mapping visual timeline events to professional audio stems and cues.
 * External sound artists can drop new WAV / OGG / AAC files into /audio/[category]/ without touching
 * any React or Three.js code.
 *
 * Audio Graph Bus Routing:
 * AMBIENCE ───────┐
 * SOUND DESIGN ───┤
 * VEHICLE ────────┤
 * MECHANICAL ─────┤
 * CAMERA ─────────┤
 * TYPOGRAPHY ─────┤
 * TRANSITIONS ────┤
 * MUSIC ──────────┤
 * VOICE ──────────┤
 * UI ─────────────┤
 *                 ↓
 *         PRE-MASTER BUS (Dynamic Ducking Matrix)
 *                 ↓
 *           MASTER BUS (Master Gain, Soft Saturation & Peak Limiter)
 *                 ↓
 *           AUDIO DESTINATION
 */

export const AUDIO_BUSES = {
  ambience: {
    id: 'ambience',
    name: 'Ambience & Room Tone',
    nominalGain: 0.70, // Calibrated EBU R128 web level (-18 LUFS bed)
    duckingReduction: 0.45, // -7 dB duck when detail/voice/performance cues fire
    pan: 0.0,
  },
  sound_design: {
    id: 'sound_design',
    name: 'Sound Design & Textures',
    nominalGain: 0.85,
    duckingReduction: 0.80,
    pan: 0.0,
  },
  vehicle: {
    id: 'vehicle',
    name: 'Vehicle Presence & Resonance',
    nominalGain: 0.78,
    duckingReduction: 0.70,
    pan: 0.0,
  },
  mechanical: {
    id: 'mechanical',
    name: 'Mechanical & Foley Detail',
    nominalGain: 0.82,
    duckingReduction: 0.75,
    pan: 0.0,
  },
  camera: {
    id: 'camera',
    name: 'Camera Movement & Aerodynamics',
    nominalGain: 0.65,
    duckingReduction: 0.60,
    pan: 0.0,
  },
  typography: {
    id: 'typography',
    name: 'Typography Mass & Motion',
    nominalGain: 0.72,
    duckingReduction: 0.70,
    pan: 0.0,
  },
  transitions: {
    id: 'transitions',
    name: 'Scene & Optical Transitions',
    nominalGain: 0.75,
    duckingReduction: 0.75,
    pan: 0.0,
  },
  music: {
    id: 'music',
    name: 'Music & Cinematic Score',
    nominalGain: 0.65,
    duckingReduction: 0.50, // -6 dB duck during high-detail moments
    pan: 0.0,
  },
  voice: {
    id: 'voice',
    name: 'Voice & Spoken Dialogue',
    nominalGain: 0.88,
    duckingReduction: 0.90,
    pan: 0.0,
  },
  ui: {
    id: 'ui',
    name: 'UI & Tactile Detents',
    nominalGain: 0.75,
    duckingReduction: 0.75,
    pan: 0.0,
  },
};

/**
 * High-Level Acoustic States
 */
export const AUDIO_STATES = {
  INTRO: 'INTRO',
  IDLE: 'IDLE',
  ACTIVE_SCROLL: 'ACTIVE_SCROLL',
  CLOSE_UP: 'CLOSE_UP',
  PERFORMANCE: 'PERFORMANCE',
  PAUSE: 'PAUSE',
  EXPLORE: 'EXPLORE',
  FINALE: 'FINALE',
};

/**
 * Scene-by-Scene Declarative Audio Cue Registry
 */
export const AUDIO_CUES = [
  // -------------------------------------------------------------------------
  // 1. Continuous Atelier Ambience Bed (Loop)
  // -------------------------------------------------------------------------
  {
    id: 'c7_studio_ambience_loop',
    bus: 'ambience',
    file: '/audio/ambience/c7_studio_ambience_loop.ogg',
    altFile: '/audio/ambience/c7_studio_ambience_loop.wav',
    type: 'loop',
    nominalGain: 0.70,
    fadeInSec: 1.4,
    fadeOutSec: 1.0,
    proceduralFallback: {
      type: 'sub_room_tone',
      baseFreq: 34,
      filterFreq: 110,
      noiseLfoFreq: 0.08,
    },
  },

  // -------------------------------------------------------------------------
  // 2. Continuous Musical Bed (Loopable cinematic harmonic score)
  // -------------------------------------------------------------------------
  {
    id: 'c7_score_harmonic_bed',
    bus: 'music',
    file: '/audio/music/c7_score_harmonic_bed.ogg',
    altFile: '/audio/music/c7_score_harmonic_bed.wav',
    type: 'loop',
    nominalGain: 0.60,
    fadeInSec: 2.0,
    fadeOutSec: 1.5,
    proceduralFallback: {
      type: 'harmonic_pad',
      chord: [55, 82.4, 110, 164.8], // A1 - E2 - A2 - E3 warm cinematic fifth
      filterFreq: 320,
    },
  },

  // -------------------------------------------------------------------------
  // 3. Chassis Sub-Resonance Bed (Continuous Vehicle Presence)
  // -------------------------------------------------------------------------
  {
    id: 'c7_chassis_sub_loop',
    bus: 'vehicle',
    file: '/audio/vehicle/c7_chassis_sub_loop.ogg',
    altFile: '/audio/vehicle/c7_chassis_sub_loop.wav',
    type: 'loop',
    nominalGain: 0.65,
    proceduralFallback: {
      type: 'chassis_resonance',
      freq: 52,
      filterFreq: 120,
    },
  },

  // -------------------------------------------------------------------------
  // 4. Moment 01: CORVETTE Typographic Mass Arrival (0.16 -> 0.22)
  // -------------------------------------------------------------------------
  {
    id: 'c7_typography_arrival_01',
    bus: 'typography',
    file: '/audio/typography/c7_typography_arrival_01.ogg',
    altFile: '/audio/typography/c7_typography_arrival_01.wav',
    type: 'one_shot',
    nominalGain: 0.75,
    timeline: { start: 0.15, peak: 0.18, end: 0.22, hysteresis: 0.04 },
    leadMs: 60, // Leads visual arrival for anticipation
    lagMs: 140, // Low mass tail settles after letters dock
    ducking: {
      buses: ['ambience'],
      attenuation: 0.65,
      attackSec: 0.06,
      releaseSec: 0.35,
    },
    proceduralFallback: {
      type: 'mass_displacement',
      startFreq: 82,
      endFreq: 46,
      durationSec: 0.42,
    },
  },

  // -------------------------------------------------------------------------
  // 5. Moment 02: SPACEFRAME Hydroformed Architecture Reveal (0.22 -> 0.28)
  // -------------------------------------------------------------------------
  {
    id: 'c7_spaceframe_reveal',
    bus: 'typography',
    file: '/audio/typography/c7_spaceframe_reveal.ogg',
    altFile: '/audio/typography/c7_spaceframe_reveal.wav',
    type: 'one_shot',
    nominalGain: 0.70,
    timeline: { start: 0.22, peak: 0.25, end: 0.28, hysteresis: 0.04 },
    leadMs: 40,
    lagMs: 120,
    proceduralFallback: {
      type: 'mass_displacement',
      startFreq: 95,
      endFreq: 54,
      durationSec: 0.38,
    },
  },

  // -------------------------------------------------------------------------
  // 6. Moment 03: 360° Studio Reveal Acoustic Expansion (0.38 -> 0.44)
  // -------------------------------------------------------------------------
  {
    id: 'c7_360_reveal_acoustic',
    bus: 'transitions',
    file: '/audio/transitions/c7_360_reveal_acoustic.ogg',
    altFile: '/audio/transitions/c7_360_reveal_acoustic.wav',
    type: 'one_shot',
    nominalGain: 0.72,
    timeline: { start: 0.38, peak: 0.41, end: 0.44, hysteresis: 0.05 },
    proceduralFallback: {
      type: 'acoustic_swell',
      startFreq: 58,
      endFreq: 92,
      durationSec: 0.55,
    },
  },

  // -------------------------------------------------------------------------
  // 7. Moment 04: Bi-Xenon Projector Electrical Relay Activation (0.52 -> 0.56)
  // -------------------------------------------------------------------------
  {
    id: 'c7_headlight_activate',
    bus: 'mechanical',
    file: '/audio/mechanical/c7_headlight_activate.ogg',
    altFile: '/audio/mechanical/c7_headlight_activate.wav',
    type: 'one_shot',
    nominalGain: 0.85,
    timeline: { start: 0.52, peak: 0.54, end: 0.56, hysteresis: 0.035 },
    leadMs: 80, // Electrical relay click fires slightly ahead of photon emission
    ducking: {
      buses: ['ambience', 'music'],
      attenuation: 0.45, // -7 dB ducking for intimate focus
      attackSec: 0.05,
      releaseSec: 0.45,
    },
    proceduralFallback: {
      type: 'relay_click_and_bloom',
      clickFreq: 1450,
      bloomFreq: 420,
      durationSec: 0.42,
    },
  },

  // -------------------------------------------------------------------------
  // 8. Moment 05: Light Sweep & Optical Smear (0.57 -> 0.62)
  // -------------------------------------------------------------------------
  {
    id: 'c7_light_sweep',
    bus: 'sound_design',
    file: '/audio/sound_design/c7_light_sweep.ogg',
    altFile: '/audio/sound_design/c7_light_sweep.wav',
    type: 'one_shot',
    nominalGain: 0.78,
    timeline: { start: 0.57, peak: 0.60, end: 0.63, hysteresis: 0.04 },
    leadMs: 50,
    lagMs: 150,
    proceduralFallback: {
      type: 'spectral_sweep',
      startFreq: 320,
      peakFreq: 940,
      endFreq: 420,
      durationSec: 0.58,
    },
  },

  // -------------------------------------------------------------------------
  // 9. Moment 06: 6.2L LT1 V8 Powertrain Inspection (0.64 -> 0.78)
  // -------------------------------------------------------------------------
  {
    id: 'c7_lt1_v8_performance',
    bus: 'vehicle',
    file: '/audio/vehicle/c7_lt1_v8_performance.ogg',
    altFile: '/audio/vehicle/c7_lt1_v8_performance.wav',
    type: 'continuous_modulation',
    nominalGain: 0.82,
    timeline: { start: 0.64, peak: 0.72, end: 0.78, hysteresis: 0.03 },
    ducking: {
      buses: ['ambience', 'music'],
      attenuation: 0.50,
      attackSec: 0.08,
      releaseSec: 0.35,
    },
    proceduralFallback: {
      type: 'v8_combustion_model',
      baseFreq: 48,
      harmonicFreq: 96,
      lopeRate: 12.5,
    },
  },

  // -------------------------------------------------------------------------
  // 10. Moment 07: Rear Quad NPP Exhaust Cannon (0.78 -> 0.86)
  // -------------------------------------------------------------------------
  {
    id: 'c7_npp_exhaust_cannon',
    bus: 'vehicle',
    file: '/audio/vehicle/c7_npp_exhaust_cannon.ogg',
    altFile: '/audio/vehicle/c7_npp_exhaust_cannon.wav',
    type: 'continuous_modulation',
    nominalGain: 0.76,
    timeline: { start: 0.78, peak: 0.82, end: 0.86, hysteresis: 0.03 },
    proceduralFallback: {
      type: 'exhaust_burble',
      freq: 44,
      filterFreq: 145,
    },
  },

  // -------------------------------------------------------------------------
  // 11. Moment 08: Crystalline Silence / PURE FORM Pause Scene (0.88 -> 0.94)
  // Silence as an intentional effect: drops ambience and music down to crystalline negative space
  // -------------------------------------------------------------------------
  {
    id: 'c7_crystalline_silence',
    bus: 'sound_design',
    file: null, // Pure silence with subtle high-air floor
    type: 'state_modifier',
    timeline: { start: 0.88, peak: 0.91, end: 0.94, hysteresis: 0.02 },
    ducking: {
      buses: ['ambience', 'music', 'vehicle'],
      attenuation: 0.08, // -22 dB reduction! Drops into profound silence
      attackSec: 0.15,
      releaseSec: 0.20,
    },
  },

  // -------------------------------------------------------------------------
  // 12. Tactile UI Sounds (Precision luxury clicks & magnetic detents)
  // -------------------------------------------------------------------------
  {
    id: 'c7_ui_tick',
    bus: 'ui',
    file: '/audio/ui/c7_ui_tick.ogg',
    altFile: '/audio/ui/c7_ui_tick.wav',
    type: 'one_shot',
    nominalGain: 0.75,
    proceduralFallback: {
      type: 'precision_click',
      freq: 850,
      durationSec: 0.035,
    },
  },
  {
    id: 'c7_ui_detent',
    bus: 'ui',
    file: '/audio/ui/c7_ui_detent.ogg',
    altFile: '/audio/ui/c7_ui_detent.wav',
    type: 'one_shot',
    nominalGain: 0.78,
    proceduralFallback: {
      type: 'pneumatic_detent',
      startFreq: 115,
      endFreq: 36,
      durationSec: 0.065,
    },
  },
];
