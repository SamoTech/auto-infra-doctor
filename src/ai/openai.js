/**
 * Optional OpenAI-powered analysis layer.
 * Only runs when OPENAI_API_KEY environment variable is set.
 */
export async function runOpenAIAnalysis(config) {
  if (!process.env.OPENAI_API_KEY) return [];

  const truncated = config.slice(0, 4000);
  const prompt = `You are an expert MikroTik RouterOS network security engineer with 15 years experience.

Analyze the following RouterOS configuration for:
1. Security vulnerabilities and misconfigurations
2. Performance issues
3. Best-practice violations
4. Missing hardening rules

Return ONLY a JSON object like:
{ "issues": [ { "severity": "CRITICAL|HIGH|MEDIUM|LOW", "message": "...", "impact": "...", "fix": "exact RouterOS command or guidance" } ] }

Limit to the 5 most impactful issues. Be specific — no generic advice.

Config:
\`\`\`
${truncated}
\`\`\``;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.2,
        max_tokens: 1000
      })
    });
    if (!res.ok) return [];
    const data = await res.json();
    const parsed = JSON.parse(data.choices[0].message.content);
    return (parsed.issues || []).map(i => ({ ...i, source: 'ai' }));
  } catch {
    return [];
  }
}
