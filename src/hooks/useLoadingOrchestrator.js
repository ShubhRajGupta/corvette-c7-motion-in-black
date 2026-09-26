import { useState, useEffect, useRef, useCallback } from 'react';
import { useProgress } from '@react-three/drei';

/**
 * LOADING STAGES ENUM
 */
export const LOADING_STAGES = {
  BOOT: 'BOOT',
  SHELL_READY: 'SHELL_READY',
  ASSETS_LOADING: 'ASSETS_LOADING',
  CORE_SCENE_READY: 'CORE_SCENE_READY',
  SHADERS_PREWARMED: 'SHADERS_PREWARMED',
  EXPERIENCE_READY: 'EXPERIENCE_READY',
};

// Adaptive Pacing Constants
const MIN_PRELOADER_DURATION_MS = 2200; // Minimum 2.2s for cinematic pacing (prevents flashing on cached assets)
const MAX_PRELOADER_TIMEOUT_MS = 7500;  // 7.5s failsafe (never traps user on slow/interrupted network)

/**
 * useLoadingOrchestrator
 *
 * Implements the weighted readiness model, perceived performance pacing,
 * shader prewarming coordination, and progressive visual assembly.
 */
export function useLoadingOrchestrator() {
  const startTimeRef = useRef(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isCriticalReady, setIsCriticalReady] = useState(false);
  const [isExperienceReady, setIsExperienceReady] = useState(false);

  // Performance telemetry state
  const [telemetry, setTelemetry] = useState({
    timeToShell: 0,
    timeToAssets: 0,
    timeToPrewarm: 0,
    timeToCriticalReady: 0,
    totalDuration: 0,
    assetCount: 0,
  });

  // Drei Loading Tracker (tracks actual GLTF/Three.js downloads)
  const { progress: assetProgress, active: assetActive, total: totalItems } = useProgress();

  // Milestones tracking
  const targetProgressRef = useRef(10); // Starts at 10% on shell ready
  const currentProgressRef = useRef(0);
  const sceneAttachedRef = useRef(false);
  const shadersPrewarmedRef = useRef(false);
  const failsafeTriggeredRef = useRef(false);

  // 1. Stage 01: Shell Ready & Typography Fonts
  useEffect(() => {
    if (startTimeRef.current === 0) {
      startTimeRef.current = performance.now();
    }
    const elapsed = Math.round(performance.now() - startTimeRef.current);
    setTelemetry((prev) => ({ ...prev, timeToShell: elapsed }));
    targetProgressRef.current = Math.max(targetProgressRef.current, 14);

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        targetProgressRef.current = Math.max(targetProgressRef.current, 18);
      }).catch(() => {});
    }
  }, []);

  // 2. Stage 02: Real 3D Asset Loading (Drei GLTF Progress)
  useEffect(() => {
    if (assetProgress > 0) {
      // Map 0 -> 100% of asset download to 18% -> 65% of overall weighted progress
      const weightedAssetProgress = 18 + (assetProgress / 100) * 47;
      targetProgressRef.current = Math.max(targetProgressRef.current, weightedAssetProgress);
    }

    if (assetProgress >= 100 || (!assetActive && assetProgress > 0)) {
      const now = performance.now();
      const elapsed = startTimeRef.current > 0 ? Math.round(now - startTimeRef.current) : 0;
      setTelemetry((prev) => {
        if (prev.timeToAssets > 0) return prev;
        return { ...prev, timeToAssets: elapsed, assetCount: totalItems || 1 };
      });
      targetProgressRef.current = Math.max(targetProgressRef.current, 68);
    }
  }, [assetProgress, assetActive, totalItems]);

  // 3. Callback: Three.js Scene Attached in React Tree
  const reportSceneAttached = useCallback(() => {
    if (sceneAttachedRef.current) return;
    sceneAttachedRef.current = true;
    targetProgressRef.current = Math.max(targetProgressRef.current, 76);
  }, []);

  // 4. Callback: Three.js WebGLRenderer Shaders Prewarmed on GPU
  const reportShadersPrewarmed = useCallback(() => {
    if (shadersPrewarmedRef.current) return;
    shadersPrewarmedRef.current = true;
    const now = performance.now();
    const elapsed = startTimeRef.current > 0 ? Math.round(now - startTimeRef.current) : 0;
    setTelemetry((prev) => ({ ...prev, timeToPrewarm: elapsed }));
    targetProgressRef.current = Math.max(targetProgressRef.current, 92);
  }, []);

  // 5. Maximum Timeout Failsafe (Never traps user if an asset hangs)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isCriticalReady) {
        failsafeTriggeredRef.current = true;
        targetProgressRef.current = 100;
        setIsCriticalReady(true);
      }
    }, MAX_PRELOADER_TIMEOUT_MS);

    return () => clearTimeout(timeout);
  }, [isCriticalReady]);

  // 6. Smooth Progress Damping & Adaptive Pacing Loop
  useEffect(() => {
    let animId;

    const tick = () => {
      if (startTimeRef.current === 0) {
        startTimeRef.current = performance.now();
      }
      const elapsed = performance.now() - startTimeRef.current;

      // Check if critical technical conditions are met
      const isTechReady =
        (assetProgress >= 100 || !assetActive || failsafeTriggeredRef.current) &&
        (shadersPrewarmedRef.current || failsafeTriggeredRef.current || elapsed > 3500);

      // Enforce minimum visual duration for cinematic pacing
      if (isTechReady && elapsed >= MIN_PRELOADER_DURATION_MS) {
        targetProgressRef.current = 100;
        if (!isCriticalReady) {
          setIsCriticalReady(true);
          setTelemetry((prev) => ({ ...prev, timeToCriticalReady: Math.round(elapsed) }));
        }
      }

      // Smooth physical interpolation towards target progress
      const diff = targetProgressRef.current - currentProgressRef.current;
      currentProgressRef.current += diff * 0.085;

      const rounded = Math.min(100, Math.round(currentProgressRef.current));
      setDisplayProgress(rounded);

      // Final hand-off milestone
      if (currentProgressRef.current >= 99.2) {
        currentProgressRef.current = 100;
        setDisplayProgress(100);
        setIsExperienceReady(true);

        const totalDuration = Math.round(performance.now() - startTimeRef.current);
        setTelemetry((prev) => {
          const updated = { ...prev, totalDuration };
          if (typeof window !== 'undefined') {
            window.__CORVETTE_LOAD_STATS__ = {
              ...updated,
              timestamp: new Date().toISOString(),
            };
          }
          return updated;
        });
        return;
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [assetProgress, assetActive, isCriticalReady]);

  // Derived current loading stage and status message (pure during render)
  const stage = isExperienceReady
    ? LOADING_STAGES.EXPERIENCE_READY
    : isCriticalReady
    ? LOADING_STAGES.SHADERS_PREWARMED
    : displayProgress >= 72
    ? LOADING_STAGES.CORE_SCENE_READY
    : displayProgress >= 20
    ? LOADING_STAGES.ASSETS_LOADING
    : LOADING_STAGES.SHELL_READY;

  const statusMessage = isCriticalReady || displayProgress >= 95
    ? 'CORVETTE READY'
    : displayProgress >= 78
    ? 'PREWARMING SHADERS'
    : displayProgress >= 65
    ? 'CALIBRATING LIGHTING'
    : displayProgress >= 40
    ? 'STREAMING TEXTURES'
    : displayProgress >= 20
    ? 'MAPPING GEOMETRY'
    : 'INITIALIZING ATELIER';

  return {
    stage,
    displayProgress,
    statusMessage,
    isCriticalReady,
    isExperienceReady,
    reportSceneAttached,
    reportShadersPrewarmed,
    telemetry,
  };
}
