/**
 * K-Means Clustering Algorithm from scratch.
 */

/**
 * Generates synthetic 2D point data grouped into rough visual clusters.
 * Data points are normalized to [0, 1] range.
 * @param {number} numPoints - Total number of points to generate (~120-150)
 * @param {number} numClusters - Number of underlying cluster blobs (2 to 4)
 * @returns {Array<{x: number, y: number}>} Array of points
 */
export function generateClusterData(numPoints = 120, numClusters = 3) {
  const points = [];

  // Generate distinct center anchors in [0.2, 0.8] range
  const centers = [];
  for (let c = 0; c < numClusters; c++) {
    const angle = (c / numClusters) * 2 * Math.PI + Math.random() * 0.5;
    const radius = 0.25 + Math.random() * 0.1;
    centers.push({
      x: 0.5 + Math.cos(angle) * radius,
      y: 0.5 + Math.sin(angle) * radius
    });
  }

  // Gaussian noise helper (Box-Muller transform)
  const randomGaussian = (mean, stdDev) => {
    let u1 = Math.random();
    let u2 = Math.random();
    while (u1 === 0) u1 = Math.random(); // avoid log(0)
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return mean + z * stdDev;
  };

  const pointsPerCluster = Math.floor(numPoints / numClusters);
  for (let c = 0; c < numClusters; c++) {
    const center = centers[c];
    const count = (c === numClusters - 1)
      ? numPoints - points.length
      : pointsPerCluster;

    for (let i = 0; i < count; i++) {
      const x = Math.max(0.05, Math.min(0.95, randomGaussian(center.x, 0.07)));
      const y = Math.max(0.05, Math.min(0.95, randomGaussian(center.y, 0.07)));
      points.push({ x, y });
    }
  }

  // Shuffle points so they aren't pre-sorted by cluster
  for (let i = points.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [points[i], points[j]] = [points[j], points[i]];
  }

  return points;
}

/**
 * Randomly initializes K centroids from the existing data points.
 * @param {number} k - Number of centroids
 * @param {Array<{x: number, y: number}>} points - Data points
 * @returns {Array<{x: number, y: number}>} Initial centroid coordinates
 */
export function initializeCentroids(k, points) {
  if (!points || points.length === 0) {
    const fallback = [];
    for (let i = 0; i < k; i++) {
      fallback.push({ x: 0.2 + Math.random() * 0.6, y: 0.2 + Math.random() * 0.6 });
    }
    return fallback;
  }

  // Pick k unique random points from the dataset
  const indices = new Set();
  while (indices.size < Math.min(k, points.length)) {
    indices.add(Math.floor(Math.random() * points.length));
  }

  return Array.from(indices).map(idx => ({ ...points[idx] }));
}

/**
 * Assigns each data point to its nearest centroid index.
 * @param {Array<{x: number, y: number}>} points - Data points
 * @param {Array<{x: number, y: number}>} centroids - Current centroids
 * @returns {Array<number>} Cluster index assignment for each point
 */
export function assignClusters(points, centroids) {
  return points.map(point => {
    let minDistanceSq = Infinity;
    let closestIndex = 0;

    for (let c = 0; c < centroids.length; c++) {
      const centroid = centroids[c];
      const dx = point.x - centroid.x;
      const dy = point.y - centroid.y;
      const distSq = dx * dx + dy * dy;

      if (distSq < minDistanceSq) {
        minDistanceSq = distSq;
        closestIndex = c;
      }
    }

    return closestIndex;
  });
}

/**
 * Recomputes centroid positions as the mean of all points assigned to each cluster.
 * @param {Array<{x: number, y: number}>} points - Data points
 * @param {Array<number>} assignments - Cluster assignment index for each point
 * @param {number} k - Number of clusters
 * @param {Array<{x: number, y: number}>} oldCentroids - Previous centroid positions (fallback for empty clusters)
 * @returns {Array<{x: number, y: number}>} Updated centroids
 */
export function updateCentroids(points, assignments, k, oldCentroids = []) {
  const sums = Array.from({ length: k }, () => ({ x: 0, y: 0, count: 0 }));

  for (let i = 0; i < points.length; i++) {
    const clusterIdx = assignments[i];
    if (clusterIdx !== undefined && clusterIdx < k) {
      sums[clusterIdx].x += points[i].x;
      sums[clusterIdx].y += points[i].y;
      sums[clusterIdx].count += 1;
    }
  }

  return sums.map((sum, idx) => {
    if (sum.count > 0) {
      return {
        x: sum.x / sum.count,
        y: sum.y / sum.count
      };
    }
    // If cluster has 0 points assigned, keep old position or pick a random point
    return oldCentroids[idx]
      ? { ...oldCentroids[idx] }
      : { x: Math.random(), y: Math.random() };
  });
}

/**
 * Computes Within-Cluster Sum of Squares (Inertia WCSS).
 * @param {Array<{x: number, y: number}>} points - Data points
 * @param {Array<{x: number, y: number}>} centroids - Centroid coordinates
 * @param {Array<number>} assignments - Cluster assignments
 * @returns {number} Inertia (WCSS)
 */
export function calculateInertia(points, centroids, assignments) {
  if (!points || !centroids || points.length === 0) return 0;

  let inertia = 0;
  for (let i = 0; i < points.length; i++) {
    const clusterIdx = assignments[i];
    if (clusterIdx !== undefined && centroids[clusterIdx]) {
      const centroid = centroids[clusterIdx];
      const dx = points[i].x - centroid.x;
      const dy = points[i].y - centroid.y;
      inertia += dx * dx + dy * dy;
    }
  }
  return inertia;
}

/**
 * Performs one full iteration of K-Means (Assign -> Update).
 * @param {Array<{x: number, y: number}>} points - Data points
 * @param {Array<{x: number, y: number}>} centroids - Current centroids
 * @param {number} k - Number of clusters
 * @param {number} threshold - Convergence distance threshold
 * @returns {{
 *   centroids: Array<{x: number, y: number}>,
 *   assignments: Array<number>,
 *   converged: boolean,
 *   maxShift: number,
 *   inertia: number
 * }} Updated state
 */
export function stepKMeans(points, centroids, k, threshold = 0.0001) {
  if (!points || points.length === 0 || !centroids || centroids.length === 0) {
    return { centroids: [], assignments: [], converged: true, maxShift: 0, inertia: 0 };
  }

  // 1. Assign points to nearest centroid
  const assignments = assignClusters(points, centroids);

  // 2. Update centroid positions to mean of assigned points
  const newCentroids = updateCentroids(points, assignments, k, centroids);

  // 3. Check max centroid displacement
  let maxShift = 0;
  for (let c = 0; c < k; c++) {
    const dx = newCentroids[c].x - centroids[c].x;
    const dy = newCentroids[c].y - centroids[c].y;
    const shift = Math.sqrt(dx * dx + dy * dy);
    if (shift > maxShift) {
      maxShift = shift;
    }
  }

  const converged = maxShift < threshold;
  const inertia = calculateInertia(points, newCentroids, assignments);

  return {
    centroids: newCentroids,
    assignments,
    converged,
    maxShift,
    inertia
  };
}
