import React, { useState, useEffect, useRef } from 'react';
import { useProgress } from '@react-three/drei';
import { Experience } from './components/Experience';
import { CinematicOverlay } from './components/CinematicOverlay';
import { CinematicNav } from './components/CinematicNav';
import { CustomCursor } from './components/CustomCursor';
import { TechnicalDossier } from './components/TechnicalDossier';
import { SideSpecSelector } from './components/SideSpecSelector';
import { CAR_SPECS } from './constants/carSpecs';
import { STORY_VIEWPOINTS, getNearestViewpoint } from './constants/viewpoints';
import { cinematicAudio } from './utils/audio';

function App() {
  const [timelineProgress, setTimelineProgress] = useState(0);
  const [isExploreMode, setIsExploreMode] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  // Active Curated Edition & Livery state
  const [activeSpecId, setActiveSpecId] = useState('velocity-yellow');
  const [activeStickerId, setActiveStickerId] = useState('jake');

  // Magnetic Viewpoint Lock state
  const [activeViewpoint, setActiveViewpoint] = useState(STORY_VIEWPOINTS[0]);
  const [isMagnetLocked, setIsMagnetLocked] = useState(false);

  const currentSpec =
    CAR_SPECS.find((s) => s.id === activeSpecId) || CAR_SPECS[0];

  const handleSelectSpec = (specId) => {
    setActiveSpecId(specId);
    const foundSpec = CAR_SPECS.find((s) => s.id === specId);
    if (foundSpec) {
      setActiveStickerId(foundSpec.defaultSticker);
    }
  };

  const handleSelectSticker = (stickerId) => {
    setActiveStickerId(stickerId);
  };

  // Asset loading tracker from Drei
  const { progress: assetProgress, active } = useProgress();

  const currentProgressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const mouseCurrentRef = useRef({ x: 0, y: 0 });

  const snapAnimationRef = useRef(null);
  const scrollStopTimerRef = useRef(null);
  const lastDetentVpRef = useRef(null);

  // Smoothly glide window scroll to exact progress with magnetic damping
  const glideToProgress = (targetP, duration = 600) => {
    if (snapAnimationRef.current) {
      cancelAnimationFrame(snapAnimationRef.current);
      snapAnimationRef.current = null;
    }

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;

    const clampedTargetP = Math.max(0, Math.min(1, targetP));
    const startY = window.scrollY;
    const targetY = clampedTargetP * maxScroll;
    const distance = targetY - startY;

    if (Math.abs(distance) < 2) return;

    const startTime = performance.now();
    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeInOutCubic(progress);

      window.scrollTo(0, startY + distance * eased);

      if (progress < 1) {
        snapAnimationRef.current = requestAnimationFrame(step);
      } else {
        snapAnimationRef.current = null;
      }
    };

    snapAnimationRef.current = requestAnimationFrame(step);
  };

  // Handle loading completion with natural transition
  useEffect(() => {
    if (assetProgress >= 100 || !active) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [assetProgress, active]);

  // Master smooth scroll scrubber loop with physical inertia & magnetic detents
  useEffect(() => {
    const checkMagneticSnap = () => {
      if (isExploreMode) return;
      const currentP = currentProgressRef.current;
      const { viewpoint, distance } = getNearestViewpoint(currentP);

      // If near a magnetic viewpoint and not actively driven, glide directly into the lock
      if (distance < 0.055 && distance > 0.002) {
        if (lastDetentVpRef.current !== viewpoint.id) {
          cinematicAudio.playMagneticDetent();
          lastDetentVpRef.current = viewpoint.id;
        }
        setActiveViewpoint(viewpoint);
        glideToProgress(viewpoint.progress, 550);
      } else if (distance <= 0.002) {
        setActiveViewpoint(viewpoint);
        lastDetentVpRef.current = viewpoint.id;
      }
    };

    const handleScroll = () => {
      if (isExploreMode) return;

      // If manual scroll occurs while snapping, interrupt smoothly
      if (snapAnimationRef.current) {
        cancelAnimationFrame(snapAnimationRef.current);
        snapAnimationRef.current = null;
      }

      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        targetProgressRef.current = Math.max(0, Math.min(1, scrollY / maxScroll));
      }

      // Schedule magnetic snap evaluation on scroll pause
      clearTimeout(scrollStopTimerRef.current);
      scrollStopTimerRef.current = setTimeout(checkMagneticSnap, 140);
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
      currentProgressRef.current += diff * 0.08;

      // Update audio velocity for dynamic pitch/frequency modulation
      const velocity = Math.abs(currentProgressRef.current - lastProgress) * 60;
      cinematicAudio.updateScrollIntensity(velocity);
      lastProgress = currentProgressRef.current;

      setTimelineProgress(currentProgressRef.current);

      // Track active viewpoint and magnetic lock status
      const { viewpoint, distance } = getNearestViewpoint(currentProgressRef.current);
      setActiveViewpoint(viewpoint);
      setIsMagnetLocked(distance <= 0.015);

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
      if (snapAnimationRef.current) cancelAnimationFrame(snapAnimationRef.current);
      clearTimeout(scrollStopTimerRef.current);
    };
  }, [isExploreMode]);

  // Keyboard navigation for stepped magnetic viewpoints
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isExploreMode) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        const currentP = currentProgressRef.current;
        const nextVp =
          STORY_VIEWPOINTS.find((vp) => vp.progress > currentP + 0.02) ||
          STORY_VIEWPOINTS[STORY_VIEWPOINTS.length - 1];
        if (nextVp) {
          cinematicAudio.playMagneticDetent();
          setActiveViewpoint(nextVp);
          glideToProgress(nextVp.progress, 650);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const currentP = currentProgressRef.current;
        const prevVps = STORY_VIEWPOINTS.filter((vp) => vp.progress < currentP - 0.02);
        const prevVp =
          prevVps.length > 0 ? prevVps[prevVps.length - 1] : STORY_VIEWPOINTS[0];
        if (prevVp) {
          cinematicAudio.playMagneticDetent();
          setActiveViewpoint(prevVp);
          glideToProgress(prevVp.progress, 650);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExploreMode]);

  const handleToggleExplore = () => {
    setIsExploreMode((prev) => !prev);
  };

  const handleSelectViewpoint = (targetProgress) => {
    cinematicAudio.playMagneticDetent();
    glideToProgress(targetProgress, 650);
  };

  return (
    <div className="app-container">
      {/* Editorial Minimal Loading Screen */}
      <div className={`cinematic-loader ${isLoaded ? 'fade-out' : ''}`}>
        <div className="loader-title">CORVETTE</div>
        <div className="loader-bar-wrap">
          <div
            className="loader-bar-fill"
            style={{ width: `${Math.round(assetProgress)}%` }}
          />
        </div>
        <div className="loader-meta">
          MOTION IN BLACK // {Math.round(assetProgress)}%
        </div>
      </div>

      {/* Atmospheric Overlays */}
      <div className="film-grain" />
      <div className="vignette-overlay" />

      {/* Custom Minimal Cursor */}
      <CustomCursor />

      {/* WebGL 3D Real-time Protagonist Experience */}
      <Experience
        timelineProgress={timelineProgress}
        isExploreMode={isExploreMode}
        mouseOffset={mouseOffset}
        currentSpec={currentSpec}
        activeStickerId={activeStickerId}
      />

      {/* Synchronized Monumental Editorial Typography Overlay */}
      <CinematicOverlay timelineProgress={timelineProgress} />

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
        activeViewpoint={activeViewpoint}
        isMagnetLocked={isMagnetLocked}
        onSelectViewpoint={handleSelectViewpoint}
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
