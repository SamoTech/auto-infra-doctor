<!-- Banner -->
<div align="center">
  <img src="assets/banner.svg" alt="AutoInfra Doctor Banner" width="100%" />
</div>

<br/>

<div align="center">

[![Live Demo](https://img.shields.io/badge/🌐_Live_App-auto--infra--doctor.vercel.app-01696f?style=for-the-badge&logo=vercel&logoColor=white)](https://auto-infra-doctor.vercel.app/)
[![npm version](https://img.shields.io/npm/v/auto-infra-doctor?style=for-the-badge&logo=npm&logoColor=white&color=CB3837)](https://www.npmjs.com/package/auto-infra-doctor)
[![npm downloads](https://img.shields.io/npm/dm/auto-infra-doctor?style=for-the-badge&logo=npm&logoColor=white&color=CB3837)](https://www.npmjs.com/package/auto-infra-doctor)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)

[![GitHub Stars](https://img.shields.io/github/stars/SamoTech/auto-infra-doctor?style=for-the-badge&logo=github&color=gold)](https://github.com/SamoTech/auto-infra-doctor/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/SamoTech/auto-infra-doctor?style=for-the-badge&logo=github)](https://github.com/SamoTech/auto-infra-doctor/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/SamoTech/auto-infra-doctor?style=for-the-badge&logo=github)](https://github.com/SamoTech/auto-infra-doctor/issues)
[![GitHub PRs](https://img.shields.io/github/issues-pr/SamoTech/auto-infra-doctor?style=for-the-badge&logo=github)](https://github.com/SamoTech/auto-infra-doctor/pulls)
[![CI Audit](https://img.shields.io/github/actions/workflow/status/SamoTech/auto-infra-doctor/ai-autonomous.yml?label=CI+Audit&style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/SamoTech/auto-infra-doctor/actions/workflows/ai-autonomous.yml)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](CONTRIBUTING.md)
[![Sponsor](https://img.shields.io/badge/Sponsor-%E2%9D%A4-ea4aaa?style=for-the-badge&logo=github-sponsors&logoColor=white)](https://github.com/sponsors/SamoTech)

</div>

<br/>

<div align="center">
  <h1>🩺 AutoInfra Doctor</h1>
  <p><strong>Instant MikroTik RouterOS config analysis.<br/>Find security holes, misconfigurations, and performance issues — in seconds.</strong></p>
  <p>
    <a href="https://auto-infra-doctor.vercel.app/">🌐 Live App</a> ·
    <a href="docs/API.md">📡 API Docs</a> ·
    <a href="docs/CLI.md">⚙️ CLI Docs</a> ·
    <a href="docs/RULES.md">📋 Rule Reference</a> ·
    <a href="CHANGELOG.md">📝 Changelog</a>
  </p>
</div>

---

## ⚠️ The Problem

Debugging RouterOS configurations is slow, manual, and error-prone. One bad firewall rule can expose your entire network. One missing NAT entry breaks connectivity for hundreds of users. MikroTik's documentation is thorough — but it doesn't tell you what's *wrong* with **your specific config**.

AutoInfra Doctor does exactly that. Paste your config, get a prioritized list of issues with exact CLI fixes — no account, no install, no noise.

---

## 🚀 Quick Start

### 🌐 Web App — No Install Needed

Paste your config at **[auto-infra-doctor.vercel.app](https://auto-infra-doctor.vercel.app/)** and get results instantly.

### ⚙️ CLI

```bash
# One-time use (no install)
npx auto-infra-doctor analyze examples/mikrotik-broken.rsc --mode full

# Global install
npm install -g auto-infra-doctor
auto-infra-doctor analyze /path/to/config.rsc
auto-infra-doctor analyze /path/to/config.rsc --mode full --format json
```

### 📡 REST API

```bash
curl -X POST https://auto-infra-doctor.vercel.app/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"config": "/ip firewall filter add chain=input action=accept"}'
```

**Response:**

```json
{
  "score": 42,
  "issues": [
    {
      "severity": "CRITICAL",
      "message": "No drop-all rule at end of input chain",
      "impact": "All unmatched traffic accepted — router is wide open",
      "fix": "/ip firewall filter add chain=input action=drop comment=\"drop all\""
    }
  ],
  "summary": "5 issues found — 2 critical, 3 high",
  "analyzedAt": "2026-04-27T01:00:00.000Z"
}
```

---

## 🔥 CLI Demo Output

```
╔══════════════════════════════════════════════╗
║   AutoInfra Doctor — Analysis Complete      ║
║   Health Score: 42 / 100  ⚠️  At Risk       ║
╚══════════════════════════════════════════════╝

🔴 CRITICAL (2 issues)
─────────────────────────────────────────────
[1] No drop-all rule at end of input chain
    Impact : All unmatched traffic accepted — router is wide open
    Fix    : /ip firewall filter add chain=input action=drop comment="drop all"

[2] SOCKS proxy is enabled
    Impact : Router can be used as an anonymous tunnel
    Fix    : /ip socks set enabled=no

🟠 HIGH (3 issues)
─────────────────────────────────────────────
[3] DNS server allows remote requests (allow-remote-requests=yes)
    Impact : DNS amplification attack vector
    Fix    : /ip dns set allow-remote-requests=no

[4] Neighbor discovery enabled on all interfaces
    Impact : Router fingerprinting from WAN
    Fix    : /ip neighbor discovery-settings set discover-interface-list=LAN

[5] No brute-force protection on Winbox/SSH
    Impact : Unlimited login attempts allowed
    Fix    : Add connection-limit + address-list rules (see docs/RULES.md)
```

---

## ⚡ What AutoInfra Doctor Detects

| Category | Examples |
|---|---|
| 🔐 **Firewall** | No drop-all rule, missing forward chain, unrestricted input |
| 🌐 **Exposure** | Winbox on WAN, SOCKS/proxy enabled, UPnP, neighbor discovery |
| 🧠 **DNS & Services** | Open resolver, bandwidth server, API on public interface |
| 🔑 **Authentication** | Default admin account, no brute-force protection |
| 📡 **NAT** | Duplicate masquerade rules, unscoped masquerade |
| 🚦 **Routing** | Multiple default routes, asymmetric paths |
| 🔒 **VPN** | Weak IPSec proposals, L2TP without encryption |
| ⚙️ **Performance** | Oversized ruleset, FastTrack not enabled, connection tracking misconfig |

> **20+ checks** across all categories. New rules added continuously. See the full [Rule Reference →](docs/RULES.md)

---

## 🏗️ Architecture

```
auto-infra-doctor/
├── api/
│   └── analyze.js          ← Serverless API handler (Vercel)
├── src/
│   ├── engine.js            ← Orchestrator — rule runners + AI layer
│   ├── validator.js         ← Input validation & sanitization
│   ├── rules/
│   │   ├── mikrotik.js      ← Core RouterOS rules
│   │   ├── firewall.js      ← Firewall-specific detection
│   │   ├── nat.js           ← NAT analysis
│   │   ├── routing.js       ← BGP / OSPF / static route checks
│   │   └── vpn.js           ← IPSec / L2TP / WireGuard checks
│   └── ai/
│       ├── heuristics.js    ← Pattern intelligence (free, no API key)
│       └── openai.js        ← Optional GPT-4o-mini layer
├── dashboard/               ← Static frontend (HTML + CSS + JS)
├── bin/
│   └── cli.js               ← CLI entry point
├── examples/                ← Sample RouterOS configs for testing
├── docs/                    ← Extended documentation
└── vercel.json              ← Deployment config with security headers
```

The API handler is intentionally thin — it handles only HTTP concerns (rate limiting, validation, CORS, response shaping). All business logic lives in `src/`.

---

## 📖 Documentation

| Document | Description |
|---|---|
| [docs/API.md](docs/API.md) | REST API reference — endpoints, request/response shapes, error codes |
| [docs/CLI.md](docs/CLI.md) | CLI usage, all flags, output formats, CI/CD integration |
| [docs/RULES.md](docs/RULES.md) | Full rule catalogue — severity, detection logic, fix commands |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to add rules, run tests, submit PRs |
| [SECURITY.md](SECURITY.md) | Vulnerability disclosure policy |
| [CHANGELOG.md](CHANGELOG.md) | Version history and release notes |
| [SUPPORT.md](SUPPORT.md) | How to get help |

---

## 🛣️ Roadmap

- [x] Core MikroTik rule engine
- [x] Serverless REST API (Vercel)
- [x] Web dashboard
- [x] CLI (`npx auto-infra-doctor`)
- [x] Automated CI audit workflow
- [ ] Expanded rules (20+ checks across all categories)
- [ ] AI-enhanced analysis layer (GPT-4o-mini, opt-in)
- [ ] Health score gauge in UI
- [ ] Hash-based shareable report links
- [ ] PDF report export
- [ ] GitHub Action (`auto-infra-doctor/scan@v1`)
- [ ] VSCode extension
- [ ] Slack / webhook alert integration

---

## 💖 Sponsorship

AutoInfra Doctor is free and open-source. If it saves you debugging time, consider sponsoring its development:

<div align="center">

[![GitHub Sponsors](https://img.shields.io/badge/Sponsor_on_GitHub-%E2%9D%A4-ea4aaa?style=for-the-badge&logo=github-sponsors&logoColor=white)](https://github.com/sponsors/SamoTech)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy_Me_a_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/samotech)

</div>

**Sponsors receive:**
- 🚀 Early access to Pro features
- ⚡ Priority issue responses
- 📝 Name listed in CHANGELOG and README

---

## 🤝 Contributing

Contributions are what make open-source great. The most impactful way to contribute is by **adding a new detection rule** — every real-world misconfiguration you've encountered is a candidate.

```bash
git clone https://github.com/SamoTech/auto-infra-doctor.git
cd auto-infra-doctor
npm install
npm test
```

1. Fork the repo and create a branch: `git checkout -b feat/rule-upnp-check`
2. Add your rule to the appropriate file in `src/rules/`
3. Add a test case in `tests/` using a real-world config snippet
4. Submit a PR with a description of the misconfiguration and why it matters

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide including code style, commit conventions, and PR checklist.

---

## 👥 Contributors

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

Thanks to everyone who has contributed rules, fixes, and feedback. See all [contributors →](https://github.com/SamoTech/auto-infra-doctor/graphs/contributors)

---

## 📄 License

MIT © 2024–2026 [SamoTech](https://github.com/SamoTech)

See [LICENSE](LICENSE) for the full text.

---

<div align="center">
  <sub>Built for the global MikroTik community. If AutoInfra Doctor helped you, give it a ⭐ — it helps others find it.</sub>
</div>
