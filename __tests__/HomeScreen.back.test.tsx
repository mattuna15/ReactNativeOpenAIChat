import React from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';

jest.mock('@env', () => ({ OPENAI_API_KEY: 'sk-test', DEBUG: 'false' }));
jest.mock('react-native-safe-area-context', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SafeAreaView: ({ children }: any) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
import { callOpenAI } from '../openai';

jest.mock('../openai');

const mockNavigate = jest.fn();

function createNavigation() {
  const listeners: Record<string, Function[]> = {};
  return {
    navigate: mockNavigate,
    addListener: (event: string, cb: Function) => {
      listeners[event] = listeners[event] || [];
      listeners[event].push(cb);
      return () => {
        listeners[event] = listeners[event].filter((fn) => fn !== cb);
      };
    },
    // helper for tests to trigger an event
    __trigger: (event: string) => {
      (listeners[event] || []).forEach((fn) => fn());
    },
  };
}

describe('HomeScreen back/navigation behavior', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('clears loading state when the screen regains focus (e.g., after back)', async () => {
    const navigation = createNavigation();
    (callOpenAI as jest.Mock).mockImplementation(
      () =>
        new Promise((_resolve) => {
          // never resolve to simulate a pending request
        })
    );

    const { getByTestId, queryByTestId, getByPlaceholderText } = render(
      // safe-area context is mocked above
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <HomeScreen navigation={navigation as any} />
    );
    const input = getByPlaceholderText('Ask me anything...');
    fireEvent.changeText(input, 'Hello');

    const submitButton = getByTestId('submit-button');

    await act(async () => {
      fireEvent.press(submitButton);
    });

    // loading indicator should be present while request is pending
    expect(queryByTestId('loading-indicator')).toBeTruthy();

    // simulate navigating back and then focusing the Home screen again
    // In our implementation, coming back triggers 'focus' which should clear loading
    await act(async () => {
      navigation.__trigger('focus');
    });

    // loading indicator should be cleared
    expect(queryByTestId('loading-indicator')).toBeFalsy();
  });
});
