import React, { useMemo } from 'react';

/**
 * CinematicPreloader: Automotive Cinema Prologue & Progressive Assembly
 *
 * Implements the 8-Phase Visual Assembly Progression:
 * 1. Darkness: Pure carbon/graphite background with organic film texture
 * 2. Typographic Arrival: Masked monumental title emerging with spatial tracking
 * 3. Atmosphere: Ambient breathing gradient in negative space
 * 4. Light Appears: Anamorphic horizontal gleam drifting across title
 * 5. Environment Reveal: Backdrop smoothly unveils underlying Three.js circular studio
 * 6. Car Silhouette: Car contours and lighting emerge without visual popping
 * 7. Material Reveal: Gloss and reflections catch the eye
 * 8. Seamless Hand-off: Preloader dissolves directly into Scene 01 crane shot
 */
export function CinematicPreloader({
  displayProgress,
  statusMessage,
  isCriticalReady,
  isExperienceReady,
}) {
  // Letters for masked typographic emergence
  const titleLetters = useMemo(() => 'CORVETTE'.split(''), []);

  // Calculate phase-driven visual parameters
  const p = Math.max(0, Math.min(100, displayProgress));

  // Background veil opacity: Stays opaque during early loading,
  // then gracefully unveils the real 3D studio and silhouette from 45% -> 95%
  let backdropOpacity = 1.0;
  if (p > 45) {
    backdropOpacity = Math.max(0, 1.0 - (p - 45) / 50);
  }

  // Preloader UI visibility: dissolves away cleanly when experience is ready
  const isExiting = isExperienceReady || (p >= 99 && isCriticalReady);

  return (
    <div
      className={`cinematic-preloader-root ${isExiting ? 'preloader-exiting' : ''}`}
      aria-live="polite"
      aria-label="Loading Cinematic Experience"
    >
      {/* Dynamic atmospheric veil (fades to unveil real 3D scene underneath) */}
      <div
        className="preloader-veil"
        style={{
          opacity: isExiting ? 0 : backdropOpacity,
          transition: 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      {/* Anamorphic Light Beam Drift (Phase 04) */}
      <div
        className="preloader-anamorphic-beam"
        style={{
          transform: `translateX(${(p - 50) * 2.2}%)`,
          opacity: p > 20 && p < 95 ? 0.35 : 0,
        }}
      />

      {/* Main Composition Container */}
      <div className="preloader-content-wrap">
        {/* Monograph Top Kicker */}
        <div className="preloader-kicker-wrap">
          <span className="preloader-kicker-dot" />
          <span className="preloader-kicker-text">
            AUTOMOTIVE MONOGRAPH // {statusMessage}
          </span>
        </div>

        {/* Monumental Masked Typography (Phase 02 & 03) */}
        <div className="preloader-title-container">
          <h1 className="preloader-hero-title">
            {titleLetters.map((char, index) => {
              const letterThreshold = 10 + index * 5;
              const isRevealed = p >= letterThreshold;

              return (
                <span
                  key={index}
                  className={`preloader-char ${isRevealed ? 'char-revealed' : ''}`}
                  style={{
                    transitionDelay: `${index * 35}ms`,
                  }}
                >
                  {char}
                </span>
              );
            })}
          </h1>
        </div>

        {/* Minimalist Subtitle */}
        <div className="preloader-subtext-wrap">
          <span className="preloader-subtext">
            CHEVROLET C7 STINGRAY // AMERICAN GRAND TOURING
          </span>
        </div>

        {/* Minimal Typographic Progress Indicator (Phase 01-08) */}
        <div className="preloader-footer">
          <div className="preloader-meta-left">
            <span className="preloader-edition-tag">C7 // ATELIER</span>
          </div>

          {/* Hairline Precision Progress Rail */}
          <div className="preloader-rail-track">
            <div
              className="preloader-rail-fill"
              style={{ width: `${p}%` }}
            />
          </div>

          {/* Eased Numerical Counter */}
          <div className="preloader-counter-wrap">
            <span className="preloader-counter-num">
              {p.toString().padStart(2, '0')}
            </span>
            <span className="preloader-counter-percent">%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
