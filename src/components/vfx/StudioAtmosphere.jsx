import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getHazePuffTexture } from '../../utils/vfxTextures';

export function StudioAtmosphere({ timelineProgress, currentSpec }) {
  const hazeGroupRef = useRef();
  const floorHazeMatRef = useRef();
  const rearHazeMatRef = useRef();
  const bgHazeMatRef = useRef();

  const hazeTexture = useMemo(() => getHazePuffTexture(), []);

  // Subtle natural positioning for floor and background haze disks
  const floorDisks = useMemo(() => [
    { pos: [0, 0.06, 0.5], scale: [8.5, 8.5, 1], rot: [-Math.PI / 2, 0, 0] },
    { pos: [-2.2, 0.08, -1.2], scale: [6.5, 6.5, 1], rot: [-Math.PI / 2, 0, 0.4] },
    { pos: [2.2, 0.08, 1.4], scale: [7.0, 7.0, 1], rot: [-Math.PI / 2, 0, -0.3] },
    { pos: [0, 0.10, 2.8], scale: [7.5, 7.5, 1], rot: [-Math.PI / 2, 0, 0.2] },
  ], []);

  const bgPuffs = useMemo(() => [
    { pos: [-2.5, 0.9, 3.2], scale: [5.5, 4.0, 1] },
    { pos: [2.2, 1.1, 3.6], scale: [6.0, 4.2, 1] },
    { pos: [0.0, 0.8, 4.2], scale: [7.0, 4.5, 1] },
  ], []);

  useFrame((state) => {
    const p = timelineProgress;
    const time = state.clock.elapsedTime;

    // Extremely slow natural air drift (< 0.05 units)
    if (hazeGroupRef.current) {
      hazeGroupRef.current.position.x = Math.sin(time * 0.12) * 0.06;
      hazeGroupRef.current.position.z = Math.cos(time * 0.10) * 0.06;
    }

    // Dynamic Haze Density Modulation (95% clarity, 5% atmosphere):
    // 0.00 - 0.08: Opening stillness (haze opacity ~ 0.035)
    // 0.25 - 0.45: Softbox sweep across body (opacity ~ 0.055)
    // 0.47 - 0.60: Headlight optical scene (floor haze calm, front clear)
    // 0.78 - 0.88: Rear exhaust glow (rear haze catches crimson glow)
    // 0.88 - 0.92: PAUSE SCENE (almost all haze disappears ~ 0.005 for crystalline stillness)
    // 0.96 - 1.00: Final hero (very subtle floor haze ~ 0.025)

    let baseOpacity = 0.035;
    if (p >= 0.25 && p <= 0.45) {
      baseOpacity = 0.035 + Math.sin(((p - 0.25) / 0.20) * Math.PI) * 0.025;
    } else if (p >= 0.88 && p <= 0.92) {
      baseOpacity = 0.005; // Crystalline pause
    } else if (p >= 0.96) {
      baseOpacity = 0.025;
    }

    if (floorHazeMatRef.current) {
      floorHazeMatRef.current.opacity = THREE.MathUtils.lerp(
        floorHazeMatRef.current.opacity,
        baseOpacity,
        0.08
      );
    }

    // Rear haze beneath exhaust catches red illumination during 0.76 - 0.88
    if (rearHazeMatRef.current) {
      let rearOpacity = 0.02;
      if (p >= 0.76 && p <= 0.88) {
        rearOpacity = 0.02 + Math.sin(((p - 0.76) / 0.12) * Math.PI) * 0.065;
      } else if (p >= 0.88 && p <= 0.92) {
        rearOpacity = 0.002;
      }
      rearHazeMatRef.current.opacity = THREE.MathUtils.lerp(
        rearHazeMatRef.current.opacity,
        rearOpacity,
        0.08
      );

      // Color harmonization with active spec's backlight or default red
      const targetColor = currentSpec?.ambient?.floorGlow || '#cc0a15';
      rearHazeMatRef.current.color.lerp(new THREE.Color(targetColor), 0.08);
    }

    // Background haze depth
    if (bgHazeMatRef.current) {
      let bgOpacity = 0.025;
      if (p >= 0.88 && p <= 0.92) {
        bgOpacity = 0.004;
      }
      bgHazeMatRef.current.opacity = THREE.MathUtils.lerp(
        bgHazeMatRef.current.opacity,
        bgOpacity,
        0.08
      );
    }
  });

  return (
    <group ref={hazeGroupRef}>
      {/* 1. Low Ground Haze Layer (Separates chassis from floor without cloudiness) */}
      {floorDisks.map((d, i) => (
        <mesh key={`floor-haze-${i}`} position={d.pos} rotation={d.rot} scale={d.scale}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            ref={i === 0 ? floorHazeMatRef : undefined}
            map={hazeTexture}
            transparent
            opacity={0.035}
            depthWrite={false}
            depthTest
            blending={THREE.NormalBlending}
            color="#22242a"
          />
        </mesh>
      ))}

      {/* 2. Rear Underbody Haze (Catches red exhaust illumination) */}
      <mesh position={[0, 0.12, 2.2]} rotation={[-Math.PI / 2, 0, 0]} scale={[5.5, 4.5, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          ref={rearHazeMatRef}
          map={hazeTexture}
          transparent
          opacity={0.02}
          depthWrite={false}
          depthTest
          blending={THREE.AdditiveBlending}
          color="#cc0a15"
        />
      </mesh>

      {/* 3. Deep Background Volumetric Haze (Suspended behind vehicle) */}
      {bgPuffs.map((p, i) => (
        <mesh key={`bg-haze-${i}`} position={p.pos} scale={p.scale}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            ref={i === 0 ? bgHazeMatRef : undefined}
            map={hazeTexture}
            transparent
            opacity={0.025}
            depthWrite={false}
            depthTest
            blending={THREE.NormalBlending}
            color="#14161c"
          />
        </mesh>
      ))}
    </group>
  );
}
