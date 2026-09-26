import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const wikiImagesDir = path.join(projectRoot, 'wiki', 'images');
const docsImagesDir = path.join(projectRoot, 'docs', 'images');

// Ensure output directories exist
const categories = ['camera', 'editions', 'liveries', 'studio', 'chapters', 'vfx', 'audio', 'preloader', 'ui', 'architecture'];
for (const cat of categories) {
  fs.mkdirSync(path.join(wikiImagesDir, cat), { recursive: true });
  fs.mkdirSync(path.join(docsImagesDir, cat), { recursive: true });
}

function saveAsset(subPath, svgContent) {
  const wikiTarget = path.join(wikiImagesDir, subPath);
  const docsTarget = path.join(docsImagesDir, subPath);
  fs.writeFileSync(wikiTarget, svgContent.trim());
  fs.writeFileSync(docsTarget, svgContent.trim());
  console.log(`Generated: ${subPath}`);
}

function baseCard({ title, subtitle, tag = 'CORVETTE C7 // TELEMETRY RIG', width = 960, height = 540, content }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="background:#07080b; font-family:'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <defs>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#141722" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#0a0c12" stop-opacity="0.95"/>
    </linearGradient>
    <linearGradient id="redAccent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff1e27"/>
      <stop offset="100%" stop-color="#ff5e62"/>
    </linearGradient>
    <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- Background Grid -->
  <rect width="${width}" height="${height}" fill="#07080b"/>
  <rect width="${width}" height="${height}" fill="url(#gridPattern)"/>

  <!-- Outer Border Frame -->
  <rect x="20" y="20" width="${width - 40}" height="${height - 40}" rx="8" fill="url(#cardGrad)" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>

  <!-- Technical Corner Marks -->
  <path d="M 28 40 L 40 40 L 40 28" fill="none" stroke="#ff1e27" stroke-width="2"/>
  <path d="M ${width - 28} 40 L ${width - 40} 40 L ${width - 40} 28" fill="none" stroke="#ff1e27" stroke-width="2"/>
  <path d="M 28 ${height - 40} L 40 ${height - 40} L 40 ${height - 28}" fill="none" stroke="#ff1e27" stroke-width="2"/>
  <path d="M ${width - 28} ${height - 40} L ${width - 40} ${height - 40} L ${width - 40} ${height - 28}" fill="none" stroke="#ff1e27" stroke-width="2"/>

  <!-- Header Section -->
  <g transform="translate(50, 60)">
    <text x="0" y="0" fill="#ff1e27" font-size="11" font-weight="800" letter-spacing="0.25em" font-family="'Space Mono', monospace">${tag}</text>
    <text x="0" y="30" fill="#ffffff" font-size="24" font-weight="900" letter-spacing="0.08em">${title}</text>
    <text x="0" y="52" fill="#8892b0" font-size="13" font-weight="500" letter-spacing="0.05em">${subtitle}</text>
  </g>

  <!-- Visual Content Zone -->
  <g transform="translate(50, 140)">
    ${content}
  </g>

  <!-- Footer Telemetry -->
  <g transform="translate(50, ${height - 42})">
    <line x1="0" y1="0" x2="${width - 100}" y2="0" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    <text x="0" y="20" fill="#555d77" font-size="10" font-family="'Space Mono', monospace" letter-spacing="0.15em">CHEVROLET CORVETTE C7 // MOTION IN BLACK // SPEC 650 HP // STINGRAY Z06</text>
    <text x="${width - 100}" y="20" text-anchor="end" fill="#555d77" font-size="10" font-family="'Space Mono', monospace" letter-spacing="0.15em">THREE.JS r186 // REACT 19</text>
  </g>
</svg>`;
}

// ==========================================
// 1. CAMERA POSES (10 SVGs)
// ==========================================
const cameraPoses = [
  { id: 'pose-01-low-front-34', name: 'Pose 01: Low Front 3/4 Hero', sub: 'Coordinates: [ 0.00, 0.58, 4.40 ] | Target: [ 0.0, 0.65, 0.0 ] | FOV: 32°', angle: 'Front-Quarter Angle (-35°)', badge: 'HERO POSE 01' },
  { id: 'pose-02-extreme-low-front', name: 'Pose 02: Extreme Low-Angle Front', sub: 'Coordinates: [ 0.00, 0.22, 3.80 ] | Target: [ 0.0, 0.40, 0.0 ] | FOV: 28°', angle: 'Ground-Skimming Facade', badge: 'HERO POSE 02' },
  { id: 'pose-03-side-profile', name: 'Pose 03: Side Profile Sculpture', sub: 'Coordinates: [ 5.80, 0.95, 0.00 ] | Target: [ 0.0, 0.70, 0.0 ] | FOV: 24°', angle: 'Pure 90° Telephoto Profile', badge: 'HERO POSE 03' },
  { id: 'pose-04-rear-34-muscular', name: 'Pose 04: Rear 3/4 Muscular Stance', sub: 'Coordinates: [ 3.90, 0.85, -3.80 ] | Target: [ 0.0, 0.70, -0.4 ] | FOV: 34°', angle: 'Rear Shoulder Flare (145°)', badge: 'HERO POSE 04' },
  { id: 'pose-05-rear-low-exhausts', name: 'Pose 05: Rear Low Quad Exhausts', sub: 'Coordinates: [ 0.00, 0.42, -4.10 ] | Target: [ 0.0, 0.48, -0.2 ] | FOV: 30°', angle: 'Titanium Quad Tips & Diffuser', badge: 'HERO POSE 05' },
  { id: 'pose-06-high-34-dramatic', name: 'Pose 06: High 3/4 Dramatic Top', sub: 'Coordinates: [ -4.20, 3.20, 3.60 ] | Target: [ 0.0, 0.50, 0.0 ] | FOV: 40°', angle: 'High Crane Arm (-45°)', badge: 'HERO POSE 06' },
  { id: 'pose-07-birds-eye-top', name: 'Pose 07: Elevated Bird\'s-Eye Top View', sub: 'Coordinates: [ 0.00, 6.40, 0.00 ] | Target: [ 0.0, 0.00, 0.0 ] | FOV: 30°', angle: 'Zenith Teardrop Aero Canopy', badge: 'HERO POSE 07' },
  { id: 'pose-08-headlight-macro', name: 'Pose 08: Headlight & Carbon Louver Macro', sub: 'Coordinates: [ -1.40, 0.78, 2.20 ] | Target: [ -0.8, 0.72, 1.4 ] | FOV: 22°', angle: 'LED Projector & Carbon Extractor', badge: 'HERO POSE 08' },
  { id: 'pose-09-wheel-caliper-macro', name: 'Pose 09: Wheel & Brembo Caliper Macro', sub: 'Coordinates: [ 2.10, 0.38, 1.40 ] | Target: [ 1.4, 0.35, 1.2 ] | FOV: 24°', angle: 'Carbon-Ceramic 6-Piston Caliper', badge: 'HERO POSE 09' },
  { id: 'pose-10-wide-hangar-hero', name: 'Pose 10: Wide Environmental Hangar Hero', sub: 'Coordinates: [ -6.80, 2.40, 7.20 ] | Target: [ 0.0, 0.80, 0.0 ] | FOV: 46°', angle: 'Establishing 360° Studio Hangar', badge: 'HERO POSE 10' },
];

cameraPoses.forEach((pose, idx) => {
  const content = `
    <!-- 3D Car Vector Wireframe Silhouette -->
    <g transform="translate(60, 20)">
      <!-- Stage Turntable Grid -->
      <ellipse cx="360" cy="240" rx="340" ry="70" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1.5"/>
      <ellipse cx="360" cy="240" rx="200" ry="42" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
      <line x1="20" y1="240" x2="700" y2="240" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>

      <!-- Corvette Silhouette Styling -->
      <path d="M 160 215 C 200 205, 260 170, 340 168 C 420 166, 480 190, 560 205 C 575 210, 580 225, 570 230 C 530 238, 200 238, 150 230 C 145 222, 150 216, 160 215 Z" fill="rgba(255,30,39,0.12)" stroke="#ff1e27" stroke-width="2"/>
      <!-- Cabin Glass Bubble -->
      <path d="M 280 185 C 310 145, 390 145, 430 180 Z" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
      <!-- Wheels -->
      <ellipse cx="220" cy="230" rx="24" ry="18" fill="#141722" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
      <ellipse cx="500" cy="225" rx="26" ry="19" fill="#141722" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>

      <!-- Camera Eye Frustum Indicator -->
      <g transform="translate(${160 + (idx * 40) % 400}, ${60 + (idx * 18) % 120})">
        <circle cx="0" cy="0" r="14" fill="#ff1e27" fill-opacity="0.2" stroke="#ff1e27" stroke-width="2"/>
        <circle cx="0" cy="0" r="4" fill="#ffffff"/>
        <!-- Sightline Ray -->
        <line x1="0" y1="0" x2="${360 - (160 + (idx * 40) % 400)}" y2="${210 - (60 + (idx * 18) % 120)}" stroke="#ff1e27" stroke-width="1.5" stroke-dasharray="4,4"/>
        <text x="20" y="4" fill="#ff1e27" font-size="11" font-family="'Space Mono', monospace" font-weight="700">CAMERA // ${pose.badge}</text>
      </g>
    </g>

    <!-- Side Data Panel -->
    <g transform="translate(620, 20)">
      <rect x="0" y="0" width="220" height="280" rx="6" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      <text x="16" y="28" fill="#ffffff" font-size="13" font-weight="700">OPTICAL TELEMETRY</text>
      <text x="16" y="48" fill="#8892b0" font-size="10" font-family="'Space Mono', monospace">STATIONARY TRANSIT ARC</text>

      <line x1="16" y1="62" x2="204" y2="62" stroke="rgba(255,255,255,0.08)"/>

      <text x="16" y="85" fill="#555d77" font-size="9" font-family="'Space Mono', monospace">LENS ORIENTATION</text>
      <text x="16" y="102" fill="#ffffff" font-size="12" font-weight="600">${pose.angle}</text>

      <text x="16" y="130" fill="#555d77" font-size="9" font-family="'Space Mono', monospace">INTERPOLATION CURVE</text>
      <text x="16" y="147" fill="#ffffff" font-size="12" font-weight="600">Cylindrical (r, θ, y)</text>

      <text x="16" y="175" fill="#555d77" font-size="9" font-family="'Space Mono', monospace">DWELL DURATION</text>
      <text x="16" y="192" fill="#ffffff" font-size="12" font-weight="600">6.0s + Subtle Drift</text>

      <text x="16" y="220" fill="#555d77" font-size="9" font-family="'Space Mono', monospace">CLEARANCE RADIUS</text>
      <text x="16" y="237" fill="#00e5ff" font-size="12" font-weight="600">R_min = 3.20m (Safe)</text>
    </g>
  `;
  saveAsset(`camera/${pose.id}.svg`, baseCard({ title: pose.name, subtitle: pose.sub, tag: 'IDLE SHOWROOM ENGINE // 10 AUTHORED POSES', content }));
});

// ==========================================
// 2. FACTORY COLOR EDITIONS (5 SVGs)
// ==========================================
const editions = [
  { id: 'edition-carbon-flash', name: 'Edition 01: Carbon Flash Metallic', color: '#101114', accent: '#3b3d45', spec: 'Deep Obsidian with micro-metallic gold/violet pearl | Clearcoat: 1.0 | Roughness: 0.18' },
  { id: 'edition-torch-red', name: 'Edition 02: Torch Red Racing', color: '#c4121a', accent: '#ff2e38', spec: 'High-saturation Racing Scarlet | Dual-layer clearcoat | Clearcoat: 1.0 | Roughness: 0.12' },
  { id: 'edition-watkins-glen', name: 'Edition 03: Watkins Glen Gray', color: '#383a3f', accent: '#62656d', spec: 'Industrial Metallic Charcoal | Anisotropic micro-sheen | Clearcoat: 0.95 | Roughness: 0.22' },
  { id: 'edition-arctic-white', name: 'Edition 04: Arctic White Track', color: '#e5e7eb', accent: '#ffffff', spec: 'Crisp Glacial White with carbon aero contrast | Clearcoat: 1.0 | Roughness: 0.10' },
  { id: 'edition-laguna-blue', name: 'Edition 05: Laguna Blue Tintcoat', color: '#0055b3', accent: '#0080ff', spec: 'Deep Cerulean Metallic with cyan specular highlights | Clearcoat: 1.0 | Roughness: 0.14' },
];

editions.forEach((ed) => {
  const content = `
    <!-- Paint Sample Spherical Shader Swatch -->
    <g transform="translate(60, 20)">
      <circle cx="160" cy="140" r="110" fill="${ed.color}" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
      <!-- Radial Highlight Reflection -->
      <ellipse cx="120" cy="90" rx="60" ry="35" fill="${ed.accent}" fill-opacity="0.45" transform="rotate(-20 120 90)"/>
      <circle cx="105" cy="75" r="14" fill="#ffffff" fill-opacity="0.75"/>
      <!-- Ambient Floor Bounce Rim -->
      <path d="M 70 190 C 110 240, 210 240, 250 190" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="3"/>
    </g>

    <!-- Material Science Matrix -->
    <g transform="translate(420, 20)">
      <rect x="0" y="0" width="420" height="280" rx="6" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      <text x="24" y="32" fill="#ffffff" font-size="14" font-weight="700">PBR MATERIAL SPECIFICATION</text>
      <text x="24" y="52" fill="#8892b0" font-size="10" font-family="'Space Mono', monospace">THREE.MeshPhysicalMaterial PIPELINE</text>

      <line x1="24" y1="68" x2="396" y2="68" stroke="rgba(255,255,255,0.08)"/>

      <g transform="translate(24, 90)">
        <text x="0" y="0" fill="#555d77" font-size="10" font-family="'Space Mono', monospace">BASE ALBEDO COLOR</text>
        <rect x="0" y="8" width="18" height="18" rx="3" fill="${ed.color}" stroke="rgba(255,255,255,0.3)"/>
        <text x="26" y="22" fill="#ffffff" font-size="12" font-family="'Space Mono', monospace">${ed.color.toUpperCase()}</text>
      </g>

      <g transform="translate(24, 150)">
        <text x="0" y="0" fill="#555d77" font-size="10" font-family="'Space Mono', monospace">CLEARCOAT PROPERTIES</text>
        <text x="0" y="20" fill="#ffffff" font-size="12" font-weight="600">Clearcoat: 1.0 | Roughness: 0.04 | IOR: 1.52</text>
      </g>

      <g transform="translate(24, 210)">
        <text x="0" y="0" fill="#555d77" font-size="10" font-family="'Space Mono', monospace">FINISH CLASSIFICATION</text>
        <text x="0" y="20" fill="#ff1e27" font-size="12" font-weight="700">${ed.name.split(':')[1].trim()}</text>
      </g>
    </g>
  `;
  saveAsset(`editions/${ed.id}.svg`, baseCard({ title: ed.name, subtitle: ed.spec, tag: 'CURATED FACTORY EDITIONS // PBR CLEARCOAT', content }));
});

// ==========================================
// 3. MOTORSPORT LIVERIES (4 SVGs)
// ==========================================
const liveries = [
  { id: 'livery-clean-monolith', name: 'Livery 01: Clean Factory Monolith', sub: 'Pure automotive bodywork without exterior racing decals | Decal count: 0', type: 'OEM Factory Standard' },
  { id: 'livery-dual-racing-stripes', name: 'Livery 02: Dual Racing Stripes', sub: 'Continuous dual matte-black spine stripes from front nose to rear spoiler', type: 'High-Contrast DecalProjection' },
  { id: 'livery-c7r-endurance', name: 'Livery 03: Corvette Racing C7.R Le Mans', sub: 'Endurance racing package with Mobil 1, Michelin, and iconic Jake Skull mascot', type: 'Endurance Motorsport Livery' },
  { id: 'livery-track-apex', name: 'Livery 04: Track Edition Apex Accents', sub: 'Front aero canard accents, corner apex threshold decals, and door roundels', type: 'Track Day Aerodynamics' },
];

liveries.forEach((liv, i) => {
  const content = `
    <!-- Top-Down Livery Projection Schematic -->
    <g transform="translate(60, 20)">
      <!-- Car Body Outline Top View -->
      <path d="M 240 40 C 290 40, 310 90, 310 160 C 310 240, 290 280, 240 280 C 190 280, 170 240, 170 160 C 170 90, 190 40, 240 40 Z" fill="#141722" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
      <!-- Windshield -->
      <path d="M 200 110 L 280 110 L 270 150 L 210 150 Z" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)"/>
      
      ${i === 1 ? `
        <!-- Dual Stripes -->
        <rect x="232" y="42" width="6" height="236" fill="#ff1e27"/>
        <rect x="242" y="42" width="6" height="236" fill="#ff1e27"/>
      ` : ''}

      ${i === 2 ? `
        <!-- Jake Skull + Number 64 -->
        <circle cx="240" cy="180" r="18" fill="#ff1e27" fill-opacity="0.3" stroke="#ff1e27" stroke-width="1.5"/>
        <text x="240" y="185" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="900" font-family="'Space Mono', monospace">64</text>
        <rect x="220" y="80" width="40" height="8" fill="#ff1e27"/>
      ` : ''}

      ${i === 3 ? `
        <!-- Corner Apex Accents -->
        <path d="M 180 60 L 210 50" stroke="#ff1e27" stroke-width="4"/>
        <path d="M 300 60 L 270 50" stroke="#ff1e27" stroke-width="4"/>
        <rect x="175" y="160" width="8" height="30" fill="#ff1e27"/>
        <rect x="297" y="160" width="8" height="30" fill="#ff1e27"/>
      ` : ''}
    </g>

    <!-- Decal Geometry System Specifications -->
    <g transform="translate(460, 20)">
      <rect x="0" y="0" width="380" height="280" rx="6" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      <text x="24" y="32" fill="#ffffff" font-size="14" font-weight="700">DECAL GEOMETRY PROJECTION</text>
      <text x="24" y="52" fill="#8892b0" font-size="10" font-family="'Space Mono', monospace">THREE.DecalGeometry SURFACING</text>
      <line x1="24" y1="68" x2="356" y2="68" stroke="rgba(255,255,255,0.08)"/>

      <g transform="translate(24, 90)">
        <text x="0" y="0" fill="#555d77" font-size="10" font-family="'Space Mono', monospace">DECAL TYPE</text>
        <text x="0" y="20" fill="#ff1e27" font-size="13" font-weight="700">${liv.type}</text>
      </g>

      <g transform="translate(24, 150)">
        <text x="0" y="0" fill="#555d77" font-size="10" font-family="'Space Mono', monospace">Z-FIGHTING MITIGATION</text>
        <text x="0" y="20" fill="#ffffff" font-size="12" font-weight="600">PolygonOffsetFactor: -1.0 | Normal Projection</text>
      </g>

      <g transform="translate(24, 210)">
        <text x="0" y="0" fill="#555d77" font-size="10" font-family="'Space Mono', monospace">CLEARCOAT DEPTH LAYER</text>
        <text x="0" y="20" fill="#00e5ff" font-size="12" font-weight="600">Projected beneath vehicle clearcoat resin</text>
      </g>
    </g>
  `;
  saveAsset(`liveries/${liv.id}.svg`, baseCard({ title: liv.name, subtitle: liv.sub, tag: 'MOTORSPORT LIVERY // DECAL SYSTEM', content }));
});

// ==========================================
// 4. 360° CIRCULAR STUDIO & 4 BAYS (6 SVGs)
// ==========================================
const studioAssets = [
  { id: 'studio-stage-blueprint', name: 'Studio Blueprint: 360° Concentric Stage', sub: 'Turntable Radius: 14.5m | 128 Radial Segments | 30° Brass Expansion Joints', desc: 'Master architectural floorplan of the Corvette modification atelier' },
  { id: 'studio-overhead-canopy', name: 'Overhead Softbox Canopy & Lighting Rig', sub: 'Octagonal Space-Frame Truss | Height: 5.2m | 8 Perimeter High-CRI LED Edge Bars', desc: 'Dynamic luminance control avoiding scene washout while sculpting vehicle bodylines' },
  { id: 'studio-bay01-aero', name: 'Detailing Bay 01: Aerodynamics & Telemetry', sub: 'Azimuth: 0° - 90° | Boundary Layer Guide Vanes | Carbon Splitter Jig', desc: 'Aero development bay with wind tunnel telemetry displays' },
  { id: 'studio-bay02-dyno', name: 'Detailing Bay 02: Powertrain & LT4 Dyno Suite', sub: 'Azimuth: 90° - 180° | Recessed Dyno Rollers | High-Temp Flexible Exhaust Trunking', desc: '650 HP supercharged V8 engine diagnostics and exhaust extraction' },
  { id: 'studio-bay03-chassis', name: 'Detailing Bay 03: Chassis, Suspension & Brakes', sub: 'Azimuth: 180° - 270° | Michelin Pilot Super Sport Racks | Brembo Rotor Rig', desc: 'Suspension calibration and carbon-ceramic brake thermal analysis' },
  { id: 'studio-bay04-cockpit', name: 'Detailing Bay 04: Cockpit & Carbon Craftsmanship', sub: 'Azimuth: 270° - 360° | Competition Bucket Seat Mount | Composite Samples', desc: 'Driver cockpit ergonomics, heads-up telemetry, and carbon fiber swatches' },
];

studioAssets.forEach((stu, i) => {
  const content = `
    <!-- Concentric Stage Radial Blueprint -->
    <g transform="translate(60, 20)">
      <circle cx="160" cy="140" r="130" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
      <circle cx="160" cy="140" r="95" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      <circle cx="160" cy="140" r="55" fill="none" stroke="#ff1e27" stroke-width="1.5" stroke-dasharray="3,3"/>

      <!-- 4 Detailing Bay Quadrants -->
      <line x1="160" y1="10" x2="160" y2="270" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
      <line x1="30" y1="140" x2="290" y2="140" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>

      <!-- Bay 01 (Top-Right), Bay 02 (Bottom-Right), Bay 03 (Bottom-Left), Bay 04 (Top-Left) -->
      <text x="210" y="80" fill="${i === 2 ? '#ff1e27' : '#8892b0'}" font-size="10" font-family="'Space Mono', monospace" font-weight="700">BAY 01: AERO</text>
      <text x="210" y="210" fill="${i === 3 ? '#ff1e27' : '#8892b0'}" font-size="10" font-family="'Space Mono', monospace" font-weight="700">BAY 02: DYNO</text>
      <text x="50" y="210" fill="${i === 4 ? '#ff1e27' : '#8892b0'}" font-size="10" font-family="'Space Mono', monospace" font-weight="700">BAY 03: BRAKES</text>
      <text x="50" y="80" fill="${i === 5 ? '#ff1e27' : '#8892b0'}" font-size="10" font-family="'Space Mono', monospace" font-weight="700">BAY 04: COCKPIT</text>

      <!-- Center Turntable Core -->
      <circle cx="160" cy="140" r="16" fill="#141722" stroke="#ff1e27" stroke-width="2"/>
      <text x="160" y="144" text-anchor="middle" fill="#ffffff" font-size="8" font-family="'Space Mono', monospace">C7</text>
    </g>

    <!-- Studio Specs Data Card -->
    <g transform="translate(420, 20)">
      <rect x="0" y="0" width="420" height="280" rx="6" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      <text x="24" y="32" fill="#ffffff" font-size="14" font-weight="700">ARCHITECTURAL SPECIFICATION</text>
      <text x="24" y="52" fill="#8892b0" font-size="10" font-family="'Space Mono', monospace">CONTROLLED LUMINANCE HIERARCHY</text>
      <line x1="24" y1="68" x2="396" y2="68" stroke="rgba(255,255,255,0.08)"/>

      <g transform="translate(24, 90)">
        <text x="0" y="0" fill="#555d77" font-size="10" font-family="'Space Mono', monospace">ZONE DESCRIPTION</text>
        <text x="0" y="20" fill="#ffffff" font-size="12" font-weight="600">${stu.desc}</text>
      </g>

      <g transform="translate(24, 150)">
        <text x="0" y="0" fill="#555d77" font-size="10" font-family="'Space Mono', monospace">AMBIENT LIGHT BASELINE</text>
        <text x="0" y="20" fill="#00e5ff" font-size="12" font-weight="600">0.02 – 0.05 cd/m² (No Shadow Washout)</text>
      </g>

      <g transform="translate(24, 210)">
        <text x="0" y="0" fill="#555d77" font-size="10" font-family="'Space Mono', monospace">FLOOR MATERIAL FINISH</text>
        <text x="0" y="20" fill="#ff1e27" font-size="12" font-weight="700">Liquid Resin Clearcoat over Anisotropic Slab</text>
      </g>
    </g>
  `;
  saveAsset(`studio/${stu.id}.svg`, baseCard({ title: stu.name, subtitle: stu.sub, tag: '360° CIRCULAR MODIFICATION STUDIO', content }));
});

// ==========================================
// 5. NARRATIVE SCROLL CHAPTERS (6 SVGs)
// ==========================================
const chapters = [
  { id: 'chapter-01-cold-reveal', name: 'Chapter 01: Cold Studio Reveal', sub: 'Scroll Interval: 0.00 – 0.15 | Front Headlight LED Ignition', camera: 'Front Low Camera [ 0.0, 1.1, 5.8 ]' },
  { id: 'chapter-02-sculptural-sweep', name: 'Chapter 02: Sculptural Shoulder Sweep', sub: 'Scroll Interval: 0.15 – 0.35 | Coke-Bottle Waistline Dynamics', camera: 'Passenger Shoulder [ 3.85, 0.85, 3.2 ]' },
  { id: 'chapter-03-carbon-canopy', name: 'Chapter 03: Carbon Roof & Heat Extraction', sub: 'Scroll Interval: 0.35 – 0.55 | LT4 Supercharger Induction Louvers', camera: 'Roofline Orbit [ 4.2, 1.2, -1.8 ]' },
  { id: 'chapter-04-titanium-exhaust', name: 'Chapter 04: Rear Aggression & Quad Exhausts', sub: 'Scroll Interval: 0.55 – 0.75 | Titanium Tips & Diffuser Downforce', camera: 'Rear Low-Angle [ 0.0, 0.72, -4.6 ]' },
  { id: 'chapter-05-racing-pedigree', name: 'Chapter 05: Flank Telemetry & Z06 Brakes', sub: 'Scroll Interval: 0.75 – 0.90 | Brembo Calipers & Fender Badging', camera: 'Driver Flank [ -3.6, 0.95, -2.1 ]' },
  { id: 'chapter-06-grand-finale', name: 'Chapter 06: Grand Finale 360° Atelier Reveal', sub: 'Scroll Interval: 0.90 – 1.00 | Complete Hangar Illumination', camera: 'Full Hero Portrait [ -2.8, 1.45, 3.9 ]' },
];

chapters.forEach((chap, idx) => {
  const content = `
    <!-- Chapter Narrative Timeline Scrubber -->
    <g transform="translate(60, 40)">
      <!-- Master Timeline Rail -->
      <line x1="0" y1="60" x2="720" y2="60" stroke="rgba(255,255,255,0.12)" stroke-width="4" stroke-linecap="round"/>
      <line x1="0" y1="60" x2="${(idx + 1) * 120}" y2="60" stroke="#ff1e27" stroke-width="4" stroke-linecap="round"/>

      <!-- Chapter Node Markers -->
      ${[0, 1, 2, 3, 4, 5].map(n => `
        <circle cx="${(n + 1) * 120 - 40}" cy="60" r="${n === idx ? '12' : '7'}" fill="${n <= idx ? '#ff1e27' : '#141722'}" stroke="#ffffff" stroke-width="2"/>
        <text x="${(n + 1) * 120 - 40}" y="95" text-anchor="middle" fill="${n === idx ? '#ffffff' : '#555d77'}" font-size="10" font-family="'Space Mono', monospace" font-weight="${n === idx ? '700' : '400'}">CH.0${n + 1}</text>
      `).join('')}
    </g>

    <!-- Chapter Telemetry & Spline Data -->
    <g transform="translate(60, 160)">
      <rect x="0" y="0" width="720" height="120" rx="6" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      <g transform="translate(24, 28)">
        <text x="0" y="0" fill="#555d77" font-size="10" font-family="'Space Mono', monospace">CAMERA COORDINATE TARGET</text>
        <text x="0" y="24" fill="#ffffff" font-size="14" font-weight="700">${chap.camera}</text>
      </g>
      <g transform="translate(420, 28)">
        <text x="0" y="0" fill="#555d77" font-size="10" font-family="'Space Mono', monospace">PHYSICAL SCROLL INERTIA</text>
        <text x="0" y="24" fill="#00e5ff" font-size="14" font-weight="700">Damped Exponential Lerp (λ = 5.5)</text>
      </g>
    </g>
  `;
  saveAsset(`chapters/${chap.id}.svg`, baseCard({ title: chap.name, subtitle: chap.sub, tag: 'NARRATIVE SCROLL RAIL // 0.00 – 1.00', content }));
});

// ==========================================
// 6. VFX & POST-PROCESSING SHADERS (5 SVGs)
// ==========================================
const vfxAssets = [
  { id: 'vfx-optical-stack', name: 'Post-Processing Compositor Stack', sub: 'Layered pass pipeline: Bloom -> Kodak 500T Grain -> Vignette -> Chromatic Dispersion', desc: 'Unified WebGL fragment shader execution pipeline' },
  { id: 'vfx-bloom-threshold', name: 'Selective High-Luminance Bloom Pass', sub: 'Luminance Threshold: 0.85 | Strength: 0.45 | Radius: 0.65', desc: 'Restricted strictly to active LEDs, softboxes, and laser markers' },
  { id: 'vfx-film-grain-emulsion', name: '35mm Film Grain Emulsion Shader', sub: 'Kodak Vision3 500T Procedural Noise | Density: 0.038 | Dynamic Seed Modulation', desc: 'Eliminates 8-bit banding in low-light studio gradients' },
  { id: 'vfx-chromatic-dispersion', name: 'Chromatic Aberration & Vignette Lens Pass', sub: 'Radial RGB Channel Separation: 0.0028 | Cosine-Fourth Law Optical Falloff', desc: 'Simulates physical 35mm anamorphic prime lens dispersion' },
  { id: 'vfx-stratified-ground-mist', name: 'Stratified Low-Altitude Ground Fog', sub: 'Exponential Height Falloff: Cap at Y = 0.45m | Simplex Thermal Drift', desc: 'Photographic floor mist with zero arcade-style floating particles' },
];

vfxAssets.forEach((vfx) => {
  const content = `
    <!-- Shader Flowchart Node Graph -->
    <g transform="translate(60, 30)">
      <rect x="0" y="30" width="180" height="90" rx="6" fill="#141722" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
      <text x="20" y="60" fill="#555d77" font-size="10" font-family="'Space Mono', monospace">STAGE 01</text>
      <text x="20" y="82" fill="#ffffff" font-size="13" font-weight="700">Scene Render</text>
      <text x="20" y="102" fill="#8892b0" font-size="10">WebGL 2.0 Canvas</text>

      <path d="M 180 75 L 230 75" stroke="#ff1e27" stroke-width="2" marker-end="url(#arrow)"/>

      <rect x="230" y="30" width="220" height="90" rx="6" fill="#141722" stroke="#ff1e27" stroke-width="2"/>
      <text x="250" y="60" fill="#ff1e27" font-size="10" font-family="'Space Mono', monospace">ACTIVE SHADER PASS</text>
      <text x="250" y="82" fill="#ffffff" font-size="13" font-weight="700">${vfx.name.split(':')[0]}</text>
      <text x="250" y="102" fill="#00e5ff" font-size="10" font-family="'Space Mono', monospace">GLSL Fragment Pipe</text>

      <path d="M 450 75 L 500 75" stroke="#ff1e27" stroke-width="2"/>

      <rect x="500" y="30" width="180" height="90" rx="6" fill="#141722" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
      <text x="520" y="60" fill="#555d77" font-size="10" font-family="'Space Mono', monospace">STAGE 03</text>
      <text x="520" y="82" fill="#ffffff" font-size="13" font-weight="700">sRGB Output</text>
      <text x="520" y="102" fill="#8892b0" font-size="10">60 FPS Hardware Display</text>
    </g>

    <!-- Technical Parameters Card -->
    <g transform="translate(60, 160)">
      <rect x="0" y="0" width="720" height="110" rx="6" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      <g transform="translate(24, 28)">
        <text x="0" y="0" fill="#555d77" font-size="10" font-family="'Space Mono', monospace">OPTICAL BEHAVIOR</text>
        <text x="0" y="24" fill="#ffffff" font-size="13" font-weight="600">${vfx.desc}</text>
      </g>
      <g transform="translate(420, 28)">
        <text x="0" y="0" fill="#555d77" font-size="10" font-family="'Space Mono', monospace">GPU COMPILATION</text>
        <text x="0" y="24" fill="#00e5ff" font-size="13" font-weight="600">ScenePrewarmer Cached</text>
      </g>
    </g>
  `;
  saveAsset(`vfx/${vfx.id}.svg`, baseCard({ title: vfx.name, subtitle: vfx.sub, tag: 'VFX & POST-PROCESSING SHADERS', content }));
});

// ==========================================
// 7. AUDIO PIPELINE & SPOTTING (5 SVGs)
// ==========================================
const audioAssets = [
  { id: 'audio-signal-graph', name: '10-Stem Web Audio Signal Architecture', sub: 'Decoupled stem mixing with dynamic sidechain ducking and master dynamics bus', spec: 'AudioContext -> 10 GainNodes -> DynamicsCompressorNode -> Destination' },
  { id: 'audio-frequency-bands', name: 'Acoustic Frequency Spectrum Allocation', sub: 'Sub-bass (35-85Hz), V8 Rumble (80-450Hz), Whine (1.2-4.5kHz), Chimes (2-8kHz)', spec: 'Discrete frequency isolation preventing acoustic mud' },
  { id: 'audio-ducking-curve', name: 'Dynamic Sidechain Ducking Envelope', sub: 'Transient priority: -4.5 dB ducking on low-end drones during tactile UI clicks', spec: '12ms Attack | 180ms Hold | 350ms Exponential Release' },
  { id: 'audio-ebur128-compliance', name: 'Broadcast Loudness Normalization', sub: 'Target Integrated Loudness: -18.0 LUFS (±1 LU) | True-Peak Ceiling: -1.0 dBTP', spec: 'Conforms to ITU-R BS.1770-4 & EBU R128 international web standards' },
  { id: 'audio-timeline-cue-sheet', name: 'Interactive Cue Spotting Timeline', sub: 'Dynamic audio stem blend weights synchronized with scroll progress 0.00 – 1.00', spec: 'Discrete procedural fallback synthesizer for zero-latency instant unlock' },
];

audioAssets.forEach((aud) => {
  const content = `
    <!-- Graphic Equalizer & Frequency Plot -->
    <g transform="translate(60, 20)">
      <rect x="0" y="0" width="720" height="140" rx="6" fill="#141722" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      <!-- Frequency Bars -->
      ${[45, 75, 90, 65, 40, 55, 80, 100, 70, 50, 65, 85, 95, 40, 30].map((h, idx) => `
        <rect x="${40 + idx * 44}" y="${120 - h}" width="24" height="${h}" rx="3" fill="${idx % 3 === 0 ? '#ff1e27' : idx % 2 === 0 ? '#00e5ff' : 'rgba(255,255,255,0.4)'}"/>
      `).join('')}
      <!-- 0 dB True Peak Line -->
      <line x1="20" y1="25" x2="700" y2="25" stroke="#ff1e27" stroke-width="1" stroke-dasharray="4,4"/>
      <text x="690" y="20" text-anchor="end" fill="#ff1e27" font-size="9" font-family="'Space Mono', monospace">-1.0 dBTP CEILING</text>
    </g>

    <!-- Audio Metrics Details -->
    <g transform="translate(60, 180)">
      <rect x="0" y="0" width="720" height="90" rx="6" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      <g transform="translate(24, 24)">
        <text x="0" y="0" fill="#555d77" font-size="10" font-family="'Space Mono', monospace">SIGNAL PIPELINE TOPOLOGY</text>
        <text x="0" y="22" fill="#ffffff" font-size="13" font-weight="600">${aud.spec}</text>
      </g>
    </g>
  `;
  saveAsset(`audio/${aud.id}.svg`, baseCard({ title: aud.name, subtitle: aud.sub, tag: 'MASTER AUDIO PIPELINE // EBU R128', content }));
});

// ==========================================
// 8. CINEMATIC PRELOADER & PERFORMANCE (4 SVGs)
// ==========================================
const preloaderAssets = [
  { id: 'preloader-8-phases', name: '8-Phase Progressive Assembly Sequence', sub: 'System Init -> Asset Fetch -> Geometry -> PBR Surfaces -> Shader Prewarm -> Audio -> Ready', spec: 'Evocative automotive factory staging replacing generic progress bars' },
  { id: 'preloader-weighted-model', name: 'Milestone-Weighted Readiness Math', sub: 'Geometry: 35% | PBR Textures: 25% | Audio Stems: 20% | GPU Compile: 20%', spec: 'P_total = W_geom*S_geom + W_tex*S_tex + W_audio*S_audio + W_gpu*S_gpu' },
  { id: 'preloader-gpu-prewarming', name: 'GPU Shader Prewarming Pipeline', sub: 'gl.compile(scene, camera) executes offscreen before preloader dissolves', spec: 'Eliminates first-frame WebGL shader compile stutter and frame drops' },
  { id: 'preloader-inline-shell', name: 'Pre-React Zero-Latency Boot Shell', sub: 'Raw inline HTML/CSS with SVG Stingray silhouette rendering at Byte 0', spec: 'First Contentful Paint under 350ms even on constrained mobile networks' },
];

preloaderAssets.forEach((pre) => {
  const content = `
    <!-- Preloader Assembly Step Diagram -->
    <g transform="translate(60, 30)">
      ${[
        { name: '1. INIT', w: 35 },
        { name: '2. ASSETS', w: 50 },
        { name: '3. GEOMETRY', w: 85 },
        { name: '4. PBR PBR', w: 110 },
        { name: '5. PREWARM', w: 140 },
        { name: '6. AUDIO', w: 165 },
        { name: '7. CALIBRATE', w: 190 },
        { name: '8. READY', w: 220 }
      ].map((step, idx) => `
        <g transform="translate(${idx * 90}, 0)">
          <rect x="0" y="0" width="80" height="90" rx="4" fill="#141722" stroke="${idx === 7 ? '#00e5ff' : '#ff1e27'}" stroke-width="1.5"/>
          <text x="40" y="32" text-anchor="middle" fill="#ff1e27" font-size="9" font-family="'Space Mono', monospace">PHASE 0${idx + 1}</text>
          <text x="40" y="55" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="700">${step.name}</text>
          <circle cx="40" cy="72" r="4" fill="${idx <= 6 ? '#ff1e27' : '#00e5ff'}"/>
        </g>
      `).join('')}
    </g>

    <!-- Technical Note Card -->
    <g transform="translate(60, 160)">
      <rect x="0" y="0" width="720" height="110" rx="6" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      <g transform="translate(24, 28)">
        <text x="0" y="0" fill="#555d77" font-size="10" font-family="'Space Mono', monospace">STAGING METHODOLOGY</text>
        <text x="0" y="24" fill="#ffffff" font-size="13" font-weight="600">${pre.spec}</text>
      </g>
      <g transform="translate(440, 28)">
        <text x="0" y="0" fill="#555d77" font-size="10" font-family="'Space Mono', monospace">PACING CEILING</text>
        <text x="0" y="24" fill="#00e5ff" font-size="13" font-weight="600">Min 1.4s | Safety Cap 12.0s</text>
      </g>
    </g>
  `;
  saveAsset(`preloader/${pre.id}.svg`, baseCard({ title: pre.name, subtitle: pre.sub, tag: 'CINEMATIC PRELOADER & LOADING-TIME MANAGEMENT', content }));
});

// ==========================================
// 9. MINIMAL EDITORIAL UI & TELEMETRY (5 SVGs)
// ==========================================
const uiAssets = [
  { id: 'ui-spatial-hud-layout', name: 'Minimal Contextual HUD Layout', sub: 'Floating unobtrusive controls: Audio, Font Switcher, Specifications & Livery Dock', role: 'No permanent card or header clutter' },
  { id: 'ui-technical-dossier', name: 'Technical Engineering Dossier Drawer', sub: '650 HP @ 6400 RPM | 650 lb-ft Torque | 0-60 mph: 2.95s | Top Speed: 196 mph', role: 'Slide-in technical dossier modal with verified powertrain data' },
  { id: 'ui-color-swatch-dock', name: 'Factory Curated Color Swatch Palette', sub: '5 authentic factory finishes rendered with micro-bead radial reflections', role: 'Contextual right-hand floating dock' },
  { id: 'ui-font-comparison', name: 'Dual-Font Architecture: Big Shoulders vs Barlow', sub: 'Switch between Le Mans uppercase muscle styling and Swiss engineering precision', role: 'Runtime font toggle engine' },
  { id: 'ui-telemetry-hud-overlay', name: 'Development Telemetry Diagnostics HUD', sub: 'Shift + V (VFX tuning) | Shift + L (Load telemetry) | Shift + I (Idle test)', role: 'Built-in real-time GPU profiler' },
];

uiAssets.forEach((ui) => {
  const content = `
    <!-- UI Visual Wireframe Mock -->
    <g transform="translate(60, 20)">
      <rect x="0" y="0" width="720" height="150" rx="6" fill="#141722" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/>
      <!-- Top Bar Wireframe -->
      <text x="24" y="35" fill="rgba(255,255,255,0.4)" font-size="11" font-weight="900" letter-spacing="0.1em">CORVETTE C7</text>
      <rect x="440" y="20" width="75" height="24" rx="3" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)"/>
      <text x="477" y="36" text-anchor="middle" fill="#ffffff" font-size="9" font-family="'Space Mono', monospace">AUDIO: ON</text>
      <rect x="525" y="20" width="85" height="24" rx="3" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)"/>
      <text x="567" y="36" text-anchor="middle" fill="#ffffff" font-size="9" font-family="'Space Mono', monospace">FONT: BARLOW</text>
      <!-- Circular Repo Button -->
      <circle cx="635" cy="32" r="14" fill="rgba(255,255,255,0.08)" stroke="#ff1e27" stroke-width="1.5"/>
      <circle cx="635" cy="32" r="4" fill="#ffffff"/>

      <!-- Center Subtitle -->
      <text x="360" y="105" text-anchor="middle" fill="#ffffff" font-size="28" font-weight="900" letter-spacing="0.15em">MOTION IN BLACK</text>
    </g>

    <!-- Description Card -->
    <g transform="translate(60, 190)">
      <rect x="0" y="0" width="720" height="80" rx="6" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      <g transform="translate(24, 24)">
        <text x="0" y="0" fill="#555d77" font-size="10" font-family="'Space Mono', monospace">DESIGN PRINCIPLE</text>
        <text x="0" y="22" fill="#ffffff" font-size="13" font-weight="600">${ui.role}</text>
      </g>
    </g>
  `;
  saveAsset(`ui/${ui.id}.svg`, baseCard({ title: ui.name, subtitle: ui.sub, tag: 'MINIMAL CONTEXTUAL UI // HUD ARCHITECTURE', content }));
});

// ==========================================
// 10. SYSTEM ARCHITECTURE & DATA FLOW (4 SVGs)
// ==========================================
const archAssets = [
  { id: 'arch-component-tree', name: 'React 19 & Three.js Component Hierarchy', sub: 'App -> Canvas -> Experience -> StudioEnvironment + CarModel + CinematicCamera', spec: 'Decoupled presentation from physics loops' },
  { id: 'arch-render-loop', name: 'Unified RequestAnimationFrame Render Loop', sub: 'Synchronized scroll inertia, Catmull-Rom spline camera lerp, and Web Audio ducking', spec: 'Single frame ticker guaranteeing 0 desync or race conditions' },
  { id: 'arch-kinematics-spline', name: 'Catmull-Rom Spline & Cylindrical Orbit Math', sub: 'P(t) = P_target + (P_prev - P_target) * e^(-5.5 * dt) with Dutch tilt banking', spec: 'Guaranteed collision-free orbits with R_min = 3.2m vehicle clearance' },
  { id: 'arch-prewarmer-flow', name: 'Offscreen Shader Cache & Compile Sequence', sub: 'renderer.compile(scene, camera) primes materials and post-processing shaders', spec: 'Eliminates GPU pipeline hitches upon user scroll entry' },
];

archAssets.forEach((arc) => {
  const content = `
    <!-- Architecture Diagram Nodes -->
    <g transform="translate(60, 20)">
      <rect x="0" y="0" width="720" height="150" rx="6" fill="#141722" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      
      <!-- Flow Nodes -->
      <rect x="40" y="45" width="160" height="60" rx="4" fill="#1a1d28" stroke="#ff1e27" stroke-width="1.5"/>
      <text x="120" y="72" text-anchor="middle" fill="#ff1e27" font-size="10" font-family="'Space Mono', monospace">INPUT SCATTER</text>
      <text x="120" y="90" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="700">Scroll / Idle Hook</text>

      <line x1="200" y1="75" x2="280" y2="75" stroke="#ffffff" stroke-width="2"/>

      <rect x="280" y="45" width="160" height="60" rx="4" fill="#1a1d28" stroke="#00e5ff" stroke-width="1.5"/>
      <text x="360" y="72" text-anchor="middle" fill="#00e5ff" font-size="10" font-family="'Space Mono', monospace">PHYSICS CORE</text>
      <text x="360" y="90" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="700">Catmull-Rom Spline</text>

      <line x1="440" y1="75" x2="520" y2="75" stroke="#ffffff" stroke-width="2"/>

      <rect x="520" y="45" width="160" height="60" rx="4" fill="#1a1d28" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
      <text x="600" y="72" text-anchor="middle" fill="#8892b0" font-size="10" font-family="'Space Mono', monospace">RENDER OUTPUT</text>
      <text x="600" y="90" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="700">WebGL 2.0 / Audio</text>
    </g>

    <!-- Architecture Detail Card -->
    <g transform="translate(60, 190)">
      <rect x="0" y="0" width="720" height="80" rx="6" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      <g transform="translate(24, 24)">
        <text x="0" y="0" fill="#555d77" font-size="10" font-family="'Space Mono', monospace">CORE MECHANISM</text>
        <text x="0" y="22" fill="#ffffff" font-size="13" font-weight="600">${arc.spec}</text>
      </g>
    </g>
  `;
  saveAsset(`architecture/${arc.id}.svg`, baseCard({ title: arc.name, subtitle: arc.sub, tag: 'SYSTEM ARCHITECTURE & DATA FLOW', content }));
});

console.log('Successfully generated complete 53-asset SVG visual suite across wiki/images/ and docs/images/!');
