import React, { useRef, useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DecalGeometry } from 'three/addons/geometries/DecalGeometry.js';
import {
  createJakeTexture,
  createGrandSportTexture,
  createStingerTexture,
  createRoundelTexture,
  createStealthJakeTexture,
} from '../utils/stickerTextures';

export function CarModel({
  timelineProgress,
  isExploreMode,
  mouseOffset,
  currentSpec,
  activeStickerId,
}) {
  const { scene } = useGLTF('/models/corvette_c7.glb');
  const carGroupRef = useRef();

  const headlightMats = useRef([]);
  const taillightMats = useRef([]);
  const bodyMats = useRef([]);
  const interiorMats = useRef([]);
  const caliperMats = useRef([]);
  const badgeMats = useRef([]);
  const rimMats = useRef([]);

  // Initialize bespoke materials on scene load
  useEffect(() => {
    headlightMats.current = [];
    taillightMats.current = [];
    bodyMats.current = [];
    interiorMats.current = [];
    caliperMats.current = [];
    badgeMats.current = [];
    rimMats.current = [];

    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const name = (child.name || '').toLowerCase();

        // 1. CAR BODY PANELS -> High-Gloss Clearcoat Automotive Lacquer
        if (
          name.includes('hood') ||
          name.includes('bumper') ||
          name.includes('fender') ||
          name.includes('door') ||
          name.includes('roof') ||
          name.includes('trunk') ||
          name.includes('panel') ||
          name.includes('sv_mirror')
        ) {
          const bodyMat = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color('#070709'),
            metalness: 0.88,
            roughness: 0.12,
            clearcoat: 1.0,
            clearcoatRoughness: 0.035,
            reflectivity: 0.98,
            envMapIntensity: 2.2,
          });
          child.material = bodyMat;
          bodyMats.current.push(bodyMat);
        }

        // 2. GLASS & WINDSHIELDS -> Smoked Luxury Tint revealing the cockpit
        else if (
          name.includes('windshield') ||
          name.includes('window') ||
          name.includes('glass')
        ) {
          child.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color('#0e1014'),
            metalness: 0.15,
            roughness: 0.04,
            transmission: 0.82,
            transparent: true,
            opacity: 0.78,
            ior: 1.52,
            envMapIntensity: 2.2,
          });
        }

        // 3. INTERIOR COCKPIT -> High-end Leather Upholstery
        else if (name.includes('part#23') || name.includes('interior')) {
          const intMat = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color('#94161d'),
            metalness: 0.12,
            roughness: 0.38,
            clearcoat: 0.45,
            clearcoatRoughness: 0.2,
            envMapIntensity: 1.2,
          });
          child.material = intMat;
          interiorMats.current.push(intMat);
        }

        // 4. CALIPERS -> High-Gloss Brembo Accents
        else if (name.includes('caliper')) {
          const calMat = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color('#e0141f'),
            emissive: new THREE.Color('#400407'),
            emissiveIntensity: 0.25,
            metalness: 0.4,
            roughness: 0.15,
            clearcoat: 1.0,
            clearcoatRoughness: 0.06,
            envMapIntensity: 2.5,
          });
          child.material = calMat;
          caliperMats.current.push(calMat);
        }

        // 5. BADGES & STINGRAY EMBLEM -> Metallic Jewelry
        else if (name.includes('logo') || name.includes('stingray')) {
          const badgeMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#e31924'),
            emissive: new THREE.Color('#220204'),
            emissiveIntensity: 0.25,
            metalness: 0.92,
            roughness: 0.14,
            envMapIntensity: 2.5,
          });
          child.material = badgeMat;
          badgeMats.current.push(badgeMat);
        }

        // 6. HEADLIGHT LENSES & EMISSIVE MODULES
        else if (
          name.includes('headlight') ||
          name.includes('main_lens') ||
          name.includes('mini_lens')
        ) {
          const hlMat = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color('#ffffff'),
            emissive: new THREE.Color('#d8ecff'),
            emissiveIntensity: 0.0,
            metalness: 0.2,
            roughness: 0.08,
            transmission: 0.65,
            transparent: true,
            opacity: 0.9,
            envMapIntensity: 2.5,
          });
          child.material = hlMat;
          headlightMats.current.push(hlMat);
        }

        // 7. TAILLIGHTS -> Corvette signature red optical elements
        else if (name.includes('rear_light') || name.includes('taillight')) {
          const tlMat = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color('#420005'),
            emissive: new THREE.Color('#ff0d1a'),
            emissiveIntensity: 0.8,
            metalness: 0.3,
            roughness: 0.12,
            clearcoat: 1.0,
            envMapIntensity: 2.0,
          });
          child.material = tlMat;
          taillightMats.current.push(tlMat);
        }

        // 8. TIRES -> Matte Vulcanized Rubber
        else if (name.includes('tire')) {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#101012'),
            roughness: 0.88,
            metalness: 0.02,
          });
        }

        // 9. RIMS & ROTORS -> Machined Alloy Finish
        else if (name.includes('rim') || name.includes('rotor') || name.includes('bolt')) {
          const rimMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#1c1e22'),
            metalness: 0.94,
            roughness: 0.16,
            envMapIntensity: 2.2,
          });
          child.material = rimMat;
          rimMats.current.push(rimMat);
        }

        // 10. EXHAUST MUFFLERS -> Mirror Polished Chrome
        else if (name.includes('mufler')) {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#dcdde2'),
            metalness: 0.98,
            roughness: 0.06,
            envMapIntensity: 2.5,
          });
        }
      }
    });
  }, [scene]);

  // Synchronize materials instantaneously whenever currentSpec updates
  useEffect(() => {
    if (!currentSpec) return;

    // Exterior Body Lacquer
    bodyMats.current.forEach((mat) => {
      mat.color.set(currentSpec.paint.color);
      mat.metalness = currentSpec.paint.metalness;
      mat.roughness = currentSpec.paint.roughness;
      mat.clearcoat = currentSpec.paint.clearcoat;
      mat.clearcoatRoughness = currentSpec.paint.clearcoatRoughness;
      mat.reflectivity = currentSpec.paint.reflectivity;
      mat.needsUpdate = true;
    });

    // Interior Cockpit Upholstery
    interiorMats.current.forEach((mat) => {
      mat.color.set(currentSpec.interior.color);
      mat.roughness = currentSpec.interior.roughness;
      mat.needsUpdate = true;
    });

    // High-Performance Brembo Calipers
    caliperMats.current.forEach((mat) => {
      mat.color.set(currentSpec.calipers.color);
      mat.emissive.set(currentSpec.calipers.emissive);
      mat.emissiveIntensity = currentSpec.calipers.emissiveIntensity;
      mat.metalness = currentSpec.calipers.metalness;
      mat.roughness = currentSpec.calipers.roughness;
      mat.needsUpdate = true;
    });

    // Rims & Alloys
    rimMats.current.forEach((mat) => {
      mat.color.set(currentSpec.rims.color);
      mat.metalness = currentSpec.rims.metalness;
      mat.roughness = currentSpec.rims.roughness;
      mat.needsUpdate = true;
    });

    // Badges & Emblems
    badgeMats.current.forEach((mat) => {
      mat.color.set(currentSpec.badgeColor);
      mat.needsUpdate = true;
    });
  }, [currentSpec]);

  // Build projected Decal geometries conforming to the body panels
  const decalGeos = useMemo(() => {
    if (!scene) return null;
    let hoodMesh = null;
    let fenderMesh = null;

    scene.traverse((c) => {
      if (c.isMesh) {
        if (c.name === 'Hood') hoodMesh = c;
        if (c.name === 'Front_Fender') fenderMesh = c;
      }
    });

    const geos = {};

    if (hoodMesh) {
      try {
        hoodMesh.updateMatrixWorld(true);
        geos.hoodCenter = new DecalGeometry(
          hoodMesh,
          new THREE.Vector3(0.015, 0.84, -1.15),
          new THREE.Euler(-Math.PI / 2 + 0.12, 0, 0),
          new THREE.Vector3(0.72, 0.72, 0.55)
        );
      } catch (e) {
        console.warn('Decal hoodCenter projection error:', e);
      }

      try {
        geos.stingerSpear = new DecalGeometry(
          hoodMesh,
          new THREE.Vector3(0.015, 0.84, -1.16),
          new THREE.Euler(-Math.PI / 2 + 0.12, 0, 0),
          new THREE.Vector3(0.68, 1.38, 0.6)
        );
      } catch (e) {
        console.warn('Decal stingerSpear projection error:', e);
      }
    }

    if (fenderMesh) {
      try {
        fenderMesh.updateMatrixWorld(true);
        geos.fenderLeft = new DecalGeometry(
          fenderMesh,
          new THREE.Vector3(-0.84, 0.73, -1.02),
          new THREE.Euler(-0.25, -Math.PI / 2 + 0.15, -0.42),
          new THREE.Vector3(0.55, 0.45, 0.5)
        );
      } catch (e) {
        console.warn('Decal fenderLeft projection error:', e);
      }

      try {
        geos.fenderRight = new DecalGeometry(
          fenderMesh,
          new THREE.Vector3(0.87, 0.73, -1.02),
          new THREE.Euler(-0.25, Math.PI / 2 - 0.15, 0.42),
          new THREE.Vector3(0.55, 0.45, 0.5)
        );
      } catch (e) {
        console.warn('Decal fenderRight projection error:', e);
      }
    }

    return geos;
  }, [scene]);

  // Compute active sticker texture according to spec and sticker type
  const decalTexture = useMemo(() => {
    if (!currentSpec || activeStickerId === 'none') return null;

    const isYellow = currentSpec.id === 'velocity-yellow';
    const isOrange = currentSpec.id === 'sebring-orange';
    const isRed = currentSpec.id === 'torch-red';
    const isBlue = currentSpec.id === 'laguna-blue';
    const isWhite = currentSpec.id === 'arctic-white';

    if (activeStickerId === 'jake') {
      if (isYellow) return createJakeTexture('#101114', '#f5b800');
      if (isOrange) return createJakeTexture('#101114', '#ff6622');
      if (isRed) return createJakeTexture('#ffffff', '#d3101c');
      if (isBlue) return createJakeTexture('#101114', '#00b4ff');
      if (isWhite) return createJakeTexture('#101114', '#d3101c');
      return createJakeTexture('#141418', '#ff1a26');
    }

    if (activeStickerId === 'grand_sport') {
      if (isRed) return createGrandSportTexture('#f0f2f5', '#9ca3af');
      if (isOrange) return createGrandSportTexture('#101114', '#e64a19');
      if (isWhite) return createGrandSportTexture('#d3101c', '#101114');
      if (isYellow) return createGrandSportTexture('#101114', '#f5b800');
      if (isBlue) return createGrandSportTexture('#101114', '#eab308');
      return createGrandSportTexture('#e0141f', '#141418');
    }

    if (activeStickerId === 'stinger') {
      if (isBlue) return createStingerTexture('#101114', '#00b4ff');
      if (isYellow) return createStingerTexture('#101114', '#f5b800');
      if (isOrange) return createStingerTexture('#101114', '#ff7733');
      if (isRed) return createStingerTexture('#101114', '#d3101c');
      if (isWhite) return createStingerTexture('#101114', '#d3101c');
      return createStingerTexture('#141418', '#ff1a26');
    }

    if (activeStickerId === 'roundel') {
      if (isWhite) return createRoundelTexture('#101114', '#d3101c');
      if (isYellow) return createRoundelTexture('#101114', '#f5b800');
      if (isRed) return createRoundelTexture('#101114', '#ffffff');
      if (isOrange) return createRoundelTexture('#101114', '#e64a19');
      if (isBlue) return createRoundelTexture('#101114', '#0066cc');
      return createRoundelTexture('#141418', '#ff1a26');
    }

    if (activeStickerId === 'stealth_jake') {
      return createStealthJakeTexture();
    }

    return null;
  }, [currentSpec, activeStickerId]);

  // Dynamic animation loop driven by timeline progress
  useFrame((state, delta) => {
    if (!carGroupRef.current) return;

    const p = timelineProgress;

    // Headlight ignition logic (Expanded chapter: 0.42 -> 0.62)
    let hlIntensity = 0;
    if (p >= 0.42 && p <= 0.62) {
      if (p < 0.48) {
        hlIntensity = ((p - 0.42) / 0.06) * 5.0;
      } else if (p <= 0.56) {
        hlIntensity = 5.0;
      } else {
        hlIntensity = (1 - (p - 0.56) / 0.06) * 5.0;
      }
    }
    headlightMats.current.forEach((mat) => {
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, hlIntensity, 0.12);
    });

    // Taillight ignition logic (Expanded rear chapter: 0.70 -> 0.88)
    let tlIntensity = 0.8;
    if (p >= 0.7 && p <= 0.88) {
      if (p < 0.76) {
        tlIntensity = 0.8 + ((p - 0.7) / 0.06) * 5.5;
      } else if (p <= 0.84) {
        tlIntensity = 6.3;
      } else {
        tlIntensity = 6.3 - ((p - 0.84) / 0.04) * 4.5;
      }
    }
    taillightMats.current.forEach((mat) => {
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, tlIntensity, 0.12);
    });

    // Subtle physical mouse parallax when in cinematic mode
    if (!isExploreMode) {
      const mouseYaw = (mouseOffset?.x || 0) * 0.035;
      const mousePitch = (mouseOffset?.y || 0) * 0.015;

      carGroupRef.current.position.set(0, 0, 0);
      carGroupRef.current.rotation.y = THREE.MathUtils.damp(
        carGroupRef.current.rotation.y,
        mouseYaw,
        3.5,
        delta
      );
      carGroupRef.current.rotation.x = THREE.MathUtils.damp(
        carGroupRef.current.rotation.x,
        mousePitch,
        3.5,
        delta
      );
    }
  });

  return (
    <group ref={carGroupRef} position={[0, 0, 0]} dispose={null}>
      <primitive object={scene} />

      {/* Dynamic Curated Decals & Stickers Conforming to Body Panels */}
      {activeStickerId !== 'none' && decalTexture && (
        <>
          {/* Hood Center Decals: Jake Skull, Roundel, Stealth Jake */}
          {(activeStickerId === 'jake' ||
            activeStickerId === 'roundel' ||
            activeStickerId === 'stealth_jake') &&
            decalGeos?.hoodCenter && (
              <mesh geometry={decalGeos.hoodCenter}>
                <meshPhysicalMaterial
                  map={decalTexture}
                  transparent
                  depthTest
                  depthWrite={false}
                  polygonOffset
                  polygonOffsetFactor={-4}
                  roughness={0.15}
                  metalness={0.2}
                  clearcoat={1.0}
                  clearcoatRoughness={0.04}
                  envMapIntensity={2.0}
                />
              </mesh>
            )}

          {/* Stinger Hood Spear */}
          {activeStickerId === 'stinger' && decalGeos?.stingerSpear && (
            <mesh geometry={decalGeos.stingerSpear}>
              <meshPhysicalMaterial
                map={decalTexture}
                transparent
                depthTest
                depthWrite={false}
                polygonOffset
                polygonOffsetFactor={-4}
                roughness={0.15}
                metalness={0.2}
                clearcoat={1.0}
                clearcoatRoughness={0.04}
                envMapIntensity={2.0}
              />
            </mesh>
          )}

          {/* Grand Sport Fender Hash Marks */}
          {activeStickerId === 'grand_sport' && (
            <>
              {decalGeos?.fenderLeft && (
                <mesh geometry={decalGeos.fenderLeft}>
                  <meshPhysicalMaterial
                    map={decalTexture}
                    transparent
                    depthTest
                    depthWrite={false}
                    polygonOffset
                    polygonOffsetFactor={-4}
                    roughness={0.15}
                    metalness={0.2}
                    clearcoat={1.0}
                    clearcoatRoughness={0.04}
                    envMapIntensity={2.0}
                  />
                </mesh>
              )}
              {decalGeos?.fenderRight && (
                <mesh geometry={decalGeos.fenderRight}>
                  <meshPhysicalMaterial
                    map={decalTexture}
                    transparent
                    depthTest
                    depthWrite={false}
                    polygonOffset
                    polygonOffsetFactor={-4}
                    roughness={0.15}
                    metalness={0.2}
                    clearcoat={1.0}
                    clearcoatRoughness={0.04}
                    envMapIntensity={2.0}
                  />
                </mesh>
              )}
              {/* Center Hood Spear Accent for Grand Sport */}
              {decalGeos?.stingerSpear && (
                <mesh geometry={decalGeos.stingerSpear}>
                  <meshPhysicalMaterial
                    map={decalTexture}
                    transparent
                    depthTest
                    depthWrite={false}
                    polygonOffset
                    polygonOffsetFactor={-4}
                    roughness={0.15}
                    metalness={0.2}
                    clearcoat={1.0}
                    clearcoatRoughness={0.04}
                    envMapIntensity={2.0}
                  />
                </mesh>
              )}
            </>
          )}
        </>
      )}
    </group>
  );
}

useGLTF.preload('/models/corvette_c7.glb');
