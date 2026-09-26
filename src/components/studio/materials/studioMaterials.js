import * as THREE from 'three';

// Caches for generated procedural canvas textures
let concreteTexture = null;
let carbonTexture = null;
let pegboardTexture = null;
let brushedMetalTexture = null;
let tireTreadTexture = null;

/**
 * 1. Procedural Fine Concrete Grain & Micro-pore Texture
 */
export function getConcreteTexture() {
  if (concreteTexture) return concreteTexture;
  if (typeof document === 'undefined') return null;

  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#181b22';
  ctx.fillRect(0, 0, size, size);

  // Add subtle granular concrete micro-variation
  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 22;
    data[i] = Math.max(0, Math.min(255, data[i] + noise));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise + 2));
  }
  ctx.putImageData(imgData, 0, 0);

  // Subtle concrete pores
  ctx.fillStyle = 'rgba(10, 12, 16, 0.4)';
  for (let i = 0; i < 40; i++) {
    const rx = Math.random() * size;
    const ry = Math.random() * size;
    const rad = 0.5 + Math.random() * 1.5;
    ctx.beginPath();
    ctx.arc(rx, ry, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  concreteTexture = new THREE.CanvasTexture(canvas);
  concreteTexture.wrapS = THREE.RepeatWrapping;
  concreteTexture.wrapT = THREE.RepeatWrapping;
  concreteTexture.repeat.set(4, 4);
  return concreteTexture;
}

/**
 * 2. Procedural 2x2 Twill Weave Carbon Fiber Texture
 */
export function getCarbonTexture() {
  if (carbonTexture) return carbonTexture;
  if (typeof document === 'undefined') return null;

  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#101114';
  ctx.fillRect(0, 0, size, size);

  // Draw 2x2 twill weave pattern
  const step = 8;
  for (let y = 0; y < size; y += step) {
    for (let x = 0; x < size; x += step) {
      const isAlt = ((x / step) + (y / step)) % 2 === 0;
      ctx.fillStyle = isAlt ? '#22252c' : '#14161a';
      ctx.fillRect(x, y, step, step);

      // Fine diagonal fiber thread striation
      ctx.strokeStyle = isAlt ? '#2e333d' : '#181a20';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y + step);
      ctx.lineTo(x + step, y);
      ctx.stroke();
    }
  }

  carbonTexture = new THREE.CanvasTexture(canvas);
  carbonTexture.wrapS = THREE.RepeatWrapping;
  carbonTexture.wrapT = THREE.RepeatWrapping;
  carbonTexture.repeat.set(6, 6);
  return carbonTexture;
}

/**
 * 3. Procedural Perforated Metal / Tool Pegboard Pattern
 */
