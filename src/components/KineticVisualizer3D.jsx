import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useExperience3D } from '../context/Experience3DContext';

const EXERCISES_3D = {
  curl: {
    id: 'curl',
    name: 'Bicep Concentration Flex',
    target: 'Biceps Brachii',
    tempoDefault: 'hypertrophy',
    tempoSecs: { hypertrophy: { up: 1.0, hold: 0.8, down: 2.8 }, strength: { up: 1.2, hold: 0.3, down: 1.8 }, burn: { up: 0.7, hold: 0.1, down: 0.8 } },
    desc: 'Rotational elbow flexion with dynamic forearm kinematics and peak concentric contraction flare.',
    wattMultiplier: 28,
  },
  press: {
    id: 'press',
    name: 'Olympic Overhead Piston Press',
    target: 'Deltoids & Triceps',
    tempoDefault: 'strength',
    tempoSecs: { hypertrophy: { up: 1.2, hold: 0.6, down: 2.5 }, strength: { up: 1.0, hold: 0.4, down: 1.6 }, burn: { up: 0.6, hold: 0.1, down: 0.7 } },
    desc: 'Vertical barbell press along the biomechanical scaption plane with dual kinetic thrust vectors.',
    wattMultiplier: 42,
  },
  swing: {
    id: 'swing',
    name: 'Ballistic Kettlebell Arc',
    target: 'Glutes, Hamstrings & Core',
    tempoDefault: 'burn',
    tempoSecs: { hypertrophy: { up: 1.1, hold: 0.4, down: 1.8 }, strength: { up: 1.0, hold: 0.2, down: 1.4 }, burn: { up: 0.65, hold: 0.15, down: 0.75 } },
    desc: 'High-velocity hip hinge transferring kinetic torque through an orbital arc trajectory.',
    wattMultiplier: 56,
  },
};

