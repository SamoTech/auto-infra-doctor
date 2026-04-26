import { runMikroTikRules } from '../src/rules/mikrotik.js';
import { runBasicAI } from '../src/ai/basic.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { config } = req.body || {};
  if (!config) {
    return res.status(400).json({ error: 'No config provided' });
  }

  const ruleIssues = runMikroTikRules(config);
  const aiIssues = runBasicAI(config);

  const issues = [...ruleIssues, ...aiIssues];

  return res.status(200).json({ issues });
}
