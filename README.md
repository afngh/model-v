# ML Visualizer

An interactive, beginner-friendly web app that visualizes core machine learning concepts — from classical algorithms to deep learning and language models — through hands-on demos. Built for students to *see* how ML actually works, not just read about it.

Every demo follows the same structure: an **Explanation** tab (step-by-step tutorial, like a GeeksforGeeks/W3Schools article, with mini diagrams and code snippets) and a **Visualization** tab (a live, interactive, animated demo you control).

Design language throughout: plain, matplotlib-style black-on-white — no gradients, no glassmorphism, no drop shadows. Function over flash.

---

## Tech Stack

- **Frontend:** React + Vite
- **Routing:** React Router
- **Styling:** Tailwind CSS (plain/flat theme, no default gradient utilities used)
- **Classical ML demos:** vanilla JavaScript, algorithms implemented from scratch (no ML libraries)
- **Deep learning demos:** TensorFlow.js (MNIST), Transformers.js (LLM)
- **3D visualizations:** Three.js + @react-three/fiber
- **Deployment:** Vercel

---

## Demos

### ✅ 1. Linear Regression — *Supervised Learning*
Click to place data points, watch gradient descent rotate a best-fit line into place in real time. Adjustable learning rate, live MSE loss display.

### ✅ 2. K-Means Clustering — *Unsupervised Learning*
An unlabeled scatter of points self-organizes into color-coded clusters as centroids iteratively move toward the average of their assigned points. Adjustable *k*.

### ✅ 3. Gridworld Pathfinding — *Reinforcement Learning*
Design your own maze with hazards, then train a Q-learning agent through trial and error. Watch it walk its learned optimal path once trained, with a live reward-per-episode graph.

### 🔜 4. MNIST Digit Classifier — *Deep Learning (CNN)*
*(Coming soon)*
Draw a digit by hand on a canvas; a pretrained CNN classifies it in real time. Visualized as a 3D scene (Adam Harley-style): the raw pixel grid feeds into shrinking convolution/pooling volumes, flattens into ribbon-like feature columns, passes through a dense layer, and lights up the correct digit in a final labeled output row — steppable one stage at a time, or auto-played.

**Key build notes:**
- Inference only (no in-browser training) — load a pretrained model from `/public/model/`
- CNN architecture chosen specifically so the "shrinking block" visual progression makes sense
- Step-by-step playback controls (Previous / Next / Play All) rather than one continuous animation
- Grayscale-only activation brightness, no color, matching the reference visual style

### 🔜 5. LLM Next-Token Predictor — *Language Modeling*
*(Coming soon)*
Type a sentence; a small transformer model predicts the most likely next word, shown as a ranked probability list. Visualized as a 3D pipeline: tokens fly in as blocks → become embedding columns → pass through stacked attention slabs (animated attention lines between tokens) → converge into a final inference block → output probabilities. Click a predicted word to append it and re-run.

**Key build notes:**
- Runs fully client-side via Transformers.js (WASM/WebGPU), no backend
- Attention layer count/dimensions simplified for renderable, legible geometry — not a literal match to the real model's internals
- Shares 3D rendering components with the MNIST demo (e.g. a reusable "activation column" component) for visual consistency and less duplicated code

---

## Project Structure

```
src/
  components/
    Canvas.jsx
    Slider.jsx
    Button.jsx
    diagrams/          # static SVG concept diagrams (Explanation tabs)
    three/             # shared Three.js components (MNIST + LLM)
  pages/
    Home.jsx
    LinearRegression.jsx
    KMeans.jsx
    Gridworld.jsx
    MNIST.jsx           # 🔜
    LLM.jsx             # 🔜
  utils/
    linearRegression.js
    kmeans.js
    gridworld.js
    mnistModel.js        # 🔜
    mnistInference.js     # 🔜
    llmInference.js        # 🔜
```

---

## Status

Linear Regression, K-Means, and Gridworld are complete. MNIST and LLM visualizers are specced out and planned as the next phase — see build notes above for the exact visual/technical requirements each will need to satisfy before being marked done.

## Running Locally

```bash
npm install
npm run dev
```

## Deployment

Deployed via Vercel. Push to `main` to trigger a new deployment, or run:

```bash
vercel --prod
```