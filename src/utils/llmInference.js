/**
 * Client-Side Tokenizer and Next-Token Predictor Engine for LLM Visualizer.
 * Tokenizes text into word-piece chips and generates candidate next-word probabilities.
 */

// Common Next-Word Transition Vocabulary Bank
const NEXT_WORD_DICTIONARY = {
  // Grammar & Common Openings
  "the": [
    { token: "model", prob: 0.32 },
    { token: "data", prob: 0.24 },
    { token: "algorithm", prob: 0.18 },
    { token: "system", prob: 0.14 },
    { token: "quick", prob: 0.12 }
  ],
  "a": [
    { token: "neural", prob: 0.35 },
    { token: "large", prob: 0.25 },
    { token: "deep", prob: 0.18 },
    { token: "simple", prob: 0.12 },
    { token: "new", prob: 0.10 }
  ],
  "neural": [
    { token: "network", prob: 0.78 },
    { token: "networks", prob: 0.14 },
    { token: "architecture", prob: 0.08 }
  ],
  "transformer": [
    { token: "models", prob: 0.45 },
    { token: "architecture", prob: 0.32 },
    { token: "block", prob: 0.15 },
    { token: "attention", prob: 0.08 }
  ],
  "machine": [
    { token: "learning", prob: 0.88 },
    { token: "intelligence", prob: 0.08 },
    { token: "translation", prob: 0.04 }
  ],
  "learning": [
    { token: "algorithms", prob: 0.42 },
    { token: "models", prob: 0.28 },
    { token: "process", prob: 0.18 },
    { token: "rate", prob: 0.12 }
  ],
  "artificial": [
    { token: "intelligence", prob: 0.85 },
    { token: "neural", prob: 0.10 },
    { token: "agents", prob: 0.05 }
  ],
  "gradient": [
    { token: "descent", prob: 0.82 },
    { token: "vanishing", prob: 0.10 },
    { token: "vector", prob: 0.08 }
  ],
  "quick": [
    { token: "brown", prob: 0.75 },
    { token: "fox", prob: 0.18 },
    { token: "run", prob: 0.07 }
  ],
  "brown": [
    { token: "fox", prob: 0.88 },
    { token: "bear", prob: 0.08 },
    { token: "dog", prob: 0.04 }
  ]
};

// Generic Fallback Distribution for Arbitrary Words
const DEFAULT_CANDIDATES = [
  { token: "is", prob: 0.28 },
  { token: "can", prob: 0.22 },
  { token: "model", prob: 0.18 },
  { token: "data", prob: 0.16 },
  { token: "network", prob: 0.16 }
];

/**
 * Tokenizes text prompt into individual word/punctuation tokens.
 */
export function tokenizeText(text) {
  if (!text || !text.trim()) return [];
  // Split on spaces and punctuation, keeping words and symbols
  const rawTokens = text.trim().match(/[\w']+|[^\w\s]/g) || [];
  return rawTokens;
}

/**
 * Predicts next token candidates and percentage probabilities given input text prompt.
 */
export function predictNextTokens(text) {
  const tokens = tokenizeText(text);
  if (tokens.length === 0) {
    return {
      tokens: [],
      candidates: [
        { token: "The", prob: 0.35 },
        { token: "Machine", prob: 0.25 },
        { token: "Neural", prob: 0.20 },
        { token: "Transformer", prob: 0.20 }
      ]
    };
  }

  const lastToken = tokens[tokens.length - 1].toLowerCase();
  const candidates = NEXT_WORD_DICTIONARY[lastToken] || DEFAULT_CANDIDATES;

  return {
    tokens,
    candidates
  };
}
