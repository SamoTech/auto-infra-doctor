/**
 * Core MikroTik RouterOS firewall + security rules.
 * Each rule returns a standardised issue object.
 */
export function runMikroTikRules(config) {
  const issues = [];
  const lines = config.split('\n').map(l => l.trim()).filter(Boolean);

  // ── Input chain ──────────────────────────────────────────────────────────
  const inputRules = lines.filter(l => l.includes('chain=input'));

  if (inputRules.length > 0 && !config.includes('action=drop')) {
    issues.push({
      severity: 'CRITICAL',
      message: 'No drop rule in input chain',
      impact: 'Router is fully exposed to the internet — all unmatched traffic is accepted',
      fix: '/ip firewall filter add chain=input action=drop comment="drop all" place-before=0'
    });
  }

  if (!config.includes('established,related') && !config.includes('established')) {
    issues.push({
      severity: 'HIGH',
      message: 'Missing established/related connection-state rule',
      impact: 'Stateful packet inspection disabled — breaks normal traffic flow and performance',
      fix: '/ip firewall filter add chain=input connection-state=established,related action=accept place-before=0'
    });
  }

  // ── Management ports ─────────────────────────────────────────────────────
  if (config.includes('8291') || config.includes('8728') || config.includes('8729')) {
    issues.push({
      severity: 'CRITICAL',
      message: 'Management ports (Winbox 8291 / API 8728-8729) detected in config',
      impact: 'CVE-2018-14847 and brute-force exposure if open to the internet',
      fix: 'Restrict via: /ip firewall filter add chain=input dst-port=8291,8728,8729 src-address-list=MGMT action=accept; add chain=input dst-port=8291,8728,8729 action=drop'
    });
  }

  // ── Default admin account ─────────────────────────────────────────────────
  if (config.includes('name=admin') && !config.includes('name=admin disabled=yes')) {
    issues.push({
      severity: 'CRITICAL',
      message: 'Default "admin" account appears active',
      impact: 'Primary brute-force target on every MikroTik device globally',
      fix: '/user set [find name=admin] name=your-admin comment="renamed"; /user add name=admin password="" group=read disabled=yes'
    });
  }

  // ── NAT / Forwarding ──────────────────────────────────────────────────────
  if (config.includes('dst-nat') && !config.includes('chain=forward')) {
    issues.push({
      severity: 'HIGH',
      message: 'dst-nat rule present without any forward chain filtering',
      impact: 'NAT-forwarded traffic bypasses all firewall inspection',
      fix: '/ip firewall filter add chain=forward connection-nat-state=dstnat action=accept; add chain=forward action=drop'
    });
  }

  const masqLines = lines.filter(l => l.includes('action=masquerade'));
  const unrestrictedMasq = masqLines.filter(l => !l.includes('src-address'));
  if (unrestrictedMasq.length > 0) {
    issues.push({
      severity: 'MEDIUM',
      message: `Masquerade rule(s) without src-address restriction (${unrestrictedMasq.length} found)`,
      impact: 'Entire routing table NATed including unexpected traffic; harder to debug routing',
      fix: 'Add src-address=192.168.0.0/16 (or your LAN subnet) to each masquerade rule'
    });
  }

  const natMatches = config.match(/masquerade/g) || [];
  if (natMatches.length > 1) {
    issues.push({
      severity: 'MEDIUM',
      message: `Duplicate NAT masquerade rules detected (${natMatches.length} occurrences)`,
      impact: 'Double-NAT causes asymmetric routing and connection tracking issues',
      fix: '/ip firewall nat print; remove duplicates leaving only the required interface-bound rule'
    });
  }

  // ── FastTrack ────────────────────────────────────────────────────────────
  if (config.includes('fasttrack') && !config.includes('established')) {
    issues.push({
      severity: 'HIGH',
      message: 'FastTrack rule present but established/related rule is missing or mis-ordered',
      impact: 'FastTrack bypasses firewall rules — if rule order is wrong, all traffic is fasttracked',
      fix: 'Ensure established,related accept rule appears BEFORE fasttrack rule; fasttrack should only apply to established connections'
    });
  }

  // ── UPnP ─────────────────────────────────────────────────────────────────
  if (config.includes('upnp') && config.includes('enabled=yes')) {
    issues.push({
      severity: 'HIGH',
      message: 'UPnP is enabled',
      impact: 'LAN devices can automatically open external firewall ports without admin approval',
      fix: '/ip upnp set enabled=no'
    });
  }

  // ── DNS amplification ────────────────────────────────────────────────────
  if (config.includes('allow-remote-requests=yes')) {
    issues.push({
      severity: 'HIGH',
      message: 'DNS server allows remote requests (allow-remote-requests=yes)',
      impact: 'DNS amplification attack vector — can be weaponised for DDoS',
      fix: '/ip dns set allow-remote-requests=no  OR  add firewall rule blocking port 53 from WAN'
    });
  }

  // ── Neighbor discovery on WAN ────────────────────────────────────────────
  if (config.includes('discover-interface-list=all')) {
    issues.push({
      severity: 'HIGH',
      message: 'MNDP/CDP neighbor discovery enabled on all interfaces',
      impact: 'Router model, version, and MAC address visible from WAN — enables targeted attacks',
      fix: '/ip neighbor discovery-settings set discover-interface-list=LAN'
    });
  }

  // ── SOCKS proxy ──────────────────────────────────────────────────────────
  if (config.includes('socks') && config.includes('enabled=yes')) {
    issues.push({
      severity: 'CRITICAL',
      message: 'SOCKS proxy is enabled',
      impact: 'Serious traffic tunneling risk — attackers can use router as anonymous proxy',
      fix: '/ip socks set enabled=no'
    });
  }

  // ── IP Proxy ─────────────────────────────────────────────────────────────
  if (config.includes('ip proxy') && config.includes('enabled=yes')) {
    issues.push({
      severity: 'HIGH',
      message: 'IP Web Proxy is enabled',
      impact: 'Can be exploited as an open web proxy by external parties',
      fix: '/ip proxy set enabled=no'
    });
  }

  // ── Bandwidth server ─────────────────────────────────────────────────────
  if (config.includes('bandwidth-server') && !config.includes('bandwidth-server') + 'enabled=no') {
    // only flag if explicitly enabled or no disabled marker
    if (!config.includes('bandwidth-server set enabled=no')) {
      issues.push({
        severity: 'MEDIUM',
        message: 'Bandwidth test server may be enabled',
        impact: 'Can be abused for DoS amplification and CPU exhaustion',
        fix: '/tool bandwidth-server set enabled=no'
      });
    }
  }

  // ── Telnet ───────────────────────────────────────────────────────────────
  if (config.includes('dst-port=23') && config.includes('action=accept')) {
    issues.push({
      severity: 'HIGH',
      message: 'Telnet traffic (port 23) is being accepted/forwarded',
      impact: 'Cleartext credentials and session data transmitted over the network',
      fix: 'Replace Telnet with SSH everywhere; block port 23 at the firewall'
    });
  }

  // ── Multiple default routes ──────────────────────────────────────────────
  const defaultRoutes = lines.filter(l => l.includes('dst-address=0.0.0.0/0'));
  if (defaultRoutes.length > 1) {
    issues.push({
      severity: 'HIGH',
      message: `Multiple default routes detected (${defaultRoutes.length})`,
      impact: 'Asymmetric routing; failover may not behave as expected; harder to troubleshoot',
      fix: 'Use distance= or routing-mark= to set route priority; configure proper failover with check-gateway=ping'
    });
  }

  // ── Brute-force protection ───────────────────────────────────────────────
  if (!config.includes('add-src-to-address-list') && !config.includes('connection-limit')) {
    issues.push({
      severity: 'HIGH',
      message: 'No brute-force protection rules detected for management ports',
      impact: 'Unlimited login attempts allowed against SSH, Winbox, and API',
      fix: '/ip firewall filter add chain=input protocol=tcp dst-port=22,8291 connection-limit=3,32 action=add-src-to-address-list address-list=blocked-ssh address-list-timeout=1d'
    });
  }

  return issues;
}
