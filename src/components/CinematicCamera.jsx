import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Technocrane automotive cinema flight path (dramatic elevations, ultra-low ground skimmers, macro dives)
const CAMERA_POINTS = [
  new THREE.Vector3(3.8, 2.30, -4.5),    // 0.00: High descending studio crane shot
  new THREE.Vector3(2.8, 1.20, -3.8),    // 0.10: Descending towards vehicle
  new THREE.Vector3(1.8, 0.28, -3.3),    // 0.22: Ground-skimming low-angle shot (looking UP at CORVETTE & grille)
  new THREE.Vector3(3.2, 0.82, -2.6),    // 0.32: Banking climb along passenger shoulder
  new THREE.Vector3(4.6, 0.52, 0.0),     // 0.44: Ultra-low telephoto side profile (framing red calipers & roofline)
  new THREE.Vector3(-1.22, 0.74, -2.35), // 0.54: Extreme macro dive into bi-xenon headlight projector
  new THREE.Vector3(0.35, 0.48, -2.55),  // 0.64: Whip-pan low front splitter glide
  new THREE.Vector3(3.2, 1.20, -2.7),    // 0.74: Muscular high 3/4 framing 6.2L V8 powertrain
  new THREE.Vector3(-1.8, 0.35, 3.4),    // 0.84: Ultra-low rear exhaust cannon shot (red atmospheric backlight)
  new THREE.Vector3(-2.8, 1.15, 3.1),    // 0.92: PURE FORM high-quarter beauty portrait
  new THREE.Vector3(3.6, 1.20, -3.9),    // 1.00: Grand finale establishing stance
];

// Unified continuous lookAt target trajectory
const TARGET_POINTS = [
  new THREE.Vector3(0.0, 0.55, -0.6),    // 0.00: Center front
  new THREE.Vector3(0.0, 0.58, -0.5),    // 0.10: Hood badge
  new THREE.Vector3(0.0, 0.72, -0.3),    // 0.22: Looking UPwards at hood vents and roofline
  new THREE.Vector3(0.0, 0.62, -0.2),    // 0.32: Hood muscle lines
  new THREE.Vector3(0.0, 0.50, 0.0),     // 0.44: Low side chassis center (red calipers)
  new THREE.Vector3(-0.72, 0.70, -1.85), // 0.54: Locked dead-center on driver headlight projector!
  new THREE.Vector3(0.0, 0.52, -1.4),    // 0.64: Front lower grille & badge
  new THREE.Vector3(0.0, 0.62, -0.3),    // 0.74: Engine bay center
  new THREE.Vector3(0.0, 0.42, 2.0),     // 0.84: Central quad exhaust tips & rear diffuser!
  new THREE.Vector3(0.0, 0.65, 1.3),     // 0.92: Rear quarter haunch
  new THREE.Vector3(0.0, 0.62, -0.2),    // 1.00: Full vehicle establishing center
];

// Lens focal length (FOV) and dynamic camera banking (Roll / Dutch tilt in radians)
const LENS_DATA = [
  { p: 0.00, fov: 42, roll: 0.035 },  // Descending crane roll
  { p: 0.10, fov: 38, roll: 0.020 },
  { p: 0.22, fov: 44, roll: -0.065 }, // Dynamic wide low-angle banking
  { p: 0.32, fov: 34, roll: 0.045 },  // Climbing roll
  { p: 0.44, fov: 22, roll: -0.035 }, // Telephoto side compression
  { p: 0.54, fov: 16, roll: 0.040 },  // Extreme macro telephoto
  { p: 0.64, fov: 42, roll: -0.075 }, // Wide whip glide banking
  { p: 0.74, fov: 35, roll: 0.045 },  // High angle roll
  { p: 0.84, fov: 26, roll: -0.055 }, // Low exhaust banking in red abyss
  { p: 0.92, fov: 28, roll: 0.000 },  // Level horizon photographic calm
  { p: 1.00, fov: 36, roll: 0.000 },  // Final level horizon
];

