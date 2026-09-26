import React, { useEffect, useRef } from 'react';

/**
 * TextureOverlay: Provides organic 35mm film emulsion grain, temporal variation,
 * photographic vignette, and subtle camera sensor exposure adaptation.
 */
export function TextureOverlay({
  timelineProgress,
  grainEnabled = true,
  exposureShiftEnabled = true,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use a lightweight 180x180 grain tile scaled to viewport via CSS
    const size = 180;
    canvas.width = size;
    canvas.height = size;

    // Generate 4 discrete frames of fine Gaussian film noise to cycle through (mimicking 24fps 35mm film stock)
    const frames = [];
    for (let f = 0; f < 4; f++) {
      const imgData = ctx.createImageData(size, size);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        // Subtle Gaussian luminance noise
        const val = Math.floor(Math.random() * 255);
        data[i] = val;     // R
        data[i + 1] = val; // G
        data[i + 2] = val; // B
        data[i + 3] = Math.floor(Math.random() * 45 + 10); // Alpha variation
      }
      frames.push(imgData);
    }

    let frameIndex = 0;
    let lastTime = 0;
    let animId;

    const render = (time) => {
      // Advance film grain at ~16 fps for organic film flicker (not machine-fast 60fps buzz)
      if (time - lastTime > 65) {
        frameIndex = (frameIndex + 1) % frames.length;
        ctx.putImageData(frames[frameIndex], 0, 0);
        lastTime = time;
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  // Compute dynamic grain opacity based on scene intensity:
  // Calm scenes (0.00-0.10, 0.88-0.94): ~0.038
  // Motion & transitions (0.20-0.30, 0.50-0.65, 0.78-0.88): ~0.065 - 0.080
  const p = timelineProgress;
  let dynamicGrainOpacity = 0.042;

  if ((p >= 0.16 && p <= 0.28) || (p >= 0.50 && p <= 0.65) || (p >= 0.78 && p <= 0.88)) {
    dynamicGrainOpacity = 0.068; // Slightly more cinematic grain during motion transitions
  } else if (p >= 0.88 && p <= 0.94) {
    dynamicGrainOpacity = 0.032; // Pristine calm during PURE FORM
  }

  if (!grainEnabled) {
    dynamicGrainOpacity = 0;
  }

  // Optical Camera Sensor Exposure Shift & Light Sweep:
  // Approaching headlight (0.52 -> 0.55): exposure slightly increases
  // Headlight transition sweep (0.55 -> 0.58): brief subtle peak
  // Settles back smoothly (0.58 -> 0.61)
  // Experimental transition (0.92 -> 0.96): subtle exposure breathe
  let exposureShiftOpacity = 0;
  if (exposureShiftEnabled) {
    if (p >= 0.52 && p <= 0.61) {
      exposureShiftOpacity = Math.sin(((p - 0.52) / 0.09) * Math.PI) * 0.18;
    } else if (p >= 0.92 && p <= 0.96) {
      exposureShiftOpacity = Math.sin(((p - 0.92) / 0.04) * Math.PI) * 0.08;
    }
  }

  return (
    <div className="cinematic-texture-system" aria-hidden="true">
      {/* 1. Animated Organic 35mm Film Grain Canvas */}
      <canvas
        ref={canvasRef}
        className="film-grain-canvas"
        style={{
          opacity: dynamicGrainOpacity,
          transition: 'opacity 0.6s ease',
        }}
      />

      {/* 2. Photographic Vignette (Natural corner falloff directing gaze to car & type) */}
      <div className="photographic-vignette" />

      {/* 3. Micro-luminance Atmospheric Bed (Replaces sterile 0,0,0 with photographic black) */}
      <div className="atmospheric-luminance-bed" />

      {/* 4. Optical Exposure Shift & Light Sweep Adaptation */}
      <div
        className="optical-exposure-shift"
        style={{
          opacity: exposureShiftOpacity,
        }}
      />
    </div>
  );
}
