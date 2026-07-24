import React from 'react';

/**
 * GeeksforGeeks / W3Schools style tutorial explanation for Reinforcement Learning & Gridworld Q-Learning.
 * Features main paradigm title, rich educational explanations, real-world scenario SVG diagram,
 * and step-by-step filmstrip mini SVGs.
 */
const Explanation = () => {
  return (
    <div className="space-y-8 text-slate-900 leading-relaxed font-sans">
      {/* Main Paradigm Title & Overview Header */}
      <section className="bg-slate-900 text-white p-6 border border-slate-900 rounded-sm">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-300 block mb-1">
          Machine Learning Paradigm #3
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-white mb-2">
          REINFORCEMENT LEARNING: Gridworld Q-Learning
        </h1>
        <p className="text-xs text-slate-300 leading-relaxed">
          Reinforcement Learning (RL) is a goal-oriented learning framework. An autonomous <strong>Agent</strong> interacts with an <strong>Environment</strong> by taking actions and observing feedback signals: <strong>Rewards (+R)</strong> for desirable behavior and <strong>Penalties (-R)</strong> for mistakes. There are no static datasets or labeled targets—learning occurs purely through trial and error!
        </p>
      </section>

      {/* Main Concept Explanation */}
      <section className="bg-slate-50 p-6 border border-slate-300 rounded-sm space-y-3">
        <h2 className="text-base font-bold text-slate-900">
          Understanding Q-Learning Pathfinding
        </h2>
        <p className="text-xs text-slate-700 leading-relaxed">
          Q-Learning is a model-free RL algorithm that computes an optimal policy using a <strong>Q-Table</strong>. The Q-table maintains a score $Q(s, a)$ for taking action $a$ in state $s$:
        </p>
        <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 font-normal pl-2">
          <li><strong>State (s):</strong> The agent's current position on the grid.</li>
          <li><strong>Action (a):</strong> Directions the agent can move (Up, Right, Down, Left).</li>
          <li><strong>Q-Value Q(s, a):</strong> Expected cumulative future reward for taking action $a$ in state $s$.</li>
          <li><strong>Epsilon-Greedy Policy:</strong> Balances <em>exploration</em> (trying new moves) vs. <em>exploitation</em> (choosing the highest Q-value).</li>
        </ul>
      </section>

      {/* Real-World Scenario Example with Dedicated SVG Diagram */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-900 pb-2">
          Real-World Example: Autonomous Delivery Robot Navigation
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-white p-5 border border-slate-300 rounded-sm">
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900">How Robotics Uses Reinforcement Learning</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Imagine an automated warehouse delivery robot navigating a crowded floor:
            </p>
            <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
              <li><strong>Goal (+100 Reward):</strong> Reaching the charging station or package drop zone.</li>
              <li><strong>Hazard (-25 Penalty):</strong> Colliding with obstacles, stairs, or human workers.</li>
              <li><strong>Step Cost (-1 Penalty):</strong> Encourages finding the shortest, fastest route.</li>
            </ul>
            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              Without any pre-programmed map or human instructions, the robot tries different routes across thousands of simulated episodes until it masters the collision-free optimal path!
            </p>
          </div>

          {/* Real-World Scenario SVG Illustration */}
          <div className="flex flex-col items-center justify-center border border-slate-200 p-3 bg-slate-50">
            <svg viewBox="0 0 320 200" className="w-full h-auto max-w-[300px]" fill="none">
              <rect width="320" height="200" fill="#ffffff" />

              {/* Warehouse Floor Grid */}
              <rect x="35" y="20" width="250" height="160" stroke="#000" strokeWidth="1" fill="#ffffff" />
              <line x1="97.5" y1="20" x2="97.5" y2="180" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="160" y1="20" x2="160" y2="180" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="222.5" y1="20" x2="222.5" y2="180" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="35" y1="60" x2="285" y2="60" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="35" y1="100" x2="285" y2="100" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="35" y1="140" x2="285" y2="140" stroke="#cbd5e1" strokeWidth="1" />

              {/* Start Cell */}
              <rect x="36" y="21" width="60" height="38" fill="#d1fae5" />
              <text x="66" y="44" fontSize="9" fontFamily="sans-serif" fontWeight="bold" fill="#065f46" textAnchor="middle">ROBOT</text>

              {/* Goal Cell (Charging Station) */}
              <rect x="223" y="141" width="61" height="38" fill="#fef3c7" />
              <text x="253" y="164" fontSize="9" fontFamily="sans-serif" fontWeight="bold" fill="#92400e" textAnchor="middle">DROP (+100)</text>

              {/* Obstacle / Hazard Cells */}
              <rect x="98" y="61" width="61" height="38" fill="#fee2e2" />
              <text x="128" y="84" fontSize="8" fontFamily="sans-serif" fontWeight="bold" fill="#991b1b" textAnchor="middle">OBSTACLE</text>
              <rect x="161" y="61" width="61" height="38" fill="#fee2e2" />
              <text x="191" y="84" fontSize="8" fontFamily="sans-serif" fontWeight="bold" fill="#991b1b" textAnchor="middle">OBSTACLE</text>

              {/* Dotted Learned Optimal Path */}
              <path d="M 66 40 L 66 120 L 253 120 L 253 150" stroke="#2563eb" strokeWidth="2.5" strokeDasharray="4 4" fill="none" />
              <circle cx="66" cy="40" r="5" fill="#2563eb" stroke="#000" strokeWidth="1" />
            </svg>
            <span className="text-[10px] text-slate-500 font-mono mt-1 text-center">
              Figure 3.1: Reinforcement Learning Robot Navigation
            </span>
          </div>
        </div>
      </section>

      {/* How it works: Step-by-Step with Filmstrip Mini SVG Diagrams */}
      <section className="space-y-6">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-900 pb-2">
          How Q-Learning Works — Step by Step
        </h3>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white p-4 border border-slate-300 rounded-sm">
            <div className="sm:col-span-2 space-y-1">
              <span className="text-xs font-mono font-bold text-emerald-700 block">Step 1</span>
              <h4 className="text-sm font-bold text-slate-900">Agent starts with no knowledge of the grid</h4>
              <p className="text-xs text-slate-600">
                All Q-values in the Q-table are initialized to zero: <em>Q(s, a) = 0</em>. The agent does not know where goals or hazard obstacles are located.
              </p>
            </div>
            <div className="flex justify-center border border-slate-200 p-2 bg-slate-50">
              <svg viewBox="0 0 140 90" className="w-32 h-20" fill="none">
                <rect width="140" height="90" fill="#ffffff" />
                <rect x="25" y="10" width="90" height="70" stroke="#000" strokeWidth="1" fill="#fff" />
                <line x1="55" y1="10" x2="55" y2="80" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="85" y1="10" x2="85" y2="80" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="25" y1="45" x2="115" y2="45" stroke="#cbd5e1" strokeWidth="1" />
                <circle cx="40" cy="27.5" r="4" fill="#2563eb" />
                <text x="40" y="70" fontSize="8" fontFamily="monospace" textAnchor="middle" fill="#64748b">Q(s,a) = 0</text>
              </svg>
            </div>
          </div>

          {/* Step 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white p-4 border border-slate-300 rounded-sm">
            <div className="sm:col-span-2 space-y-1">
              <span className="text-xs font-mono font-bold text-emerald-700 block">Step 2</span>
              <h4 className="text-sm font-bold text-slate-900">Agent tries random actions & receives rewards/penalties</h4>
              <p className="text-xs text-slate-600">
                Using exploration, the agent takes steps. Reaching Goal grants +100, stepping into Hazard incurs -25 penalty, and each step costs -1.
              </p>
            </div>
            <div className="flex justify-center border border-slate-200 p-2 bg-slate-50">
              <svg viewBox="0 0 140 90" className="w-32 h-20" fill="none">
                <rect width="140" height="90" fill="#ffffff" />
                <rect x="25" y="10" width="90" height="70" stroke="#000" strokeWidth="1" fill="#fff" />
                <line x1="55" y1="10" x2="55" y2="80" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="85" y1="10" x2="85" y2="80" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="25" y1="45" x2="115" y2="45" stroke="#cbd5e1" strokeWidth="1" />
                <rect x="56" y="11" width="28" height="33" fill="#fee2e2" />
                <path d="M 40 27.5 L 40 62.5 L 70 62.5" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
                <circle cx="70" cy="62.5" r="4" fill="#2563eb" />
                <text x="70" y="30" fontSize="8" fontFamily="monospace" textAnchor="middle" fill="#dc2626">R = -25</text>
              </svg>
            </div>
          </div>

          {/* Step 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white p-4 border border-slate-300 rounded-sm">
            <div className="sm:col-span-2 space-y-1">
              <span className="text-xs font-mono font-bold text-emerald-700 block">Step 3</span>
              <h4 className="text-sm font-bold text-slate-900">Agent updates Q-table based on outcomes</h4>
              <p className="text-xs text-slate-600">
                After each transition, update Q-value using Bellman equation: <em>Q(s, a) ← Q(s, a) + α [ R + γ max Q(s', a') - Q(s, a) ]</em>.
              </p>
            </div>
            <div className="flex justify-center border border-slate-200 p-2 bg-slate-50">
              <svg viewBox="0 0 140 90" className="w-32 h-20" fill="none">
                <rect width="140" height="90" fill="#ffffff" />
                <rect x="25" y="10" width="90" height="70" stroke="#000" strokeWidth="1" fill="#fff" />
                <line x1="55" y1="10" x2="55" y2="80" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="85" y1="10" x2="85" y2="80" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="25" y1="45" x2="115" y2="45" stroke="#cbd5e1" strokeWidth="1" />
                <rect x="86" y="46" width="28" height="33" fill="#cbd5e1" />
                <text x="100" y="65" fontSize="8" fontFamily="monospace" textAnchor="middle" fill="#000">Q=85</text>
              </svg>
            </div>
          </div>

          {/* Step 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white p-4 border border-slate-300 rounded-sm">
            <div className="sm:col-span-2 space-y-1">
              <span className="text-xs font-mono font-bold text-emerald-700 block">Step 4</span>
              <h4 className="text-sm font-bold text-slate-900">Agent follows path with highest learned Q-values</h4>
              <p className="text-xs text-slate-600">
                After training across multiple episodes, taking the action with the highest Q-value at each cell traces the optimal path bypassing hazards to the goal.
              </p>
            </div>
            <div className="flex justify-center border border-slate-200 p-2 bg-slate-50">
              <svg viewBox="0 0 140 90" className="w-32 h-20" fill="none">
                <rect width="140" height="90" fill="#ffffff" />
                <rect x="25" y="10" width="90" height="70" stroke="#000" strokeWidth="1" fill="#fff" />
                <line x1="55" y1="10" x2="55" y2="80" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="85" y1="10" x2="85" y2="80" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="25" y1="45" x2="115" y2="45" stroke="#cbd5e1" strokeWidth="1" />
                <rect x="56" y="11" width="28" height="33" fill="#fee2e2" />
                <rect x="86" y="46" width="28" height="33" fill="#fef3c7" />
                <path d="M 40 27.5 L 40 62.5 L 100 62.5" stroke="#2563eb" strokeWidth="2" fill="none" />
                <circle cx="100" cy="62.5" r="4" fill="#2563eb" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Real-World Applications List */}
      <section className="bg-slate-50 p-5 border border-slate-300 rounded-sm space-y-2">
        <h3 className="text-sm font-bold text-slate-900">
          Where is Reinforcement Learning used in industry?
        </h3>
        <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 font-normal">
          <li><strong>Autonomous Robotics:</strong> Training warehouse robots and self-driving cars to navigate around obstacles.</li>
          <li><strong>Game AI:</strong> Training agents to master games like Chess, Go, and Atari without human strategy data.</li>
          <li><strong>Resource Optimization:</strong> Managing smart grid electricity distribution and server load balancing.</li>
        </ul>
      </section>
    </div>
  );
};

export default Explanation;
