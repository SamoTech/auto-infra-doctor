# Changelog

All notable changes to AutoInfra Doctor are documented here.

This project adheres to [Semantic Versioning](https://semver.org/) and [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.2.0] — 2026-04-27

### Added
- Published to npm registry — `npx auto-infra-doctor` now works globally
- Short CLI alias `aid` alongside `auto-infra-doctor`
- `src/engine.js` orchestrator — single entry point for all rule runners and AI layer
- `src/validator.js` — input validation with 500 KB size cap and content-type checks
- `src/rules/firewall.js` — 10 new firewall-specific rules (SOCKS, UPnP, Winbox exposure, brute-force protection, drop-all enforcement)
- `src/rules/nat.js` — unscoped masquerade detection, duplicate rule detection
- `src/rules/routing.js` — multiple default route detection, asymmetric path warnings
- `src/rules/vpn.js` — weak IPSec proposal detection, L2TP without encryption
- `src/ai/heuristics.js` — pattern intelligence layer (free, no API key required)
- `src/ai/openai.js` — optional GPT-4o-mini enhanced analysis (requires `OPENAI_API_KEY`)
- In-memory rate limiting — 10 requests/min per IP on `/api/analyze`
- CORS hardening — explicit origin allowlist
- Security headers in `vercel.json` — X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy
- Health score (0–100) returned in every API response
- `analyzedAt` ISO timestamp in API response
- `docs/API.md` — full REST API reference
- `docs/CLI.md` — CLI usage guide with all flags and CI/CD integration examples
- `docs/RULES.md` — complete rule catalogue

### Changed
- `api/analyze.js` refactored to thin HTTP handler — all business logic moved to `src/`
- `vercel.json` migrated from legacy `routes` to modern `rewrites` format
- README updated with npm install badges and instructions
- Roadmap updated — npm publish item marked complete

### Fixed
- Dead code `src/analyzer.js` removed (logic now in `src/engine.js`)
- `localStorage` usage replaced with hash-based URL state for report sharing
- All `innerHTML` interpolation now uses `escapeHtml()` to prevent XSS
- Input payload missing size limit (now capped at 500 KB)

### Security
- Rate limiting added to prevent function quota exhaustion
- CORS restricted to known origins
- Security response headers added to all routes
- Config content sanitized before processing

---

## [1.1.0] — 2026-04-20

### Added
- CI audit GitHub Actions workflow (`ai-autonomous.yml`)
- `CONTRIBUTING.md`, `SECURITY.md`, `SUPPORT.md`, `CODE_OF_CONDUCT.md`
- `.github/FUNDING.yml` — GitHub Sponsors + Buy Me a Coffee
- `.github/ISSUE_TEMPLATE/` — bug report and feature request templates
- `.github/PULL_REQUEST_TEMPLATE.md`
- `.npmignore` to exclude dev/dashboard files from npm tarball
- `examples/mikrotik-broken.rsc` — sample broken config for testing

### Changed
- Project structure reorganized: `src/rules/`, `src/ai/`, `bin/`, `docs/`
- `package.json` enhanced with `keywords`, `homepage`, `repository`, `bin`, `engines`

---

## [1.0.0] — 2026-04-10

### Added
- Initial release
- Core MikroTik rules engine (`src/rules/mikrotik.js`) — 5 baseline rules
- Serverless API handler (`api/analyze.js`) deployed on Vercel
- Static web dashboard (`dashboard/app.html`)
- CLI entry point (`bin/cli.js`)
- Basic AI layer (`src/ai/basic.js`)
- `vercel.json` deployment config
- MIT License
- Initial `README.md`

---

[1.2.0]: https://github.com/SamoTech/auto-infra-doctor/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/SamoTech/auto-infra-doctor/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/SamoTech/auto-infra-doctor/releases/tag/v1.0.0
