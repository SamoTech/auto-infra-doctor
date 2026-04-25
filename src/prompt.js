export function buildPrompt(config, mode) {
  return `You are a senior DevOps + MikroTik expert.\nMode: ${mode}\n\nAnalyze:\n${config}`;
}
