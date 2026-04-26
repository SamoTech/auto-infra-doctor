![Banner](assets/banner.svg)

<p align="center">
  <img src="assets/logo.svg" width="100"/>
</p>

# AutoInfra Doctor

> Find and fix broken MikroTik configs in seconds.

---

## ⚠️ The Reality

Debugging RouterOS configs is slow and error-prone.
One small mistake can break your network or expose it.

---

## 🔥 Live Demo

```bash
npx auto-infra-doctor analyze examples/mikrotik-broken.rsc --mode full
```

### Output
```
[CRITICAL][Logic] Duplicate NAT masquerade rule detected
[FIX] /ip firewall nat remove 1

[HIGH][Security] Open input chain allows all traffic
[FIX] Add drop rule for input chain
```

---

## ⚡ What You Get

- Real issue detection
- Clear impact explanation
- Exact CLI fixes
- Security insights

---

## 🎯 Focus

MikroTik first. Precision over hype.

---

## 🚀 Install

```bash
npm i -g auto-infra-doctor
```

---

## 🛣 Roadmap

- [x] CLI
- [x] MikroTik detection
- [ ] AI engine
- [ ] Advanced analysis
- [ ] Web UI

---

## ⭐ If This Saved You Time

Star the repo.
