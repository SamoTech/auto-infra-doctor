# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| Latest (`main` branch) | ✅ Actively supported |
| Previous minor releases | ⚠️ Critical fixes only |
| Older releases | ❌ Not supported |

We recommend always running the latest published version.

---

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**  
Public disclosure before a fix is available puts all users at risk.

### How to report

1. **Email:** Send a report to the maintainer via GitHub's [private vulnerability reporting](https://github.com/SamoTech/auto-infra-doctor/security/advisories/new).
2. **Include in your report:**
   - A clear description of the vulnerability
   - Steps to reproduce (proof-of-concept if applicable)
   - Affected versions
   - Potential impact and attack scenario
   - Your suggested fix (optional but appreciated)
3. **Encrypt sensitive details** using the maintainer's GPG key if the vulnerability is severe.

---

## Response Timeline

| Stage | Target timeline |
|---|---|
| Initial acknowledgement | Within 48 hours |
| Severity assessment | Within 5 business days |
| Fix development | Based on severity (see below) |
| Coordinated disclosure | After fix is released |

### Fix timelines by severity

| Severity | Target fix time |
|---|---|
| Critical | Within 48 hours |
| High | Within 7 days |
| Medium | Within 30 days |
| Low | Next scheduled release |

---

## Scope

### In scope

- Remote code execution via the `/api/analyze` endpoint
- Injection attacks (SQL, command, script) via user-supplied config input
- Authentication/authorization bypass
- Sensitive data exposure (API keys, user data, server internals)
- Cross-site scripting (XSS) in the dashboard
- Denial of service via unbounded input processing
- Dependency vulnerabilities in published npm package

### Out of scope

- Theoretical vulnerabilities with no practical exploitation path
- Issues requiring physical access to the server
- Social engineering attacks
- Vulnerabilities in third-party services (Vercel platform, GitHub)
- Rate limiting bypass via distributed IPs (infrastructure-level concern)

---

## Disclosure Policy

We follow **responsible disclosure**:

1. Reporter submits the vulnerability privately
2. We confirm receipt and assess severity within 48 hours
3. We develop and test a fix
4. We release the fix with a security advisory
5. We credit the reporter in the advisory (unless they prefer anonymity)
6. Reporter may publish their findings 7 days after the fix is released

---

## Security Architecture Notes

For security researchers reviewing this codebase:

- **API endpoint** (`/api/analyze`): Accepts POST with `config` string. Rate-limited to 10 req/min/IP. Input capped at 500 KB. No authentication required by design (public tool).
- **Frontend**: Static HTML/JS. No user accounts, no sessions, no cookies used for functionality.
- **No data persistence**: Configs submitted for analysis are processed in memory and never stored.
- **Vercel deployment**: Security headers including CSP, `X-Frame-Options`, and `X-Content-Type-Options` are applied at the CDN layer via `vercel.json`.

---

## Hall of Fame

We gratefully acknowledge security researchers who have responsibly disclosed vulnerabilities:

*No reports yet — be the first.*

---

## Contact

- **GitHub Security Advisories:** [Report a vulnerability](https://github.com/SamoTech/auto-infra-doctor/security/advisories/new)
- **Maintainer:** [@SamoTech](https://github.com/SamoTech)
