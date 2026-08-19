import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeDataCenterGlobeProps {
  onNodeClick?: (dcName: string) => void;
}

export const ThreeDataCenterGlobe: React.FC<ThreeDataCenterGlobeProps> = ({ onNodeClick }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedDc, setSelectedDc] = useState<string | null>("AICTE Data Center A (New Delhi)");

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3. Globe Core Sphere (Dark Wireframe & Atmosphere)
    const globeRadius = 2.4;
    const sphereGeo = new THREE.SphereGeometry(globeRadius, 36, 36);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const globe = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(globe);

    // Inner glowing sphere
    const innerGeo = new THREE.SphereGeometry(globeRadius * 0.96, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x051329,
      transparent: true,
      opacity: 0.85,
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerSphere);

    // Orbital Ring
    const ringGeo = new THREE.RingGeometry(globeRadius * 1.35, globeRadius * 1.37, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.5;
    scene.add(ring);

    // Lat/Lon to Vector3 converter
    const latLonToVector3 = (lat: number, lon: number, radius: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    // DC Locations (New Delhi & Bengaluru)
    const dcDelhiPos = latLonToVector3(28.6139, 77.209, globeRadius);
    const dcBlrPos = latLonToVector3(12.9716, 77.5946, globeRadius);

    // DC Beacon Markers
    const createBeacon = (pos: THREE.Vector3, color: number) => {
      const group = new THREE.Group();
      group.position.copy(pos);

      // Core point
      const pinGeo = new THREE.SphereGeometry(0.08, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      group.add(pin);

      // Outer pulsing ring
      const haloGeo = new THREE.RingGeometry(0.12, 0.16, 32);
      const haloMat = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.lookAt(pos.clone().multiplyScalar(2));
      group.add(halo);

      return { group, halo };
    };

    const delhiBeacon = createBeacon(dcDelhiPos, 0x00f2fe);
    const blrBeacon = createBeacon(dcBlrPos, 0x10b981);
    globe.add(delhiBeacon.group);
    globe.add(blrBeacon.group);

    // Sync Telemetry Arc linking DC A and DC B
    const curvePoints: THREE.Vector3[] = [];
    const midPoint = dcDelhiPos.clone().add(dcBlrPos).multiplyScalar(0.5);
    midPoint.normalize().multiplyScalar(globeRadius * 1.35); // elevated arc

    const curve = new THREE.QuadraticBezierCurve3(dcDelhiPos, midPoint, dcBlrPos);
    const arcGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(50));
    const arcMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.75 });
    const arcLine = new THREE.Line(arcGeo, arcMat);
    globe.add(arcLine);

    // Ambient floating particles
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const p = latLonToVector3(
        (Math.random() - 0.5) * 180,
        (Math.random() - 0.5) * 360,
        globeRadius * (1.05 + Math.random() * 0.4)
      );
      particlePositions[i] = p.x;
      particlePositions[i + 1] = p.y;
      particlePositions[i + 2] = p.z;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00f2fe,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    globe.add(particles);

    // Interaction Variables
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
      globe.rotation.y += deltaX * 0.006;
      globe.rotation.x += deltaY * 0.006;
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

      // Auto rotation when not dragging
      if (!isDragging) {
        globe.rotation.y += 0.0025;
      }
      ring.rotation.z += 0.001;

      // Pulse halos
      const scale = 1 + Math.sin(elapsed * 4) * 0.3;
      delhiBeacon.halo.scale.set(scale, scale, scale);
      blrBeacon.halo.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
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
    <div className="p-5 rounded-3xl glass-panel-glow border-cyan-500/40 relative overflow-hidden space-y-3">
      <div className="flex items-center justify-between z-10 relative">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            Interactive 3D Multi-Region DC Telemetry Globe
          </span>
          <p className="text-xs text-slate-300">Drag to rotate the 3D hologram matrix and inspect regional replication arcs</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedDc("AICTE Data Center A (New Delhi)");
              if (onNodeClick) onNodeClick("DC-A");
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all border ${
              selectedDc?.includes("New Delhi")
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-[0_0_10px_rgba(0,242,254,0.3)]"
                : "bg-slate-900 text-slate-400 border-slate-800"
            }`}
          >
            DC-A (Delhi)
          </button>
          <button
            onClick={() => {
              setSelectedDc("AICTE Data Center B (Bengaluru)");
              if (onNodeClick) onNodeClick("DC-B");
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all border ${
              selectedDc?.includes("Bengaluru")
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                : "bg-slate-900 text-slate-400 border-slate-800"
            }`}
          >
            DC-B (Bengaluru)
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-72 rounded-2xl bg-gradient-to-b from-[#020617] to-[#040d21] border border-slate-800/80 cursor-grab active:cursor-grabbing relative overflow-hidden"
      >
        <div className="absolute bottom-2.5 left-3 text-[10px] font-mono text-slate-400 pointer-events-none flex items-center gap-3">
          <span className="text-cyan-300">● DC-A: 28.6° N, 77.2° E (Primary Bay)</span>
          <span className="text-emerald-300">● DC-B: 12.9° N, 77.5° E (Failover Bay)</span>
          <span className="text-slate-500">Latency: 14.8ms Fiber Sync</span>
        </div>
      </div>
    </div>
  );
};
