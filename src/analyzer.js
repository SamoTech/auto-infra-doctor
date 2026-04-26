export async function analyzeConfig(config, mode) {
  let issues = [];

  // Detect duplicate masquerade rules
  const natMatches = config.match(/masquerade/g) || [];
  if (natMatches.length > 1) {
    issues.push("[CRITICAL][Logic] Duplicate NAT masquerade rule detected\n[FIX] /ip firewall nat remove 1");
  }

  // Detect open input chain
  if (config.includes("chain=input") && config.includes("accept")) {
    issues.push("[HIGH][Security] Open input chain allows all traffic\n[FIX] Add drop rule for input chain");
  }

  if (issues.length === 0) {
    return "[OK] No major issues detected";
  }

  return issues.join("\n\n");
}
