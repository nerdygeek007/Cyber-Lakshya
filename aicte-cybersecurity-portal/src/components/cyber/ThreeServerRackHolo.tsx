import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeServerRackHoloProps {
  onSelectBlade?: (bladeId: string) => void;
}

export const ThreeServerRackHolo: React.FC<ThreeServerRackHoloProps> = ({ onSelectBlade }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredBlade, setHoveredBlade] = useState<string | null>("SRV-024 (97% CPU)");

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Perspective Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(4, 2.5, 6);
    camera.lookAt(0, 0, 0);

    // 2. WebGL Renderer with PBR settings
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 3. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const cyanPoint = new THREE.PointLight(0x00f2fe, 3.5, 10);
    cyanPoint.position.set(3, 4, 3);
    scene.add(cyanPoint);

    const redPoint = new THREE.PointLight(0xf43f5e, 2.0, 8);
    redPoint.position.set(-2, 1, 2);
    scene.add(redPoint);

    // 4. Rack Frame (Outer Metallic Housing)
    const rackGroup = new THREE.Group();
    scene.add(rackGroup);

    const frameGeo = new THREE.BoxGeometry(1.6, 4.2, 1.2);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.85,
      roughness: 0.25,
      wireframe: false,
    });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    rackGroup.add(frameMesh);

    // Inner cavity cutout effect
    const innerCavityGeo = new THREE.BoxGeometry(1.4, 4.0, 1.1);
    const innerCavityMat = new THREE.MeshBasicMaterial({ color: 0x030712 });
    const innerCavity = new THREE.Mesh(innerCavityGeo, innerCavityMat);
    rackGroup.add(innerCavity);

    // 5. Stacked Server Blade Units
    const bladeMeshes: THREE.Mesh[] = [];
    const bladeCount = 10;
    const bladeHeight = 0.32;

    for (let i = 0; i < bladeCount; i++) {
      const yPos = 1.6 - i * (bladeHeight + 0.05);
      const isCritical = i === 4; // SRV-024
      const isWarning = i === 7;

      const bladeGeo = new THREE.BoxGeometry(1.35, bladeHeight, 1.05);
      const bladeMat = new THREE.MeshStandardMaterial({
        color: isCritical ? 0x3f121d : isWarning ? 0x35230d : 0x1e293b,
        metalness: 0.9,
        roughness: 0.3,
      });
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.position.set(0, yPos, 0.05);
      blade.userData = { id: isCritical ? "SRV-024" : `SRV-0${10 + i}`, isCritical };
      rackGroup.add(blade);
      bladeMeshes.push(blade);

      // Server Front Face Panel (Handle bars & Glowing LED)
      const ledGeo = new THREE.SphereGeometry(0.025, 8, 8);
      const ledMat = new THREE.MeshBasicMaterial({
        color: isCritical ? 0xf43f5e : isWarning ? 0xf59e0b : 0x10b981,
      });
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(0.55, yPos, 0.58);
      rackGroup.add(led);

      // Network port bar
      const portGeo = new THREE.BoxGeometry(0.4, 0.06, 0.02);
      const portMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe });
      const port = new THREE.Mesh(portGeo, portMat);
      port.position.set(-0.35, yPos, 0.58);
      rackGroup.add(port);
    }

    // 6. Upward Heat Particle Stream (Thermal Dissipation)
    const heatParticlesCount = 60;
    const heatGeo = new THREE.BufferGeometry();
    const heatPositions = new Float32Array(heatParticlesCount * 3);
    for (let i = 0; i < heatParticlesCount * 3; i += 3) {
      heatPositions[i] = (Math.random() - 0.5) * 1.2;
      heatPositions[i + 1] = Math.random() * 3 - 1.5;
      heatPositions[i + 2] = (Math.random() - 0.5) * 0.8;
    }
    heatGeo.setAttribute('position', new THREE.BufferAttribute(heatPositions, 3));
    const heatMat = new THREE.PointsMaterial({
      color: 0x00f2fe,
      size: 0.05,
      transparent: true,
      opacity: 0.7,
    });
    const heatParticles = new THREE.Points(heatGeo, heatMat);
    rackGroup.add(heatParticles);

    // 7. Mouse Drag Rotation Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      rackGroup.rotation.y += deltaX * 0.008;
      rackGroup.rotation.x = Math.max(-0.4, Math.min(0.4, rackGroup.rotation.x + deltaY * 0.005));
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (!isDragging) {
        rackGroup.rotation.y = Math.sin(elapsed * 0.5) * 0.35 + 0.2;
      }

      // Elevate heat particles
      const positions = heatParticles.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += 0.02;
        if (positions[i] > 2.2) {
          positions[i] = -2.0;
        }
      }
      heatParticles.geometry.attributes.position.needsUpdate = true;

      // Pulse red point light on critical server
      redPoint.intensity = 1.5 + Math.sin(elapsed * 6) * 1.0;

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
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="p-4 rounded-3xl glass-panel-glow border-cyan-500/40 relative overflow-hidden space-y-3">
      <div className="flex items-center justify-between z-10 relative">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Interactive 3D 42U Server Holo-Chassis (Three.js WebGL)
          </span>
          <p className="text-xs text-slate-300">Drag to orbit the 3D server chassis and inspect thermal heat streams</p>
        </div>
        <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40">
          SRV-024 (97% CPU) Critical
        </span>
      </div>

      <div
        ref={mountRef}
        className="w-full h-80 rounded-2xl bg-gradient-to-b from-[#020617] to-[#050f24] border border-slate-800/90 cursor-grab active:cursor-grabbing relative overflow-hidden"
      >
        <div className="absolute bottom-2 left-3 text-[10px] font-mono text-slate-400 pointer-events-none">
          <span>Physical Chassis: Dell PowerEdge R750 (42U Bay 1) • Dynamic Thermal Shader Active</span>
        </div>
      </div>
    </div>
  );
};
