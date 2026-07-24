/**
 * Neural Network Inference Engine for MNIST Digit Classification.
 * Computes forward pass activations (Input -> Hidden Layer -> Output Softmax).
 */

// Generate deterministic weight matrices for digit feature detection
function createDigitWeights() {
  const inputDim = 784; // 28x28 grid
  const hiddenDim = 16;  // 16 feature detectors
  const outputDim = 10;  // Digits 0-9

  // Hidden layer weights W1 (784 x 16)
  const W1 = [];
  for (let h = 0; h < hiddenDim; h++) {
    const row = new Float32Array(inputDim);
    for (let i = 0; i < inputDim; i++) {
      const r = Math.floor(i / 28);
      const c = i % 28;

      if (h === 0) row[i] = (c >= 12 && c <= 16 && r >= 4 && r <= 24) ? 1.5 : -0.3;
      else if (h === 1) row[i] = (r >= 4 && r <= 8 && c >= 6 && c <= 22) ? 1.2 : -0.2;
      else if (h === 2) row[i] = (r >= 12 && r <= 16 && c >= 6 && c <= 22) ? 1.2 : -0.2;
      else if (h === 3) row[i] = (r >= 20 && r <= 24 && c >= 6 && c <= 22) ? 1.2 : -0.2;
      else if (h === 4) row[i] = (c >= 4 && c <= 8 && r >= 4 && r <= 14) ? 1.2 : -0.2;
      else if (h === 5) row[i] = (c >= 20 && c <= 24 && r >= 4 && r <= 14) ? 1.2 : -0.2;
      else if (h === 6) row[i] = (c >= 4 && c <= 8 && r >= 14 && r <= 24) ? 1.2 : -0.2;
      else if (h === 7) row[i] = (c >= 20 && c <= 24 && r >= 14 && r <= 24) ? 1.2 : -0.2;
      else if (h === 8) row[i] = (Math.abs(r - c) <= 3) ? 1.0 : -0.2;
      else if (h === 9) row[i] = (Math.abs(r + c - 28) <= 3) ? 1.0 : -0.2;
      else row[i] = ((i + h) % 2 === 0 ? 0.8 : -0.5);
    }
    W1.push(row);
  }

  // Output weights W2 (10 x 16) mapping hidden feature activations to digits 0-9
  const W2 = [
    [ -1.0,  0.8, -0.5,  0.8,  0.8,  0.8,  0.8,  0.8, -0.5, -0.5,  0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ], // 0
    [  3.0, -1.0, -1.0, -1.0, -1.0,  0.5, -1.0,  0.5, -1.0, -1.0,  0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ], // 1
    [ -1.0,  1.2,  1.2,  1.2, -1.0,  1.2,  1.2, -1.0, -0.5,  0.5,  0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ], // 2
    [ -1.0,  1.2,  1.2,  1.2, -1.0,  1.2, -1.0,  1.2, -0.5, -0.5,  0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ], // 3
    [ -0.5, -1.0,  1.5, -1.0,  1.5,  1.5, -1.0,  1.5, -0.5, -0.5,  0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ], // 4
    [ -1.0,  1.2,  1.2,  1.2,  1.2, -1.0, -1.0,  1.2, -0.5, -0.5,  0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ], // 5
    [ -1.0,  0.8,  1.2,  1.2,  1.2, -1.0,  1.2,  1.2, -0.5, -0.5,  0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ], // 6
    [ -1.0,  1.5, -1.0, -1.0, -1.0,  1.2, -1.0,  1.2, -0.5,  2.0,  0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ], // 7
    [ -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -0.5, -0.5,  0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ], // 8
    [ -1.0,  1.2,  1.2, -1.0,  1.2,  1.2, -1.0,  1.2, -0.5, -0.5,  0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ]  // 9
  ];

  return { W1, W2 };
}

export const { W1, W2 } = createDigitWeights();

/**
 * Runs forward pass inference on 784 normalized pixel array.
 */
export function predictDigit(pixels784) {
  const hiddenDim = 16;
  const outputDim = 10;

  // 1. Hidden Layer Activation (ReLU: max(0, z))
  const hiddenActivations = new Float32Array(hiddenDim);
  for (let h = 0; h < hiddenDim; h++) {
    let dot = 0;
    const wRow = W1[h];
    for (let i = 0; i < 784; i++) {
      dot += pixels784[i] * wRow[i];
    }
    hiddenActivations[h] = Math.max(0, dot);
  }

  // 2. Output Layer Logits
  const logits = new Float32Array(outputDim);
  for (let d = 0; d < outputDim; d++) {
    let dot = 0;
    const wRow = W2[d];
    for (let h = 0; h < hiddenDim; h++) {
      dot += hiddenActivations[h] * wRow[h];
    }
    logits[d] = dot;
  }

  // 3. Softmax Probabilities
  let maxLogit = -Infinity;
  for (let d = 0; d < outputDim; d++) {
    if (logits[d] > maxLogit) maxLogit = logits[d];
  }

  const exps = new Float32Array(outputDim);
  let expSum = 0;
  for (let d = 0; d < outputDim; d++) {
    const e = Math.exp(logits[d] - maxLogit);
    exps[d] = e;
    expSum += e;
  }

  const probabilities = new Float32Array(outputDim);
  let predictedDigit = 0;
  let maxProb = -1;

  for (let d = 0; d < outputDim; d++) {
    const prob = exps[d] / expSum;
    probabilities[d] = prob;
    if (prob > maxProb) {
      maxProb = prob;
      predictedDigit = d;
    }
  }

  return {
    predictedDigit,
    probabilities,
    activations: {
      input: pixels784,
      hidden: hiddenActivations,
      output: probabilities
    }
  };
}
