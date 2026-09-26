import React from 'react';
import { Text } from '@react-three/drei';

/**
 * DetailingBay: Premium automotive ceramic coating & surface atelier
 * Features:
 * - Backlit vertical fluted acrylic panel creating translucent depth
 * - Floating smoked glass shelves with brushed gunmetal brackets
 * - Precision detailing compound flasks, spray bottles, and polisher cradle
 * - Microfiber cloth stacks and negative space curation
 * - Clean atelier typography
 */
export function DetailingBay({ materials, position = [-5.6, 1.3, 5.5], rotation = [0, 2.4, 0] }) {
  if (!materials) return null;

  return (
    <group position={position} rotation={rotation} name="detailing-atelier-bay">
      {/* 1. Structural Backplate */}
      <mesh position={[0, 0, -0.07]} material={materials.darkCompositeWall}>
        <boxGeometry args={[3.2, 2.3, 0.05]} />
      </mesh>

      {/* 2. Backlit Translucent Fluted Acrylic Screen */}
      <mesh position={[0, 0, -0.02]} material={materials.flutedAcrylic}>
        <boxGeometry args={[3.0, 2.1, 0.04]} />
      </mesh>

      {/* 3. Floating Smoked Glass Shelves */}
      {[-0.35, 0.22, 0.78].map((y, idx) => (
        <group key={`shelf-${idx}`} position={[0, y, 0.16]}>
          {/* Glass Pane */}
          <mesh material={materials.smokedGlass}>
            <boxGeometry args={[2.8, 0.02, 0.36]} />
          </mesh>
          {/* Metal Shelf Edge Trim & Brackets */}
          <mesh position={[0, 0, 0.18]} material={materials.brushedGunmetal}>
            <boxGeometry args={[2.84, 0.03, 0.02]} />
          </mesh>
          {[-1.2, 1.2].map((bx, bi) => (
            <mesh key={`bracket-${bi}`} position={[bx, -0.06, -0.05]} material={materials.anodizedBlack}>
              <boxGeometry args={[0.04, 0.12, 0.26]} />
            </mesh>
          ))}
        </group>
      ))}

      {/* 4. Curated Detailing Supplies on Shelves (with Intentional Negative Space) */}
      {/* Lower Shelf (y = -0.35): Heavy Compound Flasks & Microfiber Stacks */}
      <group position={[0, -0.35, 0.16]}>
        {/* Dual-Action Rotary Polisher resting in cradle */}
        <group position={[-0.85, 0.12, 0.02]} rotation={[0, 0.2, 0]}>
          <mesh material={materials.anodizedBlack}>
            <cylinderGeometry args={[0.045, 0.045, 0.32, 16]} />
          </mesh>
          {/* Polisher Head (Red Accent) */}
          <mesh position={[0, 0.16, 0.04]} material={materials.accentRed}>
            <cylinderGeometry args={[0.075, 0.075, 0.06, 18]} />
          </mesh>
          {/* Polishing Foam Pad */}
          <mesh position={[0, 0.21, 0.04]} material={materials.workbenchLaminate}>
            <cylinderGeometry args={[0.08, 0.08, 0.03, 18]} />
          </mesh>
        </group>

        {/* Stack of Dark Microfiber Detailing Cloths */}
        <mesh position={[0.75, 0.06, 0.02]} material={materials.tireRubber}>
          <boxGeometry args={[0.26, 0.1, 0.22]} />
        </mesh>
      </group>

      {/* Middle Shelf (y = 0.22): Precision Ceramic Flasks & Atomizers */}
      <group position={[0, 0.22, 0.16]}>
        {/* 3 Staggered Precision Coating Flasks */}
        {[-0.6, -0.2, 0.45].map((fx, fi) => (
          <group key={`flask-${fi}`} position={[fx, 0.15, 0.0]}>
            <mesh material={materials.smokedGlass}>
              <cylinderGeometry args={[0.055, 0.055, 0.26, 16]} />
            </mesh>
            {/* Anodized Dispenser Pump Cap */}
            <mesh position={[0, 0.15, 0]} material={materials.machinedAluminum}>
              <cylinderGeometry args={[0.025, 0.025, 0.05, 12]} />
            </mesh>
          </group>
        ))}

        {/* High-Precision Ergonomic Spray Bottle */}
        <group position={[0.85, 0.16, 0.0]}>
          <mesh material={materials.anodizedBlack}>
            <cylinderGeometry args={[0.05, 0.05, 0.24, 16]} />
          </mesh>
          <mesh position={[0, 0.14, 0.03]} rotation={[0.2, 0, 0]} material={materials.accentBlue}>
            <boxGeometry args={[0.04, 0.06, 0.1]} />
          </mesh>
        </group>
      </group>

      {/* Top Shelf (y = 0.78): Clean Specimen Curation */}
      <group position={[0, 0.78, 0.16]}>
        {/* Single Test Specimen Glass Flask in center */}
        <mesh position={[0.0, 0.14, 0]} material={materials.smokedGlass}>
          <cylinderGeometry args={[0.065, 0.065, 0.24, 16]} />
        </mesh>
      </group>

      {/* 5. Clean Decal Stencil */}
      <Text
        position={[0, 1.05, 0.01]}
        fontSize={0.085}
        letterSpacing={0.16}
        color="#586072"
        anchorX="center"
      >
        03 BAY 05 // CERAMIC & SURFACE ATELIER
      </Text>
      <Text
        position={[-1.25, -0.65, 0.01]}
        fontSize={0.055}
        letterSpacing={0.12}
        color="#3c4250"
        anchorX="left"
      >
        HARDNESS: 9H SIO2 // CONTACT ANGLE: 112°
      </Text>
    </group>
  );
}
