import React, { useState, useEffect, useRef, useCallback } from 'react';
import Canvas from '../Canvas';
import Slider from '../Slider';
import Button from '../Button';
import BeforeAfterThumbnail from '../diagrams/BeforeAfterThumbnail';
import {
  generateClusterData,
  initializeCentroids,
  assignClusters,
  stepKMeans,
  calculateInertia
} from '../../utils/kmeans';

// 15 Distinct Flat Colors (matplotlib / scientific style)
const FLAT_COLORS = [
  '#dc2626', // Red
  '#2563eb', // Blue
  '#16a34a', // Green
  '#ea580c', // Orange
  '#9333ea', // Purple
  '#475569', // Slate
  '#db2777', // Pink
  '#0d9488', // Teal
  '#ca8a04', // Yellow/Gold
  '#0284c7', // Sky Blue
  '#65a30d', // Lime
  '#7c3aed', // Violet
  '#b91c1c', // Crimson
  '#047857', // Emerald
  '#c026d3'  // Fuchsia
];

const Visualization = () => {
  const [k, setK] = useState(4);
  const [pointCount, setPointCount] = useState(150);
  const [points, setPoints] = useState([]);
  const [displayedCentroids, setDisplayedCentroids] = useState([]);
  const [targetCentroids, setTargetCentroids] = useState([]);
  const [assignments, setAssignments] = useState([]);

  // Centroid Path History Trails
  const [centroidTrail, setCentroidTrail] = useState([]);

  const [isRunning, setIsRunning] = useState(false);
  const [isConverged, setIsConverged] = useState(false);
  const [iterations, setIterations] = useState(0);

  // Inertia history array for training loss plot
  const [inertiaHistory, setInertiaHistory] = useState([]);

  // Manual point input state
  const [customX, setCustomX] = useState('0.50');
  const [customY, setCustomY] = useState('0.50');

  const pointsRef = useRef(points);
  const displayedCentroidsRef = useRef(displayedCentroids);
  const targetCentroidsRef = useRef(targetCentroids);
  const kRef = useRef(k);
  const isRunningRef = useRef(isRunning);
  const isConvergedRef = useRef(isConverged);
  const lastStepTimeRef = useRef(0);
  const animFrameIdRef = useRef(null);

  useEffect(() => { pointsRef.current = points; }, [points]);
  useEffect(() => { displayedCentroidsRef.current = displayedCentroids; }, [displayedCentroids]);
  useEffect(() => { targetCentroidsRef.current = targetCentroids; }, [targetCentroids]);
  useEffect(() => { kRef.current = k; }, [k]);
  useEffect(() => { isRunningRef.current = isRunning; }, [isRunning]);
  useEffect(() => { isConvergedRef.current = isConverged; }, [isConverged]);

  const currentInertia = calculateInertia(points, targetCentroids, assignments);

  // Generate new dataset & initial centroids
  const handleReset = useCallback((newK = k, count = pointCount) => {
    setIsRunning(false);
    setIsConverged(false);
    setIterations(0);
    setInertiaHistory([]);

    const newPoints = generateClusterData(count, Math.min(newK, 6));
    const initCentroids = initializeCentroids(newK, newPoints);

    setPoints(newPoints);
    setDisplayedCentroids(initCentroids);
    setTargetCentroids(initCentroids);
    setCentroidTrail([initCentroids]);
    setAssignments([]);
  }, [k, pointCount]);

  useEffect(() => {
    handleReset(4, 150);
  }, []);

  const handleKChange = (newK) => {
    const val = Math.max(2, Math.min(15, newK)); // Up to 15 clusters!
    setK(val);
    handleReset(val, pointCount);
  };

  const handleSingleStep = useCallback(() => {
    if (pointsRef.current.length === 0 || targetCentroidsRef.current.length === 0) return;
    if (isConvergedRef.current) return;

    const result = stepKMeans(
      pointsRef.current,
      targetCentroidsRef.current,
      kRef.current
    );

    setTargetCentroids(result.centroids);
    setAssignments(result.assignments);
    setIterations(prev => prev + 1);
    setInertiaHistory(prev => [...prev, result.inertia]);
    setCentroidTrail(prev => [...prev, result.centroids]);

    if (result.converged) {
      setIsConverged(true);
      setIsRunning(false);
    }
  }, []);

  // Centroid Lerp & Step Delay Loop
  useEffect(() => {
    const loop = (timestamp) => {
      const disp = displayedCentroidsRef.current;
      const targets = targetCentroidsRef.current;

      if (disp.length > 0 && targets.length === disp.length) {
        let isMoving = false;
        const lerped = disp.map((c, i) => {
          const target = targets[i];
          const dx = target.x - c.x;
          const dy = target.y - c.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 0.001) {
            isMoving = true;
            return { x: c.x + dx * 0.18, y: c.y + dy * 0.18 };
          }
          return { ...target };
        });

        if (isMoving) {
          setDisplayedCentroids(lerped);
        }

        if (
          isRunningRef.current &&
          !isConvergedRef.current &&
          !isMoving &&
          timestamp - lastStepTimeRef.current > 400
        ) {
          lastStepTimeRef.current = timestamp;
          handleSingleStep();
        }
      }

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [handleSingleStep]);

  // Handle clicking on canvas to add point
  const handleCanvasClick = ({ canvasX, canvasY, event }) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const margin = 40;
    const plotW = rect.width - margin * 2;
    const plotH = rect.height - margin * 2;

    const normX = Math.max(0, Math.min(1, (canvasX - margin) / plotW));
    const normY = Math.max(0, Math.min(1, 1 - (canvasY - margin) / plotH));

    const newPoints = [...points, { x: parseFloat(normX.toFixed(3)), y: parseFloat(normY.toFixed(3)) }];
    setPoints(newPoints);

    if (targetCentroids.length > 0) {
      const newAssignments = assignClusters(newPoints, targetCentroids);
      setAssignments(newAssignments);
    }
  };

  // Add Manual Point
  const handleAddManualPoint = (e) => {
    e.preventDefault();
    const px = Math.max(0, Math.min(1, parseFloat(customX) || 0));
    const py = Math.max(0, Math.min(1, parseFloat(customY) || 0));

    const newPoints = [...points, { x: px, y: py }];
    setPoints(newPoints);

    if (targetCentroids.length > 0) {
      const newAssignments = assignClusters(newPoints, targetCentroids);
      setAssignments(newAssignments);
    }
  };

  // Main Scatter Plot & Centroid Path Trails + Radius Circles
  const renderScatterPlot = ({ ctx, dimensions }) => {
    if (!ctx) return;
    const { width, height } = dimensions;

    const margin = 40;
    const plotW = width - margin * 2;
    const plotH = height - margin * 2;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, height - margin);
    ctx.lineTo(width - margin, height - margin);
    ctx.stroke();

    const toCanvasX = (nx) => margin + nx * plotW;
    const toCanvasY = (ny) => height - margin - ny * plotH;

    // Centroid Path Trails
    if (centroidTrail.length > 1) {
      ctx.lineWidth = 1.5;
      ctx.setLineDash([2, 3]);

      for (let cIdx = 0; cIdx < k; cIdx++) {
        const color = FLAT_COLORS[cIdx % FLAT_COLORS.length];
        ctx.strokeStyle = color;
        ctx.beginPath();

        centroidTrail.forEach((stepCentroids, stepIdx) => {
          if (stepCentroids[cIdx]) {
            const cx = toCanvasX(stepCentroids[cIdx].x);
            const cy = toCanvasY(stepCentroids[cIdx].y);
            if (stepIdx === 0) ctx.moveTo(cx, cy);
            else ctx.lineTo(cx, cy);
          }
        });

        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    // Cluster Variance Circles
    if (assignments.length > 0) {
      displayedCentroids.forEach((c, idx) => {
        if (idx >= k) return;
        const color = FLAT_COLORS[idx % FLAT_COLORS.length];
        const assignedPts = points.filter((_, pIdx) => assignments[pIdx] === idx);

        if (assignedPts.length > 0) {
          let sumDist = 0;
          assignedPts.forEach(pt => {
            const dx = (pt.x - c.x) * plotW;
            const dy = (pt.y - c.y) * plotH;
            sumDist += Math.sqrt(dx * dx + dy * dy);
          });
          const avgRadius = Math.max(12, sumDist / assignedPts.length);

          const cx = toCanvasX(c.x);
          const cy = toCanvasY(c.y);

          ctx.strokeStyle = color;
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.arc(cx, cy, avgRadius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });
    }

    // Draw Scatter Points
    points.forEach((p, i) => {
      const px = toCanvasX(p.x);
      const py = toCanvasY(p.y);
      const clusterIdx = assignments[i];

      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = (clusterIdx !== undefined && clusterIdx < k)
        ? FLAT_COLORS[clusterIdx % FLAT_COLORS.length]
        : '#000000';
      ctx.fill();
    });

    // Draw Centroids
    displayedCentroids.forEach((c, idx) => {
      if (idx >= k) return;
      const cx = toCanvasX(c.x);
      const cy = toCanvasY(c.y);
      const size = 12;

      ctx.fillStyle = FLAT_COLORS[idx % FLAT_COLORS.length];
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.fillRect(cx - size / 2, cy - size / 2, size, size);
      ctx.strokeRect(cx - size / 2, cy - size / 2, size, size);

      ctx.fillStyle = '#000000';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`K${idx + 1}`, cx, cy - size / 2 - 3);
    });
  };

  // Training Inertia Loss History Plot
  const renderInertiaPlot = ({ ctx, dimensions }) => {
    if (!ctx) return;
    const { width, height } = dimensions;
    const margin = 35;
    const plotW = width - margin * 2;
    const plotH = height - margin * 2;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, height - margin);
    ctx.lineTo(width - margin, height - margin);
    ctx.stroke();

    ctx.fillStyle = '#000000';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Iteration Step', width / 2, height - 5);

    ctx.save();
    ctx.translate(12, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('Inertia (WCSS)', 0, 0);
    ctx.restore();

    if (inertiaHistory.length === 0) {
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'center';
      ctx.fillText('Run K-Means to plot WCSS convergence curve', width / 2, height / 2);
      return;
    }

    const maxInertia = Math.max(0.1, Math.max(...inertiaHistory));
    const toX = (i) => margin + (i / Math.max(1, inertiaHistory.length - 1)) * plotW;
    const toY = (val) => height - margin - (val / maxInertia) * plotH;

    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    inertiaHistory.forEach((val, idx) => {
      const ix = toX(idx);
      const iy = toY(val);
      if (idx === 0) ctx.moveTo(ix, iy);
      else ctx.lineTo(ix, iy);
    });
    ctx.stroke();
  };

  // Compute cluster point counts for cluster breakdown visualization
  const clusterCounts = Array.from({ length: k }, (_, idx) => {
    return assignments.filter(a => a === idx).length;
  });

  return (
    <div className="space-y-6">
      {/* One-Line Reminder */}
      <div className="text-xs text-slate-600 bg-slate-50 p-2.5 border border-slate-300 rounded-sm font-mono">
        💡 Adjust $K$ clusters (2..15), then click <strong>Run K-Means</strong> to watch centroids slide to cluster means.
      </div>

      {/* Main Plots Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between text-xs font-mono font-bold mb-2">
            <span>Cluster Scatter & Centroid Path Trails</span>
            <span>Clusters (k): {k}</span>
          </div>
          <Canvas onCanvasClick={handleCanvasClick} aspectRatio={1.2}>
            {renderScatterPlot}
          </Canvas>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs font-mono font-bold mb-2">
            <span>Training Convergence (WCSS vs Step)</span>
            <span className="text-blue-600">WCSS: {currentInertia.toFixed(4)}</span>
          </div>
          <Canvas aspectRatio={1.2}>
            {renderInertiaPlot}
          </Canvas>
        </div>
      </div>

      {/* Cluster Size Breakdown Bar Chart Visualization */}
      <div className="bg-white p-4 border border-slate-900 rounded-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2">
          <span>Cluster Distribution Breakdown ({k} Clusters)</span>
          <span className="font-mono text-slate-500 font-normal">{points.length} total data points</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-2 font-mono text-xs">
          {clusterCounts.map((count, idx) => {
            const color = FLAT_COLORS[idx % FLAT_COLORS.length];
            const pct = points.length > 0 ? ((count / points.length) * 100).toFixed(1) : 0;

            return (
              <div key={idx} className="p-2 border border-slate-300 rounded-sm flex flex-col items-center bg-slate-50">
                <div className="flex items-center gap-1.5 font-bold mb-1" style={{ color }}>
                  <span className="w-3 h-3 inline-block border border-slate-900" style={{ backgroundColor: color }} />
                  <span>K{idx + 1}</span>
                </div>
                <span className="text-slate-900 font-extrabold">{count} pts</span>
                <span className="text-[10px] text-slate-500">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Numeric Input Fields Section */}
      <div className="bg-slate-50 p-4 border border-slate-300 rounded-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2">
          Numeric Input Fields & Parameters (2 to 15 Clusters)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="font-mono font-semibold block mb-1">Clusters (k)</label>
            <input
              type="number"
              min="2"
              max="15"
              value={k}
              onChange={(e) => handleKChange(parseInt(e.target.value) || 2)}
              className="w-full px-2 py-1 bg-white border border-slate-900 font-mono text-xs"
            />
          </div>

          <div>
            <label className="font-mono font-semibold block mb-1">Random Point Count</label>
            <input
              type="number"
              step="10"
              min="20"
              max="300"
              value={pointCount}
              onChange={(e) => setPointCount(parseInt(e.target.value) || 50)}
              className="w-full px-2 py-1 bg-white border border-slate-900 font-mono text-xs"
            />
          </div>

          <div>
            <label className="font-mono font-semibold block mb-1">Iterations</label>
            <input
              type="text"
              readOnly
              value={iterations}
              className="w-full px-2 py-1 bg-slate-100 border border-slate-300 font-mono text-xs font-bold"
            />
          </div>

          <div>
            <label className="font-mono font-semibold block mb-1">Status</label>
            <input
              type="text"
              readOnly
              value={isConverged ? 'CONVERGED' : isRunning ? 'RUNNING' : 'READY'}
              className={`w-full px-2 py-1 border font-mono text-xs font-bold ${isConverged ? 'bg-green-100 border-green-600 text-green-800' : 'bg-slate-100 border-slate-300 text-slate-800'}`}
            />
          </div>
        </div>

        {/* Manual Point Input Form */}
        <form onSubmit={handleAddManualPoint} className="pt-2 border-t border-slate-200 flex flex-wrap items-center gap-3 text-xs">
          <span className="font-mono font-bold">Manual Point Input:</span>
          <div className="flex items-center gap-1 font-mono">
            <span>X:</span>
            <input
              type="number"
              step="0.05"
              min="0"
              max="1"
              value={customX}
              onChange={(e) => setCustomX(e.target.value)}
              className="w-16 px-2 py-1 bg-white border border-slate-900"
            />
          </div>

          <div className="flex items-center gap-1 font-mono">
            <span>Y:</span>
            <input
              type="number"
              step="0.05"
              min="0"
              max="1"
              value={customY}
              onChange={(e) => setCustomY(e.target.value)}
              className="w-16 px-2 py-1 bg-white border border-slate-900"
            />
          </div>

          <Button type="submit" variant="secondary" size="sm">
            Add Point
          </Button>

          <Button type="button" variant="outline" size="sm" onClick={() => handleReset(k, pointCount)}>
            Regenerate Data
          </Button>
        </form>
      </div>

      {/* Main Controls & Before/After Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <Slider
          label="Clusters (k) Slider (Up to 15)"
          min={2}
          max={15}
          step={1}
          value={k}
          onChange={handleKChange}
        />

        <div className="flex items-center gap-3">
          <Button
            variant={isRunning ? 'secondary' : 'primary'}
            onClick={() => setIsRunning(!isRunning)}
            disabled={isConverged}
          >
            {isRunning ? 'Pause' : 'Run K-Means'}
          </Button>

          <Button variant="outline" onClick={handleSingleStep} disabled={isRunning || isConverged}>
            Step
          </Button>

          <Button variant="danger" onClick={() => handleReset(k, pointCount)}>
            Reset
          </Button>
        </div>

        <div className="flex items-center justify-end gap-3">
          <BeforeAfterThumbnail type="kmeans" />
        </div>
      </div>
    </div>
  );
};

export default Visualization;
