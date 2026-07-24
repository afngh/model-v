import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Three.js 3D Adam Harley-Style CNN Visualizer Scene with Touch Support & Selective Stage Opacity.
 * Render pipeline (Steps 1 to 6):
 * Step 1: Tilted 28x28 Input Grid Card
 * Step 2: Shrinking Conv + Pool 3D Cube Blocks
 * Step 3: Vertical Ribbon Strips (Flattened)
 * Step 4: Dense Layer Row
 * Step 5: Output Row (Digits 0-9)
 * Step 6: Final Prediction Highlight
 */
const CNN3DScene = ({ pixels784, predictions, pulseStep }) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);

  // Mesh references for dynamic grayscale activation updates
  const meshesRef = useRef({
    input: [],
    conv1: [],
    pool1: [],
    conv2: [],
    ribbons: [],
    dense: [],
    output: []
  });

  // Mouse / Touch drag Orbit state
  const isDraggingRef = useRef(false);
  const previousTouchPosRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0.25, y: -0.35 });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 700;
    const height = container.clientHeight || 380;

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // 2. Camera Setup (Angled Isometric View matching reference)
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1000);
    camera.position.set(0, 16, 52);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 4. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.95);
    dirLight.position.set(20, 35, 30);
    scene.add(dirLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const baseGeometry = new THREE.BoxGeometry(0.7, 0.7, 0.7);

    // --- STEP 1: Tilted 28x28 Input Grid Card (Top-Left) ---
    const inputGroup = new THREE.Group();
    inputGroup.position.set(-24, 2, 0);
    inputGroup.rotation.y = 0.35;
    inputGroup.rotation.x = -0.15;
    rootGroup.add(inputGroup);

    const inputMeshes = [];
    const stepIn = 0.75;
    const sizeIn = 14;
    const offInX = (sizeIn * stepIn) / 2;
    const offInY = (sizeIn * stepIn) / 2;

    for (let r = 0; r < sizeIn; r++) {
      for (let c = 0; c < sizeIn; c++) {
        const mat = new THREE.MeshStandardMaterial({
          color: 0x1e293b,
          roughness: 0.4,
          transparent: true,
          opacity: 1.0
        });
        const mesh = new THREE.Mesh(baseGeometry, mat);
        mesh.position.set(c * stepIn - offInX, -r * stepIn + offInY, 0);
        inputGroup.add(mesh);
        inputMeshes.push(mesh);
      }
    }
    meshesRef.current.input = inputMeshes;

    // --- STEP 2: Shrinking Conv + Pool 3D Blocks ---
    // Conv1 Block (12x12x4)
    const conv1Group = new THREE.Group();
    conv1Group.position.set(-13, 1, 0);
    rootGroup.add(conv1Group);

    const conv1Meshes = [];
    const sizeC1 = 9;
    const stepC1 = 0.72;
    const offC1X = (sizeC1 * stepC1) / 2;
    const offC1Y = (sizeC1 * stepC1) / 2;

    for (let ch = 0; ch < 4; ch++) {
      const zPos = (ch - 2) * 1.8;
      for (let r = 0; r < sizeC1; r++) {
        for (let c = 0; c < sizeC1; c++) {
          const mat = new THREE.MeshStandardMaterial({
            color: 0x0f172a,
            roughness: 0.3,
            transparent: true,
            opacity: 1.0
          });
          const mesh = new THREE.Mesh(baseGeometry, mat);
          mesh.position.set(c * stepC1 - offC1X, -r * stepC1 + offC1Y, zPos);
          conv1Group.add(mesh);
          conv1Meshes.push(mesh);
        }
      }
    }
    meshesRef.current.conv1 = conv1Meshes;

    // Pool1 Block (6x6x6)
    const pool1Group = new THREE.Group();
    pool1Group.position.set(-3, 0.5, 0);
    rootGroup.add(pool1Group);

    const pool1Meshes = [];
    const sizeP1 = 6;
    const stepP1 = 0.8;
    const offP1X = (sizeP1 * stepP1) / 2;
    const offP1Y = (sizeP1 * stepP1) / 2;

    for (let ch = 0; ch < 6; ch++) {
      const zPos = (ch - 3) * 1.5;
      for (let r = 0; r < sizeP1; r++) {
        for (let c = 0; c < sizeP1; c++) {
          const mat = new THREE.MeshStandardMaterial({
            color: 0x0f172a,
            roughness: 0.3,
            transparent: true,
            opacity: 1.0
          });
          const mesh = new THREE.Mesh(baseGeometry, mat);
          mesh.position.set(c * stepP1 - offP1X, -r * stepP1 + offP1Y, zPos);
          pool1Group.add(mesh);
          pool1Meshes.push(mesh);
        }
      }
    }
    meshesRef.current.pool1 = pool1Meshes;

    // Conv2 Block (4x4x8)
    const conv2Group = new THREE.Group();
    conv2Group.position.set(5, 0, 0);
    rootGroup.add(conv2Group);

    const conv2Meshes = [];
    const sizeC2 = 4;
    const stepC2 = 0.9;
    const offC2X = (sizeC2 * stepC2) / 2;
    const offC2Y = (sizeC2 * stepC2) / 2;

    for (let ch = 0; ch < 8; ch++) {
      const zPos = (ch - 4) * 1.3;
      for (let r = 0; r < sizeC2; r++) {
        for (let c = 0; c < sizeC2; c++) {
          const mat = new THREE.MeshStandardMaterial({
            color: 0x0f172a,
            roughness: 0.3,
            transparent: true,
            opacity: 1.0
          });
          const mesh = new THREE.Mesh(baseGeometry, mat);
          mesh.position.set(c * stepC2 - offC2X, -r * stepC2 + offC2Y, zPos);
          conv2Group.add(mesh);
          conv2Meshes.push(mesh);
        }
      }
    }
    meshesRef.current.conv2 = conv2Meshes;

    // --- STEP 3: Vertical Ribbon Strips (Flattened Features) ---
    const ribbonGroup = new THREE.Group();
    ribbonGroup.position.set(12, 0, 0);
    rootGroup.add(ribbonGroup);

    const ribbonMeshes = [];
    const ribbonStrips = 4;
    const ribbonLen = 10;
    for (let s = 0; s < ribbonStrips; s++) {
      const xPos = (s - ribbonStrips / 2) * 1.2;
      for (let i = 0; i < ribbonLen; i++) {
        const mat = new THREE.MeshStandardMaterial({
          color: 0x0f172a,
          roughness: 0.3,
          transparent: true,
          opacity: 1.0
        });
        const mesh = new THREE.Mesh(baseGeometry, mat);
        mesh.position.set(xPos, (i - ribbonLen / 2) * 0.85, 0);
        ribbonGroup.add(mesh);
        ribbonMeshes.push(mesh);
      }
    }
    meshesRef.current.ribbons = ribbonMeshes;

    // --- STEP 4: Dense Layer Row ---
    const denseGroup = new THREE.Group();
    denseGroup.position.set(19, 0, 0);
    rootGroup.add(denseGroup);

    const denseMeshes = [];
    const denseCount = 12;
    for (let i = 0; i < denseCount; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.3,
        transparent: true,
        opacity: 1.0
      });
      const mesh = new THREE.Mesh(baseGeometry, mat);
      mesh.position.set((i - denseCount / 2) * 0.9, 0, 0);
      denseGroup.add(mesh);
      denseMeshes.push(mesh);
    }
    meshesRef.current.dense = denseMeshes;

    // --- STEP 5: Output Row (Digits 0-9) ---
    const outputGroup = new THREE.Group();
    outputGroup.position.set(19, -5, 0);
    rootGroup.add(outputGroup);

    const outputMeshes = [];
    const outCount = 10;
    for (let d = 0; d < outCount; d++) {
      const mat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.3,
        transparent: true,
        opacity: 1.0
      });
      const mesh = new THREE.Mesh(baseGeometry, mat);
      mesh.position.set((d - outCount / 2) * 1.4, 0, 0);
      outputGroup.add(mesh);
      outputMeshes.push(mesh);
    }
    meshesRef.current.output = outputMeshes;

    // Render loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isDraggingRef.current) {
        rotationRef.current.y += 0.0025; // Slow auto-rotate
      }

      rootGroup.rotation.x = rotationRef.current.x;
      rootGroup.rotation.y = rotationRef.current.y;

      renderer.render(scene, camera);
    };

    animate();

    // Mouse & Touch Drag Orbit Controls (Touch-friendly)
    const handleStart = (clientX, clientY) => {
      isDraggingRef.current = true;
      previousTouchPosRef.current = { x: clientX, y: clientY };
    };

    const handleMove = (clientX, clientY) => {
      if (!isDraggingRef.current) return;
      const deltaX = clientX - previousTouchPosRef.current.x;
      const deltaY = clientY - previousTouchPosRef.current.y;

      rotationRef.current.y += deltaX * 0.008;
      rotationRef.current.x += deltaY * 0.008;

      rotationRef.current.x = Math.max(-0.8, Math.min(0.8, rotationRef.current.x));
      previousTouchPosRef.current = { x: clientX, y: clientY };
    };

    const handleEnd = () => {
      isDraggingRef.current = false;
    };

    const handleMouseDown = (e) => handleStart(e.clientX, e.clientY);
    const handleMouseMove = (e) => handleMove(e.clientX, e.clientY);
    const handleMouseUp = () => handleEnd();

    const handleTouchStart = (e) => {
      if (e.touches && e.touches[0]) handleStart(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleTouchEnd = () => handleEnd();

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    domElem.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      cancelAnimationFrame(animId);
      domElem.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domElem.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      if (container.contains(domElem)) {
        container.removeChild(domElem);
      }
      renderer.dispose();
    };
  }, []);

  // Enforce Selective Stage Opacity & Activation Lighting based on pulseStep (1 to 6)
  useEffect(() => {
    const meshes = meshesRef.current;
    if (!meshes.input.length) return;

    // Step 1: Input Grid
    const isStep1Reached = pulseStep >= 1;
    meshes.input.forEach((mesh, idx) => {
      const pIdx = Math.floor((idx / meshes.input.length) * 784);
      const val = pixels784[pIdx] || 0;
      const fillVal = isStep1Reached ? val : 0;
      mesh.material.opacity = isStep1Reached ? 1.0 : 0.2;
      mesh.material.color.setHex(THREE.MathUtils.lerp(0x1e293b, 0xffffff, fillVal));
    });

    // Step 2: Conv1, Pool1, Conv2 3D Blocks
    const isStep2Reached = pulseStep >= 2;
    meshes.conv1.forEach((mesh, idx) => {
      const act = predictions ? (predictions.activations.hidden[idx % 16] || 0) : 0;
      const fillVal = isStep2Reached ? Math.min(1, act / 3) : 0;
      mesh.material.opacity = isStep2Reached ? 1.0 : 0.15;
      mesh.material.color.setHex(THREE.MathUtils.lerp(0x0f172a, 0xe2e8f0, fillVal));
    });

    meshes.pool1.forEach((mesh, idx) => {
      const act = predictions ? (predictions.activations.hidden[idx % 16] || 0) : 0;
      const fillVal = isStep2Reached ? Math.min(1, act / 3) : 0;
      mesh.material.opacity = isStep2Reached ? 1.0 : 0.15;
      mesh.material.color.setHex(THREE.MathUtils.lerp(0x0f172a, 0xe2e8f0, fillVal));
    });

    meshes.conv2.forEach((mesh, idx) => {
      const act = predictions ? (predictions.activations.hidden[idx % 16] || 0) : 0;
      const fillVal = isStep2Reached ? Math.min(1, act / 3) : 0;
      mesh.material.opacity = isStep2Reached ? 1.0 : 0.15;
      mesh.material.color.setHex(THREE.MathUtils.lerp(0x0f172a, 0xf8fafc, fillVal));
    });

    // Step 3: Ribbons
    const isStep3Reached = pulseStep >= 3;
    meshes.ribbons.forEach((mesh, idx) => {
      const act = predictions ? (predictions.activations.hidden[idx % 16] || 0) : 0;
      const fillVal = isStep3Reached ? Math.min(1, act / 3) : 0;
      mesh.material.opacity = isStep3Reached ? 1.0 : 0.15;
      mesh.material.color.setHex(THREE.MathUtils.lerp(0x0f172a, 0xffffff, fillVal));
    });

    // Step 4: Dense Row
    const isStep4Reached = pulseStep >= 4;
    meshes.dense.forEach((mesh, idx) => {
      const act = predictions ? (predictions.activations.hidden[idx] || 0) : 0;
      const fillVal = isStep4Reached ? (act > 1.2 ? 1.0 : Math.min(1, act / 3)) : 0;
      mesh.material.opacity = isStep4Reached ? 1.0 : 0.15;
      mesh.material.color.setHex(THREE.MathUtils.lerp(0x0f172a, 0xffffff, fillVal));
    });

    // Step 5 & 6: Output Row (Digits 0-9)
    const isStep5Reached = pulseStep >= 5;
    meshes.output.forEach((mesh, digit) => {
      const prob = predictions ? predictions.probabilities[digit] : 0;
      const isWinner = predictions && predictions.predictedDigit === digit;
      const fillVal = isStep5Reached ? (isWinner ? 1.0 : prob) : 0;
      mesh.material.opacity = isStep5Reached ? 1.0 : 0.15;
      mesh.material.color.setHex(THREE.MathUtils.lerp(0x0f172a, isWinner ? 0xf43f5e : 0xffffff, fillVal));
    });
  }, [pixels784, predictions, pulseStep]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[380px] bg-black cursor-grab active:cursor-grabbing select-none relative touch-pan-y"
    >
      {/* Harley-Style Pipeline Stage Labels */}
      <div className="absolute bottom-2 left-4 right-4 flex justify-between text-[10px] font-mono text-slate-400 pointer-events-none">
        <span className={pulseStep >= 1 ? 'text-white font-bold' : 'text-slate-600'}>Step 1: Input Grid</span>
        <span className={pulseStep >= 2 ? 'text-white font-bold' : 'text-slate-600'}>Step 2: Conv+Pool Volumes</span>
        <span className={pulseStep >= 3 ? 'text-white font-bold' : 'text-slate-600'}>Step 3: Ribbons</span>
        <span className={pulseStep >= 4 ? 'text-white font-bold' : 'text-slate-600'}>Step 4: Dense Row</span>
        <span className={pulseStep >= 5 ? 'text-white font-bold' : 'text-slate-600'}>Step 5 & 6: Output (0-9)</span>
      </div>
    </div>
  );
};

export default CNN3DScene;
