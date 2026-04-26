# Changelog

All notable changes to AutoInfra Doctor are documented here.

This project follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- Expanded rule engine: 20+ checks across firewall, NAT, VPN, routing
- AI-enhanced analysis layer (GPT-4o-mini, opt-in via `OPENAI_API_KEY`)
- Health score gauge in web UI
- Hash-based shareable report links (replaces broken `localStorage` approach)
- PDF report export via print stylesheet
- GitHub Action: `auto-infra-doctor/scan@v1`
- VSCode extension
- Slack / webhook alert integration

---

## [1.1.0] — 2026-04-27

### Added
- Full-pass documentation refactor: README, CONTRIBUTING, SECURITY, SUPPORT, CHANGELOG
- `LICENSE` file (MIT)
- `.github/FUNDING.yml` — GitHub Sponsors + Buy Me a Coffee
- Security headers in `vercel.json` (X-Content-Type-Options, X-Frame-Options, Referrer-Policy)
- Input validation module (`src/validator.js`) — size limit (500 KB), type checks, XSS detection
- In-memory rate limiting: 10 requests/min per IP
- CORS hardening on `/api/analyze`
- `src/engine.js` orchestrator — merges rule runners and AI layer into single async pipeline
- Architecture diagram in README
- API response now includes `score`, `summary`, and `analyzedAt` fields

### Fixed
- Removed duplicate / conflicting analysis logic between `src/analyzer.js` and `src/rules/mikrotik.js`
- `localStorage` report-sharing replaced with hash-based URL encoding
- `innerHTML` interpolation patched to use `escapeHtml()` — closes XSS vector

### Changed
- `vercel.json` migrated from legacy `routes` format to modern `rewrites`
- Severity-sorted issue output (CRITICAL → HIGH → MEDIUM → LOW)

---

## [1.0.0] — 2025-12-01

### Added
- Initial release
- Core MikroTik RouterOS rule engine (`src/rules/mikrotik.js`)
- 5 baseline firewall checks: input chain, forward chain, DNS exposure, Winbox WAN, SOCKS
- Serverless API handler (`api/analyze.js`) deployed on Vercel
- Static web dashboard (`dashboard/app.html`)
- CLI entry point (`bin/cli.js`) — `npx auto-infra-doctor analyze <file>`
- Automated CI audit workflow (`.github/workflows/ai-autonomous.yml`)
- Example RouterOS config files (`examples/`)
- Basic AI layer (`src/ai/basic.js`)
- `package.json` with `bin` field for `npx` support
- README with quick start, demo output, and badges

---

[Unreleased]: https://github.com/SamoTech/auto-infra-doctor/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/SamoTech/auto-infra-doctor/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/SamoTech/auto-infra-doctor/releases/tag/v1.0.0
