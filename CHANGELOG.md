# Changelog

All notable changes to AutoInfra Doctor are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- Expanded rules engine (20+ checks across firewall, NAT, VPN, routing)
- AI-enhanced analysis via optional GPT-4o-mini layer
- Health score gauge in web UI
- PDF report export
- Hash-based shareable report links
- GitHub Action (`auto-infra-doctor/scan@v1`)

---

## [1.0.0] — 2026-04-26

### Added
- Initial public release
- CLI analyzer (`npx auto-infra-doctor analyze <file>`)
- Serverless API endpoint (`POST /api/analyze`)
- Static web dashboard at [auto-infra-doctor.vercel.app](https://auto-infra-doctor.vercel.app/)
- Core MikroTik RouterOS rule engine (`src/rules/mikrotik.js`)
- Basic AI analysis layer (`src/ai/basic.js`)
- Example config files in `examples/`
- Automated CI audit workflow (`.github/workflows/ai-autonomous.yml`)
- Vercel deployment configuration

### Fixed
- CI workflow: granted `issues: write` permission to `GITHUB_TOKEN`
- CI workflow: added `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` to suppress Node.js 20 deprecation warnings
- `vercel.json`: migrated from legacy `routes` to `rewrites` format

---

[Unreleased]: https://github.com/SamoTech/auto-infra-doctor/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/SamoTech/auto-infra-doctor/releases/tag/v1.0.0
