import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';

export function StudioEnvironment({ timelineProgress, mouseOffset, currentSpec }) {
  const movingSoftboxRef = useRef();
  const rimLightRef = useRef();
  const topSoftboxRef = useRef();
  const fillLightRef = useRef();
  const redBacklightRef = useRef();
  const redFloorGlowRef = useRef();

  useFrame((state, delta) => {
    const p = timelineProgress;
    const mx = mouseOffset?.x || 0;
    const my = mouseOffset?.y || 0;

    // Moving virtual studio softbox traveling smoothly across bodywork
    if (movingSoftboxRef.current) {
      const angle = (p * 2.2 + 0.3) * Math.PI;
      const radius = 4.8;
      const targetX = Math.cos(angle) * radius + mx * 0.8;
      const targetZ = Math.sin(angle) * radius;
      const targetY = 2.2 + Math.sin(p * Math.PI * 2) * 0.8 - my * 0.5;

      movingSoftboxRef.current.position.x = THREE.MathUtils.damp(
        movingSoftboxRef.current.position.x,
        targetX,
        3.5,
        delta
      );
      movingSoftboxRef.current.position.y = THREE.MathUtils.damp(
        movingSoftboxRef.current.position.y,
        targetY,
        3.5,
        delta
      );
      movingSoftboxRef.current.position.z = THREE.MathUtils.damp(
        movingSoftboxRef.current.position.z,
        targetZ,
        3.5,
        delta
      );

      // Light sweep flare during scene 52% - 62%
      let sweepBonus = 0;
      if (p >= 0.52 && p <= 0.62) {
        sweepBonus = Math.sin(((p - 0.52) / 0.10) * Math.PI) * 4.2;
      }
      const baseIntensity = 2.4 + sweepBonus;
      movingSoftboxRef.current.intensity = THREE.MathUtils.lerp(
        movingSoftboxRef.current.intensity,
        baseIntensity,
        0.1
      );
    }

    // Top overhead linear softbox
    if (topSoftboxRef.current) {
      const topIntensity = 1.6 + Math.sin(p * Math.PI) * 0.8;
      topSoftboxRef.current.intensity = THREE.MathUtils.lerp(
        topSoftboxRef.current.intensity,
        topIntensity,
        0.1
      );
    }

    // Razor-sharp white contour rim light
    if (rimLightRef.current) {
      const rimAngle = (-p * 1.8 + Math.PI * 1.2);
      rimLightRef.current.position.x = Math.cos(rimAngle) * 5.2;
      rimLightRef.current.position.z = Math.sin(rimAngle) * 5.2;
    }

    // Deep Red Atmospheric Backlight & Floor Glow modulation
    // Intensifies during rear and performance scenes (0.65 -> 0.90)
    if (redBacklightRef.current && redFloorGlowRef.current) {
      let redFactor = 1.0;
      if (p >= 0.65 && p <= 0.92) {
        redFactor = 1.8 + Math.sin(((p - 0.65) / 0.27) * Math.PI) * 1.2;
      }
      redBacklightRef.current.intensity = THREE.MathUtils.lerp(
        redBacklightRef.current.intensity,
        3.8 * redFactor,
        0.08
      );
      redFloorGlowRef.current.intensity = THREE.MathUtils.lerp(
        redFloorGlowRef.current.intensity,
        2.5 * redFactor,
        0.08
      );
    }

    // Dynamic color harmonization with the active car spec
    if (currentSpec?.ambient) {
      if (redBacklightRef.current && currentSpec.ambient.backlight) {
        redBacklightRef.current.color.lerp(new THREE.Color(currentSpec.ambient.backlight), 0.08);
      }
      if (redFloorGlowRef.current && currentSpec.ambient.floorGlow) {
        redFloorGlowRef.current.color.lerp(new THREE.Color(currentSpec.ambient.floorGlow), 0.08);
      }
      if (rimLightRef.current && currentSpec.ambient.rimLight) {
        rimLightRef.current.color.lerp(new THREE.Color(currentSpec.ambient.rimLight), 0.08);
      }
    }
  });

  return (
    <>
      {/* Studio HDRI Environment for physically believable metallic reflections */}
      <Environment preset="city" environmentIntensity={0.55} />

      {/* Atmospheric deep crimson nocturnal ambient fill */}
      <ambientLight intensity={0.5} color="#160306" />

      {/* Deep Red Volumetric Atmospheric Backlight (silhouette depth separation) */}
      <spotLight
        ref={redBacklightRef}
        position={[0, 1.2, 4.8]}
        target-position={[0, 0.6, 0]}
        intensity={3.8}
        color="#e6101c"
        angle={1.1}
        penumbra={0.9}
        distance={14}
      />

      {/* Red Floor Glow / Underbody Sheen beneath rear axle */}
      <pointLight
        ref={redFloorGlowRef}
        position={[0, 0.12, 1.9]}
        intensity={2.5}
        color="#cc0a15"
        distance={6.5}
        decay={1.8}
      />

      {/* Razor Red Rim Spotlight sculpting rear muscle shoulders */}
      <spotLight
        position={[-4.8, 1.9, 2.4]}
        target-position={[0, 0.65, 0.8]}
        intensity={3.2}
        color="#ff1a26"
        angle={0.55}
        penumbra={0.7}
      />

      {/* Travelling Studio Softbox */}
      <directionalLight
        ref={movingSoftboxRef}
        position={[3, 3, -3]}
        intensity={2.5}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.0001}
      />

      {/* Large Overhead Linear Softbox */}
      <directionalLight
        ref={topSoftboxRef}
        position={[0, 6, 0]}
        intensity={1.8}
        color="#e6ecf8"
      />

      {/* Razor-sharp Contour White Rim Light */}
      <spotLight
        ref={rimLightRef}
        position={[-4, 3, 3]}
        target-position={[0, 0.6, 0]}
        intensity={4.2}
        color="#f0f2f5"
        angle={0.6}
        penumbra={0.8}
      />

      {/* Front Fill Light */}
      <directionalLight
        ref={fillLightRef}
        position={[0, 0.8, -5]}
        intensity={0.65}
        color="#d0d5dd"
      />

      {/* Matte Dark Ground Plane catching physical contact shadows & red sheen */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]} receiveShadow>
        <planeGeometry args={[70, 70]} />
        <meshStandardMaterial
          color="#060608"
          roughness={0.72}
          metalness={0.28}
          envMapIntensity={0.5}
        />
      </mesh>

      {/* High-fidelity Contact Shadow beneath chassis */}
      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={0.88}
        scale={8.8}
        blur={1.8}
        far={2.5}
        resolution={1024}
        color="#000000"
      />
    </>
  );
}
