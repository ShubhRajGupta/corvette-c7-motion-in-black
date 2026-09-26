# 360° Circular Studio Architecture

The **Corvette C7 "Motion in Black"** virtual studio is designed as an ultra-high-end automotive engineering and styling pavilion. Rather than placing the car in a generic void or an overexposed showroom, the studio implements a disciplined **controlled-luminance hierarchy** inspired by cinematic automotive launch films (Porsche Taycan reveal, Ferrari SF90 Stradale launch, and BMW M-Division nocturnal testing).

---

## Architectural Philosophy: "Motion in Black"

Automotive paint and carbon fiber only express their true surfacing when interacting with curated, high-contrast light sources and dark horizons. The studio environment adheres to three foundational rules:

1. **Never brighten the entire scene**: The ambient light baseline is kept strictly at `0.02–0.05` cd/m² to prevent shadow washouts.
2. **Surfaces provide contrast, not illumination**: Floor tiles, brushed aluminum expansion joints, and structural pylons exist solely to catch grazing highlights and soft car reflections.
3. **Directional motivation**: Every specular highlight on the car body originates from a visible, physically grounded light source—such as the overhead light canopy, perimeter ground strips, or laser alignment markers.

---

## Stage Structure & Floor Mechanics

```
                         [ OVERHEAD SOFTBOX CANOPY ]
                               \     |     /
                                \    |    /
                                 v   v   v
    +-----------------------------------------------------------------+
    |  BAY 04: Cockpit & Styling         |  BAY 01: Aero & Telemetry  |
    |  - Ergonomic display stands        |  - Wind tunnel pylons      |
    |  - Laser scan guides               |  - Carbon splitter mounts  |
    |                                    |                            |
    |                     [ CORVETTE C7 STINGRAY ]                    |
    |                                                                 |
    |  BAY 03: Chassis & Dynamic Rig     |  Bay 02: Powertrain & Dyno |
    |  - Brembo test calipers            |  - Exhaust extraction vent |
    |  - Michelin tire racks             |  - 6.2L V8 diagnostic rig  |
    +-----------------------------------------------------------------+
                         [ RADIAL POLISHED SLAB ]
```

### 1. Polished Concrete Turntable
* **Geometry**: Segmented circular disk, radius $R = 14.5\text{m}$, 128 radial segments.
* **Material**: Custom `MeshPhysicalMaterial` featuring dual-layer micro-roughness:
  * Base Roughness: `0.38` (anisotropic brushed concrete texture).
  * Clearcoat: `0.85`, Clearcoat Roughness: `0.15` (liquid sealant finish).
  * Reflectance (IOR): `1.48` (accurate industrial resin floor index).
* **Expansion Joints**: Radial brass inlays radiating outward every 30 degrees, reflecting low-angle rim lights.

### 2. Cylindrical Cyclorama Horizon
* **Geometry**: Inverted open cylinder ($R = 32\text{m}$, height $H = 12\text{m}$).
* **Material**: Matte acoustic felt absorbing 96% of stray bounce light (`roughness: 0.95`, `metalness: 0.05`), ensuring deep cinematic blacks behind the vehicle profile.

---

## The Overhead Light Canopy

The primary source of vehicle key light is an engineered octagonal softbox array suspended directly above the turntable at $Y = 5.2\text{m}$.

* **Canopy Geometry**:
  * Outer structural space-frame truss constructed from extruded hexagonal steel tubing.
  * Central continuous softbox panel ($7.2\text{m} \times 3.4\text{m}$) fitted with simulated double-diffused silk.
  * 8 flanking adjustable LED edge-bars emitting directional grazing light along the car's shoulder lines.
* **Dynamic Modulation**:
  * As the camera moves along the narrative scroll rail or idle showroom orbit, the canopy's localized emissive intensities modulate dynamically:
    * Frontal sweeps boost front bonnet highlights.
    * Profile cameras boost shoulder-line edge tubes to accentuate the Coke-bottle Corvette waist.

---

## The 4 Detailing Bays

Positioned symmetrically around the 360° perimeter of the stage, four thematic engineering bays provide contextual depth when viewed through the camera's telephoto and wide-angle lenses:

### Bay 01: Aerodynamics & Body Telemetry ($0^\circ - 90^\circ$)
* **Location**: Front-quarter passenger horizon.
* **Props**: Aerodynamic boundary-layer vertical guide vanes, carbon fiber rear-wing display jig, illuminated aerodynamic pressure telemetry screens.
* **Lighting**: Cool white ($6500\text{K}$) laser strip illumination.

### Bay 02: Powertrain & LT4 Dyno Suite ($90^\circ - 180^\circ$)
* **Location**: Rear-quarter passenger horizon.
* **Props**: Floor-recessed dyno rollers, high-temp flexible exhaust extraction trunking, fluid management pressure tanks.
* **Lighting**: Deep tungsten warning amber ($2400\text{K}$) low-level safety strips.

### Bay 03: Chassis, Suspension & Braking ($180^\circ - 270^\circ$)
* **Location**: Rear-quarter driver horizon.
* **Props**: Vertical Michelin Pilot Super Sport tire rack, Brembo carbon-ceramic rotor inspection stand, magnetic suspension calibration fixture.
* **Lighting**: Neutral daylight ($5000\text{K}$) vertical light battens.

### Bay 04: Cockpit & Carbon Craftsmanship ($270^\circ - 360^\circ$)
* **Location**: Front-quarter driver horizon.
* **Props**: Carbon-weave composite sample plates, Competition Sport seat display armature, driver helmet and telemetry headset console.
* **Lighting**: Warm architectural accent downlights ($3200\text{K}$).

---

## Lighting Rig Specifications

| Luminaire Role | Type | Color Temp | Intensity | Falloff / Attenuation | Target Zone |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Main Canopy Softbox** | Area/Rect Light | $5600\text{K}$ | $4.8\text{ cd}$ | Quadratic ($d^2$) | Hood, roof, rear deck |
| **Shoulder Rim Left** | Directional Light | $6500\text{K}$ | $2.4\text{ cd}$ | Infinite | Left muscular hip line |
| **Shoulder Rim Right** | Directional Light | $6500\text{K}$ | $2.4\text{ cd}$ | Infinite | Right muscular hip line |
| **Front Fascia Key** | Spot Light ($35^\circ$) | $5200\text{K}$ | $3.6\text{ cd}$ | Quadratic ($d^2$) | Front badge & intake grille |
| **Rear Diffuser Glow** | Spot Light ($45^\circ$) | $3000\text{K}$ | $1.8\text{ cd}$ | Linear | Quad titanium exhausts |
| **Floor Bounce Ambient** | Ambient Light | Neutral | $0.04\text{ cd}$ | Uniform | Undercarriage ambient fill |

---

## Ground-Plane Reflections & Shadow Baking

To achieve 60 FPS performance without noisy screen-space reflections (SSR) or expensive real-time ray-tracing passes:
* **Contact Shadow Map**: High-resolution soft shadow baked directly into a dedicated ground shadow plane using custom depth attenuation.
* **Planar Dynamic Reflection**: Configured with a lightweight render target capturing only the vehicle's lower silhouette, filtered through the floor's roughness map.
