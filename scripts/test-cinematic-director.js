import { CinematicDirector } from '../src/utils/cinematicDirector.js';
import * as THREE from 'three';

console.log('================================================================');
console.log('AUTONOMOUS CINEMATIC SCREENSAVER — SIMULATION & VALIDATION TEST');
console.log('================================================================\n');

const director = new CinematicDirector(42);

// Re-entry test from initial camera stance
const initialCamPos = new THREE.Vector3(3.8, 2.30, -4.5);
const initialTarget = new THREE.Vector3(0.0, 0.55, -0.6);
director.reentry(initialCamPos, initialTarget, 36, 0);

console.log('✓ Initialized CinematicDirector re-entry.');
console.log(`  First Shot Selected: ${director.currentShot?.name}`);
console.log(`  Distance Tier: ${director.currentShot?.distanceTier}`);
console.log(`  Lens Profile: ${director.currentShot?.lensProfile?.focalLengthMm}mm (${director.currentShot?.lensProfile?.name})`);
console.log(`  Target Anchor: ${director.currentShot?.targetAnchor?.name}`);
console.log(`  Trajectory: ${director.currentShot?.trajectory?.name}`);
console.log(`  Duration: ${director.currentShot?.duration?.toFixed(1)}s`);
console.log(`  Energy: ${director.currentShot?.energy}\n`);

// Simulate 60 shots (approx 15-20 minutes of idle photography)
const shotHistory = [];
const distanceCounts = {};
const lensCounts = {};
const trajectoryCounts = {};
const azimuthCounts = {};
const targetCounts = {};

let totalSimulatedSeconds = 0;
let clearanceViolations = 0;
let nanOrInfErrors = 0;
let immediateRepetitions = 0;

let lastDistance = null;
let lastAzimuth = null;
let lastTarget = null;
let lastLens = null;

const dt = 1 / 60; // 60 FPS simulation step
const targetShotsToSimulate = 100;

console.log(`Simulating ${targetShotsToSimulate} consecutive autonomous shots at 60 FPS...`);

let shotCount = 0;
let prevShotId = director.currentShot?.id;

while (shotCount < targetShotsToSimulate) {
  const output = director.update(dt);
  totalSimulatedSeconds += dt;

  // Validate output vector sanity
  if (
    !Number.isFinite(output.position.x) ||
    !Number.isFinite(output.position.y) ||
    !Number.isFinite(output.position.z) ||
    !Number.isFinite(output.target.x) ||
    !Number.isFinite(output.target.y) ||
    !Number.isFinite(output.target.z) ||
    !Number.isFinite(output.fov) ||
    !Number.isFinite(output.roll)
  ) {
    nanOrInfErrors++;
  }

  // Validate clearance
  if (output.position.y < 0.179) {
    clearanceViolations++;
  }
  const rXZ = Math.hypot(output.position.x, output.position.z);
  if (rXZ < 1.75 || rXZ > 11.0) {
    clearanceViolations++;
  }

  // Detect shot boundary transition
  if (director.currentShot && director.currentShot.id !== prevShotId) {
    shotCount++;
    const s = director.currentShot;
    prevShotId = s.id;
    // Check immediate repetition
    if (s.distanceTier === lastDistance) {
      immediateRepetitions++;
      console.log(`[REP VIOLATION] Shot #${shotCount} distance: ${s.distanceTier} === ${lastDistance}`);
    }
    if (s.azimuthSector === lastAzimuth) {
      immediateRepetitions++;
      console.log(`[REP VIOLATION] Shot #${shotCount} azimuth: ${s.azimuthSector} === ${lastAzimuth}`);
    }
    if (s.targetAnchor.id === lastTarget) {
      immediateRepetitions++;
      console.log(`[REP VIOLATION] Shot #${shotCount} target: ${s.targetAnchor.id} === ${lastTarget}`);
    }
    if (s.lensProfile.id === lastLens) {
      immediateRepetitions++;
      console.log(`[REP VIOLATION] Shot #${shotCount} lens: ${s.lensProfile.id} === ${lastLens}`);
    }

    lastDistance = s.distanceTier;
    lastAzimuth = s.azimuthSector;
    lastTarget = s.targetAnchor.id;
    lastLens = s.lensProfile.id;

    // Tally stats
    distanceCounts[s.distanceTier] = (distanceCounts[s.distanceTier] || 0) + 1;
    lensCounts[s.lensProfile.name] = (lensCounts[s.lensProfile.name] || 0) + 1;
    trajectoryCounts[s.trajectory.name] = (trajectoryCounts[s.trajectory.name] || 0) + 1;
    azimuthCounts[s.azimuthSector] = (azimuthCounts[s.azimuthSector] || 0) + 1;
    targetCounts[s.targetAnchor.name] = (targetCounts[s.targetAnchor.name] || 0) + 1;

    shotHistory.push({
      index: shotCount,
      name: s.name,
      distance: s.distanceTier,
      lens: `${s.lensProfile.focalLengthMm}mm`,
      target: s.targetAnchor.name,
      energy: s.energy,
      duration: `${s.duration.toFixed(1)}s`,
    });
  }
}

console.log('\n================================================================');
console.log('SIMULATION RESULTS & KINEMATIC INTEGRITY');
console.log('================================================================');
console.log(`Total Simulated Time: ${(totalSimulatedSeconds / 60).toFixed(1)} minutes (${totalSimulatedSeconds.toFixed(0)}s)`);
console.log(`Total Shots Composed: ${shotCount}`);
console.log(`NaN / Inf Output Errors: ${nanOrInfErrors} (must be 0)`);
console.log(`Clearance Violations: ${clearanceViolations} (must be 0)`);
console.log(`Immediate Repetition Violations: ${immediateRepetitions} (must be 0)`);

console.log('\n--- DISTANCE DISTRIBUTION ---');
console.table(distanceCounts);

console.log('\n--- LENS DISTRIBUTION ---');
console.table(lensCounts);

console.log('\n--- TRAJECTORY FAMILIES ---');
console.table(trajectoryCounts);

console.log('\n--- TARGET ANCHORS ---');
console.table(targetCounts);

console.log('\n--- FIRST 10 GENERATED SHOTS SEQUENCE ---');
console.table(shotHistory.slice(0, 10));

if (clearanceViolations === 0 && nanOrInfErrors === 0 && immediateRepetitions === 0) {
  console.log('\n>>> SUCCESS: ALL CINEMATIC CRITERIA PASSED EMPIRICALLY! <<<');
} else {
  console.error('\n>>> FAILURE: INTEGRITY CHECKS FAILED <<<');
  process.exit(1);
}
