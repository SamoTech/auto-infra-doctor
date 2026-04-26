# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| Latest (`main` branch) | ✅ Active |
| Older releases | ❌ No backports |

---

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.** Public disclosure before a fix is ready puts users at risk.

### How to Report

Send a private report via **[GitHub Security Advisories](https://github.com/SamoTech/auto-infra-doctor/security/advisories/new)**.

Include:
- Description of the vulnerability
- Steps to reproduce (proof of concept if possible)
- Affected component (`api/`, `src/`, `dashboard/`, CLI)
- Potential impact assessment

### Response Timeline

| Stage | Target |
|---|---|
| Acknowledgement | Within 48 hours |
| Initial assessment | Within 5 business days |
| Fix released | Within 14 days for Critical/High |
| Public disclosure | After fix is deployed |

---

## Scope

### In Scope

- **API endpoint** (`/api/analyze`) — injection, denial of service, auth bypass
- **Frontend** (`dashboard/`) — XSS, CSRF, data leakage
- **CLI** (`bin/cli.js`) — arbitrary file read, command injection
- **Rules engine** (`src/`) — logic that could produce misleading or dangerous fix recommendations

### Out of Scope

- Vulnerabilities in third-party dependencies (report to the upstream package maintainer)
- Rate limiting bypass on free tier (by design — upgrade to Pro for SLA guarantees)
- Issues requiring physical access to the server

---

## Security Architecture Notes

The API processes untrusted RouterOS config strings. Key mitigations in place:

- Input validated and size-limited before processing (500 KB max)
- All rule analysis is pure string matching — no `eval()`, no `exec()`, no shell commands
- API responses escape all user-derived content before rendering
- Security headers set on all responses (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`)
- Rate limiting: 10 requests/minute per IP

---

## Hall of Fame

Responsible disclosure is appreciated. Reporters of valid vulnerabilities will be credited here (with permission).

| Researcher | Issue | Disclosed |
|---|---|---|
| — | — | — |
