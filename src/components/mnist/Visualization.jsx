import React, { useState, useRef, useEffect } from 'react';
import Button from '../Button';
import CNN3DScene from './CNN3DScene';
import { downsampleCanvas } from '../../utils/mnistModel';
import { predictDigit } from '../../utils/mnistInference';

// 6 Discrete Teacher-Controlled Playback Stage Captions
const STAGE_CAPTIONS = [
  {
    step: 1,
    title: 'Input Grid',
    caption: 'Raw 28x28 pixel grayscale values are loaded onto the tilted 3D input grid card.'
  },
  {
    step: 2,
    title: 'Convolution + Pooling',
    caption: 'Small convolutional filters scan the image to detect edges and shapes, producing stacked 3D feature map volumes.'
  },
  {
    step: 3,
    title: 'Flatten Ribbons',
    caption: '2D spatial feature maps are unrolled into parallel 1D ribbon vector strips.'
  },
  {
    step: 4,
    title: 'Dense Layer',
    caption: 'Fully-connected neurons combine high-level feature signals, lighting up strongly for matching digit patterns.'
  },
  {
    step: 5,
    title: 'Output Probabilities',
    caption: 'Softmax activation layer computes normalized probability scores across all 10 digit classes (0-9).'
  },
  {
    step: 6,
    title: 'Final Prediction',
    caption: 'The digit with the highest probability score is selected as the model\'s final classification prediction.'
  }
];

