import * as THREE from 'three';

/**
 * CINEMATIC CAMERA VOCABULARY & SHOT PRIMITIVES
 *
 * Comprehensive grammatical building blocks for the Virtual Automotive Cinematographer.
 * Combines independent cinematic dimensions:
 *   DISTANCE x HEIGHT x AZIMUTH x LENS x TRAJECTORY x TARGET x DURATION x ENERGY
 * generating thousands of unique, visually authored compositions around the Corvette C7.
 */

// =============================================================================
// 1. DISTANCE TIERS
// =============================================================================
export const DISTANCE_TIERS = {
  EXTREME_MACRO: {
    id: 'EXTREME_MACRO',
    name: 'Macro Proximity',
    radiusRange: [1.85, 2.35],
    defaultFovRange: [15, 22],
    speedMultiplier: 0.45,
    intimacyScore: 1.0,
  },
  CLOSE: {
    id: 'CLOSE',
    name: 'Close Portrait',
    radiusRange: [2.40, 3.15],
    defaultFovRange: [22, 30],
    speedMultiplier: 0.65,
    intimacyScore: 0.75,
  },
  MEDIUM: {
    id: 'MEDIUM',
    name: 'Medium Stance',
    radiusRange: [3.25, 4.45],
    defaultFovRange: [32, 40],
    speedMultiplier: 0.85,
    intimacyScore: 0.45,
  },
  WIDE: {
    id: 'WIDE',
    name: 'Wide Composition',
    radiusRange: [4.60, 6.20],
    defaultFovRange: [40, 50],
    speedMultiplier: 1.0,
    intimacyScore: 0.20,
  },
  EXTREME_WIDE: {
    id: 'EXTREME_WIDE',
    name: 'Environmental Architecture',
    radiusRange: [6.50, 9.20],
    defaultFovRange: [48, 56],
    speedMultiplier: 0.90,
    intimacyScore: 0.05,
  },
};

// =============================================================================
// 2. HEIGHT TIERS (Y axis in meters; studio floor is Y = 0.0)
// =============================================================================
export const HEIGHT_TIERS = {
  GROUND_SKIMMER: {
    id: 'GROUND_SKIMMER',
    name: 'Ground Skimmer',
    yRange: [0.18, 0.28],
    preferredAngles: ['FRONT_CENTER', 'FRONT_34_L', 'FRONT_34_R', 'REAR_CENTER', 'REAR_34_L', 'REAR_34_R'],
    dramaticScore: 0.95,
  },
  WHEEL_LEVEL: {
    id: 'WHEEL_LEVEL',
    name: 'Wheel Axle Level',
    yRange: [0.30, 0.45],
    preferredAngles: ['SIDE_PROFILE_L', 'SIDE_PROFILE_R', 'FRONT_34_L', 'REAR_34_R'],
    dramaticScore: 0.75,
  },
  BUMPER_LEVEL: {
    id: 'BUMPER_LEVEL',
    name: 'Bumper Level',
    yRange: [0.46, 0.62],
    preferredAngles: ['FRONT_CENTER', 'REAR_CENTER', 'FRONT_34_L', 'FRONT_34_R'],
    dramaticScore: 0.65,
  },
  WAIST_LEVEL: {
    id: 'WAIST_LEVEL',
    name: 'Beltline & Waist',
    yRange: [0.65, 0.88],
    preferredAngles: ['SIDE_PROFILE_L', 'SIDE_PROFILE_R', 'FRONT_34_L', 'REAR_34_L'],
    dramaticScore: 0.50,
  },
  HOOD_LEVEL: {
    id: 'HOOD_LEVEL',
    name: 'Hood Level',
    yRange: [0.90, 1.20],
    preferredAngles: ['FRONT_CENTER', 'FRONT_34_L', 'FRONT_34_R'],
    dramaticScore: 0.55,
  },
  ROOF_LEVEL: {
    id: 'ROOF_LEVEL',
    name: 'Roof Crown Grazing',
    yRange: [1.25, 1.65],
    preferredAngles: ['FRONT_34_L', 'REAR_34_R', 'SIDE_PROFILE_L'],
    dramaticScore: 0.60,
  },
  ELEVATED_CRANE: {
    id: 'ELEVATED_CRANE',
    name: 'Elevated Studio Crane',
    yRange: [1.75, 2.50],
    preferredAngles: ['FRONT_34_L', 'FRONT_34_R', 'REAR_34_L', 'REAR_34_R'],
    dramaticScore: 0.80,
  },
  HIGH_OVERHEAD: {
    id: 'HIGH_OVERHEAD',
    name: 'Overhead Architectural View',
    yRange: [2.70, 3.80],
    preferredAngles: ['CHASSIS_OVERHEAD', 'FRONT_34_L', 'REAR_34_R'],
    dramaticScore: 0.90,
  },
};

