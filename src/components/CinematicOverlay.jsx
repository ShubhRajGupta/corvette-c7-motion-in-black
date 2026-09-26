import React from 'react';

export function CinematicOverlay({ timelineProgress }) {
  const p = timelineProgress;

  // Helper function to calculate smooth opacity based on progress range
  const getSectionOpacity = (start, fadeInEnd, fadeOutStart, end) => {
    if (p < start || p > end) return 0;
    if (p >= fadeInEnd && p <= fadeOutStart) return 1;
    if (p < fadeInEnd) {
      return (p - start) / (fadeInEnd - start);
    }
    return 1 - (p - fadeOutStart) / (end - fadeOutStart);
  };

  // Seamless, gap-free section opacities for continuous film scrubbing
  const opIntro = getSectionOpacity(0.01, 0.04, 0.12, 0.16);
  const opCorvette = getSectionOpacity(0.15, 0.19, 0.28, 0.32);
  const opStance = getSectionOpacity(0.31, 0.35, 0.44, 0.48);
  const opLight = getSectionOpacity(0.47, 0.51, 0.58, 0.62);
  const opSpecs = getSectionOpacity(0.61, 0.65, 0.74, 0.78);
  const opRear = getSectionOpacity(0.77, 0.80, 0.86, 0.89);
  const opPureForm = getSectionOpacity(0.88, 0.90, 0.93, 0.95);
  const opFinale = getSectionOpacity(0.94, 0.97, 0.99, 1.0);

  return (
    <div className="editorial-layer">
      {/* 0.01 -> 0.16 : Silence / Opening statement */}
      {opIntro > 0 && (
        <div
          className="editorial-statement"
          style={{
            opacity: opIntro,
            transform: `translateY(${(1 - opIntro) * 20}px)`,
          }}
        >
          <span className="editorial-kicker">AUTOMOTIVE MONOGRAPH</span>
          <h2 className="editorial-headline">MOTION IN BLACK</h2>
          <p className="editorial-sub">
            The seventh-generation American grand touring icon. Engineered in Bowling Green, Kentucky with an all-aluminum hydroformed spaceframe.
          </p>
        </div>
      )}

      {/* 0.15 -> 0.32 : Giant CORVETTE Viewport Heading & Spaceframe Fact */}
      {opCorvette > 0 && (
        <div
          style={{
            opacity: opCorvette,
            transform: `scale(${0.96 + opCorvette * 0.04})`,
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h1 className="monumental-word stroked">CORVETTE</h1>
          <span className="editorial-footnote" style={{ marginTop: '8px', opacity: 0.8 }}>
            HYDROFORMED ALUMINUM SPACEFRAME // 57% STIFFER & 99 LBS LIGHTER THAN STEEL
          </span>
        </div>
      )}

      {/* 0.31 -> 0.48 : Side Profile Stance (Positioned high to keep wheels & calipers clear) */}
      {opStance > 0 && (
        <div
          className="editorial-statement"
          style={{
            opacity: opStance,
            transform: `translateY(${(1 - opStance) * -30 - 80}px)`,
          }}
        >
          <span className="editorial-kicker">MASS DISTRIBUTION & BRAKING</span>
          <h2 className="editorial-headline">LOW. WIDE. UNFORGIVING.</h2>
          <p className="editorial-sub">
            50/50 near-perfect front-to-rear mass balance. Brembo 4-piston monobloc calipers clamping 12.6-inch slotted rotors halt the car 60–0 mph in 107 feet.
          </p>
        </div>
      )}

      {/* 0.47 -> 0.62 : Macro Headlight Detail (Positioned right to leave headlight on left completely clear) */}
      {opLight > 0 && (
        <div
          className="editorial-statement"
          style={{
            opacity: opLight,
            transform: `translateX(${(1 - opLight) * 30}px)`,
            alignItems: 'flex-end',
            textAlign: 'right',
            width: '85%',
            maxWidth: '1000px',
          }}
        >
          <span className="editorial-kicker">OPTICAL & AERODYNAMIC DESIGN</span>
          <h2 className="editorial-headline" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 5rem)' }}>
            BI-XENON PROJECTOR.
          </h2>
          <p className="editorial-sub">
            Forward-tilted radiator vents high-velocity air through the carbon hood scoop to bleed aerodynamic front-axle lift and generate negative downforce.
          </p>
        </div>
      )}

      {/* 0.61 -> 0.78 : Giant Performance Specifications Grid with verified benchmarks */}
      {opSpecs > 0 && (
        <div
          className="spec-grid-wrap"
          style={{
            opacity: opSpecs,
            transform: `scale(${0.94 + opSpecs * 0.06})`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <div className="spec-grid">
            <div className="spec-item">
              <span className="spec-unit">POWERTRAIN</span>
              <div className="spec-value">6.2L</div>
              <span className="spec-desc">LT1 SMALL-BLOCK V8</span>
            </div>

            <div className="spec-item">
              <span className="spec-unit">OUTPUT</span>
              <div className="spec-value">460</div>
              <span className="spec-desc">PEAK HP @ 6,000 RPM</span>
            </div>

            <div className="spec-item">
              <span className="spec-unit">TORQUE</span>
              <div className="spec-value">465</div>
              <span className="spec-desc">LB-FT @ 4,600 RPM</span>
            </div>

            <div className="spec-item">
              <span className="spec-unit">0–60 MPH</span>
              <div className="spec-value highlight">3.6s</div>
              <span className="spec-desc">Z51 PERFORMANCE TESTED</span>
            </div>
          </div>

          <div className="spec-secondary-bar">
            <span>TOP SPEED: 195 MPH (314 KM/H)</span>
            <span className="bar-divider">•</span>
            <span>1/4 MILE: 11.9S @ 119.5 MPH</span>
            <span className="bar-divider">•</span>
            <span>LATERAL GRIP: 1.05 G</span>
            <span className="bar-divider">•</span>
            <span>DRY SUMP OILING</span>
          </div>
        </div>
      )}

      {/* 0.77 -> 0.89 : Rear taillights and quad exhaust (Positioned high to show glowing rear exhaust & red underbody) */}
      {opRear > 0 && (
        <div
          className="editorial-statement"
          style={{
            opacity: opRear,
            transform: `translateY(${(1 - opRear) * -30 - 70}px)`,
          }}
        >
          <span className="editorial-kicker">ACTIVE DUAL-MODE EXHAUST (NPP)</span>
          <h2 className="editorial-headline">QUAD 4-INCH PIPES.</h2>
          <p className="editorial-sub">
            Four central polished stainless tips with active butterfly bypass valves that open under throttle for unrestricted gas evacuation and acoustic bark.
          </p>
        </div>
      )}

      {/* 0.88 -> 0.95 : Silence / Still Photography Pause */}
      {opPureForm > 0 && (
        <div
          className="editorial-statement"
          style={{
            opacity: opPureForm,
            transform: `scale(${0.98 + opPureForm * 0.02})`,
          }}
        >
          <span className="editorial-kicker">AESTHETIC ESSENCE</span>
          <h1 className="monumental-word" style={{ fontSize: 'clamp(3rem, 10vw, 11rem)', letterSpacing: '0.04em' }}>
            PURE FORM.
          </h1>
          <p className="editorial-sub" style={{ marginTop: '8px' }}>
            Carbon-fiber removable roof panel. Aerodynamic rear differential cooling scoops.
          </p>
        </div>
      )}

      {/* 0.94 -> 1.00 : Grand Finale */}
      {opFinale > 0 && (
        <div
          className="editorial-statement"
          style={{
            opacity: opFinale,
            transform: `translateY(${(1 - opFinale) * 30}px)`,
          }}
        >
          <span className="editorial-kicker">CHEVROLET CORVETTE</span>
          <h1 className="monumental-word" style={{ fontSize: 'clamp(3.5rem, 12vw, 13rem)' }}>
            STINGRAY C7
          </h1>
          <p className="editorial-sub" style={{ marginTop: '12px' }}>
            7-Speed Manual with Active Rev-Matching or 8-Speed Paddle-Shift Transaxle.
          </p>
          <span className="editorial-footnote" style={{ marginTop: '14px', opacity: 0.75 }}>
            SCROLL TO SCRUB TIMELINE // OR ACTIVATE [ EXPLORE 360° ] OR [ SPECIFICATIONS ]
          </span>
        </div>
      )}
    </div>
  );
}
