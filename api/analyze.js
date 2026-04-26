/**
 * POST /api/analyze
 * Accepts: { config: string }
 * Returns: { issues, score, summary, analyzedAt }
 */
import { runFullAnalysis } from '../src/engine.js';
import { validateConfig } from '../src/validator.js';

// In-memory rate limiter (per Vercel instance — use Upstash Redis for multi-instance)
const RATE_MAP = new Map();
const RATE_LIMIT = 10;     // requests
const RATE_WINDOW = 60_000; // ms

const ALLOWED_ORIGINS = [
  'https://auto-infra-doctor.vercel.app',
  'http://localhost:3000',
  'http://localhost:5000'
];

export default async function handler(req, res) {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');

  // CORS
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting
  const ip = (req.headers['x-forwarded-for'] || 'unknown').split(',')[0].trim();
  const now = Date.now();
  const hits = (RATE_MAP.get(ip) || []).filter(t => now - t < RATE_WINDOW);
  if (hits.length >= RATE_LIMIT) {
    return res.status(429).json({
      error: `Rate limit exceeded. Max ${RATE_LIMIT} requests per minute.`
    });
  }
  RATE_MAP.set(ip, [...hits, now]);

  // Input validation
  const { config } = req.body || {};
  const validationError = validateConfig(config);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  // Content-Type check
  const ct = req.headers['content-type'] || '';
  if (!ct.includes('application/json')) {
    return res.status(415).json({ error: 'Content-Type must be application/json' });
  }

  try {
    const result = await runFullAnalysis(config);
    return res.status(200).json({
      issues: result.issues,
      score: result.score,
      summary: result.summary,
      analyzedAt: new Date().toISOString(),
      issueCount: result.issues.length
    });
  } catch (err) {
    console.error('[analyze] error:', err);
    return res.status(500).json({ error: 'Analysis failed. Please try again.' });
  }
}
