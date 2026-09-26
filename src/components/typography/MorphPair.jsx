import React from 'react';

/**
 * MorphPair: Implements Scene 06 dual-word cinematic crossfade and scale morph.
 * Word A shrinks and softens while Word B expands and sharpens, overlapping seamlessly.
 */
export function MorphPair({
  wordA,
  wordB,
  progress,
  start,
  _midpoint,
  end,
  className = '',
  style = {},
}) {
  if (progress < start || progress > end) {
    return null;
  }

  // Normalized phase: 0 = start, 0.5 = midpoint (full overlap), 1 = end
  const span = end - start || 0.001;
  const t = Math.max(0, Math.min(1, (progress - start) / span));

  // Word A parameters (dominant in first half, softens and shrinks in second half)
  let opacityA = 1;
  let scaleA = 1;
  let blurA = 0;
  let translateY_A = 0;

  if (t < 0.35) {
    opacityA = Math.min(1, t / 0.15);
    scaleA = 1.05 - t * 0.1;
    blurA = (1 - opacityA) * 10;
  } else {
    const fadeOutT = (t - 0.35) / 0.45; // fades out by t = 0.8
    opacityA = Math.max(0, 1 - fadeOutT);
    scaleA = 0.98 - fadeOutT * 0.12;
    blurA = fadeOutT * 12;
    translateY_A = -fadeOutT * 30;
  }

  // Word B parameters (enters during overlap around t = 0.4, peaks at t = 0.85)
  let opacityB = 0;
  let scaleB = 0.88;
  let blurB = 14;
  let translateY_B = 30;

  if (t >= 0.32) {
    const enterT = Math.min(1, (t - 0.32) / 0.45);
    opacityB = enterT;
    scaleB = 0.9 + enterT * 0.1;
    blurB = (1 - enterT) * 12;
    translateY_B = (1 - enterT) * 25;

    // Exit of Word B towards end of segment
    if (t > 0.88) {
      const exitT = (t - 0.88) / 0.12;
      opacityB = Math.max(0, 1 - exitT);
      translateY_B = -exitT * 20;
    }
  }

  return (
    <div className={`morph-pair-container ${className}`} style={{ ...style, position: 'relative' }}>
      {/* Word A (e.g. POWER) */}
      {opacityA > 0.01 && (
        <div
          className="morph-word word-a"
          style={{
            opacity: opacityA,
            filter: blurA > 0.4 ? `blur(${blurA.toFixed(1)}px)` : 'none',
            transform: `translate3d(0, ${translateY_A.toFixed(1)}px, 0) scale(${scaleA.toFixed(3)})`,
            position: opacityB > 0.01 ? 'absolute' : 'relative',
            willChange: 'transform, opacity, filter',
          }}
        >
          {wordA}
        </div>
      )}

      {/* Word B (e.g. SPEED) */}
      {opacityB > 0.01 && (
        <div
          className="morph-word word-b"
          style={{
            opacity: opacityB,
            filter: blurB > 0.4 ? `blur(${blurB.toFixed(1)}px)` : 'none',
            transform: `translate3d(0, ${translateY_B.toFixed(1)}px, 0) scale(${scaleB.toFixed(3)})`,
            willChange: 'transform, opacity, filter',
          }}
        >
          {wordB}
        </div>
      )}
    </div>
  );
}
