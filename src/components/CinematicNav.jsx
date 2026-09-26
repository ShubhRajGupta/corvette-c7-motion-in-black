import React, { useState } from 'react';
import { cinematicAudio } from '../utils/audio';

/**
 * CinematicNav: Contextual Controls System
 *
 * Implements strict contextual UI principles:
 * - NO permanent header clutter, brand badges, or status text.
 * - NO persistent timeline or progress scrubber bar.
 * - Includes a minimal, luxury Font Chooser toggle so the user can choose
 *   between the authentic Old Font (Barlow Condensed) and Big Shoulders Display.
 * - [ SPECIFICATIONS ] appears ONLY when relevant (during Performance scene & Finale).
 * - [ EXPLORE 360° ] appears ONLY when reaching the exploration/finale scene.
 * - [ RESUME FILM ] appears ONLY when the user is actively inside 360° Explore Mode.
 * - Smooth opacity & transform transitions for all entering and exiting controls.
 */
export function CinematicNav({
  timelineProgress,
  isExploreMode,
  onToggleExplore,
  isDossierOpen,
  onToggleDossier,
  fontMode = 'barlow',
  onToggleFont,
}) {
  const [audioActive, setAudioActive] = useState(false);

  const handleAudioToggle = () => {
    const isNowPlaying = cinematicAudio.toggle();
    setAudioActive(isNowPlaying);
  };

  // Contextual condition 1: Specifications button appears during Spec/Performance scene OR at Finale
  const isSpecSceneActive =
    (timelineProgress >= 0.62 && timelineProgress <= 0.80) || timelineProgress >= 0.94;

  // Contextual condition 2: Explore button appears at Finale when not already exploring
  const isExploreActionActive = timelineProgress >= 0.92 && !isExploreMode;

  return (
    <div className="contextual-ui-layer" aria-live="polite">
      {/* Top Controls Bar: Minimal & Contextual */}
      <header className="contextual-top-bar">
        {/* Subtle, Secondary Audio Synthesizer Toggle */}
        <button
          type="button"
          className={`contextual-control-btn audio-btn ${audioActive ? 'active' : ''}`}
          onClick={handleAudioToggle}
          title="Toggle crossplane V8 acoustic synthesizer"
        >
          {audioActive ? 'AUDIO: ON' : 'AUDIO: OFF'}
        </button>

        {/* Font Style Chooser: Lets user choose between Old Font (Barlow) & Big Shoulders */}
        {onToggleFont && (
          <button
            type="button"
            className="contextual-control-btn font-btn"
            onClick={onToggleFont}
            title="Choose typography aesthetic: Old Barlow Condensed vs Big Shoulders"
          >
            {fontMode === 'barlow' ? 'FONT: BARLOW' : 'FONT: SHOULDERS'}
          </button>
        )}

        {/* Contextual [ SPECIFICATIONS ] Button: Glides in only during spec/performance & finale */}
        <button
          type="button"
          className={`contextual-control-btn spec-btn ${isSpecSceneActive ? 'visible' : ''} ${isDossierOpen ? 'active' : ''}`}
          onClick={onToggleDossier}
          title="Inspect verified technical dossier"
          aria-hidden={!isSpecSceneActive}
          tabIndex={isSpecSceneActive ? 0 : -1}
        >
          [ SPECIFICATIONS ]
        </button>
      </header>

      {/* Contextual Action: [ EXPLORE 360° ] at Finale */}
      <div
        className={`contextual-floating-action bottom-action ${isExploreActionActive ? 'visible' : ''}`}
        aria-hidden={!isExploreActionActive}
      >
        <button
          type="button"
          className="contextual-pill-btn"
          onClick={onToggleExplore}
          tabIndex={isExploreActionActive ? 0 : -1}
        >
          [ EXPLORE 360° ]
        </button>
      </div>

      {/* Contextual Action: [ RESUME FILM ] appears ONLY while actively exploring */}
      <div
        className={`contextual-floating-action resume-action ${isExploreMode ? 'visible' : ''}`}
        aria-hidden={!isExploreMode}
      >
        <button
          type="button"
          className="contextual-pill-btn accent-pill"
          onClick={onToggleExplore}
          tabIndex={isExploreMode ? 0 : -1}
        >
          [ RESUME FILM ]
        </button>
      </div>
    </div>
  );
}
