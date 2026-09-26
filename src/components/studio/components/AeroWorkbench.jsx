import React from 'react';
import { Text } from '@react-three/drei';

/**
 * AeroWorkbench: Aerodynamic calibration & carbon composite modification station
 * Features:
 * - Structural wall calibration grid
 * - Heavy-duty composite fabrication table
 * - Real 2x2 twill carbon fiber front splitter component fixture
 * - Precision laser alignment cradle with red indicator
 * - Technical aerodynamic stencils
 */
export function AeroWorkbench({ materials, position = [5.8, 1.25, 5.2], rotation = [0, -2.4, 0] }) {
  if (!materials) return null;

  return (
    <group position={position} rotation={rotation} name="aero-workbench-bay">
      {/* 1. Structural Backplate */}
      <mesh position={[0, 0, -0.06]} material={materials.darkCompositeWall}>
        <boxGeometry args={[3.4, 2.2, 0.06]} />
      </mesh>

      {/* Calibration Grid Lines on Wall */}
      {[-0.6, -0.2, 0.2, 0.6].map((y, idx) => (
        <mesh key={`grid-h-${idx}`} position={[0, y, -0.02]} material={materials.anodizedBlack}>
          <boxGeometry args={[3.0, 0.008, 0.01]} />
        </mesh>
      ))}

      {/* 2. Heavy Composite Fabrication & Staging Table */}
      <group position={[0, -0.86, 0.42]}>
        {/* Tabletop Surface */}
        <mesh material={materials.workbenchLaminate}>
          <boxGeometry args={[3.1, 0.12, 0.85]} />
        </mesh>
        {/* 4 Heavy Steel Table Legs */}
        {[
          [-1.4, -0.45, -0.32],
          [1.4, -0.45, -0.32],
          [-1.4, -0.45, 0.32],
          [1.4, -0.45, 0.32],
        ].map((lp, li) => (
          <mesh key={`leg-${li}`} position={lp} material={materials.brushedGunmetal}>
            <boxGeometry args={[0.08, 0.8, 0.08]} />
          </mesh>
        ))}
      </group>

      {/* 3. Carbon Fiber Front Splitter Component on Alignment Jig */}
      <group position={[0, -0.72, 0.45]} rotation={[0.06, 0, 0]}>
        {/* Real 2x2 Twill Carbon Fiber Splitter Winglet */}
        <mesh material={materials.carbonFiber}>
          <boxGeometry args={[2.4, 0.035, 0.44]} />
        </mesh>
        {/* Left Aerodynamic Endplate */}
        <mesh position={[-1.2, 0.06, 0]} material={materials.carbonFiber}>
          <boxGeometry args={[0.025, 0.15, 0.48]} />
        </mesh>
        {/* Right Aerodynamic Endplate */}
        <mesh position={[1.2, 0.06, 0]} material={materials.carbonFiber}>
          <boxGeometry args={[0.025, 0.15, 0.48]} />
        </mesh>

        {/* Machined Metal Mounting Fixture Clamps */}
        {[-0.8, 0.0, 0.8].map((cx, ci) => (
          <mesh key={`clamp-${ci}`} position={[cx, -0.04, 0]} material={materials.machinedAluminum}>
            <boxGeometry args={[0.08, 0.06, 0.16]} />
          </mesh>
        ))}
      </group>

      {/* 4. Precision Laser Measurement Emitter Arm */}
      <group position={[1.25, 0.45, 0.15]}>
        <mesh material={materials.anodizedBlack}>
          <cylinderGeometry args={[0.025, 0.025, 0.42, 16]} />
        </mesh>
        {/* Laser Head Housing (Red Indicator Accent) */}
        <mesh position={[0, -0.22, 0.04]} material={materials.accentRed}>
          <boxGeometry args={[0.06, 0.06, 0.12]} />
        </mesh>
      </group>

      {/* 5. Aerodynamic Decal Stencils */}
      <Text
        position={[0, 0.92, 0.01]}
        fontSize={0.085}
        letterSpacing={0.16}
        color="#586072"
        anchorX="center"
      >
        04 BAY 06 // AERODYNAMIC CALIBRATION BENCH
      </Text>
      <Text
        position={[-1.35, -0.52, 0.01]}
        fontSize={0.055}
        letterSpacing={0.12}
        color="#3c4250"
        anchorX="left"
      >
        FRONT AXLE LIFT COEFFICIENT: -0.16 CL // DOWNFORCE TARGET: 136 KG
      </Text>
    </group>
  );
}
