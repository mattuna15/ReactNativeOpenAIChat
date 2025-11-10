/* eslint-disable no-undef */
// Jest setup: mock react-native hooks used by components
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  __esModule: true,
  default: () => 'light',
}));

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }) => children,
  useNavigation: () => ({ navigate: jest.fn() }),
  useRoute: () => ({}),
}));

// Preserve and restore global.fetch between tests to avoid leaked mocks
const _originalFetch = global.fetch;
afterEach(() => {
  // Restore global.fetch to the original value
  // @ts-ignore
  global.fetch = _originalFetch;
  // Clear any remaining mock state
  jest.clearAllMocks();
});
