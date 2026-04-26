#!/usr/bin/env node
/**
 * AutoInfra Doctor CLI
 * Usage: npx auto-infra-doctor <file> [--mode full]
 */
import fs from 'fs';
import { runFullAnalysis } from '../src/engine.js';

const args = process.argv.slice(2);
const file = args.find(a => !a.startsWith('--'));

if (!file) {
  console.log([
    '',
    '  \x1b[32mAutoInfra Doctor\x1b[0m — MikroTik Config Analyzer',
    '',
    '  Usage:  auto-infra-doctor <config-file>',
    '  Alias:  aid <config-file>',
    '',
    '  Example:',
    '    aid router-export.rsc',
    '    auto-infra-doctor /path/to/config.txt',
    ''
  ].join('\n'));
  process.exit(1);
}

if (!fs.existsSync(file)) {
  console.error(`\x1b[31mError:\x1b[0m File not found: ${file}`);
  process.exit(1);
}

const config = fs.readFileSync(file, 'utf-8');

console.log(`\n  \x1b[36mAutoInfra Doctor v1.1.0\x1b[0m  Analyzing ${file}...\n`);

runFullAnalysis(config).then(result => {
  const scoreColor = result.score >= 80 ? '\x1b[32m' : result.score >= 50 ? '\x1b[33m' : '\x1b[31m';
  const bar = '█'.repeat(Math.round(result.score / 10)) + '░'.repeat(10 - Math.round(result.score / 10));

  console.log(`  Health Score: ${scoreColor}${result.score}/100\x1b[0m  [${bar}]`);
  console.log(`  ${result.summary}\n`);

  if (result.issues.length === 0) {
    console.log('  \x1b[32m✓ No issues found. Config looks healthy!\x1b[0m\n');
    process.exit(0);
  }

  const icons = { CRITICAL: '\x1b[31m✖\x1b[0m', HIGH: '\x1b[33m⚠\x1b[0m', MEDIUM: '\x1b[34mℹ\x1b[0m', LOW: '\x1b[90m·\x1b[0m' };

  result.issues.forEach((issue, idx) => {
    const icon = icons[issue.severity] || icons.LOW;
    console.log(`  ${icon} [${issue.severity}] ${issue.message}`);
    console.log(`     Impact: ${issue.impact}`);
    console.log(`     Fix:    \x1b[36m${issue.fix}\x1b[0m`);
    if (idx < result.issues.length - 1) console.log('');
  });

  console.log('');
  process.exit(result.issues.some(i => i.severity === 'CRITICAL') ? 2 : 1);
}).catch(err => {
  console.error('\x1b[31mAnalysis failed:\x1b[0m', err.message);
  process.exit(1);
});
