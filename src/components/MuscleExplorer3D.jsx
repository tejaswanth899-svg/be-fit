import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';

const MUSCLE_DATA = {
  chest: {
    name: 'Chest (Pectoralis Major & Minor)',
    category: 'Upper Body',
    exercises: ['Push-Ups', 'Bench Press', 'Incline Dumbbell Press', 'Cable Flyes'],
    cues: 'Retract your shoulder blades and drive through your palms without flaring elbows excessively.',
    volume: '12 - 16 sets / week',
    reps: '8 - 15 reps',
    cameraPos: { x: 0, y: 1.4, z: 5.5 },
    targetPos: { x: 0, y: 1.25, z: 0 },
    highlightY: 1.25,
    highlightZ: 0.45,
    highlightRadius: 0.9,
  },
  back: {
    name: 'Back (Latissimus Dorsi & Rhomboids)',
    category: 'Upper Body',
    exercises: ['Pull-Ups', 'Deadlift', 'Barbell Bent-Over Row', 'Lat Pulldowns'],
    cues: 'Initiate by driving elbows straight back toward your hips; feel your lats squeeze at the contraction.',
    volume: '14 - 18 sets / week',
    reps: '6 - 12 reps',
    cameraPos: { x: 0, y: 1.4, z: -5.5 },
    targetPos: { x: 0, y: 1.25, z: 0 },
    highlightY: 1.25,
    highlightZ: -0.45,
    highlightRadius: 0.95,
  },
  shoulders: {
    name: 'Shoulders (Deltoids - Anterior, Lateral & Posterior)',
    category: 'Upper Body',
    exercises: ['Dumbbell Shoulder Press', 'Lateral Raises', 'Face Pulls', 'Overhead Press'],
    cues: 'Keep ribs pinned down; avoid arching your lower back when pressing overhead.',
    volume: '10 - 14 sets / week',
    reps: '10 - 20 reps',
    cameraPos: { x: 0, y: 1.8, z: 5.0 },
    targetPos: { x: 0, y: 1.6, z: 0 },
    highlightY: 1.6,
    highlightZ: 0,
    highlightRadius: 1.3,
  },
  arms: {
    name: 'Arms (Biceps Brachii & Triceps)',
    category: 'Upper Body',
    exercises: ['Dumbbell Bicep Curls', 'Tricep Rope Pushdowns', 'Skull Crushers', 'Hammer Curls'],
    cues: 'Lock your elbows in place to avoid using momentum; control the eccentric lengthening phase.',
    volume: '8 - 12 sets / week',
    reps: '8 - 15 reps',
    cameraPos: { x: 2.2, y: 1.0, z: 5.2 },
    targetPos: { x: 1.2, y: 0.9, z: 0 },
    highlightY: 0.9,
    highlightZ: 0,
    highlightRadius: 0.7,
  },
  core: {
    name: 'Core (Rectus Abdominis & Obliques)',
    category: 'Core',
    exercises: ['Plank', 'Hanging Leg Raises', 'Russian Twists', 'Ab Wheel Rollouts'],
    cues: 'Exhale fully at peak contraction to maximally engage the deep transverse abdominis.',
    volume: '9 - 12 sets / week',
    reps: '12 - 25 reps / 45s holds',
    cameraPos: { x: 0, y: 0.35, z: 5.0 },
    targetPos: { x: 0, y: 0.35, z: 0 },
    highlightY: 0.35,
    highlightZ: 0.4,
    highlightRadius: 0.75,
  },
  legs: {
    name: 'Legs (Quadriceps, Hamstrings & Glutes)',
    category: 'Lower Body',
    exercises: ['Barbell Back Squat', 'Romanian Deadlift', 'Walking Lunges', 'Leg Press'],
    cues: 'Root your big toe, pinky toe, and heel firmly into the ground to create an unshakeable base.',
    volume: '14 - 20 sets / week',
    reps: '6 - 15 reps',
    cameraPos: { x: 0, y: -0.8, z: 6.0 },
    targetPos: { x: 0, y: -1.1, z: 0 },
    highlightY: -1.1,
    highlightZ: 0.1,
    highlightRadius: 1.1,
  },
};

