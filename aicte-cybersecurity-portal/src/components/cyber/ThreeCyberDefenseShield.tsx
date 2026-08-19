import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeCyberDefenseShield: React.FC<{ size?: number }> = ({ size = 260 }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Defense Torus Rings
    const group = new THREE.Group();
    scene.add(group);

    // Center Core Octahedron
    const coreGeo = new THREE.OctahedronGeometry(0.85, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      metalness: 0.9,
      roughness: 0.1,
      wireframe: true,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // Inner Glowing Solid Diamond
    const diamondGeo = new THREE.OctahedronGeometry(0.5, 0);
    const diamondMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: false,
      transparent: true,
      opacity: 0.7,
    });
    const diamond = new THREE.Mesh(diamondGeo, diamondMat);
    group.add(diamond);

    // Orbiting Defense Torus 1
    const ring1Geo = new THREE.TorusGeometry(1.4, 0.025, 16, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x00f2fe });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    group.add(ring1);

    // Orbiting Defense Torus 2
    const ring2Geo = new THREE.TorusGeometry(1.7, 0.02, 16, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x6366f1 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 3;
    group.add(ring2);

    // Ambient light
    const light = new THREE.PointLight(0x00f2fe, 2.5, 10);
    light.position.set(2, 2, 3);
    scene.add(light);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      core.rotation.x = elapsed * 0.4;
      core.rotation.y = elapsed * 0.6;

      diamond.rotation.x = -elapsed * 0.6;
      diamond.rotation.y = -elapsed * 0.4;

      ring1.rotation.z = elapsed * 0.8;
      ring1.rotation.x = Math.sin(elapsed * 0.5) * 0.4;

      ring2.rotation.y = elapsed * 0.5;
      ring2.rotation.z = elapsed * 0.3;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full flex items-center justify-center pointer-events-none relative"
      style={{ minHeight: `${size}px` }}
    />
  );
};
