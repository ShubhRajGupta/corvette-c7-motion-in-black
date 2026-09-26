import * as THREE from 'three';
import {
  DISTANCE_TIERS,
  HEIGHT_TIERS,
  AZIMUTH_SECTORS,
  LENS_FAMILIES,
  LOOK_TARGETS,
  TRAJECTORY_FAMILIES,
  ENERGY_CLASSES,
  PACING_PATTERNS,
  COMPATIBILITY_RULES,
} from '../constants/cinematicVocabulary.js';

/**
 * Quintic Smootherstep for buttery, studio-grade cinematic acceleration/deceleration
 */
function smootherstep(t) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * c * (c * (c * 6 - 15) + 10);
}

/**
 * Simple Linear-Congruential Pseudo-Random Generator with optional session seed
 */
class SessionRNG {
  constructor(seed = 1337) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }

  next() {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }

  range(min, max) {
    return min + this.next() * (max - min);
  }

  pick(array) {
    if (!array || array.length === 0) return null;
    return array[Math.floor(this.next() * array.length)];
  }
}

/**
 * Virtual Automotive Cinematographer & Autonomous Camera Director
 *
 * Implements:
 * - Combinatorial shot generation across 8 independent photographic dimensions
 * - Grammatical constraints (macro pairing, wide pairing, floor clearance)
 * - Anti-repetition ring memory (last 8 shots)
 * - Multi-criteria scoring engine (novelty, composition, lighting highlights, continuity)
 * - Collision & clearance verification (floor Y >= 0.18m, vehicle envelope R >= 1.85m)
 * - Smooth transition planner (cylindrical arc transit, continuous kinematic velocity)
 * - Photographic pauses & focal breathing
 */
export class CinematicDirector {
  constructor(sessionSeed = 1337) {
    this.rng = new SessionRNG(sessionSeed);

    // History ring buffer to enforce strict non-repetition
    this.history = [];
    this.maxHistory = 8;

    // Director pacing pattern
    this.activePattern = PACING_PATTERNS[0];
    this.patternStep = 0;

    // Active shot and lifecycle
    // Phases: 'STANDBY', 'TRANSIT', 'ACTION'
    this.phase = 'STANDBY';
    this.phaseTime = 0;
    this.phaseDuration = 5.0;

    // Current and Next Shot Descriptors
    this.currentShot = null;
    this.nextShot = null;

    // Kinematic transit bridge endpoints
    this.transitStartPos = new THREE.Vector3();
    this.transitStartTarget = new THREE.Vector3();
    this.transitStartFov = 36;
    this.transitStartRoll = 0;

    // Output camera state
    this.output = {
      position: new THREE.Vector3(3.3, 0.85, -3.7),
      target: new THREE.Vector3(0.0, 0.55, -0.6),
      fov: 36,
      roll: 0,
      telemetry: {
        shotId: 'init',
        name: 'Showroom Stance',
        phase: 'STANDBY',
        distanceTier: 'MEDIUM',
        focalLength: '50mm',
        energy: 'CALM',
        targetName: 'Chassis Center',
        speed: 0,
        isStatic: true,
      },
    };

    // Monotonic shot ID counter to guarantee unique IDs across high-frequency ticks
    this._shotIdCounter = 0;

    // Reusable scratch vectors to avoid GC allocations during RAF
    this._tempV1 = new THREE.Vector3();
    this._tempV2 = new THREE.Vector3();
  }

  /**
   * Reset or reseed director
   */
  reseed(seed) {
    this.rng = new SessionRNG(seed || 1337);
    this.history = [];
    this.patternStep = 0;
    this._shotIdCounter = 0;
  }

  /**
   * Initialize director from current interactive camera state upon idle trigger
   */
  reentry(currentPos, currentTarget, currentFov, currentRoll) {
    this.transitStartPos.copy(currentPos);
    this.transitStartTarget.copy(currentTarget);
    this.transitStartFov = currentFov;
    this.transitStartRoll = currentRoll;

    // Pick a complementary pattern
    this.activePattern = this.rng.pick(PACING_PATTERNS) || PACING_PATTERNS[0];
    this.patternStep = 0;

    // Generate and select best first shot
    const candidates = this.generateCandidates(8, {
      pos: currentPos,
      target: currentTarget,
      fov: currentFov,
    });
    this.currentShot = this.selectBestShot(candidates, {
      pos: currentPos,
      target: currentTarget,
    });

    this.phase = 'TRANSIT';
    this.phaseTime = 0;
    this.phaseDuration = Math.min(4.8, Math.max(3.2, currentPos.distanceTo(this.currentShot.startPos) * 0.85));

    this._recordHistory(this.currentShot);
  }

