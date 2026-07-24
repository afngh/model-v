import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Three.js 3D Isometric Scene for LLM Next-Token Transformer Pipeline.
 * 4-Stage Assembly Line: Token Keycaps -> Embeddings & Attention Slabs -> Final Inference -> Output
 */
const LLM3DScene = ({ tokens, candidates, stageStep }) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);

  // Mesh & group references
  const rootGroupRef = useRef(null);
  const tokenGroupsRef = useRef([]);
  const attentionSlabsRef = useRef([]);
  const inferenceMeshRef = useRef(null);

  // Mouse drag Orbit state
  const isDraggingRef = useRef(false);
  const previousMousePosRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0.3, y: -0.3 });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 360;

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // 2. Camera Setup (Isometric Perspective View)
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 16, 48);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 4. Lighting Setup (Ambient + Directional)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.95);
    dirLight1.position.set(20, 35, 30);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.35); // Blue accent
    dirLight2.position.set(-20, -10, -20);
    scene.add(dirLight2);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);
    rootGroupRef.current = rootGroup;

    // --- STAGE 2: Attention Layer Slabs (3 stacked slabs receding in Z) ---
    const attentionSlabs = [];
    for (let s = 0; s < 3; s++) {
      const slabGeo = new THREE.BoxGeometry(16, 0.4, 8);
      const slabMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.3,
        metalness: 0.2,
        transparent: true,
        opacity: 0.75
      });
      const slabMesh = new THREE.Mesh(slabGeo, slabMat);
      slabMesh.position.set(-2, 0, -s * 4.5);
      rootGroup.add(slabMesh);
      attentionSlabs.push(slabMesh);
    }
    attentionSlabsRef.current = attentionSlabs;

    // --- STAGE 3: Final Inference Column (Glowing Output State) ---
    const infGeo = new THREE.BoxGeometry(1.6, 8, 1.6);
    const infMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.2,
      metalness: 0.5
    });
    const infMesh = new THREE.Mesh(infGeo, infMat);
    infMesh.position.set(16, 0, 0);
    rootGroup.add(infMesh);
    inferenceMeshRef.current = infMesh;

    // Render loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isDraggingRef.current) {
        rotationRef.current.y += 0.0025; // Slow auto-rotation
      }

      rootGroup.rotation.x = rotationRef.current.x;
      rootGroup.rotation.y = rotationRef.current.y;

      renderer.render(scene, camera);
    };

    animate();

    // Mouse Drag Interactions (OrbitControls)
    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      previousMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePosRef.current.x;
      const deltaY = e.clientY - previousMousePosRef.current.y;

      rotationRef.current.y += deltaX * 0.008;
      rotationRef.current.x += deltaY * 0.008;

      rotationRef.current.x = Math.max(-0.8, Math.min(0.8, rotationRef.current.x));
      previousMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      cancelAnimationFrame(animId);
      domElem.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (container.contains(domElem)) {
        container.removeChild(domElem);
      }
      renderer.dispose();
    };
  }, []);

  // Dynamically reconstruct Token Keycaps & Embedding Columns when tokens change
  useEffect(() => {
    if (!rootGroupRef.current) return;
    const rootGroup = rootGroupRef.current;

    // Clean up previous token groups
    tokenGroupsRef.current.forEach(g => rootGroup.remove(g));
    tokenGroupsRef.current = [];

    const displayTokens = tokens.length > 0 ? tokens.slice(-6) : ['The', 'neural', 'network'];
    const count = displayTokens.length;
    const startX = -18;
    const stepX = 5.5;

    const baseCubeGeo = new THREE.BoxGeometry(0.7, 0.7, 0.7);

    displayTokens.forEach((tokStr, idx) => {
      const tokGroup = new THREE.Group();
      const posX = startX + idx * stepX;
      tokGroup.position.set(posX, 0, 3);

      // 1. Stage 1 Keycap Block (Domino)
      const keycapGeo = new THREE.BoxGeometry(2.2, 0.8, 1.4);
      const keycapMat = new THREE.MeshStandardMaterial({
        color: stageStep >= 1 ? 0xffffff : 0x334155,
        roughness: 0.3
      });
      const keycapMesh = new THREE.Mesh(keycapGeo, keycapMat);
      keycapMesh.position.set(0, -4, 0);
      tokGroup.add(keycapMesh);

      // 2. Stage 2 Embedding Column (Tall column of cubes)
      const colCubes = [];
      const dimCount = 8;
      for (let d = 0; d < dimCount; d++) {
        const mat = new THREE.MeshStandardMaterial({
          color: stageStep >= 2 ? 0x94a3b8 : 0x0f172a,
          roughness: 0.3
        });
        const cubeMesh = new THREE.Mesh(baseCubeGeo, mat);
        cubeMesh.position.set(0, (d - dimCount / 2) * 0.85, 0);
        tokGroup.add(cubeMesh);
        colCubes.push(cubeMesh);
      }

      rootGroup.add(tokGroup);
      tokenGroupsRef.current.push({ group: tokGroup, keycapMesh, colCubes });
    });
  }, [tokens, stageStep]);

  // Update Material Colors & Attention Slabs based on stageStep
  useEffect(() => {
    // Attention Slabs Update
    attentionSlabsRef.current.forEach((slab, idx) => {
      const isLit = stageStep >= 2;
      slab.material.color.setHex(isLit ? (idx === 1 ? 0x38bdf8 : 0x475569) : 0x0f172a);
      slab.material.opacity = isLit ? 0.85 : 0.4;
    });

    // Final Inference Column Update
    if (inferenceMeshRef.current) {
      const isLit = stageStep >= 3;
      inferenceMeshRef.current.material.color.setHex(isLit ? 0xffffff : 0x1e293b);
      inferenceMeshRef.current.material.roughness = isLit ? 0.1 : 0.5;
    }
  }, [stageStep]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[360px] bg-black cursor-grab active:cursor-grabbing select-none relative"
    >
      {/* 3D Scene Assembly Line Stage Labels */}
      <div className="absolute bottom-2 left-4 right-4 flex justify-between text-[10px] font-mono text-slate-400 pointer-events-none">
        <span>1. Tokenize Keycaps</span>
        <span>2. Embedding & Attention Slabs</span>
        <span>3. Inference State</span>
        <span>4. Next Token Scores</span>
      </div>
    </div>
  );
};

export default LLM3DScene;
