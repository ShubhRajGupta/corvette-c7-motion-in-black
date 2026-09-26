import React, { useMemo } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

/**
 * WallBay: Modular cylindrical architectural wall enclosure & structural pilasters
 * Features:
 * - 16-sided faceted concrete and dark composite paneling
 * - Micro-slat acoustic wainscot
 * - 8 Structural graphite pilasters with recessed vertical LED blades
 * - Curved frieze environmental architectural lettering
 */
export function WallBay({ materials, pillarLedMatRef }) {
  // 8 Architectural Structural Columns positioned around perimeter (Radius = 8.5m)
  const columns = useMemo(() => {
    const cols = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const x = Math.cos(angle) * 8.5;
      const z = Math.sin(angle) * 8.5;
      cols.push({ x, z, angle, id: `col-${i}` });
    }
    return cols;
  }, []);

  // Subtle Environmental Perimeter Lettering Plaques
  const friezeText = useMemo(() => [
    { text: 'CORVETTE C7', angle: -Math.PI / 2, radius: 8.4 },
    { text: 'MODIFICATION ATELIER', angle: 0, radius: 8.4 },
    { text: '360° CINEMATIC STAGE', angle: Math.PI / 2, radius: 8.4 },
    { text: 'HYDROFORMED ALUMINUM', angle: Math.PI, radius: 8.4 },
  ], []);

  return (
    <group name="studio-wall-enclosure">
      {/* 1. Main 16-sided dark architectural cylinder (Radius = 8.8m, Height = 5.2m) */}
      <mesh position={[0, 2.6, 0]}>
        <cylinderGeometry args={[8.8, 8.8, 5.2, 32, 1, true]} />
        <primitive object={materials.concreteWall} attach="material" side={THREE.BackSide} />
      </mesh>

      {/* 2. Lower Perimeter Acoustic Slat Wainscot (Height = 1.4m) */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[8.72, 8.72, 1.4, 32, 1, true]} />
        <primitive object={materials.acousticSlat} attach="material" side={THREE.BackSide} />
      </mesh>

      {/* 3. Upper Architectural Frieze Band (Height = 0.5m at Y = 3.6m) */}
      <mesh position={[0, 3.6, 0]}>
        <cylinderGeometry args={[8.68, 8.68, 0.5, 32, 1, true]} />
        <primitive object={materials.darkCompositeWall} attach="material" side={THREE.BackSide} />
      </mesh>

      {/* 4. Curved Architectural Frieze Spaced Typography */}
      {friezeText.map((item, idx) => (
        <Text
          key={`frieze-text-${idx}`}
          position={[
            Math.cos(item.angle) * item.radius,
            3.6,
            Math.sin(item.angle) * item.radius,
          ]}
          rotation={[0, -item.angle - Math.PI / 2, 0]}
          fontSize={0.22}
          letterSpacing={0.22}
          color="#525866"
          anchorX="center"
          anchorY="middle"
        >
          {item.text}
          <meshBasicMaterial transparent opacity={0.4} color="#525866" />
        </Text>
      ))}

      {/* 5. 8 Structural Graphite Pilasters with Recessed Vertical LED Blades */}
      {columns.map((col) => (
        <group
          key={col.id}
          position={[col.x, 2.6, col.z]}
          rotation={[0, -col.angle + Math.PI / 2, 0]}
        >
          {/* Main Dark Graphite Pillar Body */}
          <mesh position={[0, 0, 0]} castShadow material={materials.anodizedBlack}>
            <boxGeometry args={[0.35, 5.2, 0.28]} />
          </mesh>

          {/* Recessed Vertical Linear LED Blade facing inward toward vehicle */}
          <mesh position={[0, 0, 0.145]}>
            <boxGeometry args={[0.04, 4.2, 0.015]} />
            <meshBasicMaterial
              ref={pillarLedMatRef}
              color="#d0dbed"
              transparent
              opacity={0.45}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