export default function KineticVisualizer3D() {
  const mountRef = useRef(null);
  const { themeConfig, triggerClickAudio, triggerRepSuccessAudio } = useExperience3D();

  const [activeEx, setActiveEx] = useState('curl');
  const [tempoMode, setTempoMode] = useState('hypertrophy');
  const [weightKg, setWeightKg] = useState(24);
  const [isPaused, setIsPaused] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [livePowerWatts, setLivePowerWatts] = useState(140);
  const [phaseName, setPhaseName] = useState('Concentric (Lift)');
  const [isDragging, setIsDragging] = useState(false);

  // Communication ref to 3D loop
  const animStateRef = useRef({
    activeEx: 'curl',
    tempoMode: 'hypertrophy',
    weightKg: 24,
    isPaused: false,
    themeConfig,
    rotX: 0.15,
    rotY: -0.3,
    targetRotX: 0.15,
    targetRotY: -0.3,
    isPointerDown: false,
    lastMouseX: 0,
    lastMouseY: 0,
    repCounter: 0,
    lastPhase: 'down',
  });

  useEffect(() => {
    animStateRef.current.activeEx = activeEx;
    animStateRef.current.tempoMode = tempoMode;
    animStateRef.current.weightKg = weightKg;
    animStateRef.current.isPaused = isPaused;
    animStateRef.current.themeConfig = themeConfig;
  }, [activeEx, tempoMode, weightKg, isPaused, themeConfig]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 540;
    const height = container.clientHeight || 420;

    // Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // Dynamic Lights
    const ambientLight = new THREE.AmbientLight(0x0e1424, 2.5);
    scene.add(ambientLight);

    const mainSpot = new THREE.SpotLight(0xffffff, 4.5, 30, Math.PI / 4, 0.4);
    mainSpot.position.set(4, 7, 6);
    scene.add(mainSpot);

    const rimLight1 = new THREE.PointLight(themeConfig.primaryHex || 0xff6a2b, 4, 20);
    rimLight1.position.set(-5, -2, -3);
    scene.add(rimLight1);

    const rimLight2 = new THREE.PointLight(themeConfig.secondaryHex || 0x5ee7ff, 3.5, 20);
    rimLight2.position.set(5, 3, -3);
    scene.add(rimLight2);

    // Root Group
    const rootRig = new THREE.Group();
    scene.add(rootRig);

    // Pedestal stage disc
    const stageGeo = new THREE.CylinderGeometry(3.6, 3.6, 0.15, 48);
    const stageMat = new THREE.MeshStandardMaterial({
      color: 0x12172b,
      roughness: 0.4,
      metalness: 0.8,
    });
    const stageDisc = new THREE.Mesh(stageGeo, stageMat);
    stageDisc.position.y = -2.8;
    rootRig.add(stageDisc);

    // Glowing stage ring
    const ringGeo = new THREE.TorusGeometry(3.62, 0.04, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: themeConfig.secondaryHex || 0x5ee7ff,
      transparent: true,
      opacity: 0.7,
    });
    const stageRing = new THREE.Mesh(ringGeo, ringMat);
    stageRing.rotation.x = Math.PI / 2;
    stageRing.position.y = -2.75;
    rootRig.add(stageRing);

    // Particle Aura Cloud
    const partCount = 140;
    const partGeo = new THREE.BufferGeometry();
    const partPositions = new Float32Array(partCount * 3);
    for (let i = 0; i < partCount * 3; i += 3) {
      partPositions[i] = (Math.random() - 0.5) * 8;
      partPositions[i + 1] = (Math.random() - 0.5) * 6 - 0.5;
      partPositions[i + 2] = (Math.random() - 0.5) * 6;
    }
    partGeo.setAttribute('position', new THREE.BufferAttribute(partPositions, 3));
    const partMat = new THREE.PointsMaterial({
      size: 0.08,
      color: themeConfig.primaryHex || 0xff6a2b,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particleCloud = new THREE.Points(partGeo, partMat);
    rootRig.add(particleCloud);

    // MATERIALS
    const mats = {
      chrome: new THREE.MeshStandardMaterial({ color: 0xe6eefc, metalness: 0.95, roughness: 0.12 }),
      steelDark: new THREE.MeshStandardMaterial({ color: 0x1f2438, metalness: 0.85, roughness: 0.3 }),
      accentGlow: new THREE.MeshStandardMaterial({
        color: themeConfig.primaryHex || 0xff6a2b,
        emissive: themeConfig.primaryHex || 0xff6a2b,
        emissiveIntensity: 0.8,
        roughness: 0.2,
      }),
      neonRing: new THREE.MeshBasicMaterial({
        color: themeConfig.secondaryHex || 0x5ee7ff,
        transparent: true,
        opacity: 0.85,
      }),
      flare: new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.0,
      }),
    };

    // 1. BICEP RIG
    const bicepRigGroup = new THREE.Group();
    // Arm base strut
    const armBase = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 1.8, 24), mats.steelDark);
    armBase.position.set(0, -0.6, 0);
    bicepRigGroup.add(armBase);

    // Elbow pivot
    const elbowPivot = new THREE.Group();
    elbowPivot.position.set(0, 0.3, 0);
    bicepRigGroup.add(elbowPivot);

    const elbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.36, 20, 20), mats.chrome);
    elbowPivot.add(elbowJoint);

    // Forearm
    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.22, 2.2, 24), mats.steelDark);
    forearm.position.set(0, 1.1, 0);
    elbowPivot.add(forearm);

    // Forearm energy strip
    const forearmStrip = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.8, 0.28), mats.accentGlow);
    forearmStrip.position.set(0, 1.1, 0);
    elbowPivot.add(forearmStrip);

    // Flex Contraction Glow Flare
    const flexFlareGeo = new THREE.SphereGeometry(0.48, 16, 16);
    const flexFlare = new THREE.Mesh(flexFlareGeo, mats.flare);
    flexFlare.position.set(0, 0.7, 0.3);
    elbowPivot.add(flexFlare);

    // Dumbbell on end of forearm
    const dumbbellHolder = new THREE.Group();
    dumbbellHolder.position.set(0, 2.2, 0);
    dumbbellHolder.rotation.z = Math.PI / 2;
    elbowPivot.add(dumbbellHolder);

    const dbBar = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.8, 20), mats.chrome);
    dumbbellHolder.add(dbBar);

    [-1.0, 1.0].forEach((side) => {
      const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.22, 32), mats.steelDark);
      p1.position.y = side * 1.1;
      dumbbellHolder.add(p1);

      const pRing = new THREE.Mesh(new THREE.TorusGeometry(0.86, 0.035, 16, 32), mats.accentGlow);
      pRing.rotation.x = Math.PI / 2;
      pRing.position.y = side * 1.1;
      dumbbellHolder.add(pRing);

      const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.18, 24), mats.chrome);
      p2.position.y = side * 1.28;
      dumbbellHolder.add(p2);
    });

    // 2. OVERHEAD PRESS RIG
    const pressRigGroup = new THREE.Group();
    // Dual vertical guide rails
    [-1.8, 1.8].forEach((gx) => {
      const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 5.0, 16), mats.chrome);
      rail.position.set(gx, 0.4, 0);
      pressRigGroup.add(rail);

      const railBase = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.4), mats.steelDark);
      railBase.position.set(gx, -2.1, 0);
      pressRigGroup.add(railBase);
    });

    const barbellCarrier = new THREE.Group();
    pressRigGroup.add(barbellCarrier);

    const olympicBar = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 4.6, 24), mats.chrome);
    olympicBar.rotation.z = Math.PI / 2;
    barbellCarrier.add(olympicBar);

    // Knurled center grip zones
    [-0.6, 0.6].forEach((kx) => {
      const knurl = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.6, 20), mats.steelDark);
      knurl.rotation.z = Math.PI / 2;
      knurl.position.x = kx;
      barbellCarrier.add(knurl);
    });

    // Olympic Plates on sides
    [-2.0, 2.0].forEach((px) => {
      const dir = px > 0 ? 1 : -1;
      const bigPlate = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.22, 36), mats.steelDark);
      bigPlate.rotation.z = Math.PI / 2;
      bigPlate.position.x = px;
      barbellCarrier.add(bigPlate);

      const plateNeon = new THREE.Mesh(new THREE.TorusGeometry(1.21, 0.04, 16, 36), mats.accentGlow);
      plateNeon.rotation.y = Math.PI / 2;
      plateNeon.position.x = px;
      barbellCarrier.add(plateNeon);

      const smallPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.18, 28), mats.chrome);
      smallPlate.rotation.z = Math.PI / 2;
      smallPlate.position.x = px + dir * 0.22;
      barbellCarrier.add(smallPlate);
    });

    // Vertical Energy Beam vector trails
    const beamGeo = new THREE.CylinderGeometry(0.04, 0.12, 1.8, 16);
    [-1.2, 1.2].forEach((bx) => {
      const beam = new THREE.Mesh(beamGeo, mats.neonRing);
      beam.position.set(bx, -0.9, 0);
      barbellCarrier.add(beam);
    });

    // 3. KETTLEBELL SWING RIG
    const swingRigGroup = new THREE.Group();
    const swingPivot = new THREE.Group();
    swingPivot.position.set(0, 1.4, 0);
    swingRigGroup.add(swingPivot);

    const tether = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.5, 16), mats.chrome);
    tether.position.set(0, -1.25, 0);
    swingPivot.add(tether);

    const kbHead = new THREE.Group();
    kbHead.position.set(0, -2.5, 0);
    swingPivot.add(kbHead);

    const kbSphere = new THREE.Mesh(new THREE.SphereGeometry(1.0, 28, 28), mats.steelDark);
    kbSphere.scale.set(1, 0.92, 1);
    kbHead.add(kbSphere);

    const kbRing = new THREE.Mesh(new THREE.TorusGeometry(1.02, 0.04, 16, 36), mats.accentGlow);
    kbRing.rotation.x = Math.PI / 2;
    kbHead.add(kbRing);

    const kbHandle = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.12, 16, 28, Math.PI), mats.chrome);
    kbHandle.position.y = 0.85;
    kbHead.add(kbHandle);

    // Orbital Arc Guideline
    const arcGeo = new THREE.TorusGeometry(2.7, 0.02, 16, 64, Math.PI * 0.8);
    const arcGuide = new THREE.Mesh(arcGeo, mats.neonRing);
    arcGuide.rotation.y = Math.PI / 2;
    arcGuide.rotation.z = Math.PI * 0.1;
    arcGuide.position.set(0, 1.4, 0);
    swingRigGroup.add(arcGuide);

    // Initial Rig mounting
    rootRig.add(bicepRigGroup);
    rootRig.add(pressRigGroup);
    rootRig.add(swingRigGroup);

    // Pointer Interaction (orbit drag)
    const onPointerDown = (e) => {
      animStateRef.current.isPointerDown = true;
      animStateRef.current.lastMouseX = e.clientX;
      animStateRef.current.lastMouseY = e.clientY;
      setIsDragging(true);
    };

    const onPointerMove = (e) => {
      if (!animStateRef.current.isPointerDown) return;
      const dx = e.clientX - animStateRef.current.lastMouseX;
      const dy = e.clientY - animStateRef.current.lastMouseY;
      animStateRef.current.lastMouseX = e.clientX;
      animStateRef.current.lastMouseY = e.clientY;

      animStateRef.current.targetRotY += dx * 0.009;
      animStateRef.current.targetRotX += dy * 0.007;
      animStateRef.current.targetRotX = Math.max(-0.6, Math.min(0.6, animStateRef.current.targetRotX));
    };

    const onPointerUp = () => {
      animStateRef.current.isPointerDown = false;
      setIsDragging(false);
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Resize handler
    const onResize = () => {
      const newW = container.clientWidth || 540;
      const newH = container.clientHeight || 420;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let animId;
    let clock = new THREE.Clock();
    let repCycleTimer = 0;
    let lastThemeId = themeConfig.id;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const state = animStateRef.current;

      // Theme color syncing
      if (lastThemeId !== state.themeConfig.id) {
        lastThemeId = state.themeConfig.id;
        const curTheme = state.themeConfig;
        rimLight1.color.setHex(curTheme.primaryHex);
        rimLight2.color.setHex(curTheme.secondaryHex);
        mats.accentGlow.color.setHex(curTheme.primaryHex);
        mats.accentGlow.emissive.setHex(curTheme.primaryHex);
        mats.neonRing.color.setHex(curTheme.secondaryHex);
        stageRing.material.color.setHex(curTheme.secondaryHex);
        partMat.color.setHex(curTheme.primaryHex);
      }

      // Smooth damping for user drag rotation
      state.rotX += (state.targetRotX - state.rotX) * 0.1;
      state.rotY += (state.targetRotY - state.rotY) * 0.1;
      rootRig.rotation.x = state.rotX;
      rootRig.rotation.y = state.rotY;

      // Visibility toggles
      bicepRigGroup.visible = state.activeEx === 'curl';
      pressRigGroup.visible = state.activeEx === 'press';
      swingRigGroup.visible = state.activeEx === 'swing';

      // Kinetic Simulation Progression
      const exDef = EXERCISES_3D[state.activeEx] || EXERCISES_3D.curl;
      const cadence = exDef.tempoSecs[state.tempoMode] || exDef.tempoSecs.hypertrophy;
      const totalCycleTime = cadence.up + cadence.hold + cadence.down;

      if (!state.isPaused) {
        repCycleTimer = (repCycleTimer + delta) % totalCycleTime;
      }

      // Compute kinematic progression normalized 0..1
      let progress = 0; // 0 = start, 1 = peak contraction
      let currentPhase = 'Concentric (Lift)';
      let instantVelocity = 0;

      if (repCycleTimer < cadence.up) {
        // Lifting phase (Concentric)
        const tNorm = repCycleTimer / cadence.up;
        // Smooth sine ease in-out
        progress = Math.sin((tNorm * Math.PI) / 2);
        instantVelocity = Math.cos((tNorm * Math.PI) / 2) * (1 / cadence.up);
        currentPhase = 'Concentric (Lift)';

        if (state.lastPhase === 'down') {
          state.lastPhase = 'up';
        }
      } else if (repCycleTimer < cadence.up + cadence.hold) {
        // Peak Flex Hold
        progress = 1.0;
        instantVelocity = 0.05;
        currentPhase = 'Isometric (Peak Hold)';
      } else {
        // Lowering phase (Eccentric)
        const downTimer = repCycleTimer - (cadence.up + cadence.hold);
        const tNorm = downTimer / cadence.down;
        progress = 1.0 - Math.sin((tNorm * Math.PI) / 2);
        instantVelocity = -Math.cos((tNorm * Math.PI) / 2) * (1 / cadence.down);
        currentPhase = 'Eccentric (Control)';

        if (state.lastPhase === 'up') {
          state.lastPhase = 'down';
          state.repCounter += 1;
          setRepCount(state.repCounter);
          triggerRepSuccessAudio();
        }
      }

      setPhaseName(currentPhase);

      // Compute live Power in Watts
      const calcWatts = Math.round(Math.abs(instantVelocity) * state.weightKg * exDef.wattMultiplier * 0.8 + 20);
      setLivePowerWatts(calcWatts);

      // Apply Kinematics to 3D models
      if (state.activeEx === 'curl') {
        // Elbow angle: from relaxed -0.2 rad to peak contraction 2.35 rad
        const minAngle = -0.15;
        const maxAngle = 2.35;
        const currentAngle = minAngle + progress * (maxAngle - minAngle);
        elbowPivot.rotation.z = -currentAngle;

        // Flex Flare glow intensifies at peak contraction
        const flareOpacity = Math.max(0, (progress - 0.7) * 3.3);
        mats.flare.opacity = flareOpacity;
        flexFlare.scale.setScalar(1.0 + progress * 0.4);
      } else if (state.activeEx === 'press') {
        // Barbell lifts from chest y=-0.5 to full lockout y=2.2
        const minY = -0.5;
        const maxY = 2.2;
        barbellCarrier.position.y = minY + progress * (maxY - minY);
      } else if (state.activeEx === 'swing') {
        // Pendulum arc angle: -0.6 rad to 1.3 rad
        const minSw = -0.55;
        const maxSw = 1.25;
        swingPivot.rotation.x = minSw + progress * (maxSw - minSw);
      }

      // Rotate stage ring and floating particles
      stageRing.rotation.z = elapsed * 0.15;
      particleCloud.rotation.y = elapsed * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', onResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="kinetic-3d-visualizer-card glass">
      <div className="kinetic-head">
        <div>
          <div className="pill-badge-row" style={{ marginBottom: '8px' }}>
            <span className="pill neon-pulse">⚡ Kinetic Simulation Engine</span>
            <span className="pill-ghost">Real-time Biomechanics</span>
          </div>
          <h3 style={{ margin: 0 }}>Interactive 3D Cadence & Rep Analyzer</h3>
          <p style={{ margin: '4px 0 0', fontSize: '0.92rem' }}>
            Inspect kinematics in 360°, test hypertrophy lifting tempos, and evaluate power curves in real time.
          </p>
        </div>

        {/* Live Power Output HUD */}
        <div className="kinetic-telemetry-badge">
          <div className="k-badge-item">
            <span className="k-lbl">ACTIVE PHASE</span>
            <b className="k-val" style={{ color: 'var(--cy)' }}>{phaseName}</b>
          </div>
          <div className="k-badge-item">
            <span className="k-lbl">EST. POWER</span>
            <b className="k-val">{livePowerWatts} <small>W</small></b>
          </div>
          <div className="k-badge-item">
            <span className="k-lbl">REPS</span>
            <b className="k-val pulse-val">{repCount}</b>
          </div>
        </div>
      </div>

      {/* Main 3D Viewport & HUD Overlay */}
      <div className="kinetic-viewport-wrapper">
        <div
          ref={mountRef}
          className={`kinetic-canvas-mount ${isDragging ? 'grabbing' : 'grab'}`}
          title="Click and drag to orbit in 3D"
        />

        {/* Floating In-Viewport Badge */}
        <div className="kinetic-orbit-hint">
          <span>🖐️ Drag 360° to inspect biomechanical path</span>
        </div>

        {/* Floating Quick Stats */}
        <div className="kinetic-float-hud top-left">
          <span className="hud-label">APPARATUS WEIGHT</span>
          <span className="hud-val">{weightKg} <small>kg</small></span>
        </div>

        <div className="kinetic-float-hud top-right">
          <span className="hud-label">TARGET MUSCLE</span>
          <span className="hud-val" style={{ fontSize: '1.05rem', color: 'var(--cy)' }}>
            {EXERCISES_3D[activeEx]?.target}
          </span>
        </div>
      </div>

      {/* Control Console */}
      <div className="kinetic-controls-console">
        {/* Exercise Selection */}
        <div className="k-ctrl-group">
          <span className="k-ctrl-label">SELECT APPARATUS & EXERCISE</span>
          <div className="k-chips-row">
            {Object.keys(EXERCISES_3D).map((k) => {
              const ex = EXERCISES_3D[k];
              const active = activeEx === k;
              return (
                <button
                  key={k}
                  type="button"
                  className={`k-chip-btn ${active ? 'active' : ''}`}
                  onClick={() => {
                    triggerClickAudio();
                    setActiveEx(k);
                    setRepCount(0);
                    animStateRef.current.repCounter = 0;
                  }}
                >
                  {k === 'curl' && '💪'} {k === 'press' && '⚡'} {k === 'swing' && '🔥'} {ex.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tempo Selection & Resistance Slider */}
        <div className="k-sub-controls-grid">
          <div className="k-ctrl-group">
            <span className="k-ctrl-label">BIOMECHANICAL TEMPO MATRIX</span>
            <div className="k-chips-row">
              {[
                { id: 'hypertrophy', label: 'Hypertrophy (3-0-1s)' },
                { id: 'strength', label: 'Strength (2-1-2s)' },
                { id: 'burn', label: 'Explosive (1-0-1s)' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`k-chip-btn ${tempoMode === m.id ? 'active' : ''}`}
                  onClick={() => {
                    triggerClickAudio();
                    setTempoMode(m.id);
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="k-ctrl-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="k-ctrl-label">VIRTUAL RESISTANCE</span>
              <b style={{ color: 'var(--or)', fontSize: '0.95rem' }}>{weightKg} kg</b>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              step="2"
              value={weightKg}
              onChange={(e) => setWeightKg(parseInt(e.target.value, 10))}
              style={{ width: '100%', marginTop: '4px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
