import React from 'react';

/**
 * Static Textbook SVG Explainer Diagram for K-Means Clustering (Unsupervised Learning).
 */
const KMeansDiagram = () => {
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

        {/* Axes */}
        <g stroke="#000000" strokeWidth="1.5">
          <line x1="40" y1="190" x2="380" y2="190" />
          <line x1="40" y1="190" x2="40" y2="20" />
          <path d="M375 186 L382 190 L375 194" fill="#000000" />
          <path d="M36 25 L40 18 L44 25" fill="#000000" />
        </g>
        <text x="375" y="210" fontSize="11" fontFamily="sans-serif" fontWeight="bold" fill="#000000">X₁</text>
        <text x="18" y="25" fontSize="11" fontFamily="sans-serif" fontWeight="bold" fill="#000000">X₂</text>

        {/* Cluster 1 (Red / Top Left) */}
        <g>
          <circle cx="120" cy="70" r="45" stroke="#dc2626" strokeWidth="1.2" strokeDasharray="4 4" fill="#fef2f2" fillOpacity="0.5" />
          {/* Centroid 1 */}
          <rect x="114" y="64" width="12" height="12" fill="#dc2626" stroke="#000000" strokeWidth="1.5" />
          <text x="114" y="56" fontSize="10" fontFamily="sans-serif" fontWeight="bold" fill="#dc2626">C₁</text>
          {/* Cluster 1 Points */}
          <circle cx="100" cy="55" r="4" fill="#dc2626" />
          <circle cx="135" cy="65" r="4" fill="#dc2626" />
          <circle cx="110" cy="85" r="4" fill="#dc2626" />
          <circle cx="140" cy="80" r="4" fill="#dc2626" />
          <circle cx="95" cy="75" r="4" fill="#dc2626" />
        </g>

        {/* Cluster 2 (Blue / Bottom Left) */}
        <g>
          <circle cx="160" cy="145" r="42" stroke="#2563eb" strokeWidth="1.2" strokeDasharray="4 4" fill="#eff6ff" fillOpacity="0.5" />
          {/* Centroid 2 */}
          <rect x="154" y="139" width="12" height="12" fill="#2563eb" stroke="#000000" strokeWidth="1.5" />
          <text x="154" y="131" fontSize="10" fontFamily="sans-serif" fontWeight="bold" fill="#2563eb">C₂</text>
          {/* Cluster 2 Points */}
          <circle cx="145" cy="130" r="4" fill="#2563eb" />
          <circle cx="175" cy="140" r="4" fill="#2563eb" />
          <circle cx="150" cy="160" r="4" fill="#2563eb" />
          <circle cx="175" cy="158" r="4" fill="#2563eb" />
          <circle cx="135" cy="150" r="4" fill="#2563eb" />
        </g>

        {/* Cluster 3 (Green / Right) */}
        <g>
          <circle cx="290" cy="100" r="50" stroke="#16a34a" strokeWidth="1.2" strokeDasharray="4 4" fill="#f0fdf4" fillOpacity="0.5" />
          {/* Centroid 3 */}
          <rect x="284" y="94" width="12" height="12" fill="#16a34a" stroke="#000000" strokeWidth="1.5" />
          <text x="284" y="86" fontSize="10" fontFamily="sans-serif" fontWeight="bold" fill="#16a34a">C₃</text>
          {/* Cluster 3 Points */}
          <circle cx="270" cy="85" r="4" fill="#16a34a" />
          <circle cx="310" cy="90" r="4" fill="#16a34a" />
          <circle cx="280" cy="120" r="4" fill="#16a34a" />
          <circle cx="315" cy="115" r="4" fill="#16a34a" />
          <circle cx="260" cy="105" r="4" fill="#16a34a" />
          <circle cx="300" cy="75" r="4" fill="#16a34a" />
        </g>
      </svg>

      <p className="mt-2 text-[11px] text-slate-700 text-center font-medium leading-snug">
        Points are grouped by proximity to the nearest center — no labels are given upfront.
      </p>
    </div>
  );
};

export default KMeansDiagram;
