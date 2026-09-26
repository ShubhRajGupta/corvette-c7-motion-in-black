# Corvette C7 "Motion in Black" Wiki

Welcome to the official documentation and engineering wiki for **Chevrolet Corvette C7 — Motion in Black**, an interactive 3D automotive film and 360° circular modification atelier built with React 19, Three.js, and Vite.

---

## 📖 Wiki Navigation

### 1. [Architecture & Tech Stack](Architecture-&-Tech-Stack.md)
Detailed breakdown of the frontend stack, WebGL canvas configuration, component hierarchy, state management, render loop, and bundle breakdown.

### 2. [3D Scene & Corvette Asset](3D-Scene-&-Corvette-Asset.md)
Deep dive into the 21.2 MB Corvette C7 Stingray geometry, custom `MeshPhysicalMaterial` automotive clearcoat shaders, 5 curated factory editions, and dynamic `DecalGeometry` motorsport livery projections.

### 3. [360° Circular Modification Studio](360°-Circular-Studio.md)
Architectural breakdown of the concentric 360-degree modification atelier, PBR material packs, luminance ladder, dynamic 12-segment overhead LED canopy lighting, and 4 specialized detailing bays.

### 4. [Camera System & Idle Showroom Mode](Camera-System-&-Idle-Showroom.md)
Comprehensive analysis of the continuous C1 Catmull-Rom spline camera flight path, dynamic Dutch tilt banking, FOV lens changes, and the autonomous 10-pose Idle Cinematic Camera engine with orbital cylindrical interpolation.

### 5. [Professional Audio Pipeline & Spotting Sheet](Audio-Pipeline-&-Spotting-Sheet.md)
Overview of the 10-stem decoupled Web Audio mixing architecture, EBU R128 loudness calibration (-16 to -18 LUFS), master peak limiter (-1.5 dBFS), dynamic ducking matrix, asset drop-in conventions, and the complete scene-by-scene audio spotting sheet.

### 6. [Cinematic Preloader & Performance](Cinematic-Preloader-&-Performance.md)
Technical specifications for the 8-phase progressive assembly prologue, milestone-weighted readiness model, in-canvas GPU shader prewarming (`ScenePrewarmer`), zero-latency inline HTML/CSS shell, and adaptive time management.

### 7. [VFX, Atmosphere & Shaders](VFX,-Atmosphere-&-Shaders.md)
Inspection of real-time post-processing passes: anamorphic horizontal streak flares, optical diffusion, dynamic 35mm organic film grain, selective bloom, chromatic aberration, and exposure shift compensation.

### 8. [Editorial Typography & UI](Editorial-Typography-&-UI.md)
Documentation of the monumental typography system, font switching engine (Barlow Condensed vs Big Shoulders Display), spatial chassis occlusion, floating side spec dock, and technical engineering dossier.

### 9. [Developer Guide & Diagnostics](Developer-Guide-&-Diagnostics.md)
Local setup instructions, build pipelines, testing procedures, keyboard diagnostics (`Shift + V`, `Shift + L`), and performance telemetry.

---

## ⚡ Key Highlights
- **First Frame Readiness**: Zero-latency inline HTML/CSS shell renders on byte 0; no blank/white browser frames.
- **GPU Pipeline Prewarming**: `gl.compile(scene, camera)` pre-compiles all materials and framebuffers before user entry, eliminating first-scroll stutter.
- **True Automotive Sound**: Pre-balanced 10-stem Web Audio engine with dynamic ducking and external drop-in stem support.
- **Non-Invasive Idle Mode**: Autonomous cinematography awakens after 4.8s of inactivity, cycling through 10 composed photographic poses without repeating or cutting through the car body.
