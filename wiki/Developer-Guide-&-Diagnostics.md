# Developer Guide & Diagnostics Manual

This manual provides technical instructions for extending, profiling, debugging, and building the **Corvette C7 "Motion in Black"** application.

---

## Quickstart & Environment Setup

### Prerequisites
* **Node.js**: `v18.0.0` or higher (tested on Node 20/22 LTS)
* **npm**: `v9.0.0` or higher
* **Hardware**: Dedicated or modern integrated GPU supporting WebGL 2.0

### Commands

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server (default: http://localhost:5173)
npm run dev

# 3. Execute blazingly fast static code linting via Oxlint
npm run lint

# 4. Compile optimized production bundle to dist/
npm run build

# 5. Preview production build locally
npm run preview
```

---

## Runtime Diagnostic Hotkeys & Telemetry

The application includes built-in diagnostic and developer shortcuts:

| Shortcut | Function | Subsystem Affected |
| :--- | :--- | :--- |
| <kbd>Shift</kbd> + <kbd>V</kbd> | **Toggle Telemetry HUD** | Displays real-time FPS, draw calls, triangle count, active textures, and GPU memory |
| <kbd>Shift</kbd> + <kbd>L</kbd> | **Toggle Lighting Wireframes** | Renders spot/directional light frustums and softbox orientation helpers |
| <kbd>Shift</kbd> + <kbd>I</kbd> | **Force Idle Cinematic Mode** | Immediately triggers the 10-pose autonomous camera sequence without waiting 4.5s |
| <kbd>Shift</kbd> + <kbd>F</kbd> | **Toggle Font Family** | Cycles between Big Shoulders Display and Barlow Swiss Modernist |
| <kbd>M</kbd> | **Toggle Audio Mute** | Instantly silences or resumes the 10-stem Web Audio engine |

---

## Directory Architecture

```
3d car/
├── public/
│   ├── audio/                      # 10-stem audio assets (.mp3 / .wav)
│   ├── models/                     # Corvette C7 Stingray GLB model & textures
│   └── favicon.svg                 # Application brand icon
├── src/
│   ├── components/
│   │   ├── CanvasContainer.jsx     # Three.js Canvas mount & WebGL context handling
│   │   ├── CinematicCamera.jsx     # Dual-mode Catmull-Rom & idle camera controller
│   │   ├── CinematicPreloader.jsx  # 8-phase loading UI & reveal curtain
│   │   ├── CorvetteModel.jsx       # GLTF loader, materials, clearcoat & livery decals
│   │   ├── EnvironmentalPacks.jsx  # Floor plates, props, racks & 4 detailing bays
│   │   ├── MagneticUI.jsx          # Physically damped magnetic interaction wrapper
│   │   ├── NavigationHUD.jsx       # Floating contextual controls, dossier & swatches
│   │   ├── PostProcessing.jsx      # Bloom, 35mm grain, vignette & chromatic aberration
│   │   ├── ScenePrewarmer.jsx      # Offscreen GPU shader compilation pass
│   │   ├── StudioCanopy.jsx        # Overhead octagonal softbox array & edge bars
│   │   └── StudioEnvironment.jsx   # Cyclorama, turntable floor & lighting rig
│   ├── constants/
│   │   ├── audioManifest.js        # Audio stem definitions & loudness metadata
│   │   ├── cameraPath.js           # 3D Catmull-Rom spline waypoints & narrative steps
│   │   ├── carEditions.js          # PBR paint specifications (clearcoat, roughness, colors)
│   │   └── idlePoses.js            # 10 authored cinematic idle camera compositions
│   ├── hooks/
│   │   ├── useIdleCinematicCamera.js # Inactivity timer & cylindrical orbit interpolation
│   │   ├── useLoadingOrchestrator.js# Weighted readiness calculation & pacing state
│   │   └── useScrollProgress.js    # Smooth scroll listener & normalized progress (0–1)
│   ├── utils/
│   │   ├── audio.js                # Web Audio 10-stem engine & fallback synth
│   │   └── math.js                 # Smooth damping, slerp & cylindrical coordinates
│   ├── App.jsx                     # Root composition & state synchronization
│   ├── index.css                   # Master design system & CSS custom properties
│   └── main.jsx                    # React 19 entrypoint
├── wiki/                           # Complete GitHub Wiki documentation
├── docs/                           # Audio spotting sheet & architectural briefs
├── .oxlintrc.json                  # Oxlint configuration
├── package.json                    # Project dependencies & scripts
└── vite.config.js                  # Vite bundler configuration
```

---

## How-To Guides for Common Extensions

### 1. Adding a New Idle Camera Pose
Open [src/constants/idlePoses.js](file:///x:/Projects/web/3d%20car/src/constants/idlePoses.js) and append an entry to the `IDLE_POSES` array:

```javascript
{
  id: 'ROOF_SCOOP_MACRO',
  name: 'Roof Carbon Scoop Macro',
  position: [0.85, 1.45, 0.40],
  target: [0.00, 1.25, 0.00],
  fov: 26,
  holdDuration: 5.5,
  dutchTilt: 1.2
}
```

### 2. Registering a New Audio Stem
1. Place the sound asset inside `public/audio/`.
2. Open [src/constants/audioManifest.js](file:///x:/Projects/web/3d%20car/src/constants/audioManifest.js) and register the file name, frequency band, and nominal gain.
3. Open [src/utils/audio.js](file:///x:/Projects/web/3d%20car/src/utils/audio.js) to connect its gain node to the master dynamics bus or link it to a specific scroll trigger.

### 3. Adding a New Paint Edition
Open [src/constants/carEditions.js](file:///x:/Projects/web/3d%20car/src/constants/carEditions.js) and add a configuration:

```javascript
{
  id: 'SEBRING_ORANGE',
  name: 'Sebring Orange Tintcoat',
  color: '#D84B08',
  roughness: 0.12,
  metalness: 0.88,
  clearcoat: 1.0,
  clearcoatRoughness: 0.04
}
```

---

## Production Deployment Checklist

1. **Asset Compression**: Ensure all GLB files are Draco or Meshopt compressed for optimal delivery over CDN.
2. **Audio Formats**: Provide both `.mp3` and `.webm` audio formats for cross-browser fallback.
3. **CORS & Headers**: Set appropriate cache-control headers (`Cache-Control: public, max-age=31536000, immutable`) on all static 3D and audio assets.
4. **WebGL Context Loss**: The canvas includes automatic context loss detection (`webglcontextlost`) with automatic re-initialization upon context restore (`webglcontextrestored`).
