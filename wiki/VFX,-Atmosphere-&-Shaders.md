# VFX, Atmosphere & Post-Processing Shaders

The visual effects architecture in **Corvette C7 "Motion in Black"** is engineered around **optical realism** and cinematic film restraint. Rather than employing distracting arcade-style floating dust particles or generic screen-space glows, the rendering pipeline simulates real-world 35mm anamorphic camera physics.

---

## Visual Effects Pipeline

```
  [ Three.js WebGL Scene Rendering ]
                |
                v
  [ Atmospheric Density & Ground Mist Pass ]
  (Exponential Floor Fog + Height Attenuation)
                |
                v
  [ Post-Processing Compositor ]
  ├── 1. Selective Unreal Bloom Pass (Threshold: 0.85, Strength: 0.45)
  ├── 2. 35mm Cine Grain Shader (Kodak Vision3 500T procedural emulsion)
  ├── 3. Chromatic Aberration & Vignette Shader (Radial RGB Channel Split)
  └── 4. Anamorphic Lens Flare & Streak Pass (Horizontal High-Luminance Bleed)
                |
                v
  [ Output to HTML5 Canvas (sRGB Encoded) ]
```

---

## Atmospheric Fog & Ground Mist

### 1. Global Volumetric Fog
* **Type**: `THREE.FogExp2`
* **Color**: Deepest studio charcoal (`#040507`)
* **Density**: $0.018$
* **Function**: Softly dissolves distant cyclorama geometry without tinting or graying the deep black studio floor.

### 2. Stratified Ground-Level Mist
* **Implementation**: Low-altitude horizontal planar mesh placed at $Y = 0.08\text{m}$ beneath the vehicle chassis.
* **Shader Mechanics**:
  * Procedural simplex noise modulated over time to simulate slow thermal air currents.
  * Vertical exponential height attenuation strictly capping opacity above $Y = 0.45\text{m}$.
  * **Strict Design Rule**: Absolutely no floating airborne particles, motes, or sparkles—preserving pure photographic clarity around the car body.

---

## Custom Post-Processing Shaders

### 1. Selective High-Luminance Bloom
* **Pass**: Modified `UnrealBloomPass`
* **Parameters**:
  * `luminanceThreshold`: `0.85` (ensures car body panels and floor do not bleed).
  * `luminanceSmoothing`: `0.15`
  * `bloomStrength`: `0.45`
  * `bloomRadius`: `0.65`
* **Target Elements**: Only active LED daytime running lights, canopy softbox diffusers, and laser alignment markers trigger bloom.

### 2. 35mm Motion Picture Film Grain
To eliminate sterile digital cleanliness and prevent 8-bit color banding in low-light gradients:
* **Shader**: Procedural Perlin noise fragment shader operating in screen space.
* **Characteristics**:
  * Emulates Kodak Vision3 500T 35mm motion picture negative grain.
  * Grain scale tuned to display DPI ($1.2\text{px}$ micro-clusters).
  * Grain intensity attenuated dynamically: higher in midtones ($0.038$), subdued in true blacks ($0.012$) to preserve contrast.

### 3. Radial Chromatic Aberration & Vignette
* **Vignette**: Natural optical light falloff parameterized by cosine-fourth law ($I = I_0 \cdot \cos^4 \theta$). Darkens peripheral screen margins by $28\%$, naturally guiding the eye toward the vehicle center.
* **Chromatic Aberration**:
  * Simulates physical lens dispersion towards the glass perimeter.
  * Displaces red and blue channels radially:
    $$\vec{U}_{red} = \vec{U} + \vec{D} \cdot k_{chroma}$$
    $$\vec{U}_{blue} = \vec{U} - \vec{D} \cdot k_{chroma}$$
  * $k_{chroma} = 0.0028$ at screen corners; $0.0000$ at optical center.

---

## Anamorphic Glare & Optical Streaks

When the camera aligns with direct light lines of sight (such as viewing the front projector headlights or overhead softbox tube arrays):
* **Horizontal Streak Flare**: A custom horizontal 1D convolution blur shader generates a subtle cyan/tungsten horizontal anamorphic flare line.
* **Angle-of-Incidence Gating**: Headlight lens flares dynamically scale intensity based on the vector dot product:
  $$I_{flare} = \max(0, \vec{L}_{forward} \cdot \vec{C}_{direction})^3$$
  ensuring flares flare realistically when looking into the headlights and disappear when viewing from behind.
