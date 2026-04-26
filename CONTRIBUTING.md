# Contributing to AutoInfra Doctor

Thank you for your interest in contributing. AutoInfra Doctor is a community-driven project — every new detection rule represents a real-world misconfiguration caught before it became an incident.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Development Setup](#development-setup)
- [Adding a Detection Rule](#adding-a-detection-rule)
- [Commit Conventions](#commit-conventions)
- [Pull Request Checklist](#pull-request-checklist)
- [Reporting Bugs](#reporting-bugs)
- [Security Vulnerabilities](#security-vulnerabilities)

---

## Code of Conduct

This project follows our [Code of Conduct](CODE_OF_CONDUCT.md). By participating you agree to uphold it.

---

## Ways to Contribute

| Contribution type | Where to start |
|---|---|
| 🛡️ Add a detection rule | `src/rules/` — see guide below |
| 🐛 Report a bug | [Open an issue](https://github.com/SamoTech/auto-infra-doctor/issues/new?template=bug_report.md) |
| 💡 Suggest a feature | [Open a discussion](https://github.com/SamoTech/auto-infra-doctor/discussions) |
| 📝 Improve documentation | Edit any file in `docs/` or root `.md` files |
| 🌍 Add translations | See `docs/i18n/` (coming soon) |
| ⭐ Star the repo | [github.com/SamoTech/auto-infra-doctor](https://github.com/SamoTech/auto-infra-doctor) |

---

## Development Setup

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- Git

### Clone and install

```bash
git clone https://github.com/SamoTech/auto-infra-doctor.git
cd auto-infra-doctor
npm install
```

### Run locally

```bash
# Analyze a sample config
node bin/cli.js analyze examples/mikrotik-broken.rsc

# Run the API locally (requires Vercel CLI)
npx vercel dev

# Run tests
npm test
```

---

## Adding a Detection Rule

This is the highest-impact contribution. Each rule catches a real category of misconfiguration.

### Step 1 — Choose the right module

| File | Domain |
|---|---|
| `src/rules/mikrotik.js` | General RouterOS issues |
| `src/rules/firewall.js` | Firewall chain and filter rules |
| `src/rules/nat.js` | NAT, masquerade, hairpin |
| `src/rules/routing.js` | Static routes, BGP, OSPF |
| `src/rules/vpn.js` | IPSec, L2TP, WireGuard, SSTP |

### Step 2 — Write the rule

Every rule must return an object with these fields:

```javascript
{
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW',
  message:  'Short description of what is wrong',
  impact:   'What can go wrong as a result',
  fix:      '/exact/routeros command to fix it'
}
```

**Example:**

```javascript
// src/rules/firewall.js
if (config.includes('upnp') && config.includes('enabled=yes')) {
  issues.push({
    severity: 'HIGH',
    message:  'UPnP is enabled',
    impact:   'LAN devices can open arbitrary external ports without authorization',
    fix:      '/ip upnp set enabled=no'
  });
}
```

### Step 3 — Add a test case

Create or extend a test file in `tests/rules/` with a real config snippet that triggers your rule:

```javascript
// tests/rules/firewall.test.js
import { runFirewallRules } from '../../src/rules/firewall.js';

test('detects UPnP enabled', () => {
  const config = '/ip upnp set enabled=yes';
  const issues = runFirewallRules(config);
  expect(issues.some(i => i.message.includes('UPnP'))).toBe(true);
});
```

### Step 4 — Submit a PR

Describe in your PR:
- What misconfiguration the rule detects
- Why it matters in a real production environment
- A link to any CVE, MikroTik advisory, or forum thread if applicable

---

## Commit Conventions

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): short description

Optional longer body.
```

| Type | When to use |
|---|---|
| `feat` | New feature or detection rule |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `refactor` | Code change with no behavior change |
| `test` | Adding or updating tests |
| `ci` | CI/CD workflow changes |
| `chore` | Maintenance, dependency updates |

**Examples:**

```
feat(rules): add UPnP detection to firewall module
fix(api): return 405 for non-POST requests
docs(readme): add CLI demo output section
```

---

## Pull Request Checklist

Before opening a PR, confirm:

- [ ] Branch is up to date with `main`
- [ ] `npm test` passes with no failures
- [ ] New rule has a corresponding test case in `tests/`
- [ ] Rule object includes all four required fields: `severity`, `message`, `impact`, `fix`
- [ ] Commit messages follow Conventional Commits format
- [ ] PR description explains the misconfiguration being detected
- [ ] No unrelated changes included

---

## Reporting Bugs

Open an issue using the [bug report template](https://github.com/SamoTech/auto-infra-doctor/issues/new?template=bug_report.md). Include:

- The RouterOS config snippet that caused the problem (redact sensitive values)
- Expected behavior vs. actual behavior
- Node.js version and OS
- Full error message or CLI output

---

## Security Vulnerabilities

Do **not** open a public issue for security vulnerabilities. See [SECURITY.md](SECURITY.md) for the responsible disclosure process.
