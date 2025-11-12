import { OPENAI_API_KEY } from '@env';

export function getOpenAIApiKey(): string | undefined {
  if (typeof OPENAI_API_KEY === 'string' && OPENAI_API_KEY.trim().length > 0) {
    return OPENAI_API_KEY;
  }

  if (typeof process !== 'undefined' && process.env && process.env.OPENAI_API_KEY) {
    return process.env.OPENAI_API_KEY;
  }

  return undefined;
}
