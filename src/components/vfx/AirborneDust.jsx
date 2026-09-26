import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getDustParticleTexture } from '../../utils/vfxTextures';

// Pure deterministic pseudo-random generator (guarantees render purity & stable distribution)
function pseudoRand(seed) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

const PARTICLE_COUNT = 95;

export function AirborneDust({ timelineProgress }) {
  const pointsRef = useRef();
  const materialRef = useRef();

  const particleTexture = useMemo(() => getDustParticleTexture(), []);

  const { positions, basePositions, speeds, phases } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const basePos = new Float32Array(PARTICLE_COUNT * 3);
    const sp = new Float32Array(PARTICLE_COUNT);
    const ph = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Bounding volume: X [-4.5, 4.5], Y [0.2, 2.8], Z [-4.0, 4.5]
      const r1 = pseudoRand(i * 4 + 1);
      const r2 = pseudoRand(i * 4 + 2);
      const r3 = pseudoRand(i * 4 + 3);
      const r4 = pseudoRand(i * 4 + 4);

      const x = (r1 - 0.5) * 9.0;
      const y = 0.2 + r2 * 2.6;
      const z = (r3 - 0.5) * 8.5;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      basePos[i * 3] = x;
      basePos[i * 3 + 1] = y;
      basePos[i * 3 + 2] = z;

      sp[i] = 0.15 + r4 * 0.35;
      ph[i] = r1 * Math.PI * 2;
    }

    return {
      positions: pos,
      basePositions: basePos,
      speeds: sp,
      phases: ph,
    };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const p = timelineProgress;
    const time = state.clock.elapsedTime;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;

    // Experimental Transition Dispersion (0.92 -> 0.96)
    // Small amount of photographic particle breakup that disperses and settles
    let isDispersing = false;
    let disperseFactor = 0;
    if (p >= 0.92 && p <= 0.96) {
      isDispersing = true;
      disperseFactor = Math.sin(((p - 0.92) / 0.04) * Math.PI);
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;
      const speed = speeds[i];
      const phase = phases[i];

      // Extremely slow, natural Brownian suspension drift
      let dx = Math.sin(time * speed + phase) * 0.08;
      let dy = Math.cos(time * speed * 0.8 + phase) * 0.06;
      let dz = Math.sin(time * speed * 0.6 + phase) * 0.08;

      // During experimental transition, subtle radial displacement from center
      if (isDispersing) {
        dx += (basePositions[idx] > 0 ? 1 : -1) * disperseFactor * 0.6;
        dy += disperseFactor * 0.35;
        dz += (basePositions[idx + 2] > 0 ? 1 : -1) * disperseFactor * 0.5;
      }

      posAttr.array[idx] = basePositions[idx] + dx;
      posAttr.array[idx + 1] = basePositions[idx + 1] + dy;
      posAttr.array[idx + 2] = basePositions[idx + 2] + dz;
    }

    posAttr.needsUpdate = true;

    // Atmospheric visibility modulation:
    // When studio light sweeps or headlights ignite, particles softly catch illumination
    let targetOpacity = 0.14;

    // Light sweep interaction (0.25 - 0.45)
    if (p >= 0.25 && p <= 0.45) {
      targetOpacity = 0.22;
    }
    // Headlight macro dive (0.50 - 0.58)
    else if (p >= 0.50 && p <= 0.58) {
      targetOpacity = 0.26;
    }
    // PAUSE SCENE (0.88 - 0.92): Crystalline stillness (opacity down to 0.02)
    else if (p >= 0.88 && p <= 0.92) {
      targetOpacity = 0.02;
    }
    // Experimental transition (0.92 - 0.96): momentary visibility during dispersion
    else if (p >= 0.92 && p <= 0.96) {
      targetOpacity = 0.30;
    }
    // Final hero (0.96 - 1.00): quiet, microscopic dust
    else if (p >= 0.96) {
      targetOpacity = 0.12;
    }

    if (materialRef.current) {
      materialRef.current.opacity = THREE.MathUtils.lerp(
        materialRef.current.opacity,
        targetOpacity,
        0.08
      );
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        map={particleTexture}
        size={0.065}
        sizeAttenuation
        transparent
        opacity={0.14}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color="#d8e0eb"
      />
    </points>
  );
}
