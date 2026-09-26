import React from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

export function PostProcessingEffects({ timelineProgress }) {
  // Headlight/Taillight bloom intensity modulates dynamically
  const p = timelineProgress;
  const isLightingEvent = (p >= 0.35 && p <= 0.55) || (p >= 0.65 && p <= 0.78);
  const bloomIntensity = isLightingEvent ? 1.4 : 0.65;

  return (
    <EffectComposer multisampling={4} disableNormalPass>
      <Bloom
        luminanceThreshold={0.82}
        luminanceSmoothing={0.3}
        intensity={bloomIntensity}
        mipmapBlur
        radius={0.7}
      />
      <Vignette
        eskil={false}
        offset={0.25}
        darkness={0.65}
      />
    </EffectComposer>
  );
}
