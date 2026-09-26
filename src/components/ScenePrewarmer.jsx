import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';

/**
 * ScenePrewarmer
 *
 * Compiles all materials, shaders, and shadow maps on the GPU during the preloader phase
 * to eliminate the notorious "first-scroll stutter" / WebGL pipeline hitch.
 */
export function ScenePrewarmer({ onPrewarmed }) {
  const { gl, scene, camera } = useThree();
  const hasPrewarmedRef = useRef(false);

  useEffect(() => {
    if (hasPrewarmedRef.current) return;

    // Small delay to allow nested models / materials to complete initial tree mount
    const timer = setTimeout(() => {
      try {
        if (gl && scene && camera) {
          // Prewarm and compile all WebGL shader programs into GPU memory
          gl.compile(scene, camera);

          // Perform initial silent single-frame render pass to allocate shadow maps & post-processing textures
          gl.render(scene, camera);
        }
      } catch (err) {
        console.warn('Scene prewarm notice:', err);
      } finally {
        hasPrewarmedRef.current = true;
        onPrewarmed?.();
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [gl, scene, camera, onPrewarmed]);

  return null;
}
