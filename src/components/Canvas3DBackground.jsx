import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useExperience3D } from '../context/Experience3DContext';

export default function Canvas3DBackground() {
  const mountRef = useRef(null);
  const glowRef1 = useRef(null);
  const glowRef2 = useRef(null);
  const { themeConfig, bgMode, parallaxSensitivity } = useExperience3D();

  const stateRef = useRef({
    themeConfig,
    bgMode,
    parallaxSensitivity,
  });

  useEffect(() => {
    stateRef.current.themeConfig = themeConfig;
    stateRef.current.bgMode = bgMode;
    stateRef.current.parallaxSensitivity = parallaxSensitivity;
  }, [themeConfig, bgMode, parallaxSensitivity]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 42;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.inset = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'none';
    container.appendChild(renderer.domElement);

    const sceneGroup = new THREE.Group();
    scene.add(sceneGroup);



    // 2. PARTICLE CLOUDS
    const makeParticleTex = () => {
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext('2d');
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.25, 'rgba(255,255,255,0.85)');
      g.addColorStop(0.6, 'rgba(255,255,255,0.25)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(32, 32, 32, 0, Math.PI * 2);
      ctx.fill();
      return new THREE.CanvasTexture(c);
    };

    const particleTex = makeParticleTex();

    // Deep Starfield (800 particles)
    const starsCount = 800;
    const starsGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starsCount * 3);
    const starColors = new Float32Array(starsCount * 3);

    const c1 = new THREE.Color(themeConfig.primary);
    const c2 = new THREE.Color(themeConfig.secondary);
    const cWhite = new THREE.Color('#eef2ff');

    for (let i = 0; i < starsCount; i++) {
      const i3 = i * 3;
      starPositions[i3] = (Math.random() - 0.5) * 150;
      starPositions[i3 + 1] = (Math.random() - 0.5) * 130;
      starPositions[i3 + 2] = (Math.random() - 0.5) * 90 - 15;

      const pick = i % 3 === 0 ? c1 : i % 3 === 1 ? c2 : cWhite;
      starColors[i3] = pick.r;
      starColors[i3 + 1] = pick.g;
      starColors[i3 + 2] = pick.b;
    }

    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starsGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starsMat = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      map: particleTex,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const starField = new THREE.Points(starsGeo, starsMat);
    sceneGroup.add(starField);

    // Foreground Kinetic Dust (220 particles)
    const dustCount = 220;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      const i3 = i * 3;
      dustPositions[i3] = (Math.random() - 0.5) * 90;
      dustPositions[i3 + 1] = (Math.random() - 0.5) * 70;
      dustPositions[i3 + 2] = (Math.random() - 0.5) * 35 + 15;

      const pick = i % 2 === 0 ? c1 : c2;
      dustColors[i3] = pick.r;
      dustColors[i3 + 1] = pick.g;
      dustColors[i3 + 2] = pick.b;
    }

    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dustGeo.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));

    const dustMat = new THREE.PointsMaterial({
      size: 2.5,
      vertexColors: true,
      map: particleTex,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dustField = new THREE.Points(dustGeo, dustMat);
    sceneGroup.add(dustField);

    // 3. FLOATING WIREFRAME POLYHEDRONS
    const polyGroup = new THREE.Group();
    const polyMats = [
      new THREE.MeshBasicMaterial({ color: themeConfig.primaryHex, wireframe: true, transparent: true, opacity: 0.35 }),
      new THREE.MeshBasicMaterial({ color: themeConfig.secondaryHex, wireframe: true, transparent: true, opacity: 0.35 }),
    ];

    const polyGeoms = [
      new THREE.IcosahedronGeometry(4.2, 0),
      new THREE.OctahedronGeometry(3.6, 0),
      new THREE.TorusGeometry(4.0, 0.45, 8, 28),
      new THREE.DodecahedronGeometry(3.4, 0),
    ];

    const polyItems = [];
    for (let i = 0; i < 9; i++) {
      const g = polyGeoms[i % polyGeoms.length];
      const m = polyMats[i % polyMats.length];
      const mesh = new THREE.Mesh(g, m);
      mesh.position.set(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 75,
        (Math.random() - 0.5) * 50 - 10
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

      polyItems.push({
        mesh,
        baseX: mesh.position.x,
        baseY: mesh.position.y,
        baseZ: mesh.position.z,
        rotSpeedX: (Math.random() - 0.5) * 0.015,
        rotSpeedY: (Math.random() - 0.5) * 0.015,
        parallaxMultiplier: 0.3 + Math.random() * 0.8,
      });
      polyGroup.add(mesh);
    }
    sceneGroup.add(polyGroup);

    // Mouse Tracking & Spring Physics
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    let cursorPxX = window.innerWidth / 2;
    let cursorPxY = window.innerHeight / 2;
    let smoothPxX1 = cursorPxX;
    let smoothPxY1 = cursorPxY;
    let smoothPxX2 = cursorPxX;
    let smoothPxY2 = cursorPxY;

    const onMouseMove = (e) => {
      cursorPxX = e.clientX;
      cursorPxY = e.clientY;
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let animId;
    let clock = new THREE.Clock();
    const starPosArr = starsGeo.attributes.position.array;
    const dustPosArr = dustGeo.attributes.position.array;

    let lastThemeId = themeConfig.id;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const currentBgMode = stateRef.current.bgMode;
      const sensitivity = stateRef.current.parallaxSensitivity || 1.5;

      // Check if theme colors need update
      if (lastThemeId !== stateRef.current.themeConfig.id) {
        lastThemeId = stateRef.current.themeConfig.id;
        polyMats[0].color.setHex(curTheme.primaryHex);
        polyMats[1].color.setHex(curTheme.secondaryHex);

        const newC1 = new THREE.Color(curTheme.primary);
        const newC2 = new THREE.Color(curTheme.secondary);
        const colorArr = starsGeo.attributes.color.array;
        for (let i = 0; i < starsCount; i++) {
          const i3 = i * 3;
          const p = i % 3 === 0 ? newC1 : i % 3 === 1 ? newC2 : cWhite;
          colorArr[i3] = p.r;
          colorArr[i3 + 1] = p.g;
          colorArr[i3 + 2] = p.b;
        }
        starsGeo.attributes.color.needsUpdate = true;
      }

      // Smooth mouse interpolation
      targetX += (mouseX - targetX) * 0.06;
      targetY += (mouseY - targetY) * 0.06;

      // Lag for cursor glow auras
      smoothPxX1 += (cursorPxX - smoothPxX1) * 0.12;
      smoothPxY1 += (cursorPxY - smoothPxY1) * 0.12;
      smoothPxX2 += (cursorPxX - smoothPxX2) * 0.06;
      smoothPxY2 += (cursorPxY - smoothPxY2) * 0.06;

      if (glowRef1.current) {
        glowRef1.current.style.transform = `translate3d(${smoothPxX1}px, ${smoothPxY1}px, 0)`;
      }
      if (glowRef2.current) {
        glowRef2.current.style.transform = `translate3d(${smoothPxX2}px, ${smoothPxY2}px, 0)`;
      }

      // Camera Parallax based on user sensitivity
      camera.position.x = targetX * 12 * sensitivity;
      camera.position.y = -targetY * 10 * sensitivity;
      camera.rotation.y = -targetX * 0.18 * sensitivity;
      camera.rotation.x = targetY * 0.14 * sensitivity;

      sceneGroup.position.x = -targetX * 7 * sensitivity;
      sceneGroup.position.y = targetY * 5 * sensitivity;

      // 3D MODE SPECIFIC ANIMATIONS:
      if (currentBgMode === 'wave') {
        starField.rotation.y = elapsed * 0.015;
        dustField.rotation.y = elapsed * 0.04;
      } else if (currentBgMode === 'warp') {
        // Hyperspace Star Warp: stars accelerate forward towards camera
        const warpSpeed = 1.6 + Math.abs(targetX + targetY) * 1.2;
        for (let i = 0; i < starPosArr.length; i += 3) {
          starPosArr[i + 2] += warpSpeed;
          if (starPosArr[i + 2] > 40) {
            starPosArr[i + 2] = -90;
            starPosArr[i] = (Math.random() - 0.5) * 140;
            starPosArr[i + 1] = (Math.random() - 0.5) * 120;
          }
        }
        starsGeo.attributes.position.needsUpdate = true;

        for (let i = 0; i < dustPosArr.length; i += 3) {
          dustPosArr[i + 2] += warpSpeed * 1.8;
          if (dustPosArr[i + 2] > 40) {
            dustPosArr[i + 2] = -50;
            dustPosArr[i] = (Math.random() - 0.5) * 90;
            dustPosArr[i + 1] = (Math.random() - 0.5) * 70;
          }
        }
        dustGeo.attributes.position.needsUpdate = true;
      } else if (currentBgMode === 'vortex') {
        // Gravity Vortex: particles swirl around target mouse coordinate
        const centerX = targetX * 30;
        const centerY = -targetY * 25;

        for (let i = 0; i < dustPosArr.length; i += 3) {
          const dx = dustPosArr[i] - centerX;
          const dy = dustPosArr[i + 1] - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const angle = Math.atan2(dy, dx) + 0.035 + (20 / dist) * 0.02;

          dustPosArr[i] = centerX + Math.cos(angle) * (dist * 0.996 + 0.1);
          dustPosArr[i + 1] = centerY + Math.sin(angle) * (dist * 0.996 + 0.1);

          if (dist < 4 || dist > 85) {
            dustPosArr[i] = centerX + (Math.random() - 0.5) * 80;
            dustPosArr[i + 1] = centerY + (Math.random() - 0.5) * 60;
          }
        }
        dustGeo.attributes.position.needsUpdate = true;
        starField.rotation.z = elapsed * 0.05;
      }

      // Polyhedrons movement
      polyItems.forEach((item, idx) => {
        item.mesh.rotation.x += item.rotSpeedX + targetY * 0.02;
        item.mesh.rotation.y += item.rotSpeedY + targetX * 0.02;
        item.mesh.position.x = item.baseX + targetX * 12 * item.parallaxMultiplier * sensitivity;
        item.mesh.position.y = item.baseY + -targetY * 10 * item.parallaxMultiplier * sensitivity + Math.sin(elapsed * 1.4 + idx) * 2;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      starsGeo.dispose();
      starsMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      particleTex.dispose();
      polyGeoms.forEach((g) => g.dispose());
      polyMats.forEach((m) => m.dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} className="canvas-3d-bg" aria-hidden="true">
      {/* Dynamic Cursor Light Auroras adapted to active theme */}
      <div
        ref={glowRef1}
        className="cursor-aura aura-1"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '600px',
          height: '600px',
          marginLeft: '-300px',
          marginTop: '-300px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${themeConfig.aura1} 0%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 1,
          filter: 'blur(45px)',
          willChange: 'transform',
        }}
      />
      <div
        ref={glowRef2}
        className="cursor-aura aura-2"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '520px',
          height: '520px',
          marginLeft: '-260px',
          marginTop: '-260px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${themeConfig.aura2} 0%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 1,
          filter: 'blur(50px)',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
