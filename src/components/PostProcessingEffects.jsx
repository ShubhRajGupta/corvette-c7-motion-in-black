import React, { useMemo } from 'react';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';

export function PostProcessingEffects({
  timelineProgress,
  bloomEnabled = true,
  chromaticEnabled = true,
}) {
  const p = timelineProgress;

  // 1. Dynamic Bloom Calibration:
  // Controlled, soft, photographic (not neon blob)
  // High threshold so car lacquer does not wash out
  const isLightingEvent = (p >= 0.44 && p <= 0.60) || (p >= 0.74 && p <= 0.88);
  const isPauseScene = p >= 0.88 && p <= 0.92;
  const baseBloom = isPauseScene ? 0.35 : isLightingEvent ? 1.35 : 0.65;
  const bloomIntensity = bloomEnabled ? baseBloom : 0;

  // 2. Chromatic Aberration:
  // Normal state: almost zero (0.0001).
  // Headlight transition (0.56 -> 0.62): subtle photographic stress (peak ~ 0.0024).
  // Experimental transition (0.92 -> 0.96): subtle breakup (peak ~ 0.0018).
  // Returns immediately to near zero.
  const chromaticOffset = useMemo(() => {
    if (!chromaticEnabled) return new THREE.Vector2(0, 0);

    let amt = 0.0001;
    if (p >= 0.56 && p <= 0.62) {
      amt = 0.0001 + Math.sin(((p - 0.56) / 0.06) * Math.PI) * 0.0024;
    } else if (p >= 0.92 && p <= 0.96) {
      amt = 0.0001 + Math.sin(((p - 0.92) / 0.04) * Math.PI) * 0.0018;
    }
    return new THREE.Vector2(amt, amt);
  }, [p, chromaticEnabled]);

  // 3. Vignette Modulation:
  // Becomes slightly deeper during macro close-up (0.50 -> 0.58).
  // Very soft & subtle during final hero (0.94 -> 1.00).
  let vignetteDarkness = 0.55;
  let vignetteOffset = 0.28;
  if (p >= 0.50 && p <= 0.58) {
    vignetteDarkness = 0.66;
    vignetteOffset = 0.22;
  } else if (p >= 0.94) {
    vignetteDarkness = 0.46;
    vignetteOffset = 0.32;
  }

  return (
    <EffectComposer multisampling={4} disableNormalPass>
      <Bloom
        luminanceThreshold={0.84}
        luminanceSmoothing={0.32}
        intensity={bloomIntensity}
        mipmapBlur
        radius={0.68}
      />
      <ChromaticAberration
        offset={chromaticOffset}
        radialModulation={true}
        modulationOffset={0.2}
      />
      <Vignette
        eskil={false}
        offset={vignetteOffset}
        darkness={vignetteDarkness}
      />
    </EffectComposer>
  );
}
