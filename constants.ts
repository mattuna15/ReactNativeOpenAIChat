// Configuration constants for the app.
// The OpenAI API key is read from the environment variable `OPENAI_API_KEY`.
// In development create a `.env` file at the project root with the key:
// OPENAI_API_KEY=sk-your-actual-api-key
// For production, inject the environment variable via your CI or native config.

function getEnvKey(): string {
  // Prefer the standard Node-style environment variable if present.
  if (
    typeof process !== 'undefined' &&
    process.env &&
    process.env.OPENAI_API_KEY
  ) {
    return process.env.OPENAI_API_KEY as string;
  }

  // Fallback: try a local env.js file (gitignored). Create `env.js` at project root:
  // module.exports = { OPENAI_API_KEY: 'sk-your-key' };
  try {
    const localEnv = require('./env');
    if (localEnv && localEnv.OPENAI_API_KEY) {
      return localEnv.OPENAI_API_KEY;
    }
  } catch {
    // ignore if file doesn't exist
  }

  return '';
}

export const OPENAI_API_KEY = getEnvKey();
