import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { useExperience3D } from '../context/Experience3DContext';

export default function PortalCTA3D() {
  const mountRef = useRef(null);
  const { themeConfig, triggerClickAudio } = useExperience3D();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Dynamic 3D Swirling Energy Rings
    const portalGroup = new THREE.Group();
    scene.add(portalGroup);

    const ringMat1 = new THREE.MeshBasicMaterial({
      color: themeConfig.primaryHex || 0xff6a2b,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: themeConfig.secondaryHex || 0x5ee7ff,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.45, 16, 40), ringMat1);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.35, 16, 40), ringMat2);
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.9, 1),
      new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.8 })
    );

    portalGroup.add(ring1);
    portalGroup.add(ring2);
    portalGroup.add(core);

    const onResize = () => {
      const w = container.clientWidth || 320;
      const h = container.clientHeight || 320;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      ring1.rotation.x = elapsed * 0.9;
      ring1.rotation.y = elapsed * 0.6;
      ring2.rotation.y = -elapsed * 0.8;
      ring2.rotation.z = elapsed * 0.5;
      core.rotation.x = -elapsed * 0.7;
      core.rotation.y = elapsed * 0.9;

      portalGroup.position.y = Math.sin(elapsed * 1.5) * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, [themeConfig]);

  return (
    <section className="section portal-cta-section">
      <div className="portal-cta-card glass">
        <div className="portal-cta-content">
          <div className="pill-badge-row">
            <span className="pill neon-pulse">🚀 Next-Generation Fitness</span>
            <span className="pill-ghost">100% Free • No Download</span>
          </div>

          <h2>Step Inside the 3D Fitness Arena Today</h2>
          <p className="lead" style={{ maxWidth: '48ch' }}>
            Calibrate equipment, perfect anatomical muscle activation, master progressive overload, and reach peak conditioning.
          </p>

          <div className="portal-cta-btns">
            <Link
              to="/studio"
              className="btn btn-primary"
              onClick={triggerClickAudio}
              style={{ fontSize: '1.05rem', padding: '14px 28px' }}
            >
              ⚡ Enter 3D Studio
            </Link>
            <Link
              to="/journey"
              className="btn btn-ghost"
              onClick={triggerClickAudio}
              style={{ fontSize: '1.05rem', padding: '14px 28px' }}
            >
              🧭 Start Your Journey
            </Link>
            <Link
              to="/bmi"
              className="btn btn-ghost"
              onClick={triggerClickAudio}
              style={{ fontSize: '1.05rem', padding: '14px 28px' }}
            >
              ⚖️ Check BMI
            </Link>
          </div>

          <div className="portal-badges-row">
            <span>✓ Real-time WebGL 3D</span>
            <span>✓ Sensorless Kinetic Tracking</span>
            <span>✓ Complete Nutrition Architect</span>
          </div>
        </div>

        {/* 3D Visual Vortex Portal */}
        <div className="portal-visual-col">
          <div ref={mountRef} className="portal-canvas-mount" />
        </div>
      </div>
    </section>
  );
}
