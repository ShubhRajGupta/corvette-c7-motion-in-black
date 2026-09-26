# Architecture & Tech Stack

## System Overview

The **Corvette C7 "Motion in Black"** application uses a decoupled hybrid architecture that cleanly separates:
1. The **Fast HTML/CSS Shell** (Instantaneous visual feedback on frame 0)
2. The **React 19 Application State Layer** (User interaction, loading orchestration, font switching, modals)
3. The **WebGL 3D Rendering Core** (React Three Fiber, Three.js r186, postprocessing pipeline)
4. The **Decoupled Web Audio Bus Matrix** (10 independent audio stems, dynamic ducking, EBU R128 loudness target)

---

## Component Topology

```
src/main.jsx
  │
  ▼
src/App.jsx
  ├── hooks/useLoadingOrchestrator.js   [Weighted readiness & adaptive pacing]
  ├── components/CinematicPreloader.jsx [8-phase visual assembly prologue]
  ├── components/TextureOverlay.jsx     [Dynamic 35mm grain, vignette & exposure shift]
  ├── components/CustomCursor.jsx       [Minimal luxury pointer tracker]
  ├── components/SideSpecSelector.jsx   [Floating curated palette & decal livery dock]
  ├── components/CinematicNav.jsx       [Contextual audio toggle & font mode switch]
  ├── components/TechnicalDossier.jsx   [Comprehensive verified engineering modal]
  ├── components/CinematicOverlay.jsx   [Monumental scroll-synchronized editorial text]
  ├── components/vfx/VfxDebugPanel.jsx  [Diagnostic controls: Shift + V]
  │
  └── components/Experience.jsx         [Master Canvas container]
        ├── ScenePrewarmer.jsx          [GPU shader compilation & prewarm]
        ├── CinematicCamera.jsx         [Catmull-Rom splines + Idle state machine]
        ├── CarModel.jsx                [Corvette C7 PBR clearcoat + Decals]
        ├── StudioEnvironment.jsx       [HDR rim & studio light array]
        ├── studio/CircularStudio.jsx   [360° atelier stage + 4 detailing bays]
        ├── vfx/StudioAtmosphere.jsx    [Ground haze & ambient dust]
        ├── vfx/OpticalDiffusion.jsx    [Anamorphic streak & projector bloom]
        ├── SpatialTypography.jsx       [In-scene 3D occluded typography]
        └── PostProcessingEffects.jsx   [Selective bloom & chromatic aberration]
```

![React 19 & Three.js Component Hierarchy](images/architecture/arch-component-tree.svg)

---

## Rendering Pipeline Specifications

![Unified RequestAnimationFrame Render Loop](images/architecture/arch-render-loop.svg)

| Property | Value | Rationale |
| :--- | :--- | :--- |
| **Canvas Power Preference** | `high-performance` | Enforces discrete GPU utilization on dual-GPU laptops (NVIDIA/AMD over Intel iGPU). |
| **Device Pixel Ratio (DPR)** | `[1, 2]` | Clamped to 2.0 to prevent severe fill-rate degradation on 3x/4x mobile and Retina screens. |
| **Tone Mapping** | `ACESFilmicToneMapping` | Provides authentic cinematic contrast curves with soft shoulder roll-off on specular highlights. |
| **Exposure** | `1.15` | Tuned to preserve deep, rich shadows while retaining chrome and metallic clarity. |
| **Shadow Map Type** | `PCFShadowMap` | Smooth percentage-closer filtering for realistic soft chassis contact shadows. |
| **Antialiasing** | Subpixel MSAA + ACES | Smooth polygon edges on complex carbon fiber curves. |

---

## State Management Architecture

![Catmull-Rom Spline & Cylindrical Orbit Math](images/architecture/arch-kinematics-spline.svg)

The application adopts a unidirectional, zero-overhead state pattern using native React primitives (`useState`, `useRef`, `useCallback`) rather than heavy external state containers:

- **Scrub Scrubber Loop**: An internal `requestAnimationFrame` loop in `App.jsx` handles physics damping (`diff * 0.08`) of `timelineProgress`.
- **Ref Synchronization**: Synchronizes values into `useRef` containers to prevent unnecessary component re-renders during high-frequency 60 FPS / 120 FPS camera updates.
- **Audio Update Loop**: Calls `cinematicAudio.update(progress, velocity, options)` directly from the frame loop with instantaneous response.

---

## Offscreen Shader Prewarming Flow

![Offscreen Shader Cache & Compile Sequence](images/architecture/arch-prewarmer-flow.svg)

## Production Build & Bundle Breakdown

- **Total Gzipped Bundle Size**: ~447 kB
- **Vite 8.3 Compilation Speed**: ~850ms–980ms
- **Asset Code Splitting**:
  - `dist/index.html`: 1.72 kB
  - `dist/assets/index-*.css`: 28.68 kB (Gzip: 5.94 kB)
  - `dist/assets/index-*.js`: 1,588 kB (Gzip: 447 kB including complete Three.js r186, R3F, Drei, and PostProcessing engines)
