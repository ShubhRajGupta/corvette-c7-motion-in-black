import React, { useState, useEffect, useRef } from 'react';
import { Experience } from './components/Experience';
import { CinematicOverlay } from './components/CinematicOverlay';
import { CinematicNav } from './components/CinematicNav';
import { CinematicPreloader } from './components/CinematicPreloader';
import { TechnicalDossier } from './components/TechnicalDossier';
import { SideSpecSelector } from './components/SideSpecSelector';
import { TextureOverlay } from './components/TextureOverlay';
import { VfxDebugPanel } from './components/vfx/VfxDebugPanel';
import { CAR_SPECS } from './constants/carSpecs';
import { cinematicAudio } from './utils/audio';
import { useLoadingOrchestrator } from './hooks/useLoadingOrchestrator';

function App() {
  const [timelineProgress, setTimelineProgress] = useState(0);
  const [isExploreMode, setIsExploreMode] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [showLoadStats, setShowLoadStats] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Intelligent Weighted Loading Orchestrator
  const {
    stage: loadStage,
    displayProgress,
    statusMessage,
    isCriticalReady,
    isExperienceReady,
    reportSceneAttached,
    reportShadersPrewarmed,
    telemetry: loadTelemetry,
  } = useLoadingOrchestrator();

  // Active Curated Edition & Livery state
  const [activeSpecId, setActiveSpecId] = useState('velocity-yellow');
  const [activeStickerId, setActiveStickerId] = useState('jake');

  // Font mode state: 'barlow' (authentic old font) vs 'shoulders' (monumental display)
  const [fontMode, setFontMode] = useState(() => {
    try {
      return localStorage.getItem('corvette_font_mode') || 'barlow';
    } catch {
      return 'barlow';
    }
  });

  const handleToggleFont = () => {
    cinematicAudio.playUiTick();
    setFontMode((prev) => {
      const next = prev === 'barlow' ? 'shoulders' : 'barlow';
      try {
        localStorage.setItem('corvette_font_mode', next);
      } catch {}
      return next;
    });
  };

  // VFX & Atmosphere Diagnostic Controls (Shift + V)
  const [vfxSettings, setVfxSettings] = useState({
    atmosphere: true,
    optical: true,
    bloom: true,
    chromatic: true,
    grain: true,
    exposureShift: true,
  });

  const currentSpec =
    CAR_SPECS.find((s) => s.id === activeSpecId) || CAR_SPECS[0];

  const handleSelectSpec = (specId) => {
    cinematicAudio.playUiTick();
    setActiveSpecId(specId);
    const foundSpec = CAR_SPECS.find((s) => s.id === specId);
    if (foundSpec) {
      setActiveStickerId(foundSpec.defaultSticker);
    }
  };

  const handleSelectSticker = (stickerId) => {
    cinematicAudio.playUiTick();
    setActiveStickerId(stickerId);
  };

  const currentProgressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const mouseCurrentRef = useRef({ x: 0, y: 0 });
  const isIdleRef = useRef(isIdle);
  const isExploreModeRef = useRef(isExploreMode);
  const isExperienceReadyRef = useRef(isExperienceReady);

  useEffect(() => {
    isIdleRef.current = isIdle;
    isExploreModeRef.current = isExploreMode;
    isExperienceReadyRef.current = isExperienceReady;
  }, [isIdle, isExploreMode, isExperienceReady]);

  // Master smooth scroll scrubber loop with physical inertia
  useEffect(() => {
    const handleScroll = () => {
      // Gated until experience reaches critical readiness to preserve Scene 01 prewarm composition
      if (isExploreMode || !isExperienceReadyRef.current) return;
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        targetProgressRef.current = Math.max(0, Math.min(1, scrollY / maxScroll));
      }
    };

    const handleMouseMove = (e) => {
      mouseTargetRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animationFrame;
    let lastProgress = 0;

    const renderLoop = () => {
      // Damped interpolation of timeline progress
      const diff = targetProgressRef.current - currentProgressRef.current;
      currentProgressRef.current += diff * 0.18;

      // Update audio timeline state for dynamic pitch, lope, intensity curve & spatial panner
      const velocity = Math.abs(currentProgressRef.current - lastProgress) * 60;
      cinematicAudio.update(currentProgressRef.current, velocity, {
        isIdle: isIdleRef.current,
        isExploreMode: isExploreModeRef.current,
      });
      lastProgress = currentProgressRef.current;

      setTimelineProgress(currentProgressRef.current);

      // Interpolate mouse parallax
      mouseCurrentRef.current.x += (mouseTargetRef.current.x - mouseCurrentRef.current.x) * 0.05;
      mouseCurrentRef.current.y += (mouseTargetRef.current.y - mouseCurrentRef.current.y) * 0.05;
      setMouseOffset({ x: mouseCurrentRef.current.x, y: mouseCurrentRef.current.y });

      animationFrame = requestAnimationFrame(renderLoop);
    };

    animationFrame = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, [isExploreMode]);

  // Keyboard navigation for stepped scrolling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isExploreMode) return;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;

      const stepSize = 0.1;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        const nextProgress = Math.min(1, currentProgressRef.current + stepSize);
        window.scrollTo({
          top: nextProgress * maxScroll,
          behavior: 'smooth',
        });
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const prevProgress = Math.max(0, currentProgressRef.current - stepSize);
        window.scrollTo({
          top: prevProgress * maxScroll,
          behavior: 'smooth',
        });
      } else if (e.shiftKey && (e.key === 'L' || e.key === 'l')) {
        // Toggle development loading telemetry diagnostics
        setShowLoadStats((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExploreMode]);

  const handleToggleExplore = () => {
    cinematicAudio.playUiTick();
    setIsExploreMode((prev) => !prev);
  };

  return (
    <div className="app-container">
      {/* Cinematic Automotive Prologue & Progressive Assembly Preloader */}
      <CinematicPreloader
        displayProgress={displayProgress}
        statusMessage={statusMessage}
        isCriticalReady={isCriticalReady}
        isExperienceReady={isExperienceReady}
      />

      {/* Dynamic Organic 35mm Film Grain, Vignette, Texture & Exposure Shift System */}
      <TextureOverlay
        timelineProgress={timelineProgress}
        grainEnabled={vfxSettings.grain}
        exposureShiftEnabled={vfxSettings.exposureShift}
      />

      {/* WebGL 3D Real-time Protagonist Experience */}
      <Experience
        timelineProgress={timelineProgress}
        isExploreMode={isExploreMode}
        mouseOffset={mouseOffset}
        currentSpec={currentSpec}
        activeStickerId={activeStickerId}
        vfxSettings={vfxSettings}
        isDossierOpen={isDossierOpen}
        onIdleStateChange={setIsIdle}
        onSceneAttached={reportSceneAttached}
        onShadersPrewarmed={reportShadersPrewarmed}
      />

      {/* Development Diagnostics for Loading Telemetry (Shift + L) */}
      {showLoadStats && (
        <div className="preloader-dev-diagnostics">
          <div className="preloader-dev-title">CORVETTE // LOAD METRICS</div>
          <div className="preloader-dev-row">
            <span>Stage:</span>
            <span>{loadStage}</span>
          </div>
          <div className="preloader-dev-row">
            <span>Time to Shell:</span>
            <span>{loadTelemetry.timeToShell}ms</span>
          </div>
          <div className="preloader-dev-row">
            <span>Time to Assets:</span>
            <span>{loadTelemetry.timeToAssets}ms</span>
          </div>
          <div className="preloader-dev-row">
            <span>Time to Prewarm:</span>
            <span>{loadTelemetry.timeToPrewarm}ms</span>
          </div>
          <div className="preloader-dev-row">
            <span>Time to Ready:</span>
            <span>{loadTelemetry.timeToCriticalReady}ms</span>
          </div>
          <div className="preloader-dev-row">
            <span>Total Prologue:</span>
            <span>{loadTelemetry.totalDuration}ms</span>
          </div>
        </div>
      )}

      {/* Development Diagnostics for Isolated VFX Tuning (Shift + V) */}
      <VfxDebugPanel
        vfxSettings={vfxSettings}
        onUpdateVfxSettings={setVfxSettings}
      />

      {/* Synchronized Monumental Editorial Typography Overlay */}
      <CinematicOverlay
        timelineProgress={timelineProgress}
        fontMode={fontMode}
        isIdle={isIdle}
      />

      {/* Floating Minimalist Curated Side Palette & Livery Dock */}
      <SideSpecSelector
        activeSpecId={activeSpecId}
        onSelectSpec={handleSelectSpec}
        activeStickerId={activeStickerId}
        onSelectSticker={handleSelectSticker}
      />

      {/* Unobtrusive Minimal HUD-free Navigation */}
      <CinematicNav
        timelineProgress={timelineProgress}
        isExploreMode={isExploreMode}
        onToggleExplore={handleToggleExplore}
        isDossierOpen={isDossierOpen}
        onToggleDossier={() => setIsDossierOpen((prev) => !prev)}
        fontMode={fontMode}
        onToggleFont={handleToggleFont}
      />

      {/* Comprehensive Verified Engineering Dossier Modal */}
      <TechnicalDossier
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
      />

      {/* Physical Scroll Track for scrubbing through the film */}
      <div className="scroll-track" />
    </div>
  );
}

export default App;
