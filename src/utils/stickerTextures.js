import * as THREE from 'three';

const textureCache = new Map();

/**
 * Creates an ultra-crisp 1024x1024 CanvasTexture for the legendary
 * Corvette Racing "JAKE" skull mascot.
 */
export function createJakeTexture(primaryColor = '#101114', accentColor = '#f5b800') {
  const cacheKey = `jake_${primaryColor}_${accentColor}`;
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey);

  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, size, size);

  // Center coordinate space (512, 512)
  ctx.save();
  ctx.translate(512, 460);

  // 1. Subtle Outer Carbon / Halo Ring
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(0, -60, 360, 0, Math.PI * 2);
  ctx.stroke();

  // Fine accent border ring
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, -60, 372, 0, Math.PI * 2);
  ctx.stroke();

  // 2. CRANIUM - Aggressive Sculpted Corvette Racing Skull
  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  // Skull crown
  ctx.moveTo(0, -380);
  ctx.bezierCurveTo(220, -380, 320, -260, 320, -90);
  // Temple & Cheekbone flare
  ctx.bezierCurveTo(320, 30, 270, 90, 240, 130);
  // Zygomatic arch notch
  ctx.lineTo(260, 170);
  ctx.lineTo(190, 210);
  // Jawline
  ctx.lineTo(160, 340);
  // Chin / Teeth base
  ctx.lineTo(80, 360);
  ctx.lineTo(0, 365);
  ctx.lineTo(-80, 360);
  ctx.lineTo(-160, 340);
  // Left jawline
  ctx.lineTo(-190, 210);
  ctx.lineTo(-260, 170);
  ctx.lineTo(-240, 130);
  ctx.bezierCurveTo(-270, 90, -320, 30, -320, -90);
  ctx.bezierCurveTo(-320, -260, -220, -380, 0, -380);
  ctx.closePath();
  ctx.fill();

  // Accent edge contour on skull
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 6;
  ctx.stroke();

  // 3. AGGRESSIVE ANGULAR EYE SOCKETS (Cutouts revealing car paint or accent)
  ctx.fillStyle = accentColor;
  // Left eye
  ctx.beginPath();
  ctx.moveTo(-150, -110);
  ctx.lineTo(-50, -75);
  ctx.lineTo(-70, 10);
  ctx.lineTo(-180, -20);
  ctx.closePath();
  ctx.fill();

  // Right eye
  ctx.beginPath();
  ctx.moveTo(150, -110);
  ctx.lineTo(50, -75);
  ctx.lineTo(70, 10);
  ctx.lineTo(180, -20);
  ctx.closePath();
  ctx.fill();

  // 4. CORVETTE CROSSED-FLAGS EMBLEM (Integral to Jake's Teeth & Nose)
  // Nasal Cavity (Inverted Spade / Crossed V)
  ctx.beginPath();
  ctx.moveTo(0, 40);
  ctx.lineTo(38, 120);
  ctx.lineTo(0, 95);
  ctx.lineTo(-38, 120);
  ctx.closePath();
  ctx.fill();

  // Vertical Skull Teeth Slashes (Chevy Flag / Checkered Flag homage)
  const teeth = [-110, -70, -30, 10, 50, 90];
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  teeth.forEach((tx) => {
    ctx.beginPath();
    ctx.moveTo(tx, 250);
    ctx.lineTo(tx + 12, 335);
    ctx.stroke();
  });

  // Horizontal jaw separator
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-135, 290);
  ctx.lineTo(135, 290);
  ctx.stroke();

  // 5. "CORVETTE RACING" ARCHED TYPOGRAPHY
  ctx.font = '900 46px "Outfit", "Inter", sans-serif';
  ctx.fillStyle = primaryColor;
  ctx.textAlign = 'center';
  ctx.letterSpacing = '12px';
  ctx.fillText('CORVETTE RACING', 0, 440);

  ctx.font = '700 24px "Outfit", "Inter", sans-serif';
  ctx.fillStyle = accentColor;
  ctx.letterSpacing = '8px';
  ctx.fillText('// LE MANS CLASS WINNER //', 0, 480);

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  texture.generateMipmaps = true;
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Creates high-contrast Grand Sport dual diagonal fender stripes.
 */
export function createGrandSportTexture(primaryColor = '#101114', accentColor = '#d3101c') {
  const cacheKey = `gs_${primaryColor}_${accentColor}`;
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey);

  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.translate(512, 512);
  ctx.rotate((-32 * Math.PI) / 180); // 32 degree aggressive track rake

  // Stripe 1: Bold Main Slash
  ctx.fillStyle = primaryColor;
  ctx.fillRect(-220, -560, 150, 1120);

  // Outer pinstripe on Stripe 1
  ctx.fillStyle = accentColor;
  ctx.fillRect(-240, -560, 12, 1120);

  // Stripe 2: Secondary Slash
  ctx.fillStyle = primaryColor;
  ctx.fillRect(-30, -560, 150, 1120);

  // Outer pinstripe on Stripe 2
  ctx.fillStyle = accentColor;
  ctx.fillRect(128, -560, 12, 1120);

  // Micro "GRAND SPORT" typography on the primary slash
  ctx.save();
  ctx.rotate(Math.PI / 2);
  ctx.font = '900 28px "Outfit", "Inter", sans-serif';
  ctx.fillStyle = accentColor;
  ctx.textAlign = 'center';
  ctx.letterSpacing = '10px';
  ctx.fillText('GRAND SPORT', 0, 145);
  ctx.fillText('HERITAGE // 460 HP', 0, -45);
  ctx.restore();

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  texture.generateMipmaps = true;
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Creates an aggressive tapered carbon Stinger hood spear.
 */
