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

describe('HomeScreen failing path', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('shows alert when network fails and does not navigate', async () => {
    const navigate = jest.fn();

    // Mock fetch to simulate network failure
    // @ts-ignore
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

    // We specifically spy on Alert.alert
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
