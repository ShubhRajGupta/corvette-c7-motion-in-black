# CHEVROLET CORVETTE C7 — PROFESSIONAL AUDIO SPOTTING SHEET & SOUND DESIGN BRIEF

**Document Version**: 2.0.0  
**Project**: 3D Corvette Interactive Cinematic Web Experience  
**Target Delivery Formats**: 24-bit/48kHz Master WAV Stems + Web-Optimized OGG/AAC  
**Master Integrated Loudness Target**: -16 to -18 LUFS (Integrated), -1.0 dBFS True Peak  

---

## 1. PRODUCTION MODEL & WORKFLOW

The website operates as an interactive cinematic film. The web application is the playback, ducking, and synchronization engine; it does not replace professional audio engineering.

```
FINAL / NEAR-FINAL VISUAL
          ↓
  SCENE SPOTTING (This Document)
          ↓
   SOUND DESIGN & FOLEY
          ↓
    MUSIC / SCORE BEDS
          ↓
      STEM MIXING
          ↓
       MASTERING
          ↓
 WEB DELIVERY (public/audio/...)
          ↓
  ANTIGRAVITY ENGINE RUNTIME
          ↓
    MULTI-DEVICE QA
```

---

## 2. PRODUCTION ROLES & RESPONSIBILITIES

### A. Sound Designer
- Bespoke acoustic textures, ambient world-building, camera air dynamics, optical transitions, typographic mass displacement, and VFX sound language.
- Ensure all sound effects describe the *physical impression* of materials rather than sounding like video-game UI or generic sci-fi trailers.

### B. Foley / Automotive Detail Sound Artist
- Genuine physical recordings of automotive components:
  - High-voltage xenon ballast discharge & relay solenoid clicks
  - Mechanical switches, latch detents, brake pad bite
  - Cold chassis sub-resonance, carbon fiber and aluminum panel dampening
  - Polished concrete studio floor reflections
- **DO NOT** use generic stock explosions, sci-fi laser whooshes, or video game clicks.

### C. Composer / Music Designer
- Restrained, evolving cinematic score.
- **Form**: Modular stems and sustained harmonic beds rather than a fixed-chronology pop track.
- The music must survive scrubbing backwards, pausing, and rapid scrolling without becoming jarring or rhythmically disjointed.
- Leave acoustic headroom for the 6.2L V8 and mechanical detail.

### D. Mix & Master Engineer
- Deliver pre-balanced stems calibrated so that with all stem bus faders at 0 dB unity, the combined master output hits **-16 to -18 LUFS Integrated** with **-1.0 dBFS True Peak**.
- Preserve dynamic contrast between quiet negative space and the LT1 performance chapter.
- Ensure mix translates accurately across laptop speakers (MacBook/Dell), smartphone speakers (iPhone/Galaxy), and studio headphones.

### E. Web Audio Engineer (Antigravity)
- Seamless asset loading, caching, decode, multi-bus routing, dynamic ducking matrix, proximity acoustic filtering, idle camera synchronization, and user interaction.

---

## 3. MULTI-BUS STEM ARCHITECTURE

All audio is split into 10 decoupled stems. Never flatten everything into a single audio file.

| Stem / Bus | Category | Nominal Target | Description |
| :--- | :--- | :--- | :--- |
| `ambience` | Background Bed | -22 LUFS | 360° Circular studio acoustic tone, quiet HVAC, room resonance |
| `music` | Score / Harmonic | -20 LUFS | Evolving harmonic pad, restrained textural underscore |
| `vehicle` | Vehicle Resonance | -16 LUFS | Chassis weight, 6.2L LT1 V8 crossplane lope, NPP exhaust burble |
| `mechanical` | Foley / Physical Detail | -14 LUFS (Peak) | Bi-xenon relay clicks, Brembo brake contact, latch mechanisms |
| `camera` | Camera Aerodynamics | -24 LUFS | Aerodynamic air displacement modulated by scrub velocity |
| `typography` | Typographic Mass | -18 LUFS | Low-frequency mass displacement and air when monumental titles dock |
| `transitions` | Optical & VFX | -16 LUFS | Light sweeps, chromatic dispersion, particle textures |
| `sound_design` | Bespoke Textures | -16 LUFS | Optical bloom tails, studio acoustic expansions |
| `voice` | Narration (Optional) | -14 LUFS | Spoken dialogue / technical monographs (if commissioned) |
| `ui` | Micro-Interactions | -16 LUFS (Peak) | Precision detents, luxury toggle ticks |

