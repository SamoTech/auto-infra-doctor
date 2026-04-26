# Support

## How to Get Help

| Channel | Use for |
|---|---|
| [GitHub Issues](https://github.com/SamoTech/auto-infra-doctor/issues) | Bug reports, incorrect rule detections |
| [GitHub Discussions](https://github.com/SamoTech/auto-infra-doctor/discussions) | Questions, feature ideas, general usage help |
| [docs/API.md](docs/API.md) | REST API reference |
| [docs/CLI.md](docs/CLI.md) | CLI flags and usage |
| [docs/RULES.md](docs/RULES.md) | Understanding why a rule fired |

---

## Before Opening an Issue

1. Check the [existing issues](https://github.com/SamoTech/auto-infra-doctor/issues?q=is%3Aissue) — your problem may already be reported
2. Read [docs/RULES.md](docs/RULES.md) — the rule may be intentional
3. Verify you are on the latest version: `npx auto-infra-doctor --version`

---

## Reporting a False Positive

If AutoInfra Doctor flags something you believe is correctly configured, open an issue with:

- The exact config line(s) that triggered the false positive
- Why you believe it is a false positive
- Your RouterOS version and use case context

False positive reports are high-priority — they directly improve rule quality.

---

## Security Vulnerabilities

For security issues, do **not** open a public issue. See [SECURITY.md](SECURITY.md) for the responsible disclosure process.

---

## Commercial Support

Need help integrating AutoInfra Doctor into your infrastructure or CI/CD pipeline? [Open a Discussion](https://github.com/SamoTech/auto-infra-doctor/discussions) describing your use case.