// =============================================================================
// 3. HORIZONTAL AZIMUTHS (Angle around car in radians; negative Z = front, positive Z = rear)
// =============================================================================
export const AZIMUTH_SECTORS = {
  FRONT_CENTER: {
    id: 'FRONT_CENTER',
    name: 'Direct Frontal Facade',
    angleRad: -Math.PI / 2, // -Z axis (0.0, 0.0, -R)
    jitterRad: 0.08,
    isSymmetrical: true,
  },
  FRONT_34_L: {
    id: 'FRONT_34_L',
    name: 'Driver Front Three-Quarter',
    angleRad: -Math.PI / 2 - 0.72, // driver front
    jitterRad: 0.15,
    isSymmetrical: false,
  },
  FRONT_34_R: {
    id: 'FRONT_34_R',
    name: 'Passenger Front Three-Quarter',
    angleRad: -Math.PI / 2 + 0.72, // passenger front
    jitterRad: 0.15,
    isSymmetrical: false,
  },
  FRONT_OBLIQUE_L: {
    id: 'FRONT_OBLIQUE_L',
    name: 'Driver Front Oblique',
    angleRad: -Math.PI / 2 - 0.35,
    jitterRad: 0.12,
    isSymmetrical: false,
  },
  FRONT_OBLIQUE_R: {
    id: 'FRONT_OBLIQUE_R',
    name: 'Passenger Front Oblique',
    angleRad: -Math.PI / 2 + 0.35,
    jitterRad: 0.12,
    isSymmetrical: false,
  },
  SIDE_PROFILE_L: {
    id: 'SIDE_PROFILE_L',
    name: 'Driver Side Profile Stance',
    angleRad: -Math.PI, // -X axis
    jitterRad: 0.10,
    isSymmetrical: false,
  },
  SIDE_PROFILE_R: {
    id: 'SIDE_PROFILE_R',
    name: 'Passenger Side Profile Stance',
    angleRad: 0.0, // +X axis
    jitterRad: 0.10,
    isSymmetrical: false,
  },
  REAR_34_L: {
    id: 'REAR_34_L',
    name: 'Driver Rear Three-Quarter',
    angleRad: Math.PI / 2 + 0.68,
    jitterRad: 0.15,
    isSymmetrical: false,
  },
  REAR_34_R: {
    id: 'REAR_34_R',
    name: 'Passenger Rear Three-Quarter',
    angleRad: Math.PI / 2 - 0.68,
    jitterRad: 0.15,
    isSymmetrical: false,
  },
  REAR_OBLIQUE_L: {
    id: 'REAR_OBLIQUE_L',
    name: 'Driver Rear Oblique',
    angleRad: Math.PI / 2 + 0.32,
    jitterRad: 0.12,
    isSymmetrical: false,
  },
  REAR_OBLIQUE_R: {
    id: 'REAR_OBLIQUE_R',
    name: 'Passenger Rear Oblique',
    angleRad: Math.PI / 2 - 0.32,
    jitterRad: 0.12,
    isSymmetrical: false,
  },
  REAR_CENTER: {
    id: 'REAR_CENTER',
    name: 'Direct Symmetrical Rear',
    angleRad: Math.PI / 2, // +Z axis (0.0, 0.0, +R)
    jitterRad: 0.08,
    isSymmetrical: true,
  },
};

