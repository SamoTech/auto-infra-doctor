# AutoInfra Doctor

Fix broken MikroTik, Nginx, Docker, and infrastructure configs in seconds.

## 🚀 What it does
- Detects misconfigurations
- Explains real impact
- Generates exact CLI fixes
- Security auditing
- Auto-fix mode

## ⚡ Usage
```bash
npx auto-infra-doctor analyze examples/mikrotik.rsc --mode full
```

## 🧠 Example Output
```
[CRITICAL][Security] Open port detected
[FIX] /ip firewall filter add chain=input action=drop
```

## 🛣 Roadmap
- CLI MVP
- AI Engine integration
- Multi-config support
- Web UI
- SaaS platform

## 💡 Vision
Become the "ChatGPT for infrastructure debugging"
