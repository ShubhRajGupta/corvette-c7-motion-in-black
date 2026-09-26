import { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { IDLE_CAMERA_POSES } from '../constants/idlePoses';

// Inactivity delay before idle showroom film begins (in milliseconds)
const INACTIVITY_DELAY_MS = 4800;
// Blend-back speed when user interrupts (higher = faster handoff, 5.0 gives ~0.35s silky transition)
const HANDOFF_SPEED = 5.2;
// Fade-in speed when entering idle sequence
const ENGAGE_SPEED = 1.4;

// Quintic smootherstep for buttery cinematic ease-in-out
function smootherstep(t) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * c * (c * (c * 6 - 15) + 10);
}

/**
 * useIdleCinematicCamera
 *
 * Provides an automated, authored showroom cinematography sequence when user is inactive.
 * - Detects inactivity across all user inputs (mouse, pointer, scroll, wheel, touch, keyboard).
 * - Cycles through 10 authored poses: POSE -> slow movement -> hold -> different pose -> ...
 * - Smooth orbital arc interpolation (prevents cutting through the car).
 * - Instant, silky-smooth handoff back to interactive camera when user interacts (never fights the user).
 */
export function useIdleCinematicCamera({ isExploreMode = false, isDossierOpen = false } = {}) {
  // Activity timestamp tracker (initialized cleanly without impure calls during render)
  const lastActivityRef = useRef(0);
  const isUserActiveRef = useRef(true);

  // Blend weight: 0.0 = pure timeline camera, 1.0 = pure idle showroom camera
  const idleWeightRef = useRef(0);
  const [isIdleActiveState, setIsIdleActiveState] = useState(false);

  // State machine variables for sequence
  // States: 'STANDBY', 'TRANSIT', 'HOLD'
  const stateRef = useRef({
    phase: 'STANDBY',
    currentPoseIndex: 0,
    phaseTime: 0,
    startPos: new THREE.Vector3(),
    startTarget: new THREE.Vector3(),
    startFov: 36,
    startRoll: 0,
    destPos: new THREE.Vector3(),
    destTarget: new THREE.Vector3(),
    destFov: 36,
    destRoll: 0,
  });

  // Current computed idle camera state for Three.js
  const idleResultRef = useRef({
    position: new THREE.Vector3(),
    target: new THREE.Vector3(),
    fov: 36,
    roll: 0,
  });

  // Reset inactivity timer whenever user interacts
  const reportUserActivity = useCallback(() => {
    lastActivityRef.current = performance.now();
    isUserActiveRef.current = true;
  }, []);

  // Set up passive activity listeners on window with optical jitter rejection
  useEffect(() => {
    lastActivityRef.current = performance.now();
    let lastX = -9999;
    let lastY = -9999;

    const handlePointerMove = (evt) => {
      const dx = evt.clientX - lastX;
      const dy = evt.clientY - lastY;
      // Filter out sub-2.5px microscopic optical sensor jitter so high-DPI mouse sensors don't block idle mode
      if (Math.hypot(dx, dy) > 2.5) {
        lastX = evt.clientX;
        lastY = evt.clientY;
        reportUserActivity();
      }
    };

    const handleActivity = () => {
      reportUserActivity();
    };

    const discreteEvents = [
      'mousedown',
      'pointerdown',
      'wheel',
      'scroll',
      'touchstart',
      'touchmove',
      'keydown',
      'click',
      'contextmenu',
    ];

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    discreteEvents.forEach((evt) => {
      window.addEventListener(evt, handleActivity, { passive: true });
    });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('mousemove', handlePointerMove);
      discreteEvents.forEach((evt) => {
        window.removeEventListener(evt, handleActivity);
      });
    };
  }, [reportUserActivity]);

  /**
   * updateIdleCamera: Called every animation frame inside useFrame
   *
   * @param {number} delta - Frame delta time in seconds
   * @param {THREE.Vector3} currentCamPos - Current camera position
   * @param {THREE.Vector3} currentCamTarget - Current lookAt target
   * @param {number} currentFov - Current FOV
   * @param {number} currentRoll - Current camera roll
   * @returns {{ idlePos: THREE.Vector3, idleTarget: THREE.Vector3, idleFov: number, idleRoll: number, idleWeight: number }}
   */
  const updateIdleCamera = (delta, currentCamPos, currentCamTarget, currentFov, currentRoll) => {
    const now = performance.now();
    if (lastActivityRef.current === 0) {
      lastActivityRef.current = now;
    }
    const timeSinceActivity = now - lastActivityRef.current;

    // Check if user is currently idle
    // Do not engage if explore mode is active or dossier modal is open
    const isInactive =
      timeSinceActivity >= INACTIVITY_DELAY_MS && !isExploreMode && !isDossierOpen;

    if (isInactive) {
      isUserActiveRef.current = false;
    }

    // Smoothly interpolate blend weight
    if (!isUserActiveRef.current && isInactive) {
      // Engage idle camera
      idleWeightRef.current = Math.min(1.0, idleWeightRef.current + delta * ENGAGE_SPEED);
      if (idleWeightRef.current > 0.05 && !isIdleActiveState) {
        setIsIdleActiveState(true);
      }
    } else {
      // Immediate, smooth hand-off back to user control (never fight the user)
      idleWeightRef.current = Math.max(0.0, idleWeightRef.current - delta * HANDOFF_SPEED);
      if (idleWeightRef.current <= 0.001 && isIdleActiveState) {
        setIsIdleActiveState(false);
        stateRef.current.phase = 'STANDBY';
        // Advance pose index for next idle activation so user continuously discovers new angles
        stateRef.current.currentPoseIndex =
          (stateRef.current.currentPoseIndex + 1) % IDLE_CAMERA_POSES.length;
      }
    }

    const weight = idleWeightRef.current;

    // If completely inactive (weight is 0), skip sequence math
    if (weight <= 0.0001) {
      return {
        idlePos: currentCamPos,
        idleTarget: currentCamTarget,
        idleFov: currentFov,
        idleRoll: currentRoll,
        idleWeight: 0,
      };
    }

    const s = stateRef.current;

    // Initialize sequence upon first engagement
    if (s.phase === 'STANDBY') {
      s.phase = 'TRANSIT';
      s.phaseTime = 0;
      s.startPos.copy(currentCamPos);
      s.startTarget.copy(currentCamTarget);
      s.startFov = currentFov;
      s.startRoll = currentRoll;

      const dest = IDLE_CAMERA_POSES[s.currentPoseIndex % IDLE_CAMERA_POSES.length];
      s.destPos.copy(dest.position);
      s.destTarget.copy(dest.target);
      s.destFov = dest.fov;
      s.destRoll = dest.roll;
    }

    const currentPose = IDLE_CAMERA_POSES[s.currentPoseIndex % IDLE_CAMERA_POSES.length];

    if (s.phase === 'TRANSIT') {
      s.phaseTime += delta;
      const progress = s.phaseTime / (currentPose.transitDuration || 6.0);
      const eased = smootherstep(progress);

      // Arc-based / Orbital cylindrical interpolation to never cut through the car
      const rA = Math.hypot(s.startPos.x, s.startPos.z);
      const thetaA = Math.atan2(s.startPos.x, s.startPos.z);
      const rB = Math.hypot(s.destPos.x, s.destPos.z);
      const thetaB = Math.atan2(s.destPos.x, s.destPos.z);

      // Shortest angular direction around Y-axis
      let dTheta = (thetaB - thetaA + 3 * Math.PI) % (2 * Math.PI) - Math.PI;

      const curTheta = thetaA + dTheta * eased;
      const curR = THREE.MathUtils.lerp(rA, rB, eased);
      const curY = THREE.MathUtils.lerp(s.startPos.y, s.destPos.y, eased);

      idleResultRef.current.position.set(
        curR * Math.sin(curTheta),
        curY,
        curR * Math.cos(curTheta)
      );
      idleResultRef.current.target.lerpVectors(s.startTarget, s.destTarget, eased);
      idleResultRef.current.fov = THREE.MathUtils.lerp(s.startFov, s.destFov, eased);
      idleResultRef.current.roll = THREE.MathUtils.lerp(s.startRoll, s.destRoll, eased);

      // Transition complete -> Begin hold
      if (progress >= 1.0) {
        s.phase = 'HOLD';
        s.phaseTime = 0;
      }
    } else if (s.phase === 'HOLD') {
      s.phaseTime += delta;
      const holdDuration = currentPose.holdDuration || 4.8;
      const holdProgress = Math.min(1.0, s.phaseTime / holdDuration);

      // Subtle, high-end camera operator micro-drift during hold
      // Eases out so it feels like a steady, graceful push/pan
      const driftProgress = Math.sin(holdProgress * Math.PI * 0.5);

      idleResultRef.current.position
        .copy(s.destPos)
        .addScaledVector(currentPose.drift, driftProgress);

      // Subtle lookAt micro-tracking
      idleResultRef.current.target
        .copy(s.destTarget)
        .addScaledVector(currentPose.drift, driftProgress * 0.2);

      idleResultRef.current.fov = s.destFov + Math.sin(holdProgress * Math.PI) * 0.25;
      idleResultRef.current.roll = s.destRoll;

      // Hold complete -> Advance to next pose
      if (holdProgress >= 1.0) {
        s.phase = 'TRANSIT';
        s.phaseTime = 0;
        s.startPos.copy(idleResultRef.current.position);
        s.startTarget.copy(idleResultRef.current.target);
        s.startFov = idleResultRef.current.fov;
        s.startRoll = idleResultRef.current.roll;

        // Advance to next authored pose in sequence
        s.currentPoseIndex = (s.currentPoseIndex + 1) % IDLE_CAMERA_POSES.length;
        const nextPose = IDLE_CAMERA_POSES[s.currentPoseIndex];

        s.destPos.copy(nextPose.position);
        s.destTarget.copy(nextPose.target);
        s.destFov = nextPose.fov;
        s.destRoll = nextPose.roll;
      }
    }

    return {
      idlePos: idleResultRef.current.position,
      idleTarget: idleResultRef.current.target,
      idleFov: idleResultRef.current.fov,
      idleRoll: idleResultRef.current.roll,
      idleWeight: weight,
      isIdleActive: isIdleActiveState,
      currentPoseName: currentPose.name,
    };
  };

  return {
    updateIdleCamera,
    reportUserActivity,
    isIdleActive: isIdleActiveState,
  };
}
