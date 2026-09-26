import React, { useState } from 'react';
import { cinematicAudio } from '../utils/audio';
import { STORY_VIEWPOINTS } from '../constants/viewpoints';

const CHAPTERS = [
  { id: '01', title: 'SILENCE & SILHOUETTE', range: [0.0, 0.16] },
  { id: '02', title: 'ALUMINUM SPACEFRAME ARCHITECTURE', range: [0.16, 0.32] },
  { id: '03', title: 'SCULPTED PROFILE & BREMBO BRAKES', range: [0.32, 0.45] },
  { id: '04', title: 'BI-XENON OPTICS & DOWNFORCE AERO', range: [0.45, 0.6] },
  { id: '05', title: '6.2L LT1 V8 POWERTRAIN & 3.6S', range: [0.6, 0.74] },
  { id: '06', title: 'ACTIVE DUAL-MODE EXHAUST (NPP)', range: [0.74, 0.86] },
  { id: '07', title: 'PURE FORM', range: [0.86, 0.93] },
  { id: '08', title: 'MONUMENTAL FINALE', range: [0.93, 1.0] },
];

export function CinematicNav({
  timelineProgress,
  isExploreMode,
  onToggleExplore,
  isDossierOpen,
  onToggleDossier,
  activeViewpoint,
  isMagnetLocked,
  onSelectViewpoint,
}) {
  const [audioActive, setAudioActive] = useState(false);

  // Determine current chapter
  const currentChapter =
    CHAPTERS.find((ch) => timelineProgress >= ch.range[0] && timelineProgress <= ch.range[1]) ||
    CHAPTERS[0];

  const handleAudioToggle = () => {
    const isNowPlaying = cinematicAudio.toggle();
    setAudioActive(isNowPlaying);
  };

  // Jump to next or previous magnetic viewpoint
  const handleStepViewpoint = (direction) => {
    if (!onSelectViewpoint) return;
    const p = timelineProgress;

    if (direction === 1) {
      const nextVp =
        STORY_VIEWPOINTS.find((vp) => vp.progress > p + 0.02) ||
        STORY_VIEWPOINTS[STORY_VIEWPOINTS.length - 1];
      if (nextVp) onSelectViewpoint(nextVp.progress);
    } else {
      const prevVps = STORY_VIEWPOINTS.filter((vp) => vp.progress < p - 0.02);
      const prevVp =
        prevVps.length > 0 ? prevVps[prevVps.length - 1] : STORY_VIEWPOINTS[0];
      if (prevVp) onSelectViewpoint(prevVp.progress);
    }
  };

  return (
    <div className="cinematic-ui-shell">
      {/* Header bar */}
      <header className="cinematic-header">
        <div className="brand-badge">
          <span className="brand-title">CORVETTE C7</span>
          <span className="brand-sub">MOTION IN BLACK // ART PIECE</span>
        </div>

        <div className="header-controls">
          <button
            type="button"
            className={`control-btn ${isDossierOpen ? 'active' : ''}`}
            onClick={onToggleDossier}
            title="Inspect comprehensive verified technical specifications"
          >
            [ SPECIFICATIONS ]
          </button>

          <button
            type="button"
            className={`control-btn ${audioActive ? 'active' : ''}`}
            onClick={handleAudioToggle}
            title="Toggle crossplane V8 combustion acoustic synthesizer"
          >
            {audioActive ? 'AUDIO: ON' : 'AUDIO: OFF'}
          </button>
        </div>
      </header>

      {/* Footer bar */}
      <footer className="cinematic-footer">
        {/* Chapter Indicator & Magnetic Lock Status */}
        <div className="chapter-indicator">
          <div className="chapter-meta-line">
            <span className="chapter-number">{currentChapter.id} / 08</span>
            {isMagnetLocked && (
              <span className="magnet-lock-badge" title="Magnetically locked to exact viewpoint">
                <span className="magnet-lock-dot" />
                MAGNET LOCKED
              </span>
            )}
          </div>
          <span className="chapter-title">{currentChapter.title}</span>
        </div>

        {/* Minimal Scrub Progress Track with Magnetic Detent Anchors */}
        <div className="scrub-timeline">
          <div className="scrub-label">
            <span className="timeline-title-txt">MAGNETIC TIMELINE</span>
            <div className="timeline-step-btns">
              <button
                type="button"
                className="timeline-nav-arrow"
                onClick={() => handleStepViewpoint(-1)}
                title="Previous Magnetic Viewpoint (Arrow Up)"
              >
                ◀
              </button>
              <span className="timeline-pct-txt">{Math.round(timelineProgress * 100)}%</span>
              <button
                type="button"
                className="timeline-nav-arrow"
                onClick={() => handleStepViewpoint(1)}
                title="Next Magnetic Viewpoint (Arrow Down)"
              >
                ▶
              </button>
            </div>
          </div>

          <div
            className="scrub-bar-bg"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickP = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
              onSelectViewpoint?.(clickP);
            }}
          >
            <div
              className="scrub-bar-fill"
              style={{ width: `${Math.min(100, Math.max(0, timelineProgress * 100))}%` }}
            />

            {/* 8 Magnetic Story Detent Anchors */}
            {STORY_VIEWPOINTS.map((vp) => {
              const isLocked = activeViewpoint?.id === vp.id && isMagnetLocked;
              const isNear = Math.abs(timelineProgress - vp.progress) < 0.025;

              return (
                <button
                  key={vp.id}
                  type="button"
                  className={`magnetic-detent-tick ${isLocked ? 'locked' : ''} ${isNear ? 'near' : ''}`}
                  style={{ left: `${vp.progress * 100}%` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectViewpoint?.(vp.progress);
                  }}
                  title={`Magnet Snap: ${vp.id} // ${vp.title} (${vp.cameraNote})`}
                >
                  <span className="detent-core" />
                  {isLocked && <span className="detent-halo" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Explore Mode Trigger */}
        <div className="explore-toggle">
          <button
            type="button"
            className={`control-btn ${isExploreMode ? 'active' : ''}`}
            onClick={onToggleExplore}
          >
            {isExploreMode ? '[ RESUME FILM ]' : '[ EXPLORE 360° ]'}
          </button>
        </div>
      </footer>
    </div>
  );
}
