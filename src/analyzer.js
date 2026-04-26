/**
 * DEPRECATED — this file is no longer used.
 *
 * All analysis logic has been consolidated into:
 *   src/engine.js        ← orchestrator
 *   src/rules/mikrotik.js ← MikroTik firewall / security rules
 *   src/ai/heuristics.js  ← pattern-based heuristic checks
 *   src/ai/openai.js      ← optional OpenAI layer
 *
 * This file is kept for reference only and will be removed in v2.0.
 */
export function analyzeConfig() {
  throw new Error(
    '[auto-infra-doctor] analyzeConfig() is deprecated. '
    + 'Import runFullAnalysis from src/engine.js instead.'
  );
}
