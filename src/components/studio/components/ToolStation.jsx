import React from 'react';
import { Text } from '@react-three/drei';

/**
 * ToolStation: Precision chassis calibration & tool wall module
 * Features:
 * - Real perforated pegboard texture
 * - Organized torque wrenches, pneumatic tools with blue fittings, red rubber handles
 * - Diagnostic telemetry display screen with amber status indicator
 * - Heavy-duty modular tool chest
 * - Industrial technical stencils
 */
export function ToolStation({ materials, position = [7.8, 1.4, -2.6], rotation = [0, -1.9, 0] }) {
  if (!materials) return null;

  return (
    <group position={position} rotation={rotation} name="tool-station-bay">
      {/* 1. Structural Wall Frame & Dark Base Panel */}
      <mesh position={[0, 0, -0.06]} material={materials.darkCompositeWall}>
        <boxGeometry args={[3.2, 2.1, 0.06]} />
      </mesh>

      {/* 2. Real Perforated Pegboard Shadow Board */}
      <mesh position={[0, 0.15, -0.01]} material={materials.perforatedPegboard}>
        <boxGeometry args={[2.9, 1.5, 0.03]} />
      </mesh>

      {/* Gunmetal Outer Frame Trim */}
      <mesh position={[0, 0.15, 0.01]} material={materials.brushedGunmetal}>
        <boxGeometry args={[2.96, 1.56, 0.02]} />
      </mesh>

      {/* 3. Organized Precision Tools Mounted on Board */}
      {/* Precision Click-Type Torque Wrenches (Chrome alloy shafts + red rubber grips) */}
      {[-0.8, -0.4, 0.0, 0.4].map((x, idx) => (
        <group key={`wrench-${idx}`} position={[x, 0.35, 0.04]} rotation={[0, 0, 0.35]}>
          {/* Tool Shaft */}
          <mesh material={materials.machinedAluminum}>
            <boxGeometry args={[0.035, 0.58, 0.025]} />
          </mesh>
          {/* Ratchet Head */}
          <mesh position={[0, 0.3, 0]} material={materials.brushedGunmetal}>
            <cylinderGeometry args={[0.04, 0.04, 0.04, 16]} />
          </mesh>
          {/* Ergonomic Rubber Handle (Red Accent) */}
          <mesh position={[0, -0.18, 0]} material={materials.accentRed}>
            <cylinderGeometry args={[0.025, 0.025, 0.18, 12]} />
          </mesh>
        </group>
      ))}

      {/* Heavy Pneumatic Impact Wrench with Blue Anodized Fitting */}
      <group position={[0.95, 0.32, 0.06]} rotation={[0, 0, -0.4]}>
        <mesh material={materials.anodizedBlack}>
          <boxGeometry args={[0.18, 0.18, 0.08]} />
        </mesh>
        <mesh position={[0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.machinedAluminum}>
          <cylinderGeometry args={[0.03, 0.03, 0.12, 16]} />
        </mesh>
        {/* Blue Anodized Pneumatic Coupling Accent */}
        <mesh position={[-0.08, -0.12, 0]} material={materials.accentBlue}>
          <cylinderGeometry args={[0.02, 0.02, 0.06, 12]} />
        </mesh>
      </group>

      {/* 4. Digital Chassis Telemetry Console & Amber LED Indicator */}
      <group position={[0.85, 0.72, 0.06]}>
        {/* Console Bezel */}
        <mesh material={materials.anodizedBlack}>
          <boxGeometry args={[0.55, 0.35, 0.04]} />
        </mesh>
        {/* Smoked Screen */}
        <mesh position={[0, 0, 0.025]} material={materials.smokedGlass}>
          <planeGeometry args={[0.48, 0.28]} />
        </mesh>
        {/* Amber Diagnostic Indicator LED */}
        <mesh position={[0.22, 0.12, 0.03]} material={materials.accentAmber}>
          <circleGeometry args={[0.015, 12]} />
        </mesh>
      </group>

      {/* 5. Modular Heavy-Duty Tool Cabinet */}
      <group position={[0, -0.88, 0.32]}>
        <mesh material={materials.workbenchLaminate}>
          <boxGeometry args={[2.9, 0.36, 0.65]} />
        </mesh>
        {/* 4 Storage Drawers with Anodized Pulls */}
        {[-0.95, -0.32, 0.32, 0.95].map((x, i) => (
          <group key={`drawer-${i}`} position={[x, 0, 0.33]}>
            <mesh material={materials.darkCompositeWall}>
              <boxGeometry args={[0.58, 0.28, 0.02]} />
            </mesh>
            <mesh position={[0, 0.05, 0.02]} material={materials.machinedAluminum}>
              <boxGeometry args={[0.3, 0.015, 0.02]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 6. Technical Decals */}
      <Text
        position={[0, 0.98, 0.01]}
        fontSize={0.085}
        letterSpacing={0.16}
        color="#586072"
        anchorX="center"
      >
        02 BAY 03 // CHASSIS CALIBRATION MATRIX
      </Text>
      <Text
        position={[-1.25, -0.58, 0.01]}
        fontSize={0.055}
        letterSpacing={0.12}
        color="#3c4250"
        anchorX="left"
      >
        TORQUE SPEC: WHEEL LUGS 140 N·m // CALIPER PIN 45 N·m
      </Text>
    </group>
  );
}
