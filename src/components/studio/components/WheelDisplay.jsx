import React from 'react';
import { Text } from '@react-three/drei';

/**
 * WheelDisplay: Precision forged wheel & tire atelier module
 * Features:
 * - Floating dark backplate with industrial stencils
 * - 3 distinct forged wheel designs (split-spoke, GT mesh, lightweight track)
 * - Drilled & slotted brake rotors with red caliper accents
 * - Competition tire stack with realistic tread texture
 * - Minimalist floating tool credenza with brushed gunmetal hardware
 */
export function WheelDisplay({ materials, position = [-7.8, 1.35, -2.8], rotation = [0, 0.35, 0] }) {
  if (!materials) return null;

  return (
    <group position={position} rotation={rotation} name="wheel-atelier-bay">
      {/* 1. Architectural Wall Backplate */}
      <mesh position={[0, 0, -0.05]} material={materials.darkCompositeWall}>
        <boxGeometry args={[3.4, 2.0, 0.08]} />
      </mesh>

      {/* Recessed Metal Frame Trim */}
      <mesh position={[0, 0, -0.01]} material={materials.brushedGunmetal}>
        <boxGeometry args={[3.44, 0.04, 0.12]} />
      </mesh>

      {/* 2. Floating Credenza / Hardware Drawers */}
      <mesh position={[0, -0.92, 0.32]} material={materials.workbenchLaminate}>
        <boxGeometry args={[3.3, 0.32, 0.65]} />
      </mesh>
      {/* Drawer Pulls (Machined Aluminum highlights) */}
      {[-1.0, 0.0, 1.0].map((x, i) => (
        <mesh key={`handle-${i}`} position={[x, -0.92, 0.66]} material={materials.machinedAluminum}>
          <boxGeometry args={[0.35, 0.02, 0.02]} />
        </mesh>
      ))}

      {/* 3. Three Forged Wheels with Slotted Brake Rotors & Red Calipers */}
      {/* Wheel 1: Lightweight Split-Spoke Track Wheel */}
      <group position={[-1.05, 0.18, 0.22]}>
        {/* Outer Rim Ring */}
        <mesh material={materials.anodizedBlack}>
          <torusGeometry args={[0.42, 0.038, 14, 32]} />
        </mesh>
        {/* Slotted Brake Rotor */}
        <mesh position={[0, 0, -0.04]} material={materials.machinedAluminum}>
          <cylinderGeometry args={[0.34, 0.34, 0.02, 24]} />
        </mesh>
        {/* Red Caliper Accent */}
        <mesh position={[0.22, 0.22, -0.02]} rotation={[0, 0, -0.78]} material={materials.accentRed}>
          <boxGeometry args={[0.16, 0.08, 0.06]} />
        </mesh>
        {/* Center Hub */}
        <mesh material={materials.machinedAluminum}>
          <cylinderGeometry args={[0.09, 0.09, 0.06, 16]} />
        </mesh>
      </group>

      {/* Wheel 2: Performance Concave Alloy Wheel */}
      <group position={[0.0, 0.18, 0.22]}>
        <mesh material={materials.brushedGunmetal}>
          <torusGeometry args={[0.44, 0.04, 14, 32]} />
        </mesh>
        <mesh position={[0, 0, -0.04]} material={materials.machinedAluminum}>
          <cylinderGeometry args={[0.35, 0.35, 0.02, 24]} />
        </mesh>
        <mesh position={[-0.24, 0.2, -0.02]} rotation={[0, 0, 0.78]} material={materials.accentRed}>
          <boxGeometry args={[0.16, 0.08, 0.06]} />
        </mesh>
        <mesh material={materials.anodizedBlack}>
          <cylinderGeometry args={[0.1, 0.1, 0.07, 16]} />
        </mesh>
      </group>

      {/* Wheel 3: Lightweight Carbon-Infused Forged Wheel */}
      <group position={[1.05, 0.18, 0.22]}>
        <mesh material={materials.carbonFiber}>
          <torusGeometry args={[0.42, 0.038, 14, 32]} />
        </mesh>
        <mesh position={[0, 0, -0.04]} material={materials.machinedAluminum}>
          <cylinderGeometry args={[0.34, 0.34, 0.02, 24]} />
        </mesh>
        <mesh position={[0.22, -0.22, -0.02]} rotation={[0, 0, 0.78]} material={materials.accentRed}>
          <boxGeometry args={[0.16, 0.08, 0.06]} />
        </mesh>
        <mesh material={materials.machinedAluminum}>
          <cylinderGeometry args={[0.09, 0.09, 0.06, 16]} />
        </mesh>
      </group>

      {/* 4. Competition Tire Stack (Ground scale reference in corner) */}
      <group position={[1.85, -0.82, 0.25]}>
        {[0, 0.24, 0.48].map((y, idx) => (
          <mesh key={`tire-${idx}`} position={[0, y, 0]} material={materials.tireRubber}>
            <cylinderGeometry args={[0.46, 0.46, 0.22, 28]} />
          </mesh>
        ))}
      </group>

      {/* 5. Restrained Industrial Decals / Stencils */}
      <Text
        position={[0, 0.82, 0.01]}
        fontSize={0.085}
        letterSpacing={0.16}
        color="#586072"
        anchorX="center"
      >
        01 BAY 02 // FORGED MONOBLOCK MATRIX
      </Text>
      <Text
        position={[-1.4, -0.58, 0.01]}
        fontSize={0.06}
        letterSpacing={0.14}
        color="#3c4250"
        anchorX="left"
      >
        OFFSET: ET+45 // 19x10J FRONT • 20x12J REAR
      </Text>
    </group>
  );
}
