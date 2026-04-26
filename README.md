![Banner](assets/banner.svg)

<p align="center">
  <img src="assets/logo.svg" width="100"/>
</p>

# AutoInfra Doctor

> Find and fix MikroTik configs instantly

🌐 **Live App:** https://auto-infra-doctor.vercel.app/

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
Impact: May cause routing conflicts and CPU waste
Fix: /ip firewall nat remove [find where action=masquerade]

[HIGH][Security] Input chain allows unrestricted access
Impact: Router exposed to external attacks
Fix: /ip firewall filter add chain=input action=drop
```

---

## ⚡ What You Get

- Real issue detection
- Impact explanation
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
