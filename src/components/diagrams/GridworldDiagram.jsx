import React from 'react';

/**
 * Static Textbook SVG Explainer Diagram for Gridworld Pathfinding (Reinforcement Learning).
 */
const GridworldDiagram = () => {
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

        {/* 5x5 Grid representation */}
        <g stroke="#000000" strokeWidth="1.2">
          {/* Outer Border */}
          <rect x="80" y="20" width="240" height="180" fill="#ffffff" />

          {/* Grid vertical lines */}
          <line x1="128" y1="20" x2="128" y2="200" />
          <line x1="176" y1="20" x2="176" y2="200" />
          <line x1="224" y1="20" x2="224" y2="200" />
          <line x1="272" y1="20" x2="272" y2="200" />

          {/* Grid horizontal lines */}
          <line x1="80" y1="56" x2="320" y2="56" />
          <line x1="80" y1="92" x2="320" y2="92" />
          <line x1="80" y1="128" x2="320" y2="128" />
          <line x1="80" y1="164" x2="320" y2="164" />
        </g>

        {/* Special Cells */}
        {/* START Cell (Top-Left: 80, 20) */}
        <rect x="81" y="21" width="46" height="34" fill="#d1fae5" />
        <text x="104" y="42" fontSize="9" fontFamily="sans-serif" fontWeight="bold" fill="#065f46" textAnchor="middle">START</text>

        {/* GOAL Cell (Bottom-Right: 272, 164) */}
        <rect x="273" y="165" width="46" height="34" fill="#fef3c7" />
        <text x="296" y="186" fontSize="9" fontFamily="sans-serif" fontWeight="bold" fill="#92400e" textAnchor="middle">GOAL</text>

        {/* HAZARD Cells */}
        <rect x="177" y="57" width="46" height="34" fill="#fee2e2" />
        <text x="200" y="78" fontSize="8" fontFamily="sans-serif" fontWeight="bold" fill="#991b1b" textAnchor="middle">HAZARD</text>

        <rect x="177" y="93" width="46" height="34" fill="#fee2e2" />
        <text x="200" y="114" fontSize="8" fontFamily="sans-serif" fontWeight="bold" fill="#991b1b" textAnchor="middle">HAZARD</text>

        {/* Learned Path Dotted Line with Arrows (bypassing hazards) */}
        {/* From Start (104, 38) -> Right (152, 38) -> Down (152, 146) -> Right (296, 146) -> Down to Goal (296, 182) */}
        <path
          d="M 104 38 L 152 38 L 152 146 L 296 146 L 296 175"
          stroke="#2563eb"
          strokeWidth="2.5"
          strokeDasharray="4 4"
          fill="none"
        />
        {/* Path Arrowhead */}
        <path d="M291 170 L296 178 L301 170" fill="#2563eb" />

        {/* Blue Agent Dot at Start */}
        <circle cx="104" cy="38" r="6" fill="#2563eb" stroke="#000000" strokeWidth="1" />

        {/* Legend */}
        <g fontSize="8" fontFamily="sans-serif" fill="#475569">
          <text x="80" y="212">Reward +100 at Goal</text>
          <text x="235" y="212">Penalty -25 at Hazard</text>
        </g>
      </svg>

      <p className="mt-2 text-[11px] text-slate-700 text-center font-medium leading-snug">
        An agent tries different paths, learning which actions lead to reward and which lead to penalty.
      </p>
    </div>
  );
};

export default GridworldDiagram;