const Visualization = () => {
  const canvasRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  const [downsampledGrid, setDownsampledGrid] = useState(new Float32Array(784));
  const [predictions, setPredictions] = useState(null);
  const [pulseStep, setPulseStep] = useState(1); // Playback step 1 to 6
  const [isPlayingAll, setIsPlayingAll] = useState(false);

  // Initialize main 280x280 drawing canvas
  const initCanvas = (canvas) => {
    if (!canvas) return;
    canvasRef.current = canvas;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  // Step 6: Blown-up 2D preview thumbnail
  useEffect(() => {
    if (!previewCanvasRef.current) return;
    const pCtx = previewCanvasRef.current.getContext('2d');
    pCtx.imageSmoothingEnabled = true;
    pCtx.fillStyle = '#000000';
    pCtx.fillRect(0, 0, 80, 80);

    const imgData = pCtx.createImageData(80, 80);
    for (let r = 0; r < 80; r++) {
      for (let c = 0; c < 80; c++) {
        const gridR = Math.floor((r / 80) * 28);
        const gridC = Math.floor((c / 80) * 28);
        const val = downsampledGrid[gridR * 28 + gridC] || 0;
        const strokeVal = Math.floor(val * 255);
        const idx = (r * 80 + c) * 4;

        imgData.data[idx] = strokeVal;     // R
        imgData.data[idx + 1] = strokeVal; // G
        imgData.data[idx + 2] = strokeVal; // B
        imgData.data[idx + 3] = 255;       // A
      }
    }
    pCtx.putImageData(imgData, 0, 0);
  }, [downsampledGrid]);

  const handleClear = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    setDownsampledGrid(new Float32Array(784));
    setPredictions(null);
    setPulseStep(1);
    setIsPlayingAll(false);
  };

  // Drawing Event Handlers
  const startDrawing = (e) => {
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    setLastPos({ x, y });
  };

  const draw = (e) => {
    if (!isDrawing || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    const ctx = canvasRef.current.getContext('2d');
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    setLastPos({ x, y });
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (canvasRef.current) {
      const pixels = downsampleCanvas(canvasRef.current);
      setDownsampledGrid(pixels);
    }
  };

  // Reset to Step 1 & compute prediction
  const handlePredict = () => {
    if (!canvasRef.current) return;
    const pixels = downsampleCanvas(canvasRef.current);
    setDownsampledGrid(pixels);

    const result = predictDigit(pixels);
    setPredictions(result);
    setPulseStep(1);
    setIsPlayingAll(false);
  };

  // Play All Auto-Advance Loop (~1.2s pause per step)
  useEffect(() => {
    if (!isPlayingAll) return;

    const interval = setInterval(() => {
      setPulseStep(prev => {
        if (prev >= 6) {
          setIsPlayingAll(false);
          return 6;
        }
        return prev + 1;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isPlayingAll]);

  // Step Controls Handlers
  const handlePrevStep = () => {
    setIsPlayingAll(false);
    setPulseStep(prev => Math.max(1, prev - 1));
  };

  const handleNextStep = () => {
    setIsPlayingAll(false);
    setPulseStep(prev => Math.min(6, prev + 1));
  };

  const currentStageInfo = STAGE_CAPTIONS[(pulseStep || 1) - 1] || STAGE_CAPTIONS[0];

  return (
    <div className="space-y-6">
      {/* One-Line Reminder */}
      <div className="text-xs text-slate-600 bg-slate-50 p-2.5 border border-slate-300 rounded-sm font-mono">
        ✏️ Draw a digit on the canvas below, then use the <strong>Teacher Playback Controls</strong> to step through the 6 CNN stages at your own pace!
      </div>

      {/* Main Interactive Layout: Drawing Canvas on Left, Three.js 3D Black Scene on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Drawing Canvas (280x280) */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <div className="flex items-center justify-between w-full max-w-[260px] text-xs font-mono font-bold mb-2">
            <span>Draw Digit (280x280)</span>
            <Button size="sm" variant="outline" onClick={handleClear}>
              Clear
            </Button>
          </div>

          <div className="border-2 border-slate-900 shadow-sm bg-white cursor-crosshair">
            <canvas
              ref={(node) => {
                if (node && !canvasRef.current) initCanvas(node);
              }}
              width={260}
              height={260}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="touch-pan-y block"
            />
          </div>

          <div className="mt-3 w-full max-w-[260px]">
            <Button variant="primary" className="w-full" onClick={handlePredict}>
              Predict & Reset to Step 1
            </Button>
          </div>
        </div>

        {/* Right Column: Embedded Adam Harley-Style 3D Scene + Playback Controls */}
        <div className="lg:col-span-8 bg-black border-2 border-slate-800 rounded-sm shadow-xl relative overflow-hidden flex flex-col">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-950 text-xs font-mono">
            <span className="text-white font-bold">Convolutional Neural Network (CNN) 3D Architecture</span>
            <span className="text-slate-500 text-[11px]">🖱️ Drag to Rotate 3D Scene</span>
          </div>

          {/* STEP 6: Input Digit Preview Box (Top-Right Inset Box) */}
          <div className="absolute top-10 right-4 z-10 bg-slate-950/90 border border-white p-2 rounded-sm text-center">
            <div className="text-[9px] font-mono text-slate-300 font-bold mb-1">Step 6: Digit Preview</div>
            <canvas
              ref={previewCanvasRef}
              width={80}
              height={80}
              className="w-16 h-16 block border border-slate-700 mx-auto"
            />
          </div>

          {/* Three.js 3D Harley-Style Scene */}
          <CNN3DScene
            pixels784={downsampledGrid}
            predictions={predictions}
            pulseStep={pulseStep}
          />

          {/* Teacher-Controlled Step-by-Step Playback Control Bar */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
              {/* Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevStep}
                  disabled={pulseStep <= 1}
                  className="px-3 py-1 bg-white text-slate-900 font-bold border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white"
                >
                  ◀ Previous Step
                </button>

                <button
                  onClick={handleNextStep}
                  disabled={pulseStep >= 6}
                  className="px-3 py-1 bg-white text-slate-900 font-bold border border-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white"
                >
                  Next Step ▶
                </button>

                <button
                  onClick={() => setIsPlayingAll(!isPlayingAll)}
                  className={`px-3 py-1 font-bold border ${isPlayingAll ? 'bg-amber-500 text-slate-900 border-amber-400' : 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700'}`}
                >
                  {isPlayingAll ? '⏸ Pause' : '▶ Play All'}
                </button>
              </div>

              {/* Step Indicator */}
              <div className="text-white font-bold bg-slate-900 px-3 py-1 border border-slate-700">
                Step {pulseStep} of 6: {currentStageInfo.title}
              </div>
            </div>

            {/* One-Sentence Plain Text Caption */}
            <div className="text-xs font-serif text-slate-300 bg-slate-900/80 p-2.5 border border-slate-800 leading-relaxed">
              <strong>Step {pulseStep}:</strong> {currentStageInfo.caption}
            </div>
          </div>
        </div>
      </div>

      {/* Output Probabilities (0-9 Digits Bar List) */}
      <div className="bg-slate-50 p-5 border border-slate-300 rounded-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            Output Softmax Probability Distribution (Digits 0-9)
          </h3>

          {predictions && (
            <div className="text-xs font-mono font-bold text-red-600 bg-red-50 px-2.5 py-0.5 border border-red-300">
              Final Prediction: Digit {predictions.predictedDigit} ({(predictions.probabilities[predictions.predictedDigit] * 100).toFixed(1)}%)
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs font-mono">
          {Array.from({ length: 10 }).map((_, digit) => {
            const prob = predictions ? predictions.probabilities[digit] : 0;
            const percentage = (prob * 100).toFixed(1);
            const isWinner = predictions && predictions.predictedDigit === digit;

            return (
              <div
                key={digit}
                className={`flex items-center gap-3 p-1 rounded-sm ${isWinner ? 'bg-red-50 font-bold text-red-600 text-sm' : 'text-slate-700'}`}
              >
                <span className="w-16 font-serif">
                  Digit {digit}:
                </span>

                <div className="flex-1 h-3.5 bg-white border border-slate-400 overflow-hidden relative">
                  <div
                    style={{ width: `${percentage}%` }}
                    className={`h-full transition-all duration-300 ${isWinner ? 'bg-red-600' : 'bg-slate-700'}`}
                  />
                </div>

                <span className={`w-14 text-right ${isWinner ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
                  {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Visualization;
