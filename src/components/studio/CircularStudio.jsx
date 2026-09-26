import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { createStudioMaterials } from './materials/studioMaterials';
import { WallBay } from './components/WallBay';
import { FloorStage } from './components/FloorStage';
import { CeilingTruss } from './components/CeilingTruss';
import { WheelDisplay } from './components/WheelDisplay';
import { ToolStation } from './components/ToolStation';
import { DetailingBay } from './components/DetailingBay';
import { AeroWorkbench } from './components/AeroWorkbench';
import { GlassPartition } from './components/GlassPartition';

/**
 * CircularStudio: 360-degree architectural modification and detailing atelier
 * surrounding the Chevrolet Corvette C7 at (0, 0, 0).
 *
 * Built with the Environmental Texture & Component Pack System:
 * - Controlled luminance ladder (dark concrete, graphite, charcoal, brushed gunmetal, smoked glass)
 * - PBR material realism (roughness variation, bump grain, 2x2 carbon weave, perforated pegboard, tire rubber)
 * - Modular architectural components (WallBay, FloorStage, CeilingTruss, GlassPartition)
 * - 4 dedicated workshop atelier bays (WheelDisplay, ToolStation, DetailingBay, AeroWorkbench)
 * - Dynamic lighting choreography following the 360° scroll camera
 */
export function CircularStudio({ timelineProgress, currentSpec }) {
  const canopyMatRef = useRef();
  const canopyCrimsonMatRef = useRef();
  const pillarLedMatRef = useRef();
  const floorPlowMatRef = useRef();

  // Instantiate curated PBR material library with procedural micro-textures
  const materials = useMemo(() => createStudioMaterials(), []);

  // Dynamic Lighting & Canopy Animation Frame
  useFrame(() => {
    const p = timelineProgress;

    // Base Canopy Illumination Modulation:
    // 0.00 -> 0.08: Waking up from nocturnal darkness (0.2 -> 0.85)
    // 0.08 -> 0.35: Crisp white detailing illumination (~0.92)
    // 0.35 -> 0.50: Side profile reflection sweep (~0.95)
    // 0.50 -> 0.62: Focused beam for headlight dive (~0.75)
    // 0.65 -> 0.76: Powertrain inspection (~0.88)
    // 0.76 -> 0.88: Rear exhaust scene (~0.80)
    // 0.88 -> 0.94: PAUSE SCENE (Room recedes into deep black photographic silence, opacity ~ 0.15)
    // 0.94 -> 1.00: Final establishing stance (~0.85)
    let canopyIntensity = 0.88;
    if (p < 0.08) {
      canopyIntensity = 0.2 + (p / 0.08) * 0.68;
    } else if (p >= 0.88 && p <= 0.94) {
      canopyIntensity = 0.12; // Crystalline silence
    } else if (p > 0.94) {
      canopyIntensity = 0.12 + ((p - 0.94) / 0.06) * 0.73;
    }

    if (canopyMatRef.current) {
      canopyMatRef.current.opacity = THREE.MathUtils.lerp(
        canopyMatRef.current.opacity,
        canopyIntensity,
        0.1
      );
    }

    // Rear crimson harmony for rear canopy segment
    if (canopyCrimsonMatRef.current) {
      let crimsonOpacity = 0.0;
      if (p >= 0.74 && p <= 0.88) {
        crimsonOpacity = Math.sin(((p - 0.74) / 0.14) * Math.PI) * 0.85;
      }
      canopyCrimsonMatRef.current.opacity = THREE.MathUtils.lerp(
        canopyCrimsonMatRef.current.opacity,
        crimsonOpacity,
        0.1
      );
      const targetColor = currentSpec?.ambient?.floorGlow || '#e0141f';
      canopyCrimsonMatRef.current.color.lerp(new THREE.Color(targetColor), 0.08);
    }

    // Pillar vertical LED blades
    if (pillarLedMatRef.current) {
      let pillarOpacity = 0.45;
      if (p >= 0.88 && p <= 0.94) {
        pillarOpacity = 0.05;
      }
      pillarLedMatRef.current.opacity = THREE.MathUtils.lerp(
        pillarLedMatRef.current.opacity,
        pillarOpacity,
        0.1
      );
    }

    // Floor edge plinth LED ring
    if (floorPlowMatRef.current) {
      let floorPlowOpacity = 0.35;
      if (p >= 0.88 && p <= 0.94) {
        floorPlowOpacity = 0.04;
      }
      floorPlowMatRef.current.opacity = THREE.MathUtils.lerp(
        floorPlowMatRef.current.opacity,
        floorPlowOpacity,
        0.1
      );
    }
  });

  if (!materials) return null;

  return (
    <group name="circular-modification-studio" position={[0, 0, 0]}>
      {/* 1. Multi-zoned Polished Concrete Staging Floor & Inlays */}
      <FloorStage materials={materials} floorPlowMatRef={floorPlowMatRef} />

      {/* 2. Cylindrical Faceted Architecture, Acoustic Slats & Graphite Pilasters */}
      <WallBay materials={materials} pillarLedMatRef={pillarLedMatRef} />

      {/* 3. Overhead Structural Truss & Geometric Luminaire Canopy */}
      <CeilingTruss
        materials={materials}
        canopyMatRef={canopyMatRef}
        canopyCrimsonMatRef={canopyCrimsonMatRef}
      />

      {/* 4. Atelier Bay A: Forged Wheel Display, Rotors, Calipers & Tire Stacks (Port / Front-Left) */}
      <WheelDisplay materials={materials} position={[-7.8, 1.35, -2.8]} rotation={[0, 0.35, 0]} />

      {/* 5. Atelier Bay B: Precision Chassis Calibration & Tool Wall (Starboard / Front-Right) */}
      <ToolStation materials={materials} position={[7.8, 1.4, -2.6]} rotation={[0, -1.9, 0]} />

      {/* 6. Atelier Bay C: Fluted Ceramic Detailing Atelier & Smoked Glass Shelving (Port / Rear-Left) */}
      <DetailingBay materials={materials} position={[-5.6, 1.3, 5.5]} rotation={[0, 2.4, 0]} />

      {/* 7. Atelier Bay D: Carbon Aero Splitter Fabrication Bench & Laser Jig (Starboard / Rear-Right) */}
      <AeroWorkbench materials={materials} position={[5.8, 1.25, 5.2]} rotation={[0, -2.4, 0]} />

      {/* 8. Smoked Glass Showroom Partition (Direct Rear Aft) */}
      <GlassPartition materials={materials} position={[0, 1.8, 8.4]} rotation={[0, Math.PI, 0]} />

      {/* 9. Additional Environmental Corner Dressing: Secondary Tire Staging Stack */}
      <group position={[-6.8, 0.32, -4.5]} rotation={[0, 0.4, 0]}>
        {[0, 0.24].map((ty, ti) => (
          <mesh key={`corner-tire-${ti}`} position={[0, ty, 0]} material={materials.tireRubber}>
            <cylinderGeometry args={[0.45, 0.45, 0.22, 24]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
