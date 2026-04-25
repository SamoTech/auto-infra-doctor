# AutoInfra Doctor

Find and fix broken infrastructure configs in seconds.

## The Problem

You paste a config.
You debug for hours.
Still broken.

## The Solution

AutoInfra Doctor tells you:
- What is wrong
- Why it matters
- Exact fix commands

## Example

Input:
```
/ip firewall nat add chain=srcnat action=masquerade
/ip firewall nat add chain=srcnat action=masquerade
```

Output:
```
[CRITICAL] Duplicate NAT rule
[FIX] /ip firewall nat remove 1
```

## Usage

```
npx auto-infra-doctor analyze config.rsc --mode full
```

## Roadmap
- CLI
- AI engine
- Web UI
- SaaS

## Vision
Make infrastructure debugging instant.
