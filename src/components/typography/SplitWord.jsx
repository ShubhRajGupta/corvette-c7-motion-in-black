import React from 'react';

/**
 * SplitWord: Renders a display word with micro-temporal letter separation.
 * Each letter has its own subtle transform, opacity, and blur offset based on timeline progress.
 */
export function SplitWord({
  text,
  progress,
  start,
  peak,
  end,
  className = '',
  style = {},
  direction = 'horizontal', // 'horizontal' | 'vertical' | 'scale'
  maxBlur = 12,
  trackingStart = -0.02,
  trackingEnd = 0.08,
}) {
  const letters = text.split('');
  const totalLetters = letters.length;

  // Normalized phase: 0 before start, ramp to 1 at peak, ramp to 0 at end
  const calcLetterState = (index) => {
    // Micro-delay per letter (subtle, elegant, non-typewriter)
    const stagger = (index / totalLetters) * 0.035;
    const letterStart = start + stagger;
    const letterPeak = peak + stagger * 0.5;
    const letterEnd = end + stagger * 0.3;

    let opacity = 0;
    let blur = maxBlur;
    let translateY = 0;
    let translateX = 0;
    let scale = 1;

    if (progress < letterStart || progress > letterEnd) {
      return { opacity: 0, blur: maxBlur, translateY: 30, translateX: -20, scale: 0.95 };
    }

    if (progress <= letterPeak) {
      // Entrance phase
      const t = Math.max(0, Math.min(1, (progress - letterStart) / (letterPeak - letterStart || 0.001)));
      opacity = t;
      blur = maxBlur * (1 - t);
      if (direction === 'horizontal') {
        translateX = (1 - t) * -28;
      } else if (direction === 'vertical') {
        translateY = (1 - t) * 25;
      }
      scale = 0.95 + t * 0.05;
    } else {
      // Exit phase
      const t = Math.max(0, Math.min(1, (progress - letterPeak) / (letterEnd - letterPeak || 0.001)));
      opacity = 1 - t;
      blur = maxBlur * t * 0.7;
      if (direction === 'horizontal') {
        translateX = t * 30;
      } else if (direction === 'vertical') {
        translateY = t * -25;
      }
      scale = 1 - t * 0.04;
    }

    return { opacity, blur, translateY, translateX, scale };
  };

  // Master tracking expansion
  let currentTracking = trackingStart;
  if (progress >= start && progress <= end) {
    const t = (progress - start) / (end - start || 1);
    currentTracking = trackingStart + (trackingEnd - trackingStart) * t;
  }

  return (
    <span
      className={`split-word-container ${className}`}
      style={{
        ...style,
        letterSpacing: `${currentTracking}em`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        whiteSpace: 'nowrap',
      }}
      aria-label={text}
    >
      {letters.map((char, idx) => {
        const { opacity, blur, translateY, translateX, scale } = calcLetterState(idx);
        return (
          <span
            key={`${char}-${idx}`}
            className="split-letter"
            style={{
              display: 'inline-block',
              opacity,
              filter: blur > 0.5 ? `blur(${blur.toFixed(1)}px)` : 'none',
              transform: `translate3d(${translateX.toFixed(1)}px, ${translateY.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`,
              willChange: 'transform, opacity, filter',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      })}
    </span>
  );
}
