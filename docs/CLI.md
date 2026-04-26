# CLI Reference

AutoInfra Doctor ships with a CLI for local analysis, CI/CD pipelines, and scripting.

---

## Installation

```bash
# Global install (recommended)
npm install -g auto-infra-doctor

# One-time use (no install required)
npx auto-infra-doctor <command>
```

**Requirements:** Node.js 18+

---

## Commands

### `analyze`

Analyze a RouterOS config file.

```bash
auto-infra-doctor analyze <file> [options]
```

**Arguments:**

| Argument | Description |
|---|---|
| `<file>` | Path to a RouterOS `.rsc` export file |

**Options:**

| Flag | Default | Description |
|---|---|---|
| `--mode` | `standard` | Analysis mode: `standard` or `full` |
| `--format` | `text` | Output format: `text`, `json`, `markdown` |
| `--min-severity` | `LOW` | Minimum severity to show: `CRITICAL`, `HIGH`, `MEDIUM`, `LOW` |
| `--no-color` | — | Disable ANSI color output |

**Examples:**

```bash
# Standard analysis with colored output
auto-infra-doctor analyze router-export.rsc

# Full analysis, only show HIGH and above
auto-infra-doctor analyze router-export.rsc --mode full --min-severity HIGH

# JSON output for scripting
auto-infra-doctor analyze config.rsc --format json | jq '.issues[].severity'

# Markdown output for documentation
auto-infra-doctor analyze config.rsc --format markdown > report.md

# Use in CI (exit 1 if any CRITICAL issues found)
auto-infra-doctor analyze config.rsc --min-severity CRITICAL
echo "Exit code: $?"
```

---

## Exit Codes

| Code | Meaning |
|---|---|
| `0` | Analysis complete, no issues at the requested severity level |
| `1` | Issues found at or above the requested severity level |
| `2` | Invalid arguments or file not found |
| `3` | Analysis engine error |

Use exit codes to fail CI pipelines on critical issues:

```yaml
# .github/workflows/mikrotik-check.yml
- name: Audit MikroTik config
  run: npx auto-infra-doctor analyze configs/router.rsc --min-severity HIGH
  # Step fails if any HIGH or CRITICAL issues are found
```

---

## Exporting a Config from RouterOS

To get the config string for analysis, run this in your MikroTik terminal:

```routeros
/export compact
```

Save the output to a `.rsc` file and pass it to the CLI.

For a full export (including sensitive data — handle carefully):

```routeros
/export
```
