import React, { useState, useEffect, useRef } from 'react';
import Canvas from '../Canvas';
import Slider from '../Slider';
import Button from '../Button';
import BeforeAfterThumbnail from '../diagrams/BeforeAfterThumbnail';
import {
  GRID_SIZE,
  ACTIONS,
  CELL_TYPES,
  createDefaultGrid,
  createQTable,
  trainQTable,
  extractOptimalPath
} from '../../utils/gridworld';

const Visualization = () => {
  const [grid, setGrid] = useState(createDefaultGrid);
  const [episodes, setEpisodes] = useState(1000);
  const [alpha, setAlpha] = useState(0.25);
  const [gamma, setGamma] = useState(0.95);
  const [epsilon, setEpsilon] = useState(0.3);

  const [qTable, setQTable] = useState(createQTable);
  const [stepHistory, setStepHistory] = useState([]);
  const [rewardHistory, setRewardHistory] = useState([]);
  const [metricMode, setMetricMode] = useState('steps');

  const [isTraining, setIsTraining] = useState(false);
  const [isLiveTraining, setIsLiveTraining] = useState(false);
  const [isTrained, setIsTrained] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(true);

  // Live Agent position state
  const [liveAgentPos, setLiveAgentPos] = useState({ r: 0, c: 0 });
  const [currentEpisodeNum, setCurrentEpisodeNum] = useState(0);

  // Optimal path playback state
  const [optimalPath, setOptimalPath] = useState([]);
  const [agentStep, setAgentStep] = useState(0);
  const [isAnimatingAgent, setIsAnimatingAgent] = useState(false);

  // Refs for animation loop stability
  const gridRef = useRef(grid);
  const qTableRef = useRef(qTable);
  const alphaRef = useRef(alpha);
  const gammaRef = useRef(gamma);
  const epsilonRef = useRef(epsilon);
  const episodesRef = useRef(episodes);
  const isLiveTrainingRef = useRef(isLiveTraining);

  useEffect(() => { gridRef.current = grid; }, [grid]);
  useEffect(() => { qTableRef.current = qTable; }, [qTable]);
  useEffect(() => { alphaRef.current = alpha; }, [alpha]);
  useEffect(() => { gammaRef.current = gamma; }, [gamma]);
  useEffect(() => { epsilonRef.current = epsilon; }, [epsilon]);
  useEffect(() => { episodesRef.current = episodes; }, [episodes]);
  useEffect(() => { isLiveTrainingRef.current = isLiveTraining; }, [isLiveTraining]);

  // Toggle hazard on cell click
  const handleCellClick = (r, c) => {
    if (isTraining || isLiveTraining || isAnimatingAgent) return;
    const currentType = grid[r][c];
    if (currentType === CELL_TYPES.START || currentType === CELL_TYPES.GOAL) return;

    const newGrid = grid.map((rowArr, ri) =>
      rowArr.map((cell, ci) => {
        if (ri === r && ci === c) {
          return cell === CELL_TYPES.HAZARD ? CELL_TYPES.EMPTY : CELL_TYPES.HAZARD;
        }
        return cell;
      })
    );

    setGrid(newGrid);
    setIsTrained(false);
    setOptimalPath([]);
    setAgentStep(0);
  };

  // Fast Background Training (calls trainQTable with Exploring Starts)
  const handleFastTrain = () => {
    setIsTraining(true);
    setIsLiveTraining(false);
    setIsAnimatingAgent(false);
    setAgentStep(0);

    setTimeout(() => {
      const { qTable: trainedQ, stepHistory: sHist, rewardHistory: rHist } = trainQTable(
        grid,
        episodes,
        alpha,
        gamma,
        epsilon
      );

      setQTable(trainedQ);
      setStepHistory(sHist);
      setRewardHistory(rHist);

      const path = extractOptimalPath(trainedQ, grid);
      setOptimalPath(path);
      setIsTrained(true);
      setIsTraining(false);
    }, 50);
  };

  // Animated Step-by-Step Live Training Loop (with Exploring Starts)
  useEffect(() => {
    if (!isLiveTraining) return;

    let startR = 0, startC = 0;
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (gridRef.current[r][c] === CELL_TYPES.START) { startR = r; startC = c; }
      }
    }

    let r = startR;
    let c = startC;
    let epSteps = 0;
    let epReward = 0;
    let epCount = 1;

    setLiveAgentPos({ r, c });
    setCurrentEpisodeNum(1);

    const interval = setInterval(() => {
      if (!isLiveTrainingRef.current || epCount > episodesRef.current) {
        setIsLiveTraining(false);
        const path = extractOptimalPath(qTableRef.current, gridRef.current);
        setOptimalPath(path);
        setIsTrained(true);
        clearInterval(interval);
        return;
      }

      epSteps++;
      const curEps = Math.max(0.02, epsilonRef.current * (1 - (epCount / episodesRef.current) * 0.85));
      const q = { ...qTableRef.current };
      const stateKey = `${r},${c}`;

      const validActions = [];
      for (let a = 0; a < 4; a++) {
        const nr = r + ACTIONS[a].dr, nc = c + ACTIONS[a].dc;
        if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) validActions.push(a);
      }

      let actionIdx = validActions[0] || 0;
      if (Math.random() < curEps) {
        actionIdx = validActions[Math.floor(Math.random() * validActions.length)];
      } else {
        const qVals = q[stateKey] || [0, 0, 0, 0];
        let maxV = -Infinity;
        let bests = [];
        validActions.forEach(a => {
          if (qVals[a] > maxV) { maxV = qVals[a]; bests = [a]; }
          else if (qVals[a] === maxV) { bests.push(a); }
        });
        actionIdx = bests[Math.floor(Math.random() * bests.length)];
      }

      const action = ACTIONS[actionIdx];
      let nextR = r + action.dr, nextC = c + action.dc;
      if (nextR < 0 || nextR >= GRID_SIZE || nextC < 0 || nextC >= GRID_SIZE) {
        nextR = r; nextC = c;
      }

      const cellType = gridRef.current[nextR][nextC];
      let reward = -1;
      let done = false;

      if (cellType === CELL_TYPES.GOAL) { reward = 100; done = true; }
      else if (cellType === CELL_TYPES.HAZARD) { reward = -50; done = true; }
      else if (epSteps >= 80) { done = true; }

      epReward += reward;

      const nextKey = `${nextR},${nextC}`;
      const maxNextQ = done ? 0 : Math.max(...(q[nextKey] || [0, 0, 0, 0]));
      q[stateKey][actionIdx] += alphaRef.current * (reward + gammaRef.current * maxNextQ - q[stateKey][actionIdx]);

      setQTable(q);
      qTableRef.current = q;
      r = nextR;
      c = nextC;
      setLiveAgentPos({ r, c });

      if (done) {
        setStepHistory(prev => [...prev, epSteps]);
        setRewardHistory(prev => [...prev, epReward]);

        epCount++;
        setCurrentEpisodeNum(epCount);
        epSteps = 0;
        epReward = 0;

        // 40% chance of Exploring Start to populate Q-values across full grid
        if (Math.random() < 0.4) {
          let randR = Math.floor(Math.random() * GRID_SIZE);
          let randC = Math.floor(Math.random() * GRID_SIZE);
          if (gridRef.current[randR][randC] !== CELL_TYPES.HAZARD && gridRef.current[randR][randC] !== CELL_TYPES.GOAL) {
            r = randR;
            c = randC;
          } else {
            r = startR; c = startC;
          }
        } else {
          r = startR; c = startC;
        }

        setLiveAgentPos({ r, c });
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isLiveTraining]);

  // Animate Learned Optimal Agent Path
  const handleAnimateAgent = () => {
    if (optimalPath.length === 0) return;
    setIsAnimatingAgent(true);
    setAgentStep(0);
  };

  useEffect(() => {
    if (!isAnimatingAgent || optimalPath.length === 0) return;

    const interval = setInterval(() => {
      setAgentStep(prev => {
        if (prev + 1 >= optimalPath.length) {
          setIsAnimatingAgent(false);
          return prev;
        }
        return prev + 1;
      });
    }, 220);

    return () => clearInterval(interval);
  }, [isAnimatingAgent, optimalPath]);

  // Reset Grid & Training
  const handleReset = () => {
    setIsTraining(false);
    setIsLiveTraining(false);
    setIsTrained(false);
    setIsAnimatingAgent(false);
    const newGrid = createDefaultGrid();
    setGrid(newGrid);
    setQTable(createQTable());
    setStepHistory([]);
    setRewardHistory([]);
    setOptimalPath([]);
    setAgentStep(0);
  };

  const getCellQValue = (r, c) => {
    const qValues = qTable[`${r},${c}`] || [0, 0, 0, 0];
    return Math.max(...qValues);
  };

  let maxQVal = 1;
  if (showHeatmap) {
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const val = getCellQValue(r, c);
        if (val > maxQVal) maxQVal = val;
      }
    }
  }

  // Draw Training Performance Plot
  const renderLinePlot = ({ ctx, dimensions }) => {
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

    ctx.fillStyle = '#000000';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Episodes', width / 2, height - 5);

    ctx.save();
    ctx.translate(12, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText(metricMode === 'steps' ? 'Steps to Goal' : 'Total Reward', 0, 0);
    ctx.restore();

    const history = metricMode === 'steps' ? stepHistory : rewardHistory;

    if (history.length === 0) {
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'center';
      ctx.fillText('Run Training to plot real-time performance curve', width / 2, height / 2);
      return;
    }

    const sampleRate = Math.max(1, Math.floor(history.length / 100));
    const data = [];
    for (let i = 0; i < history.length; i += sampleRate) {
      data.push({ x: i, y: history[i] });
    }

    const maxVal = Math.max(1, Math.max(...data.map(d => d.y)));
    const minVal = Math.min(0, Math.min(...data.map(d => d.y)));
    const range = Math.max(1, maxVal - minVal);

    const toCanvasX = (ep) => margin + (ep / Math.max(1, history.length - 1)) * plotW;
    const toCanvasY = (val) => height - margin - ((val - minVal) / range) * plotH;

    ctx.strokeStyle = metricMode === 'steps' ? '#000000' : '#16a34a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    data.forEach((pt, i) => {
      const px = toCanvasX(pt.x);
      const py = toCanvasY(pt.y);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();
  };

  const currentPathAgentPos = (optimalPath.length > 0 && isAnimatingAgent)
    ? optimalPath[agentStep]
    : null;

  return (
    <div className="space-y-6">
      {/* One-Line Reminder */}
      <div className="text-xs text-slate-600 bg-slate-50 p-2.5 border border-slate-300 rounded-sm font-mono">
        💡 Click cells to toggle hazard obstacles, then click <strong>Live Train (Animated)</strong> to watch Q-learning in action.
      </div>

      {/* Main Grid & Chart Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 8x8 Gridboard with Responsive Overflow Wrapper */}
        <div className="flex flex-col items-center justify-center max-w-full overflow-x-auto p-1">
          <div className="inline-grid grid-cols-8 gap-1 p-2 bg-white border border-slate-900 shadow-sm select-none">
            {grid.map((rowArr, r) =>
              rowArr.map((cellType, c) => {
                const isStart = cellType === CELL_TYPES.START;
                const isGoal = cellType === CELL_TYPES.GOAL;
                const isHazard = cellType === CELL_TYPES.HAZARD;

                const isPathAgentHere = currentPathAgentPos && currentPathAgentPos.r === r && currentPathAgentPos.c === c;
                const isLiveAgentHere = isLiveTraining && liveAgentPos.r === r && liveAgentPos.c === c;
                const isInPath = isTrained && optimalPath.some(p => p.r === r && p.c === c);

                let bgStyle = {};
                if (showHeatmap && !isStart && !isGoal && !isHazard) {
                  const qVal = getCellQValue(r, c);
                  const normalized = Math.max(0, Math.min(1, qVal / maxQVal));
                  const shade = Math.floor(255 - normalized * 180);
                  bgStyle = { backgroundColor: `rgb(${shade}, ${shade}, ${shade})` };
                }

                return (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    style={bgStyle}
                    className={`
                      w-8 h-8 sm:w-10 sm:h-10 border text-[9px] sm:text-[10px] font-mono flex items-center justify-center cursor-pointer transition-colors relative
                      ${isStart ? 'bg-emerald-100 border-emerald-600 text-emerald-800 font-bold' : ''}
                      ${isGoal ? 'bg-amber-100 border-amber-600 text-amber-800 font-bold' : ''}
                      ${isHazard ? 'bg-red-100 border-red-600 text-red-800 font-bold' : ''}
                      ${!isStart && !isGoal && !isHazard && !showHeatmap ? 'bg-white border-slate-300 hover:bg-slate-50' : ''}
                      ${isInPath && !isStart && !isGoal && !isHazard && !showHeatmap ? 'border-blue-500 font-bold text-blue-600' : ''}
                    `}
                  >
                    {isStart && 'START'}
                    {isGoal && 'GOAL'}
                    {isHazard && 'HAZARD'}

                    {(isPathAgentHere || isLiveAgentHere) && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-slate-900 shadow ${isLiveAgentHere ? 'bg-amber-500 animate-pulse' : 'bg-blue-600'}`} />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-2 text-[11px] text-slate-500 font-mono flex gap-4">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-200 border border-emerald-600 inline-block" /> Start</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-200 border border-amber-600 inline-block" /> Goal</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-red-200 border border-red-600 inline-block" /> Hazard</span>
          </div>
        </div>

        {/* Training Performance Plot */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
            <span>Training Performance Curve</span>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <button
                onClick={() => setMetricMode('steps')}
                className={`px-1.5 py-0.5 border ${metricMode === 'steps' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'}`}
              >
                Steps
              </button>
              <button
                onClick={() => setMetricMode('reward')}
                className={`px-1.5 py-0.5 border ${metricMode === 'reward' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'}`}
              >
                Reward
              </button>
            </div>
          </div>
          <Canvas aspectRatio={1.2} className="flex-1">
            {renderLinePlot}
          </Canvas>
        </div>
      </div>

      {/* Numeric Input Fields Section */}
      <div className="bg-slate-50 p-4 border border-slate-300 rounded-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2">
          Numeric Input Fields & Hyperparameters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="font-mono font-semibold block mb-1">Episodes</label>
            <input
              type="number"
              step="50"
              min="50"
              max="2000"
              value={episodes}
              onChange={(e) => setEpisodes(parseInt(e.target.value) || 50)}
              className="w-full px-2 py-1 bg-white border border-slate-900 font-mono text-xs"
            />
          </div>

          <div>
            <label className="font-mono font-semibold block mb-1">Learning Rate (α)</label>
            <input
              type="number"
              step="0.05"
              min="0.01"
              max="1.0"
              value={alpha}
              onChange={(e) => setAlpha(parseFloat(e.target.value) || 0.1)}
              className="w-full px-2 py-1 bg-white border border-slate-900 font-mono text-xs"
            />
          </div>

          <div>
            <label className="font-mono font-semibold block mb-1">Discount Factor (γ)</label>
            <input
              type="number"
              step="0.05"
              min="0.1"
              max="0.99"
              value={gamma}
              onChange={(e) => setGamma(parseFloat(e.target.value) || 0.9)}
              className="w-full px-2 py-1 bg-white border border-slate-900 font-mono text-xs"
            />
          </div>

          <div>
            <label className="font-mono font-semibold block mb-1">Initial Exploration (ε)</label>
            <input
              type="number"
              step="0.05"
              min="0.0"
              max="1.0"
              value={epsilon}
              onChange={(e) => setEpsilon(parseFloat(e.target.value) || 0.2)}
              className="w-full px-2 py-1 bg-white border border-slate-900 font-mono text-xs"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div>
            Episode Progress: <strong>{isLiveTraining ? `${currentEpisodeNum} / ${episodes}` : `${stepHistory.length} / ${episodes}`}</strong>
          </div>
          <label className="flex items-center gap-2 text-slate-700 font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={showHeatmap}
              onChange={(e) => setShowHeatmap(e.target.checked)}
              className="accent-slate-900"
            />
            <span>Show Grayscale Q-Heatmap</span>
          </label>
        </div>
      </div>

      {/* Main Controls & Before/After Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <Slider
          label="Episodes Slider"
          min={50}
          max={2000}
          step={50}
          value={episodes}
          onChange={setEpisodes}
        />

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={isLiveTraining ? 'secondary' : 'primary'}
            onClick={() => setIsLiveTraining(!isLiveTraining)}
            disabled={isTraining}
          >
            {isLiveTraining ? 'Pause Live' : 'Live Train (Animated)'}
          </Button>

          <Button
            variant="outline"
            onClick={handleFastTrain}
            disabled={isTraining || isLiveTraining}
          >
            Fast Train
          </Button>

          <Button
            variant="secondary"
            onClick={handleAnimateAgent}
            disabled={!isTrained || optimalPath.length === 0 || isAnimatingAgent}
          >
            Animate Path
          </Button>

          <Button variant="danger" onClick={handleReset}>
            Reset
          </Button>
        </div>

        <div className="flex items-center justify-end gap-3">
          <BeforeAfterThumbnail type="gridworld" />
        </div>
      </div>
    </div>
  );
};

export default Visualization;
