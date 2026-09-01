'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function SystemGraphHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeNodesCount, setActiveNodesCount] = useState(48);
  const [throughput, setThroughput] = useState('14.8k ops/s');
  const [isInteractive, setIsInteractive] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x09090b, 0.035);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 18;
    camera.position.y = 2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Node & Connection Topology
    const NODE_COUNT = 72;
    const nodePositions: THREE.Vector3[] = [];
    const nodeGroup = new THREE.Group();

    // Create interconnected system clusters
    for (let i = 0; i < NODE_COUNT; i++) {
      const radius = 5 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.9;

      const x = radius * Math.cos(theta) * Math.cos(phi);
      const y = radius * Math.sin(phi) * 0.7;
      const z = radius * Math.sin(theta) * Math.cos(phi);

      const pos = new THREE.Vector3(x, y, z);
      nodePositions.push(pos);

      // Node Mesh
      const isCoreNode = i % 8 === 0;
      const geometry = isCoreNode ? new THREE.BoxGeometry(0.25, 0.25, 0.25) : new THREE.SphereGeometry(0.1, 8, 8);
      const material = new THREE.MeshBasicMaterial({
        color: isCoreNode ? 0xff5500 : 0x88909d,
        wireframe: isCoreNode
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(pos);
      nodeGroup.add(mesh);
    }

    // Inter-node network lines
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.12
    });

    const activeSignalMaterial = new THREE.LineBasicMaterial({
      color: 0xff5500,
      transparent: true,
      opacity: 0.7
    });

    const lineGeo = new THREE.BufferGeometry();
    const linePoints: number[] = [];

    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < 4.2) {
          linePoints.push(
            nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
            nodePositions[j].x, nodePositions[j].y, nodePositions[j].z
          );
        }
      }
    }

    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePoints, 3));
    const lines = new THREE.LineSegments(lineGeo, lineMaterial);
    nodeGroup.add(lines);

    // Dynamic signal pulses travelling along graph
    const pulseCount = 8;
    const pulseSpheres: { mesh: THREE.Mesh; start: THREE.Vector3; end: THREE.Vector3; progress: number; speed: number }[] = [];

    for (let p = 0; p < pulseCount; p++) {
      const pGeo = new THREE.SphereGeometry(0.08, 6, 6);
      const pMat = new THREE.MeshBasicMaterial({ color: 0xff5500 });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      nodeGroup.add(pMesh);

      const i1 = Math.floor(Math.random() * NODE_COUNT);
      const i2 = (i1 + 3) % NODE_COUNT;
      pulseSpheres.push({
        mesh: pMesh,
        start: nodePositions[i1],
        end: nodePositions[i2],
        progress: Math.random(),
        speed: 0.005 + Math.random() * 0.008
      });
    }

    scene.add(nodeGroup);

    // Mouse Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x * 0.5;
      mouseY = y * 0.3;
    };

    window.addEventListener('mousemove', handlePointerMove);

    // Telemetry tick update
    const interval = setInterval(() => {
      const val = (13.5 + Math.random() * 2.8).toFixed(1);
      setThroughput(`${val}k ops/s`);
    }, 1800);

    let animFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera vector rotation
      targetRotY += (mouseX - targetRotY) * 0.05;
      targetRotX += (mouseY - targetRotX) * 0.05;

      nodeGroup.rotation.y = elapsedTime * 0.08 + targetRotY;
      nodeGroup.rotation.x = Math.sin(elapsedTime * 0.04) * 0.1 + targetRotX;

      // Animate Signal Pulses
      pulseSpheres.forEach(p => {
        p.progress += p.speed;
        if (p.progress >= 1) {
          p.progress = 0;
          const rand1 = Math.floor(Math.random() * NODE_COUNT);
          const rand2 = (rand1 + 4) % NODE_COUNT;
          p.start = nodePositions[rand1];
          p.end = nodePositions[rand2];
        }
        p.mesh.position.lerpVectors(p.start, p.end, p.progress);
      });

      renderer.render(scene, camera);
      animFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameId);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[480px] lg:min-h-[580px] flex items-center justify-center">
      {/* 3D WebGL Canvas Layer */}
      <div ref={containerRef} className="absolute inset-0 z-0 opacity-85 pointer-events-none" />

      {/* Realtime telemetry overlay */}
      <div className="absolute bottom-4 right-4 z-10 hidden sm:flex flex-col gap-1.5 p-3 rounded bg-[#0d0d0f]/80 backdrop-blur-md border border-white/10 text-[11px] font-mono text-neutral-400">
        <div className="flex items-center justify-between gap-4">
          <span className="text-neutral-500 uppercase">SYS_GRAPH</span>
          <span className="flex items-center gap-1.5 text-[#ff5500]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff5500] animate-pulse" />
            SYNAPSE ACTIVE
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-neutral-500 uppercase">NODES_INDEXED</span>
          <span className="text-neutral-200">72 LATENT VECTORS</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-neutral-500 uppercase">SIGNAL_FLUX</span>
          <span className="text-neutral-200">{throughput}</span>
        </div>
      </div>
    </div>
  );
}
