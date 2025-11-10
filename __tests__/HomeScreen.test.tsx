/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import HomeScreen from '../HomeScreen';

jest.mock('@env', () => ({ OPENAI_API_KEY: 'sk-test', DEBUG: 'false' }));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock fetch to return a simple chat completion reply
const mockFetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    text: () =>
      Promise.resolve(JSON.stringify({ choices: [{ message: { content: 'AI reply' } }] })),
  })
);

// @ts-ignore
global.fetch = mockFetch;

it('renders HomeScreen and submits prompt, navigating to Results', async () => {
  const navigate = jest.fn();

  const { getByPlaceholderText, getByText } = render(
    <HomeScreen navigation={{ navigate } as any} />
  );

  const input = getByPlaceholderText('Ask me anything...');

  fireEvent.changeText(input, 'Hello');

  const submitButton = getByText('Submit to AI');

  fireEvent.press(submitButton);

  await waitFor(() => {
    expect(navigate).toHaveBeenCalledWith(
      'Results',
      expect.objectContaining({ response: 'AI reply', prompt: 'Hello' })
    );
  });
});
