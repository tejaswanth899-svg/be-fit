import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function Results3DVisualizer({ weekData = [] }) {
  const mountRef = useRef(null);
  const [activeDay, setActiveDay] = useState(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = 340;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 5.5, 12);
    camera.lookAt(0, 1.2, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const amb = new THREE.AmbientLight(0x10172e, 2.2);
    scene.add(amb);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight.position.set(5, 10, 8);
    scene.add(dirLight);

    const cyanPoint = new THREE.PointLight(0x5ee7ff, 4.0, 22);
    cyanPoint.position.set(-6, 4, 3);
    scene.add(cyanPoint);

    const orangePoint = new THREE.PointLight(0xff6a2b, 4.0, 22);
    orangePoint.position.set(6, 4, 3);
    scene.add(orangePoint);

    // Ground Platform Grid
    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    const gridHelper = new THREE.GridHelper(14, 14, 0xff6a2b, 0x1f2e54);
    gridHelper.position.y = -0.05;
    stageGroup.add(gridHelper);

    // Base Disc Platform
    const baseGeo = new THREE.CylinderGeometry(6.5, 6.7, 0.2, 48);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x0e1428,
      metalness: 0.9,
      roughness: 0.25,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.15;
    stageGroup.add(baseMesh);

    // Glow Ring surrounding platform
    const glowRingGeo = new THREE.TorusGeometry(6.7, 0.05, 16, 64);
    const glowRingMat = new THREE.MeshBasicMaterial({ color: 0x5ee7ff, transparent: true, opacity: 0.6 });
    const glowRing = new THREE.Mesh(glowRingGeo, glowRingMat);
    glowRing.rotation.x = Math.PI / 2;
    glowRing.position.y = -0.05;
    stageGroup.add(glowRing);

    // PILLARS CREATION
    const data = weekData.length > 0 ? weekData : [
      { d: 'Mon', v: 60 }, { d: 'Tue', v: 40 }, { d: 'Wed', v: 85 }, { d: 'Thu', v: 8 },
      { d: 'Fri', v: 70 }, { d: 'Sat', v: 95 }, { d: 'Sun', v: 30 },
    ];

    const pillars = [];
    const spacing = 1.35;
    const startX = -((data.length - 1) * spacing) / 2;

    const normalMat = new THREE.MeshStandardMaterial({
      color: 0x182442,
      metalness: 0.85,
      roughness: 0.25,
    });
    const highlightMat = new THREE.MeshStandardMaterial({
      color: 0xff6a2b,
      emissive: 0xff6a2b,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.4,
    });
    const capMat = new THREE.MeshStandardMaterial({
      color: 0x5ee7ff,
      emissive: 0x5ee7ff,
      emissiveIntensity: 0.85,
      metalness: 0.3,
      roughness: 0.2,
    });

    data.forEach((item, idx) => {
      const heightVal = Math.max(0.3, (item.v / 100) * 3.8);
      const xPos = startX + idx * spacing;

      const pGroup = new THREE.Group();
      pGroup.position.set(xPos, 0, 0);

      // Main column
      const colGeo = new THREE.BoxGeometry(0.75, heightVal, 0.75);
      const colMesh = new THREE.Mesh(colGeo, normalMat.clone());
      colMesh.position.y = heightVal / 2;
      colMesh.userData = { index: idx, data: item, baseHeight: heightVal };
      pGroup.add(colMesh);

      // Glowing Cap on top
      const capGeo = new THREE.BoxGeometry(0.82, 0.14, 0.82);
      const capMesh = new THREE.Mesh(capGeo, capMat);
      capMesh.position.y = heightVal + 0.07;
      pGroup.add(capMesh);

      stageGroup.add(pGroup);
      pillars.push({ group: pGroup, colMesh, capMesh, item, heightVal });
    });

    // Raycasting for Mouse Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);

    const onPointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    // Orbit Dragging
    let isDragging = false;
    let startXDrag = 0;
    let targetRotY = 0.2;
    let currentRotY = 0.2;

    const onMouseDown = (e) => {
      isDragging = true;
      startXDrag = e.clientX || 0;
    };
    const onMouseMoveWindow = (e) => {
      if (isDragging) {
        const delta = (e.clientX || 0) - startXDrag;
        targetRotY += delta * 0.008;
        startXDrag = e.clientX || 0;
      }
    };
    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousemove', onPointerMove);
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMoveWindow);
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

    // Render loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth rotate
      currentRotY += (targetRotY - currentRotY) * 0.07;
      stageGroup.rotation.y = currentRotY;

      // Raycast to pillars
      raycaster.setFromCamera(mouse, camera);
      const hitCandidates = pillars.map((p) => p.colMesh);
      const intersects = raycaster.intersectObjects(hitCandidates);

      let found = null;
      if (intersects.length > 0) {
        found = intersects[0].object.userData.data;
      }

      pillars.forEach((p) => {
        const isHovered = found && found.d === p.item.d;
        if (isHovered) {
          p.colMesh.material = highlightMat;
          p.group.scale.set(1.08, 1.08, 1.08);
        } else {
          p.colMesh.material = normalMat;
          p.group.scale.set(1, 1, 1);
        }
      });

      setActiveDay(found);

      // Subtle pulse of glow ring
      glowRing.scale.setScalar(1 + Math.sin(elapsed * 2.5) * 0.015);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousemove', onPointerMove);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMoveWindow);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);
      if (container.contains(dom)) container.removeChild(dom);
      renderer.dispose();
    };
  }, [weekData]);

  return (
    <div className="results-3d-stage">
      <div className="stage-top-bar">
        <div className="stage-title">
          <span className="pill">3D Kinetic Activity Stage</span>
          <h3>Weekly Volume Monoliths</h3>
        </div>
        {activeDay ? (
          <div className="active-day-hud glass">
            <b>{activeDay.d} Workout</b>: <span>{activeDay.v}% intensity ({Math.round(activeDay.v * 7.5)} kcal)</span>
          </div>
        ) : (
          <div className="active-day-hud glass muted">
            <span>Hover or drag in 3D to inspect daily metrics</span>
          </div>
        )}
      </div>

      <div ref={mountRef} className="results-3d-canvas-wrap" />
      <div className="stage-hint">↔ Click & drag to rotate 3D volume platform</div>
    </div>
  );
}
