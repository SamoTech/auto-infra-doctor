/**
 * Input validation for MikroTik config strings.
 * Returns an error string if invalid, null if valid.
 */
export function validateConfig(config) {
  if (!config) return 'Config is required';
  if (typeof config !== 'string') return 'Config must be a string';
  if (config.trim().length < 10) return 'Config is too short to analyze (minimum 10 characters)';
  if (config.length > 500_000) return 'Config exceeds 500 KB limit';
  if (config.includes('<?php') || config.includes('<script')) return 'Invalid config format detected';
  return null;
}
