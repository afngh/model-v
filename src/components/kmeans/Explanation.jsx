import React from 'react';

/**
 * GeeksforGeeks / W3Schools style tutorial explanation for Unsupervised Learning & K-Means Clustering.
 * Features main paradigm title, rich educational explanations, real-world scenario SVG diagram,
 * and step-by-step filmstrip mini SVGs.
 */
const Explanation = () => {
  return (
    <div className="space-y-8 text-slate-900 leading-relaxed font-sans">
      {/* Main Paradigm Title & Overview Header */}
      <section className="bg-slate-900 text-white p-6 border border-slate-900 rounded-sm">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-300 block mb-1">
          Machine Learning Paradigm #2
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-white mb-2">
          UNSUPERVISED LEARNING: K-Means Clustering
        </h1>
        <p className="text-xs text-slate-300 leading-relaxed">
          Unsupervised Learning algorithms find patterns in raw, unlabeled datasets. Unlike supervised learning, there are <strong>no ground-truth target labels <em>(Y)</em></strong> provided. The model analyzes feature similarities <em>(X)</em> to discover natural clusters, hidden structures, and intrinsic groupings.
        </p>
      </section>

      {/* Main Concept Explanation */}
      <section className="bg-slate-50 p-6 border border-slate-300 rounded-sm space-y-3">
        <h2 className="text-base font-bold text-slate-900">
          Understanding K-Means Clustering
        </h2>
        <p className="text-xs text-slate-700 leading-relaxed">
          K-Means is the foundational unsupervised algorithm for spatial partitioning. It partitions data into <strong>$K$ distinct clusters</strong> where every point belongs to the cluster with the nearest mean (centroid):
        </p>
        <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 font-normal pl-2">
          <li><strong>Cluster Count (K):</strong> The user specifies how many clusters to discover.</li>
          <li><strong>Centroids:</strong> Mathematical centers of mass representing each group.</li>
          <li><strong>Euclidean Distance:</strong> Distance metric used to measure similarity between points and centroids.</li>
        </ul>
      </section>

      {/* Real-World Scenario Example with Dedicated SVG Diagram */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-900 pb-2">
          Real-World Example: E-Commerce Customer Persona Segmentation
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-white p-5 border border-slate-300 rounded-sm">
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900">How Customer Analytics Uses Unsupervised K-Means</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              An online retailer has millions of customer records without predefined labels. They measure two features:
            </p>
            <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
              <li><strong>Feature X₁:</strong> Annual Household Income ($k).</li>
              <li><strong>Feature X₂:</strong> Online Store Spending Score (1 to 100).</li>
            </ul>
            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              By applying K-Means with $K=3$, the algorithm automatically groups users into 3 personas: <em>"Budget Shoppers"</em>, <em>"High Earners / Big Spenders"</em>, and <em>"Frugal High Income"</em>. The marketing team can then send targeted campaigns to each group!
            </p>
          </div>

          {/* Real-World Scenario SVG Illustration */}
          <div className="flex flex-col items-center justify-center border border-slate-200 p-3 bg-slate-50">
            <svg viewBox="0 0 320 200" className="w-full h-auto max-w-[300px]" fill="none">
              <rect width="320" height="200" fill="#ffffff" />
              {/* Axes */}
              <line x1="35" y1="170" x2="300" y2="170" stroke="#000000" strokeWidth="1.5" />
              <line x1="35" y1="170" x2="35" y2="20" stroke="#000000" strokeWidth="1.5" />
              <text x="270" y="190" fontSize="9" fontFamily="sans-serif" fontWeight="bold" fill="#000">Income ($k)</text>
              <text x="10" y="25" fontSize="9" fontFamily="sans-serif" fontWeight="bold" fill="#000">Spending</text>

              {/* Group 1: High Spenders (Top Right - Red) */}
              <circle cx="230" cy="50" r="35" stroke="#dc2626" strokeWidth="1" strokeDasharray="3 3" fill="#fef2f2" opacity="0.6" />
              <rect x="225" y="45" width="10" height="10" fill="#dc2626" stroke="#000" strokeWidth="1" />
              <circle cx="215" cy="40" r="3.5" fill="#dc2626" />
              <circle cx="245" cy="55" r="3.5" fill="#dc2626" />
              <circle cx="225" cy="65" r="3.5" fill="#dc2626" />
              <text x="230" y="30" fontSize="8" fontFamily="sans-serif" fontWeight="bold" fill="#dc2626" textAnchor="middle">Big Spenders</text>

              {/* Group 2: Budget Buyers (Bottom Left - Blue) */}
              <circle cx="85" cy="135" r="30" stroke="#2563eb" strokeWidth="1" strokeDasharray="3 3" fill="#eff6ff" opacity="0.6" />
              <rect x="80" y="130" width="10" height="10" fill="#2563eb" stroke="#000" strokeWidth="1" />
              <circle cx="75" cy="125" r="3.5" fill="#2563eb" />
              <circle cx="95" cy="145" r="3.5" fill="#2563eb" />
              <circle cx="80" cy="148" r="3.5" fill="#2563eb" />
              <text x="85" y="176" fontSize="8" fontFamily="sans-serif" fontWeight="bold" fill="#2563eb" textAnchor="middle">Budget Buyers</text>

              {/* Group 3: Frugal High Earners (Bottom Right - Green) */}
              <circle cx="225" cy="135" r="30" stroke="#16a34a" strokeWidth="1" strokeDasharray="3 3" fill="#f0fdf4" opacity="0.6" />
              <rect x="220" y="130" width="10" height="10" fill="#16a34a" stroke="#000" strokeWidth="1" />
              <circle cx="215" cy="125" r="3.5" fill="#16a34a" />
              <circle cx="235" cy="145" r="3.5" fill="#16a34a" />
              <text x="225" y="176" fontSize="8" fontFamily="sans-serif" fontWeight="bold" fill="#16a34a" textAnchor="middle">Frugal Earners</text>
            </svg>
            <span className="text-[10px] text-slate-500 font-mono mt-1 text-center">
              Figure 2.1: Unsupervised Customer Segmentation (K=3)
            </span>
          </div>
        </div>
      </section>

      {/* How it works: Step-by-Step with Filmstrip Mini SVG Diagrams */}
      <section className="space-y-6">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-900 pb-2">
          How K-Means Algorithm Works — Step by Step
        </h3>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white p-4 border border-slate-300 rounded-sm">
            <div className="sm:col-span-2 space-y-1">
              <span className="text-xs font-mono font-bold text-blue-600 block">Step 1</span>
              <h4 className="text-sm font-bold text-slate-900">Randomly place k centroids</h4>
              <p className="text-xs text-slate-600">
                Choose the number of clusters $K$ and randomly initialize $K$ centroid locations across the feature space (Forgy initialization).
              </p>
            </div>
            <div className="flex justify-center border border-slate-200 p-2 bg-slate-50">
              <svg viewBox="0 0 140 90" className="w-32 h-20" fill="none">
                <rect width="140" height="90" fill="#ffffff" />
                <line x1="15" y1="75" x2="125" y2="75" stroke="#000000" strokeWidth="1" />
                <line x1="15" y1="75" x2="15" y2="10" stroke="#000000" strokeWidth="1" />
                <circle cx="35" cy="30" r="2.5" fill="#000000" />
                <circle cx="45" cy="40" r="2.5" fill="#000000" />
                <circle cx="95" cy="60" r="2.5" fill="#000000" />
                <circle cx="105" cy="65" r="2.5" fill="#000000" />
                <rect x="28" y="48" width="7" height="7" fill="#dc2626" stroke="#000" strokeWidth="0.8" />
                <rect x="85" y="25" width="7" height="7" fill="#2563eb" stroke="#000" strokeWidth="0.8" />
              </svg>
            </div>
          </div>

          {/* Step 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white p-4 border border-slate-300 rounded-sm">
            <div className="sm:col-span-2 space-y-1">
              <span className="text-xs font-mono font-bold text-blue-600 block">Step 2</span>
              <h4 className="text-sm font-bold text-slate-900">Assign each point to its nearest centroid</h4>
              <p className="text-xs text-slate-600">
                Compute the Euclidean distance <em>d(p, c)</em> from each point to every centroid. Assign each data point to its closest centroid.
              </p>
            </div>
            <div className="flex justify-center border border-slate-200 p-2 bg-slate-50">
              <svg viewBox="0 0 140 90" className="w-32 h-20" fill="none">
                <rect width="140" height="90" fill="#ffffff" />
                <line x1="15" y1="75" x2="125" y2="75" stroke="#000000" strokeWidth="1" />
                <line x1="15" y1="75" x2="15" y2="10" stroke="#000000" strokeWidth="1" />
                <circle cx="35" cy="30" r="2.5" fill="#dc2626" />
                <circle cx="45" cy="40" r="2.5" fill="#dc2626" />
                <circle cx="95" cy="60" r="2.5" fill="#2563eb" />
                <circle cx="105" cy="65" r="2.5" fill="#2563eb" />
                <rect x="28" y="48" width="7" height="7" fill="#dc2626" stroke="#000" strokeWidth="0.8" />
                <rect x="85" y="25" width="7" height="7" fill="#2563eb" stroke="#000" strokeWidth="0.8" />
              </svg>
            </div>
          </div>

          {/* Step 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white p-4 border border-slate-300 rounded-sm">
            <div className="sm:col-span-2 space-y-1">
              <span className="text-xs font-mono font-bold text-blue-600 block">Step 3</span>
              <h4 className="text-sm font-bold text-slate-900">Move each centroid to average position</h4>
              <p className="text-xs text-slate-600">
                Calculate the mean <em>(x, y)</em> coordinate of all points assigned to each cluster. Relocate the centroid to this new mean center of mass.
              </p>
            </div>
            <div className="flex justify-center border border-slate-200 p-2 bg-slate-50">
              <svg viewBox="0 0 140 90" className="w-32 h-20" fill="none">
                <rect width="140" height="90" fill="#ffffff" />
                <line x1="15" y1="75" x2="125" y2="75" stroke="#000000" strokeWidth="1" />
                <line x1="15" y1="75" x2="15" y2="10" stroke="#000000" strokeWidth="1" />
                <circle cx="35" cy="30" r="2.5" fill="#dc2626" />
                <circle cx="45" cy="40" r="2.5" fill="#dc2626" />
                <circle cx="95" cy="60" r="2.5" fill="#2563eb" />
                <circle cx="105" cy="65" r="2.5" fill="#2563eb" />
                <rect x="36" y="31" width="7" height="7" fill="#dc2626" stroke="#000" strokeWidth="0.8" />
                <rect x="96" y="58" width="7" height="7" fill="#2563eb" stroke="#000" strokeWidth="0.8" />
              </svg>
            </div>
          </div>

          {/* Step 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white p-4 border border-slate-300 rounded-sm">
            <div className="sm:col-span-2 space-y-1">
              <span className="text-xs font-mono font-bold text-blue-600 block">Step 4</span>
              <h4 className="text-sm font-bold text-slate-900">Repeat steps 2-3 until centroids stop moving</h4>
              <p className="text-xs text-slate-600">
                Repeat assignment and centroid updates until centroid displacement is below convergence threshold and cluster memberships stabilize.
              </p>
            </div>
            <div className="flex justify-center border border-slate-200 p-2 bg-slate-50">
              <svg viewBox="0 0 140 90" className="w-32 h-20" fill="none">
                <rect width="140" height="90" fill="#ffffff" />
                <line x1="15" y1="75" x2="125" y2="75" stroke="#000000" strokeWidth="1" />
                <line x1="15" y1="75" x2="15" y2="10" stroke="#000000" strokeWidth="1" />
                <circle cx="40" cy="35" r="16" stroke="#dc2626" strokeWidth="1" strokeDasharray="2 2" />
                <circle cx="100" cy="62" r="16" stroke="#2563eb" strokeWidth="1" strokeDasharray="2 2" />
                <circle cx="35" cy="30" r="2.5" fill="#dc2626" />
                <circle cx="45" cy="40" r="2.5" fill="#dc2626" />
                <circle cx="95" cy="60" r="2.5" fill="#2563eb" />
                <circle cx="105" cy="65" r="2.5" fill="#2563eb" />
                <rect x="36" y="31" width="7" height="7" fill="#dc2626" stroke="#000" strokeWidth="0.8" />
                <rect x="96" y="58" width="7" height="7" fill="#2563eb" stroke="#000" strokeWidth="0.8" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Real-World Applications List */}
      <section className="bg-slate-50 p-5 border border-slate-300 rounded-sm space-y-2">
        <h3 className="text-sm font-bold text-slate-900">
          Where is Unsupervised K-Means used in industry?
        </h3>
        <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 font-normal">
          <li><strong>Customer Segmentation:</strong> Grouping e-commerce users by purchasing behavior and browsing history.</li>
          <li><strong>Image Compression (Color Quantization):</strong> Reducing a 24-bit image to $K$ representative palette colors.</li>
          <li><strong>Document Clustering:</strong> Categorizing news articles and search results into topics automatically.</li>
        </ul>
      </section>
    </div>
  );
};

export default Explanation;
