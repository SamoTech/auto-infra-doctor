# Rule Reference

AutoInfra Doctor ships with a rule engine organized by domain. Each rule is assigned a severity level and produces a message, impact description, and exact fix command.

---

## Severity Levels

| Level | Meaning |
|---|---|
| 🔴 **CRITICAL** | Immediate threat — router is actively vulnerable or broken |
| 🟠 **HIGH** | Significant risk — should be fixed before going to production |
| 🟡 **MEDIUM** | Best-practice violation — should be fixed at next maintenance window |
| 🔵 **LOW** | Informational — improvement suggested but not urgent |

---

## Firewall Rules (`src/rules/firewall.js`)

### No drop-all at end of input chain
- **Severity:** CRITICAL
- **Trigger:** `chain=input` rules exist but none have `action=drop` without a source address filter
- **Impact:** All unmatched traffic is accepted. Router management interfaces (Winbox, SSH, API) are exposed to every source.
- **Fix:** `/ip firewall filter add chain=input action=drop comment="drop all unmatched"`

### Default admin account active
- **Severity:** CRITICAL
- **Trigger:** `name=admin` detected and not disabled
- **Impact:** The `admin` account is the #1 brute-force target on every MikroTik router on the internet.
- **Fix:** `/user set admin name=your-custom-admin-name`

### Winbox port (8291) exposed to WAN
- **Severity:** CRITICAL
- **Trigger:** Port 8291 accepted from `src-address=0.0.0.0/0`
- **Impact:** Exposed to CVE-2018-14847 (Winbox credential theft) and all future Winbox vulnerabilities.
- **Fix:** Restrict Winbox to a management VLAN address list only.

### SOCKS proxy enabled
- **Severity:** CRITICAL
- **Trigger:** `socks` section contains `enabled=yes`
- **Impact:** Router can be used as an open SOCKS proxy for anonymous tunneling.
- **Fix:** `/ip socks set enabled=no`

### No brute-force protection
- **Severity:** HIGH
- **Trigger:** No `add-src-to-address-list` or `connection-limit` rules present
- **Impact:** Unlimited login attempts allowed against SSH and Winbox.
- **Fix:** Add stage-1/stage-2 address-list rules blocking repeated failed attempts.

### DNS server open to internet
- **Severity:** HIGH
- **Trigger:** `allow-remote-requests=yes`
- **Impact:** Router acts as an open resolver — exploitable for DNS amplification attacks.
- **Fix:** `/ip dns set allow-remote-requests=no`

### Neighbor discovery on all interfaces
- **Severity:** HIGH
- **Trigger:** `discover-interface-list=all`
- **Impact:** Router model, version, and MAC visible from WAN via MNDP/CDP.
- **Fix:** `/ip neighbor discovery-settings set discover-interface-list=LAN`

### UPnP enabled
- **Severity:** HIGH
- **Trigger:** `upnp` section with `enabled=yes`
- **Impact:** LAN devices can open external firewall ports without authorization.
- **Fix:** `/ip upnp set enabled=no`

### IP proxy enabled
- **Severity:** HIGH
- **Trigger:** `ip proxy` with `enabled=yes`
- **Impact:** Router can be used as an open HTTP proxy.
- **Fix:** `/ip proxy set enabled=no`

### Bandwidth test server enabled
- **Severity:** MEDIUM
- **Trigger:** `bandwidth-server` not explicitly disabled
- **Impact:** Can be abused for DoS amplification from WAN.
- **Fix:** `/tool bandwidth-server set enabled=no`

---

## NAT Rules (`src/rules/nat.js`)

### Duplicate masquerade rules
- **Severity:** HIGH
- **Trigger:** More than one `action=masquerade` rule detected
- **Impact:** Routing conflicts and unnecessary CPU overhead.
- **Fix:** `/ip firewall nat remove [find where action=masquerade]` then re-add a single scoped rule.

### Masquerade without src-address
- **Severity:** MEDIUM
- **Trigger:** `action=masquerade` rule has no `src-address` field
- **Impact:** Entire routing table is NAT'd, including unexpected traffic.
- **Fix:** Add `src-address=192.168.0.0/16` (your LAN range) to the masquerade rule.

---

## Routing Rules (`src/rules/routing.js`)

### Multiple default routes
- **Severity:** HIGH
- **Trigger:** More than one `dst-address=0.0.0.0/0` route detected
- **Impact:** Asymmetric routing; failover may not behave as expected.
- **Fix:** Use routing marks or `distance=` values to define failover priority explicitly.

---

## VPN Rules (`src/rules/vpn.js`)

### Telnet forwarded internally
- **Severity:** HIGH
- **Trigger:** `dst-port=23` with `action=accept` in forward chain
- **Impact:** Cleartext credentials traversing the network.
- **Fix:** Replace all Telnet usage with SSH.

---

## Heuristic Rules (`src/ai/heuristics.js`)

These rules use pattern analysis and are applied on top of the static rule engine.

### Oversized ruleset
- **Severity:** MEDIUM
- **Trigger:** More than 100 firewall filter rules
- **Impact:** Performance degradation; hard to audit; likely contains redundant entries.
- **Fix:** Use address-lists to consolidate rules; enable FastTrack for established/related traffic.
