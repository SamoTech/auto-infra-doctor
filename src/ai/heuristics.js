/**
 * Heuristic AI layer — pattern-based intelligence that goes beyond simple string checks.
 * Free tier: no API key required.
 */
export function runHeuristicAI(config) {
  const issues = [];
  const lines = config.split('\n').map(l => l.trim()).filter(Boolean);

  // Config completeness
  if (config.trim().length < 50) {
    issues.push({
      severity: 'LOW',
      message: 'Config appears incomplete or truncated',
      impact: 'Analysis coverage is limited — some issues may not be detectable',
      fix: 'Export full config: /export verbose > full-config.rsc'
    });
  }

  // DNS config
  if (!config.includes('dns')) {
    issues.push({
      severity: 'LOW',
      message: 'No DNS configuration detected',
      impact: 'Name resolution may fail for router-initiated connections',
      fix: '/ip dns set servers=1.1.1.1,8.8.8.8'
    });
  }

  // Large ruleset
  const ruleCount = lines.filter(l => l.includes('/ip firewall filter add')).length;
  if (ruleCount > 100) {
    issues.push({
      severity: 'MEDIUM',
      message: `Large firewall ruleset detected (${ruleCount} rules)`,
      impact: 'Performance degradation — each packet evaluated against all rules linearly',
      fix: 'Consolidate rules using address-lists; enable FastTrack for established,related traffic'
    });
  }

  // Port scan protection missing
  if (!config.includes('port-scan') && !config.includes('psd')) {
    issues.push({
      severity: 'MEDIUM',
      message: 'No port-scan detection (PSD) configured',
      impact: 'Router is openly scannable from the internet without triggering any block',
      fix: '/ip firewall filter add chain=input protocol=tcp psd=21,3s,3,1 action=add-src-to-address-list address-list=port-scanners'
    });
  }

  // ICMP unrestricted
  if (!config.includes('protocol=icmp') && config.includes('chain=input')) {
    issues.push({
      severity: 'LOW',
      message: 'No ICMP-specific rules in input chain',
      impact: 'Router responds to unlimited ICMP — potential ping flood vector',
      fix: '/ip firewall filter add chain=input protocol=icmp icmp-options=8:0-255 limit=5,10:packet action=accept; add chain=input protocol=icmp action=drop'
    });
  }

  // RouterOS version hint
  if (config.includes('software-id') || config.includes('routeros')) {
    const versionMatch = config.match(/version=(\S+)/);
    if (versionMatch) {
      const ver = versionMatch[1];
      if (ver.startsWith('6.')) {
        issues.push({
          severity: 'HIGH',
          message: `RouterOS v${ver} detected — version 6.x is approaching EOL`,
          impact: 'Security patches are limited for v6; known CVEs will go unpatched',
          fix: 'Upgrade to RouterOS v7.x: /system package update check-for-updates'
        });
      }
    }
  }

  // Cloud DDNS enabled — informational
  if (config.includes('ip cloud') && config.includes('ddns-enabled=yes')) {
    issues.push({
      severity: 'LOW',
      message: 'MikroTik Cloud DDNS is enabled',
      impact: 'Router IP is publicly registered with MikroTik cloud — acceptable if intentional',
      fix: 'Verify this is intentional: /ip cloud print'
    });
  }

  return issues;
}
