#!/usr/bin/env node
/* eslint-disable no-console, @typescript-eslint/no-unused-vars */
const fs = require('fs');
const path = require('path');

const KEY = 'OPENAI_API_KEY';
const MIN_KEY_LENGTH = 20; // small sanity check

function parseDotEnv(content) {
  const lines = content.split(/\r?\n/);
  const out = {};
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx === -1) continue;
    const k = line.slice(0, idx).trim();
    const v = line.slice(idx + 1).trim();
    out[k] = v.replace(/(^['"]|['"]$)/g, '');
  }
  return out;
}

function findKey() {
  if (process.env[KEY]) return process.env[KEY];

  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return null;

  try {
    const content = fs.readFileSync(envPath, 'utf8');
    const parsed = parseDotEnv(content);
    return parsed[KEY] || null;
  } catch (err) {
    return null;
  }
}

const key = findKey();
if (
  !key ||
  key.length < MIN_KEY_LENGTH ||
  key.includes('your-actual-api-key')
) {
  console.error('\n[validate-env] ERROR: Missing or invalid OPENAI_API_KEY.');
  console.error(
    'Please add a valid OPENAI_API_KEY to your .env file or environment variables.',
  );
  console.error('Example in .env:');
  console.error('OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\n');
  process.exit(1);
}

console.log('[validate-env] OPENAI_API_KEY found — continuing.');
process.exit(0);
