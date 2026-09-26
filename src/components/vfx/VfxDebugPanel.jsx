import React, { useState, useEffect } from 'react';

/**
 * VfxDebugPanel: Development diagnostic controller for isolated VFX tuning.
 * Allows independent toggling of haze, particles, optical flares, bloom, chromatic aberration,
 * and film grain. Includes instant ALL VFX ON / ALL VFX OFF comparison (Section 47 & 48).
 *
 * Hidden from normal users. Toggle with `Shift + V` or add `?vfx=1` to the URL.
 */
export function VfxDebugPanel({ vfxSettings, onUpdateVfxSettings }) {
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.location.search.includes('vfx') || window.location.search.includes('debug');
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle panel with Shift + V
      if (e.shiftKey && (e.key === 'V' || e.key === 'v')) {
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const allActive = Object.values(vfxSettings).every(Boolean);

  const toggleAll = () => {
    const nextVal = !allActive;
    onUpdateVfxSettings({
      atmosphere: nextVal,
      particles: nextVal,
      optical: nextVal,
      bloom: nextVal,
      chromatic: nextVal,
      grain: nextVal,
      exposureShift: nextVal,
    });
  };

  const toggleSingle = (key) => {
    onUpdateVfxSettings({
      ...vfxSettings,
      [key]: !vfxSettings[key],
    });
  };

  return (
    <aside className="vfx-debug-panel" aria-label="Cinematic VFX Development Diagnostics">
      <div className="vfx-debug-header">
        <div className="vfx-debug-badge">DEV DIAGNOSTICS</div>
        <button
          className="vfx-debug-close"
          onClick={() => setIsOpen(false)}
          aria-label="Close VFX Diagnostics"
        >
          ✕
        </button>
      </div>

      <div className="vfx-debug-title">CINEMATIC ATMOSPHERE</div>
      <div className="vfx-debug-caption">Press Shift+V to hide/show</div>

      <button
        className={`vfx-master-toggle ${allActive ? 'active' : 'inactive'}`}
        onClick={toggleAll}
      >
        {allActive ? 'ALL VFX: ACTIVE (CINEMATIC)' : 'ALL VFX: DISABLED (PURE 3D)'}
      </button>

      <div className="vfx-toggle-list">
        <label className="vfx-toggle-item">
          <input
            type="checkbox"
            checked={vfxSettings.atmosphere}
            onChange={() => toggleSingle('atmosphere')}
          />
          <span className="vfx-toggle-label">Studio Haze & Ground Bed</span>
        </label>

        <label className="vfx-toggle-item">
          <input
            type="checkbox"
            checked={vfxSettings.particles}
            onChange={() => toggleSingle('particles')}
          />
          <span className="vfx-toggle-label">Micro Airborne Dust</span>
        </label>

        <label className="vfx-toggle-item">
          <input
            type="checkbox"
            checked={vfxSettings.optical}
            onChange={() => toggleSingle('optical')}
          />
          <span className="vfx-toggle-label">Optical Diffusion & Flares</span>
        </label>

        <label className="vfx-toggle-item">
          <input
            type="checkbox"
            checked={vfxSettings.bloom}
            onChange={() => toggleSingle('bloom')}
          />
          <span className="vfx-toggle-label">Emissive Projector Bloom</span>
        </label>

        <label className="vfx-toggle-item">
          <input
            type="checkbox"
            checked={vfxSettings.chromatic}
            onChange={() => toggleSingle('chromatic')}
          />
          <span className="vfx-toggle-label">Transition Chromatic Fringe</span>
        </label>

        <label className="vfx-toggle-item">
          <input
            type="checkbox"
            checked={vfxSettings.grain}
            onChange={() => toggleSingle('grain')}
          />
          <span className="vfx-toggle-label">35mm Emulsion Film Grain</span>
        </label>

        <label className="vfx-toggle-item">
          <input
            type="checkbox"
            checked={vfxSettings.exposureShift}
            onChange={() => toggleSingle('exposureShift')}
          />
          <span className="vfx-toggle-label">Sensor Exposure Shift</span>
        </label>
      </div>

      <div className="vfx-debug-footer">
        Restraint Rule: 95% Clarity / 5% Haze
      </div>
    </aside>
  );
}