---

## 4. DYNAMIC AUDIO DUCKING MATRIX

To maintain cinematic clarity without clipping, the Web Audio engine automatically applies calibrated ducking when high-priority cues trigger:

```
[ HEADLIGHT CLOSE-UP ] ──→ Ducks Ambience (-7 dB) & Music (-6 dB)
[ LT1 V8 POWERTRAIN ]  ──→ Ducks Ambience (-8 dB) & Music (-4 dB)
[ PURE FORM PAUSE ]    ──→ Ducks Ambience (-22 dB), Music (-20 dB), Vehicle (-24 dB) [Silence as Effect]
[ SPOKEN VOICE ]       ──→ Ducks Ambience (-10 dB) & Music (-8 dB)
```

---

## 5. SCENE-BY-SCENE AUDIO SPOTTING SHEET

```
TIMELINE PROGRESS: 0.00 -> 1.00
```

### SCENE 01: Cold Atelier Arrival & Establishing Stance
- **Timeline Range**: `0.00 - 0.08`
- **Visual Event**: High descending studio crane shot looking down at the Corvette C7 parked at the center of the circular modification studio.
- **Camera Movement**: Descending downward dolly glide with subtle banking roll.
- **Car Movement**: Stationary on polished reflective studio turntable floor.
- **Typography Event**: Initial view, quiet minimalism.
- **VFX Event**: Subtle optical glow from circular ceiling light rings.
- **Desired Sonic Behavior**:
  - Deep room tone with 32Hz sub-acoustic floor.
  - Distant, high-end studio ventilation / air presence.
  - Very sparse, cold tonal arrival bed.
- **Intensity**: Low (`-24 LUFS`).
- **Duration**: Continuous bed (~4–8s ambient loop).
- **Character**: Sterile, premium, tense anticipation, high-end automotive sanctuary.
- **DO NOT**: Play driving music, loud engine revs, or sci-fi ambient drones.

---

### SCENE 02: Monograph Arrival & Hood Scope Descent
- **Timeline Range**: `0.08 - 0.18`
- **Visual Event**: Camera drops lower, framing front quarter and sculpted carbon hood vents.
- **Camera Movement**: Smooth descent along passenger quarter.
- **Typography Event**: Monumental title **CORVETTE** arrives in top-left negative space (`0.14 - 0.20`).
- **Desired Sonic Behavior**:
  - Sub-bass mass displacement as the word "CORVETTE" settles into the negative space.
  - Subtle air displacement preceding the arrival by 60ms (anticipation lead).
  - Sonic tail lingering 140ms after text settles.
- **Intensity**: Medium-Low (`-20 LUFS`).
- **Character**: Authoritative, heavy, physical mass displacing air.
- **DO NOT**: Play typewriter sounds, video game UI chirps, or synthetic lasers.

---

### SCENE 03: Spaceframe Hydroformed Architecture Reveal
- **Timeline Range**: `0.18 - 0.32`
- **Visual Event**: Ground-skimming low-angle shot looking upward at front splitter, hood lines, and carbon roof.
- **Camera Movement**: Low ground skimmer climbing along passenger front shoulder.
- **Typography Event**: **SPACEFRAME** headline emerges in top-right blue negative space (`0.22 - 0.28`).
- **Desired Sonic Behavior**:
  - Low resonant metallic/aluminum harmonic pulse (representing 57% stiffer hydroformed aluminum chassis).
  - Clean typographic reveal texture.
