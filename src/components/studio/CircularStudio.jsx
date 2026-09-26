import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

/**
 * CircularStudio: 360-degree architectural modification and detailing atelier
 * surrounding the Chevrolet Corvette C7 at (0, 0, 0).
 *
 * Designed with:
 * - Cylindrical/polygonal dark architectural envelope (matte charcoal, graphite, dark concrete)
 * - Overhead geometric luminaire canopy (nested hexagons, longitudinal reflection blades, perimeter halo)
 * - 360° detailing bay silhouettes (forged wheel display, carbon aero bench, dispenser atelier, tool shadow board)
 * - Controlled circular floor with concentric staging inlays and quadrant calibration marks
 * - Architectural curved frieze typography
 * - Dynamic lighting choreography synchronized with scroll timeline
 */
export function CircularStudio({ timelineProgress, currentSpec }) {
  const canopyMatRef = useRef();
  const canopyCrimsonMatRef = useRef();
  const pillarLedMatRef = useRef();
  const floorPlowMatRef = useRef();

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

    // Radial spokes connecting inner and outer hexagon vertices
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

  // 3. 8 Architectural Structural Columns positioned around perimeter (Radius = 8.5m)
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

  // 4. Subtle Environmental Perimeter Lettering Plaques
  const friezeText = useMemo(() => [
    { text: 'CORVETTE C7', angle: -Math.PI / 2, radius: 8.4 },
    { text: 'MODIFICATION ATELIER', angle: 0, radius: 8.4 },
    { text: '360° CINEMATIC STAGE', angle: Math.PI / 2, radius: 8.4 },
    { text: 'HYDROFORMED ALUMINUM', angle: Math.PI, radius: 8.4 },
  ], []);

  // 5. Dynamic Lighting & Canopy Animation Frame
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

  return (
    <group name="circular-modification-studio" position={[0, 0, 0]}>
      {/* =========================================================================
          1. CONTROLLED POLISHED CONCRETE STAGING FLOOR & CIRCULAR INLAYS
          ========================================================================= */}
      {/* Central circular staging plinth (slightly elevated 1.5cm above base ground) */}
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[4.2, 64]} />
        <meshStandardMaterial
          color="#0a0b0e"
          roughness={0.62}
          metalness={0.32}
          envMapIntensity={0.65}
        />
      </mesh>

      {/* Inner Precision Metallic Staging Ring */}
      <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.78, 3.82, 64]} />
        <meshStandardMaterial
          color="#2a2e36"
          roughness={0.35}
          metalness={0.85}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Outer Precision Hairline Guide Ring */}
      <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5.68, 5.72, 64]} />
        <meshStandardMaterial
          color="#1c1f26"
          roughness={0.4}
          metalness={0.75}
        />
      </mesh>

      {/* Perimeter Wall Base Floor LED Strip (Radius = 8.65m) */}
      <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[8.58, 8.64, 64]} />
        <meshBasicMaterial
          ref={floorPlowMatRef}
          color="#384252"
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Subtle Staging Floor Calibration Index Marks (0°, 90°, 180°, 270°) */}
      {[
        { pos: [0, 0.004, -3.95], rot: [0, 0, 0], label: '000° // FRONT' },
        { pos: [3.95, 0.004, 0], rot: [0, -Math.PI / 2, 0], label: '090° // STARBOARD' },
        { pos: [0, 0.004, 3.95], rot: [0, Math.PI, 0], label: '180° // AFT' },
        { pos: [-3.95, 0.004, 0], rot: [0, Math.PI / 2, 0], label: '270° // PORT' },
      ].map((mark, i) => (
        <group key={`cal-mark-${i}`} position={mark.pos} rotation={mark.rot}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.25, 0.015]} />
            <meshBasicMaterial color="#404652" transparent opacity={0.6} />
          </mesh>
        </group>
      ))}

      {/* =========================================================================
          2. CYLINDRICAL ARCHITECTURAL PERIMETER ENCLOSURE
          ========================================================================= */}
      {/* 16-sided dark architectural cylinder (Radius = 8.8m, Height = 5.2m) */}
      <mesh position={[0, 2.6, 0]}>
        <cylinderGeometry args={[8.8, 8.8, 5.2, 32, 1, true]} />
        <meshStandardMaterial
          color="#07080a"
          roughness={0.88}
          metalness={0.12}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Lower Perimeter Acoustic Slat Wainscot (Height = 1.4m) */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[8.72, 8.72, 1.4, 32, 1, true]} />
        <meshStandardMaterial
          color="#0d0e12"
          roughness={0.78}
          metalness={0.2}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Upper Architectural Frieze Band (Height = 0.5m at Y = 3.6m) */}
      <mesh position={[0, 3.6, 0]}>
        <cylinderGeometry args={[8.68, 8.68, 0.5, 32, 1, true]} />
        <meshStandardMaterial
          color="#0e1015"
          roughness={0.65}
          metalness={0.35}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Curved Architectural Frieze Spaced Typography */}
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

      {/* =========================================================================
          3. 8 STRUCTURAL GRAPHITE PILASTERS WITH RECESSED VERTICAL LED STRIPS
          ========================================================================= */}
      {columns.map((col) => (
        <group
          key={col.id}
          position={[col.x, 2.6, col.z]}
          rotation={[0, -col.angle + Math.PI / 2, 0]}
        >
          {/* Main Dark Graphite Pillar Body */}
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.35, 5.2, 0.28]} />
            <meshStandardMaterial
              color="#101217"
              roughness={0.45}
              metalness={0.65}
            />
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

      {/* =========================================================================
          4. 360° DETAILING & MODIFICATION ATELIER SILHOUETTES
          ========================================================================= */}
      {/* BAY A: Precision Forged Wheel Display Rack (Radial Angle ~ -110°) */}
      <group position={[-7.8, 1.35, -2.8]} rotation={[0, 0.35, 0]}>
        {/* Floating Dark Wall Backplate */}
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[3.2, 1.8, 0.08]} />
          <meshStandardMaterial color="#0c0d11" roughness={0.7} metalness={0.3} />
        </mesh>
        {/* Minimalist Floating Tool Credenza */}
        <mesh position={[0, -0.9, 0.3]}>
          <boxGeometry args={[3.2, 0.35, 0.65]} />
          <meshStandardMaterial color="#121419" roughness={0.5} metalness={0.5} />
        </mesh>
        {/* 3 Forged Wheel Rims Mounted on Dark Stems */}
        {[-0.95, 0.0, 0.95].map((xOffset, i) => (
          <group key={`wheel-rack-${i}`} position={[xOffset, 0.15, 0.2]}>
            {/* Outer Rim Torus */}
            <mesh rotation={[0, 0, 0]}>
              <torusGeometry args={[0.42, 0.035, 12, 28]} />
              <meshStandardMaterial color="#1a1c22" roughness={0.25} metalness={0.88} />
            </mesh>
            {/* Wheel Hub & Spokes Silhouette */}
            <mesh>
              <cylinderGeometry args={[0.1, 0.1, 0.06, 12]} />
              <meshStandardMaterial color="#252830" roughness={0.3} metalness={0.8} />
            </mesh>
          </group>
        ))}
        {/* Atelier Rack Label */}
        <Text
          position={[0, 0.72, 0.02]}
          fontSize={0.09}
          letterSpacing={0.18}
          color="#424754"
          anchorX="center"
        >
          FORGED MONOBLOCK MATRIX // WHEEL ATELIER
        </Text>
      </group>

      {/* BAY B: Carbon Aero & Aerodynamic Fabrication Bench (Radial Angle ~ 45°) */}
      <group position={[5.8, 1.25, 5.2]} rotation={[0, -2.4, 0]}>
        {/* Wall Calibration Grid Backplate */}
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[3.4, 2.0, 0.06]} />
          <meshStandardMaterial color="#0b0c10" roughness={0.8} metalness={0.2} />
        </mesh>
        {/* Floating Composite Fabrication Table */}
        <mesh position={[0, -0.85, 0.35]}>
          <boxGeometry args={[3.0, 0.3, 0.75]} />
          <meshStandardMaterial color="#13151a" roughness={0.5} metalness={0.4} />
        </mesh>
        {/* Carbon Fiber Splitter / Wing Component Silhouette */}
        <mesh position={[0, -0.65, 0.35]} rotation={[0.08, 0, 0]}>
          <boxGeometry args={[2.2, 0.04, 0.42]} />
          <meshStandardMaterial color="#090a0d" roughness={0.15} metalness={0.4} />
        </mesh>
        {/* Aero Calibration Label */}
        <Text
          position={[0, 0.85, 0.02]}
          fontSize={0.09}
          letterSpacing={0.18}
          color="#424754"
          anchorX="center"
        >
          AERODYNAMIC CALIBRATION // CARBON COMPOSITE BENCH
        </Text>
      </group>

      {/* BAY C: Detailing Dispenser Atelier & Fluted Acrylic Wall (Radial Angle ~ 135°) */}
      <group position={[-5.6, 1.3, 5.5]} rotation={[0, 2.4, 0]}>
        {/* Backlit Vertical Fluted Acrylic Panel */}
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[3.2, 2.2, 0.05]} />
          <meshPhysicalMaterial
            color="#141820"
            roughness={0.22}
            transmission={0.75}
            transparent
            opacity={0.65}
          />
        </mesh>
        {/* Floating Frosted Glass Shelves */}
        {[-0.3, 0.25, 0.8].map((yOffset, idx) => (
          <mesh key={`detailing-shelf-${idx}`} position={[0, yOffset, 0.15]}>
            <boxGeometry args={[2.8, 0.025, 0.32]} />
            <meshStandardMaterial color="#2a2e38" roughness={0.2} metalness={0.7} />
          </mesh>
        ))}
        {/* Minimalist Detailing Compound Flask Silhouettes on Shelves */}
        {[-0.8, -0.3, 0.3, 0.8].map((xOff, i) => (
          <mesh key={`flask-${i}`} position={[xOff, 0.38, 0.15]}>
            <cylinderGeometry args={[0.065, 0.065, 0.22, 12]} />
            <meshStandardMaterial color="#08090b" roughness={0.1} metalness={0.3} />
          </mesh>
        ))}
        {/* Atelier Label */}
        <Text
          position={[0, 0.95, 0.02]}
          fontSize={0.09}
          letterSpacing={0.18}
          color="#424754"
          anchorX="center"
        >
          CERAMIC CURATION // DETAILING ATELIER
        </Text>
      </group>

      {/* BAY D: Wall-Mounted Precision Shadow Board & Torque Wall (Radial Angle ~ -20°) */}
      <group position={[7.8, 1.4, -2.6]} rotation={[0, -1.9, 0]}>
        {/* Acoustic Pegboard Panel */}
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[3.0, 2.0, 0.06]} />
          <meshStandardMaterial color="#0c0d11" roughness={0.75} metalness={0.2} />
        </mesh>
        {/* Floating Polisher & Tool Cradle */}
        <mesh position={[0, -0.85, 0.25]}>
          <boxGeometry args={[2.8, 0.32, 0.55]} />
          <meshStandardMaterial color="#111318" roughness={0.45} metalness={0.5} />
        </mesh>
        {/* Precision Torque Wrench Silhouettes */}
        {[-0.7, 0.0, 0.7].map((xOff, idx) => (
          <mesh key={`tool-${idx}`} position={[xOff, 0.2, 0.02]} rotation={[0, 0, 0.4]}>
            <boxGeometry args={[0.04, 0.65, 0.03]} />
            <meshStandardMaterial color="#1c1f26" roughness={0.3} metalness={0.8} />
          </mesh>
        ))}
        {/* Shadow Board Label */}
        <Text
          position={[0, 0.85, 0.02]}
          fontSize={0.09}
          letterSpacing={0.18}
          color="#424754"
          anchorX="center"
        >
          PRECISION CHASSIS CALIBRATION // TOOL MATRIX
        </Text>
      </group>

      {/* =========================================================================
          5. OVERHEAD GEOMETRIC ARCHITECTURAL LUMINAIRE CANOPY
          ========================================================================= */}
      {/* 5A. Inner Hexagon Segments (Radius = 2.3m, Y = 4.25m) */}
      {innerHexSegments.map((seg, idx) => (
        <group key={`in-hex-${idx}`} position={seg.midpoint} rotation={[0, -seg.angle, 0]}>
          {/* Dark Luminaire Housing Extrusion */}
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[seg.length, 0.06, 0.12]} />
            <meshStandardMaterial color="#0b0c10" roughness={0.5} metalness={0.6} />
          </mesh>
          {/* Downward Emissive Light Diffuser Face */}
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

      {/* 5B. Outer Hexagon Segments (Radius = 4.1m, Y = 4.25m) */}
      {outerHexSegments.map((seg, idx) => (
        <group key={`out-hex-${idx}`} position={seg.midpoint} rotation={[0, -seg.angle, 0]}>
          {/* Dark Luminaire Housing Extrusion */}
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[seg.length, 0.06, 0.12]} />
            <meshStandardMaterial color="#0b0c10" roughness={0.5} metalness={0.6} />
          </mesh>
          {/* Downward Emissive Light Diffuser Face */}
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

      {/* 5C. Radial Spoke Batons Connecting Inner & Outer Hexagons */}
      {radialSpokes.map((spoke, idx) => (
        <group key={`spoke-${idx}`} position={spoke.midpoint} rotation={[0, -spoke.angle + Math.PI / 2, 0]}>
          <mesh position={[0, 0.01, 0]}>
            <boxGeometry args={[0.08, 0.04, spoke.length]} />
            <meshStandardMaterial color="#111318" roughness={0.6} metalness={0.5} />
          </mesh>
        </group>
      ))}

      {/* 5D. 4 Longitudinal Continuous Light Blades (Sweeps razor highlights down hood & doors) */}
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

      {/* 5E. Rear Crimson Overhead Luminaire (Harmonizes with quad exhaust & rear chapter) */}
      <mesh position={[0, 4.22, 2.6]} scale={[2.8, 0.04, 0.1]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial
          ref={canopyCrimsonMatRef}
          color="#e0141f"
          transparent
          opacity={0.0}
        />
      </mesh>

      {/* 5F. Peripheral Concentric Circular Halo Ring (Radius = 6.6m, Y = 4.15m) */}
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
