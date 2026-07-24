import React from 'react';

/**
 * Small "Untrained -> Trained" static thumbnail preview displayed near action buttons.
 */
const BeforeAfterThumbnail = ({ type = 'linear' }) => {
  if (type === 'linear') {
    return (
      <div className="flex flex-col items-center p-1.5 bg-white border border-slate-300 rounded-sm text-[10px] font-mono text-slate-700 select-none">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="font-bold">Before</span>
          <span>→</span>
          <span className="font-bold text-red-600">After</span>
        </div>
        <svg viewBox="0 0 120 40" className="w-28 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Before Box (Untrained line: horizontal line) */}
          <rect x="2" y="2" width="48" height="36" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
          <line x1="6" y1="20" x2="46" y2="20" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="2 2" />
          <circle cx="12" cy="28" r="1.5" fill="#000000" />
          <circle cx="22" cy="12" r="1.5" fill="#000000" />
          <circle cx="32" cy="25" r="1.5" fill="#000000" />
          <circle cx="42" cy="8" r="1.5" fill="#000000" />

          {/* Arrow */}
          <path d="M57 20 L63 20 M60 17 L63 20 L60 23" stroke="#000000" strokeWidth="1.2" />

          {/* After Box (Trained fitted diagonal line) */}
          <rect x="70" y="2" width="48" height="36" fill="#ffffff" stroke="#000000" strokeWidth="1" />
          <line x1="74" y1="32" x2="114" y2="8" stroke="#dc2626" strokeWidth="1.5" />
          <circle cx="80" cy="28" r="1.5" fill="#000000" />
          <circle cx="90" cy="22" r="1.5" fill="#000000" />
          <circle cx="100" cy="16" r="1.5" fill="#000000" />
          <circle cx="110" cy="10" r="1.5" fill="#000000" />
        </svg>
      </div>
    );
  }

  if (type === 'kmeans') {
    return (
      <div className="flex flex-col items-center p-1.5 bg-white border border-slate-300 rounded-sm text-[10px] font-mono text-slate-700 select-none">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="font-bold">Unlabeled</span>
          <span>→</span>
          <span className="font-bold text-blue-600">Clustered</span>
        </div>
        <svg viewBox="0 0 120 40" className="w-28 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Before Box (All black dots, no centroids) */}
          <rect x="2" y="2" width="48" height="36" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
          <circle cx="12" cy="12" r="1.5" fill="#000000" />
          <circle cx="18" cy="18" r="1.5" fill="#000000" />
          <circle cx="34" cy="28" r="1.5" fill="#000000" />
          <circle cx="40" cy="32" r="1.5" fill="#000000" />

          {/* Arrow */}
          <path d="M57 20 L63 20 M60 17 L63 20 L60 23" stroke="#000000" strokeWidth="1.2" />

          {/* After Box (Color clustered dots + square centroids) */}
          <rect x="70" y="2" width="48" height="36" fill="#ffffff" stroke="#000000" strokeWidth="1" />
          {/* Red cluster */}
          <circle cx="80" cy="12" r="1.5" fill="#dc2626" />
          <circle cx="86" cy="16" r="1.5" fill="#dc2626" />
          <rect x="81" y="12" width="4" height="4" fill="#dc2626" stroke="#000000" strokeWidth="0.5" />
          {/* Blue cluster */}
          <circle cx="102" cy="28" r="1.5" fill="#2563eb" />
          <circle cx="108" cy="32" r="1.5" fill="#2563eb" />
          <rect x="103" y="28" width="4" height="4" fill="#2563eb" stroke="#000000" strokeWidth="0.5" />
        </svg>
      </div>
    );
  }

  // Gridworld RL
  return (
    <div className="flex flex-col items-center p-1.5 bg-white border border-slate-300 rounded-sm text-[10px] font-mono text-slate-700 select-none">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="font-bold">Random</span>
        <span>→</span>
        <span className="font-bold text-green-700">Optimal Path</span>
      </div>
      <svg viewBox="0 0 120 40" className="w-28 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Before Box (Random wandering path) */}
        <rect x="2" y="2" width="48" height="36" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
        <path d="M 8 32 L 8 20 L 24 20 L 24 32 L 38 12" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" fill="none" />
        <rect x="6" y="28" width="5" height="5" fill="#10b981" />
        <rect x="36" y="8" width="5" height="5" fill="#f59e0b" />

        {/* Arrow */}
        <path d="M57 20 L63 20 M60 17 L63 20 L60 23" stroke="#000000" strokeWidth="1.2" />

        {/* After Box (Direct path avoiding hazards) */}
        <rect x="70" y="2" width="48" height="36" fill="#ffffff" stroke="#000000" strokeWidth="1" />
        <path d="M 76 32 L 76 12 L 104 12" stroke="#2563eb" strokeWidth="1.5" fill="none" />
        <rect x="74" y="28" width="5" height="5" fill="#10b981" />
        <rect x="102" y="8" width="5" height="5" fill="#f59e0b" />
        <rect x="88" y="20" width="5" height="5" fill="#ef4444" />
      </svg>
    </div>
  );
};

export default BeforeAfterThumbnail;