// =============================================================================
// 4. LENS FAMILIES (Perceived focal length and dynamic perspective)
// =============================================================================
export const LENS_FAMILIES = {
  ULTRA_WIDE_20MM: {
    id: 'ULTRA_WIDE_20MM',
    name: '20mm Ultra-Wide',
    focalLengthMm: 20,
    fov: 68,
    depthCharacter: 'Exaggerated environmental depth and architectural expansion',
    category: 'WIDE',
  },
  WIDE_24MM: {
    id: 'WIDE_24MM',
    name: '24mm Prime',
    focalLengthMm: 24,
    fov: 58,
    depthCharacter: 'Cinematic wide with subtle foreground perspective drama',
    category: 'WIDE',
  },
  DOCUMENTARY_28MM: {
    id: 'DOCUMENTARY_28MM',
    name: '28mm Documentary',
    focalLengthMm: 28,
    fov: 50,
    depthCharacter: 'Dynamic automotive journalism stance',
    category: 'WIDE',
  },
  STREET_35MM: {
    id: 'STREET_35MM',
    name: '35mm Classic',
    focalLengthMm: 35,
    fov: 42,
    depthCharacter: 'Balanced natural perspective with environmental context',
    category: 'NORMAL',
  },
  STANDARD_50MM: {
    id: 'STANDARD_50MM',
    name: '50mm High-Speed Prime',
    focalLengthMm: 50,
    fov: 32,
    depthCharacter: 'True human eye fidelity and zero geometric distortion',
    category: 'NORMAL',
  },
  PORTRAIT_70MM: {
    id: 'PORTRAIT_70MM',
    name: '70mm Studio Portrait',
    focalLengthMm: 70,
    fov: 24,
    depthCharacter: 'Subtle compression sculpting fender muscles and roofline',
    category: 'TELEPHOTO',
  },
  EDITORIAL_85MM: {
    id: 'EDITORIAL_85MM',
    name: '85mm Editorial Telephoto',
    focalLengthMm: 85,
    fov: 19,
    depthCharacter: 'Tight vehicle silhouette with background compression',
    category: 'TELEPHOTO',
  },
  TELEPHOTO_105MM: {
    id: 'TELEPHOTO_105MM',
    name: '105mm Macro Prime',
    focalLengthMm: 105,
    fov: 15,
    depthCharacter: 'Extreme graphic isolation and razor-sharp focal plane',
    category: 'LONG_TELEPHOTO',
  },
  MACRO_135MM: {
    id: 'MACRO_135MM',
    name: '135mm Super-Telephoto',
    focalLengthMm: 135,
    fov: 12,
    depthCharacter: 'Intimate optical detail with flattened architectural backdrop',
    category: 'LONG_TELEPHOTO',
  },
};

