# Security Policy

## Supported Versions

Security fixes are applied to the **latest release** only.

| Version | Supported |
|---|---|
| 1.2.x (latest) | ✅ Yes |
| 1.1.x | ❌ No — upgrade to 1.2.x |
| 1.0.x | ❌ No — upgrade to 1.2.x |

---

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub Issues.**

To report a vulnerability, send an email to:

> **security@samotech.dev** *(or open a [GitHub Security Advisory](https://github.com/SamoTech/auto-infra-doctor/security/advisories/new) — preferred)*

Include as much of the following as possible:

- A description of the vulnerability and its potential impact
- Steps to reproduce or a proof-of-concept
- The component affected (`api/`, `src/`, `dashboard/`, `bin/`)
- Any suggested mitigations

---

## Response Timeline

| Step | Target time |
|---|---|
| Acknowledgement of report | Within 48 hours |
| Initial triage and severity assessment | Within 5 business days |
| Fix released (for confirmed Critical/High) | Within 14 days |
| Public disclosure | After fix is released |

---

## Scope

### In scope

- `/api/analyze` endpoint: injection, authentication bypass, rate limit bypass, DoS
- `src/` modules: code execution via malformed config input
- `dashboard/`: XSS, CSRF, clickjacking, data exposure
- `bin/cli.js`: path traversal, arbitrary file read
- Dependency vulnerabilities with a direct exploitation path

### Out of scope

- Theoretical vulnerabilities with no practical exploitation path
- Issues in Vercel's infrastructure itself
- Vulnerabilities requiring physical access to the server
- Self-XSS (the user injecting into their own session)
- Rate limiting bypass via a single low-impact request

---

## Security Design Notes

AutoInfra Doctor is designed with the following security controls:

- **No user accounts or persistent storage** — configs are analyzed in memory and never stored
- **Input size cap** — 500 KB maximum payload on `/api/analyze`
- **Rate limiting** — 10 requests/minute per IP (in-memory, per Vercel instance)
- **CORS allowlist** — only the production origin is accepted
- **Output escaping** — all user-derived strings pass through `escapeHtml()` before DOM insertion
- **Security headers** — `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, and a strict CSP are set on every response via `vercel.json`
- **No eval / dynamic execution** — config analysis is purely string-based pattern matching

---

## Responsible Disclosure

AutoInfra Doctor follows a coordinated disclosure model. Researchers who report valid vulnerabilities will be credited in the release notes (if desired) and acknowledged in this file.

---

<div align="center">
  <sub>Thank you for helping keep AutoInfra Doctor and the engineers who rely on it safe.</sub>
</div>
