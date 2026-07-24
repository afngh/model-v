import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import LinearRegression from './pages/LinearRegression';
import KMeans from './pages/KMeans';
import Gridworld from './pages/Gridworld';
import MNIST from './pages/MNIST';
import LLM from './pages/LLM';

function Header() {
  return (
    <header className="border-b border-slate-900 bg-white px-6 py-3">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <NavLink to="/" className="text-base font-bold tracking-tight text-slate-900 hover:underline">
          ML Visualizer
        </NavLink>
        <nav className="flex flex-wrap items-center gap-4 text-xs font-medium">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "text-slate-900 font-bold underline" : "text-slate-600 hover:text-slate-900"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/linear-regression"
            className={({ isActive }) =>
              isActive ? "text-slate-900 font-bold underline" : "text-slate-600 hover:text-slate-900"
            }
          >
            Linear Regression
          </NavLink>
          <NavLink
            to="/kmeans"
            className={({ isActive }) =>
              isActive ? "text-slate-900 font-bold underline" : "text-slate-600 hover:text-slate-900"
            }
          >
            K-Means
          </NavLink>
          <NavLink
            to="/gridworld"
            className={({ isActive }) =>
              isActive ? "text-slate-900 font-bold underline" : "text-slate-600 hover:text-slate-900"
            }
          >
            Gridworld RL
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/linear-regression" element={<LinearRegression />} />
            <Route path="/kmeans" element={<KMeans />} />
            <Route path="/gridworld" element={<Gridworld />} />
            <Route path="/mnist" element={<MNIST />} />
            <Route path="/llm" element={<LLM />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
