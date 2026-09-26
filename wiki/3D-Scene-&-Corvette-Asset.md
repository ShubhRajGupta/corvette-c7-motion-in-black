# 3D Scene & Corvette Asset

## Vehicle Asset Profile

- **Model Designation**: Chevrolet Corvette C7 Stingray Coupe
- **Asset Path**: `/models/corvette_c7.glb`
- **File Size**: 21,213,808 bytes (21.2 MB)
- **Geometry Coordinates**: Centered at origin $(0, 0, 0)$ with vehicle ground contact resting on $Y = 0$.
- **Dimensions**:
  - Length: $\approx 4.49\text{ m}$ (spanning $Z \approx -2.2\text{ m}$ to $+2.2\text{ m}$)
  - Width: $\approx 1.87\text{ m}$ (spanning $X \approx -0.95\text{ m}$ to $+0.95\text{ m}$)
  - Height: $\approx 1.24\text{ m}$ (chassis roofline at $Y \approx 1.25\text{ m}$)

---

## PBR Material Architecture (`CarModel.jsx`)

When the GLB model loads, the mesh hierarchy is traversed and mapped to a custom PBR material stack:

### 1. High-Gloss Clearcoat Body Panels
```javascript
const bodyMat = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color(specColor),
  roughness: 0.04,
  metalness: 0.85,
  clearcoat: 1.0,
  clearcoatRoughness: 0.03,
  reflectivity: 0.95,
  envMapIntensity: 2.2,
});
```
- **Physics**: Emulates genuine automotive multi-stage paint with a metallic basecoat covered by a mirror-like polyurethane clearcoat.
- **Specular Response**: Specular highlights on sculpted haunches reflect overhead circular LED canopy rings.

### 2. Carbon Fiber Components (Splitter, Roof, Diffuser)
- Mapped with an anisotropic micro-pattern simulating a 2x2 twill weave with high structural stiffness.

### 3. Brembo Monobloc Brake Calipers
- High-temperature gloss enamel coating (`#d6111e` on Velocity Yellow, `#e0a800` on Watkins Glen Gray).
- Contrast against slotted high-carbon cast iron brake rotors.

### 4. Bi-Xenon Projector & LED Daytime Running Lamps
- Dual-layer optical glass shader with inner emissive element dynamically igniting at scroll milestone `0.54` (`emissiveIntensity` surging from 0.0 to 12.0).

---

## Factory Curated Editions (`src/constants/carSpecs.js`)

Users can dynamically toggle between 5 curated factory specifications:

| Edition ID | Name | Hex Code | Roughness | Caliper Accent | Default Livery |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `velocity-yellow` | Velocity Yellow Tintcoat | `#f4c300` | 0.04 | Brembo Red | `jake` |
| `arctic-white` | Arctic White Pure GT | `#edeef2` | 0.02 | Carbon Flash | `grandsport` |
| `torch-red` | Torch Red Competition | `#d6111e` | 0.03 | High-Gloss Black | `stinger` |
| `black-rose` | Black Rose Metallic | `#280816` | 0.05 | Machined Silver | `roundel` |
| `watkins-glen` | Watkins Glen Gray Metallic | `#3e4347` | 0.03 | Competition Yellow | `stealth-jake` |

---

## Dynamic Decal Projection System (`src/utils/stickerTextures.js`)

Unlike naive UV texture baking (which requires re-exporting the 21MB model for every decal), the application utilizes Three.js **`DecalGeometry`**:

```javascript
const decalGeometry = new DecalGeometry(
  targetMesh,
  projectionCenter,   // Vector3(0.0, 0.72, -0.65)
  projectionNormal,   // Vector3(0.0, 1.0, 0.0)
  projectionDimensions // Vector3(0.68, 0.68, 0.68)
);
```

### Available Liveries:
1. **Corvette Racing "Jake" Skull**: Iconic endurance racing mascot with crossflag eyes.
2. **Grand Sport Hash Marks**: Authentic dual fender hash stripes honoring the 1963 Grand Sport racers.
3. **Carbon Stinger Hood Spear**: Central carbon fiber accent following the hood heat extractor.
4. **Bespoke Competition Roundel**: High-contrast racing number roundel.
5. **Stealth Jake Shadow**: Ghosted tone-on-tone gloss black on matte hood.
