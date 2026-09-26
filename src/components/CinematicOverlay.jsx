import React from 'react';
import { MaskedText } from './typography/MaskedText';

/**
 * CinematicOverlay: Compositional Editorial Typography System
 *
 * Implements:
 * - 4 intentional blue-marked compositional areas:
 *   1. Top-Left (.comp-zone-tl): Above hood/windshield negative space
 *   2. Top-Right (.comp-zone-tr): Above rear haunch/quarter negative space
 *   3. Bottom-Left (.comp-zone-bl): Ground plane negative space in front of wheels
 *   4. Bottom-Floor (.comp-zone-bf): Ground plane negative space under/behind car
 * - Supports font choice via fontMode:
 *   - 'barlow': The authentic, original clean condensed editorial font
 *   - 'shoulders': The monumental display font with tight tracking
 * - Large bold/condensed typography with strong whitespace.
 * - Extremely limited wording (1 monumental headline + minimal editorial meta).
 * - Scroll-synchronized parallax and entrance/exit relaxation.
 * - Never fills every blue area simultaneously; distinct moments highlight distinct quadrants.
 */
export function CinematicOverlay({ timelineProgress, fontMode = 'barlow', isIdle = false }) {
  const p = timelineProgress;

  return (
    <div
      className={`editorial-layer font-mode-${fontMode} ${isIdle ? 'is-idle' : ''}`}
      aria-live="polite"
    >
      {/* =========================================================================
          MOMENT 01: ARRIVAL & MONOGRAPH (0.01 -> 0.16, peak ~0.08)
          ZONE: TOP-LEFT BLUE AREA (Above front hood/fender)
          Oversized condensed CORVETTE statement in negative space.
          ========================================================================= */}
      {p >= 0.01 && p <= 0.16 && (
        (() => {
          const t = (p - 0.01) / 0.15;
          const opacity = Math.sin(t * Math.PI);
          const parallaxY = (p - 0.08) * -50;

          return (
            <div
              className="comp-zone comp-zone-tl"
              style={{
                opacity,
                transform: `translate3d(0, ${parallaxY.toFixed(1)}px, 0)`,
              }}
            >
              <span className="comp-kicker">AUTOMOTIVE MONOGRAPH // 01</span>
              <h1 className="comp-hero-title">CORVETTE</h1>
              <p className="comp-subtext">C7 STINGRAY // SEVENTH GENERATION AMERICAN GT</p>
            </div>
          );
        })()
      )}

      {/* =========================================================================
          MOMENT 02: SPACEFRAME ARCHITECTURE (0.16 -> 0.32, peak ~0.24)
          ZONE: TOP-RIGHT BLUE AREA (Above rear haunches)
          Monumental SPACEFRAME headline with masked entry.
          ========================================================================= */}
      {p >= 0.16 && p <= 0.32 && (
        (() => {
          const t = (p - 0.16) / 0.16;
          const opacity = Math.sin(t * Math.PI);
          const parallaxY = (p - 0.24) * -45;

          return (
            <div
              className="comp-zone comp-zone-tr"
              style={{
                opacity,
                transform: `translate3d(0, ${parallaxY.toFixed(1)}px, 0)`,
              }}
            >
              <span className="comp-kicker comp-kicker-accent">CHASSIS ARCHITECTURE // 02</span>
              <MaskedText
                progress={p}
                start={0.16}
                holdStart={0.21}
                holdEnd={0.27}
                end={0.32}
                maskType="vertical-up"
              >
                <h1 className="comp-hero-title">SPACEFRAME</h1>
              </MaskedText>
              <p className="comp-subtext">HYDROFORMED ALUMINUM // 57% STIFFER THAN STEEL</p>
            </div>
          );
        })()
      )}

      {/* =========================================================================
          MOMENT 03: PROFILE & BREMBO BRAKING (0.32 -> 0.46, peak ~0.39)
          ZONE: BOTTOM-LEFT BLUE AREA (Ground floor in front of front wheel)
          Massive BREMBO typography positioned low in the floor negative space.
          ========================================================================= */}
      {p >= 0.32 && p <= 0.46 && (
        (() => {
          const t = (p - 0.32) / 0.14;
          const opacity = Math.sin(t * Math.PI);
          const parallaxY = (p - 0.39) * 35;

          return (
            <div
              className="comp-zone comp-zone-bl"
              style={{
                opacity,
                transform: `translate3d(0, ${parallaxY.toFixed(1)}px, 0)`,
              }}
            >
              <span className="comp-kicker">DECELERATION MATRIX // 03</span>
              <h1 className="comp-hero-title">BREMBO</h1>
              <p className="comp-subtext">4-PISTON MONOBLOC // 60–0 MPH IN 107 FT</p>
            </div>
          );
        })()
      )}

      {/* =========================================================================
          MOMENT 04: BI-XENON OPTICS (0.46 -> 0.60, peak ~0.53)
          ZONE: TOP-LEFT BLUE AREA (Above headlight / hood)
          Optical focus with letter stagger.
          ========================================================================= */}
      {p >= 0.46 && p <= 0.60 && (
        (() => {
          const t = (p - 0.46) / 0.14;
          const opacity = Math.sin(t * Math.PI);
          const slideX = (p - 0.53) * 60;
          const distFromPeak = Math.abs(p - 0.53);
          const blur = Math.min(16, distFromPeak * 240);

          return (
            <div
              className="comp-zone comp-zone-tl"
              style={{
                opacity,
                filter: blur > 0.4 ? `blur(${blur.toFixed(1)}px)` : 'none',
                transform: `translate3d(${slideX.toFixed(1)}px, 0, 0)`,
              }}
            >
              <span className="comp-kicker comp-kicker-accent">OPTICAL & AERO // 04</span>
              <h1 className="comp-hero-title">BI-XENON</h1>
              <p className="comp-subtext">CARBON HOOD EXTRACTOR BLEEDS FRONT-AXLE LIFT</p>
            </div>
          );
        })()
      )}

      {/* =========================================================================
          MOMENT 05: POWERTRAIN OUTPUT & PERFORMANCE (0.60 -> 0.76, peak ~0.68)
          ZONE: TOP-RIGHT BLUE AREA (Benchmark HP) & BOTTOM-LEFT BLUE AREA (0-60 Sprint)
          ========================================================================= */}
      {p >= 0.60 && p <= 0.76 && (
        (() => {
          const t = (p - 0.60) / 0.16;
          const opacity = Math.sin(t * Math.PI);
          const parallaxTR = (p - 0.68) * -40;
          const parallaxBL = (p - 0.68) * 35;

          return (
            <>
              {/* Top-Right: 460 HP Benchmark */}
              <div
                className="comp-zone comp-zone-tr"
                style={{
                  opacity,
                  transform: `translate3d(0, ${parallaxTR.toFixed(1)}px, 0)`,
                }}
              >
                <span className="comp-kicker">POWERTRAIN OUTPUT // 05</span>
                <div className="comp-hero-stat">460</div>
                <p className="comp-subtext">PEAK HORSEPOWER @ 6,000 RPM // 6.2L LT1 V8</p>
              </div>

              {/* Bottom-Left: 3.6s Sprint */}
              <div
                className="comp-zone comp-zone-bl"
                style={{
                  opacity,
                  transform: `translate3d(0, ${parallaxBL.toFixed(1)}px, 0)`,
                }}
              >
                <span className="comp-kicker comp-kicker-accent">SPRINT // 0-60 MPH</span>
                <div className="comp-hero-stat-compact">3.6s</div>
                <p className="comp-subtext">465 LB-FT TORQUE // Z51 PERFORMANCE TESTED</p>
              </div>
            </>
          );
        })()
      )}

      {/* =========================================================================
          MOMENT 06: ACTIVE DUAL-MODE EXHAUST (0.76 -> 0.88, peak ~0.82)
          ZONE: BOTTOM-FLOOR BLUE AREA (Ground floor below rear quad tips)
          ========================================================================= */}
      {p >= 0.76 && p <= 0.88 && (
        (() => {
          const t = (p - 0.76) / 0.12;
          const opacity = Math.sin(t * Math.PI);
          const parallaxY = (p - 0.82) * 30;

          return (
            <div
              className="comp-zone comp-zone-bf"
              style={{
                opacity,
                transform: `translate3d(0, ${parallaxY.toFixed(1)}px, 0)`,
              }}
            >
              <span className="comp-kicker comp-kicker-accent">DUAL-MODE VALVES (NPP) // 06</span>
              <h1 className="comp-hero-title">QUAD PIPES</h1>
              <p className="comp-subtext">FOUR 4-INCH POLISHED STAINLESS OUTLETS // ACTIVE ACOUSTIC BARK</p>
            </div>
          );
        })()
      )}

      {/* =========================================================================
          MOMENT 07: SILENCE & PURE FORM (0.88 -> 0.93)
          Visual pause. Microscopic quiet mark.
          ========================================================================= */}
      {p >= 0.88 && p <= 0.93 && (
        (() => {
          const t = (p - 0.88) / 0.05;
          const opacity = Math.sin(t * Math.PI);

          return (
            <div
              className="comp-zone comp-zone-bl"
              style={{
                opacity,
                transform: 'translate3d(0, 0, 0)',
              }}
            >
              <span className="comp-kicker">07 // PURE FORM</span>
              <p className="comp-subtext">STILL PHOTOGRAPHY // MOTION IN BLACK</p>
            </div>
          );
        })()
      )}

      {/* =========================================================================
          MOMENT 08: MONUMENTAL FINALE (0.93 -> 1.00)
          ZONE: TOP-LEFT BLUE AREA (Monumental Finale Statement)
          ========================================================================= */}
      {p >= 0.93 && (
        (() => {
          const t = Math.min(1, (p - 0.93) / 0.04);
          const opacity = t;
          const scale = 0.96 + t * 0.04;

          return (
            <div
              className="comp-zone comp-zone-tl"
              style={{
                opacity,
                transform: `scale(${scale.toFixed(3)})`,
              }}
            >
              <span className="comp-kicker comp-kicker-accent">THE PROTAGONIST // FINALE</span>
              <h1 className="comp-hero-title grand-hero">CORVETTE</h1>
              <p className="comp-subtext">STINGRAY C7 // ENGINEERED IN BOWLING GREEN, KY</p>
            </div>
          );
        })()
      )}
    </div>
  );
}
