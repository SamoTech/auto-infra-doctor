# Changelog

All notable changes to **AutoInfra Doctor** are documented here.

This project follows [Semantic Versioning](https://semver.org/) and [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) conventions.

---

## [Unreleased]

### Planned
- AI-enhanced analysis layer (GPT-4o-mini, opt-in via `OPENAI_API_KEY`)
- Health score gauge in dashboard UI
- Hash-based shareable report URLs
- PDF report export via print stylesheet
- GitHub Action: `auto-infra-doctor/scan@v1`
- VSCode extension
- Slack / webhook alert integration
- Team API keys + usage dashboard

---

## [1.2.0] — 2026-04-27

### Added
- **npm publish workflow** — automated release to npm registry on `v*` tag push via GitHub Actions
- **CLI short alias** — `aid` as a shorthand for `auto-infra-doctor` globally installed
- **`.npmignore`** — excludes dashboard, examples, docs, and `.github` from npm package to keep install size minimal
- **Security headers in `vercel.json`** — `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, and a strict `Content-Security-Policy`
- **Rate limiting** — 10 requests/minute per IP on the `/api/analyze` endpoint (in-memory, per-instance)
- **Input validation** — strict size cap (500 KB), type checks, and basic content sanity in `src/validator.js`
- **CORS hardening** — only allowlisted origins accepted; `OPTIONS` preflight handled correctly
- **`src/engine.js`** orchestrator — single entry point that runs all rule modules in parallel via `Promise.all`
- **Dead code removal** — deleted conflicting `src/analyzer.js`; `src/rules/mikrotik.js` is now the sole rule source
- **Vercel Analytics** — performance and visitor telemetry added to dashboard
- **Autonomous CI audit workflow** — `ai-autonomous.yml` runs on every push to `main`
- **`.github/FUNDING.yml`** — GitHub Sponsors + Buy Me a Coffee sponsor button
- **Full docs refactor** — `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `SUPPORT.md`, `CODE_OF_CONDUCT.md`, `CHANGELOG.md` rewritten for production quality

### Changed
- `vercel.json` migrated from legacy `routes` format to modern `rewrites` + `headers` structure
- API response now includes `score`, `summary`, and `analyzedAt` fields
- Severity sorting applied to all issue arrays (CRITICAL → HIGH → MEDIUM → LOW)
- `LICENSE` copyright year updated to 2026
- Roadmap in `README.md` updated to reflect completed items

### Fixed
- `localStorage` usage replaced with hash-based URL state to resolve silent failures in sandboxed iframe contexts
- XSS vector in results rendering — all user-derived strings now go through `escapeHtml()` before `innerHTML`
- Duplicate `chain=input` detection logic that existed in both `analyzer.js` and `mikrotik.js`

---

## [1.1.0] — 2026-04-27

### Added
- Full production hardening pass (security, rules engine, AI stub, API, UI)
- Vercel Analytics integration with tightened CSP
- Root `/` now serves the full app directly (no redirect via `index.html`)
- `issues:write` permission added to audit workflow for automated issue creation

### Fixed
- Removed invalid `analytics` property from `vercel.json` that caused deploy failures
- Granted correct GitHub Actions permissions for the audit workflow

---

## [1.0.0] — 2026-04-27

### Added
- Initial public release
- Core MikroTik RouterOS rule engine (`src/rules/mikrotik.js`)
- Serverless REST API handler (`api/analyze.js`) deployed on Vercel
- Static web dashboard (`index.html`)
- CLI entry point (`bin/cli.js`) — `npx auto-infra-doctor analyze <file>`
- Basic AI stub (`src/ai/basic.js`)
- Example RouterOS config files (`examples/`)
- GitHub Actions autonomous audit workflow
- `README.md`, `LICENSE` (MIT), `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `SUPPORT.md`
- Documentation structure: `docs/API.md`, `docs/CLI.md`, `docs/RULES.md`

---

[Unreleased]: https://github.com/SamoTech/auto-infra-doctor/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/SamoTech/auto-infra-doctor/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/SamoTech/auto-infra-doctor/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/SamoTech/auto-infra-doctor/releases/tag/v1.0.0
