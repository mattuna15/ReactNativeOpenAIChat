/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';
import HomeScreen from '../HomeScreen';

jest.mock('@env', () => ({ OPENAI_API_KEY: 'sk-test', DEBUG: 'false' }));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

describe('HomeScreen additional branches', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('alerts when submitting empty input', async () => {
    const navigate = jest.fn();
    const alertMock = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);

    const { getByText } = render(<HomeScreen navigation={{ navigate } as any} />);

    const submitButton = getByText('Submit to AI');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Error', 'Please enter some text');
      expect(navigate).not.toHaveBeenCalled();
    });

    alertMock.mockRestore();
  });

  it('alerts when response is non-JSON (parse error)', async () => {
    const navigate = jest.fn();

    // Mock fetch to return non-JSON text
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        text: () => Promise.resolve('not a json'),
      })
    );

    const alertMock = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);

    const { getByPlaceholderText, getByText } = render(
      <HomeScreen navigation={{ navigate } as any} />
    );

    const input = getByPlaceholderText('Ask me anything...');
    fireEvent.changeText(input, 'Hello');

    const submitButton = getByText('Submit to AI');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalled();
      expect(navigate).not.toHaveBeenCalled();
    });

    alertMock.mockRestore();
  });

  it('alerts when response is non-ok with JSON body', async () => {
    const navigate = jest.fn();

    // Mock fetch to return JSON body but not ok
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        text: () => Promise.resolve(JSON.stringify({ error: 'server' })),
      })
    );

    const alertMock = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);

    const { getByPlaceholderText, getByText } = render(
      <HomeScreen navigation={{ navigate } as any} />
    );

    const input = getByPlaceholderText('Ask me anything...');
    fireEvent.changeText(input, 'Hello');

    const submitButton = getByText('Submit to AI');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalled();
      expect(navigate).not.toHaveBeenCalled();
    });

    alertMock.mockRestore();
  });
});
