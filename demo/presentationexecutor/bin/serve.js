#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

function getArgFromNpmConfig() {
  try {
    const raw = process.env.npm_config_argv;
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    const orig = Array.isArray(parsed.original) ? parsed.original : [];
    // Remove common npm tokens
    const candidates = orig.filter(t => !['npm', 'run', 'start', '--'].includes(t));
    // Prefer .html files, else first remaining token
    const html = candidates.find(t => t.toLowerCase().endsWith('.html'));
    return html || candidates[0];
  } catch {
    return undefined;
  }
}

// Prefer direct argv, fallback to npm_config_argv
const arg = process.argv[2] || getArgFromNpmConfig();
const filename = arg && typeof arg === 'string' ? arg : 'index.html';

// Ensure the file exists to avoid opening a 404
const filePath = path.resolve(process.cwd(), filename);
if (!fs.existsSync(filePath)) {
  console.warn(`[serve] Warning: file not found: ${filename}. Falling back to index.html`);
}
const openTarget = fs.existsSync(filePath) ? filename : 'index.html';

// Resolve live-server binary across platforms
const bin = path.resolve(__dirname, '..', 'node_modules', '.bin', process.platform === 'win32' ? 'live-server.cmd' : 'live-server');

const args = [
  '--port=8000',
  `--open=${openTarget}`,
  '--wait=300'
];

console.log(`[serve] Starting live-server on port 8000, opening: ${openTarget}`);

const child = spawn(bin, args, {
  stdio: 'inherit',
  cwd: process.cwd(),
  shell: process.platform === 'win32'
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
