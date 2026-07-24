import React from 'react';

/**
 * Static Textbook SVG Explainer Diagram for MNIST Convolutional Neural Network.
 */
const MNISTDiagram = () => {
  return (
    <div className="flex flex-col items-center bg-white border border-slate-900 p-3 rounded-sm">
      <svg
        viewBox="0 0 400 220"
        className="w-full h-auto max-w-[380px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="400" height="220" fill="#ffffff" />

        {/* 1. Input Layer Grid (28x28 digit 7) */}
        <g stroke="#000000" strokeWidth="1">
          <rect x="20" y="50" width="70" height="70" fill="#ffffff" strokeWidth="1.5" />
          {/* Subgrid lines */}
          <line x1="43" y1="50" x2="43" y2="120" stroke="#e2e8f0" />
          <line x1="66" y1="50" x2="66" y2="120" stroke="#e2e8f0" />
          <line x1="20" y1="73" x2="90" y2="73" stroke="#e2e8f0" />
          <line x1="20" y1="96" x2="90" y2="96" stroke="#e2e8f0" />

          {/* Drawn Digit 7 in grid */}
          <path d="M 28 60 L 82 60 L 50 112" stroke="#000000" strokeWidth="3" fill="none" />
        </g>
        <text x="55" y="140" fontSize="9" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle" fill="#000">28x28 Input Image</text>

        {/* Connecting Arrows */}
        <path d="M 98 85 L 138 85 M 132 80 L 138 85 L 132 90" stroke="#000000" strokeWidth="1.2" />

        {/* 2. Hidden Layers / Feature Maps */}
        <g stroke="#000000" strokeWidth="1.2">
          {/* Feature Map 1 */}
          <rect x="145" y="40" width="45" height="45" fill="#f8fafc" />
          <path d="M 152 50 L 180 50" stroke="#dc2626" strokeWidth="2" />
          {/* Feature Map 2 */}
          <rect x="155" y="60" width="45" height="45" fill="#ffffff" />
          <path d="M 185 70 L 170 95" stroke="#dc2626" strokeWidth="2" />

          {/* Feature Map 3 */}
          <rect x="165" y="80" width="45" height="45" fill="#ffffff" />
          <circle cx="187" cy="102" r="10" stroke="#dc2626" strokeWidth="1.5" fill="none" />
        </g>
        <text x="187" y="140" fontSize="9" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle" fill="#000">Hidden Feature Layers</text>

        {/* Connecting Arrows */}
        <path d="M 218 85 L 258 85 M 252 80 L 258 85 L 252 90" stroke="#000000" strokeWidth="1.2" />

        {/* 3. Output Layer Nodes (0-9) */}
        <g fontSize="8" fontFamily="sans-serif">
          {/* Digit 0 node */}
          <circle cx="280" cy="40" r="7" fill="#ffffff" stroke="#000" strokeWidth="1.2" />
          <text x="280" y="43" textAnchor="middle">0</text>
          <rect x="295" y="37" width="10" height="6" fill="#cbd5e1" />

          {/* Digit 1 node */}
          <circle cx="280" cy="65" r="7" fill="#ffffff" stroke="#000" strokeWidth="1.2" />
          <text x="280" y="68" textAnchor="middle">1</text>
          <rect x="295" y="62" width="20" height="6" fill="#cbd5e1" />

          {/* ... Digit 7 node (High Activation) */}
          <circle cx="280" cy="100" r="9" fill="#000000" stroke="#000" strokeWidth="1.2" />
          <text x="280" y="103" textAnchor="middle" fill="#ffffff" fontWeight="bold">7</text>
          <rect x="295" y="96" width="65" height="8" fill="#dc2626" />
          <text x="365" y="103" fontSize="8" fontWeight="bold" fill="#dc2626">94%</text>

          {/* Digit 9 node */}
          <circle cx="280" cy="130" r="7" fill="#ffffff" stroke="#000" strokeWidth="1.2" />
          <text x="280" y="133" textAnchor="middle">9</text>
          <rect x="295" y="127" width="15" height="6" fill="#cbd5e1" />
        </g>
        <text x="320" y="160" fontSize="9" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle" fill="#000">10 Output Classes (0-9)</text>

        {/* Legend */}
        <text x="200" y="205" fontSize="8" fontFamily="sans-serif" fill="#475569" textAnchor="middle">
          Convolutional layers extract feature maps to compute Softmax digit probabilities
        </text>
      </svg>

      <p className="mt-2 text-[11px] text-slate-700 text-center font-medium leading-snug">
        Convolutional layers extract edge & shape features from pixels to compute digit probability scores.
      </p>
    </div>
  );
};

export default MNISTDiagram;
