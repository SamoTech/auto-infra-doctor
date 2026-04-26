/**
 * Heuristic AI layer — pattern-based intelligence that goes beyond simple string checks.
 * Free tier: no API key required.
 */
export function runHeuristicAI(config) {
  const issues = [];
  const lines = config.split('\n').map(l => l.trim()).filter(Boolean);

  // ── Config completeness ──────────────────────────────────────────────────
  // Only flag if very short — a real exported config is always >200 chars.
  if (config.trim().length < 200) {
    issues.push({
      severity: 'LOW',
      message: 'Config appears incomplete or truncated',
      impact: 'Analysis coverage is limited — some issues may not be detectable',
      fix: 'Export full config via terminal: /export verbose > full-config.rsc'
    });
  }

  // ── Large ruleset ────────────────────────────────────────────────────────
  const ruleCount = lines.filter(l => l.includes('/ip firewall filter add')).length;
  if (ruleCount > 100) {
    issues.push({
      severity: 'MEDIUM',
      message: `Large firewall ruleset detected (${ruleCount} rules)`,
      impact: 'Performance degradation — each packet evaluated linearly against all rules',
      fix: 'Consolidate rules using address-lists; enable FastTrack for established,related traffic'
    });
  }

  // ── Port-scan detection missing ──────────────────────────────────────────
  if (!config.includes('port-scan') && !config.includes('psd')) {
    issues.push({
      severity: 'MEDIUM',
      message: 'No port-scan detection (PSD) configured',
      impact: 'Router is openly scannable from the internet without triggering any block',
      fix: '/ip firewall filter add chain=input protocol=tcp psd=21,3s,3,1 action=add-src-to-address-list address-list=port-scanners address-list-timeout=1d'
    });
  }

  // ── ICMP rate-limiting ───────────────────────────────────────────────────
  if (!config.includes('protocol=icmp') && config.includes('chain=input')) {
    issues.push({
      severity: 'LOW',
      message: 'No ICMP rate-limiting rule in input chain',
      impact: 'Router responds to unlimited ICMP — potential ping-flood amplification vector',
      fix: '/ip firewall filter add chain=input protocol=icmp limit=5,10:packet action=accept comment="icmp rate limit"; add chain=input protocol=icmp action=drop'
    });
  }

  // ── RouterOS v6 EOL ──────────────────────────────────────────────────────
  const versionMatch = config.match(/version=(\S+)/);
  if (versionMatch) {
    const ver = versionMatch[1];
    if (ver.startsWith('6.')) {
      issues.push({
        severity: 'HIGH',
        message: `RouterOS v${ver} detected — v6.x is past mainstream support`,
        impact: 'Security patches are minimal for v6; known CVEs (incl. CVE-2023-30799) may remain unpatched',
        fix: 'Upgrade to RouterOS v7.x: /system package update check-for-updates'
      });
    }
  }

  // ── MikroTik Cloud DDNS ──────────────────────────────────────────────────
  if (config.includes('ddns-enabled=yes')) {
    issues.push({
      severity: 'LOW',
      message: 'MikroTik Cloud DDNS is enabled',
      impact: 'Router public IP is registered with MikroTik cloud — verify this is intentional',
      fix: '/ip cloud print  — disable with: /ip cloud set ddns-enabled=no'
    });
  }

  // ── NTP not configured ───────────────────────────────────────────────────
  if (config.includes('ntp') && config.includes('enabled=no')) {
    issues.push({
      severity: 'LOW',
      message: 'NTP client is disabled',
      impact: 'Clock drift causes certificate validation failures, log timestamps, and time-based firewall rules to malfunction',
      fix: '/system ntp client set enabled=yes servers=time.cloudflare.com'
    });
  }

  // ── Multiple masquerade interfaces ──────────────────────────────────────
  const masqMatches = (config.match(/action=masquerade/g) || []).length;
  if (masqMatches > 1) {
    issues.push({
      severity: 'MEDIUM',
      message: `Duplicate NAT masquerade rules detected (${masqMatches} occurrences)`,
      impact: 'Double-NAT causes asymmetric routing and connection tracking conflicts',
      fix: '/ip firewall nat print  — keep only the interface-bound rule for your WAN interface'
    });
  }

  return issues;
}
