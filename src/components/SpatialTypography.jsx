import React, { useRef } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function SpatialTypography({ timelineProgress }) {
  const textGroupRef = useRef();
  const corvetteTextRef = useRef();
  const finaleTextRef = useRef();

  useFrame(() => {
    const p = timelineProgress;

    // 1. Opening scene (0.18 -> 0.38): Massive "CORVETTE" behind vehicle
    if (corvetteTextRef.current) {
      let opacity = 0;
      if (p >= 0.17 && p <= 0.38) {
        if (p < 0.23) {
          opacity = (p - 0.17) / 0.06;
        } else if (p <= 0.32) {
          opacity = 1.0;
        } else {
          opacity = 1.0 - (p - 0.32) / 0.06;
        }
      }
      corvetteTextRef.current.material.opacity = THREE.MathUtils.lerp(
        corvetteTextRef.current.material.opacity,
        opacity,
        0.15
      );
      // Subtle depth drift
      corvetteTextRef.current.position.y = 1.25 + (p - 0.25) * 0.4;
    }

    // 2. Finale scene (0.90 -> 1.00): Monumental backdrop
    if (finaleTextRef.current) {
      let finaleOpacity = 0;
      if (p >= 0.90) {
        finaleOpacity = Math.min(1.0, (p - 0.90) / 0.07);
      }
      finaleTextRef.current.material.opacity = THREE.MathUtils.lerp(
        finaleTextRef.current.material.opacity,
        finaleOpacity,
        0.15
      );
    }
  });

  return (
    <group ref={textGroupRef}>
      {/* Scene 1: "CORVETTE" physically behind car chassis (occluded by roof/hood) */}
      <Text
        ref={corvetteTextRef}
        position={[0, 1.25, 1.8]} // Behind the car (since car faces -Z, +Z is behind)
        rotation={[0, 0, 0]}
        fontSize={1.75}
        letterSpacing={0.15}
        color="#f2f2f7"
        anchorX="center"
        anchorY="middle"
        renderOrder={1}
      >
        CORVETTE
        <meshBasicMaterial
          attach="material"
          transparent
          opacity={0}
          depthWrite={false}
          color="#f0f2f8"
        />
      </Text>

      {/* Finale Scene: "STINGRAY" architectural background title */}
      <Text
        ref={finaleTextRef}
        position={[0, 1.1, 2.2]}
        rotation={[0, 0, 0]}
        fontSize={1.9}
        letterSpacing={0.12}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        renderOrder={1}
      >
        C7 STINGRAY
        <meshBasicMaterial
          attach="material"
          transparent
          opacity={0}
          depthWrite={false}
          color="#ffffff"
        />
      </Text>
    </group>
  );
}
