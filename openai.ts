import { OPENAI_API_KEY } from '@env';
import { errorDebug, logDebug } from './config';

export async function callOpenAI(prompt: string): Promise<string> {
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
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(payload),
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
    throw new Error('Failed to get response from OpenAI');
  }
}
