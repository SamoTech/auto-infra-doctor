# Contributing to AutoInfra Doctor

Thank you for taking the time to contribute. AutoInfra Doctor improves when engineers who have seen real-world MikroTik misconfigurations share that knowledge as detection rules.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Development Setup](#development-setup)
- [Adding a Detection Rule](#adding-a-detection-rule)
- [Commit Convention](#commit-convention)
- [Pull Request Checklist](#pull-request-checklist)
- [Reporting Bugs](#reporting-bugs)
- [Security Vulnerabilities](#security-vulnerabilities)

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold it. Treat everyone with respect.

---

## Ways to Contribute

| Type | How |
|---|---|
| 🐛 **Bug report** | Open an [issue](https://github.com/SamoTech/auto-infra-doctor/issues/new?template=bug_report.md) with a reproduction case |
| 💡 **New rule** | See [Adding a Detection Rule](#adding-a-detection-rule) below |
| 📖 **Documentation** | Fix typos, improve examples, translate to your language |
| 🧪 **Tests** | Add test cases for edge-case configs in `tests/` |
| 🎨 **UI/UX** | Improve the web dashboard — open an issue first to discuss |
| 💬 **Discussion** | Share real-world MikroTik configs that caused incidents |

---

## Development Setup

```bash
# 1. Fork and clone
git clone https://github.com/<your-username>/auto-infra-doctor.git
cd auto-infra-doctor

# 2. Install dependencies
npm install

# 3. Run tests
npm test

# 4. Run the API locally
npm run dev
# API available at http://localhost:3000/api/analyze

# 5. Test CLI locally
node bin/cli.js analyze examples/mikrotik-broken.rsc
```

**Requirements:** Node.js ≥ 18

---

## Adding a Detection Rule

This is the most impactful way to contribute. Each rule should be based on a real misconfiguration you have encountered in production.

### 1. Choose the right module

| File | Covers |
|---|---|
| `src/rules/firewall.js` | Filter rules, input/forward/output chains, drop-all |
| `src/rules/nat.js` | Masquerade, DNAT, src-NAT |
| `src/rules/routing.js` | Default routes, BGP, OSPF, route marks |
| `src/rules/vpn.js` | IPSec, L2TP, WireGuard, SSTP |
| `src/rules/mikrotik.js` | General RouterOS settings that don't fit above |

### 2. Rule structure

Every rule must return an object with these fields:

```javascript
{
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW',
  message: 'Short description of the issue (≤80 chars)',
  impact: 'What can go wrong if this is not fixed',
  fix: '/ip command to fix it — exact RouterOS CLI syntax',
  // Optional:
  source: 'rule' | 'ai',   // defaults to 'rule'
  ref: 'https://link-to-mikrotik-docs-or-CVE'
}
```

### 3. Example rule

```javascript
// In src/rules/firewall.js

// Check: UPnP enabled
if (config.includes('upnp') && config.includes('enabled=yes')) {
  issues.push({
    severity: 'HIGH',
    message: 'UPnP is enabled',
    impact: 'LAN devices can open external ports without admin approval',
    fix: '/ip upnp set enabled=no',
    ref: 'https://help.mikrotik.com/docs/display/ROS/UPnP'
  });
}
```

### 4. Add a test case

```javascript
// In tests/firewall.test.js
test('detects UPnP enabled', () => {
  const config = '/ip upnp\nset enabled=yes';
  const issues = runFirewallRules(config);
  expect(issues.some(i => i.message.includes('UPnP'))).toBe(true);
});
```

### 5. Add an example config

If your rule detects something not already covered by `examples/mikrotik-broken.rsc`, add a minimal config snippet to `examples/` that triggers it.

---

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(rules): add UPnP detection in firewall module
fix(api): escape innerHTML to prevent XSS
docs(readme): update quick start examples
test(nat): add masquerade without src-address test case
refactor(engine): extract orchestrator from api handler
```

| Prefix | When to use |
|---|---|
| `feat` | New rule, feature, or capability |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `test` | Adding or updating tests |
| `refactor` | Code restructuring, no behavior change |
| `chore` | Tooling, deps, CI config |

---

## Pull Request Checklist

Before submitting, verify:

- [ ] `npm test` passes with no failures
- [ ] New rule has at least one test case in `tests/`
- [ ] Commit messages follow the convention above
- [ ] Rule includes `message`, `impact`, `fix`, and `severity`
- [ ] `fix` field contains exact RouterOS CLI syntax
- [ ] No `console.log` or debug code left in
- [ ] PR description explains the real-world scenario the rule addresses

---

## Reporting Bugs

Open an [issue](https://github.com/SamoTech/auto-infra-doctor/issues) and include:

1. What you did (steps to reproduce)
2. What you expected to happen
3. What actually happened
4. A minimal config snippet that triggers the issue (sanitize sensitive data)
5. Node.js version (`node --version`)

---

## Security Vulnerabilities

Do **not** open a public issue for security vulnerabilities. See [SECURITY.md](SECURITY.md) for the responsible disclosure process.
