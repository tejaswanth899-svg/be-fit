import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useExperience3D } from '../context/Experience3DContext';

const GOAL_PRESETS_3D = {
  hypertrophy: {
    id: 'hypertrophy',
    title: 'Lean Muscle Hypertrophy',
    icon: '💪',
    subtitle: 'Maximized myofibrillar accretion & progressive overload',
    colorHex: 0xff6a2b,
    accentHex: 0xff9a3d,
    projectedMuscle: '+4.2 kg',
    projectedFat: '-2.5%',
    caloricTarget: '2,850 kcal/day',
    proteinTarget: '165 g/day',
    weeklySplit: '4 Days (Upper / Lower)',
    ringScales: [1.3, 1.15, 0.9, 1.05],
  },
  shred: {
    id: 'shred',
    title: 'Athletic Shred & Definition',
    icon: '🔥',
    subtitle: 'Sustained caloric deficit with lean mass preservation',
    colorHex: 0x5ee7ff,
    accentHex: 0x9d4edd,
    projectedMuscle: '+1.5 kg',
    projectedFat: '-6.8%',
    caloricTarget: '2,150 kcal/day',
    proteinTarget: '175 g/day',
    weeklySplit: '5 Days (Push / Pull / Legs + HIIT)',
    ringScales: [0.95, 1.35, 1.25, 1.1],
  },
  strength: {
    id: 'strength',
    title: 'Olympic Power & Strength',
    icon: '🏆',
    subtitle: 'Central nervous system potentiation on compound lifts',
    colorHex: 0x38ef7d,
    accentHex: 0x11998e,
    projectedMuscle: '+5.5 kg',
    projectedFat: '-1.8%',
    caloricTarget: '3,100 kcal/day',
    proteinTarget: '180 g/day',
    weeklySplit: '3 Days (Full Body Heavy)',
    ringScales: [1.4, 1.05, 0.85, 1.3],
  },
  longevity: {
    id: 'longevity',
    title: 'Metabolic Longevity & Agility',
    icon: '🌿',
    subtitle: 'Zone-2 mitochondrial density, joint health & VO2 max',
    colorHex: 0xffb347,
    accentHex: 0x5ee7ff,
    projectedMuscle: '+2.0 kg',
    projectedFat: '-4.2%',
    caloricTarget: '2,400 kcal/day',
    proteinTarget: '145 g/day',
    weeklySplit: '4 Days (Functional Mobility + Cardio)',
    ringScales: [1.1, 1.1, 1.35, 1.25],
  },
};