  /**
   * Generate a batch of valid candidate shots
   */
  generateCandidates(count = 8, _fromState) {
    const candidates = [];
    const distanceTierKeys = Object.keys(DISTANCE_TIERS);
    const heightTierKeys = Object.keys(HEIGHT_TIERS);
    const azimuthKeys = Object.keys(AZIMUTH_SECTORS);
    const lensKeys = Object.keys(LENS_FAMILIES);
    const targetKeys = Object.keys(LOOK_TARGETS);
    const trajectoryKeys = Object.keys(TRAJECTORY_FAMILIES);
    const energyKeys = Object.keys(ENERGY_CLASSES);

    const lastShot = this.history.length > 0 ? this.history[this.history.length - 1] : null;

    let attempts = 0;
    while (candidates.length < count && attempts < 90) {
      attempts++;

      // 1. Select Distance Tier (Pre-filtered for strict zero immediate repetition)
      const validDistanceKeys = lastShot
        ? distanceTierKeys.filter((k) => k !== lastShot.distanceTier)
        : distanceTierKeys;
      const distanceKey = this.rng.pick(validDistanceKeys) || distanceTierKeys[0];
      const distanceTier = DISTANCE_TIERS[distanceKey];

      // 2. Select Target Anchor (Pre-filtered for strict zero immediate repetition)
      let poolTargets;
      if (distanceKey === 'EXTREME_MACRO') {
        poolTargets = COMPATIBILITY_RULES.EXTREME_MACRO.allowedTargets;
      } else if (distanceKey === 'EXTREME_WIDE') {
        poolTargets = COMPATIBILITY_RULES.EXTREME_WIDE.allowedTargets;
      } else {
        poolTargets = targetKeys;
      }
      const validTargetKeys = lastShot
        ? poolTargets.filter((k) => k !== lastShot.targetAnchor.id)
        : poolTargets;
      const targetKey = this.rng.pick(validTargetKeys) || poolTargets[0];
      const targetAnchor = LOOK_TARGETS[targetKey];

      // 3. Select Azimuth & Height (Pre-filtered for strict zero immediate repetition)
      const validAzimuthKeys = lastShot
        ? azimuthKeys.filter((k) => k !== lastShot.azimuthSector)
        : azimuthKeys;
      const azimuthKey = this.rng.pick(validAzimuthKeys) || azimuthKeys[0];
      const azimuthSector = AZIMUTH_SECTORS[azimuthKey];

      let heightKey = this.rng.pick(heightTierKeys);
      if (distanceKey === 'EXTREME_MACRO' && (heightKey === 'HIGH_OVERHEAD' || heightKey === 'ELEVATED_CRANE')) {
        heightKey = 'WAIST_LEVEL';
      }
      const heightTier = HEIGHT_TIERS[heightKey];

      // 4. Select Lens (Pre-filtered for strict zero immediate repetition)
      let poolLenses;
      if (distanceKey === 'EXTREME_MACRO') {
        poolLenses = COMPATIBILITY_RULES.EXTREME_MACRO.allowedLenses;
      } else if (distanceKey === 'EXTREME_WIDE') {
        poolLenses = COMPATIBILITY_RULES.EXTREME_WIDE.allowedLenses;
      } else {
        poolLenses = lensKeys;
      }
      const validLensKeys = lastShot
        ? poolLenses.filter((k) => k !== lastShot.lensProfile.id)
        : poolLenses;
      const lensKey = this.rng.pick(validLensKeys) || poolLenses[0];
      const lensProfile = LENS_FAMILIES[lensKey];

      // 5. Select Trajectory (Pre-filtered for strict zero immediate repetition)
      let poolTrajectories;
      if (distanceKey === 'EXTREME_MACRO') {
        poolTrajectories = COMPATIBILITY_RULES.EXTREME_MACRO.allowedTrajectories;
      } else if (distanceKey === 'EXTREME_WIDE') {
        poolTrajectories = COMPATIBILITY_RULES.EXTREME_WIDE.allowedTrajectories;
      } else if (heightKey === 'GROUND_SKIMMER') {
        poolTrajectories = COMPATIBILITY_RULES.GROUND_SKIMMER.allowedTrajectories;
      } else {
        poolTrajectories = trajectoryKeys;
      }
      const validTrajectoryKeys = lastShot
        ? poolTrajectories.filter((k) => k !== lastShot.trajectory.id)
        : poolTrajectories;
      const trajectoryKey = this.rng.pick(validTrajectoryKeys) || poolTrajectories[0];
      const trajectoryDef = TRAJECTORY_FAMILIES[trajectoryKey];

      // 6. Select Energy & Duration
      const energyKey = this.rng.pick(energyKeys);
      const energyDef = ENERGY_CLASSES[energyKey];
      const duration = this.rng.range(energyDef.durationRange[0], energyDef.durationRange[1]);

      // Calculate initial polar coordinate placement
      const radius = this.rng.range(distanceTier.radiusRange[0], distanceTier.radiusRange[1]);
      const angle = azimuthSector.angleRad + this.rng.range(-azimuthSector.jitterRad, azimuthSector.jitterRad);
      let camY = this.rng.range(heightTier.yRange[0], heightTier.yRange[1]);

      // Ensure minimum clearance floor
      camY = Math.max(0.18, camY);

      // Target position with intentional rule-of-thirds offset if allowed
      const startTarget = targetAnchor.position.clone();
      if (targetAnchor.offsetAllowed && distanceKey !== 'EXTREME_MACRO') {
        startTarget.x += this.rng.range(-0.12, 0.12);
        startTarget.z += this.rng.range(-0.15, 0.15);
      }

      // Compute Start Position
      const startPos = new THREE.Vector3(
        Math.cos(angle) * radius,
        camY,
        Math.sin(angle) * radius
      );

      // If extreme macro, anchor camera near target anchor instead of global origin
      if (distanceKey === 'EXTREME_MACRO') {
        const macroOffset = new THREE.Vector3(
          Math.cos(angle) * (radius * 0.45),
          (camY - startTarget.y) * 0.5,
          Math.sin(angle) * (radius * 0.45)
        );
        startPos.copy(startTarget).add(macroOffset);
        startPos.y = Math.max(0.18, startPos.y);
      }

      // Compute End Position & End Target based on Trajectory
      const endPos = startPos.clone();
      const endTarget = startTarget.clone();
      let startFov = lensProfile.fov;
      let endFov = lensProfile.fov;

      switch (trajectoryDef.motionType) {
        case 'STATIC': {
          // Locked camera with microscopic operator breathing
          break;
        }
        case 'DRIFT': {
          // Precision lateral operator float
          const tangent = new THREE.Vector3(-Math.sin(angle), 0, Math.cos(angle)).multiplyScalar(0.08);
          endPos.add(tangent);
          endTarget.add(tangent.clone().multiplyScalar(0.25));
          break;
        }
        case 'DOLLY': {
          const deltaR = trajectoryDef.deltaRadius || -0.8;
          const ray = new THREE.Vector3().subVectors(startPos, startTarget).normalize();
          endPos.addScaledVector(ray, deltaR);
          // Clamp endPos to safe envelope
          const minSafe = distanceKey === 'EXTREME_MACRO' ? 1.85 : 2.58;
          const curR = Math.hypot(endPos.x, endPos.z);
          if (curR < minSafe) {
            const scale = (minSafe + 0.05) / (curR || 1);
            endPos.x *= scale;
            endPos.z *= scale;
          }
          endPos.y = Math.max(0.22, Math.min(3.8, endPos.y));
          // Subtle lens zoom during push
          if (trajectoryDef.supportsLensMorph) {
            endFov = THREE.MathUtils.clamp(startFov + (deltaR < 0 ? -4.5 : 4.5), 12, 68);
          }
          break;
        }
        case 'TRACK': {
          const trackAngle = angle + (trajectoryDef.deltaAngleRad || 0.45);
          endPos.x = Math.cos(trackAngle) * radius;
          endPos.z = Math.sin(trackAngle) * radius;
          endPos.y = Math.max(0.22, Math.min(3.8, endPos.y));
          break;
        }
        case 'ORBIT': {
          const orbitAngle = angle + (trajectoryDef.deltaAngleRad || 0.78);
          endPos.x = Math.cos(orbitAngle) * radius;
          endPos.z = Math.sin(orbitAngle) * radius;
          endPos.y = Math.max(0.22, Math.min(3.8, endPos.y));
          break;
        }
        case 'SPIRAL': {
          const spiralAngle = angle + (trajectoryDef.deltaAngleRad || 1.15);
          const minSafe = distanceKey === 'EXTREME_MACRO' ? 1.85 : 2.58;
          const endRadius = Math.max(minSafe + 0.05, radius + (trajectoryDef.deltaRadius || -0.65));
          endPos.x = Math.cos(spiralAngle) * endRadius;
          endPos.z = Math.sin(spiralAngle) * endRadius;
          endPos.y = Math.max(0.22, Math.min(3.8, endPos.y));
          break;
        }
        case 'CRANE': {
          endPos.y = Math.max(0.24, Math.min(3.8, startPos.y + (trajectoryDef.deltaY || -1.0)));
          const craneAngle = angle + (trajectoryDef.deltaAngleRad || 0.35);
          endPos.x = Math.cos(craneAngle) * radius;
          endPos.z = Math.sin(craneAngle) * radius;
          break;
        }
        case 'PARABOLIC': {
          const pAngle = angle + (trajectoryDef.deltaAngleRad || 0.55);
          endPos.x = Math.cos(pAngle) * radius;
          endPos.z = Math.sin(pAngle) * radius;
          endPos.y = Math.max(0.24, Math.min(3.8, startPos.y + (trajectoryDef.deltaY || 0.4)));
          break;
        }
        default:
          break;
      }

      // Roll / Dutch angle calculation
      const rollSign = this.rng.next() > 0.5 ? 1 : -1;
      const startRoll = this.rng.range(0, energyDef.maxRollRad) * rollSign;
      const endRoll = energyKey === 'CALM' ? 0.0 : startRoll * 0.7;

      // Validate Clearance & Safety
      if (!this._validateClearance(startPos, endPos, startTarget, endTarget, distanceKey)) {
        continue;
      }

      // Candidate Object
      const candidate = {
        id: `shot-${++this._shotIdCounter}`,
        name: `${azimuthSector.name} // ${lensProfile.focalLengthMm}mm`,
        distanceTier: distanceKey,
        heightTier: heightKey,
        azimuthSector: azimuthKey,
        lensProfile: lensProfile,
        targetAnchor: targetAnchor,
        trajectory: trajectoryDef,
        energy: energyKey,
        duration: duration,
        startPos,
        endPos,
        startTarget,
        endTarget,
        startFov,
        endFov,
        startRoll,
        endRoll,
        isStatic: trajectoryDef.motionType === 'STATIC',
        isSymmetrical: azimuthSector.isSymmetrical,
      };

      candidates.push(candidate);
    }

    if (candidates.length === 0) {
      console.log('>>> ZERO CANDIDATES GENERATED! attempts:', attempts);
    }

    return candidates;
  }