export function CinematicCamera({ timelineProgress, isExploreMode, mouseOffset }) {
  const currentTargetRef = useRef(new THREE.Vector3(0, 0.6, 0));
  const currentRollRef = useRef(0);
  const controlsRef = useRef();

  // Create smooth Catmull-Rom splines for unbroken cinematic rails
  const { cameraCurve, targetCurve } = useMemo(() => {
    return {
      cameraCurve: new THREE.CatmullRomCurve3(CAMERA_POINTS, false, 'catmullrom', 0.5),
      targetCurve: new THREE.CatmullRomCurve3(TARGET_POINTS, false, 'catmullrom', 0.5),
    };
  }, []);

  useFrame((state, delta) => {
    if (isExploreMode) {
      // In manual explore mode, OrbitControls takes full control
      return;
    }

    const { camera } = state;
    const clampedProgress = Math.max(0, Math.min(1, timelineProgress));

    // Sample continuous, seamless C1 spline points
    const rawPos = cameraCurve.getPointAt(clampedProgress);
    const rawTarget = targetCurve.getPointAt(clampedProgress);

    // Calculate lens FOV and camera banking roll
    let targetFov = LENS_DATA[0].fov;
    let targetRoll = LENS_DATA[0].roll;

    for (let i = 0; i < LENS_DATA.length - 1; i++) {
      if (clampedProgress >= LENS_DATA[i].p && clampedProgress <= LENS_DATA[i + 1].p) {
        const span = LENS_DATA[i + 1].p - LENS_DATA[i].p || 1;
        const t = (clampedProgress - LENS_DATA[i].p) / span;
        targetFov = THREE.MathUtils.lerp(LENS_DATA[i].fov, LENS_DATA[i + 1].fov, t);
        targetRoll = THREE.MathUtils.lerp(LENS_DATA[i].roll, LENS_DATA[i + 1].roll, t);
        break;
      }
    }

    // Subtle fluid cinema camera parallax from mouse
    const mx = (mouseOffset?.x || 0) * 0.12;
    const my = (mouseOffset?.y || 0) * 0.06;

    const targetPos = new THREE.Vector3(rawPos.x + mx, rawPos.y - my, rawPos.z);
    const targetLookAt = new THREE.Vector3(rawTarget.x + mx * 0.25, rawTarget.y - my * 0.15, rawTarget.z);

    // Damped camera movement with smooth physical inertia
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetPos.x, 3.8, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetPos.y, 3.8, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetPos.z, 3.8, delta);

    currentTargetRef.current.x = THREE.MathUtils.damp(currentTargetRef.current.x, targetLookAt.x, 4.5, delta);
    currentTargetRef.current.y = THREE.MathUtils.damp(currentTargetRef.current.y, targetLookAt.y, 4.5, delta);
    currentTargetRef.current.z = THREE.MathUtils.damp(currentTargetRef.current.z, targetLookAt.z, 4.5, delta);

    // Aim camera at focus target
    camera.lookAt(currentTargetRef.current);

    // Apply continuous cinematic camera banking (Dutch roll) around optical view axis
    currentRollRef.current = THREE.MathUtils.damp(currentRollRef.current, targetRoll, 3.5, delta);
    if (Math.abs(currentRollRef.current) > 0.001) {
      camera.rotateZ(currentRollRef.current);
    }

    // Lens FOV breathing
    if (Math.abs(camera.fov - targetFov) > 0.05) {
      camera.fov = THREE.MathUtils.damp(camera.fov, targetFov, 3.2, delta);
      camera.updateProjectionMatrix();
    }
  });

  return isExploreMode ? (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      minDistance={2.4}
      maxDistance={7.5}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.05} // Keep camera above ground plane
      target={[0, 0.6, 0]}
      dampingFactor={0.06}
      enableDamping
    />
  ) : null;
}
