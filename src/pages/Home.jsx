import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const demos = [
    {
      id: 'linear-regression',
      title: 'Linear Regression',
      path: '/linear-regression',
      paradigm: 'Supervised Learning',
      description: 'Supervised Learning: The model learns to predict continuous target labels by minimizing mean squared error via gradient descent.'
    },
    {
      id: 'kmeans',
      title: 'K-Means Clustering',
      path: '/kmeans',
      paradigm: 'Unsupervised Learning',
      description: 'Unsupervised Learning: The algorithm discovers intrinsic grouping patterns in unlabeled spatial data through iterative centroid updates.'
    },
    {
      id: 'gridworld',
      title: 'Gridworld Pathfinding',
      path: '/gridworld',
      paradigm: 'Reinforcement Learning',
      description: 'Reinforcement Learning: The agent learns an optimal navigation policy through trial-and-error Q-learning rewards with no prior data.'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Machine Learning Visualizer
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Interactive educational demonstrations of core machine learning paradigms.
        </p>
      </div>

      <div className="space-y-6">
        {demos.map((demo) => (
          <Link
            key={demo.id}
            to={demo.path}
            className="block p-5 bg-white border border-slate-900 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold text-slate-900">
                {demo.title}
              </h2>
              <span className="text-xs font-mono font-medium px-2 py-0.5 border border-slate-900 bg-slate-100 text-slate-800">
                {demo.paradigm}
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {demo.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