  /**
   * Rigorous Safety & Collision Clearance Validator
   */
  _validateClearance(startPos, endPos, startTarget, endTarget, distanceKey) {
    // 1. Studio Floor & Ceiling Bounds
    if (startPos.y < 0.18 || endPos.y < 0.18) return false;
    if (startPos.y > 4.2 || endPos.y > 4.2) return false;

    // 2. Studio Outer Perimeter Walls
    const maxStudioRadius = 10.5;
    if (Math.hypot(startPos.x, startPos.z) > maxStudioRadius) return false;
    if (Math.hypot(endPos.x, endPos.z) > maxStudioRadius) return false;

    // 3. Minimum Vehicle Envelope Clearance
    // Corvette bounding box: X in [-1.05, 1.05], Z in [-2.25, 2.25], Y in [0, 1.30]
    const minCenterRadius = distanceKey === 'EXTREME_MACRO' ? 1.82 : 2.55;
    if (Math.hypot(startPos.x, startPos.z) < minCenterRadius) return false;
    if (Math.hypot(endPos.x, endPos.z) < minCenterRadius) return false;

    // 4. Distance to Look Target (prevent clipping into target geometry)
    const minTargetDist = distanceKey === 'EXTREME_MACRO' ? 0.65 : 1.25;
    if (startPos.distanceTo(startTarget) < minTargetDist) return false;
    if (endPos.distanceTo(endTarget) < minTargetDist) return false;

    return true;
  }