- **Intensity**: Medium (`-18 LUFS`).
- **Character**: Structural rigidity, engineering precision, premium alloy acoustic tone.

---

### SCENE 04: Side Profile Stance & Brembo Brake Inspection
- **Timeline Range**: `0.32 - 0.46`
- **Visual Event**: Camera pulls out into ultra-low telephoto side profile framing red monobloc calipers, Michelin Pilot Super Sport tires, and roofline.
- **Camera Movement**: Telephoto side compression with level horizon.
- **Typography Event**: **BREMBO** typography anchors low in the ground plane negative space.
- **Desired Sonic Behavior**:
  - Proximity shift: broad room tone subtly recedes; wheel and brake foley details come into intimate focus.
  - Microscopic mechanical brake rotor texture (subtle friction contact whisper).
  - Deep, grounded tire contact resonance on polished floor.
- **Intensity**: Medium (`-18 LUFS`).
- **Character**: Mechanical grip, stopping power, functional racing pedigree.

---

### SCENE 05: 360° Studio Reveal & Macro Dive Approach
- **Timeline Range**: `0.46 - 0.54`
- **Visual Event**: Camera whips smoothly around passenger fender, banking into an extreme macro dive directly targeting the driver bi-xenon headlight projector lens.
- **Camera Movement**: Dynamic technocrane whip glide accelerating into intimate macro proximity.
- **VFX Event**: Optical diffusion and anamorphic streak begin warming up.
- **Desired Sonic Behavior**:
  - Aerodynamic air rush modulated by scrub speed.
  - Room acoustics pan from right to driver-side (+X to -X).
  - Acoustic space narrows as the lens enters macro intimacy.
- **Intensity**: Medium-High (`-16 LUFS`).
- **Character**: Speed, fluid technocrane momentum, focal convergence.

---

### SCENE 06: Bi-Xenon Projector Ignition & Optical Light Sweep
- **Timeline Range**: `0.54 - 0.64` (Peak at `0.56 - 0.60`)
- **Visual Event**: Camera locked on driver bi-xenon projector. Headlight strikes on with blinding intensity, throwing an anamorphic horizontal light sweep across the chassis.
- **Camera Movement**: Macro close-up gliding across front splitter.
- **Typography Event**: **BI-XENON** editorial callout.
- **VFX Event**: Maximum lens flare, optical bloom, exposure shift.
- **Desired Sonic Behavior**:
  - **Relay Activation**: Authentic high-voltage ballast spark + solid mechanical relay click (`0.54`, leads visual by 80ms).
  - **Bloom Tail**: Warm electrical resonant hum (440Hz) expanding outward and decaying over 420ms.
  - **Light Sweep**: Delicate spectral air sweep supporting the horizontal photon flare (`0.58 - 0.62`).
  - **Ducking**: Ambience and score duck by -7 dB during the discharge for maximum focus!
- **Intensity**: High transient peak (`-12 dBFS Peak`, `-16 LUFS RMS`).
- **Character**: High-voltage electrical strike, photographic precision, warm optical bloom.
- **DO NOT**: Use sci-fi raygun charges, cartoon electric zaps, or thunderous cinematic booms.

---

### SCENE 07: 6.2L LT1 V8 Powertrain Inspection & Mechanical Muscle
- **Timeline Range**: `0.64 - 0.78`
- **Visual Event**: Camera rises into muscular high 3/4 framing the sculpted hood scoop and 6.2L naturally aspirated V8 heart.
- **Camera Movement**: High-angle crane orbit looking down into the mechanical bay.
- **Typography Event**: **6.2L V8 / 460 HP / 465 LB-FT** monumental stats.
- **Desired Sonic Behavior**:
  - **V8 Combustion Presence**: Low-frequency crossplane firing lope (12.5 Hz idle pulse, 48 Hz cylinder fundamental).
  - Deep intake induction resonance.
  - Score bed enters its strongest musical development underneath the engine note.
  - Ambience stays ducked to let the mechanical powertrain speak.
