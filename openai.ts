import { errorDebug, logDebug } from './config';
import { getOpenAIApiKey } from './environment';

interface CallOpenAIOptions {
  signal?: AbortSignal;
}

export async function callOpenAI(prompt: string, options: CallOpenAIOptions = {}): Promise<string> {
  const apiKey = getOpenAIApiKey();
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    const payload = {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.7,
    };

    logDebug('[OpenAI] Request payload:', payload);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
      signal: options.signal,
    });

    logDebug('[OpenAI] Response status:', response.status);

    const bodyText = await response.text();
    try {
      const data = JSON.parse(bodyText);
      logDebug('[OpenAI] Response body (json):', data);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${JSON.stringify(data)}`);
      }
      return data.choices[0].message.content;
    } catch (jsonErr) {
      logDebug('[OpenAI] Response body (text):', bodyText);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${bodyText}`);
      }
      throw jsonErr;
    }
  } catch (err) {
    errorDebug('[OpenAI] API call failed', err);
    if (err instanceof Error && err.name === 'AbortError') {
      throw err;
    }
    throw new Error('Failed to get response from OpenAI');
  }
}
