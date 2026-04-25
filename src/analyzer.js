import { buildPrompt } from "./prompt.js";

export async function analyzeConfig(config, mode) {
  const prompt = buildPrompt(config, mode);

  // TODO: integrate OpenAI API
  return `\n[INFO] Analyzer initialized\nMode: ${mode}\n`;
}
