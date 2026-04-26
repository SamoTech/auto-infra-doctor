# Contributing to AutoInfra Doctor

Thank you for considering a contribution! AutoInfra Doctor's power comes entirely from its rule library — every new rule you add helps real network engineers catch real problems.

---

## Ways to Contribute

- **Add a detection rule** — the highest-value contribution
- **Improve an existing rule** — better fix text, more accurate detection
- **Report a false positive** — if a rule fires incorrectly on a valid config
- **Improve docs** — fix typos, add examples, translate
- **Report a bug** — open an issue with a reproducible example

---

## Adding a Detection Rule

Rules live in `src/rules/` organized by category:

| File | Category |
|---|---|
| `mikrotik.js` | Core RouterOS checks |
| `firewall.js` | Firewall chain analysis |
| `nat.js` | NAT / masquerade rules |
| `routing.js` | Static routes, BGP, OSPF |
| `vpn.js` | IPSec, L2TP, WireGuard |

### Rule Format

Every rule must return an object with these fields:

```javascript
{
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW',
  message:  'Short description (max 80 chars)',
  impact:   'What breaks or gets exposed if this is not fixed',
  fix:      '/ip command to fix it, or plain-English instruction',
  source:   'rules'   // always 'rules' for static rules
}
```

### Example

```javascript
// src/rules/firewall.js
export function runFirewallRules(config) {
  const issues = [];

  // Detect UPnP enabled
  if (config.includes('upnp') && config.includes('enabled=yes')) {
    issues.push({
      severity: 'HIGH',
      message:  'UPnP is enabled',
      impact:   'LAN devices can open external firewall ports without authorization',
      fix:      '/ip upnp set enabled=no',
      source:   'rules'
    });
  }

  return issues;
}
```

### Testing Your Rule

Add a test case in `tests/rules/firewall.test.js`:

```javascript
import { runFirewallRules } from '../../src/rules/firewall.js';
import { describe, it, expect } from 'vitest';

describe('UPnP detection', () => {
  it('flags enabled UPnP', () => {
    const config = '/ip upnp set enabled=yes';
    const issues = runFirewallRules(config);
    expect(issues.some(i => i.message.includes('UPnP'))).toBe(true);
  });

  it('does not flag disabled UPnP', () => {
    const config = '/ip upnp set enabled=no';
    const issues = runFirewallRules(config);
    expect(issues.some(i => i.message.includes('UPnP'))).toBe(false);
  });
});
```

Run tests:
```bash
npm test
```

---

## Development Setup

```bash
# Clone
git clone https://github.com/SamoTech/auto-infra-doctor.git
cd auto-infra-doctor

# Install dependencies
npm install

# Run locally
vercel dev

# Test CLI
node bin/cli.js analyze examples/mikrotik-broken.rsc
```

---

## Pull Request Checklist

- [ ] Rule has all four required fields: `severity`, `message`, `impact`, `fix`
- [ ] Unit tests pass (`npm test`)
- [ ] Rule does not produce false positives on `examples/mikrotik-clean.rsc`
- [ ] PR description includes a real-world example of the misconfiguration
- [ ] Commit message follows Conventional Commits (`feat:`, `fix:`, `docs:`)

---

## Code Style

- ES Modules (`import`/`export`), no CommonJS
- No external runtime dependencies in `src/rules/` — pure string analysis only
- Prefer `String.prototype.includes()` and regex for pattern matching
- Comment *why* something is dangerous, not just *that* it is

---

## Commit Convention

```
feat: add UPnP detection rule
fix: prevent false positive on masquerade src-address check
docs: add VPN rule examples to RULES.md
test: add brute-force rule edge cases
refactor: extract shared regex patterns to utils.js
```

---

## Reporting Security Issues

Do **not** open a public issue for security vulnerabilities. See [SECURITY.md](SECURITY.md).