// =============================================================================
// 5. LOOK-AT TARGET ANCHORS (16 distinct focal points across Corvette C7)
// =============================================================================
export const LOOK_TARGETS = {
  FRONT_BADGE: {
    id: 'FRONT_BADGE',
    name: 'Crossed-Flags Nose Emblem',
    position: new THREE.Vector3(0.0, 0.56, -1.95),
    category: 'FRONT',
    offsetAllowed: true,
  },
  HEADLIGHT_L: {
    id: 'HEADLIGHT_L',
    name: 'Driver Bi-Xenon Optics & DRL',
    position: new THREE.Vector3(-0.72, 0.68, -1.82),
    category: 'FRONT',
    offsetAllowed: false,
  },
  HEADLIGHT_R: {
    id: 'HEADLIGHT_R',
    name: 'Passenger Bi-Xenon Optics & DRL',
    position: new THREE.Vector3(0.72, 0.68, -1.82),
    category: 'FRONT',
    offsetAllowed: false,
  },
  FRONT_SPLITTER: {
    id: 'FRONT_SPLITTER',
    name: 'Carbon Aerodynamic Splitter',
    position: new THREE.Vector3(0.0, 0.28, -2.10),
    category: 'FRONT',
    offsetAllowed: true,
  },
  HOOD_EXTRACTOR: {
    id: 'HOOD_EXTRACTOR',
    name: 'Carbon Hood Extractor Scoop',
    position: new THREE.Vector3(0.0, 0.74, -1.15),
    category: 'BODY',
    offsetAllowed: true,
  },
  WHEEL_FRONT_L: {
    id: 'WHEEL_FRONT_L',
    name: 'Driver Brembo Monobloc Caliper',
    position: new THREE.Vector3(-0.92, 0.36, -1.35),
    category: 'WHEEL',
    offsetAllowed: false,
  },
  WHEEL_FRONT_R: {
    id: 'WHEEL_FRONT_R',
    name: 'Passenger Brembo Monobloc Caliper',
    position: new THREE.Vector3(0.92, 0.36, -1.35),
    category: 'WHEEL',
    offsetAllowed: false,
  },
  WHEEL_REAR_L: {
    id: 'WHEEL_REAR_L',
    name: 'Driver Rear Wheel Stance',
    position: new THREE.Vector3(-0.96, 0.38, 1.35),
    category: 'WHEEL',
    offsetAllowed: false,
  },
  WHEEL_REAR_R: {
    id: 'WHEEL_REAR_R',
    name: 'Passenger Rear Wheel Stance',
    position: new THREE.Vector3(0.96, 0.38, 1.35),
    category: 'WHEEL',
    offsetAllowed: false,
  },
  DOOR_COVE_L: {
    id: 'DOOR_COVE_L',
    name: 'Driver Sculpted Cove & Stingray',
    position: new THREE.Vector3(-0.96, 0.60, 0.10),
    category: 'BODY',
    offsetAllowed: true,
  },
  DOOR_COVE_R: {
    id: 'DOOR_COVE_R',
    name: 'Passenger Sculpted Cove & Stingray',
    position: new THREE.Vector3(0.96, 0.60, 0.10),
    category: 'BODY',
    offsetAllowed: true,
  },
  WINDSHIELD_RAKE: {
    id: 'WINDSHIELD_RAKE',
    name: 'Aerodynamic Cockpit Windshield',
    position: new THREE.Vector3(0.0, 0.95, -0.40),
    category: 'CABIN',
    offsetAllowed: true,
  },
  ROOF_CROWN: {
    id: 'ROOF_CROWN',
    name: 'Carbon Fiber Roof Panel',
    position: new THREE.Vector3(0.0, 1.22, 0.15),
    category: 'CABIN',
    offsetAllowed: true,
  },
  TAILLIGHT_L: {
    id: 'TAILLIGHT_L',
    name: 'Driver Angular Taillight Array',
    position: new THREE.Vector3(-0.65, 0.75, 2.05),
    category: 'REAR',
    offsetAllowed: false,
  },
  TAILLIGHT_R: {
    id: 'TAILLIGHT_R',
    name: 'Passenger Angular Taillight Array',
    position: new THREE.Vector3(0.65, 0.75, 2.05),
    category: 'REAR',
    offsetAllowed: false,
  },
  EXHAUST_QUAD: {
    id: 'EXHAUST_QUAD',
    name: 'Quad 4-Inch Exhaust Outlets',
    position: new THREE.Vector3(0.0, 0.38, 2.10),
    category: 'REAR',
    offsetAllowed: true,
  },
  CHASSIS_CENTER: {
    id: 'CHASSIS_CENTER',
    name: 'Vehicle Center of Mass',
    position: new THREE.Vector3(0.0, 0.55, 0.0),
    category: 'GLOBAL',
    offsetAllowed: true,
  },
};

