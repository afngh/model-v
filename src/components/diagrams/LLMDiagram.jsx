import React from 'react';

/**
 * Static Textbook SVG Explainer Diagram for LLM Next-Token Prediction & Self-Attention.
 */
const LLMDiagram = () => {
  return (
    <div className="flex flex-col items-center bg-white border border-slate-900 p-3 rounded-sm">
      <svg
        viewBox="0 0 400 220"
        className="w-full h-auto max-w-[380px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="400" height="220" fill="#ffffff" />

        {/* 1. Input Token Chips */}
        <g fontSize="9" fontFamily="monospace" stroke="#000000" strokeWidth="1">
          <rect x="20" y="40" width="45" height="22" fill="#ffffff" />
          <text x="42.5" y="54" textAnchor="middle" stroke="none">The</text>

          <rect x="75" y="40" width="55" height="22" fill="#ffffff" />
          <text x="102.5" y="54" textAnchor="middle" stroke="none">neural</text>

          <rect x="140" y="40" width="60" height="22" fill="#ffffff" />
          <text x="170" y="54" textAnchor="middle" stroke="none">network</text>
        </g>
        <text x="110" y="25" fontSize="9" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle" fill="#000">1. Input Token Chips</text>

        {/* 2. Self-Attention Web Matrix */}
        <g stroke="#2563eb" strokeWidth="1" strokeDasharray="3 3">
          <path d="M 42.5 62 Q 72 100 102.5 62" />
          <path d="M 102.5 62 Q 136 100 170 62" />
          <path d="M 42.5 62 Q 106 120 170 62" />
        </g>

        {/* 3. Transformer Block Box */}
        <rect x="20" y="95" width="180" height="40" fill="#f8fafc" stroke="#000000" strokeWidth="1.5" />
        <text x="110" y="118" fontSize="10" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle" fill="#000">
          Transformer Block (Self-Attention)
        </text>

        {/* Connecting Arrow */}
        <path d="M 205 115 L 245 115 M 239 110 L 245 115 L 239 120" stroke="#000000" strokeWidth="1.2" />

        {/* 4. Output Token Probability List */}
        <g fontSize="8" fontFamily="monospace">
          <rect x="250" y="40" width="135" height="135" fill="#ffffff" stroke="#000000" strokeWidth="1" />
          <text x="317" y="55" fontSize="9" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">Next Token Probabilities</text>

          {/* Candidate 1: "is" (Top candidate) */}
          <text x="260" y="76" fontWeight="bold" fill="#2563eb">"is"</text>
          <rect x="290" y="70" width="60" height="7" fill="#2563eb" />
          <text x="355" y="76" fontWeight="bold" fill="#2563eb">42%</text>

          {/* Candidate 2: "can" */}
          <text x="260" y="96" fill="#000">"can"</text>
          <rect x="290" y="90" width="35" height="7" fill="#cbd5e1" />
          <text x="330" y="96" fill="#64748b">24%</text>

          {/* Candidate 3: "models" */}
          <text x="260" y="116" fill="#000">"models"</text>
          <rect x="290" y="110" width="22" height="7" fill="#cbd5e1" />
          <text x="317" y="116" fill="#64748b">15%</text>

          {/* Candidate 4: "learns" */}
          <text x="260" y="136" fill="#000">"learns"</text>
          <rect x="290" y="130" width="14" height="7" fill="#cbd5e1" />
          <text x="309" y="136" fill="#64748b">9%</text>
        </g>

        {/* Bottom Caption */}
        <text x="200" y="205" fontSize="8" fontFamily="sans-serif" fill="#475569" textAnchor="middle">
          Self-attention computes contextual relationships between tokens to predict the most likely next word
        </text>
      </svg>

      <p className="mt-2 text-[11px] text-slate-700 text-center font-medium leading-snug">
        Self-attention computes contextual relationships between tokens to predict the most likely next word.
      </p>
    </div>
  );
};

export default LLMDiagram;
