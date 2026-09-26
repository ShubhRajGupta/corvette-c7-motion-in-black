import React from 'react';

/**
 * MaskedText: Renders typography revealed through a physical geometric clip mask.
 * Mask reveals from bottom/top/left/right as timeline progress scrubs.
 */
export function MaskedText({
  children,
  progress,
  start,
  holdStart,
  holdEnd,
  end,
  maskType = 'vertical-up', // 'vertical-up' | 'vertical-down' | 'horizontal-right' | 'horizontal-left'
  className = '',
  style = {},
}) {
  let maskProgress = 0; // 0 = fully hidden, 1 = fully revealed
  let exitProgress = 0; // 0 = fully present, 1 = fully exited
  let opacity = 0;
  let transform = '';

  if (progress < start || progress > end) {
    return null;
  }

  if (progress < holdStart) {
    // Entrance phase
    const t = Math.max(0, Math.min(1, (progress - start) / (holdStart - start || 0.001)));
    maskProgress = t;
    opacity = t;
    const dy = (1 - t) * 35;
    transform = `translate3d(0, ${dy.toFixed(1)}px, 0)`;
  } else if (progress <= holdEnd) {
    // Presence / Hold phase
    maskProgress = 1;
    exitProgress = 0;
    opacity = 1;
    // Micro-motion breathing during hold (subconscious drift < 2px)
    const holdSpan = holdEnd - holdStart || 1;
    const ht = (progress - holdStart) / holdSpan;
    const driftY = (ht - 0.5) * 3;
    transform = `translate3d(0, ${driftY.toFixed(1)}px, 0)`;
  } else {
    // Exit phase
    const t = Math.max(0, Math.min(1, (progress - holdEnd) / (end - holdEnd || 0.001)));
    exitProgress = t;
    maskProgress = 1;
    opacity = 1 - t;
    const dy = -t * 25;
    transform = `translate3d(0, ${dy.toFixed(1)}px, 0)`;
  }

  // Calculate CSS clip-path based on mask type
  let clipPath = 'none';
  if (maskType === 'vertical-up') {
    const insetBottom = ((1 - maskProgress) * 100).toFixed(1);
    const insetTop = (exitProgress * 100).toFixed(1);
    clipPath = `inset(${insetTop}% 0% ${insetBottom}% 0%)`;
  } else if (maskType === 'vertical-down') {
    const insetTop = ((1 - maskProgress) * 100).toFixed(1);
    const insetBottom = (exitProgress * 100).toFixed(1);
    clipPath = `inset(${insetTop}% 0% ${insetBottom}% 0%)`;
  } else if (maskType === 'horizontal-right') {
    const insetRight = ((1 - maskProgress) * 100).toFixed(1);
    const insetLeft = (exitProgress * 100).toFixed(1);
    clipPath = `inset(0% ${insetRight}% 0% ${insetLeft}%)`;
  }

  return (
    <div
      className={`masked-text-wrapper ${className}`}
      style={{
        ...style,
        opacity,
        clipPath,
        WebkitClipPath: clipPath,
        transform,
        willChange: 'clip-path, transform, opacity',
      }}
    >
      {children}
    </div>
  );
}
