import React from 'react';

/**
 * GeeksforGeeks / W3Schools style tutorial explanation for Supervised Learning & Linear Regression.
 * Features main paradigm title, rich educational explanations, real-world scenario SVG diagram,
 * and step-by-step filmstrip mini SVGs.
 */
const Explanation = () => {
  return (
    <div className="space-y-8 text-slate-900 leading-relaxed font-sans">
      {/* Main Paradigm Title & Overview Header */}
      <section className="bg-slate-900 text-white p-6 border border-slate-900 rounded-sm">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-300 block mb-1">
          Machine Learning Paradigm #1
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-white mb-2">
          SUPERVISED LEARNING: Linear Regression
        </h1>
        <p className="text-xs text-slate-300 leading-relaxed">
          Supervised Learning algorithms learn by example. The algorithm is provided with a training dataset containing input features <em>(X)</em> paired with correct ground-truth target labels <em>(Y)</em>. The goal is to learn a mapping function <em>f(X) → Y</em> that accurately predicts outcomes for new, unseen data.
        </p>
      </section>

      {/* Main Concept Explanation */}
      <section className="bg-slate-50 p-6 border border-slate-300 rounded-sm space-y-3">
        <h2 className="text-base font-bold text-slate-900">
          Understanding Linear Regression
        </h2>
        <p className="text-xs text-slate-700 leading-relaxed">
          Linear Regression is the simplest and most widely used supervised learning technique for <strong>continuous prediction problems</strong>. It fits a straight line <strong>y = m · x + b</strong> to data points by adjusting two parameters:
        </p>
        <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 font-normal pl-2">
          <li><strong>Slope (m):</strong> Controls the steepness and direction of the relationship between feature <em>x</em> and target <em>y</em>.</li>
          <li><strong>Intercept (b):</strong> The baseline prediction value when feature <em>x = 0</em>.</li>
        </ul>
      </section>

      {/* Real-World Scenario Example with Dedicated SVG Diagram */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-900 pb-2">
          Real-World Example: Real Estate House Price Prediction
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-white p-5 border border-slate-300 rounded-sm">
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900">How House Pricing Uses Supervised Learning</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Suppose a real estate agency wants to predict house prices. They collect historical records of sold houses:
            </p>
            <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
              <li><strong>Input Feature (X):</strong> House size in square meters (e.g. 80 m², 150 m², 220 m²).</li>
              <li><strong>Labeled Target (Y):</strong> Actual selling price in thousands of dollars (e.g. $200k, $350k, $500k).</li>
            </ul>
            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              Linear regression fits the best line through these historical labeled pairs. Once trained, when a seller lists a new 180 m² house, the model uses the line to predict its market price!
            </p>
          </div>

          {/* Real-World Scenario SVG Illustration */}
          <div className="flex flex-col items-center justify-center border border-slate-200 p-3 bg-slate-50">
            <svg viewBox="0 0 320 200" className="w-full h-auto max-w-[300px]" fill="none">
              <rect width="320" height="200" fill="#ffffff" />
              {/* Axes */}
              <line x1="35" y1="170" x2="300" y2="170" stroke="#000000" strokeWidth="1.5" />
              <line x1="35" y1="170" x2="35" y2="20" stroke="#000000" strokeWidth="1.5" />
              <text x="290" y="190" fontSize="9" fontFamily="sans-serif" fontWeight="bold" fill="#000">Size (m²)</text>
              <text x="10" y="25" fontSize="9" fontFamily="sans-serif" fontWeight="bold" fill="#000">Price ($k)</text>

              {/* Labeled Data Points */}
              <circle cx="65" cy="140" r="4" fill="#000000" />
              <circle cx="110" cy="115" r="4" fill="#000000" />
              <circle cx="160" cy="90" r="4" fill="#000000" />
              <circle cx="210" cy="65" r="4" fill="#000000" />

              {/* Fitted Supervised Model Line */}
              <line x1="45" y1="150" x2="280" y2="30" stroke="#dc2626" strokeWidth="2" />

              {/* Unseen New Point Prediction */}
              <line x1="240" y1="170" x2="240" y2="50" stroke="#2563eb" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="35" y1="50" x2="240" y2="50" stroke="#2563eb" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="240" cy="50" r="5" fill="#2563eb" stroke="#000" strokeWidth="1" />
              <text x="145" y="44" fontSize="8" fontFamily="sans-serif" fontWeight="bold" fill="#2563eb">Predicted Price $440k</text>
              <text x="205" y="182" fontSize="8" fontFamily="sans-serif" fontWeight="bold" fill="#2563eb">New House (180 m²)</text>
            </svg>
            <span className="text-[10px] text-slate-500 font-mono mt-1 text-center">
              Figure 1.1: Supervised House Price Prediction Line
            </span>
          </div>
        </div>
      </section>

      {/* How it works: Step-by-Step with Filmstrip Mini SVG Diagrams */}
      <section className="space-y-6">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-900 pb-2">
          How Gradient Descent Fits the Model — Step by Step
        </h3>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white p-4 border border-slate-300 rounded-sm">
            <div className="sm:col-span-2 space-y-1">
              <span className="text-xs font-mono font-bold text-red-600 block">Step 1</span>
              <h4 className="text-sm font-bold text-slate-900">Start with a random line</h4>
              <p className="text-xs text-slate-600">
                Initialize the slope <em>m</em> and intercept <em>b</em> with arbitrary initial values (e.g. <em>m = 0, b = 0.2</em>). This places an initial line across the data space before optimization.
              </p>
            </div>
            <div className="flex justify-center border border-slate-200 p-2 bg-slate-50">
              <svg viewBox="0 0 140 90" className="w-32 h-20" fill="none">
                <rect width="140" height="90" fill="#ffffff" />
                <line x1="15" y1="75" x2="125" y2="75" stroke="#000000" strokeWidth="1" />
                <line x1="15" y1="75" x2="15" y2="10" stroke="#000000" strokeWidth="1" />
                <line x1="15" y1="55" x2="125" y2="55" stroke="#dc2626" strokeWidth="1.5" />
                <circle cx="35" cy="65" r="2.5" fill="#000000" />
                <circle cx="65" cy="40" r="2.5" fill="#000000" />
                <circle cx="95" cy="25" r="2.5" fill="#000000" />
              </svg>
            </div>
          </div>

          {/* Step 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white p-4 border border-slate-300 rounded-sm">
            <div className="sm:col-span-2 space-y-1">
              <span className="text-xs font-mono font-bold text-red-600 block">Step 2</span>
              <h4 className="text-sm font-bold text-slate-900">Calculate the error (residuals)</h4>
              <p className="text-xs text-slate-600">
                For each training point <em>(x<sub>i</sub>, y<sub>i</sub>)</em>, compute prediction error <em>e<sub>i</sub> = y_pred - y<sub>i</sub></em>. Total model error is measured using Mean Squared Error (MSE).
              </p>
            </div>
            <div className="flex justify-center border border-slate-200 p-2 bg-slate-50">
              <svg viewBox="0 0 140 90" className="w-32 h-20" fill="none">
                <rect width="140" height="90" fill="#ffffff" />
                <line x1="15" y1="75" x2="125" y2="75" stroke="#000000" strokeWidth="1" />
                <line x1="15" y1="75" x2="15" y2="10" stroke="#000000" strokeWidth="1" />
                <line x1="15" y1="55" x2="125" y2="55" stroke="#dc2626" strokeWidth="1.5" />
                <line x1="35" y1="65" x2="35" y2="55" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="65" y1="40" x2="65" y2="55" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="95" y1="25" x2="95" y2="55" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
                <circle cx="35" cy="65" r="2.5" fill="#000000" />
                <circle cx="65" cy="40" r="2.5" fill="#000000" />
                <circle cx="95" cy="25" r="2.5" fill="#000000" />
              </svg>
            </div>
          </div>

          {/* Step 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white p-4 border border-slate-300 rounded-sm">
            <div className="sm:col-span-2 space-y-1">
              <span className="text-xs font-mono font-bold text-red-600 block">Step 3</span>
              <h4 className="text-sm font-bold text-slate-900">Adjust slope & intercept (Gradient Descent)</h4>
              <p className="text-xs text-slate-600">
                Calculate partial gradients of MSE with respect to <em>m</em> and <em>b</em>. Update parameters in small steps opposite to the gradient.
              </p>
            </div>
            <div className="flex justify-center border border-slate-200 p-2 bg-slate-50">
              <svg viewBox="0 0 140 90" className="w-32 h-20" fill="none">
                <rect width="140" height="90" fill="#ffffff" />
                <line x1="15" y1="75" x2="125" y2="75" stroke="#000000" strokeWidth="1" />
                <line x1="15" y1="75" x2="15" y2="10" stroke="#000000" strokeWidth="1" />
                <line x1="15" y1="65" x2="125" y2="35" stroke="#dc2626" strokeWidth="1.5" />
                <circle cx="35" cy="65" r="2.5" fill="#000000" />
                <circle cx="65" cy="40" r="2.5" fill="#000000" />
                <circle cx="95" cy="25" r="2.5" fill="#000000" />
              </svg>
            </div>
          </div>

          {/* Step 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white p-4 border border-slate-300 rounded-sm">
            <div className="sm:col-span-2 space-y-1">
              <span className="text-xs font-mono font-bold text-red-600 block">Step 4</span>
              <h4 className="text-sm font-bold text-slate-900">Repeat until error stops decreasing</h4>
              <p className="text-xs text-slate-600">
                Repeat parameter updates frame-by-frame until gradients approach zero and MSE loss minimizes, converging to the optimal line of best fit.
              </p>
            </div>
            <div className="flex justify-center border border-slate-200 p-2 bg-slate-50">
              <svg viewBox="0 0 140 90" className="w-32 h-20" fill="none">
                <rect width="140" height="90" fill="#ffffff" />
                <line x1="15" y1="75" x2="125" y2="75" stroke="#000000" strokeWidth="1" />
                <line x1="15" y1="75" x2="15" y2="10" stroke="#000000" strokeWidth="1" />
                <line x1="15" y1="72" x2="125" y2="18" stroke="#dc2626" strokeWidth="1.5" />
                <circle cx="35" cy="65" r="2.5" fill="#000000" />
                <circle cx="65" cy="40" r="2.5" fill="#000000" />
                <circle cx="95" cy="25" r="2.5" fill="#000000" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Real-World Applications List */}
      <section className="bg-slate-50 p-5 border border-slate-300 rounded-sm space-y-2">
        <h3 className="text-sm font-bold text-slate-900">
          Where is Supervised Linear Regression used in industry?
        </h3>
        <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 font-normal">
          <li><strong>Real Estate Pricing:</strong> Predicting house prices based on square meters, location, and bedroom count.</li>
          <li><strong>Financial Forecasting:</strong> Estimating stock returns, product sales volume, and quarterly revenue trends.</li>
          <li><strong>Medical Diagnostics:</strong> Modeling blood pressure changes based on patient age and medication dosage.</li>
        </ul>
      </section>
    </div>
  );
};

export default Explanation;
