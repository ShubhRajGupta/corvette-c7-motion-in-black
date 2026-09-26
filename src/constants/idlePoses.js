import * as THREE from 'three';

/**
 * IDLE CINEMATIC CAMERA POSES
 *
 * 10 authored, professionally composed showroom film camera poses around the Corvette C7:
 * - Varied focal lengths (FOVs from 18° telephoto macro to 42° wide environmental)
 * - Diverse camera elevations (extreme ground skimmers to overhead studio crane)
 * - Carefully framed focal centers (crossed-flags badge, Brembo calipers, projector optics, quad exhaust)
 * - Subtle Dutch roll angles for dynamic automotive editorial energy
 * - Individual transit and hold timings with subtle micro-drift vectors so holds feel alive.
 */
export const IDLE_CAMERA_POSES = [
  // 1. Low Front Three-Quarter (Heroic splitter & sculpted front fender)
  {
    id: 'low-front-three-quarter',
    name: 'Low Front Three-Quarter',
    position: new THREE.Vector3(2.65, 0.42, -3.35),
    target: new THREE.Vector3(0.08, 0.50, -0.65),
    fov: 32,
    roll: 0.018,
    transitDuration: 6.2,
    holdDuration: 4.8,
    drift: new THREE.Vector3(-0.06, 0.02, 0.08),
  },

  // 2. Wheel-Level Macro Shot (Brembo 4-piston monobloc caliper & slotted rotor)
  {
    id: 'wheel-macro',
    name: 'Wheel-Level Macro',
    position: new THREE.Vector3(2.05, 0.26, -1.55),
    target: new THREE.Vector3(0.92, 0.36, -1.38),
    fov: 22,
    roll: -0.022,
    transitDuration: 5.8,
    holdDuration: 4.6,
    drift: new THREE.Vector3(-0.04, 0.015, 0.04),
  },

  // 3. Side Profile (Telephoto compression of muscular roofline & 50/50 balance)
  {
    id: 'side-profile',
    name: 'Side Profile Stance',
    position: new THREE.Vector3(4.45, 0.58, -0.05),
    target: new THREE.Vector3(0.0, 0.52, 0.0),
    fov: 23,
    roll: 0.0,
    transitDuration: 6.5,
    holdDuration: 5.2,
    drift: new THREE.Vector3(-0.07, 0.01, 0.05),
  },

  // 4. High Three-Quarter (Studio crane looking down on carbon hood scoop & roof)
  {
    id: 'high-three-quarter',
    name: 'High Three-Quarter Crane',
    position: new THREE.Vector3(3.25, 1.95, -3.05),
    target: new THREE.Vector3(0.0, 0.55, -0.35),
    fov: 35,
    roll: 0.035,
    transitDuration: 6.4,
    holdDuration: 5.0,
    drift: new THREE.Vector3(-0.06, -0.03, 0.06),
  },

  // 5. Close-Up of Headlight / Body (Bi-xenon projector lens & LED eyebrow)
  {
    id: 'headlight-macro',
    name: 'Headlight Optics Macro',
    position: new THREE.Vector3(-1.38, 0.74, -2.40),
    target: new THREE.Vector3(-0.72, 0.68, -1.82),
    fov: 18,
    roll: 0.038,
    transitDuration: 5.6,
    holdDuration: 4.5,
    drift: new THREE.Vector3(0.035, 0.015, 0.045),
  },

  // 6. Extreme Low-Angle Front (Ground skimmer looking up at crossed-flags emblem)
  {
    id: 'extreme-low-front',
    name: 'Extreme Low-Angle Front',
    position: new THREE.Vector3(0.38, 0.17, -3.55),
    target: new THREE.Vector3(0.0, 0.58, -0.80),
    fov: 38,
    roll: -0.012,
    transitDuration: 6.0,
    holdDuration: 4.8,
    drift: new THREE.Vector3(0.05, 0.02, 0.07),
  },

  // 7. Wide Environmental Hero Shot (Corvette centered in circular studio atelier)
  {
    id: 'wide-hero',
    name: 'Wide Environmental Hero',
    position: new THREE.Vector3(4.35, 1.35, -4.25),
    target: new THREE.Vector3(0.0, 0.58, -0.20),
    fov: 38,
    roll: 0.0,
    transitDuration: 6.8,
    holdDuration: 5.4,
    drift: new THREE.Vector3(-0.08, 0.02, 0.08),
  },

  // 8. Rear Three-Quarter (Sculpted haunches, diffuser & taillight architecture)
  {
    id: 'rear-three-quarter',
    name: 'Rear Three-Quarter',
    position: new THREE.Vector3(-2.85, 0.82, 3.15),
    target: new THREE.Vector3(-0.15, 0.62, 0.75),
    fov: 29,
    roll: -0.028,
    transitDuration: 6.2,
    holdDuration: 5.0,
    drift: new THREE.Vector3(0.06, -0.015, -0.06),
  },

  // 9. Rear Low-Angle (Four 4-inch exhaust outlets with underbody glow)
  {
    id: 'rear-low-angle',
    name: 'Rear Low Exhaust Cannon',
    position: new THREE.Vector3(-1.12, 0.22, 3.25),
    target: new THREE.Vector3(0.0, 0.42, 1.85),
    fov: 25,
    roll: 0.022,
    transitDuration: 5.8,
    holdDuration: 4.6,
    drift: new THREE.Vector3(0.045, 0.015, -0.055),
  },

  // 10. Slightly Elevated Top View (Architectural overhead reflections across lacquer)
  {
    id: 'elevated-top-view',
    name: 'Slightly Elevated Top View',
    position: new THREE.Vector3(-1.25, 2.72, 0.35),
    target: new THREE.Vector3(0.0, 0.55, 0.0),
    fov: 42,
    roll: 0.0,
    transitDuration: 6.6,
    holdDuration: 5.2,
    drift: new THREE.Vector3(0.05, -0.03, -0.04),
  },
];
