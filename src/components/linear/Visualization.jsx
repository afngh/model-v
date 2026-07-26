import React, { useState, useEffect, useRef, useCallback } from 'react';
import Canvas from '../Canvas';
import Slider from '../Slider';
import Button from '../Button';
import BeforeAfterThumbnail from '../diagrams/BeforeAfterThumbnail';
import { stepGradientDescent, calculateMSE, predict } from '../../utils/linearRegression';

// Fixed, well-spaced deterministic points with distinct visual distance across canvas
const FIXED_DEFAULT_POINTS = [
  { x: 0.08, y: 0.15 },
  { x: 0.18, y: 0.32 },
  { x: 0.26, y: 0.22 },
  { x: 0.34, y: 0.44 },
  { x: 0.44, y: 0.35 },
  { x: 0.52, y: 0.62 },
  { x: 0.62, y: 0.51 },
  { x: 0.72, y: 0.76 },
  { x: 0.82, y: 0.68 },
  { x: 0.92, y: 0.88 }
];

// Fixed starting weights & optimal learning rate
const FIXED_INITIAL_M = 0.25;
const FIXED_INITIAL_B = 0.20;
const DEFAULT_LEARNING_RATE = 0.18;
const DEFAULT_MAX_ITERATIONS = 50;

const Visualization = () => {
  // Points in normalized space [0, 1]
  const [points, setPoints] = useState(FIXED_DEFAULT_POINTS);

  const [m, setM] = useState(FIXED_INITIAL_M);
  const [b, setB] = useState(FIXED_INITIAL_B);
  const [learningRate, setLearningRate] = useState(DEFAULT_LEARNING_RATE);
  const [maxIterations, setMaxIterations] = useState(DEFAULT_MAX_ITERATIONS);
  const [isRunning, setIsRunning] = useState(false);
  const [iterations, setIterations] = useState(0);

  // Training Loss History Array for training visualization
  const [lossHistory, setLossHistory] = useState([]);

  // Manual input fields state
  const [customX, setCustomX] = useState('0.50');
  const [customY, setCustomY] = useState('0.50');

  const pointsRef = useRef(points);
  const mRef = useRef(m);
  const bRef = useRef(b);
  const lrRef = useRef(learningRate);
  const maxIterRef = useRef(maxIterations);
  const isRunningRef = useRef(isRunning);
  const iterationsRef = useRef(iterations);
  const animFrameIdRef = useRef(null);

  useEffect(() => { pointsRef.current = points; }, [points]);
  useEffect(() => { mRef.current = m; }, [m]);
  useEffect(() => { bRef.current = b; }, [b]);
  useEffect(() => { lrRef.current = learningRate; }, [learningRate]);
  useEffect(() => { maxIterRef.current = maxIterations; }, [maxIterations]);
  useEffect(() => { isRunningRef.current = isRunning; }, [isRunning]);
  useEffect(() => { iterationsRef.current = iterations; }, [iterations]);

  const currentMSE = calculateMSE(points, m, b);
  const isConverged = iterations >= maxIterations;

  // Single step gradient descent execution
  const handleSingleStep = useCallback(() => {
    if (pointsRef.current.length === 0) return;
    if (iterationsRef.current >= maxIterRef.current) {
      setIsRunning(false);
      return;
    }

    const updated = stepGradientDescent(
      pointsRef.current,
      mRef.current,
      bRef.current,
      lrRef.current
    );
    const newM = updated.m;
    const newB = updated.b;
    const newMse = calculateMSE(pointsRef.current, newM, newB);

    mRef.current = newM;
    bRef.current = newB;
    setM(newM);
    setB(newB);
    const nextIter = iterationsRef.current + 1;
    setIterations(nextIter);
    setLossHistory(prev => [...prev.slice(-300), newMse]);

    if (nextIter >= maxIterRef.current) {
      setIsRunning(false);
    }
  }, []);

  // Multi-step gradient descent execution (runs chunk of steps per frame for high maxIterations up to 10k)
  const handleMultiSteps = useCallback((stepBatchCount = 1) => {
    if (pointsRef.current.length === 0) return;
    let curM = mRef.current;
    let curB = bRef.current;
    let curIter = iterationsRef.current;
    const newLosses = [];

    for (let s = 0; s < stepBatchCount; s++) {
      if (curIter >= maxIterRef.current) {
        setIsRunning(false);
        break;
      }
      const updated = stepGradientDescent(
        pointsRef.current,
        curM,
        curB,
        lrRef.current
      );
      curM = updated.m;
      curB = updated.b;
      curIter++;
      const newMse = calculateMSE(pointsRef.current, curM, curB);
      newLosses.push(newMse);
    }

    mRef.current = curM;
    bRef.current = curB;
    setM(curM);
    setB(curB);
    setIterations(curIter);
    setLossHistory(prev => [...prev.slice(-300), ...newLosses]);

    if (curIter >= maxIterRef.current) {
      setIsRunning(false);
    }
  }, []);

  // Animation Loop (Adaptive speed supporting up to 10,000 max iterations)
  useEffect(() => {
    let lastTime = 0;
    const loop = (timestamp) => {
      if (isRunningRef.current && pointsRef.current.length > 0 && iterationsRef.current < maxIterRef.current) {
        if (timestamp - lastTime > 25) {
          lastTime = timestamp;
          // Calculate adaptive batch size per frame based on maxIterations
          const stepsPerFrame = Math.max(1, Math.min(100, Math.ceil(maxIterRef.current / 200)));
          handleMultiSteps(stepsPerFrame);
        }
      } else if (iterationsRef.current >= maxIterRef.current && isRunningRef.current) {
        setIsRunning(false);
      }
      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [handleMultiSteps]);

  // Handle Canvas Mouse Clicks to add point
  const handleCanvasClick = ({ canvasX, canvasY, event }) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const margin = 40;
    const plotW = rect.width - margin * 2;
    const plotH = rect.height - margin * 2;

    const normX = Math.max(0, Math.min(1, (canvasX - margin) / plotW));
    const normY = Math.max(0, Math.min(1, 1 - (canvasY - margin) / plotH));
    setPoints(prev => [...prev, { x: parseFloat(normX.toFixed(3)), y: parseFloat(normY.toFixed(3)) }]);
  };

  // Add Point via Manual Input Fields
  const handleAddManualPoint = (e) => {
    e.preventDefault();
    const px = Math.max(0, Math.min(1, parseFloat(customX) || 0));
    const py = Math.max(0, Math.min(1, parseFloat(customY) || 0));
    setPoints(prev => [...prev, { x: px, y: py }]);
  };

  // Reset Model & Data to Fixed Defaults
  const handleReset = () => {
    setIsRunning(false);
    setPoints(FIXED_DEFAULT_POINTS);
    setM(FIXED_INITIAL_M);
    setB(FIXED_INITIAL_B);
    setLearningRate(DEFAULT_LEARNING_RATE);
    setIterations(0);
    setLossHistory([]);
  };

  // Load Fixed Sample Data & Reset Weights
  const handleGenerateSampleData = () => {
    setIsRunning(false);
    setPoints(FIXED_DEFAULT_POINTS);
    setM(FIXED_INITIAL_M);
    setB(FIXED_INITIAL_B);
    setIterations(0);
    setLossHistory([]);
  };

  // Main Scatter & Regression Line Canvas Plot
  const renderScatterPlot = ({ ctx, dimensions }) => {
    if (!ctx) return;
    const { width, height } = dimensions;

    const margin = 40;
    const plotW = width - margin * 2;
    const plotH = height - margin * 2;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
      const gx = margin + (plotW / 4) * i;
      const gy = margin + (plotH / 4) * i;
      ctx.beginPath(); ctx.moveTo(gx, margin); ctx.lineTo(gx, height - margin); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(margin, gy); ctx.lineTo(width - margin, gy); ctx.stroke();
    }

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
    ctx.textBaseline = 'top';
    for (let i = 0; i <= 4; i++) {
      const val = (i / 4).toFixed(1);
      const tx = margin + (plotW / 4) * i;
      ctx.fillText(val, tx, height - margin + 5);
    }
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= 4; i++) {
      const val = (i / 4).toFixed(1);
      const ty = height - margin - (plotH / 4) * i;
      ctx.fillText(val, margin - 5, ty);
    }

    const toCanvasX = (nx) => margin + nx * plotW;
    const toCanvasY = (ny) => height - margin - ny * plotH;

    // Residual Lines
    if (points.length > 0) {
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      points.forEach(p => {
        const px = toCanvasX(p.x);
        const py = toCanvasY(p.y);
        const yPred = predict(p.x, m, b);
        const predPy = toCanvasY(yPred);

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px, predPy);
        ctx.stroke();
      });
      ctx.setLineDash([]);
    }

    // Regression Line (Red)
    const y0 = predict(0, m, b);
    const y1 = predict(1, m, b);
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(toCanvasX(0), toCanvasY(y0));
    ctx.lineTo(toCanvasX(1), toCanvasY(y1));
    ctx.stroke();

    // Scatter Points (Black dots with distinct visual spacing)
    points.forEach(p => {
      const px = toCanvasX(p.x);
      const py = toCanvasY(p.y);

      ctx.beginPath();
      ctx.arc(px, py, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#000000';
      ctx.fill();
    });
  };

  // Training Loss Curve Chart (MSE vs Iteration)
  const renderLossPlot = ({ ctx, dimensions }) => {
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
    ctx.fillText('MSE Loss', 0, 0);
    ctx.restore();

    if (lossHistory.length === 0) {
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'center';
      ctx.fillText('Run Gradient Descent to plot training loss curve', width / 2, height / 2);
      return;
    }

    const maxLoss = Math.max(0.1, Math.max(...lossHistory));
    const toLossX = (i) => margin + (i / Math.max(1, lossHistory.length - 1)) * plotW;
    const toLossY = (loss) => height - margin - (loss / maxLoss) * plotH;

    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    lossHistory.forEach((l, idx) => {
      const lx = toLossX(idx);
      const ly = toLossY(l);
      if (idx === 0) ctx.moveTo(lx, ly);
      else ctx.lineTo(lx, ly);
    });
    ctx.stroke();
  };

  return (
    <div className="space-y-6">
      {/* One-Line Reminder */}
      <div className="text-xs text-slate-600 bg-slate-50 p-2.5 border border-slate-300 rounded-sm font-mono">
        💡 Click on the canvas to place points, then click <strong>Run Gradient Descent</strong> to observe model fitting (up to {maxIterations.toLocaleString()} iterations).
      </div>

      {/* Main Plots Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between text-xs font-mono font-bold mb-2">
            <span>Scatter Plot & Regression Line</span>
            <span>ŷ = {m.toFixed(3)}x + {b.toFixed(3)}</span>
          </div>
          <Canvas onCanvasClick={handleCanvasClick} aspectRatio={1.2}>
            {renderScatterPlot}
          </Canvas>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs font-mono font-bold mb-2">
            <span>Training Loss Curve (MSE vs Step)</span>
            <span className="text-red-600">MSE: {currentMSE.toFixed(5)}</span>
          </div>
          <Canvas aspectRatio={1.2}>
            {renderLossPlot}
          </Canvas>
        </div>
      </div>

      {/* Numeric Input Fields Section */}
      <div className="bg-slate-50 p-4 border border-slate-300 rounded-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2">
          Numeric Input Fields & Hyperparameters (Up to 10,000 Iterations)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 text-xs">
          <div>
            <label className="font-mono font-semibold block mb-1">Learning Rate (α)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max="0.5"
              value={learningRate}
              onChange={(e) => setLearningRate(Math.max(0.01, Math.min(0.5, parseFloat(e.target.value) || 0.01)))}
              className="w-full px-2 py-1 bg-white border border-slate-900 font-mono text-xs"
            />
          </div>

          <div>
            <label className="font-mono font-semibold block mb-1">Iterations</label>
            <input
              type="number"
              step="50"
              min="5"
              max="10000"
              value={maxIterations}
              onChange={(e) => setMaxIterations(Math.max(5, Math.min(10000, parseInt(e.target.value) || 50)))}
              className="w-full px-2 py-1 bg-white border border-slate-900 font-mono text-xs font-bold"
            />
          </div>

          <div>
            <label className="font-mono font-semibold block mb-1">Initial Slope (m)</label>
            <input
              type="number"
              step="0.05"
              value={m}
              onChange={(e) => setM(parseFloat(e.target.value) || 0)}
              disabled={isRunning}
              className="w-full px-2 py-1 bg-white border border-slate-900 font-mono text-xs"
            />
          </div>

          <div>
            <label className="font-mono font-semibold block mb-1">Initial Intercept (b)</label>
            <input
              type="number"
              step="0.05"
              value={b}
              onChange={(e) => setB(parseFloat(e.target.value) || 0)}
              disabled={isRunning}
              className="w-full px-2 py-1 bg-white border border-slate-900 font-mono text-xs"
            />
          </div>

          <div>
            <label className="font-mono font-semibold block mb-1">Status</label>
            <input
              type="text"
              readOnly
              value={isConverged ? `CONVERGED (${iterations}/${maxIterations})` : isRunning ? `RUNNING (${iterations}/${maxIterations})` : `READY (${iterations}/${maxIterations})`}
              className={`w-full px-2 py-1 border font-mono text-xs font-bold ${isConverged ? 'bg-green-100 border-green-600 text-green-800' : 'bg-slate-100 border-slate-300 text-slate-800'}`}
            />
          </div>
        </div>

        {/* Manual Data Point Addition Form */}
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

          <Button type="button" variant="outline" size="sm" onClick={handleGenerateSampleData}>
            Fixed Sample Data
          </Button>
        </form>
      </div>

      {/* Main Action Buttons & Before/After Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <Slider
          label="Learning Rate Slider"
          min={0.01}
          max={0.5}
          step={0.01}
          value={learningRate}
          onChange={setLearningRate}
          formatValue={(v) => v.toFixed(2)}
        />

        <div className="flex items-center gap-3">
          <Button
            variant={isRunning ? 'secondary' : 'primary'}
            onClick={() => {
              if (isConverged) {
                setIterations(0);
                setLossHistory([]);
              }
              setIsRunning(!isRunning);
            }}
            disabled={points.length === 0}
          >
            {isRunning ? 'Pause' : isConverged ? 'Restart' : 'Run Gradient Descent'}
          </Button>

          <Button variant="outline" onClick={handleSingleStep} disabled={isRunning || isConverged || points.length === 0}>
            Step
          </Button>

          <Button variant="danger" onClick={handleReset}>
            Reset
          </Button>
        </div>

        <div className="flex items-center justify-end gap-3">
          <BeforeAfterThumbnail type="linear" />
        </div>
      </div>
    </div>
  );
};

export default Visualization;