- **Intensity**: High (`-14 LUFS`).
- **Character**: Naturally aspirated American V8 displacement, raw mechanical heartbeat, controlled power.
- **DO NOT**: Continuous 8000 RPM racecar screaming. Keep it as an idling, muscular, resonant presence.

---

### SCENE 08: Rear Quad NPP Exhaust Cannon & Red Abyss
- **Timeline Range**: `0.78 - 0.88`
- **Visual Event**: Camera dives ultra-low to ground level behind the car, framing the four 4-inch central polished stainless exhaust tips with red atmospheric backlight.
- **Camera Movement**: Low ground skimmer looking up at exhaust tips and rear diffuser.
- **Typography Event**: **AERODYNAMICS** editorial text.
- **Desired Sonic Behavior**:
  - Deep, bass-heavy exhaust burble with warm acoustic resonance.
  - Sub-harmonic floor presence (40-60 Hz).
  - Stereo panning shifts slightly left to match camera stance.
- **Intensity**: Medium-High (`-16 LUFS`).
- **Character**: Throaty, menacing, warm metal and exhaust resonance.

---

### SCENE 09: PURE FORM / Pause Scene (Silence as an Effect)
- **Timeline Range**: `0.88 - 0.94`
- **Visual Event**: Camera rises to high-quarter beauty portrait. Car stands in sublime stillness against minimal studio reflections.
- **Camera Movement**: Slow, graceful crane glide with zero Dutch roll (level photographic calm).
- **Typography Event**: Minimal **PURE FORM** typography.
- **Desired Sonic Behavior**:
  - **INTENTIONAL SILENCE**: Engine cuts out completely.
  - Ambience drops by -22 dB.
  - Music fades to near-imperceptible crystalline breath.
  - Crystalline negative space makes the visual sculpture feel transcendent.
- **Intensity**: Ultra-Low (`-32 LUFS`).
- **Character**: Reverence, breathless pause, photographic purity.
- **DO NOT**: Play loud stingers, riser swooshes, or intrusive effects. Silence is the effect!

---

### SCENE 10: Grand Finale Establishing Stance & 360° Studio
- **Timeline Range**: `0.94 - 1.00`
- **Visual Event**: Camera pulls out into final establishing three-quarter stance. Full circular modification studio stage is revealed.
- **Camera Movement**: Settles into grand architectural framing.
- **Typography Event**: Contextual controls appear (`[ EXPLORE 360° ]`, `[ SPECIFICATIONS ]`).
- **Desired Sonic Behavior**:
  - Score resolves harmonically into an open, warm ambient bed.
  - Studio room acoustics gently expand to full 360° width.
  - Deep vehicle presence anchors the car to the center turntable.
- **Intensity**: Medium (`-18 LUFS`).
- **Character**: Cinematic triumph, serene resolution, ready for user exploration.

---

## 6. IDLE CINEMATIC SHOWROOM CAMERA SYNCHRONIZATION

When the user leaves the site idle for 4.8 seconds, the camera initiates the 10-pose showroom film sequence. The audio engine smoothly synchronizes to the camera's spatial stance:

