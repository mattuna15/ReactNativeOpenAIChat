/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import HomeScreen from '../HomeScreen';

jest.mock('@env', () => ({ OPENAI_API_KEY: 'sk-test', DEBUG: 'false' }));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

describe('HomeScreen UI behaviors', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('scrolls to input when keyboard shows', async () => {
    const navigate = jest.fn();

    // Create a mock ref object for the ScrollView and inject via prop
    const mockRef = { current: { scrollTo: jest.fn() } } as any;
    const { getByPlaceholderText } = render(
      <HomeScreen navigation={{ navigate } as any} scrollRefProp={mockRef} />
    );

    // Simulate layout setting inputY by calling onLayout, then focus input which should trigger scroll
    const input = getByPlaceholderText('Ask me anything...');
    fireEvent(input, 'onLayout', { nativeEvent: { layout: { y: 200 } } });
    fireEvent(input, 'focus');

    await waitFor(() => {
      expect(mockRef.current.scrollTo).toHaveBeenCalled();
    });
  });

  it('shows loading indicator while waiting for response', async () => {
    const navigate = jest.fn();

    // Render HomeScreen with initial loading state (test-only prop)
    const { queryByTestId } = render(
      <HomeScreen navigation={{ navigate } as any} testInitialLoading={true} />
    );

    // Loading indicator should be present
    expect(queryByTestId('loading-indicator')).toBeTruthy();
  });
});
