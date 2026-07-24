/**
 * Gridworld Q-Learning Reinforcement Learning Utility
 */

export const GRID_SIZE = 8;
export const ACTIONS = [
  { dr: -1, dc: 0, name: 'UP' },
  { dr: 0, dc: 1, name: 'RIGHT' },
  { dr: 1, dc: 0, name: 'DOWN' },
  { dr: 0, dc: -1, name: 'LEFT' }
];

export const CELL_TYPES = {
  EMPTY: 0,
  HAZARD: 1,
  START: 2,
  GOAL: 3
};

/**
 * Creates default 8x8 grid maze configuration
 */
export function createDefaultGrid() {
  const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(CELL_TYPES.EMPTY));

  grid[0][0] = CELL_TYPES.START;
  grid[7][7] = CELL_TYPES.GOAL;

  const defaultHazards = [
    [1, 1], [1, 2], [1, 3],
    [3, 4], [4, 4], [5, 4],
    [5, 1], [5, 2], [6, 2]
  ];

  defaultHazards.forEach(([r, c]) => {
    grid[r][c] = CELL_TYPES.HAZARD;
  });

  return grid;
}

/**
 * Initializes empty Q-Table: state "r,c" -> [q_up, q_right, q_down, q_left]
 */
export function createQTable() {
  const qTable = {};
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      qTable[`${r},${c}`] = [0, 0, 0, 0];
    }
  }
  return qTable;
}

/**
 * Epsilon-greedy action selection preferring valid non-wall moves
 */
function chooseAction(r, c, qTable, epsilon) {
  const validActions = [];
  for (let a = 0; a < 4; a++) {
    const nr = r + ACTIONS[a].dr;
    const nc = c + ACTIONS[a].dc;
    if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
      validActions.push(a);
    }
  }

  if (validActions.length === 0) return 0;

  if (Math.random() < epsilon) {
    return validActions[Math.floor(Math.random() * validActions.length)];
  }

  const stateKey = `${r},${c}`;
  const qValues = qTable[stateKey] || [0, 0, 0, 0];

  let maxVal = -Infinity;
  let bestActions = [];

  validActions.forEach(a => {
    if (qValues[a] > maxVal) {
      maxVal = qValues[a];
      bestActions = [a];
    } else if (qValues[a] === maxVal) {
      bestActions.push(a);
    }
  });

  return bestActions[Math.floor(Math.random() * bestActions.length)];
}

/**
 * Executes single training episode of tabular Q-Learning.
 * Uses Exploring Starts (50% random start cell) for rapid full-grid Q-value propagation.
 */
export function trainEpisode(qTable, grid, alpha = 0.25, gamma = 0.95, epsilon = 0.2) {
  let startR = 0, startC = 0;
  let goalR = 7, goalC = 7;

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === CELL_TYPES.START) { startR = r; startC = c; }
      if (grid[r][c] === CELL_TYPES.GOAL) { goalR = r; goalC = c; }
    }
  }

  let r = startR;
  let c = startC;

  // Exploring Starts: 50% chance to start at random non-hazard position to propagate Q-values across full grid
  if (Math.random() < 0.5) {
    let randR = Math.floor(Math.random() * GRID_SIZE);
    let randC = Math.floor(Math.random() * GRID_SIZE);
    if (grid[randR][randC] !== CELL_TYPES.HAZARD && grid[randR][randC] !== CELL_TYPES.GOAL) {
      r = randR;
      c = randC;
    }
  }

  let steps = 0;
  let totalReward = 0;
  let done = false;
  const maxStepsPerEpisode = 120;

  while (!done && steps < maxStepsPerEpisode) {
    steps++;
    const stateKey = `${r},${c}`;
    const actionIdx = chooseAction(r, c, qTable, epsilon);
    const action = ACTIONS[actionIdx];

    let nextR = r + action.dr;
    let nextC = c + action.dc;

    if (nextR < 0 || nextR >= GRID_SIZE || nextC < 0 || nextC >= GRID_SIZE) {
      nextR = r;
      nextC = c;
    }

    const nextCellType = grid[nextR][nextC];
    let reward = -1; // step penalty to encourage shortest path

    if (nextCellType === CELL_TYPES.GOAL) {
      reward = 100;
      done = true;
    } else if (nextCellType === CELL_TYPES.HAZARD) {
      reward = -50;
      done = true;
    }

    totalReward += reward;

    const nextStateKey = `${nextR},${nextC}`;
    const maxNextQ = done ? 0 : Math.max(...(qTable[nextStateKey] || [0, 0, 0, 0]));

    // Q-Value update equation
    qTable[stateKey][actionIdx] += alpha * (reward + gamma * maxNextQ - qTable[stateKey][actionIdx]);

    r = nextR;
    c = nextC;
  }

  return { totalReward, steps, hitGoal: done && grid[r][c] === CELL_TYPES.GOAL };
}

