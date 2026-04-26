# API Reference

AutoInfra Doctor exposes a single REST endpoint for config analysis.

---

## Base URL

```
https://auto-infra-doctor.vercel.app
```

---

## POST /api/analyze

Analyzes a RouterOS configuration string and returns a prioritized list of issues.

### Request

```http
POST /api/analyze
Content-Type: application/json
```

**Body:**

```json
{
  "config": "<string — RouterOS config export content>"
}
```

| Field | Type | Required | Constraints |
|---|---|---|---|
| `config` | `string` | ✅ | Min 10 chars, Max 500,000 chars |

### Response `200 OK`

```json
{
  "issues": [
    {
      "severity": "CRITICAL",
      "message": "No drop-all rule at end of input chain",
      "impact": "All unmatched traffic accepted",
      "fix": "/ip firewall filter add chain=input action=drop",
      "source": "rules"
    }
  ],
  "score": 42,
  "summary": "5 issue(s) found — 2 critical, 3 high",
  "analyzedAt": "2026-04-26T09:00:00.000Z"
}
```

| Field | Type | Description |
|---|---|---|
| `issues` | `array` | Sorted by severity (CRITICAL first) |
| `issues[].severity` | `string` | `CRITICAL` / `HIGH` / `MEDIUM` / `LOW` |
| `issues[].message` | `string` | Short description of the issue |
| `issues[].impact` | `string` | What the issue exposes or breaks |
| `issues[].fix` | `string` | RouterOS command or instruction to fix it |
| `issues[].source` | `string` | `rules` or `ai` |
| `score` | `number` | Health score 0–100 (100 = no issues) |
| `summary` | `string` | Human-readable summary |
| `analyzedAt` | `string` | ISO 8601 timestamp |

### Error Responses

| Status | Body | Reason |
|---|---|---|
| `400` | `{"error": "Config is required"}` | Missing or empty config |
| `400` | `{"error": "Config is too short to analyze"}` | Fewer than 10 characters |
| `413` | `{"error": "Config exceeds 500KB limit"}` | Payload too large |
| `429` | `{"error": "Rate limit: 10 req/min"}` | Too many requests |
| `500` | `{"error": "Analysis failed. Please try again."}` | Internal error |

### Rate Limiting

- **10 requests per minute per IP**
- Headers returned: none (in-memory limiter)
- For higher limits, self-host or contact for a Pro API key

### Example (cURL)

```bash
curl -X POST https://auto-infra-doctor.vercel.app/api/analyze \
  -H "Content-Type: application/json" \
  -d @- << 'EOF'
{
  "config": "/ip firewall filter add chain=input action=accept\n/ip dns set allow-remote-requests=yes"
}
EOF
```

### Example (JavaScript)

```javascript
const res = await fetch('https://auto-infra-doctor.vercel.app/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ config: routerOsExport })
});
const { issues, score } = await res.json();
console.log(`Health: ${score}/100 — ${issues.length} issue(s)`);
```