export function getPegboardTexture() {
  if (pegboardTexture) return pegboardTexture;
  if (typeof document === 'undefined') return null;

  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#15171e';
  ctx.fillRect(0, 0, size, size);

  // Perforated hole grid
  const pitch = 16;
  const radius = 3.2;
  for (let y = pitch / 2; y < size; y += pitch) {
    for (let x = pitch / 2; x < size; x += pitch) {
      // Metallic hole bevel highlight
      ctx.fillStyle = '#262a34';
      ctx.beginPath();
      ctx.arc(x, y, radius + 0.8, 0, Math.PI * 2);
      ctx.fill();

      // Deep dark hole cavity
      ctx.fillStyle = '#08090c';
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  pegboardTexture = new THREE.CanvasTexture(canvas);
  pegboardTexture.wrapS = THREE.RepeatWrapping;
  pegboardTexture.wrapT = THREE.RepeatWrapping;
  pegboardTexture.repeat.set(4, 4);
  return pegboardTexture;
}

/**
 * 4. Procedural Brushed Metal Anisotropic Hairline Grain
 */
export function getBrushedMetalTexture() {
  if (brushedMetalTexture) return brushedMetalTexture;
  if (typeof document === 'undefined') return null;

  const w = 128;
  const h = 32;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#22262e';
  ctx.fillRect(0, 0, w, h);

  // Horizontal brushed metal lines
  for (let y = 0; y < h; y++) {
    const alpha = 0.05 + Math.random() * 0.12;
    const isBright = Math.random() > 0.5;
    ctx.strokeStyle = isBright ? `rgba(220, 230, 245, ${alpha})` : `rgba(10, 12, 16, ${alpha})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(w, y + 0.5);
    ctx.stroke();
  }

  brushedMetalTexture = new THREE.CanvasTexture(canvas);
  brushedMetalTexture.wrapS = THREE.RepeatWrapping;
  brushedMetalTexture.wrapT = THREE.RepeatWrapping;
  brushedMetalTexture.repeat.set(2, 8);
  return brushedMetalTexture;
}

/**
 * 5. Procedural Competition Tire Tread Pattern
 */
export function getTireTreadTexture() {
  if (tireTreadTexture) return tireTreadTexture;
  if (typeof document === 'undefined') return null;

  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#141518';
  ctx.fillRect(0, 0, size, size);

  // Longitudinal slick sipes & tread grooves
  ctx.fillStyle = '#08080a';
  ctx.fillRect(12, 0, 4, size);
  ctx.fillRect(48, 0, 4, size);

  // Lateral high-performance tread cutouts
  ctx.strokeStyle = '#0a0b0d';
  ctx.lineWidth = 3;
  for (let y = 0; y < size; y += 16) {
    ctx.beginPath();
    ctx.moveTo(16, y);
    ctx.lineTo(36, y + 8);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(48, y);
    ctx.lineTo(28, y + 8);
    ctx.stroke();
  }

  tireTreadTexture = new THREE.CanvasTexture(canvas);
  tireTreadTexture.wrapS = THREE.RepeatWrapping;
  tireTreadTexture.wrapT = THREE.RepeatWrapping;
  tireTreadTexture.repeat.set(1, 4);
  return tireTreadTexture;
}

/**
 * Creates the Curated Physical Materials Library
 * Following the controlled luminance ladder:
 * #060709 (near black) -> #0c0e12 (graphite) -> #14171e (charcoal) -> #1e222b (dark concrete) -> #282d38 (metal)
 */
export function createStudioMaterials() {
  const concreteMap = getConcreteTexture();
  const carbonMap = getCarbonTexture();
  const pegboardMap = getPegboardTexture();
  const brushedMap = getBrushedMetalTexture();
  const tireMap = getTireTreadTexture();

  return {
    // 1. Concrete & Wall Materials
    concreteWall: new THREE.MeshStandardMaterial({
      color: '#13151b',
      roughness: 0.82,
      metalness: 0.18,
      roughnessMap: concreteMap,
      bumpMap: concreteMap,
      bumpScale: 0.02,
      envMapIntensity: 0.45,
    }),
    darkCompositeWall: new THREE.MeshStandardMaterial({
      color: '#0e1014',
      roughness: 0.65,
      metalness: 0.35,
      envMapIntensity: 0.55,
    }),
    acousticSlat: new THREE.MeshStandardMaterial({
      color: '#111318',
      roughness: 0.72,
      metalness: 0.28,
    }),

    // 2. Architectural Metals
    brushedGunmetal: new THREE.MeshStandardMaterial({
      color: '#262a34',
      roughness: 0.35,
      metalness: 0.85,
      roughnessMap: brushedMap,
      envMapIntensity: 1.4,
    }),
    anodizedBlack: new THREE.MeshStandardMaterial({
      color: '#14161c',
      roughness: 0.38,
      metalness: 0.88,
      envMapIntensity: 1.2,
    }),
    machinedAluminum: new THREE.MeshStandardMaterial({
      color: '#424856',
      roughness: 0.24,
      metalness: 0.92,
      envMapIntensity: 1.8,
    }),

    // 3. Automotive Specifics
    carbonFiber: new THREE.MeshPhysicalMaterial({
      color: '#111216',
      roughness: 0.22,
      metalness: 0.35,
      clearcoat: 0.85,
      clearcoatRoughness: 0.08,
      map: carbonMap,
      envMapIntensity: 1.8,
    }),
    tireRubber: new THREE.MeshStandardMaterial({
      color: '#111215',
      roughness: 0.88,
      metalness: 0.08,
      bumpMap: tireMap,
      bumpScale: 0.04,
    }),
    perforatedPegboard: new THREE.MeshStandardMaterial({
      color: '#15171e',
      roughness: 0.65,
      metalness: 0.42,
      map: pegboardMap,
      envMapIntensity: 0.8,
    }),

    // 4. Glass & Acrylic
    smokedGlass: new THREE.MeshPhysicalMaterial({
      color: '#0a0d12',
      roughness: 0.05,
      metalness: 0.15,
      transmission: 0.82,
      transparent: true,
      opacity: 0.75,
      ior: 1.52,
      envMapIntensity: 2.2,
    }),
    flutedAcrylic: new THREE.MeshPhysicalMaterial({
      color: '#121620',
      roughness: 0.22,
      metalness: 0.18,
      transmission: 0.78,
      transparent: true,
      opacity: 0.65,
      envMapIntensity: 1.5,
    }),

    // 5. Worktops & Furniture
    workbenchLaminate: new THREE.MeshStandardMaterial({
      color: '#15181f',
      roughness: 0.48,
      metalness: 0.25,
      envMapIntensity: 0.65,
    }),

    // 6. Flooring Materials
    stagedFloor: new THREE.MeshStandardMaterial({
      color: '#090a0d',
      roughness: 0.58,
      metalness: 0.38,
      bumpMap: concreteMap,
      bumpScale: 0.015,
      envMapIntensity: 0.75,
    }),
    floorRubberRunner: new THREE.MeshStandardMaterial({
      color: '#0c0d10',
      roughness: 0.85,
      metalness: 0.10,
    }),
    floorMetallicInlay: new THREE.MeshStandardMaterial({
      color: '#2e333e',
      roughness: 0.32,
      metalness: 0.85,
      envMapIntensity: 1.2,
    }),

    // 7. Controlled Restrained Accent Materials
    accentRed: new THREE.MeshStandardMaterial({
      color: '#c4121b',
      roughness: 0.35,
      metalness: 0.55,
      envMapIntensity: 1.5,
    }),
    accentAmber: new THREE.MeshStandardMaterial({
      color: '#d97706',
      emissive: '#b45309',
      emissiveIntensity: 0.6,
      roughness: 0.25,
      metalness: 0.4,
    }),
    accentBlue: new THREE.MeshStandardMaterial({
      color: '#1e3a8a',
      roughness: 0.32,
      metalness: 0.75,
    }),
  };
}
