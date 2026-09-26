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

        {/* Public Repository Link: Small circular, low-opacity, touch/hover to activate */}
        <a
          href="https://github.com/ShubhRajGupta/corvette-c7-motion-in-black"
          target="_blank"
          rel="noopener noreferrer"
          className="contextual-repo-circle-btn"
          title="View source on GitHub: ShubhRajGupta/corvette-c7-motion-in-black"
          aria-label="View source repository on GitHub"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
        </a>

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
