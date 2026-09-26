import React from 'react';

export function TechnicalDossier({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="dossier-overlay">
      <div className="dossier-backdrop" onClick={onClose} />
      <div className="dossier-panel">
        {/* Header */}
        <div className="dossier-header">
          <div className="dossier-title-wrap">
            <span className="dossier-kicker">CHEVROLET CORVETTE C7 STINGRAY</span>
            <h2 className="dossier-title">ENGINEERING DOSSIER</h2>
          </div>
          <button type="button" className="dossier-close-btn" onClick={onClose}>
            [ CLOSE ✕ ]
          </button>
        </div>

        {/* Content Body */}
        <div className="dossier-body">
          {/* Section 1: Powertrain */}
          <div className="dossier-section">
            <h3 className="dossier-sec-title">01 // POWERTRAIN & PROPULSION</h3>
            <div className="dossier-grid">
              <div className="dossier-cell">
                <span className="cell-label">ENGINE TYPE</span>
                <span className="cell-val">LT1 6.2L 90° Small-Block V8</span>
              </div>
              <div className="dossier-cell">
                <span className="cell-label">DISPLACEMENT</span>
                <span className="cell-val">6,162 cc (376 cu in)</span>
              </div>
              <div className="dossier-cell">
                <span className="cell-label">HORSEPOWER</span>
                <span className="cell-val">460 HP @ 6,000 RPM (w/ NPP Exhaust)</span>
              </div>
              <div className="dossier-cell">
                <span className="cell-label">TORQUE</span>
                <span className="cell-val">465 LB-FT (630 Nm) @ 4,600 RPM</span>
              </div>
              <div className="dossier-cell">
                <span className="cell-label">VALVETRAIN</span>
                <span className="cell-val">Pushrod OHV, 2 Valves/Cylinder, VVT</span>
              </div>
              <div className="dossier-cell">
                <span className="cell-label">FUEL DELIVERY</span>
                <span className="cell-val">High-Pressure Direct Injection (DI)</span>
              </div>
              <div className="dossier-cell">
                <span className="cell-label">COMPRESSION RATIO</span>
                <span className="cell-val">11.5 : 1</span>
              </div>
              <div className="dossier-cell">
                <span className="cell-label">LUBRICATION</span>
                <span className="cell-val">Track-Certified Dry Sump (Z51 Package)</span>
              </div>
            </div>
          </div>

          {/* Section 2: Performance */}
          <div className="dossier-section">
            <h3 className="dossier-sec-title">02 // TRACK DYNAMICS & BENCHMARKS</h3>
            <div className="dossier-grid">
              <div className="dossier-cell">
                <span className="cell-label">0–60 MPH (0–97 KM/H)</span>
                <span className="cell-val highlight">3.6 SECONDS</span>
              </div>
              <div className="dossier-cell">
                <span className="cell-label">QUARTER MILE (1/4 MI)</span>
                <span className="cell-val">11.9 Seconds @ 119.5 MPH</span>
              </div>
              <div className="dossier-cell">
                <span className="cell-label">TOP SPEED</span>
                <span className="cell-val">195 MPH (314 KM/H)</span>
              </div>
              <div className="dossier-cell">
                <span className="cell-label">LATERAL ACCELERATION</span>
                <span className="cell-val">1.05 G (Peak Skidpad Grip)</span>
              </div>
              <div className="dossier-cell">
                <span className="cell-label">BRAKING 60–0 MPH</span>
                <span className="cell-val">107 Feet (Brembo 4-Piston Monobloc)</span>
              </div>
              <div className="dossier-cell">
                <span className="cell-label">WEIGHT DISTRIBUTION</span>
                <span className="cell-val">50.0% Front / 50.0% Rear (Near-Perfect)</span>
              </div>
            </div>
          </div>

          {/* Section 3: Chassis & Transmission */}
          <div className="dossier-section">
            <h3 className="dossier-sec-title">03 // CHASSIS & DRIVETRAIN</h3>
            <div className="dossier-grid">
              <div className="dossier-cell">
                <span className="cell-label">FRAME STRUCTURE</span>
                <span className="cell-val">All-Aluminum Hydroformed Spaceframe (+57% Stiffer)</span>
              </div>
              <div className="dossier-cell">
                <span className="cell-label">TRANSMISSION</span>
                <span className="cell-val">7-Speed Manual w/ Active Rev-Match or 8-Speed Paddle Auto</span>
              </div>
              <div className="dossier-cell">
                <span className="cell-label">SUSPENSION</span>
                <span className="cell-val">Double Wishbone w/ Transverse Composite Monoleaf</span>
              </div>
              <div className="dossier-cell">
                <span className="cell-label">DAMPER TECHNOLOGY</span>
                <span className="cell-val">Magnetic Selective Ride Control (MR Damping)</span>
              </div>
              <div className="dossier-cell">
                <span className="cell-label">EXHAUST SYSTEM</span>
                <span className="cell-val">Active Dual-Mode (NPP) Quad 4.0-inch Central Tips</span>
              </div>
              <div className="dossier-cell">
                <span className="cell-label">BODY PANELS</span>
                <span className="cell-val">Carbon-Fiber Hood & Roof, Sheet Molding Compound (SMC)</span>
              </div>
            </div>
          </div>

          {/* Section 4: Dimensions & Assembly */}
          <div className="dossier-section">
            <h3 className="dossier-sec-title">04 // SPECIFICATIONS & PRODUCTION</h3>
            <div className="dossier-grid">
              <div className="dossier-cell">
                <span className="cell-label">CURB WEIGHT</span>
                <span className="cell-val">3,298 LBS (1,496 KG)</span>
              </div>
              <div className="dossier-cell">
                <span className="cell-label">WHEELBASE</span>
                <span className="cell-val">106.7 IN (2,710 MM)</span>
              </div>
              <div className="dossier-cell">
                <span className="cell-label">OVERALL LENGTH</span>
                <span className="cell-val">176.9 IN (4,493 MM)</span>
              </div>
              <div className="dossier-cell">
                <span className="cell-label">OVERALL WIDTH</span>
                <span className="cell-val">73.9 IN (1,877 MM)</span>
              </div>
              <div className="dossier-cell">
                <span className="cell-label">OVERALL HEIGHT</span>
                <span className="cell-val">48.8 IN (1,239 MM)</span>
              </div>
              <div className="dossier-cell">
                <span className="cell-label">ASSEMBLY FACILITY</span>
                <span className="cell-val">Bowling Green Assembly Plant, Kentucky, USA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="dossier-footer">
          <span>SOURCE: CHEVROLET DIVISION SPECIFICATION ARCHIVE</span>
          <span>CORVETTE C7 // MOTION IN BLACK</span>
        </div>
      </div>
    </div>
  );
}
