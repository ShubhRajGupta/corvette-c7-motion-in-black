import React from 'react';
import { Text } from '@react-three/drei';

/**
 * GlassPartition: Smoked architectural glass showroom divider
 * Features:
 * - High-specularity dark tinted glass panels creating depth and reflections
 * - Anodized metal structural framing
 * - Subtle etched zone markings
 */
export function GlassPartition({ materials, position = [0, 1.8, 8.4], rotation = [0, Math.PI, 0] }) {
  if (!materials) return null;

  return (
    <group position={position} rotation={rotation} name="glass-showroom-partition">
      {/* 1. Heavy Metal Frame Perimeter */}
      <mesh material={materials.brushedGunmetal}>
        <boxGeometry args={[4.2, 3.4, 0.08]} />
      </mesh>

      {/* Recessed Glass Aperture - 3 Large Smoked Panes */}
      {[-1.3, 0.0, 1.3].map((gx, gi) => (
        <group key={`glass-pane-${gi}`} position={[gx, 0, 0]}>
          <mesh material={materials.smokedGlass}>
            <boxGeometry args={[1.2, 3.2, 0.02]} />
          </mesh>
          {/* Vertical Anodized Frame Divider */}
          <mesh position={[0.6, 0, 0.015]} material={materials.anodizedBlack}>
            <boxGeometry args={[0.04, 3.24, 0.06]} />
          </mesh>
        </group>
      ))}

      {/* Minimal Architectural Etching */}
      <Text
        position={[0, 1.45, 0.06]}
        fontSize={0.08}
        letterSpacing={0.2}
        color="#626a7a"
        anchorX="center"
      >
        ZONE 05 // PRIVATE ATELIER SHOWROOM
      </Text>
    </group>
  );
}
