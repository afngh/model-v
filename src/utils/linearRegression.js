/**
 * Predicts output y for a given x using linear equation y = m * x + b
 * @param {number} x - Input x feature
 * @param {number} m - Slope
 * @param {number} b - Y-intercept
 * @returns {number} Predicted y
 */
export function predict(x, m, b) {
  return m * x + b;
}

/**
 * Calculates Mean Squared Error (MSE) loss
 * MSE = (1 / N) * sum(( (m * x_i + b) - y_i )^2)
 * @param {Array<{x: number, y: number}>} points - Normalized points array
 * @param {number} m - Slope
 * @param {number} b - Y-intercept
 * @returns {number} Mean Squared Error
 */
export function calculateMSE(points, m, b) {
  if (!points || points.length === 0) return 0;

  let totalError = 0;
  for (let i = 0; i < points.length; i++) {
    const { x, y } = points[i];
    const yHat = predict(x, m, b);
    const error = yHat - y;
    totalError += error * error;
  }
  return totalError / points.length;
}

/**
 * Performs one iteration step of Gradient Descent for simple linear regression.
 *
 * Partial Derivatives (Gradients):
 * dm = (2 / N) * sum(( (m * x_i + b) - y_i ) * x_i)
 * db = (2 / N) * sum( (m * x_i + b) - y_i )
 *
 * @param {Array<{x: number, y: number}>} points - Array of normalized {x, y} data points
 * @param {number} m - Current slope parameter
 * @param {number} b - Current intercept parameter
 * @param {number} learningRate - Step size hyperparameter (alpha)
 * @returns {{m: number, b: number}} Updated slope and intercept
 */
export function stepGradientDescent(points, m, b, learningRate) {
  if (!points || points.length === 0) {
    return { m, b };
  }

  const n = points.length;
  let dm = 0;
  let db = 0;

  for (let i = 0; i < n; i++) {
    const { x, y } = points[i];
    const error = predict(x, m, b) - y;
    dm += error * x;
    db += error;
  }

  dm = (2 / n) * dm;
  db = (2 / n) * db;

  const newM = m - learningRate * dm;
  const newB = b - learningRate * db;

  return { m: newM, b: newB };
}
