import React from 'react';

/**
 * GeeksforGeeks / W3Schools style tutorial explanation for Natural Language Processing & LLM Next-Token Prediction.
 */
const Explanation = () => {
  return (
    <div className="space-y-8 text-slate-900 leading-relaxed font-sans">
      {/* Main Paradigm Title & Overview Header */}
      <section className="bg-slate-900 text-white p-6 border border-slate-900 rounded-sm">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-300 block mb-1">
          Machine Learning Paradigm #5
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-white mb-2">
          NATURAL LANGUAGE PROCESSING: LLM Next-Token Predictor
        </h1>
        <p className="text-xs text-slate-300 leading-relaxed">
          Large Language Models (LLMs) like GPT-4, Claude, and LLaMA are fundamentally <strong>next-token predictors</strong>. Given a prompt text sequence, the model calculates a probability distribution across its entire vocabulary to predict the single most likely token to follow.
        </p>
      </section>

      {/* Main Concept Explanation */}
      <section className="bg-slate-50 p-6 border border-slate-300 rounded-sm space-y-3">
        <h2 className="text-base font-bold text-slate-900">
          How Transformer Neural Networks Process Language
        </h2>
        <p className="text-xs text-slate-700 leading-relaxed">
          Modern LLMs are powered by the <strong>Transformer architecture</strong>, which introduced the <strong>Self-Attention mechanism</strong>:
        </p>
        <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 font-normal pl-2">
          <li><strong>Tokens:</strong> Words or sub-word pieces (e.g., <em>"learning"</em> $\rightarrow$ <em>["learn", "ing"]</em>).</li>
          <li><strong>Embeddings:</strong> High-dimensional numerical vectors capturing semantic meaning.</li>
          <li><strong>Self-Attention:</strong> Allows each token to look at every other token in the prompt to understand context.</li>
        </ul>
        <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200">
          ℹ️ Note: This visualizer runs <strong>inference-only</strong> client-side inside your browser using lightweight token probability distributions.
        </div>
      </section>

      {/* How it works: Step-by-Step with Filmstrip Mini SVG Diagrams */}
      <section className="space-y-6">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-900 pb-2">
          How LLMs Predict the Next Word — Step by Step
        </h3>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white p-4 border border-slate-300 rounded-sm">
            <div className="sm:col-span-2 space-y-1">
              <span className="text-xs font-mono font-bold text-blue-600 block">Step 1</span>
              <h4 className="text-sm font-bold text-slate-900">Input Tokenization</h4>
              <p className="text-xs text-slate-600">
                The input prompt text is split into discrete units called <strong>tokens</strong> (words or sub-words), forming individual token chips.
              </p>
            </div>
            <div className="flex justify-center border border-slate-200 p-2 bg-slate-50">
              <svg viewBox="0 0 140 90" className="w-32 h-20" fill="none">
                <rect width="140" height="90" fill="#ffffff" />
                <g fontSize="8" fontFamily="monospace" stroke="#000" strokeWidth="1">
                  <rect x="15" y="35" width="30" height="18" fill="#fff" />
                  <text x="30" y="47" textAnchor="middle" stroke="none">The</text>

                  <rect x="50" y="35" width="35" height="18" fill="#fff" />
                  <text x="67.5" y="47" textAnchor="middle" stroke="none">quick</text>

                  <rect x="90" y="35" width="35" height="18" fill="#fff" />
                  <text x="107.5" y="47" textAnchor="middle" stroke="none">brown</text>
                </g>
              </svg>
            </div>
          </div>

          {/* Step 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white p-4 border border-slate-300 rounded-sm">
            <div className="sm:col-span-2 space-y-1">
              <span className="text-xs font-mono font-bold text-blue-600 block">Step 2</span>
              <h4 className="text-sm font-bold text-slate-900">Vector Embeddings</h4>
              <p className="text-xs text-slate-600">
                Each token is mapped to a vector of numbers representing its mathematical location in semantic concept space.
              </p>
            </div>
            <div className="flex justify-center border border-slate-200 p-2 bg-slate-50">
              <svg viewBox="0 0 140 90" className="w-32 h-20" fill="none">
                <rect width="140" height="90" fill="#ffffff" />
                <rect x="25" y="25" width="90" height="40" fill="#f8fafc" stroke="#000" strokeWidth="1" />
                <text x="70" y="48" fontSize="8" fontFamily="monospace" textAnchor="middle">[0.42, -0.18, 0.89, ...]</text>
              </svg>
            </div>
          </div>

          {/* Step 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white p-4 border border-slate-300 rounded-sm">
            <div className="sm:col-span-2 space-y-1">
              <span className="text-xs font-mono font-bold text-blue-600 block">Step 3</span>
              <h4 className="text-sm font-bold text-slate-900">Self-Attention Mechanism</h4>
              <p className="text-xs text-slate-600">
                The model computes attention scores between all tokens in the prompt, dynamically weighting contextual relationships (e.g. connecting <em>"brown"</em> to <em>"fox"</em>).
              </p>
            </div>
            <div className="flex justify-center border border-slate-200 p-2 bg-slate-50">
              <svg viewBox="0 0 140 90" className="w-32 h-20" fill="none">
                <rect width="140" height="90" fill="#ffffff" />
                <circle cx="30" cy="45" r="8" fill="#fff" stroke="#000" strokeWidth="1" />
                <circle cx="70" cy="45" r="8" fill="#fff" stroke="#000" strokeWidth="1" />
                <circle cx="110" cy="45" r="8" fill="#fff" stroke="#000" strokeWidth="1" />

                <path d="M 30 37 Q 50 15 70 37" stroke="#2563eb" strokeWidth="1.2" strokeDasharray="2 2" />
                <path d="M 70 37 Q 90 15 110 37" stroke="#2563eb" strokeWidth="1.2" strokeDasharray="2 2" />
                <path d="M 30 53 Q 70 75 110 53" stroke="#2563eb" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          {/* Step 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white p-4 border border-slate-300 rounded-sm">
            <div className="sm:col-span-2 space-y-1">
              <span className="text-xs font-mono font-bold text-blue-600 block">Step 4</span>
              <h4 className="text-sm font-bold text-slate-900">Probability Distribution Computation</h4>
              <p className="text-xs text-slate-600">
                The final layer passes logits through a Softmax function to compute probabilities for every vocabulary word.
              </p>
            </div>
            <div className="flex justify-center border border-slate-200 p-2 bg-slate-50">
              <svg viewBox="0 0 140 90" className="w-32 h-20" fill="none">
                <rect width="140" height="90" fill="#ffffff" />
                <g fontSize="8" fontFamily="monospace">
                  <text x="15" y="30" fontWeight="bold" fill="#2563eb">"fox": 75%</text>
                  <rect x="65" y="24" width="55" height="7" fill="#2563eb" />

                  <text x="15" y="60">"bear": 18%</text>
                  <rect x="65" y="54" width="18" height="7" fill="#cbd5e1" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Real-World Applications List */}
      <section className="bg-slate-50 p-5 border border-slate-300 rounded-sm space-y-2">
        <h3 className="text-sm font-bold text-slate-900">
          Where is Next-Token Prediction used in real life?
        </h3>
        <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 font-normal">
          <li><strong>AI Chatbots (ChatGPT, Claude):</strong> Generating human-like conversational responses word-by-word.</li>
          <li><strong>Smart Autocomplete / Autocorrect:</strong> Mobile keyboard predictive text suggesting your next word.</li>
          <li><strong>Code Generation (GitHub Copilot):</strong> Autocompleting functions, classes, and code syntax automatically.</li>
        </ul>
      </section>
    </div>
  );
};

export default Explanation;
