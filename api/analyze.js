export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { config } = req.body || {};
  if (!config) {
    return res.status(400).json({ error: 'No config provided' });
  }

  let issues = [];

  const natMatches = config.match(/masquerade/g) || [];
  if (natMatches.length > 1) {
    issues.push({
      severity: 'CRITICAL',
      message: 'Duplicate NAT masquerade rule',
      fix: '/ip firewall nat remove 1'
    });
  }

  if (config.includes('chain=input') && config.includes('accept')) {
    issues.push({
      severity: 'HIGH',
      message: 'Open input chain',
      fix: 'Add drop rule for input chain'
    });
  }

  return res.status(200).json({ issues });
}
