/* eslint-disable @typescript-eslint/no-explicit-any */
import { render } from '@testing-library/react-native';
import React from 'react';
import ResultsScreen from '../ResultsScreen';

jest.mock('react-native-safe-area-context', () => ({
  // @ts-ignore
  SafeAreaView: ({ children }: any) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

it('renders ResultsScreen with prompt and response', () => {
  const route = { params: { prompt: 'Hi', response: 'AI says hi' } } as any;
  const navigation = { goBack: jest.fn() } as any;

  const { getByText } = render(<ResultsScreen route={route} navigation={navigation} />);

  expect(getByText('Your Prompt:')).toBeTruthy();
  expect(getByText('AI Response:')).toBeTruthy();
  expect(getByText('AI says hi')).toBeTruthy();
});