// =============================================================================
// 6. TRAJECTORY FAMILIES (Kinematic Path Generators)
// =============================================================================
export const TRAJECTORY_FAMILIES = {
  STATIC_PHOTOGRAPH: {
    id: 'STATIC_PHOTOGRAPH',
    name: 'Static Photographic Pause',
    motionType: 'STATIC',
    supportsLensMorph: false,
    hasMicroDrift: true,
    driftRadius: 0.025,
  },
  MICRO_DRIFT: {
    id: 'MICRO_DRIFT',
    name: 'Precision Operator Micro-Drift',
    motionType: 'DRIFT',
    supportsLensMorph: false,
    hasMicroDrift: true,
    driftRadius: 0.07,
  },
  DOLLY_PUSH_IN: {
    id: 'DOLLY_PUSH_IN',
    name: 'Slow Dolly Push-In',
    motionType: 'DOLLY',
    deltaRadius: -0.85,
    supportsLensMorph: true,
  },
  DOLLY_PULL_BACK: {
    id: 'DOLLY_PULL_BACK',
    name: 'Revealing Dolly Pull-Back',
    motionType: 'DOLLY',
    deltaRadius: 1.10,
    supportsLensMorph: true,
  },
  LATERAL_TRACK: {
    id: 'LATERAL_TRACK',
    name: 'Linear Tracking Rail',
    motionType: 'TRACK',
    deltaAngleRad: 0.45,
    supportsLensMorph: false,
  },
  ORBITAL_ARC: {
    id: 'ORBITAL_ARC',
    name: 'Curved Orbital Arc',
    motionType: 'ORBIT',
    deltaAngleRad: 0.78, // ~45 to 60 degrees partial orbit
    supportsLensMorph: true,
  },
  VARIABLE_RADIUS_SPIRAL: {
    id: 'VARIABLE_RADIUS_SPIRAL',
    name: 'Variable-Radius Inward Spiral',
    motionType: 'SPIRAL',
    deltaAngleRad: 1.15,
    deltaRadius: -0.65,
    supportsLensMorph: true,
  },
  DESCENDING_CRANE: {
    id: 'DESCENDING_CRANE',
    name: 'Descending Technocrane Reveal',
    motionType: 'CRANE',
    deltaY: -1.10,
    deltaAngleRad: 0.35,
    supportsLensMorph: false,
  },
  ASCENDING_REVEAL: {
    id: 'ASCENDING_REVEAL',
    name: 'Ascending Architectural Reveal',
    motionType: 'CRANE',
    deltaY: 1.35,
    deltaRadius: 0.95,
    supportsLensMorph: false,
  },
  PARALLEL_STANCE_TRACK: {
    id: 'PARALLEL_STANCE_TRACK',
    name: 'Parallel Stance Track Along Flank',
    motionType: 'TRACK',
    deltaZ: 1.6,
    supportsLensMorph: false,
  },
  CURVED_PARABOLIC_FLIGHT: {
    id: 'CURVED_PARABOLIC_FLIGHT',
    name: 'Curved Parabolic Dolly Arc',
    motionType: 'PARABOLIC',
    deltaAngleRad: 0.55,
    deltaY: 0.40,
    supportsLensMorph: true,
  },
};

// =============================================================================
// 7. ENERGY CLASSES & DURATION PROFILES
// =============================================================================
export const ENERGY_CLASSES = {
  CALM: {
    id: 'CALM',
    name: 'Calm & Contemplative',
    durationRange: [16.0, 24.0],
    maxRollRad: 0.0,
    audioProfile: 'contemplative',
  },
  LOW: {
    id: 'LOW',
    name: 'Low Ambient Rhythm',
    durationRange: [10.0, 15.0],
    maxRollRad: 0.015,
    audioProfile: 'subtle_ambience',
  },
  MEDIUM: {
    id: 'MEDIUM',
    name: 'Medium Automotive Flow',
    durationRange: [7.0, 11.0],
    maxRollRad: 0.025,
    audioProfile: 'balanced_motion',
  },
  HIGH: {
    id: 'HIGH',
    name: 'High Kinetic Precision',
    durationRange: [5.0, 8.0],
    maxRollRad: 0.045,
    audioProfile: 'kinetic_presence',
  },
  DRAMATIC: {
    id: 'DRAMATIC',
    name: 'Dramatic Visual Punctuation',
    durationRange: [4.2, 7.2],
    maxRollRad: 0.065,
    audioProfile: 'dramatic_impact',
  },
};

