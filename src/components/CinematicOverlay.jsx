import React from 'react';
import { SplitWord } from './typography/SplitWord';
import { MaskedText } from './typography/MaskedText';
import { MorphPair } from './typography/MorphPair';

export function CinematicOverlay({ timelineProgress }) {
  const p = timelineProgress;

  return (
    <div className="editorial-layer" aria-live="polite">
      {/* =========================================================================
          SCENE 01 — ARRIVAL (0.00 -> 0.07)
          No giant text. Let the image and opening crane shot breathe.
          Only microscopic, quiet editorial coordinates emerging from darkness.
          ========================================================================= */}
      {p >= 0.005 && p <= 0.075 && (
        <div
          className="editorial-micro-quiet"
          style={{
            opacity: Math.sin(((p - 0.005) / 0.07) * Math.PI),
            transform: `translate3d(0, ${(1 - Math.sin(((p - 0.005) / 0.07) * Math.PI)) * 12}px, 0)`,
          }}
        >
          <span className="editorial-tag-dim">BOWLING GREEN, KY // LAT 36.9903° N</span>
          <span className="editorial-tag-accent">HYDROFORMED ALUMINUM SPACEFRAME // MONOGRAPH</span>
        </div>
      )}

      {/* =========================================================================
          SCENE 02 — REVEAL (0.07 -> 0.22)
          "CORVETTE" — Enormous.
          Enters with horizontal drift, slight blur -> sharp, letter-by-letter stagger.
          Peak hold at 0.14 -> 0.17 with spaceframe factual note.
          Exit: slowly drifts with expanding tracking into darkness.
          ========================================================================= */}
      {p >= 0.07 && p <= 0.22 && (
        <div className="scene-container scene-reveal">
          <SplitWord
            text="CORVETTE"
            progress={p}
            start={0.07}
            peak={0.14}
            end={0.22}
            className="monumental-word frosted-letter-texture"
            direction="horizontal"
            maxBlur={14}
            trackingStart={-0.03}
            trackingEnd={0.07}
          />

          {/* Supporting spaceframe editorial fact revealed beneath */}
          {p >= 0.11 && p <= 0.20 && (
            <div
              className="editorial-sub-fact"
              style={{
                opacity: Math.sin(((p - 0.11) / 0.09) * Math.PI),
                transform: `translate3d(0, ${(1 - Math.sin(((p - 0.11) / 0.09) * Math.PI)) * 10}px, 0)`,
              }}
            >
              <span className="fact-kicker">ALL-ALUMINUM CHASSIS ARCHITECTURE</span>
              <p className="fact-copy">57% STIFFER & 99 LBS LIGHTER THAN STEEL</p>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SCENE 03 — FORM (0.22 -> 0.35)
          "FORM" — Single monumental word.
          Appears through a clean vertical mask reveal.
          Car sits behind it. Text remains still while camera moves.
          Near exit: tracking gently expands, dissolving into darkness.
          ========================================================================= */}
      {p >= 0.22 && p <= 0.35 && (
        <div className="scene-container scene-form">
          <MaskedText
            progress={p}
            start={0.22}
            holdStart={0.26}
            holdEnd={0.31}
            end={0.35}
            maskType="vertical-up"
          >
            <h1 className="monumental-word single-word-hero">FORM</h1>
          </MaskedText>
          <span
            className="editorial-sub-label"
            style={{
              opacity: p >= 0.25 && p <= 0.33 ? Math.sin(((p - 0.25) / 0.08) * Math.PI) : 0,
            }}
          >
            AERODYNAMIC PROFILE // MASS CONTOUR
          </span>
        </div>
      )}

      {/* =========================================================================
          SCENE 04 — CLOSE-UP / STANCE (0.35 -> 0.47)
          Silence from giant words. Contrast against giant typography.
          Micro-scale typography positioned high to leave wheels & calipers clear.
          ========================================================================= */}
      {p >= 0.35 && p <= 0.47 && (
        <div
          className="editorial-micro-stance"
          style={{
            opacity: Math.sin(((p - 0.35) / 0.12) * Math.PI),
            transform: `translate3d(0, ${(1 - Math.sin(((p - 0.35) / 0.12) * Math.PI)) * -18}px, 0)`,
          }}
        >
          <span className="micro-tag">MASS DISTRIBUTION & CHASSIS</span>
          <h2 className="micro-headline">50/50 BALANCE</h2>
          <div className="micro-specs-row">
            <span>BREMBO 4-PISTON MONOBLOC</span>
            <span className="dot-sep">•</span>
            <span>12.6" SLOTTED ROTORS</span>
            <span className="dot-sep">•</span>
            <span>60–0 MPH IN 107 FT</span>
          </div>
        </div>
      )}

      {/* =========================================================================
          SCENE 05 — HEADLIGHT (0.47 -> 0.60)
          Begins heavily blurred (blur 22px).
          Snaps into knife-edge optical sharpness at p = 0.54 exactly as camera nears
          the projector lens and the ignition flare peaks!
          ========================================================================= */}
      {p >= 0.47 && p <= 0.60 && (
        <div className="scene-container scene-headlight">
          {(() => {
            // Peak sharpness at 0.54
            const distFromPeak = Math.abs(p - 0.54);
            const blurAmount = Math.min(22, distFromPeak * 280);
            const opacity = Math.sin(((p - 0.47) / 0.13) * Math.PI);
            const slideX = (p - 0.54) * 80;

            return (
              <div
                className="headlight-optical-wrap"
                style={{
                  opacity,
                  filter: blurAmount > 0.4 ? `blur(${blurAmount.toFixed(1)}px)` : 'none',
                  transform: `translate3d(${slideX.toFixed(1)}px, 0, 0)`,
                  willChange: 'transform, opacity, filter',
                }}
              >
                <span className="editorial-kicker">OPTICAL & AERODYNAMIC DESIGN</span>
                <h2 className="monumental-optical-word">BI-XENON</h2>
                <span className="editorial-sub-technical">
                  PROJECTOR OPTICS // FORWARD CARBON HOOD EXTRACTOR BLEEDS FRONT-AXLE LIFT
                </span>
              </div>
            );
          })()}
        </div>
      )}

      {/* =========================================================================
          SCENE 06 — TRANSITION / DUAL-WORD MORPH (0.60 -> 0.68)
          Word A: "POWER" shrinks, softens, fades.
          Word B: "SPEED" enters, expands from small to large, sharpens.
          Both coexist and overlap during transition like a cinematic double exposure.
          ========================================================================= */}
      {p >= 0.60 && p <= 0.68 && (
        <div className="scene-container scene-morph">
          <MorphPair
            wordA="POWER"
            wordB="SPEED"
            progress={p}
            start={0.60}
            midpoint={0.64}
            end={0.68}
            className="monumental-word morph-display"
          />
        </div>
      )}

      {/* =========================================================================
          SCENE 07 — PERFORMANCE (0.68 -> 0.79)
          Huge raw typographic number: "460" — massive, partially cropped by viewport edges!
          No card, no panel, no box. Pure raw monumental typography.
          Contracts smoothly into final composition with verified technical labels.
          ========================================================================= */}
      {p >= 0.68 && p <= 0.79 && (
        <div className="scene-container scene-performance">
          {(() => {
            const span = 0.79 - 0.68;
            const t = Math.max(0, Math.min(1, (p - 0.68) / span));
            const opacity = Math.sin(t * Math.PI);
            // Contracts from massive 1.25x scale down to 1.0x
            const scale = 1.25 - t * 0.25;

            return (
              <div
                className="monumental-number-block"
                style={{
                  opacity,
                  transform: `scale(${scale.toFixed(3)})`,
                  willChange: 'transform, opacity',
                }}
              >
                <div className="huge-number-display">460</div>
                <div className="number-label-stack">
                  <span className="num-unit">PEAK HORSEPOWER @ 6,000 RPM</span>
                  <div className="num-secondary-row">
                    <span>6.2L LT1 SMALL-BLOCK V8</span>
                    <span className="dot-sep">•</span>
                    <span>465 LB-FT TORQUE</span>
                    <span className="dot-sep">•</span>
                    <span>0–60 IN 3.6S</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* =========================================================================
          SCENE 08 — INTENSITY / EXHAUST (0.79 -> 0.88)
          Giant single word: "QUAD PIPES".
          Subtle horizontal letter stretch. Deep red backlight reflecting behind.
          Exits completely, leaving frame empty for a silent moment.
          ========================================================================= */}
      {p >= 0.79 && p <= 0.88 && (
        <div className="scene-container scene-exhaust">
          {(() => {
            const span = 0.88 - 0.79;
            const t = Math.max(0, Math.min(1, (p - 0.79) / span));
            const opacity = Math.sin(t * Math.PI);
            const stretchX = 1.08 - t * 0.08;

            return (
              <div
                className="exhaust-editorial-wrap"
                style={{
                  opacity,
                  transform: `scale3d(${stretchX.toFixed(3)}, 1, 1)`,
                  willChange: 'transform, opacity',
                }}
              >
                <span className="editorial-kicker kicker-red">ACTIVE DUAL-MODE EXHAUST</span>
                <h1 className="monumental-word word-exhaust">QUAD PIPES</h1>
                <p className="editorial-sub">
                  FOUR 4-INCH POLISHED STAINLESS OUTLETS // ACTIVE ACOUSTIC VALVES
                </p>
              </div>
            );
          })()}
        </div>
      )}

      {/* =========================================================================
          SCENE 09 — PAUSE (0.88 -> 0.92)
          Intentional silence. No large typography.
          Only tiny micro-text: "07 // PURE FORM". Let car and camera carry the scene.
          ========================================================================= */}
      {p >= 0.88 && p <= 0.92 && (
        <div
          className="editorial-silence-pause"
          style={{
            opacity: Math.sin(((p - 0.88) / 0.04) * Math.PI),
          }}
        >
          <span className="silence-dot">●</span>
          <span className="silence-txt">07 // PURE FORM — STILL PHOTOGRAPHY</span>
        </div>
      )}

      {/* =========================================================================
          SCENE 10 — TEXTURE TRANSITION (0.92 -> 0.96)
          Large word begins clean, subtle film grain intensifies inside letters via
          background-clip text, and dissolves into textured dark mist.
          ========================================================================= */}
      {p >= 0.92 && p <= 0.96 && (
        <div className="scene-container scene-texture-dissolve">
          {(() => {
            const t = (p - 0.92) / 0.04;
            const opacity = Math.sin(t * Math.PI);
            const blur = t * 10;

            return (
              <div
                className="textured-dissolve-word"
                style={{
                  opacity,
                  filter: blur > 0.4 ? `blur(${blur.toFixed(1)}px)` : 'none',
                  letterSpacing: `${(0.04 + t * 0.12).toFixed(3)}em`,
                }}
              >
                SYNTHESIS
              </div>
            );
          })()}
        </div>
      )}

      {/* =========================================================================
          SCENE 11 — FINAL REVEAL (0.96 -> 1.00)
          "CORVETTE // STINGRAY C7"
          Calm, monumental, authoritative. Emerges from deep near-black darkness.
          Holds perfectly stable. No looping pulse. Pure photographic majesty.
          ========================================================================= */}
      {p >= 0.96 && (
        <div
          className="scene-container scene-finale"
          style={{
            opacity: Math.min(1, (p - 0.96) / 0.03),
            transform: `scale(${0.98 + Math.min(0.02, (p - 0.96) * 0.5)})`,
          }}
        >
          <span className="editorial-kicker kicker-finale">THE PROTAGONIST</span>
          <h1 className="monumental-word finale-monument">CORVETTE</h1>
          <h2 className="finale-sub-title">STINGRAY C7</h2>
          <div className="finale-specs-line">
            <span>6.2L V8</span>
            <span className="dot-sep">•</span>
            <span>460 HP</span>
            <span className="dot-sep">•</span>
            <span>ALUMINUM SPACEFRAME</span>
            <span className="dot-sep">•</span>
            <span>BOWLING GREEN, KY</span>
          </div>
          <span className="finale-prompt">
            SCRUB TIMELINE // OR ACTIVATE [ EXPLORE 360° ]
          </span>
        </div>
      )}
    </div>
  );
}