  /**
   * Multi-Criteria Photographic Scoring Engine
   */
  scoreCandidate(candidate, fromState) {
    let score = 100;

    // 1. Novelty Scoring against Recent History
    const historyLen = this.history.length;
    if (historyLen > 0) {
      const lastShot = this.history[this.history.length - 1];

      // Penalize repeating the exact same distance tier
      if (candidate.distanceTier === lastShot.distanceTier) {
        score -= 50;
      } else {
        // Bonus for dynamic scale contrast (e.g. MACRO -> WIDE)
        if (
          (candidate.distanceTier === 'EXTREME_MACRO' && lastShot.distanceTier === 'WIDE') ||
          (candidate.distanceTier === 'WIDE' && lastShot.distanceTier === 'EXTREME_MACRO')
        ) {
          score += 35;
        }
      }

      // Penalize repeating azimuth sector
      if (candidate.azimuthSector === lastShot.azimuthSector) {
        score -= 60;
      }

      // Penalize repeating lens family
      if (candidate.lensProfile.id === lastShot.lensProfile.id) {
        score -= 30;
      }

      // Penalize repeating target anchor
      if (candidate.targetAnchor.id === lastShot.targetAnchor.id) {
        score -= 40;
      }

      // Penalize repeating trajectory
      if (candidate.trajectory.id === lastShot.trajectory.id) {
        score -= 35;
      }

      // Check deeper history (last 4 shots)
      for (let i = Math.max(0, historyLen - 4); i < historyLen; i++) {
        const past = this.history[i];
        if (past.azimuthSector === candidate.azimuthSector) score -= 18;
        if (past.targetAnchor.id === candidate.targetAnchor.id) score -= 15;
      }
    }

    // 2. Light & Reflection Highlight Alignment
    // Bonus for angles that catch the studio lights
    if (candidate.azimuthSector.includes('REAR') && candidate.distanceTier !== 'EXTREME_WIDE') {
      // Rear shots catch the crimson atmospheric backlight
      score += 18;
    }
    if (candidate.azimuthSector.includes('FRONT_34')) {
      // Front 3/4 catches the main moving key softbox
      score += 15;
    }
    if (candidate.heightTier === 'HIGH_OVERHEAD' || candidate.heightTier === 'ROOF_LEVEL') {
      // Roof and overhead catch the linear top softbox
      score += 14;
    }

    // 3. Symmetrical Shots as Visual Punctuation (Front center / Rear center)
    if (candidate.isSymmetrical) {
      // Reward symmetrical shots occasionally, but penalize if too frequent
      const hadSymmetricalRecently = this.history.slice(-4).some((s) => s.isSymmetrical);
      if (!hadSymmetricalRecently) {
        score += 22;
      } else {
        score -= 40;
      }
    }

    // 4. Kinematic Smoothness from Previous Position
    if (fromState && fromState.pos) {
      const travelDist = fromState.pos.distanceTo(candidate.startPos);
      // Gentle penalty for overly jarring position jumps
      if (travelDist > 8.5) {
        score -= 15;
      } else if (travelDist >= 2.5 && travelDist <= 5.5) {
        score += 12; // Ideal cinematic transit arc
      }
    }

    return score;
  }

