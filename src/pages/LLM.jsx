import React, { useState } from 'react';
import Explanation from '../components/llm/Explanation';
import Visualization from '../components/llm/Visualization';

const LLM = () => {
  const [activeTab, setActiveTab] = useState('explanation');

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* GeeksforGeeks / W3Schools Style Plain Text Navigation Tabs */}
      <div className="flex items-center gap-8 border-b border-slate-300 mb-8 text-sm font-sans">
        <button
          onClick={() => setActiveTab('explanation')}
          className={`pb-2.5 transition-colors focus:outline-none ${
            activeTab === 'explanation'
              ? 'border-b-2 border-slate-900 text-slate-900 font-bold'
              : 'border-b-2 border-transparent text-slate-600 hover:text-slate-900 font-medium'
          }`}
        >
          Explanation
        </button>

        <button
          onClick={() => setActiveTab('visualization')}
          className={`pb-2.5 transition-colors focus:outline-none ${
            activeTab === 'visualization'
              ? 'border-b-2 border-slate-900 text-slate-900 font-bold'
              : 'border-b-2 border-transparent text-slate-600 hover:text-slate-900 font-medium'
          }`}
        >
          Visualization
        </button>
      </div>

      {/* Tab Content Rendering */}
      {activeTab === 'explanation' ? (
        <Explanation />
      ) : (
        <Visualization />
      )}
    </div>
  );
};

export default LLM;
