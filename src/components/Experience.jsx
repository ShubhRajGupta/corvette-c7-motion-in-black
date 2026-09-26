import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { CarModel } from './CarModel';
import { StudioEnvironment } from './StudioEnvironment';
import { CinematicCamera } from './CinematicCamera';
import { SpatialTypography } from './SpatialTypography';
import { PostProcessingEffects } from './PostProcessingEffects';
import { StudioAtmosphere } from './vfx/StudioAtmosphere';
import { AirborneDust } from './vfx/AirborneDust';
import { OpticalDiffusion } from './vfx/OpticalDiffusion';

export function Experience({
  timelineProgress,
  isExploreMode,
  mouseOffset,
  currentSpec,
  activeStickerId,
  vfxSettings,
}) {
  return (
    <div className={`webgl-viewport ${isExploreMode ? 'interactive' : ''}`}>
      <Canvas
        shadows
        camera={{ position: [3.3, 0.85, -3.7], fov: 40 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#040203']} />
        <fog attach="fog" args={['#040203', 5, 22]} />

        <Suspense fallback={null}>
          {/* Choreographed Cinematic Camera */}
          <CinematicCamera
            timelineProgress={timelineProgress}
            isExploreMode={isExploreMode}
            mouseOffset={mouseOffset}
          />

          {/* Realistic High-Contrast Automotive Studio Lighting */}
          <StudioEnvironment
            timelineProgress={timelineProgress}
            mouseOffset={mouseOffset}
            currentSpec={currentSpec}
          />

          {/* Subordinate Cinematic Atmospheric Effects & Ground Haze */}
          {vfxSettings?.atmosphere !== false && (
            <StudioAtmosphere
              timelineProgress={timelineProgress}
              currentSpec={currentSpec}
            />
          )}

          {/* Microscopic Suspended Studio Dust Particles */}
          {vfxSettings?.particles !== false && (
            <AirborneDust timelineProgress={timelineProgress} />
          )}

          {/* Restrained Optical Diffusion, Projector Glow & Anamorphic Flare */}
          {vfxSettings?.optical !== false && (
            <OpticalDiffusion
              timelineProgress={timelineProgress}
              currentSpec={currentSpec}
            />
          )}

          {/* Chevrolet Corvette C7 Physical Asset */}
          <CarModel
            timelineProgress={timelineProgress}
            isExploreMode={isExploreMode}
            mouseOffset={mouseOffset}
            currentSpec={currentSpec}
            activeStickerId={activeStickerId}
          />

          {/* In-Scene 3D Spatial Typography with Chassis Occlusion */}
          <SpatialTypography timelineProgress={timelineProgress} />

          {/* Restrained Bloom & Chromatic Aberration Post Processing */}
          <PostProcessingEffects
            timelineProgress={timelineProgress}
            bloomEnabled={vfxSettings?.bloom !== false}
            chromaticEnabled={vfxSettings?.chromatic !== false}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