| Pose ID | Pose Name | Elevation / Distance | Audio Perspective & Modulation |
| :--- | :--- | :--- | :--- |
| `low-front-three-quarter` | Low Front 3/4 | Low (0.42m), Med Dist | Warm splitter presence, slight right panner bias |
| `wheel-macro` | Wheel-Level Macro | Ground (0.26m), Near | High mechanical intimacy, room tone dips by -3 dB |
| `side-profile` | Side Profile Stance | Low (0.58m), Distant | Level stereo spread, balanced chassis sub-bed |
| `high-three-quarter` | High 3/4 Crane | High (1.95m), Med Dist | Overhead acoustic reflections, hood scoop detail |
| `headlight-macro` | Headlight Optics Macro | Eye-level (0.74m), Close | Intimate projector hum, driver-side pan bias |
| `extreme-low-front` | Extreme Low Front | Ground (0.17m), Med Dist | Deep floor sub-resonance, upward spatial weight |
| `wide-hero` | Wide Environmental Hero | Mid (1.35m), Far (6.1m) | Maximum circular studio room tone, wide stereo width |
| `rear-three-quarter` | Rear Three-Quarter | Mid (0.82m), Med Dist | Taillight and haunch reflection tone, left-side pan bias |
| `rear-low-angle` | Rear Low Exhaust Cannon | Ground (0.22m), Close | Warm quad exhaust resonance (45 Hz), underbody presence |
| `elevated-top-view` | Elevated Top View | Overhead (2.72m), Overhead | Open studio ceiling acoustics, roof deck air tone |

*Note*: Idle camera transitions do **not** trigger repetitive one-shots. The soundscape evolves through gentle continuous filtering and panner modulation.

---

## 7. ASSET DROP-IN DIRECTORY SPECIFICATION

External sound designers and mix engineers can drop finished, web-optimized audio files directly into:

```
public/audio/
├── ambience/
│   └── c7_studio_ambience_loop.ogg       (Seamless stereo room tone loop)
├── music/
│   └── c7_score_harmonic_bed.ogg         (Seamless evolving score bed loop)
├── vehicle/
│   ├── c7_chassis_sub_loop.ogg           (Continuous chassis sub-resonance)
│   ├── c7_lt1_v8_performance.ogg         (6.2L LT1 V8 crossplane idle/lope loop)
│   └── c7_npp_exhaust_cannon.ogg         (Rear exhaust burble loop)
├── mechanical/
│   └── c7_headlight_activate.ogg         (High-voltage relay click one-shot)
├── camera/
│   └── c7_camera_air_rush.ogg            (Scrub-modulated air displacement loop)
├── typography/
│   ├── c7_typography_arrival_01.ogg      (Low-mid mass displacement one-shot)
│   └── c7_spaceframe_reveal.ogg          (Structural alloy reveal one-shot)
├── transitions/
│   ├── c7_360_reveal_acoustic.ogg        (Studio reveal acoustic swell one-shot)
│   └── c7_particle_disperse.ogg          (Granular dispersion texture one-shot)
├── sound_design/
│   └── c7_light_sweep.ogg                (Spectral photon smear one-shot)
├── voice/
│   └── c7_voice_intro.ogg                (Optional spoken monologue)
├── ui/
│   ├── c7_ui_tick.ogg                    (Tactile selection tick)
│   └── c7_ui_detent.ogg                  (Pneumatic magnetic detent)
└── masters/
    └── c7_cinematic_full_reference_mix.wav (Full 24/48 master reference mix)
```

---

## 8. QUALITY CONTROL & HARDWARE TRANSLATION CHECKLIST

Before approving final stem delivery, the mix engineer must verify playback across:

- [ ] **High-End Studio Headphones** (Sennheiser HD650 / Beyerdynamic DT 1990): Deep sub-bass (32Hz) is clean and non-distorting; stereo field is wide and immersive.
- [ ] **Consumer Earbuds** (AirPods Pro / Sony WF-1000XM5): Headlight relay click and mechanical details cut through clearly; music does not mask vehicle textures.
- [ ] **Laptop Speakers** (MacBook Pro / Dell XPS): No harsh high-mid frequencies (2kHz-4kHz); LT1 V8 harmonics at 96Hz and 185Hz remain audible without relying solely on sub-bass.
- [ ] **Smartphone Speakers** (iPhone / Samsung Galaxy): Transients remain clean without clipping the tiny internal amplifier; no digital overs.
- [ ] **Rapid Scrub Stress Test**: Fast scroll scrubbing forwards and backwards does not produce clicks, pops, or audio dropouts.
