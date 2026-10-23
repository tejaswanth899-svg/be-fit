import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useExperience3D } from '../context/Experience3DContext';
import { playPacerBeep } from '../utils/audio';

export default function LivePacerModal({ onClose }) {
  const { soundEnabled, triggerRepSuccessAudio, themeConfig } = useExperience3D();
  const mountRef = useRef(null);

  const [phase, setPhase] = useState('LIFT'); // 'LIFT' (concentric) or 'LOWER' (eccentric)
  const [repCount, setRepCount] = useState(0);
  const [targetReps, setTargetReps] = useState(10);
  const [tempo, setTempo] = useState(2); // seconds per phase
  const [isRunning, setIsRunning] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  const phaseRef = useRef('LIFT');
  const repRef = useRef(0);
  const isRunningRef = useRef(true);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    repRef.current = repCount;
  }, [repCount]);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  // Three.js Pulsing Visualizer
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = 280;
    const height = 280;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Dynamic Pulsing Torus Rings
    const ring1Geo = new THREE.TorusGeometry(2.1, 0.08, 16, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: themeConfig.primaryHex,
      transparent: true,
      opacity: 0.9,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    group.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(1.6, 0.05, 16, 48);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: themeConfig.secondaryHex,
      transparent: true,
      opacity: 0.6,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    group.add(ring2);

    const coreGeo = new THREE.IcosahedronGeometry(0.8, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gyroscopic spin
      ring1.rotation.x = elapsed * 1.2;
      ring1.rotation.y = elapsed * 0.8;
      ring2.rotation.y = -elapsed * 1.5;
      ring2.rotation.z = elapsed * 0.9;
      core.rotation.y = elapsed * 2.0;

      // Pulse size according to phase
      const isLifting = phaseRef.current === 'LIFT';
      const targetScale = isLifting ? 1.25 : 0.75;
      const pulseSpeed = 1.8;
      const dynamicScale = THREE.MathUtils.lerp(
        core.scale.x,
        targetScale + Math.sin(elapsed * 4) * 0.1,
        0.08
      );
      core.scale.set(dynamicScale, dynamicScale, dynamicScale);
      ring1.scale.set(dynamicScale, dynamicScale, dynamicScale);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      renderer.dispose();
    };
  }, [themeConfig]);

  // Tempo Cadence Interval
  useEffect(() => {
    if (!isRunning || isCompleted) return;

    const interval = setInterval(() => {
      setPhase((prev) => {
        const next = prev === 'LIFT' ? 'LOWER' : 'LIFT';
        if (soundEnabled) playPacerBeep(next === 'LIFT');

        if (next === 'LOWER') {
          // Completed one full repetition
          setRepCount((r) => {
            const nextRep = r + 1;
            if (nextRep >= targetReps) {
              setIsCompleted(true);
              setIsRunning(false);
              triggerRepSuccessAudio();
            }
            return nextRep;
          });
        }
        return next;
      });
    }, tempo * 1000);

    return () => clearInterval(interval);
  }, [isRunning, tempo, soundEnabled, targetReps, isCompleted]);

  const resetSession = () => {
    setRepCount(0);
    setIsCompleted(false);
    setIsRunning(true);
    setPhase('LIFT');
  };

  return (
    <div className="pacer-backdrop glass" onClick={onClose}>
      <div className="pacer-modal glass" onClick={(e) => e.stopPropagation()}>
        <div className="pacer-modal-header">
          <div>
            <span className="pill">3D Cadence Metronome</span>
            <h3>Real-Time Rep Pacer</h3>
          </div>
          <button type="button" className="pacer-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="pacer-center-visual">
          <div ref={mountRef} className="pacer-3d-canvas" />
          <div className="pacer-phase-indicator">
            <span className={`phase-badge ${phase.toLowerCase()}`}>
              {phase === 'LIFT' ? '▲ CONCENTRIC: EXPLODE UP' : '▼ ECCENTRIC: CONTROL DOWN'}
            </span>
            <div className="pacer-rep-counter">
              <b>{repCount}</b> <span>/ {targetReps} REPS</span>
            </div>
          </div>
        </div>

        {isCompleted && (
          <div className="pacer-success-banner">
            🎉 <b>SET COMPLETE!</b> Amazing cadence and control.
          </div>
        )}

        {/* Controls */}
        <div className="pacer-controls-row">
          <div className="pacer-tempo-pills">
            <span className="sub-lbl">Cadence:</span>
            {[
              { label: 'Fast (1s)', val: 1 },
              { label: 'Hypertrophy (2s)', val: 2 },
              { label: 'Time Under Tension (3s)', val: 3 },
            ].map((t) => (
              <button
                key={t.val}
                type="button"
                className={`pacer-pill ${tempo === t.val ? 'active' : ''}`}
                onClick={() => setTempo(t.val)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="pacer-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setIsRunning((r) => !r)}
            >
              {isRunning ? '⏸ Pause Pacer' : '▶ Resume Pacer'}
            </button>
            <button type="button" className="btn btn-primary" onClick={resetSession}>
              🔄 Reset Set
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
