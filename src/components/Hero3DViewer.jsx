import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const THEMES = {
  fire: {
    primary: 0xff6a2b,
    accent: 0xffb347,
    ambient: 0x1f140e,
    bgGlow: 'rgba(255, 106, 43, 0.25)',
    name: 'Blaze Energy',
  },
  cyber: {
    primary: 0x5ee7ff,
    accent: 0x9d4edd,
    ambient: 0x091428,
    bgGlow: 'rgba(94, 231, 255, 0.25)',
    name: 'Cyber Neon',
  },
  emerald: {
    primary: 0x38ef7d,
    accent: 0x11998e,
    ambient: 0x0a1e14,
    bgGlow: 'rgba(56, 239, 125, 0.25)',
    name: 'Bio Vitality',
  },
};

export default function Hero3DViewer() {
  const mountRef = useRef(null);
  const [modelType, setModelType] = useState('dumbbell');
  const [themeKey, setThemeKey] = useState('fire');
  const [isRotating, setIsRotating] = useState(true);
  const [rpm, setRpm] = useState(38);
  const [isDragging, setIsDragging] = useState(false);

  // References to communicate state into the 3D loop
  const stateRef = useRef({
    modelType: 'dumbbell',
    themeKey: 'fire',
    isRotating: true,
    userRotX: 0.35,
    userRotY: 0.6,
    targetRotX: 0.35,
    targetRotY: 0.6,
    isPointerDown: false,
    pointerStartX: 0,
    pointerStartY: 0,
    pointerLastX: 0,
    pointerLastY: 0,
    velocity: 0.015,
  });

  // Keep stateRef synced
  useEffect(() => {
    stateRef.current.modelType = modelType;
  }, [modelType]);

  useEffect(() => {
    stateRef.current.themeKey = themeKey;
  }, [themeKey]);

  useEffect(() => {
    stateRef.current.isRotating = isRotating;
  }, [isRotating]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 380;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 11);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(THEMES[themeKey].ambient, 1.8);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
    mainLight.position.set(5, 8, 7);
    scene.add(mainLight);

    const rimLight = new THREE.PointLight(THEMES[themeKey].primary, 5, 25);
    rimLight.position.set(-6, -4, -4);
    scene.add(rimLight);

    const accentLight = new THREE.PointLight(THEMES[themeKey].accent, 4, 25);
    accentLight.position.set(6, 4, -3);
    scene.add(accentLight);

    // Root model holder
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Halo Rings in background
    const haloGroup = new THREE.Group();
    const haloGeo = new THREE.TorusGeometry(3.8, 0.035, 16, 64);
    const haloMat = new THREE.MeshBasicMaterial({
      color: THEMES[themeKey].primary,
      transparent: true,
      opacity: 0.35,
    });
    const haloMesh1 = new THREE.Mesh(haloGeo, haloMat);
    const haloMesh2 = new THREE.Mesh(
      new THREE.TorusGeometry(4.3, 0.02, 16, 64),
      new THREE.MeshBasicMaterial({ color: THEMES[themeKey].accent, transparent: true, opacity: 0.25 })
    );
    haloGroup.add(haloMesh1);
    haloGroup.add(haloMesh2);
    haloGroup.rotation.x = Math.PI * 0.25;
    scene.add(haloGroup);

    // BUILD MODELS
    let activeModelGroup = new THREE.Group();
    rootGroup.add(activeModelGroup);

    // Helper material generator
    const getMaterials = (theme) => {
      const t = THEMES[theme];
      return {
        metalDark: new THREE.MeshStandardMaterial({
          color: 0x181c2b,
          metalness: 0.85,
          roughness: 0.25,
        }),
        metalChrome: new THREE.MeshStandardMaterial({
          color: 0xdde6f5,
          metalness: 0.95,
          roughness: 0.15,
        }),
        accentEmissive: new THREE.MeshStandardMaterial({
          color: t.primary,
          emissive: t.primary,
          emissiveIntensity: 0.7,
          roughness: 0.3,
          metalness: 0.5,
        }),
        glowRing: new THREE.MeshBasicMaterial({
          color: t.accent,
          transparent: true,
          opacity: 0.75,
        }),
      };
    };

    let mats = getMaterials(themeKey);

    const createDumbbell = (materials) => {
      const g = new THREE.Group();

      // Center Grip Bar
      const barGeo = new THREE.CylinderGeometry(0.24, 0.24, 4.2, 32);
      const barMesh = new THREE.Mesh(barGeo, materials.metalChrome);
      barMesh.rotation.z = Math.PI / 2;
      g.add(barMesh);

      // Grip knurling ring in center
      const gripGeo = new THREE.CylinderGeometry(0.26, 0.26, 2.0, 32);
      const gripMesh = new THREE.Mesh(gripGeo, materials.metalDark);
      gripMesh.rotation.z = Math.PI / 2;
      g.add(gripMesh);

      // Left & Right Plate Stacks
      [-1.5, 1.5].forEach((sideX) => {
        const dir = sideX > 0 ? 1 : -1;

        // Big outer plate
        const bigPlateGeo = new THREE.CylinderGeometry(1.65, 1.65, 0.32, 40);
        const bigPlate = new THREE.Mesh(bigPlateGeo, materials.metalDark);
        bigPlate.rotation.z = Math.PI / 2;
        bigPlate.position.x = sideX;
        g.add(bigPlate);

        // Outer Plate Ring Emissive Accent
        const ringGeo = new THREE.TorusGeometry(1.66, 0.05, 16, 40);
        const ringMesh = new THREE.Mesh(ringGeo, materials.accentEmissive);
        ringMesh.rotation.y = Math.PI / 2;
        ringMesh.position.x = sideX;
        g.add(ringMesh);

        // Medium Plate
        const medPlateGeo = new THREE.CylinderGeometry(1.35, 1.35, 0.28, 36);
        const medPlate = new THREE.Mesh(medPlateGeo, materials.metalChrome);
        medPlate.rotation.z = Math.PI / 2;
        medPlate.position.x = sideX + dir * 0.32;
        g.add(medPlate);

        // Outer Hex collar cap
        const collarGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.25, 6);
        const collar = new THREE.Mesh(collarGeo, materials.metalChrome);
        collar.rotation.z = Math.PI / 2;
        collar.position.x = sideX + dir * 0.6;
        g.add(collar);
      });

      // Floating energy orbit around dumbbell
      const orbitGeo = new THREE.TorusGeometry(2.3, 0.03, 16, 64);
      const orbitMesh = new THREE.Mesh(orbitGeo, materials.glowRing);
      orbitMesh.rotation.y = Math.PI * 0.3;
      g.add(orbitMesh);

      return g;
    };

    const createKettlebell = (materials) => {
      const g = new THREE.Group();

      // Main sphere bell
      const bellGeo = new THREE.SphereGeometry(1.8, 36, 36);
      const bellMesh = new THREE.Mesh(bellGeo, materials.metalDark);
      bellMesh.scale.set(1, 0.92, 1);
      g.add(bellMesh);

      // Flattened base
      const baseGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.25, 32);
      const baseMesh = new THREE.Mesh(baseGeo, materials.metalChrome);
      baseMesh.position.y = -1.6;
      g.add(baseMesh);

      // Glowing equator line
      const equatorGeo = new THREE.TorusGeometry(1.81, 0.05, 16, 48);
      const equatorMesh = new THREE.Mesh(equatorGeo, materials.accentEmissive);
      equatorMesh.rotation.x = Math.PI / 2;
      g.add(equatorMesh);

      // Handle horns
      const handleGeo = new THREE.TorusGeometry(1.15, 0.22, 24, 48, Math.PI);
      const handleMesh = new THREE.Mesh(handleGeo, materials.metalChrome);
      handleMesh.position.y = 1.4;
      g.add(handleMesh);

      // Top crossbar grip
      const topBarGeo = new THREE.CylinderGeometry(0.22, 0.22, 1.4, 24);
      const topBarMesh = new THREE.Mesh(topBarGeo, materials.metalDark);
      topBarMesh.rotation.z = Math.PI / 2;
      topBarMesh.position.y = 2.55;
      g.add(topBarMesh);

      // Levitating energy halo
      const haloEnergyGeo = new THREE.TorusGeometry(2.4, 0.025, 16, 64);
      const haloEnergy = new THREE.Mesh(haloEnergyGeo, materials.glowRing);
      haloEnergy.position.y = -0.5;
      haloEnergy.rotation.x = Math.PI / 2;
      g.add(haloEnergy);

      return g;
    };

    const createVitalCore = (materials) => {
      const g = new THREE.Group();

      // Pulsing faceted heart/core crystal
      const coreGeo = new THREE.IcosahedronGeometry(1.5, 0);
      const coreMesh = new THREE.Mesh(coreGeo, materials.accentEmissive);
      g.add(coreMesh);

      // Inner glowing core
      const innerGeo = new THREE.OctahedronGeometry(0.9, 0);
      const innerMesh = new THREE.Mesh(
        innerGeo,
        new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
      );
      g.add(innerMesh);

      // Gyroscopic Outer Rings
      const ring1Geo = new THREE.TorusGeometry(2.3, 0.045, 16, 64);
      const ring1 = new THREE.Mesh(ring1Geo, materials.metalChrome);
      g.add(ring1);

      const ring2Geo = new THREE.TorusGeometry(2.7, 0.04, 16, 64);
      const ring2 = new THREE.Mesh(ring2Geo, materials.glowRing);
      ring2.rotation.x = Math.PI / 3;
      g.add(ring2);

      const ring3Geo = new THREE.TorusGeometry(3.1, 0.035, 16, 64);
      const ring3 = new THREE.Mesh(ring3Geo, materials.metalDark);
      ring3.rotation.y = Math.PI / 3;
      g.add(ring3);

      return g;
    };

    const createMuscleAvatar = (materials) => {
      const g = new THREE.Group();

      // Head
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 20, 20), materials.metalChrome);
      head.position.y = 2.4;
      g.add(head);

      // Neck
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.35, 16), materials.metalDark);
      neck.position.y = 1.95;
      g.add(neck);

      // Torso / Chest
      const chest = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.1, 0.8), materials.metalDark);
      chest.position.y = 1.25;
      g.add(chest);

      // Glowing Pectoral / Core Emissive nodes
      const chestGlow = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.55, 0.85), materials.accentEmissive);
      chestGlow.position.y = 1.35;
      g.add(chestGlow);

      // Abs / Midriff
      const abs = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 0.7), materials.metalDark);
      abs.position.y = 0.35;
      g.add(abs);

      // Core glow strip
      const absGlow = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.7, 0.75), materials.accentEmissive);
      absGlow.position.y = 0.35;
      g.add(absGlow);

      // Shoulders & Arms
      [-1.15, 1.15].forEach((x) => {
        // Shoulder Deltoid
        const sh = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 16), materials.accentEmissive);
        sh.position.set(x, 1.55, 0);
        g.add(sh);

        // Bicep / Arm
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.22, 1.3, 16), materials.metalChrome);
        arm.position.set(x, 0.7, 0);
        g.add(arm);
      });

      // Pelvis
      const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.55, 0.5, 16), materials.metalDark);
      pelvis.position.y = -0.3;
      g.add(pelvis);

      // Legs / Quads
      [-0.5, 0.5].forEach((x) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.25, 1.8, 16), materials.metalDark);
        leg.position.set(x, -1.35, 0);
        g.add(leg);

        // Quad highlight
        const quad = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.9, 0.4), materials.accentEmissive);
        quad.position.set(x, -1.15, 0.15);
        g.add(quad);
      });

      // Aura Orbit
      const aura = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.03, 16, 64), materials.glowRing);
      aura.rotation.x = Math.PI * 0.45;
      g.add(aura);

      return g;
    };

    // Rebuild the model when modelType changes
    const rebuildModel = (type, currentMats) => {
      rootGroup.remove(activeModelGroup);
      activeModelGroup.clear();

      let newModel;
      if (type === 'dumbbell') newModel = createDumbbell(currentMats);
      else if (type === 'kettlebell') newModel = createKettlebell(currentMats);
      else if (type === 'vital_core') newModel = createVitalCore(currentMats);
      else if (type === 'muscle_avatar') newModel = createMuscleAvatar(currentMats);

      activeModelGroup = newModel;
      rootGroup.add(activeModelGroup);
    };

    rebuildModel(modelType, mats);

    // Update Theme Colors
    const applyTheme = (key) => {
      const theme = THEMES[key];
      ambientLight.color.setHex(theme.ambient);
      rimLight.color.setHex(theme.primary);
      accentLight.color.setHex(theme.accent);
      haloMat.color.setHex(theme.primary);
      mats = getMaterials(key);
      rebuildModel(stateRef.current.modelType, mats);
    };

    // POINTER & TOUCH DRAG CONTROLS
    const onPointerDown = (e) => {
      stateRef.current.isPointerDown = true;
      setIsDragging(true);
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      stateRef.current.pointerStartX = clientX;
      stateRef.current.pointerStartY = clientY;
      stateRef.current.pointerLastX = clientX;
      stateRef.current.pointerLastY = clientY;
    };

    const onPointerMove = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

      if (stateRef.current.isPointerDown) {
        const deltaX = clientX - stateRef.current.pointerLastX;
        const deltaY = clientY - stateRef.current.pointerLastY;

        stateRef.current.targetRotY += deltaX * 0.009;
        stateRef.current.targetRotX += deltaY * 0.009;
        stateRef.current.velocity = Math.abs(deltaX) * 0.005 + 0.01;

        stateRef.current.pointerLastX = clientX;
        stateRef.current.pointerLastY = clientY;
      }
    };

    const onPointerUp = () => {
      stateRef.current.isPointerDown = false;
      setIsDragging(false);
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId;
    let clock = new THREE.Clock();
    let currentModelTypeCached = modelType;
    let currentThemeKeyCached = themeKey;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Check if state changed from outside
      if (currentModelTypeCached !== stateRef.current.modelType) {
        currentModelTypeCached = stateRef.current.modelType;
        rebuildModel(currentModelTypeCached, mats);
      }
      if (currentThemeKeyCached !== stateRef.current.themeKey) {
        currentThemeKeyCached = stateRef.current.themeKey;
        applyTheme(currentThemeKeyCached);
      }

      // Auto rotation
      if (stateRef.current.isRotating && !stateRef.current.isPointerDown) {
        stateRef.current.targetRotY += 0.012;
      }

      // Smooth interpolation (lerp)
      stateRef.current.userRotX += (stateRef.current.targetRotX - stateRef.current.userRotX) * 0.08;
      stateRef.current.userRotY += (stateRef.current.targetRotY - stateRef.current.userRotY) * 0.08;

      rootGroup.rotation.x = stateRef.current.userRotX;
      rootGroup.rotation.y = stateRef.current.userRotY;

      // Bobbing floating motion
      rootGroup.position.y = Math.sin(elapsed * 2.2) * 0.18;

      // Spin halo background rings
      haloGroup.rotation.z = elapsed * 0.2;
      haloMesh2.rotation.z = -elapsed * 0.15;

      // Heartbeat pulse effect for vital core
      if (stateRef.current.modelType === 'vital_core' && activeModelGroup.children[0]) {
        const pulse = 1 + Math.sin(elapsed * 7) * 0.09 * (Math.sin(elapsed * 3.5) > 0 ? 1.4 : 0.6);
        activeModelGroup.children[0].scale.set(pulse, pulse, pulse);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Rpm counter interval for HUD
    const rpmInterval = setInterval(() => {
      setRpm((prev) => {
        const target = stateRef.current.isPointerDown ? 72 : stateRef.current.isRotating ? 42 : 0;
        return Math.round(prev + (target - prev) * 0.2);
      });
    }, 200);

    return () => {
      clearInterval(rpmInterval);
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      dom.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('resize', handleResize);
      if (container.contains(dom)) {
        container.removeChild(dom);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="hero-3d-container">
      {/* 3D Canvas Canvas Mount */}
      <div
        ref={mountRef}
        className={`hero-3d-canvas-wrap ${isDragging ? 'grabbing' : 'grab'}`}
        style={{
          boxShadow: `0 0 90px ${THEMES[themeKey].bgGlow}`,
        }}
      />

      {/* Floating 3D Telemetry HUD Cards */}
      <div className="hud-badge top-badge glass">
        <span className="hud-dot" />
        <b>3D Interactive Fitness Viewport</b>
        <span className="hud-sub">Drag 360° to rotate</span>
      </div>

      <div className="hud-card hud-top-right glass">
        <div className="hud-label">CALORIE BURN</div>
        <div className="hud-val">🔥 520 <small>kcal</small></div>
      </div>

      <div className="hud-card hud-bottom-left glass">
        <div className="hud-label">VITAL FREQUENCY</div>
        <div className="hud-val">⚡ {rpm > 10 ? '164' : '72'} <small>BPM</small></div>
      </div>

      <div className="hud-card hud-bottom-right glass">
        <div className="hud-label">KINETIC LOAD</div>
        <div className="hud-val">💪 32.5 <small>kg</small></div>
      </div>

      {/* Interactive 3D Model Switcher Toolbar */}
      <div className="hero-3d-toolbar glass">
        <div className="toolbar-label">SELECT 3D APPARATUS:</div>
        <div className="toolbar-btn-group">
          <button
            type="button"
            className={`toolbar-btn ${modelType === 'dumbbell' ? 'active' : ''}`}
            onClick={() => setModelType('dumbbell')}
          >
            🏋️ Pro Dumbbell
          </button>
          <button
            type="button"
            className={`toolbar-btn ${modelType === 'kettlebell' ? 'active' : ''}`}
            onClick={() => setModelType('kettlebell')}
          >
            ⚡ Kettlebell
          </button>
          <button
            type="button"
            className={`toolbar-btn ${modelType === 'vital_core' ? 'active' : ''}`}
            onClick={() => setModelType('vital_core')}
          >
            ❤️ Vital Core
          </button>
          <button
            type="button"
            className={`toolbar-btn ${modelType === 'muscle_avatar' ? 'active' : ''}`}
            onClick={() => setModelType('muscle_avatar')}
          >
            🧍 3D Anatomy
          </button>
        </div>

        <div className="toolbar-sub-row">
          <div className="theme-selector">
            <span className="sub-lbl">Neon Lighting:</span>
            {Object.keys(THEMES).map((key) => (
              <button
                key={key}
                type="button"
                className={`theme-dot ${themeKey === key ? 'active' : ''}`}
                style={{
                  background: key === 'fire' ? '#ff6a2b' : key === 'cyber' ? '#5ee7ff' : '#38ef7d',
                }}
                onClick={() => setThemeKey(key)}
                title={THEMES[key].name}
              />
            ))}
          </div>

          <button
            type="button"
            className="spin-toggle-btn"
            onClick={() => setIsRotating((r) => !r)}
          >
            {isRotating ? '⏸ Pause Spin' : '▶ Auto Orbit'}
          </button>
        </div>
      </div>
    </div>
  );
}
