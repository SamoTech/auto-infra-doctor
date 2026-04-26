# Contributing to AutoInfra Doctor

Thank you for taking the time to contribute! AutoInfra Doctor is an open-source tool built for the global MikroTik and DevOps community. Every contribution — whether a new detection rule, a bug fix, a doc improvement, or a feature suggestion — moves it forward.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Development Setup](#development-setup)
- [Adding a Detection Rule](#adding-a-detection-rule)
- [Project Structure](#project-structure)
- [Commit Conventions](#commit-conventions)
- [Pull Request Checklist](#pull-request-checklist)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold it. Respectful, constructive collaboration only.

---

## Ways to Contribute

| Type | Where to start |
|---|---|
| 🐛 Bug fix | Open an issue first, then submit a PR |
| 🔍 New detection rule | Add to `src/rules/` — see guide below |
| 📖 Documentation | Edit any `.md` file or files in `docs/` |
| 🎨 UI improvement | Edit `index.html` or files in `dashboard/` |
| 🤖 AI layer | Improve `src/ai/heuristics.js` |
| 💡 Feature request | Open a GitHub Discussion or Issue |
| ⭐ Star the repo | Helps others discover the project |

---

## Development Setup

**Requirements:** Node.js ≥ 18, npm ≥ 9

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/auto-infra-doctor.git
cd auto-infra-doctor

# 2. Install dependencies
npm install

# 3. Run the test suite
npm test

# 4. Run the CLI against the example config
node bin/cli.js analyze examples/mikrotik-broken.rsc

# 5. Start a local Vercel dev server (optional)
npx vercel dev
```

---

## Adding a Detection Rule

Adding a real-world misconfiguration rule is the single highest-impact contribution you can make.

### 1. Pick the right file

| File | Rule domain |
|---|---|
| `src/rules/mikrotik.js` | General RouterOS rules |
| `src/rules/firewall.js` | Firewall filter chains |
| `src/rules/nat.js` | NAT / masquerade |
| `src/rules/routing.js` | BGP, OSPF, static routes |
| `src/rules/vpn.js` | IPSec, L2TP, WireGuard |

### 2. Rule shape

Every rule must return an object matching this shape:

```js
{
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW',
  message:  string,   // short, factual, < 80 chars
  impact:   string,   // what goes wrong if ignored
  fix:      string,   // exact RouterOS CLI command or clear instruction
  source:   'rule'    // always 'rule' for deterministic checks
}
```

### 3. Example rule

```js
// In src/rules/firewall.js

// SOCKS proxy enabled
if (config.includes('socks') && config.includes('enabled=yes')) {
  issues.push({
    severity: 'CRITICAL',
    message:  'SOCKS proxy is enabled',
    impact:   'Router can be used as an anonymous traffic tunnel',
    fix:      '/ip socks set enabled=no',
    source:   'rule',
  });
}
```

### 4. Add a test case

Add a fixture in `tests/rules/` with a minimal config string that triggers your rule, and one that does not:

```js
// tests/rules/firewall.test.js
import { runFirewallRules } from '../../src/rules/firewall.js';

test('detects SOCKS proxy enabled', () => {
  const config = '/ip socks\n  set enabled=yes';
  const issues = runFirewallRules(config);
  expect(issues.some(i => i.message.includes('SOCKS'))).toBe(true);
});

test('no false positive when SOCKS is disabled', () => {
  const config = '/ip socks\n  set enabled=no';
  const issues = runFirewallRules(config);
  expect(issues.some(i => i.message.includes('SOCKS'))).toBe(false);
});
```

---

## Project Structure

```
auto-infra-doctor/
├── api/analyze.js        ← Thin HTTP handler (Vercel serverless)
├── src/
│   ├── engine.js         ← Orchestrator
│   ├── validator.js      ← Input validation
│   ├── rules/            ← Detection rules (one file per domain)
│   └── ai/               ← AI analysis layer
├── bin/cli.js            ← CLI entry point
├── dashboard/            ← Static frontend
├── docs/                 ← API, CLI, and Rule reference docs
├── examples/             ← Sample RouterOS configs
└── tests/                ← Unit tests
```

---

## Commit Conventions

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add UPnP detection rule
fix: correct false positive in masquerade check
docs: update CLI usage in README
refactor: extract firewall rules into separate module
test: add fixtures for VPN rule suite
chore: bump Node.js engine requirement to 18
```

Keep the subject line under 72 characters. Reference issues with `Closes #42` in the commit body when applicable.

---

## Pull Request Checklist

Before submitting a PR, verify:

- [ ] `npm test` passes with no failures
- [ ] New rules have both a positive and a negative test case
- [ ] No `console.log` left in production paths
- [ ] Commit messages follow Conventional Commits format
- [ ] PR description explains: what was changed, why, and how to test it
- [ ] For new rules: the real-world scenario is described in the PR body

---

## Reporting Bugs

1. Search [existing issues](https://github.com/SamoTech/auto-infra-doctor/issues) first
2. If new, open an issue with:
   - A minimal RouterOS config that reproduces the problem
   - Expected behaviour vs. actual behaviour
   - Node.js version and OS

---

## Suggesting Features

Open a [GitHub Discussion](https://github.com/SamoTech/auto-infra-doctor/discussions) or an Issue tagged `enhancement`. Include:

- The real-world scenario that motivates the feature
- What the ideal output / behaviour looks like
- Whether you'd be willing to implement it

---

<div align="center">
  <sub>Thank you for making AutoInfra Doctor better for the entire MikroTik community. 🙏</sub>
</div>
