import React from 'react';

/**
 * GeeksforGeeks / W3Schools style tutorial explanation for Supervised Deep Learning & MNIST Digit Classification.
 */
const Explanation = () => {
  return (
    <div className="space-y-8 text-slate-900 leading-relaxed font-sans">
      {/* Main Paradigm Title & Overview Header */}
      <section className="bg-slate-900 text-white p-6 border border-slate-900 rounded-sm">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-300 block mb-1">
          Machine Learning Paradigm #4
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-white mb-2">
          SUPERVISED DEEP LEARNING: MNIST Digit Classifier
        </h1>
        <p className="text-xs text-slate-300 leading-relaxed">
          Deep Learning uses multi-layered <strong>Artificial Neural Networks (ANNs)</strong> to automatically extract hierarchical features from complex raw inputs like images, audio, and text. The <strong>MNIST dataset</strong> (70,000 labeled 28x28 handwritten digit images) is the iconic benchmark for image classification.
        </p>
      </section>

      {/* Main Concept Explanation */}
      <section className="bg-slate-50 p-6 border border-slate-300 rounded-sm space-y-3">
        <h2 className="text-base font-bold text-slate-900">
          How Neural Networks Classify Handwritten Digits
        </h2>
        <p className="text-xs text-slate-700 leading-relaxed">
          A neural network consists of layers of interconnected artificial <strong>neurons</strong> (nodes) connected by trainable <strong>weights</strong>:
        </p>
        <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 font-normal pl-2">
          <li><strong>Input Layer:</strong> 784 neurons receiving the grayscale intensity values of a 28x28 pixel grid.</li>
          <li><strong>Hidden Layers:</strong> Compute feature activations using non-linear functions like ReLU: <em>a = max(0, ∑ w·x + b)</em>.</li>
          <li><strong>Output Layer:</strong> 10 Softmax neurons producing a probability distribution for digits 0 through 9 summing to 100%.</li>
        </ul>
        <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200">
          ℹ️ Note: This visualizer runs <strong>inference-only</strong> directly inside your browser. Training complex neural networks is performed offline using GPU clusters.
        </div>
      </section>

      {/* How it works: Step-by-Step with Filmstrip Mini SVG Diagrams */}
      <section className="space-y-6">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-900 pb-2">
          How the Neural Network Computes Predictions — Step by Step
        </h3>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white p-4 border border-slate-300 rounded-sm">
            <div className="sm:col-span-2 space-y-1">
              <span className="text-xs font-mono font-bold text-red-600 block">Step 1</span>
              <h4 className="text-sm font-bold text-slate-900">Pixel Grayscale Normalization</h4>
              <p className="text-xs text-slate-600">
                The drawn canvas stroke is downsampled to a 28x28 pixel grid. Each pixel value is converted to a normalized floating-point number between 0.0 (white background) and 1.0 (black stroke).
              </p>
            </div>
            <div className="flex justify-center border border-slate-200 p-2 bg-slate-50">
              <svg viewBox="0 0 140 90" className="w-32 h-20" fill="none">
                <rect width="140" height="90" fill="#ffffff" />
                <rect x="35" y="10" width="70" height="70" stroke="#000" strokeWidth="1" fill="#fff" />
                <line x1="58.3" y1="10" x2="58.3" y2="80" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="81.6" y1="10" x2="81.6" y2="80" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="35" y1="33.3" x2="105" y2="33.3" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="35" y1="56.6" x2="105" y2="56.6" stroke="#cbd5e1" strokeWidth="1" />
                <path d="M 45 20 L 95 20 L 65 70" stroke="#000" strokeWidth="3" fill="none" />
              </svg>
            </div>
          </div>

          {/* Step 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white p-4 border border-slate-300 rounded-sm">
            <div className="sm:col-span-2 space-y-1">
              <span className="text-xs font-mono font-bold text-red-600 block">Step 2</span>
              <h4 className="text-sm font-bold text-slate-900">Feed Values to Input Layer Neurons</h4>
              <p className="text-xs text-slate-600">
                All 784 pixel intensity values are flattened into a 1D vector and fed simultaneously into the 784 neurons of the input layer.
              </p>
            </div>
            <div className="flex justify-center border border-slate-200 p-2 bg-slate-50">
              <svg viewBox="0 0 140 90" className="w-32 h-20" fill="none">
                <rect width="140" height="90" fill="#ffffff" />
                <circle cx="30" cy="20" r="5" fill="#000" stroke="#000" />
                <circle cx="30" cy="45" r="5" fill="#64748b" stroke="#000" />
                <circle cx="30" cy="70" r="5" fill="#000" stroke="#000" />
                <line x1="35" y1="20" x2="100" y2="45" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="35" y1="45" x2="100" y2="45" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="35" y1="70" x2="100" y2="45" stroke="#cbd5e1" strokeWidth="1" />
                <circle cx="105" cy="45" r="7" fill="#ffffff" stroke="#000" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          {/* Step 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white p-4 border border-slate-300 rounded-sm">
            <div className="sm:col-span-2 space-y-1">
              <span className="text-xs font-mono font-bold text-red-600 block">Step 3</span>
              <h4 className="text-sm font-bold text-slate-900">Weighted Sum & Activation Function</h4>
              <p className="text-xs text-slate-600">
                Each hidden neuron multiplies inputs by learned weights $w$, adds a bias $b$, and applies a ReLU activation: <em>z = max(0, ∑ w·x + b)</em>.
              </p>
            </div>
            <div className="flex justify-center border border-slate-200 p-2 bg-slate-50">
              <svg viewBox="0 0 140 90" className="w-32 h-20" fill="none">
                <rect width="140" height="90" fill="#ffffff" />
                <circle cx="40" cy="45" r="14" fill="#f8fafc" stroke="#000" strokeWidth="1.5" />
                <text x="40" y="48" fontSize="8" fontFamily="sans-serif" textAnchor="middle">∑w·x+b</text>

                <path d="M 58 45 L 82 45 M 76 40 L 82 45 L 76 50" stroke="#000" strokeWidth="1.2" />

                <rect x="85" y="30" width="30" height="30" fill="#ffffff" stroke="#000" strokeWidth="1.5" />
                <path d="M 90 52 L 100 52 L 110 36" stroke="#dc2626" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
          </div>

          {/* Step 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white p-4 border border-slate-300 rounded-sm">
            <div className="sm:col-span-2 space-y-1">
              <span className="text-xs font-mono font-bold text-red-600 block">Step 4</span>
              <h4 className="text-sm font-bold text-slate-900">Layer-by-Layer Forward Pass</h4>
              <p className="text-xs text-slate-600">
                Activations propagate forward through successive hidden layers, extracting high-level visual features like curves, loops, and intersections.
              </p>
            </div>
            <div className="flex justify-center border border-slate-200 p-2 bg-slate-50">
              <svg viewBox="0 0 140 90" className="w-32 h-20" fill="none">
                <rect width="140" height="90" fill="#ffffff" />
                <g stroke="#000" strokeWidth="1">
                  <circle cx="25" cy="25" r="4" fill="#000" />
                  <circle cx="25" cy="65" r="4" fill="#000" />
                  <circle cx="70" cy="25" r="4" fill="#64748b" />
                  <circle cx="70" cy="65" r="4" fill="#000" />
                  <circle cx="115" cy="45" r="5" fill="#dc2626" />

                  <line x1="29" y1="25" x2="66" y2="25" />
                  <line x1="29" y1="25" x2="66" y2="65" />
                  <line x1="29" y1="65" x2="66" y2="65" />
                  <line x1="74" y1="65" x2="110" y2="45" />
                </g>
              </svg>
            </div>
          </div>

          {/* Step 5 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white p-4 border border-slate-300 rounded-sm">
            <div className="sm:col-span-2 space-y-1">
              <span className="text-xs font-mono font-bold text-red-600 block">Step 5</span>
              <h4 className="text-sm font-bold text-slate-900">Output Layer Softmax Probabilities</h4>
              <p className="text-xs text-slate-600">
                The 10 output neurons apply the Softmax activation function to convert raw scores into confidence percentages summing to 100%. The highest probability digit is selected as prediction.
              </p>
            </div>
            <div className="flex justify-center border border-slate-200 p-2 bg-slate-50">
              <svg viewBox="0 0 140 90" className="w-32 h-20" fill="none">
                <rect width="140" height="90" fill="#ffffff" />
                <g fontSize="8" fontFamily="monospace">
                  <text x="15" y="25">0: 2%</text>
                  <rect x="45" y="19" width="5" height="6" fill="#cbd5e1" />

                  <text x="15" y="48" fontWeight="bold" fill="#dc2626">7: 94%</text>
                  <rect x="52" y="42" width="70" height="7" fill="#dc2626" />

                  <text x="15" y="70">9: 4%</text>
                  <rect x="45" y="64" width="8" height="6" fill="#cbd5e1" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Real-World Applications List */}
      <section className="bg-slate-50 p-5 border border-slate-300 rounded-sm space-y-2">
        <h3 className="text-sm font-bold text-slate-900">
          Where is MNIST Handwritten Digit Recognition used in real life?
        </h3>
        <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 font-normal">
          <li><strong>Postal ZIP Code Sorting:</strong> Automated mail sorting machines reading handwritten ZIP codes on envelopes.</li>
          <li><strong>Banking Check Processing:</strong> Mobile banking apps automatically reading dollar amounts on checks.</li>
          <li><strong>Document OCR:</strong> Digitizing paper tax forms, census documents, and handwritten feedback sheets.</li>
        </ul>
      </section>
    </div>
  );
};

export default Explanation;
