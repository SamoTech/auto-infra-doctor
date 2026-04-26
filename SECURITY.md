# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| 1.2.x (latest) | ✅ Active support |
| 1.1.x | ⚠️ Security fixes only |
| < 1.1.0 | ❌ No longer supported |

Always use the latest version of `auto-infra-doctor` from [npm](https://www.npmjs.com/package/auto-infra-doctor) or the [GitHub releases page](https://github.com/SamoTech/auto-infra-doctor/releases).

---

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.** Doing so may expose the flaw to malicious actors before a fix is available.

Instead, report privately:

1. **GitHub Private Vulnerability Reporting** (preferred) — use the [Security tab → Report a vulnerability](https://github.com/SamoTech/auto-infra-doctor/security/advisories/new) button
2. **Email** — send details to the repository maintainer via GitHub profile contact

### What to include

- A clear description of the vulnerability
- Steps to reproduce (include minimal config payloads where relevant)
- Affected version(s)
- Potential impact and attack vector
- Optional: suggested fix or mitigation

---

## Response Timeline

| Stage | Target |
|---|---|
| Acknowledgement | Within 48 hours |
| Initial assessment | Within 5 business days |
| Fix release (critical) | Within 14 days |
| Fix release (high/medium) | Within 30 days |
| Public disclosure | After fix is released |

---

## Scope

In scope for security reports:

- API endpoint vulnerabilities (injection, auth bypass, SSRF)
- XSS in the dashboard frontend
- Denial-of-service via malformed config input
- Sensitive data exposure in API responses
- Dependency vulnerabilities with a CVSS score ≥ 7.0

Out of scope:

- Issues in RouterOS itself (report those to [MikroTik](https://mikrotik.com/support))
- Rate limiting complaints (by design: 10 req/min/IP)
- Self-inflicted issues from running untrusted configs

---

## Security Design Notes

AutoInfra Doctor is a **read-only analysis tool** — it never connects to, modifies, or deploys to any router. Config text is processed server-side and discarded after analysis. No config data is persisted.

- All API inputs are validated and capped at 500 KB
- Rate limiting is applied per IP (10 req/min)
- CORS is restricted to known origins
- Security headers are set on all responses
- No user accounts, no stored credentials, no database
