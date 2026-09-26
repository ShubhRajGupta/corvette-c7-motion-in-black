import React from 'react';

/**
 * FloorStage: Multi-zoned architectural flooring system
 * Features:
 * - Central polished concrete staging plinth
 * - Concentric metallic guide ring inlays (radii 3.8m & 5.7m)
 * - Textured rubber runner zones
 * - Radial modular seams separating the 8 workshop bays
 * - Subtle quadrant alignment markers
 */
export function FloorStage({ materials, floorPlowMatRef }) {
  if (!materials) return null;

  return (
    <group name="studio-floor-stage" position={[0, 0, 0]}>
      {/* 1. Main Polished Concrete Staging Plinth (Radius = 4.2m, Y = 0.002) */}
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={materials.stagedFloor}>
        <circleGeometry args={[4.2, 64]} />
      </mesh>

      {/* 2. Inner Precision Metallic Staging Ring */}
      <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.floorMetallicInlay}>
        <ringGeometry args={[3.78, 3.82, 64]} />
      </mesh>

      {/* 3. Outer Precision Hairline Guide Ring */}
      <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.floorMetallicInlay}>
        <ringGeometry args={[5.68, 5.72, 64]} />
      </mesh>

      {/* 4. Textured Rubber Detailer Runner Mats (Flanking the central vehicle area) */}
      {[-2.6, 2.6].map((x, idx) => (
        <mesh
          key={`runner-${idx}`}
          position={[x, 0.0025, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          material={materials.floorRubberRunner}
        >
          <planeGeometry args={[0.8, 6.2]} />
        </mesh>
      ))}

      {/* 5. 8 Radial Architectural Seams (Dividing the circular bays) */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i * Math.PI) / 4;
        const x = Math.cos(angle) * 6.4;
        const z = Math.sin(angle) * 6.4;
        return (
          <mesh
            key={`radial-seam-${i}`}
            position={[x, 0.0028, z]}
            rotation={[-Math.PI / 2, 0, -angle + Math.PI / 2]}
            material={materials.anodizedBlack}
          >
            <planeGeometry args={[0.02, 4.2]} />
          </mesh>
        );
      })}

      {/* 6. Perimeter Wall-Base Floor LED Strip (Radius = 8.65m) */}
      <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[8.58, 8.64, 64]} />
        <meshBasicMaterial
          ref={floorPlowMatRef}
          color="#384252"
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* 7. Subtle Staging Floor Calibration Index Marks (0°, 90°, 180°, 270°) */}
      {[
        { pos: [0, 0.004, -3.95], rot: [0, 0, 0] },
        { pos: [3.95, 0.004, 0], rot: [0, -Math.PI / 2, 0] },
        { pos: [0, 0.004, 3.95], rot: [0, Math.PI, 0] },
        { pos: [-3.95, 0.004, 0], rot: [0, Math.PI / 2, 0] },
      ].map((mark, i) => (
        <group key={`cal-mark-${i}`} position={mark.pos} rotation={mark.rot}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.25, 0.015]} />
            <meshBasicMaterial color="#505868" transparent opacity={0.65} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
