#!/usr/bin/env node
/* eslint-disable no-console, @typescript-eslint/no-unused-vars */
const { execSync } = require('child_process');

try {
  const staged = execSync('git diff --cached --name-only', {
    encoding: 'utf8',
  });
  if (staged.split(/[\r\n]+/).some(f => f.trim() === '.env')) {
    console.error('\n[pre-commit] ERROR: .env is staged for commit.');
    console.error(
      'Please remove .env from the commit (git reset HEAD .env) and ensure .env is in .gitignore.',
    );
    process.exit(1);
  }
  process.exit(0);
} catch (err) {
  // If git isn't available for some reason, allow the commit but print a warning
  console.warn('[pre-commit] Warning: could not check staged files.');
  process.exit(0);
}
