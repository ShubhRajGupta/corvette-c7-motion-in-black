import React, { useMemo } from 'react';
import * as THREE from 'three';

/**
 * CeilingTruss: Overhead architectural structural truss & geometric luminaire canopy
 * Features:
 * - Structural black metal truss beams
 * - Geometric nested hexagons
 * - 4 longitudinal reflection blades creating razor-sharp clearcoat highlights
 * - Rear crimson overhead luminaire
 * - Concentric perimeter halo ring
 */
export function CeilingTruss({ materials, canopyMatRef, canopyCrimsonMatRef }) {
  // 1. Calculate Hexagonal Geometric Canopy Segments
  const { innerHexSegments, outerHexSegments, radialSpokes } = useMemo(() => {
    const calcHexSegments = (radius, y) => {
      const segments = [];
      for (let i = 0; i < 6; i++) {
        const a1 = (i * Math.PI) / 3;
        const a2 = ((i + 1) * Math.PI) / 3;
        const p1 = new THREE.Vector3(Math.cos(a1) * radius, y, Math.sin(a1) * radius);
        const p2 = new THREE.Vector3(Math.cos(a2) * radius, y, Math.sin(a2) * radius);

        const midpoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
        const length = p1.distanceTo(p2);
        const angle = Math.atan2(p2.z - p1.z, p2.x - p1.x);

        segments.push({ midpoint, length, angle });
      }
      return segments;
    };

    const inHex = calcHexSegments(2.3, 4.25);
    const outHex = calcHexSegments(4.1, 4.25);

    const spokes = [];
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      const p1 = new THREE.Vector3(Math.cos(a) * 2.3, 4.25, Math.sin(a) * 2.3);
      const p2 = new THREE.Vector3(Math.cos(a) * 4.1, 4.25, Math.sin(a) * 4.1);
      const midpoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const length = p1.distanceTo(p2);
      const angle = a;

      spokes.push({ midpoint, length, angle });
    }

    return { innerHexSegments: inHex, outerHexSegments: outHex, radialSpokes: spokes };
  }, []);

  // 2. Longitudinal Linear Light Blades (Direct reflection instruments above car body)
  const longitudinalBlades = useMemo(() => [
    { pos: [-1.15, 4.18, 0], scale: [0.06, 0.04, 6.8] }, // Left shoulder highlight
    { pos: [-0.42, 4.30, 0], scale: [0.07, 0.04, 7.2] }, // Left hood crease & roof highlight
    { pos: [0.42, 4.30, 0], scale: [0.07, 0.04, 7.2] },  // Right hood crease & roof highlight
    { pos: [1.15, 4.18, 0], scale: [0.06, 0.04, 6.8] },  // Right shoulder highlight
  ], []);

  // 3. Structural Overhead Truss Beams (Radial supports at Y = 4.45m)
  const structuralTrusses = useMemo(() => {
    const beams = [];
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 4;
      beams.push({ angle });
    }
    return beams;
  }, []);

  return (
    <group name="ceiling-luminaire-truss">
      {/* Structural Steel I-Beams (Crossed at Y = 4.45m) */}
      {structuralTrusses.map((beam, idx) => (
        <group key={`truss-beam-${idx}`} rotation={[0, beam.angle, 0]} position={[0, 4.45, 0]}>
          <mesh material={materials.brushedGunmetal}>
            <boxGeometry args={[17.2, 0.14, 0.12]} />
          </mesh>
        </group>
      ))}

      {/* Inner Hexagon Segments */}
      {innerHexSegments.map((seg, idx) => (
        <group key={`in-hex-${idx}`} position={seg.midpoint} rotation={[0, -seg.angle, 0]}>
          <mesh position={[0, 0.02, 0]} material={materials.anodizedBlack}>
            <boxGeometry args={[seg.length, 0.06, 0.12]} />
          </mesh>
          <mesh position={[0, -0.015, 0]}>
            <boxGeometry args={[seg.length * 0.98, 0.02, 0.08]} />
            <meshBasicMaterial
              ref={idx === 0 ? canopyMatRef : undefined}
              color="#f2f6ff"
              transparent
              opacity={0.88}
            />
          </mesh>
        </group>
      ))}

      {/* Outer Hexagon Segments */}
      {outerHexSegments.map((seg, idx) => (
        <group key={`out-hex-${idx}`} position={seg.midpoint} rotation={[0, -seg.angle, 0]}>
          <mesh position={[0, 0.02, 0]} material={materials.anodizedBlack}>
            <boxGeometry args={[seg.length, 0.06, 0.12]} />
          </mesh>
          <mesh position={[0, -0.015, 0]}>
            <boxGeometry args={[seg.length * 0.98, 0.02, 0.08]} />
            <meshBasicMaterial
              color="#f2f6ff"
              transparent
              opacity={0.88}
            />
          </mesh>
        </group>
      ))}

      {/* Radial Spoke Batons */}
      {radialSpokes.map((spoke, idx) => (
        <group key={`spoke-${idx}`} position={spoke.midpoint} rotation={[0, -spoke.angle + Math.PI / 2, 0]}>
          <mesh position={[0, 0.01, 0]} material={materials.anodizedBlack}>
            <boxGeometry args={[0.08, 0.04, spoke.length]} />
          </mesh>
        </group>
      ))}

      {/* 4 Longitudinal Continuous Light Blades */}
      {longitudinalBlades.map((blade, idx) => (
        <mesh
          key={`blade-${idx}`}
          position={blade.pos}
          scale={blade.scale}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial
            color="#f5f8ff"
            transparent
            opacity={0.92}
          />
        </mesh>
      ))}

      {/* Rear Crimson Overhead Luminaire */}
      <mesh position={[0, 4.22, 2.6]} scale={[2.8, 0.04, 0.1]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial
          ref={canopyCrimsonMatRef}
          color="#e0141f"
          transparent
          opacity={0.0}
        />
      </mesh>

      {/* Peripheral Concentric Circular Halo Ring */}
      <mesh position={[0, 4.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.55, 6.62, 64]} />
        <meshBasicMaterial
          color="#dbe4f2"
          transparent
          opacity={0.65}
        />
      </mesh>
    </group>
  );
}
