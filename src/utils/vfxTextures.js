import * as THREE from 'three';

let hazePuffTexture = null;
let dustParticleTexture = null;
let anamorphicStreakTexture = null;

/**
 * Creates an ultra-soft radial Gaussian puff texture for studio haze
 */
export function getHazePuffTexture() {
  if (hazePuffTexture) return hazePuffTexture;

  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.65)');
  grad.addColorStop(0.65, 'rgba(255, 255, 255, 0.15)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  hazePuffTexture = new THREE.CanvasTexture(canvas);
  hazePuffTexture.wrapS = THREE.ClampToEdgeWrapping;
  hazePuffTexture.wrapT = THREE.ClampToEdgeWrapping;
  return hazePuffTexture;
}

/**
 * Creates a soft microscopic dust particle dot texture
 */
export function getDustParticleTexture() {
  if (dustParticleTexture) return dustParticleTexture;

  const size = 32;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.55)');
  grad.addColorStop(0.85, 'rgba(255, 255, 255, 0.08)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  dustParticleTexture = new THREE.CanvasTexture(canvas);
  return dustParticleTexture;
}

/**
 * Creates an ultra-subtle horizontal anamorphic optical streak texture for headlight close-up
 */
export function getAnamorphicStreakTexture() {
  if (anamorphicStreakTexture) return anamorphicStreakTexture;

  const w = 512;
  const h = 64;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  // Draw horizontal anamorphic streak with soft falloff
  const grad = ctx.createLinearGradient(0, 0, w, 0);
  grad.addColorStop(0, 'rgba(160, 210, 255, 0)');
  grad.addColorStop(0.35, 'rgba(180, 225, 255, 0.18)');
  grad.addColorStop(0.48, 'rgba(230, 245, 255, 0.85)');
  grad.addColorStop(0.5, 'rgba(255, 255, 255, 1.0)');
  grad.addColorStop(0.52, 'rgba(230, 245, 255, 0.85)');
  grad.addColorStop(0.65, 'rgba(180, 225, 255, 0.18)');
  grad.addColorStop(1, 'rgba(160, 210, 255, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Soft vertical gaussian mask
  ctx.globalCompositeOperation = 'destination-in';
  const vertGrad = ctx.createLinearGradient(0, 0, 0, h);
  vertGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vertGrad.addColorStop(0.5, 'rgba(0, 0, 0, 1)');
  vertGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = vertGrad;
  ctx.fillRect(0, 0, w, h);

  anamorphicStreakTexture = new THREE.CanvasTexture(canvas);
  return anamorphicStreakTexture;
}

