# Cinematic Preloader & Performance Engineering

High-end WebGL experiences often suffer from a dual loading dilemma:
1. **Technical loading latency**: High-poly GLB geometry, PBR 4K textures, HDR environment cubemaps, audio stems, and GPU shader compilation require significant initialization time.
2. **Perceived loading latency**: If users are left watching a generic percentage counter or a blank screen, drop-off rates surge.

The Corvette C7 platform resolves this through an **engineered asset orchestration and cinematic staging architecture** (`useLoadingOrchestrator.js`, `ScenePrewarmer.jsx`, and `CinematicPreloader.jsx`).

---

## Architecture of the Loading Pipeline

```
  HTML Request
      |
      v
  [ Pre-React Inline Shell (0ms FCP) ]   <-- Hardcoded in index.html (Pure CSS + SVG)
      |
      v
  [ React 19 Hydration & Mount ]
      |
      v
  [ Weighted Loading Orchestrator ]
  ├── Asset Tracking (GLB, HDR, Audio)  ──> Normalized Weighted Math (0–100%)
  ├── Offscreen Shader Prewarming       ──> gl.compile() on GPU
  └── Adaptive Pacing Director          ──> Smooth Monotonic Progress Smoothing
      |
      v
  [ 8-Phase Cinematic Staging Presentation ]
      |
      v
  [ Curtain Reveal Gate: 60 FPS Transition into 3D Stage ]
```

---

## Pre-React Inline Boot Shell (0ms FCP)

Before Vite's JavaScript bundle finishes downloading or React 19 hydrates, the user immediately sees a styled, branded boot shell rendered directly from `index.html`:
* Inline CSS embedded in `<style>` tags with no external dependencies.
* Lightweight SVG silhouette of the Corvette Stingray with an animated glowing pulse line.
* Monospace typography indicating `INITIALIZING CORVETTE C7 DYNAMICS LAB`.
* Ensures **First Contentful Paint (FCP) under 350ms** even on 3G connections.

---

## Weighted Readiness Model

Progress is never calculated from an arbitrary timer. It tracks four distinct subsystem readiness vectors with mathematical weighting:

$$\text{Progress}_{total} = (W_{geom} \cdot S_{geom}) + (W_{tex} \cdot S_{tex}) + (W_{audio} \cdot S_{audio}) + (W_{gpu} \cdot S_{gpu})$$

| Subsystem | Weight ($W$) | Tracking Metric | Fallback Behavior |
| :--- | :--- | :--- | :--- |
| **Corvette Geometry** | $35\%$ | `THREE.LoadingManager` GLB download and mesh tree parsing | Critical: Retries on network drop |
| **PBR Textures & HDR** | $25\%$ | CubeTextureLoader & RGBELoader memory upload | Defaults to neutral fallback cubemap |
| **Audio Stem Buffers** | $20\%$ | Web Audio `decodeAudioData` progress across 10 tracks | Degrades to procedural synth without delay |
| **Shader Compilation** | $20\%$ | `renderer.compile(scene, camera)` completion | Completes after initial offscreen draw |

---

## The 8-Phase Cinematic Staging Sequence

The preloader transforms asset loading into an evocative automotive calibration ceremony:

| Phase | Range | Status Subtitle Displayed | System Action |
| :--- | :--- | :--- | :--- |
| **1. SYSTEM_INITIALIZATION** | $0\% - 15\%$ | `INITIALIZING CORVETTE C7 TELEMETRY RIG` | WebGL context acquisition, memory check |
| **2. CORE_ASSETS_FETCH** | $15\% - 35\%$ | `STREAMING STINGRAY CHASSIS DEFINITION` | Fetching high-resolution geometry buffers |
| **3. GEOMETRY_STREAMING** | $35\% - 50\%$ | `RECONSTRUCTING CARBON-COMPOSITE SURFACES` | Building Three.js mesh buffer hierarchies |
| **4. PBR_SURFACE_SYNTHESIS** | $50\% - 65\%$ | `CALIBRATING CLEARCOAT REFLECTANCE & IOR` | Uploading roughness, metalness, and normal maps |
| **5. SHADER_PREWARMING** | $65\% - 80\%$ | `COMPILING HIGH-DYNAMIC GPU SHADER PIPELINE` | Running `ScenePrewarmer` offscreen compile |
| **6. ACOUSTIC_ALIGNMENT** | $80\% - 90\%$ | `SYNCHRONIZING 10-STEM ACOUSTIC TELEMETRY` | Decoding audio buffers & initializing master bus |
| **7. SYSTEM_CALIBRATION** | $90\% - 99\%$ | `FINAL DYNAMICS CHECK: ALL SYSTEMS NOMINAL` | Priming post-processing passes & camera splines |
| **8. SYSTEM_READY** | $100\%$ | `PRESS TO ENGAGE COCKPIT TELEMETRY` | Unlocks user reveal gate and transitions canvas |

---

## GPU Shader Prewarming (`ScenePrewarmer.jsx`)

A frequent cause of frame stutter in Three.js occurs when a material is first rendered into the camera frustum—triggering runtime GLSL compilation on the GPU.

To eliminate this:
* `ScenePrewarmer` runs before the preloader curtain opens.
* Executes `renderer.compile(scene, camera)` offscreen.
* Renders a single hidden 1x1 test pass to ensure all post-processing fragment shaders (Bloom, Grain, Vignette, Chromatic Aberration) are compiled and cached in the GPU pipeline.
* **Result**: Zero frame drops or stutter when the scene first opens to the user.

---

## Adaptive Pacing & Safety Mechanics

* **Minimum Pacing Window**: Enforces a minimum display time of **$1400\text{ms}$** to ensure the visual styling sequence feels deliberate and cinematic, even on ultra-fast cached fiber connections.
* **Maximum Failsafe Timeout**: Enforces a strict timeout ceiling of **$12000\text{ms}$**. If any network asset stalls, the preloader gracefully bypasses non-critical assets and presents the entry gate.
* **Monotonic Smoothing**: The displayed progress percentage uses an exponential ease-out filter to guarantee monotonic forward motion ($P_{t} \ge P_{t-1}$).
