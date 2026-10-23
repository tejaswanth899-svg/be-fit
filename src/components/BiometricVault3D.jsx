import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useExperience3D } from '../context/Experience3DContext';

export default function BiometricVault3D({
  mode = 'login',
  activeField = null,
  status = 'idle', // 'idle' | 'authenticating' | 'success' | 'error'
}) {
  const mountRef = useRef(null);
  const { themeConfig } = useExperience3D();
  const [isDragging, setIsDragging] = useState(false);

  // Communication ref to 3D loop
  const stateRef = useRef({
    mode,
    activeField,
    status,
    themeConfig,
    rotX: 0.15,
    rotY: -0.3,
    targetRotX: 0.15,
    targetRotY: -0.3,
    isPointerDown: false,
    lastX: 0,
    lastY: 0,
    shakeTimer: 0,
    successTimer: 0,
  });

  useEffect(() => {
    stateRef.current.mode = mode;
    stateRef.current.activeField = activeField;
    stateRef.current.status = status;
    stateRef.current.themeConfig = themeConfig;

    if (status === 'error') {
      stateRef.current.shakeTimer = 0.6;
    }
    if (status === 'success') {
      stateRef.current.successTimer = 1.0;
    }
  }, [mode, activeField, status, themeConfig]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 9.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // Dynamic Lights
    const ambientLight = new THREE.AmbientLight(0x0e1428, 2.5);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0x5ee7ff, 4.5, 25);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xff6a2b, 4.0, 25);
    fillLight.position.set(-4, -4, -3);
    scene.add(fillLight);

    const coreLight = new THREE.PointLight(0xffffff, 2.0, 10);
    scene.add(coreLight);

    // Root Group
    const rootVault = new THREE.Group();
    scene.add(rootVault);

    // MATERIALS
    const mats = {
      metalDark: new THREE.MeshStandardMaterial({ color: 0x14182b, metalness: 0.9, roughness: 0.25 }),
      metalChrome: new THREE.MeshStandardMaterial({ color: 0xdce5f5, metalness: 0.95, roughness: 0.12 }),
      primaryGlow: new THREE.MeshStandardMaterial({
        color: 0x5ee7ff,
        emissive: 0x5ee7ff,
        emissiveIntensity: 0.8,
        roughness: 0.2,
      }),
      secondaryGlow: new THREE.MeshStandardMaterial({
        color: 0xff6a2b,
        emissive: 0xff6a2b,
        emissiveIntensity: 0.8,
        roughness: 0.2,
      }),
      wireframeAura: new THREE.MeshBasicMaterial({
        color: 0x5ee7ff,
        wireframe: true,
        transparent: true,
        opacity: 0.45,
      }),
      irisGlow: new THREE.MeshBasicMaterial({
        color: 0x5ee7ff,
        transparent: true,
        opacity: 0.9,
      }),
      shieldBlade: new THREE.MeshStandardMaterial({
        color: 0x1f2744,
        metalness: 0.8,
        roughness: 0.3,
        transparent: true,
        opacity: 0.85,
      }),
    };

    // 1. CENTRAL CYBER VAULT CORE
    const coreGroup = new THREE.Group();
    rootVault.add(coreGroup);

    // Central Cylindrical Chamber
    const chamberGeo = new THREE.CylinderGeometry(1.25, 1.25, 1.4, 32);
    const chamberMesh = new THREE.Mesh(chamberGeo, mats.metalDark);
    chamberMesh.rotation.x = Math.PI / 2;
    coreGroup.add(chamberMesh);

    // Knurled Locking Rings
    [-0.55, 0.55].forEach((z) => {
      const lockRing = new THREE.Mesh(new THREE.TorusGeometry(1.26, 0.06, 16, 48), mats.primaryGlow);
      lockRing.position.z = z;
      coreGroup.add(lockRing);
    });

    // Front Biometric Iris Scanner Node
    const irisRing = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.045, 16, 48), mats.irisGlow);
    irisRing.position.z = 0.72;
    coreGroup.add(irisRing);

    const irisDisc = new THREE.Mesh(
      new THREE.CircleGeometry(0.75, 32),
      new THREE.MeshStandardMaterial({ color: 0x070c1a, roughness: 0.4, metalness: 0.8 })
    );
    irisDisc.position.z = 0.71;
    coreGroup.add(irisDisc);

    // Reticle Target Crosshairs
    const crosshairGeo = new THREE.RingGeometry(0.35, 0.42, 24);
    const crosshairMesh = new THREE.Mesh(crosshairGeo, mats.primaryGlow);
    crosshairMesh.position.z = 0.73;
    coreGroup.add(crosshairMesh);

    // Inner Glowing Passkey Crystal
    const passkeyGeo = new THREE.OctahedronGeometry(0.55, 0);
    const passkeyMesh = new THREE.Mesh(passkeyGeo, mats.secondaryGlow);
    passkeyMesh.position.z = 0.74;
    coreGroup.add(passkeyMesh);

    // 2. TRIPLE INTERLOCKING GYROSCOPIC CIPHER RINGS
    const gyroGroup = new THREE.Group();
    rootVault.add(gyroGroup);

    // Ring 1 (Inner 256-Bit Ring)
    const ring1Geo = new THREE.TorusGeometry(2.1, 0.04, 16, 64);
    const ring1 = new THREE.Mesh(ring1Geo, mats.primaryGlow);
    gyroGroup.add(ring1);

    // Ring 2 (Middle Zero-Knowledge Ring)
    const ring2Geo = new THREE.TorusGeometry(2.65, 0.035, 16, 64);
    const ring2 = new THREE.Mesh(ring2Geo, mats.secondaryGlow);
    ring2.rotation.x = Math.PI / 3;
    gyroGroup.add(ring2);

    // Ring 3 (Outer Biometric Ring)
    const ring3Geo = new THREE.TorusGeometry(3.2, 0.03, 16, 64);
    const ring3 = new THREE.Mesh(ring3Geo, mats.primaryGlow);
    ring3.rotation.y = Math.PI / 4;
    gyroGroup.add(ring3);

    // 3. RETRACTABLE PROTECTIVE SHIELD BLADES (Contract when password field is focused)
    const shieldGroup = new THREE.Group();
    rootVault.add(shieldGroup);

    const bladeCount = 4;
    const blades = [];
    for (let i = 0; i < bladeCount; i++) {
      const bladeAngle = (i / bladeCount) * Math.PI * 2;
      const bladeGeo = new THREE.CylinderGeometry(1.6, 1.85, 0.6, 8, 1, true, 0, Math.PI * 0.35);
      const bladeMesh = new THREE.Mesh(bladeGeo, mats.shieldBlade);
      bladeMesh.rotation.z = bladeAngle;
      shieldGroup.add(bladeMesh);
      blades.push({ mesh: bladeMesh, baseAngle: bladeAngle });
    }

    // 4. FLOATING DATA CIPHER PARTICLES
    const pCount = 180;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      const r = 2.4 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      pPos[i] = r * Math.cos(phi) * Math.sin(theta);
      pPos[i + 1] = r * Math.sin(phi);
      pPos[i + 2] = r * Math.cos(phi) * Math.cos(theta);
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.07,
      color: 0x5ee7ff,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(pGeo, pMat);
    rootVault.add(particles);

    // Pointer Drag
    const onPointerDown = (e) => {
      stateRef.current.isPointerDown = true;
      stateRef.current.lastX = e.clientX;
      stateRef.current.lastY = e.clientY;
      setIsDragging(true);
    };

    const onPointerMove = (e) => {
      if (!stateRef.current.isPointerDown) return;
      const dx = e.clientX - stateRef.current.lastX;
      const dy = e.clientY - stateRef.current.lastY;
      stateRef.current.lastX = e.clientX;
      stateRef.current.lastY = e.clientY;

      stateRef.current.targetRotY += dx * 0.008;
      stateRef.current.targetRotX += dy * 0.006;
      stateRef.current.targetRotX = Math.max(-0.7, Math.min(0.7, stateRef.current.targetRotX));
    };

    const onPointerUp = () => {
      stateRef.current.isPointerDown = false;
      setIsDragging(false);
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    const onResize = () => {
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const st = stateRef.current;

      // Damping user rotation
      st.rotX += (st.targetRotX - st.rotX) * 0.08;
      st.rotY += (st.targetRotY - st.rotY) * 0.08;

      let shakeOffsetX = 0;
      let shakeOffsetY = 0;
      if (st.shakeTimer > 0) {
        st.shakeTimer -= delta;
        shakeOffsetX = (Math.random() - 0.5) * 0.35;
        shakeOffsetY = (Math.random() - 0.5) * 0.35;
      }

      rootVault.rotation.x = st.rotX + shakeOffsetY;
      rootVault.rotation.y = st.rotY + shakeOffsetX;

      // Color Adaptation based on Status and Mode
      const isRegister = st.mode === 'register';
      const isPasswordActive = st.activeField === 'password' || st.activeField === 'confirm';
      const isSuccess = st.status === 'success';
      const isError = st.status === 'error';
      const isAuthenticating = st.status === 'authenticating';

      // Dynamic color selection
      let primaryHex = isRegister ? 0xff6a2b : 0x5ee7ff;
      let secondaryHex = isRegister ? 0xffb347 : 0x9d4edd;

      if (isError) {
        primaryHex = 0xff4d4f;
        secondaryHex = 0xff7875;
      } else if (isSuccess) {
        primaryHex = 0x38ef7d;
        secondaryHex = 0x6ff0a8;
      }

      mats.primaryGlow.color.setHex(primaryHex);
      mats.primaryGlow.emissive.setHex(primaryHex);
      mats.secondaryGlow.color.setHex(secondaryHex);
      mats.secondaryGlow.emissive.setHex(secondaryHex);
      mats.irisGlow.color.setHex(primaryHex);
      keyLight.color.setHex(primaryHex);
      fillLight.color.setHex(secondaryHex);
      pMat.color.setHex(primaryHex);

      // Spin Speed Modifier
      let spinMult = 1.0;
      if (isAuthenticating) spinMult = 4.2;
      if (isPasswordActive) spinMult = 2.4;

      // Gyroscopic Ring Rotations
      ring1.rotation.z = elapsed * 0.8 * spinMult;
      ring2.rotation.y = -elapsed * 0.9 * spinMult;
      ring3.rotation.x = elapsed * 0.6 * spinMult;

      // Reticle and passkey rotation
      crosshairMesh.rotation.z = elapsed * 1.5;
      passkeyMesh.rotation.x = elapsed * 1.2;
      passkeyMesh.rotation.y = elapsed * 1.8;

      // Retractable Shield Blade Kinematics
      // If password field is active: shields contract tightly around the core!
      // If success: shields open wide outwards!
      let targetShieldScale = 1.0;
      let targetShieldZ = 0.0;
      if (isPasswordActive) {
        targetShieldScale = 0.78;
        targetShieldZ = 0.35;
      } else if (isSuccess) {
        targetShieldScale = 1.45;
        targetShieldZ = -0.4;
      }

      shieldGroup.scale.lerp(new THREE.Vector3(targetShieldScale, targetShieldScale, targetShieldScale), 0.1);
      shieldGroup.position.z += (targetShieldZ - shieldGroup.position.z) * 0.1;
      shieldGroup.rotation.z = elapsed * 0.3 * (isPasswordActive ? 2.0 : 1.0);

      // Core pulse
      const corePulse = isAuthenticating ? 1.0 + Math.sin(elapsed * 12) * 0.12 : 1.0 + Math.sin(elapsed * 2.2) * 0.04;
      coreGroup.scale.setScalar(corePulse);

      // Data particles orbit
      particles.rotation.y = elapsed * 0.12;

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
    <div className="biometric-vault-container">
      <div
        ref={mountRef}
        className={`biometric-vault-canvas ${isDragging ? 'grabbing' : 'grab'}`}
        title="360° Drag to inspect Biometric Security Core"
      />

      {/* Floating 3D Telemetry Badges */}
      <div className="vault-hud-badge top-left">
        <span className="v-hud-dot" style={{ background: status === 'error' ? '#ff4d4f' : status === 'success' ? '#38ef7d' : 'var(--cy)' }} />
        <div>
          <span className="v-hud-title">ENCRYPTION VAULT</span>
          <b className="v-hud-val">
            {status === 'authenticating'
              ? 'DECRYPTING BIOMETRICS...'
              : status === 'success'
              ? 'ACCESS GRANTED'
              : status === 'error'
              ? 'SECURITY REJECT'
              : activeField === 'password'
              ? 'SHIELD ENGAGED'
              : '256-BIT QUANTUM'}
          </b>
        </div>
      </div>

      <div className="vault-hud-badge bottom-right">
        <div>
          <span className="v-hud-title">CIPHER HASH</span>
          <b className="v-hud-val" style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>
            {mode === 'login' ? 'SHA256-AUTH-ACTIVE' : 'SHA512-GENESIS-KEY'}
          </b>
        </div>
      </div>

      <div className="vault-drag-hint">
        <span>🖐️ 360° Interactive Biometric Vault • Drag to Rotate</span>
      </div>
    </div>
  );
}