  /**
   * Select Best Shot from Candidates
   */
  selectBestShot(candidates, fromState) {
    const lastShot = this.history.length > 0 ? this.history[this.history.length - 1] : null;

    if (!candidates || candidates.length === 0) {
      // Safe fallback guaranteed to differ from lastShot
      return this._createFallbackShot(lastShot);
    }

    // Strict non-repetition filter on candidates against lastShot
    let eligible = candidates;
    if (lastShot) {
      const nonRepeating = candidates.filter((c) =>
        c.distanceTier !== lastShot.distanceTier &&
        c.azimuthSector !== lastShot.azimuthSector &&
        c.lensProfile.id !== lastShot.lensProfile.id &&
        c.targetAnchor.id !== lastShot.targetAnchor.id &&
        c.trajectory.id !== lastShot.trajectory.id
      );
      if (nonRepeating.length > 0) {
        eligible = nonRepeating;
      }
    }

    // Score eligible candidates
    const scored = eligible.map((cand) => ({
      candidate: cand,
      score: this.scoreCandidate(cand, fromState),
    }));

    // Sort descending by score
    scored.sort((a, b) => b.score - a.score);

    // Stochastic pick among top 2 highest scoring to maintain natural unpredictability
    const topCandidates = scored.slice(0, Math.min(2, scored.length));
    const chosen = this.rng.pick(topCandidates).candidate;

    return chosen;
  }