// =============================================================================
// 8. RHYTHMIC PACING PATTERNS (Director Sequences)
// =============================================================================
export const PACING_PATTERNS = [
  {
    name: 'Editorial Feature Flow',
    sequence: ['WIDE', 'MEDIUM', 'CLOSE', 'EXTREME_MACRO', 'CALM_STATIC', 'MEDIUM', 'WIDE'],
    energies: ['LOW', 'MEDIUM', 'MEDIUM', 'CALM', 'CALM', 'HIGH', 'LOW'],
  },
  {
    name: 'Monumental Reveal & Study',
    sequence: ['EXTREME_WIDE', 'DESCENDING_CRANE', 'CLOSE', 'CALM_STATIC', 'PARALLEL_TRACK', 'WIDE'],
    energies: ['LOW', 'DRAMATIC', 'CALM', 'CALM', 'MEDIUM', 'LOW'],
  },
  {
    name: 'Kinetic Automotive Pulse',
    sequence: ['GROUND_SKIMMER', 'ORBITAL_ARC', 'EXTREME_MACRO', 'CALM_STATIC', 'HIGH_CRANE', 'REAR_QUAD'],
    energies: ['DRAMATIC', 'HIGH', 'CALM', 'CALM', 'MEDIUM', 'HIGH'],
  },
  {
    name: 'Photographic Salon & Pauses',
    sequence: ['CALM_STATIC', 'MICRO_DRIFT', 'CLOSE', 'CALM_STATIC', 'WIDE', 'CALM_STATIC'],
    energies: ['CALM', 'LOW', 'LOW', 'CALM', 'LOW', 'CALM'],
  },
];

// =============================================================================
// 9. STUDIO LIGHT ANCHORS (For light-aware reflection scoring)
// =============================================================================
export const STUDIO_LIGHT_SOURCES = [
  { name: 'Overhead Softbox', position: new THREE.Vector3(0, 4.5, 0), primaryReflectionAngle: 'TOP' },
  { name: 'Rear Crimson Backlight', position: new THREE.Vector3(0, 1.2, 4.8), primaryReflectionAngle: 'REAR' },
  { name: 'Front Key Softbox', position: new THREE.Vector3(2.5, 2.2, -4.0), primaryReflectionAngle: 'FRONT_34' },
  { name: 'Passenger Rim Light', position: new THREE.Vector3(5.2, 1.8, 0.5), primaryReflectionAngle: 'SIDE' },
];

// =============================================================================
// 10. COMPATIBILITY GRAMMAR (Prevents absurd or clipping combinations)
// =============================================================================
export const COMPATIBILITY_RULES = {
  EXTREME_MACRO: {
    allowedTrajectories: ['STATIC_PHOTOGRAPH', 'MICRO_DRIFT', 'DOLLY_PUSH_IN', 'DOLLY_PULL_BACK'],
    allowedLenses: ['EDITORIAL_85MM', 'TELEPHOTO_105MM', 'MACRO_135MM', 'PORTRAIT_70MM'],
    allowedTargets: ['HEADLIGHT_L', 'HEADLIGHT_R', 'WHEEL_FRONT_L', 'WHEEL_FRONT_R', 'FRONT_BADGE', 'DOOR_COVE_L', 'EXHAUST_QUAD', 'HOOD_EXTRACTOR'],
    maxRollRad: 0.02,
  },
  EXTREME_WIDE: {
    allowedTrajectories: ['ASCENDING_REVEAL', 'DESCENDING_CRANE', 'DOLLY_PULL_BACK', 'STATIC_PHOTOGRAPH', 'ORBITAL_ARC'],
    allowedLenses: ['ULTRA_WIDE_20MM', 'WIDE_24MM', 'DOCUMENTARY_28MM', 'STREET_35MM'],
    allowedTargets: ['CHASSIS_CENTER', 'WINDSHIELD_RAKE', 'ROOF_CROWN'],
    maxRollRad: 0.02,
  },
  GROUND_SKIMMER: {
    minY: 0.18,
    allowedTrajectories: ['LATERAL_TRACK', 'DOLLY_PUSH_IN', 'PARALLEL_STANCE_TRACK', 'STATIC_PHOTOGRAPH', 'MICRO_DRIFT'],
    allowedTargets: ['FRONT_SPLITTER', 'EXHAUST_QUAD', 'WHEEL_FRONT_L', 'WHEEL_REAR_L', 'FRONT_BADGE'],
  },
  HIGH_OVERHEAD: {
    maxY: 3.8,
    allowedLenses: ['DOCUMENTARY_28MM', 'STREET_35MM', 'STANDARD_50MM'],
    allowedTargets: ['CHASSIS_CENTER', 'ROOF_CROWN', 'HOOD_EXTRACTOR'],
    allowedTrajectories: ['STATIC_PHOTOGRAPH', 'DESCENDING_CRANE', 'MICRO_DRIFT'],
  },
};