export default function GoalSimulator3D() {
  const mountRef = useRef(null);
  const { themeConfig, triggerClickAudio } = useExperience3D();

  const [activeGoal, setActiveGoal] = useState('hypertrophy');
  const [weeks, setWeeks] = useState(12);
  const [isDragging, setIsDragging] = useState(false);

  const goalDef = GOAL_PRESETS_3D[activeGoal] || GOAL_PRESETS_3D.hypertrophy;

  // Ref to communicate with WebGL loop
  const simRef = useRef({
    goalDef,
    weeks: 12,
    themeConfig,
    rotX: 0.25,
    rotY: 0.4,
    targetRotX: 0.25,
    targetRotY: 0.4,
    isPointerDown: false,
    lastX: 0,
    lastY: 0,
  });

  useEffect(() => {
    simRef.current.goalDef = goalDef;
    simRef.current.weeks = weeks;
    simRef.current.themeConfig = themeConfig;
  }, [goalDef, weeks, themeConfig]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 380;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 9.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x0c1222, 2.0);
    scene.add(ambientLight);

    const point1 = new THREE.PointLight(goalDef.colorHex, 4.5, 20);
    point1.position.set(4, 5, 4);
    scene.add(point1);

    const point2 = new THREE.PointLight(goalDef.accentHex, 3.5, 20);
    point2.position.set(-4, -4, -3);
    scene.add(point2);

    // Root Group
    const rootHolo = new THREE.Group();
    scene.add(rootHolo);

    // Central Pulsing Biometric Core
    const coreGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: goalDef.colorHex,
      emissive: goalDef.colorHex,
      emissiveIntensity: 0.65,
      roughness: 0.3,
      metalness: 0.6,
      wireframe: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    rootHolo.add(coreMesh);

    // Inner glowing solid crystal
    const innerCrystal = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.7, 0),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 })
    );
    rootHolo.add(innerCrystal);

    // 4 Holographic Concentric Rings
    const ringConfigs = [
      { r: 2.1, tube: 0.035, rotAxis: 'x', speed: 0.6 },
      { r: 2.7, tube: 0.03, rotAxis: 'y', speed: -0.8 },
      { r: 3.3, tube: 0.025, rotAxis: 'z', speed: 0.5 },
      { r: 3.8, tube: 0.02, rotAxis: 'x', speed: -0.4 },
    ];

    const rings = ringConfigs.map((cfg, idx) => {
      const g = new THREE.TorusGeometry(cfg.r, cfg.tube, 16, 64);
      const m = new THREE.MeshBasicMaterial({
        color: idx % 2 === 0 ? goalDef.colorHex : goalDef.accentHex,
        transparent: true,
        opacity: 0.75,
      });
      const mesh = new THREE.Mesh(g, m);
      mesh.rotation.x = Math.PI * 0.25 * idx;
      mesh.rotation.y = Math.PI * 0.15 * idx;
      rootHolo.add(mesh);
      return { mesh, cfg, baseScale: 1.0 };
    });

    // Orbiting Data Node Orbs
    const orbsCount = 14;
    const orbGroup = new THREE.Group();
    rootHolo.add(orbGroup);

    const orbMeshes = [];
    for (let i = 0; i < orbsCount; i++) {
      const orbMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      orbGroup.add(orbMesh);
      orbMeshes.push({
        mesh: orbMesh,
        angle: (i / orbsCount) * Math.PI * 2,
        dist: 2.2 + (i % 3) * 0.7,
        speed: 0.3 + (i % 4) * 0.15,
        elevation: (Math.random() - 0.5) * 1.8,
      });
    }

    // Pointer Drag
    const onPointerDown = (e) => {
      simRef.current.isPointerDown = true;
      simRef.current.lastX = e.clientX;
      simRef.current.lastY = e.clientY;
      setIsDragging(true);
    };

    const onPointerMove = (e) => {
      if (!simRef.current.isPointerDown) return;
      const dx = e.clientX - simRef.current.lastX;
      const dy = e.clientY - simRef.current.lastY;
      simRef.current.lastX = e.clientX;
      simRef.current.lastY = e.clientY;

      simRef.current.targetRotY += dx * 0.008;
      simRef.current.targetRotX += dy * 0.006;
    };

    const onPointerUp = () => {
      simRef.current.isPointerDown = false;
      setIsDragging(false);
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    const onResize = () => {
      const w = container.clientWidth || 480;
      const h = container.clientHeight || 380;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Loop
    let animId;
    let clock = new THREE.Clock();
    let currentGoalId = goalDef.id;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const state = simRef.current;

      // Handle goal change (color morphing)
      if (currentGoalId !== state.goalDef.id) {
        currentGoalId = state.goalDef.id;
        point1.color.setHex(state.goalDef.colorHex);
        point2.color.setHex(state.goalDef.accentHex);
        coreMat.color.setHex(state.goalDef.colorHex);
        coreMat.emissive.setHex(state.goalDef.colorHex);

        rings.forEach((r, idx) => {
          r.mesh.material.color.setHex(idx % 2 === 0 ? state.goalDef.colorHex : state.goalDef.accentHex);
        });
      }

      // Damping user rotation
      state.rotX += (state.targetRotX - state.rotX) * 0.08;
      state.rotY += (state.targetRotY - state.rotY) * 0.08;
      rootHolo.rotation.x = state.rotX;
      rootHolo.rotation.y = state.rotY;

      // Core breathing pulse
      const pulse = 1.0 + Math.sin(elapsed * 2.5) * 0.08;
      coreMesh.scale.setScalar(pulse);
      coreMesh.rotation.x = elapsed * 0.3;
      coreMesh.rotation.y = elapsed * 0.45;
      innerCrystal.rotation.y = -elapsed * 0.6;

      // Morph rings based on target goal presets & weeks
      const weekMultiplier = (state.weeks / 12);
      rings.forEach((r, idx) => {
        const targetScale = (state.goalDef.ringScales[idx] || 1.0) * weekMultiplier;
        r.mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);

        if (r.cfg.rotAxis === 'x') r.mesh.rotation.x += 0.01 * r.cfg.speed;
        if (r.cfg.rotAxis === 'y') r.mesh.rotation.y += 0.01 * r.cfg.speed;
        if (r.cfg.rotAxis === 'z') r.mesh.rotation.z += 0.01 * r.cfg.speed;
      });

      // Data orbs orbiting
      orbMeshes.forEach((o) => {
        const a = o.angle + elapsed * o.speed;
        o.mesh.position.x = Math.cos(a) * o.dist;
        o.mesh.position.z = Math.sin(a) * o.dist;
        o.mesh.position.y = o.elevation + Math.sin(elapsed * 2 + o.angle) * 0.3;
      });

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
    <div className="goal-simulator-card glass">
      <div className="goal-sim-header">
        <div className="pill-badge-row" style={{ marginBottom: '8px' }}>
          <span className="pill neon-pulse">🎯 3D Biometric Projection</span>
          <span className="pill-ghost">Predictive AI Model</span>
        </div>
        <h3>Interactive 3D Goal Transformation Matrix</h3>
        <p style={{ margin: '4px 0 0', fontSize: '0.92rem' }}>
          Select your transformation vector and duration. Watch the 3D holographic biometric core recalibrate in real time.
        </p>
      </div>

      <div className="goal-sim-layout">
        {/* 3D WebGL Hologram Viewport */}
        <div className="goal-3d-viewport-box">
          <div
            ref={mountRef}
            className={`goal-3d-canvas-mount ${isDragging ? 'grabbing' : 'grab'}`}
            title="Drag to orbit 3D Hologram"
          />
          <div className="goal-holo-hint">
            <span>✨ 360° Holographic Gyroscope • Drag to Rotate</span>
          </div>

          <div className="goal-vector-tag">
            <span className="label">ACTIVE VECTOR</span>
            <b style={{ color: 'var(--txt)' }}>{goalDef.title}</b>
          </div>
        </div>

        {/* Configuration & Dynamic Output Console */}
        <div className="goal-sim-sidebar">
          {/* Preset Buttons */}
          <div className="sim-block">
            <span className="sim-label">CHOOSE TARGET TRANSFORMATION VECTOR</span>
            <div className="goal-preset-grid">
              {Object.keys(GOAL_PRESETS_3D).map((k) => {
                const g = GOAL_PRESETS_3D[k];
                const active = activeGoal === k;
                return (
                  <button
                    key={k}
                    type="button"
                    className={`goal-preset-btn ${active ? 'active' : ''}`}
                    onClick={() => {
                      triggerClickAudio();
                      setActiveGoal(k);
                    }}
                  >
                    <span className="gp-icon">{g.icon}</span>
                    <div className="gp-info">
                      <strong>{g.title}</strong>
                      <small>{g.subtitle}</small>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Timeline Duration Slider */}
          <div className="sim-block">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="sim-label">COMMITMENT TIMELINE</span>
              <b style={{ color: 'var(--cy)' }}>{weeks} Weeks ({Math.round(weeks * 7)} Days)</b>
            </div>
            <input
              type="range"
              min="4"
              max="24"
              step="2"
              value={weeks}
              onChange={(e) => setWeeks(parseInt(e.target.value, 10))}
              style={{ width: '100%', marginTop: '6px' }}
            />
            <div className="scale">
              <span>4 Wks (Jumpstart)</span>
              <span>12 Wks (Prime Phase)</span>
              <span>24 Wks (Total Shift)</span>
            </div>
          </div>

          {/* Projected Biometric Telemetry */}
          <div className="projected-metrics-grid">
            <div className="proj-metric-card">
              <span className="p-lbl">PROJECTED LEAN MASS</span>
              <strong className="p-val" style={{ color: '#38ef7d' }}>
                {goalDef.projectedMuscle}
              </strong>
            </div>

            <div className="proj-metric-card">
              <span className="p-lbl">PROJECTED FAT LOSS</span>
              <strong className="p-val" style={{ color: 'var(--or)' }}>
                {goalDef.projectedFat}
              </strong>
            </div>

            <div className="proj-metric-card">
              <span className="p-lbl">CALORIC FLUX</span>
              <strong className="p-val" style={{ color: 'var(--cy)' }}>
                {goalDef.caloricTarget}
              </strong>
            </div>

            <div className="proj-metric-card">
              <span className="p-lbl">DAILY PROTEIN TARGET</span>
              <strong className="p-val">
                {goalDef.proteinTarget}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
