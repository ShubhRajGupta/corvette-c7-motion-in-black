import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { CarModel } from './CarModel';
import { StudioEnvironment } from './StudioEnvironment';
import { CinematicCamera } from './CinematicCamera';
import { SpatialTypography } from './SpatialTypography';
import { PostProcessingEffects } from './PostProcessingEffects';
import { StudioAtmosphere } from './vfx/StudioAtmosphere';
import { OpticalDiffusion } from './vfx/OpticalDiffusion';
import { CircularStudio } from './studio/CircularStudio';
import { ScenePrewarmer } from './ScenePrewarmer';

export function Experience({
  timelineProgress,
  isExploreMode,
  mouseOffset,
  currentSpec,
  activeStickerId,
  vfxSettings,
  isDossierOpen,
  onIdleStateChange,
  onSceneAttached,
  onShadersPrewarmed,
}) {
  useEffect(() => {
    onSceneAttached?.();
  }, [onSceneAttached]);

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
        <fog attach="fog" args={['#040203', 6, 26]} />

        <Suspense fallback={null}>
          {/* Prewarm GPU shaders and render pipelines before preloader dissolves */}
          <ScenePrewarmer onPrewarmed={onShadersPrewarmed} />

          {/* Choreographed Cinematic Camera */}
          <CinematicCamera
            timelineProgress={timelineProgress}
            isExploreMode={isExploreMode}
            mouseOffset={mouseOffset}
            isDossierOpen={isDossierOpen}
            onIdleStateChange={onIdleStateChange}
          />

          {/* Realistic High-Contrast Automotive Studio Lighting */}
          <StudioEnvironment
            timelineProgress={timelineProgress}
            mouseOffset={mouseOffset}
            currentSpec={currentSpec}
          />

          {/* 360° Circular Modification & Detailing Studio Stage */}
          <CircularStudio
            timelineProgress={timelineProgress}
            currentSpec={currentSpec}
          />

          {/* Subordinate Cinematic Atmospheric Effects & Ground Haze */}
          {vfxSettings?.atmosphere !== false && (
            <StudioAtmosphere
              timelineProgress={timelineProgress}
              currentSpec={currentSpec}
            />
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
