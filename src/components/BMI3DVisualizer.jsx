import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const CATEGORY_COLORS = {
  Underweight: 0x5ee7ff,
  Healthy: 0x38ef7d,
  Overweight: 0xffd45e,
  Obese: 0xff4757,
};

export default function BMI3DVisualizer({ bmi = 22.5, category = 'Healthy' }) {
  const mountRef = useRef(null);
  const stateRef = useRef({
    bmi: parseFloat(bmi) || 22.5,
    category: category || 'Healthy',
  });

  useEffect(() => {
    stateRef.current.bmi = parseFloat(bmi) || 22.5;
    stateRef.current.category = category || 'Healthy';
  }, [bmi, category]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = 260;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.8, 6.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const amb = new THREE.AmbientLight(0x1a233a, 2.0);
    scene.add(amb);

    const pointLight = new THREE.PointLight(0xffffff, 2.5, 20);
    pointLight.position.set(0, 4, 5);
    scene.add(pointLight);

    const statusLight = new THREE.PointLight(CATEGORY_COLORS[category] || 0x38ef7d, 4.0, 15);
    statusLight.position.set(0, 0, 2);
    scene.add(statusLight);

    // Main 3D Gauge Group
    const gaugeGroup = new THREE.Group();
    scene.add(gaugeGroup);

    // Curved Dial Track Arc (from -140 deg to +140 deg)
    const arcRadius = 2.2;
    const trackGeo = new THREE.TorusGeometry(arcRadius, 0.12, 16, 64, Math.PI * 1.3);
    const trackMat = new THREE.MeshStandardMaterial({
      color: 0x242e47,
      metalness: 0.8,
      roughness: 0.3,
    });
    const trackMesh = new THREE.Mesh(trackGeo, trackMat);
    trackMesh.rotation.z = Math.PI * 0.85;
    gaugeGroup.add(trackMesh);

    // Glow Indicator Arc
    const glowMat = new THREE.MeshStandardMaterial({
      color: CATEGORY_COLORS[category] || 0x38ef7d,
      emissive: CATEGORY_COLORS[category] || 0x38ef7d,
      emissiveIntensity: 0.85,
      metalness: 0.5,
      roughness: 0.2,
    });
    const glowRingGeo = new THREE.TorusGeometry(arcRadius, 0.05, 16, 64, Math.PI * 1.3);
    const glowMesh = new THREE.Mesh(glowRingGeo, glowMat);
    glowMesh.rotation.z = Math.PI * 0.85;
    gaugeGroup.add(glowMesh);

    // Dial Base Disc
    const discGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.15, 32);
    const discMat = new THREE.MeshStandardMaterial({
      color: 0x12172a,
      metalness: 0.9,
      roughness: 0.2,
    });
    const discMesh = new THREE.Mesh(discGeo, discMat);
    discMesh.rotation.x = Math.PI / 2;
    gaugeGroup.add(discMesh);

    // Central Glowing Vital Node
    const nodeGeo = new THREE.SphereGeometry(0.45, 24, 24);
    const nodeMesh = new THREE.Mesh(nodeGeo, glowMat);
    gaugeGroup.add(nodeMesh);

    // 3D Pointer Arrow
    const pointerGroup = new THREE.Group();
    const arrowConeGeo = new THREE.ConeGeometry(0.18, 0.9, 16);
    const arrowCone = new THREE.Mesh(arrowConeGeo, glowMat);
    arrowCone.position.y = 1.6;
    pointerGroup.add(arrowCone);

    const arrowShaftGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 16);
    const arrowShaft = new THREE.Mesh(arrowShaftGeo, trackMat);
    arrowShaft.position.y = 0.8;
    pointerGroup.add(arrowShaft);

    gaugeGroup.add(pointerGroup);

    // Pointer Angle Calculator:
    // BMI ranges: 14 to 38
    // Angle: from +120 deg to -120 deg
    const calculateAngle = (val) => {
      const clamped = Math.min(38, Math.max(14, val));
      const pct = (clamped - 14) / (38 - 14); // 0 to 1
      return THREE.MathUtils.lerp(Math.PI * 0.65, -Math.PI * 0.65, pct);
    };

    let targetAngle = calculateAngle(stateRef.current.bmi);
    let currentAngle = targetAngle;

    // Orbit/Mouse interactivity
    let rotX = 0.2;
    let rotY = 0;
    let targetRotY = 0;
    let isDragging = false;
    let startX = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      startX = e.clientX || 0;
    };
    const onMouseMove = (e) => {
      if (!isDragging) return;
      const x = e.clientX || 0;
      targetRotY += (x - startX) * 0.01;
      startX = x;
    };
    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Resize
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    };
    window.addEventListener('resize', onResize);

    // Loop
    let animId;
    let clock = new THREE.Clock();
    let cachedCat = category;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Check category change
      if (cachedCat !== stateRef.current.category) {
        cachedCat = stateRef.current.category;
        const newColor = CATEGORY_COLORS[cachedCat] || 0x38ef7d;
        glowMat.color.setHex(newColor);
        glowMat.emissive.setHex(newColor);
        statusLight.color.setHex(newColor);
      }

      // Update pointer target
      targetAngle = calculateAngle(stateRef.current.bmi);
      currentAngle += (targetAngle - currentAngle) * 0.08;
      pointerGroup.rotation.z = currentAngle;

      // Mouse drag rotation
      rotY += (targetRotY - rotY) * 0.08;
      gaugeGroup.rotation.y = rotY;
      gaugeGroup.rotation.x = rotX + Math.sin(elapsed * 1.5) * 0.04;

      // Subtle pulse of the core
      const pulse = 1 + Math.sin(elapsed * 5) * 0.08;
      nodeMesh.scale.set(pulse, pulse, pulse);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);
      if (container.contains(dom)) container.removeChild(dom);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="bmi-3d-visualizer">
      <div ref={mountRef} className="bmi-3d-canvas-wrap" />
      <div className="bmi-3d-hint">
        <span>⚡ 3D Holographic Dial</span>
        <small>Real-time angular deflection</small>
      </div>
    </div>
  );
}
