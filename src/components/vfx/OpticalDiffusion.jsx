import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getHazePuffTexture, getAnamorphicStreakTexture } from '../../utils/vfxTextures';

export function OpticalDiffusion({ timelineProgress, currentSpec }) {
  const driverHeadlightGlowRef = useRef();
  const passHeadlightGlowRef = useRef();
  const anamorphicStreakRef = useRef();
  const rearDiffuserGlowRef = useRef();
  const leftTaillightGlowRef = useRef();
  const rightTaillightGlowRef = useRef();

  const glowTexture = useMemo(() => getHazePuffTexture(), []);
  const streakTexture = useMemo(() => getAnamorphicStreakTexture(), []);

  useFrame(() => {
    const p = timelineProgress;

    // 1. HEADLIGHT OPTICAL DIFFUSION (Active during 0.44 -> 0.62)
    // Driver headlight projector position: [-0.72, 0.70, -1.85]
    // Passenger headlight projector: [0.72, 0.70, -1.85]
    let hlGlow = 0;
    if (p >= 0.44 && p <= 0.62) {
      if (p < 0.50) {
        hlGlow = ((p - 0.44) / 0.06) * 0.35;
      } else if (p <= 0.56) {
        hlGlow = 0.35;
      } else {
        hlGlow = (1 - (p - 0.56) / 0.06) * 0.35;
      }
    }

    if (driverHeadlightGlowRef.current) {
      driverHeadlightGlowRef.current.opacity = THREE.MathUtils.lerp(
        driverHeadlightGlowRef.current.opacity,
        hlGlow,
        0.12
      );
    }
    if (passHeadlightGlowRef.current) {
      passHeadlightGlowRef.current.opacity = THREE.MathUtils.lerp(
        passHeadlightGlowRef.current.opacity,
        hlGlow * 0.75, // passenger is further during macro dive
        0.12
      );
    }

    // 2. HORIZONTAL ANAMORPHIC STREAK (Active only when camera aligns with projector: 0.52 -> 0.56)
    let streakOpacity = 0;
    if (p >= 0.51 && p <= 0.57) {
      streakOpacity = Math.sin(((p - 0.51) / 0.06) * Math.PI) * 0.42;
    }
    if (anamorphicStreakRef.current) {
      anamorphicStreakRef.current.opacity = THREE.MathUtils.lerp(
        anamorphicStreakRef.current.opacity,
        streakOpacity,
        0.15
      );
    }

    // 3. REAR OPTICAL DIFFUSION (Active during rear chapter: 0.74 -> 0.88)
    // Quad exhaust tips: [0.0, 0.42, 2.0]
    // Taillights: [-0.65, 0.76, 2.08] & [0.65, 0.76, 2.08]
    let rearGlow = 0;
    if (p >= 0.74 && p <= 0.88) {
      if (p < 0.79) {
        rearGlow = ((p - 0.74) / 0.05) * 0.28;
      } else if (p <= 0.84) {
        rearGlow = 0.28;
      } else {
        rearGlow = (1 - (p - 0.84) / 0.04) * 0.28;
      }
    }

    // Color harmonization with active spec
    const rearColor = currentSpec?.ambient?.floorGlow || '#cc0a15';
    const c = new THREE.Color(rearColor);

    if (rearDiffuserGlowRef.current) {
      rearDiffuserGlowRef.current.opacity = THREE.MathUtils.lerp(
        rearDiffuserGlowRef.current.opacity,
        rearGlow * 0.8,
        0.12
      );
      rearDiffuserGlowRef.current.color.lerp(c, 0.08);
    }
    if (leftTaillightGlowRef.current) {
      leftTaillightGlowRef.current.opacity = THREE.MathUtils.lerp(
        leftTaillightGlowRef.current.opacity,
        rearGlow,
        0.12
      );
      leftTaillightGlowRef.current.color.lerp(c, 0.08);
    }
    if (rightTaillightGlowRef.current) {
      rightTaillightGlowRef.current.opacity = THREE.MathUtils.lerp(
        rightTaillightGlowRef.current.opacity,
        rearGlow,
        0.12
      );
      rightTaillightGlowRef.current.color.lerp(c, 0.08);
    }
  });

  return (
    <group name="optical-diffusion">
      {/* Driver Headlight Soft Lens Glow */}
      <mesh position={[-0.72, 0.70, -1.86]} rotation={[0, 0, 0]} scale={[0.85, 0.85, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          ref={driverHeadlightGlowRef}
          map={glowTexture}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color="#d8ecff"
        />
      </mesh>

      {/* Passenger Headlight Soft Lens Glow */}
      <mesh position={[0.72, 0.70, -1.86]} rotation={[0, 0, 0]} scale={[0.85, 0.85, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          ref={passHeadlightGlowRef}
          map={glowTexture}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color="#d8ecff"
        />
      </mesh>

      {/* Horizontal Anamorphic Flare Streak on Driver Headlight */}
      <mesh position={[-0.72, 0.70, -1.84]} rotation={[0, 0, 0]} scale={[2.4, 0.28, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          ref={anamorphicStreakRef}
          map={streakTexture}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color="#ffffff"
        />
      </mesh>

      {/* Rear Quad Exhaust Optical Warmth */}
      <mesh position={[0.0, 0.42, 2.02]} rotation={[0, Math.PI, 0]} scale={[1.2, 0.8, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          ref={rearDiffuserGlowRef}
          map={glowTexture}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color="#cc0a15"
        />
      </mesh>

      {/* Left Taillight Soft Glow */}
      <mesh position={[-0.65, 0.76, 2.09]} rotation={[0, Math.PI, 0]} scale={[0.9, 0.6, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          ref={leftTaillightGlowRef}
          map={glowTexture}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color="#cc0a15"
        />
      </mesh>

      {/* Right Taillight Soft Glow */}
      <mesh position={[0.65, 0.76, 2.09]} rotation={[0, Math.PI, 0]} scale={[0.9, 0.6, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          ref={rightTaillightGlowRef}
          map={glowTexture}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color="#cc0a15"
        />
      </mesh>
    </group>
  );
}
