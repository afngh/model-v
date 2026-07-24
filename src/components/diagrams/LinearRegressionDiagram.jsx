import React from 'react';

/**
 * Static Textbook SVG Explainer Diagram for Linear Regression (Supervised Learning).
 */
const LinearRegressionDiagram = () => {
  return (
    <div className="flex flex-col items-center bg-white border border-slate-900 p-3 rounded-sm">
      <svg
        viewBox="0 0 400 220"
        className="w-full h-auto max-w-[380px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background */}
        <rect width="400" height="220" fill="#ffffff" />

        {/* Gridlines */}
        <g stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3">
          <line x1="40" y1="50" x2="380" y2="50" />
          <line x1="40" y1="100" x2="380" y2="100" />
          <line x1="40" y1="150" x2="380" y2="150" />
          <line x1="120" y1="20" x2="120" y2="190" />
          <line x1="200" y1="20" x2="200" y2="190" />
          <line x1="280" y1="20" x2="280" y2="190" />
          <line x1="360" y1="20" x2="360" y2="190" />
        </g>

        {/* Axes */}
        <g stroke="#000000" strokeWidth="1.5">
          <line x1="40" y1="190" x2="380" y2="190" />
          <line x1="40" y1="190" x2="40" y2="20" />
          {/* Arrowheads */}
          <path d="M375 186 L382 190 L375 194" fill="#000000" />
          <path d="M36 25 L40 18 L44 25" fill="#000000" />
        </g>

        {/* Axis Labels */}
        <text x="375" y="210" fontSize="11" fontFamily="sans-serif" fontWeight="bold" fill="#000000">X (Feature)</text>
        <text x="15" y="25" fontSize="11" fontFamily="sans-serif" fontWeight="bold" fill="#000000">Y (Target)</text>

        {/* Fitted Line: y = m*x + b -> from (50, 160) to (360, 45) */}
        <line x1="50" y1="160" x2="360" y2="45" stroke="#dc2626" strokeWidth="2.5" />
        <text x="280" y="35" fontSize="10" fontFamily="sans-serif" fontWeight="bold" fill="#dc2626">Line: ŷ = mx + b</text>

        {/* Data Points & Vertical Residual Lines */}
        {/* Point 1 */}
        <line x1="90" y1="175" x2="90" y2="145" stroke="#64748b" strokeWidth="1.2" strokeDasharray="3 3" />
        <circle cx="90" cy="175" r="4.5" fill="#000000" />
        <text x="96" y="165" fontSize="9" fontFamily="sans-serif" fill="#64748b">residual e₁</text>

        {/* Point 2 */}
        <line x1="160" y1="90" x2="160" y2="119" stroke="#64748b" strokeWidth="1.2" strokeDasharray="3 3" />
        <circle cx="160" cy="90" r="4.5" fill="#000000" />
        <text x="166" y="105" fontSize="9" fontFamily="sans-serif" fill="#64748b">residual e₂</text>

        {/* Point 3 */}
        <line x1="230" y1="118" x2="230" y2="93" stroke="#64748b" strokeWidth="1.2" strokeDasharray="3 3" />
        <circle cx="230" cy="118" r="4.5" fill="#000000" />

        {/* Point 4 */}
        <line x1="310" y1="40" x2="310" y2="64" stroke="#64748b" strokeWidth="1.2" strokeDasharray="3 3" />
        <circle cx="310" cy="40" r="4.5" fill="#000000" />

        {/* More Scatter Points */}
        <circle cx="120" cy="130" r="4.5" fill="#000000" />
        <circle cx="200" cy="105" r="4.5" fill="#000000" />
        <circle cx="270" cy="75" r="4.5" fill="#000000" />
        <circle cx="340" cy="55" r="4.5" fill="#000000" />
      </svg>

      <p className="mt-2 text-[11px] text-slate-700 text-center font-medium leading-snug">
        The model draws a line to minimize the distance between predictions and actual data points.
      </p>
    </div>
  );
};

export default LinearRegressionDiagram;
