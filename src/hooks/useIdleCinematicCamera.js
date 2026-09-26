import { useRef, useEffect, useState, useCallback } from 'react';
import { CinematicDirector } from '../utils/cinematicDirector.js';

// Inactivity delay before autonomous cinematic camera engages (4.8 seconds)
const INACTIVITY_DELAY_MS = 4800;
// Blend-back speed when user interrupts (higher = faster handoff; 5.2 gives ~0.3s silky transition)
const HANDOFF_SPEED = 5.2;
// Fade-in speed when entering idle screensaver sequence
const ENGAGE_SPEED = 1.4;

const INITIAL_TELEMETRY = {
  shotId: 'init',
  name: 'Showroom Stance',
  distanceTier: 'MEDIUM',
  focalLength: '50mm',
  energy: 'CALM',
  targetName: 'Chassis Center',
  speed: 0,
  isStatic: true,
};

/**
 * useIdleCinematicCamera
 *
 * Virtual Automotive Cinematographer hook for the Corvette C7:
 * - Detects user inactivity across all input modalities (mouse, pointer, touch, scroll, keyboard).
 * - Filters sub-pixel sensor jitter on high-DPI mice.
 * - Drives autonomous procedural CinematicDirector (thousands of combinatoric compositions).
 * - Instant, silky-smooth handoff back to interactive camera when user interacts (never fights the user).
 * - Seamless resume from current camera state when user pauses again.
 * - Exposes real-time cinematic telemetry (shot energy, focal length, distance tier, speed, target).
 */
export function useIdleCinematicCamera({ isExploreMode = false, isDossierOpen = false } = {}) {
  // Activity timestamp tracker
  const lastActivityRef = useRef(0);
  const isUserActiveRef = useRef(true);

  // Blend weight: 0.0 = pure timeline camera, 1.0 = pure autonomous cinematic screensaver
  const idleWeightRef = useRef(0);
  const [isIdleActiveState, setIsIdleActiveState] = useState(false);
  const [activeTelemetry, setActiveTelemetry] = useState(INITIAL_TELEMETRY);

  // Autonomous Camera Director instance
  const [director] = useState(() => new CinematicDirector(1337));
  const wasEngagedRef = useRef(false);

  // Latest telemetry snapshot ref
  const telemetryRef = useRef(INITIAL_TELEMETRY);

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
   * @param {THREE.Vector3} currentCamPos - Current interactive camera position
   * @param {THREE.Vector3} currentCamTarget - Current interactive lookAt target
   * @param {number} currentFov - Current FOV
   * @param {number} currentRoll - Current camera roll
   * @returns {{ idlePos: THREE.Vector3, idleTarget: THREE.Vector3, idleFov: number, idleRoll: number, idleWeight: number, isIdleActive: boolean, telemetry: Object }}
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
      // Engage autonomous cinematic screensaver
      idleWeightRef.current = Math.min(1.0, idleWeightRef.current + delta * ENGAGE_SPEED);
      if (idleWeightRef.current > 0.05 && !isIdleActiveState) {
        setIsIdleActiveState(true);
      }

      // Reentry into director when first engaging or re-engaging
      if (!wasEngagedRef.current) {
        wasEngagedRef.current = true;
        director.reentry(currentCamPos, currentCamTarget, currentFov, currentRoll);
      }
    } else {
      // Immediate, smooth hand-off back to user control (never fight the user)
      idleWeightRef.current = Math.max(0.0, idleWeightRef.current - delta * HANDOFF_SPEED);
      if (idleWeightRef.current <= 0.001) {
        if (isIdleActiveState) {
          setIsIdleActiveState(false);
        }
        wasEngagedRef.current = false;
      }
    }

    const weight = idleWeightRef.current;

    // If completely inactive (weight is 0), skip director math
    if (weight <= 0.0001) {
      return {
        idlePos: currentCamPos,
        idleTarget: currentCamTarget,
        idleFov: currentFov,
        idleRoll: currentRoll,
        idleWeight: 0,
        isIdleActive: false,
        telemetry: telemetryRef.current,
      };
    }

    // Evaluate director frame
    const directorOutput = director.update(delta);
    if (directorOutput.telemetry.shotId !== telemetryRef.current.shotId) {
      telemetryRef.current = directorOutput.telemetry;
      setActiveTelemetry(directorOutput.telemetry);
    }

    return {
      idlePos: directorOutput.position,
      idleTarget: directorOutput.target,
      idleFov: directorOutput.fov,
      idleRoll: directorOutput.roll,
      idleWeight: weight,
      isIdleActive: isIdleActiveState,
      telemetry: directorOutput.telemetry,
    };
  };

  return {
    updateIdleCamera,
    reportUserActivity,
    isIdleActive: isIdleActiveState,
    telemetry: activeTelemetry,
  };
}
