# AutoInfra Doctor

> Find and fix broken MikroTik configs in seconds.

---

## Why this exists

Debugging RouterOS configs is slow and error‑prone.
Small mistakes cause outages, open attack surface, or wasted CPU.

AutoInfra Doctor turns configs into:
- detected issues
- real impact
- exact CLI fixes

---

## What you get

- Deterministic checks (works without AI)
- CLI-ready fixes
- Security flags (input chain, exposure)
- Clear severity levels

---

## Quick demo

### Input (examples/mikrotik-broken.rsc)
```
/ip firewall filter add chain=input action=accept
/ip firewall nat add chain=srcnat action=masquerade
/ip firewall nat add chain=srcnat action=masquerade
```

### Output
```
[CRITICAL][Logic] Duplicate NAT masquerade rule detected
[FIX] /ip firewall nat remove 1

[HIGH][Security] Open input chain allows all traffic
[FIX] Add drop rule for input chain
```

---

## Install & run

```
npm i -g auto-infra-doctor
# or
npx auto-infra-doctor analyze examples/mikrotik-broken.rsc --mode full
```

---

## Supported (v1)

- MikroTik (RouterOS) — prioritized

Planned:
- Nginx
- Docker
- VPN / Cloudflare

---

## Modes

- diagnose
- fix
- security
- optimize
- autofix (planned)

---

## Project status

- [x] CLI scaffold
- [x] MikroTik basic detections
- [ ] AI engine (structured JSON)
- [ ] Advanced RouterOS rules (queues, dstnat, fasttrack)
- [ ] Web UI

---

## Contributing

PRs with real-world configs are welcome. Add a broken config in `examples/` + expected output.

---

## If this saves you time

Star the repo and share with a network engineer who still debugs by hand.
