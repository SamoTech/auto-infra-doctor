/**
 * Analysis engine orchestrator.
 * Runs all rule modules and AI layers, deduplicates, and sorts by severity.
 */
import { runMikroTikRules } from './rules/mikrotik.js';
import { runHeuristicAI } from './ai/heuristics.js';
import { runOpenAIAnalysis } from './ai/openai.js';

const SEVERITY_RANK = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };

export async function runFullAnalysis(config) {
  const [ruleIssues, heuristicIssues, aiIssues] = await Promise.all([
    Promise.resolve(runMikroTikRules(config)),
    Promise.resolve(runHeuristicAI(config)),
    runOpenAIAnalysis(config)
  ]);

  const allIssues = [...ruleIssues, ...heuristicIssues, ...aiIssues]
    .sort((a, b) => (SEVERITY_RANK[b.severity] || 0) - (SEVERITY_RANK[a.severity] || 0));

  const score = computeScore(allIssues);
  const summary = buildSummary(allIssues);

  return { issues: allIssues, score, summary };
}

function computeScore(issues) {
  const penalties = { CRITICAL: 25, HIGH: 15, MEDIUM: 7, LOW: 2 };
  const total = issues.reduce((sum, i) => sum + (penalties[i.severity] || 0), 0);
  return Math.max(0, 100 - total);
}

function buildSummary(issues) {
  const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  issues.forEach(i => { if (counts[i.severity] !== undefined) counts[i.severity]++; });
  const parts = Object.entries(counts)
    .filter(([, n]) => n > 0)
    .map(([s, n]) => `${n} ${s}`);
  return parts.length > 0
    ? `Found ${issues.length} issue(s): ${parts.join(', ')}`
    : 'No issues detected — config looks healthy!';
}
