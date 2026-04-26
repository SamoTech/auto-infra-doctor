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
[![GitHub Issues](https://img.shields.io/github/issues/SamoTech/auto-infra-doctor?style=for-the-badge&logo=github)](https://github.com/SamoTech/auto-infra-doctor/issues)
[![GitHub PRs](https://img.shields.io/github/issues-pr/SamoTech/auto-infra-doctor?style=for-the-badge&logo=github)](https://github.com/SamoTech/auto-infra-doctor/pulls)
[![CI Audit](https://img.shields.io/github/actions/workflow/status/SamoTech/auto-infra-doctor/ai-autonomous.yml?label=CI+Audit&style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/SamoTech/auto-infra-doctor/actions/workflows/ai-autonomous.yml)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)

</div>

<br/>

<div align="center">
  <h1>🩺 AutoInfra Doctor</h1>
  <p><strong>Instant MikroTik RouterOS config analysis.<br/>Find security holes, misconfigurations, and performance issues in seconds.</strong></p>
</div>

---

## ⚠️ The Problem

Debugging RouterOS configurations is slow, manual, and error-prone. One bad firewall rule can expose your entire network. One missing NAT entry breaks connectivity for hundreds of users. And MikroTik's documentation — while complete — doesn't tell you what's *wrong* with your specific config.

AutoInfra Doctor does exactly that. Paste your config, get a prioritized list of issues with exact CLI fixes.

---

## 🚀 Quick Start

### Web App (No Install)

> Paste your config at **[auto-infra-doctor.vercel.app](https://auto-infra-doctor.vercel.app/)** — no account needed.

### CLI

```bash
# One-time use (no install)
npx auto-infra-doctor analyze examples/mikrotik-broken.rsc --mode full

# Global install
npm install -g auto-infra-doctor
auto-infra-doctor analyze /path/to/config.rsc
```

### API

```bash
curl -X POST https://auto-infra-doctor.vercel.app/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"config": "/ip firewall filter add chain=input action=accept"}'
```

---

## 🔥 Demo Output

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
| ⚙️ **Performance** | Oversized ruleset, FastTrack not enabled |

---

## 🏗️ Architecture

```
auto-infra-doctor/
├── api/
│   └── analyze.js          ← Serverless API handler (Vercel)
├── src/
│   ├── engine.js            ← Orchestrator (rule runners + AI layer)
│   ├── validator.js         ← Input validation & sanitization
│   ├── rules/
│   │   ├── mikrotik.js      ← Core RouterOS rules
│   │   ├── firewall.js      ← Firewall-specific detection
│   │   ├── nat.js           ← NAT analysis
│   │   ├── routing.js       ← BGP/OSPF/static route checks
│   │   └── vpn.js           ← IPSec/L2TP/WireGuard checks
│   └── ai/
│       ├── heuristics.js    ← Pattern intelligence (free, no API key)
│       └── openai.js        ← Optional GPT-4o-mini layer
├── dashboard/               ← Static frontend
├── bin/
│   └── cli.js               ← CLI entry point
├── examples/                ← Sample RouterOS configs
└── vercel.json
```

---

## 📖 Documentation

| Document | Description |
|---|---|
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to add rules, submit PRs, run tests |
| [SECURITY.md](SECURITY.md) | Vulnerability disclosure policy |
| [CHANGELOG.md](CHANGELOG.md) | Version history |
| [docs/RULES.md](docs/RULES.md) | Full rule reference with examples |
| [docs/API.md](docs/API.md) | REST API documentation |
| [docs/CLI.md](docs/CLI.md) | CLI usage and flags |

---

## 🛣️ Roadmap

- [x] CLI analyzer
- [x] Core MikroTik rule engine
- [x] Serverless API (Vercel)
- [x] Web dashboard
- [x] Automated CI audit workflow
- [ ] Expanded rules (20+ checks)
- [ ] AI-enhanced analysis (GPT-4o-mini optional)
- [ ] Health score gauge in UI
- [ ] PDF report export
- [ ] Shareable report links (hash-based)
- [ ] VSCode extension
- [ ] GitHub Action (`auto-infra-doctor/scan@v1`)

---

## 💖 Sponsor

If AutoInfra Doctor saves you time, consider sponsoring its development:

[![GitHub Sponsors](https://img.shields.io/badge/Sponsor-%E2%9D%A4-ea4aaa?style=for-the-badge&logo=github-sponsors&logoColor=white)](https://github.com/sponsors/SamoTech)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy_Me_a_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/samotech)

Sponsors get:
- Early access to Pro features
- Priority issue responses
- Name in the CHANGELOG

---

## 🤝 Contributing

Contributions are welcome! The easiest way to help is by **adding a new detection rule**:

1. Fork the repo
2. Add your rule to the appropriate file in `src/rules/`
3. Add a test case in `tests/`
4. Submit a PR with a real-world example of the misconfiguration

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

---

## 📄 License

MIT © [SamoTech](https://github.com/SamoTech)

---

<div align="center">
  <sub>Built for the MikroTik community. If this helped you, give it a ⭐</sub>
</div>
