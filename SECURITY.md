# Security Policy

## Supported Versions

Security fixes are applied to the latest release only.

| Version | Supported |
|---|---|
| `1.x` (latest) | ✅ Yes |
| `< 1.0` | ❌ No |

---

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.** Public disclosure before a fix is available puts all users at risk.

### How to report

1. **Email:** Send details to the repository owner via the contact method listed on [github.com/SamoTech](https://github.com/SamoTech).
2. **GitHub Private Advisory:** Use [GitHub's private vulnerability reporting](https://github.com/SamoTech/auto-infra-doctor/security/advisories/new) if available on your account.

### What to include

- A clear description of the vulnerability
- Steps to reproduce or a proof-of-concept
- Potential impact (what an attacker could do)
- Affected version(s)
- Any suggested fix, if you have one

---

## Response Timeline

| Phase | Target time |
|---|---|
| Acknowledgement | Within **48 hours** |
| Initial assessment | Within **5 business days** |
| Fix and patch release | Within **30 days** for critical issues |
| Public disclosure | After fix is released and users have had time to update |

---

## Scope

Vulnerabilities relevant to this project include:

- **API security:** Rate limiting bypass, authentication bypass, injection via the `/api/analyze` endpoint
- **XSS:** Frontend rendering of user-supplied or API-returned content
- **Dependency vulnerabilities:** Known CVEs in dependencies used by the project
- **Information disclosure:** Unintended exposure of server internals or configuration

**Out of scope:**

- Issues in RouterOS itself or MikroTik hardware — report those to [MikroTik directly](https://mikrotik.com/contact)
- Vulnerabilities that require physical access to the server
- Issues only reproducible in non-production environments

---

## Responsible Disclosure

This project follows a coordinated disclosure model. Reporters who follow this process will be credited in the release notes (unless they prefer to remain anonymous).