export function createStingerTexture(primaryColor = '#101114', accentColor = '#f5b800') {
  const cacheKey = `stinger_${primaryColor}_${accentColor}`;
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey);

  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, size, size);
  ctx.save();

  // Center tapered spear down hood
  const cx = 512;
  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.moveTo(cx - 210, 40);
  ctx.lineTo(cx + 210, 40);
  ctx.lineTo(cx + 140, 980);
  ctx.lineTo(cx - 140, 980);
  ctx.closePath();
  ctx.fill();

  // Carbon weave texture effect
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 3;
  for (let y = 50; y < 980; y += 14) {
    ctx.beginPath();
    ctx.moveTo(cx - 200, y);
    ctx.lineTo(cx + 200, y);
    ctx.stroke();
  }

  // Accent pinstripes flanking the spear
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(cx - 225, 40);
  ctx.lineTo(cx - 155, 980);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx + 225, 40);
  ctx.lineTo(cx + 155, 980);
  ctx.stroke();

  // Central racing stripe
  ctx.fillStyle = accentColor;
  ctx.fillRect(cx - 6, 60, 12, 900);

  // "STINGRAY" typographic emblem
  ctx.font = '900 36px "Outfit", "Inter", sans-serif';
  ctx.fillStyle = accentColor;
  ctx.textAlign = 'center';
  ctx.letterSpacing = '14px';
  ctx.fillText('STINGRAY', cx, 860);

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  texture.generateMipmaps = true;
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Creates the Corvette Racing Le Mans #3 Championship Roundel.
 */
export function createRoundelTexture(primaryColor = '#101114', accentColor = '#d3101c') {
  const cacheKey = `roundel_${primaryColor}_${accentColor}`;
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey);

  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.translate(512, 512);

  // Outer dark disc
  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.arc(0, 0, 420, 0, Math.PI * 2);
  ctx.fill();

  // High-contrast accent ring
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.arc(0, 0, 395, 0, Math.PI * 2);
  ctx.stroke();

  // White inner circle for motorsport number plate
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.arc(0, 0, 350, 0, Math.PI * 2);
  ctx.fill();

  // Bold Motorsport Number "3"
  ctx.fillStyle = '#0f1115';
  ctx.font = '900 340px "Outfit", "Impact", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('3', 0, 20);

  // Arched text around top and bottom
  ctx.font = '900 32px "Outfit", "Inter", sans-serif';
  ctx.fillStyle = accentColor;
  ctx.letterSpacing = '10px';
  ctx.fillText('CORVETTE RACING', 0, -270);
  ctx.fillText('24H LE MANS // C7.R', 0, 280);

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  texture.generateMipmaps = true;
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Creates subtle tone-on-tone Stealth Shadow Jake Skull for Obsidian Stealth.
 */
export function createStealthJakeTexture() {
  const cacheKey = 'stealth_jake';
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey);

  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.translate(512, 460);

  // Gloss black silhouette on matte body
  ctx.fillStyle = '#141418';
  ctx.beginPath();
  ctx.moveTo(0, -380);
  ctx.bezierCurveTo(220, -380, 320, -260, 320, -90);
  ctx.bezierCurveTo(320, 30, 270, 90, 240, 130);
  ctx.lineTo(260, 170);
  ctx.lineTo(190, 210);
  ctx.lineTo(160, 340);
  ctx.lineTo(80, 360);
  ctx.lineTo(0, 365);
  ctx.lineTo(-80, 360);
  ctx.lineTo(-160, 340);
  ctx.lineTo(-190, 210);
  ctx.lineTo(-260, 170);
  ctx.lineTo(-240, 130);
  ctx.bezierCurveTo(-270, 90, -320, 30, -320, -90);
  ctx.bezierCurveTo(-320, -260, -220, -380, 0, -380);
  ctx.closePath();
  ctx.fill();

  // Subtle crimson accent eye cutouts
  ctx.fillStyle = '#ff1a26';
  ctx.beginPath();
  ctx.moveTo(-150, -110);
  ctx.lineTo(-50, -75);
  ctx.lineTo(-70, 10);
  ctx.lineTo(-180, -20);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(150, -110);
  ctx.lineTo(50, -75);
  ctx.lineTo(70, 10);
  ctx.lineTo(180, -20);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  texture.generateMipmaps = true;
  textureCache.set(cacheKey, texture);
  return texture;
}
