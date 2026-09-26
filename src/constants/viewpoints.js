// Exact story viewpoints (magnetic anchor positions) for cinematic film scrub
export const STORY_VIEWPOINTS = [
  {
    id: '01',
    progress: 0.08,
    title: 'PROLOGUE // SILENCE',
    subtitle: 'MOTION IN BLACK',
    cameraNote: 'High Descending Studio Crane',
  },
  {
    id: '02',
    progress: 0.23,
    title: 'ARCHITECTURE // SPACEFRAME',
    subtitle: 'HYDROFORMED ALUMINUM',
    cameraNote: 'Ground-Skimming Low Incline',
  },
  {
    id: '03',
    progress: 0.39,
    title: 'STANCE // 50:50 BALANCE',
    subtitle: 'BREMBO BRAKING SYSTEM',
    cameraNote: 'Telephoto Muscle Profile',
  },
  {
    id: '04',
    progress: 0.54,
    title: 'OPTICS // BI-XENON PROJECTOR',
    subtitle: 'AERODYNAMIC DOWNFORCE',
    cameraNote: 'Macro Projector Lens Dive',
  },
  {
    id: '05',
    progress: 0.69,
    title: 'POWERTRAIN // 6.2L LT1 V8',
    subtitle: '460 HP & 465 LB-FT TORQUE',
    cameraNote: 'Muscular High 3/4 Perspective',
  },
  {
    id: '06',
    progress: 0.83,
    title: 'EXHAUST // QUAD 4-INCH NPP',
    subtitle: 'ACTIVE ACOUSTIC EVACUATION',
    cameraNote: 'Ultra-Low Rear Diffuser Cannon',
  },
  {
    id: '07',
    progress: 0.915,
    title: 'AESTHETIC // PURE FORM',
    subtitle: 'CARBON REMOVABLE ROOF',
    cameraNote: 'Photographic Calm 3/4 Portrait',
  },
  {
    id: '08',
    progress: 1.00,
    title: 'FINALE // STINGRAY C7',
    subtitle: 'THE PROTAGONIST',
    cameraNote: 'Full Hero Establishing Stance',
  },
];

/**
 * Finds the nearest magnetic story viewpoint to a given progress value.
 */
export function getNearestViewpoint(progress) {
  let nearest = STORY_VIEWPOINTS[0];
  let minDiff = Infinity;

  for (let i = 0; i < STORY_VIEWPOINTS.length; i++) {
    const vp = STORY_VIEWPOINTS[i];
    const diff = Math.abs(progress - vp.progress);
    if (diff < minDiff) {
      minDiff = diff;
      nearest = vp;
    }
  }

  return { viewpoint: nearest, distance: minDiff };
}