export default function MuscleExplorer3D({ onSelectMuscle }) {
  const mountRef = useRef(null);
  const [activeMuscle, setActiveMuscle] = useState('chest');
  const [viewAngle, setViewAngle] = useState('front'); // 'front' or 'back'

  const activeRef = useRef({
    activeMuscle: 'chest',
    viewAngle: 'front',
    camTarget: { x: 0, y: 1.4, z: 5.5 },
    lookTarget: { x: 0, y: 1.25, z: 0 },
    rotY: 0,
    targetRotY: 0,
    isDragging: false,
    startX: 0,
  });

  useEffect(() => {
    activeRef.current.activeMuscle = activeMuscle;
    const info = MUSCLE_DATA[activeMuscle];
    if (info) {
      activeRef.current.camTarget = { ...info.cameraPos };
      activeRef.current.lookTarget = { ...info.targetPos };
      if (viewAngle === 'back') {
        activeRef.current.camTarget.z = -Math.abs(activeRef.current.camTarget.z);
        activeRef.current.targetRotY = Math.PI;
      } else {
        activeRef.current.camTarget.z = Math.abs(activeRef.current.camTarget.z);
        activeRef.current.targetRotY = 0;
      }
    }
  }, [activeMuscle, viewAngle]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 6);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    const amb = new THREE.AmbientLight(0x141a33, 2.5);
    scene.add(amb);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(4, 8, 6);
    scene.add(dirLight);

    const rimCyan = new THREE.PointLight(0x5ee7ff, 4.5, 20);
    rimCyan.position.set(-5, 2, -4);
    scene.add(rimCyan);

    const rimOrange = new THREE.PointLight(0xff6a2b, 4.5, 20);
    rimOrange.position.set(5, 1, 4);
    scene.add(rimOrange);

    // Anatomical Grid Platform
    const gridHelper = new THREE.GridHelper(10, 20, 0xff6a2b, 0x1f2b4d);
    gridHelper.position.y = -2.6;
    scene.add(gridHelper);

    // Holographic Body Mesh Group
    const bodyGroup = new THREE.Group();
    scene.add(bodyGroup);

    // Materials
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x18203b,
      metalness: 0.85,
      roughness: 0.35,
    });
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0x3a4b75,
      metalness: 0.9,
      roughness: 0.2,
      wireframe: false,
    });
    const muscleHighlightMat = new THREE.MeshStandardMaterial({
      color: 0xff6a2b,
      emissive: 0xff6a2b,
      emissiveIntensity: 0.8,
      roughness: 0.25,
      metalness: 0.5,
    });
    const secondaryGlowMat = new THREE.MeshStandardMaterial({
      color: 0x5ee7ff,
      emissive: 0x5ee7ff,
      emissiveIntensity: 0.6,
      roughness: 0.25,
      metalness: 0.5,
    });

    // Build Athletic Holographic Anatomy Model
    const muscleMeshes = {};

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.48, 24, 24), chromeMat);
    head.position.y = 2.45;
    bodyGroup.add(head);

    // Visor bar
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.12, 0.44), secondaryGlowMat);
    visor.position.set(0, 2.48, 0.16);
    bodyGroup.add(visor);

    // Neck
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.4, 16), baseMat);
    neck.position.y = 1.95;
    bodyGroup.add(neck);

    // Chest (Pecs)
    const chestGeom = new THREE.BoxGeometry(1.65, 0.9, 0.75);
    const chest = new THREE.Mesh(chestGeom, baseMat);
    chest.position.set(0, 1.35, 0);
    bodyGroup.add(chest);
    muscleMeshes.chest = chest;

    // Back (Upper Lats)
    const backGeom = new THREE.BoxGeometry(1.7, 1.1, 0.4);
    const back = new THREE.Mesh(backGeom, baseMat);
    back.position.set(0, 1.35, -0.22);
    bodyGroup.add(back);
    muscleMeshes.back = back;

    // Shoulders (Deltoids)
    const deltsGroup = new THREE.Group();
    [-1.2, 1.2].forEach((x) => {
      const d = new THREE.Mesh(new THREE.SphereGeometry(0.44, 16, 16), baseMat);
      d.position.set(x, 1.6, 0);
      deltsGroup.add(d);
    });
    bodyGroup.add(deltsGroup);
    muscleMeshes.shoulders = deltsGroup;

    // Arms (Biceps & Triceps)
    const armsGroup = new THREE.Group();
    [-1.2, 1.2].forEach((x) => {
      const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.24, 1.2, 16), baseMat);
      upper.position.set(x, 0.85, 0);
      const fore = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.18, 1.1, 16), chromeMat);
      fore.position.set(x, -0.25, 0);
      armsGroup.add(upper);
      armsGroup.add(fore);
    });
    bodyGroup.add(armsGroup);
    muscleMeshes.arms = armsGroup;

    // Core (Abs)
    const coreGeom = new THREE.BoxGeometry(1.25, 0.95, 0.65);
    const core = new THREE.Mesh(coreGeom, baseMat);
    core.position.set(0, 0.45, 0);
    bodyGroup.add(core);
    muscleMeshes.core = core;

    // Pelvis
    const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.58, 0.55, 16), chromeMat);
    pelvis.position.y = -0.3;
    bodyGroup.add(pelvis);

    // Legs (Quads & Calves)
    const legsGroup = new THREE.Group();
    [-0.52, 0.52].forEach((x) => {
      const quad = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.28, 1.55, 16), baseMat);
      quad.position.set(x, -1.25, 0);
      const knee = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 16), chromeMat);
      knee.position.set(x, -2.05, 0);
      const calf = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.18, 1.3, 16), baseMat);
      calf.position.set(x, -2.75, 0);
      legsGroup.add(quad);
      legsGroup.add(knee);
      legsGroup.add(calf);
    });
    bodyGroup.add(legsGroup);
    muscleMeshes.legs = legsGroup;

    // Holographic Scanning Target Reticle
    const reticleGroup = new THREE.Group();
    const reticleRing = new THREE.Mesh(
      new THREE.RingGeometry(0.5, 0.58, 32),
      new THREE.MeshBasicMaterial({ color: 0xff6a2b, side: THREE.DoubleSide, transparent: true, opacity: 0.9 })
    );
    const reticleRing2 = new THREE.Mesh(
      new THREE.RingGeometry(0.7, 0.74, 32),
      new THREE.MeshBasicMaterial({ color: 0x5ee7ff, side: THREE.DoubleSide, transparent: true, opacity: 0.5 })
    );
    reticleGroup.add(reticleRing);
    reticleGroup.add(reticleRing2);
    scene.add(reticleGroup);

    // Update Highlighted Muscle
    const updateMuscleHighlight = (muscleKey) => {
      Object.keys(muscleMeshes).forEach((key) => {
        const item = muscleMeshes[key];
        const isSelected = key === muscleKey;
        const targetMat = isSelected ? muscleHighlightMat : baseMat;

        if (item.isMesh) {
          item.material = targetMat;
        } else if (item.children) {
          item.children.forEach((child) => {
            if (child.isMesh) child.material = targetMat;
          });
        }
      });

      const data = MUSCLE_DATA[muscleKey];
      if (data) {
        reticleGroup.position.set(0, data.highlightY, data.highlightZ);
        reticleRing.scale.set(data.highlightRadius, data.highlightRadius, 1);
        reticleRing2.scale.set(data.highlightRadius, data.highlightRadius, 1);
      }
    };

    updateMuscleHighlight(activeMuscle);

    // Mouse / Touch Drag to Rotate
    const onMouseDown = (e) => {
      activeRef.current.isDragging = true;
      activeRef.current.startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    };

    const onMouseMove = (e) => {
      if (!activeRef.current.isDragging) return;
      const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const delta = x - activeRef.current.startX;
      activeRef.current.targetRotY += delta * 0.01;
      activeRef.current.startX = x;
    };

    const onMouseUp = () => {
      activeRef.current.isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    dom.addEventListener('touchstart', onMouseDown, { passive: true });
    window.addEventListener('touchmove', onMouseMove, { passive: true });
    window.addEventListener('touchend', onMouseUp);

    // Resize
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Render loop
    let animId;
    let clock = new THREE.Clock();
    let prevActiveCached = activeMuscle;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Check external change
      if (prevActiveCached !== activeRef.current.activeMuscle) {
        prevActiveCached = activeRef.current.activeMuscle;
        updateMuscleHighlight(prevActiveCached);
      }

      // Smooth rotate
      activeRef.current.rotY += (activeRef.current.targetRotY - activeRef.current.rotY) * 0.08;
      bodyGroup.rotation.y = activeRef.current.rotY;

      // Pulse reticle
      reticleGroup.rotation.z = elapsed * 0.7;
      reticleRing2.rotation.z = -elapsed * 0.5;
      const reticlePulse = 1 + Math.sin(elapsed * 4) * 0.06;
      reticleRing.scale.multiplyScalar(reticlePulse);

      // Camera lerp
      camera.position.x += (activeRef.current.camTarget.x - camera.position.x) * 0.06;
      camera.position.y += (activeRef.current.camTarget.y - camera.position.y) * 0.06;
      camera.position.z += (activeRef.current.camTarget.z - camera.position.z) * 0.06;
      camera.lookAt(
        activeRef.current.lookTarget.x,
        activeRef.current.lookTarget.y,
        activeRef.current.lookTarget.z
      );

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('touchstart', onMouseDown);
      window.removeEventListener('touchmove', onMouseMove);
      window.removeEventListener('touchend', onMouseUp);
      window.removeEventListener('resize', onResize);
      if (container.contains(dom)) container.removeChild(dom);
      renderer.dispose();
    };
  }, []);

  const cur = MUSCLE_DATA[activeMuscle];

  return (
    <div className="muscle-3d-explorer glass">
      <div className="explorer-header">
        <div>
          <span className="pill">Interactive 3D Anatomical Anatomy</span>
          <h2>Targeted Muscle Scanner</h2>
          <p>Rotate the 3D athlete in 360° and select a muscle group to view biomechanical activation cues.</p>
        </div>

        <div className="view-toggle-btns">
          <button
            type="button"
            className={`btn btn-ghost ${viewAngle === 'front' ? 'active-view' : ''}`}
            onClick={() => setViewAngle('front')}
          >
            Anterior (Front)
          </button>
          <button
            type="button"
            className={`btn btn-ghost ${viewAngle === 'back' ? 'active-view' : ''}`}
            onClick={() => setViewAngle('back')}
          >
            Posterior (Back)
          </button>
        </div>
      </div>

      <div className="explorer-layout">
        {/* 3D Viewport Column */}
        <div className="explorer-viewport-wrap">
          <div ref={mountRef} className="explorer-viewport-canvas" />

          {/* Quick Muscle Selector Pills */}
          <div className="muscle-pills-row">
            {Object.keys(MUSCLE_DATA).map((k) => (
              <button
                key={k}
                type="button"
                className={`muscle-pill ${activeMuscle === k ? 'active' : ''}`}
                onClick={() => {
                  setActiveMuscle(k);
                  if (k === 'back' && viewAngle !== 'back') setViewAngle('back');
                  if (k === 'chest' && viewAngle !== 'front') setViewAngle('front');
                  if (onSelectMuscle) onSelectMuscle(k);
                }}
              >
                {MUSCLE_DATA[k].name.split(' ')[0]}
              </button>
            ))}
          </div>

          <div className="drag-hint">↔ Drag to inspect 360°</div>
        </div>

        {/* Detailed Muscle Telemetry Column */}
        <div className="explorer-info-card">
          <div className="info-badge">
            <span className="hud-dot" /> ACTIVE FOCUS: <b>{cur.category}</b>
          </div>

          <h3 className="muscle-target-title">{cur.name}</h3>

          <div className="telemetry-grid">
            <div className="telemetry-box">
              <span className="t-label">OPTIMAL REPS</span>
              <strong className="t-val">{cur.reps}</strong>
            </div>
            <div className="telemetry-box">
              <span className="t-label">TARGET VOLUME</span>
              <strong className="t-val">{cur.volume}</strong>
            </div>
          </div>

          <div className="cue-box">
            <b>Biomechanical Activation Cue:</b>
            <p>{cur.cues}</p>
          </div>

          <div className="target-exercises-list">
            <b>Target Exercises in Library:</b>
            <div className="exercise-chips">
              {cur.exercises.map((ex) => (
                <span key={ex} className="ex-chip">⚡ {ex}</span>
              ))}
            </div>
          </div>

          <div className="info-actions">
            <Link to={`/exercises?cat=${encodeURIComponent(cur.category)}`} className="btn btn-primary">
              Browse {cur.category} Exercises →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