/**
 * Trains Q-table over multiple episodes with epsilon decay
 */
export function trainQTable(grid, numEpisodes = 1000, alpha = 0.25, gamma = 0.95, epsilon = 0.3) {
  const qTable = createQTable();
  const stepHistory = [];
  const rewardHistory = [];

  for (let ep = 1; ep <= numEpisodes; ep++) {
    const currentEpsilon = Math.max(0.02, epsilon * (1 - (ep / numEpisodes) * 0.85));
    const res = trainEpisode(qTable, grid, alpha, gamma, currentEpsilon);

    stepHistory.push(res.steps);
    rewardHistory.push(res.totalReward);
  }

  return { qTable, stepHistory, rewardHistory };
}

/**
 * Extracts greedy optimal path from trained Q-table.
 * Breaks ties by choosing moves that decrease distance to Goal, preventing edge-hugging.
 */
export function extractOptimalPath(qTable, grid) {
  let startR = 0, startC = 0;
  let goalR = 7, goalC = 7;

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === CELL_TYPES.START) { startR = r; startC = c; }
      if (grid[r][c] === CELL_TYPES.GOAL) { goalR = r; goalC = c; }
    }
  }

  const path = [{ r: startR, c: startC }];
  let r = startR;
  let c = startC;
  const visited = new Set();
  visited.add(`${r},${c}`);

  for (let step = 0; step < 64; step++) {
    if (grid[r][c] === CELL_TYPES.GOAL) break;

    const stateKey = `${r},${c}`;
    const qValues = qTable[stateKey] || [0, 0, 0, 0];

    const validActions = [];
    for (let a = 0; a < 4; a++) {
      const nr = r + ACTIONS[a].dr;
      const nc = c + ACTIONS[a].dc;
      if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
        validActions.push({ a, nr, nc });
      }
    }

    if (validActions.length === 0) break;

    // Find maximum Q value among valid moves
    let maxQ = -Infinity;
    validActions.forEach(({ a }) => {
      if (qValues[a] > maxQ) {
        maxQ = qValues[a];
      }
    });

    // Collect all valid actions tied for max Q
    const bestCandidates = validActions.filter(({ a }) => qValues[a] === maxQ);

    // Pick candidate move that minimizes distance to Goal
    let bestAction = bestCandidates[0];
    let minDist = Infinity;

    bestCandidates.forEach(cand => {
      const dist = Math.abs(cand.nr - goalR) + Math.abs(cand.nc - goalC);
      if (dist < minDist) {
        minDist = dist;
        bestAction = cand;
      }
    });

    const nextR = bestAction.nr;
    const nextC = bestAction.nc;
    const nextKey = `${nextR},${nextC}`;

    if (visited.has(nextKey)) {
      break; // prevent infinite loops
    }

    visited.add(nextKey);
    r = nextR;
    c = nextC;
    path.push({ r, c });

    if (grid[r][c] === CELL_TYPES.GOAL || grid[r][c] === CELL_TYPES.HAZARD) {
      break;
    }
  }

  return path;
}
