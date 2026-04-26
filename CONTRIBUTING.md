# Contributing to AutoInfra Doctor

Thank you for taking the time to contribute. AutoInfra Doctor is community-driven — the best improvements come from engineers who have seen real-world MikroTik misconfigurations in production.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Development Setup](#development-setup)
- [Adding a Detection Rule](#adding-a-detection-rule)
- [Commit Conventions](#commit-conventions)
- [Pull Request Checklist](#pull-request-checklist)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold these standards. Violations can be reported to the maintainers.

---

## Ways to Contribute

| Type | How |
|---|---|
| 🐛 Bug fix | Open an issue, then a PR with `fix:` prefix |
| ✨ New rule | Add to the appropriate `src/rules/*.js` file + test |
| 📖 Docs | Improve any `.md` file or `docs/` content |
| 🧪 Tests | Expand coverage in `tests/` with real-world configs |
| 🌍 Translation | Help translate the UI or docs (open an issue first) |
| 💡 Feature | Open a Discussion or issue before implementing |

---

## Development Setup

**Requirements:** Node.js ≥ 18, npm ≥ 9

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/<your-username>/auto-infra-doctor.git
cd auto-infra-doctor

# 2. Install dependencies
npm install

# 3. Run tests
npm test

# 4. Start local dev server (requires Vercel CLI)
npm run dev

# 5. Test the CLI directly
node bin/cli.js analyze examples/mikrotik-broken.rsc
```

---

## Adding a Detection Rule

This is the highest-impact contribution. Each rule maps a real-world misconfiguration to a fix.

### Step 1 — Choose the right file

| File | Add rules for |
|---|---|
| `src/rules/mikrotik.js` | General RouterOS issues |
| `src/rules/firewall.js` | `/ip firewall filter` and `/ip firewall mangle` |
| `src/rules/nat.js` | `/ip firewall nat` |
| `src/rules/routing.js` | `/ip route`, BGP, OSPF |
| `src/rules/vpn.js` | IPSec, L2TP, SSTP, WireGuard |

### Step 2 — Follow the rule schema

```javascript
// Every rule must return an object with these exact fields
{
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW',
  message:  'Short description of the problem (< 80 chars)',
  impact:   'What can go wrong if this is not fixed',
  fix:      'Exact RouterOS CLI command to resolve this',
  // Optional:
  docs:     'https://wiki.mikrotik.com/...',
  source:   'rule' // or 'ai'
}
```

### Step 3 — Write a test

Add a test in `tests/rules/` using a minimal config snippet that triggers your rule:

```javascript
// tests/rules/firewall.test.js
import { describe, it, expect } from 'vitest';
import { runFirewallRules } from '../../src/rules/firewall.js';

describe('firewall rules', () => {
  it('detects SOCKS proxy enabled', () => {
    const config = '/ip socks set enabled=yes';
    const issues = runFirewallRules(config);
    expect(issues.some(i => i.message.includes('SOCKS'))).toBe(true);
    expect(issues.find(i => i.message.includes('SOCKS')).severity).toBe('CRITICAL');
  });
});
```

### Step 4 — Document your rule

Add an entry to `docs/RULES.md` in the correct category table.

---

## Commit Conventions

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add UPnP exposure detection rule
fix: correct SOCKS proxy regex pattern
docs: update CLI.md with --format flag
test: add NAT masquerade test cases
chore: bump vitest to 2.0
refactor: extract engine orchestrator from api handler
```

**Scope examples:** `rule`, `api`, `cli`, `ui`, `docs`, `ci`, `deps`

---

## Pull Request Checklist

Before submitting, verify:

- [ ] `npm test` passes with no failures
- [ ] New rule has a corresponding test
- [ ] New rule is documented in `docs/RULES.md`
- [ ] Commit messages follow Conventional Commits
- [ ] PR description explains the misconfiguration and real-world impact
- [ ] No secrets, credentials, or personal data in any committed file

---

## Reporting Bugs

Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md). Include:

- A minimal config snippet that triggers the issue (sanitize any real credentials)
- Expected behaviour vs. actual behaviour
- Node.js version and OS

---

## Suggesting Features

Open a [Feature Request](.github/ISSUE_TEMPLATE/feature_request.md) or start a [GitHub Discussion](https://github.com/SamoTech/auto-infra-doctor/discussions). For large changes, discuss first before implementing — this saves everyone time.

---

*Thanks for making AutoInfra Doctor better for the entire MikroTik community.*
