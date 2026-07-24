import React, { useState, useEffect } from 'react';
import Button from '../Button';
import LLM3DScene from './LLM3DScene';
import { predictNextTokens } from '../../utils/llmInference';

const Visualization = () => {
  const [promptText, setPromptText] = useState('The neural network');
  const [tokens, setTokens] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [stageStep, setStageStep] = useState(0); // 0 = idle, 1 = tokenize, 2 = embed/attention, 3 = infer, 4 = output

  // Run Staggered 4-Stage Assembly Line Next-Token Prediction
  const handlePredict = () => {
    const result = predictNextTokens(promptText);
    setTokens(result.tokens);

    // Staggered Stage-by-Stage Assembly Line Animation (300-400ms per stage)
    setStageStep(1); // Stage 1: Tokenize

    setTimeout(() => {
      setStageStep(2); // Stage 2: Embedding & Attention Slabs
      setTimeout(() => {
        setStageStep(3); // Stage 3: Inference State
        setTimeout(() => {
          setStageStep(4); // Stage 4: Output Candidates
          setCandidates(result.candidates);
        }, 350);
      }, 350);
    }, 350);
  };

  useEffect(() => {
    handlePredict();
  }, []);

  // Handle clicking a candidate word to append it to prompt & re-trigger prediction
  const handleAppendCandidate = (word) => {
    const space = promptText.length > 0 && !promptText.endsWith(' ') ? ' ' : '';
    const newText = promptText + space + word;
    setPromptText(newText);

    const result = predictNextTokens(newText);
    setTokens(result.tokens);

    setStageStep(1);
    setTimeout(() => {
      setStageStep(2);
      setTimeout(() => {
        setStageStep(3);
        setTimeout(() => {
          setStageStep(4);
          setCandidates(result.candidates);
        }, 300);
      }, 300);
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* One-Line Reminder */}
      <div className="text-xs text-slate-600 bg-slate-50 p-2.5 border border-slate-300 rounded-sm font-mono">
        ✍️ Type a text prompt below or click any candidate word to construct sentences word-by-word!
      </div>

      {/* Input Prompt Box & Token Chips Display */}
      <div className="bg-slate-50 p-4 border border-slate-300 rounded-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-900">
          <span>Stage 1 — Input Token Chips:</span>
          <span className="font-mono text-slate-500 font-normal">{tokens.length} tokens generated</span>
        </div>

        {/* Token Chips Display */}
        <div className="flex flex-wrap gap-1.5 p-2.5 bg-white border border-slate-300 min-h-[42px] items-center">
          {tokens.length === 0 ? (
            <span className="text-xs font-mono text-slate-400">Type a sentence to see token chips...</span>
          ) : (
            tokens.map((tok, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-slate-100 border border-slate-900 font-mono text-xs text-slate-900 rounded-sm"
              >
                {tok}
              </span>
            ))
          )}
        </div>

        {/* Prompt Input & Action Buttons */}
        <div className="flex gap-3 pt-1">
          <input
            type="text"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="Type a sentence prompt (e.g. 'The neural network')..."
            className="flex-1 px-3 py-1.5 bg-white border border-slate-900 font-mono text-xs text-slate-900 focus:outline-none"
          />

          <Button variant="primary" onClick={handlePredict}>
            Predict Next Word
          </Button>

          <Button variant="outline" onClick={() => { setPromptText(''); setTokens([]); setCandidates([]); setStageStep(0); }}>
            Clear
          </Button>
        </div>
      </div>

      {/* Embedded Black Panel: Three.js 3D LLM Assembly Line Viewport */}
      <div className="bg-black border-2 border-slate-800 rounded-sm shadow-xl overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-950 text-xs font-mono">
          <span className="text-cyan-400 font-bold">Three.js 3D Transformer Assembly Line</span>
          <span className="text-slate-500 text-[11px]">🖱️ Click & Drag to Rotate Scene in 3D</span>
        </div>

        {/* Three.js 3D Scene Component */}
        <LLM3DScene
          tokens={tokens}
          candidates={candidates}
          stageStep={stageStep}
        />
      </div>

      {/* Stage 4: Top Candidate Next Words Probability Bar List */}
      <div className="bg-slate-50 p-5 border border-slate-300 rounded-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            Stage 4 — Output Candidate Next Tokens (Click to Append)
          </h3>

          <span className="text-[11px] font-mono text-blue-600 font-bold">
            Sorted by Probability Scores
          </span>
        </div>

        {candidates.length === 0 || stageStep < 4 ? (
          <div className="text-xs text-slate-500 font-mono py-2 text-center">
            {stageStep > 0 ? 'Processing 3D Transformer pipeline...' : 'Type text above and click "Predict Next Word".'}
          </div>
        ) : (
          <div className="space-y-2.5">
            {candidates.map((item, idx) => {
              const percentage = (item.prob * 100).toFixed(1);
              const isTop = idx === 0;

              return (
                <div
                  key={idx}
                  onClick={() => handleAppendCandidate(item.token)}
                  className={`
                    flex items-center gap-3 p-2 bg-white border cursor-pointer transition-all hover:border-slate-900 group select-none
                    ${isTop ? 'border-blue-600 bg-blue-50/20' : 'border-slate-300'}
                  `}
                >
                  <span className={`w-28 font-mono font-bold text-xs truncate ${isTop ? 'text-blue-600' : 'text-slate-900 group-hover:text-blue-600'}`}>
                    + "{item.token}"
                  </span>

                  <div className="flex-1 h-3.5 bg-slate-100 border border-slate-400 overflow-hidden relative">
                    <div
                      style={{ width: `${percentage}%` }}
                      className={`h-full transition-all duration-300 ${isTop ? 'bg-blue-600' : 'bg-slate-700'}`}
                    />
                  </div>

                  <span className={`w-14 text-right font-mono text-xs ${isTop ? 'text-blue-600 font-bold' : 'text-slate-600'}`}>
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Visualization;
