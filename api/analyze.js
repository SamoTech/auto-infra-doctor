export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { config } = req.body || {};
  if (!config) {
    return res.status(400).json({ error: 'No config provided' });
  }

  let issues = [];

  // Duplicate NAT
  const natMatches = config.match(/masquerade/g) || [];
  if (natMatches.length > 1) {
    issues.push({
      severity: 'CRITICAL',
      message: 'Duplicate NAT masquerade rule detected',
      impact: 'May cause routing conflicts and unnecessary CPU usage',
      fix: '/ip firewall nat remove [find where action=masquerade]'
    });
  }

  // Open input chain
  if (config.includes('chain=input') && config.includes('accept')) {
    issues.push({
      severity: 'HIGH',
      message: 'Input chain allows unrestricted access',
      impact: 'Router is exposed to unauthorized external access',
      fix: '/ip firewall filter add chain=input action=drop'
    });
  }

  return res.status(200).json({ issues });
}