  /**
   * Fallback safe shot in rare event all candidates fail
   */
  _createFallbackShot(lastShot = null) {
    const allDistances = ['EXTREME_MACRO', 'CLOSE', 'MEDIUM', 'WIDE', 'EXTREME_WIDE'];
    const validDists = lastShot ? allDistances.filter((d) => d !== lastShot.distanceTier) : allDistances;
    const dist = validDists[0] || 'MEDIUM';

    const allAzimuths = Object.keys(AZIMUTH_SECTORS);
    const validAz = lastShot ? allAzimuths.filter((a) => a !== lastShot.azimuthSector) : allAzimuths;
    const azimuth = validAz[0] || 'FRONT_34_L';

    const allLenses = Object.keys(LENS_FAMILIES);
    const validLenses = lastShot ? allLenses.filter((l) => l !== lastShot.lensProfile.id) : allLenses;
    const lens = LENS_FAMILIES[validLenses[0]] || LENS_FAMILIES.STANDARD_50MM;

    const allTargets = Object.keys(LOOK_TARGETS);
    const validTargets = lastShot ? allTargets.filter((t) => t !== lastShot.targetAnchor.id) : allTargets;
    const target = LOOK_TARGETS[validTargets[0]] || LOOK_TARGETS.FRONT_BADGE;

    const allTraj = Object.keys(TRAJECTORY_FAMILIES);
    const validTraj = lastShot ? allTraj.filter((t) => t !== lastShot.trajectory.id) : allTraj;
    const traj = TRAJECTORY_FAMILIES[validTraj[0]] || TRAJECTORY_FAMILIES.STATIC_PHOTOGRAPH;

    return {
      id: `fallback-${Date.now()}`,
      name: `${AZIMUTH_SECTORS[azimuth]?.name || 'Autonomous Composition'} // ${lens.focalLengthMm}mm`,
      distanceTier: dist,
      heightTier: 'WAIST_LEVEL',
      azimuthSector: azimuth,
      lensProfile: lens,
      targetAnchor: target,
      trajectory: traj,
      energy: 'CALM',
      duration: 12.0,
      startPos: new THREE.Vector3(2.65, 0.65, -3.35),
      endPos: new THREE.Vector3(2.65, 0.65, -3.35),
      startTarget: target.position.clone(),
      endTarget: target.position.clone(),
      startFov: lens.fov,
      endFov: lens.fov,
      startRoll: 0,
      endRoll: 0,
      isStatic: true,
      isSymmetrical: false,
    };
  }

  /**
   * Record Shot in History
   */
  _recordHistory(shot) {
    this.history.push({
      id: shot.id,
      distanceTier: shot.distanceTier,
      azimuthSector: shot.azimuthSector,
      lensProfile: shot.lensProfile,
      targetAnchor: shot.targetAnchor,
      trajectory: shot.trajectory,
      isSymmetrical: shot.isSymmetrical,
    });
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }

  /**
   * Frame-by-Frame Update Loop
   * Called inside useFrame by useIdleCinematicCamera
   *
   * @param {number} delta - Frame delta time in seconds
   * @param {THREE.Vector3} currentInteractiveCamPos
   * @param {THREE.Vector3} currentInteractiveCamTarget
   * @returns {Object} Camera output (position, target, fov, roll, telemetry)
   */
  update(delta) {
    if (!this.currentShot) {
      return this.output;
    }

    this.phaseTime += delta;

    if (this.phase === 'TRANSIT') {
      // =========================================================================
      // PHASE 1: TRANSIT BRIDGE
      // Smoothly arcs the camera from previous state into new shot starting stance
      // =========================================================================
      const progress = Math.min(1.0, this.phaseTime / Math.max(0.1, this.phaseDuration));
      const eased = smootherstep(progress);

      // Arc-based / Cylindrical interpolation so camera orbits around car rather than cutting through
      const rA = Math.hypot(this.transitStartPos.x, this.transitStartPos.z);
      const thetaA = Math.atan2(this.transitStartPos.x, this.transitStartPos.z);
      const rB = Math.hypot(this.currentShot.startPos.x, this.currentShot.startPos.z);
      const thetaB = Math.atan2(this.currentShot.startPos.x, this.currentShot.startPos.z);

      // Shortest angle direction
      let dTheta = (thetaB - thetaA + 3 * Math.PI) % (2 * Math.PI) - Math.PI;

      const curTheta = thetaA + dTheta * eased;
      const curR = THREE.MathUtils.lerp(rA, rB, eased);
      const curY = THREE.MathUtils.lerp(this.transitStartPos.y, this.currentShot.startPos.y, eased);

      this.output.position.set(
        curR * Math.sin(curTheta),
        curY,
        curR * Math.cos(curTheta)
      );

      this.output.target.lerpVectors(this.transitStartTarget, this.currentShot.startTarget, eased);
      this.output.fov = THREE.MathUtils.lerp(this.transitStartFov, this.currentShot.startFov, eased);
      this.output.roll = THREE.MathUtils.lerp(this.transitStartRoll, this.currentShot.startRoll, eased);

      // Telemetry
      this.output.telemetry.phase = 'TRANSIT';
      this.output.telemetry.shotId = this.currentShot.id;
      this.output.telemetry.name = `Transit -> ${this.currentShot.name}`;
      this.output.telemetry.distanceTier = this.currentShot.distanceTier;
      this.output.telemetry.focalLength = `${this.currentShot.lensProfile.focalLengthMm}mm`;
      this.output.telemetry.energy = this.currentShot.energy;
      this.output.telemetry.targetName = this.currentShot.targetAnchor.name;
      this.output.telemetry.speed = 1.0;
      this.output.telemetry.isStatic = false;

      // Transit complete -> Begin Action phase
      if (progress >= 1.0) {
        this.phase = 'ACTION';
        this.phaseTime = 0;
        this.phaseDuration = this.currentShot.duration;
      }
    } else if (this.phase === 'ACTION') {
      // =========================================================================
      // PHASE 2: SHOT ACTION
      // Executes the unique trajectory kinematics, lens zooms, and micro-drifts
      // =========================================================================
      const progress = Math.min(1.0, this.phaseTime / Math.max(0.1, this.phaseDuration));
      const eased = smootherstep(progress);

      const shot = this.currentShot;

      if (shot.isStatic) {
        // Photographic Pause: hold position with crystalline stillness + subtle focus breathing
        const breathProgress = Math.sin(progress * Math.PI * 2);
        const driftProgress = Math.sin(progress * Math.PI);

        this.output.position.copy(shot.startPos);
        this.output.position.y += driftProgress * 0.015;
        this.output.target.copy(shot.startTarget);

        // Focal breathing: very subtle optical shift
        this.output.fov = shot.startFov + breathProgress * 0.22;
        this.output.roll = shot.startRoll;

        this.output.telemetry.speed = 0.05;
        this.output.telemetry.isStatic = true;
      } else {
        // Dynamic Trajectory Evaluation
        // Smoothly interpolate position, target, lens FOV, and roll
        this.output.position.lerpVectors(shot.startPos, shot.endPos, eased);
        this.output.target.lerpVectors(shot.startTarget, shot.endTarget, eased);
        this.output.fov = THREE.MathUtils.lerp(shot.startFov, shot.endFov, eased);
        this.output.roll = THREE.MathUtils.lerp(shot.startRoll, shot.endRoll, eased);

        this.output.telemetry.speed = 0.65;
        this.output.telemetry.isStatic = false;
      }

      // Telemetry
      this.output.telemetry.phase = 'ACTION';
      this.output.telemetry.shotId = shot.id;
      this.output.telemetry.name = shot.name;
      this.output.telemetry.distanceTier = shot.distanceTier;
      this.output.telemetry.focalLength = `${shot.lensProfile.focalLengthMm}mm`;
      this.output.telemetry.energy = shot.energy;
      this.output.telemetry.targetName = shot.targetAnchor.name;

      // Action complete -> Plan Next Shot
      if (progress >= 1.0) {
        // Setup transit from current end stance
        this.transitStartPos.copy(this.output.position);
        this.transitStartTarget.copy(this.output.target);
        this.transitStartFov = this.output.fov;
        this.transitStartRoll = this.output.roll;

        // Generate and select next shot
        const candidates = this.generateCandidates(8, {
          pos: this.output.position,
          target: this.output.target,
          fov: this.output.fov,
        });
        this.currentShot = this.selectBestShot(candidates, {
          pos: this.output.position,
          target: this.output.target,
        });

        this.phase = 'TRANSIT';
        this.phaseTime = 0;
        this.phaseDuration = Math.min(
          5.2,
          Math.max(3.2, this.output.position.distanceTo(this.currentShot.startPos) * 0.8)
        );

        this._recordHistory(this.currentShot);
      }
    }

    return this.output;
  }
}
