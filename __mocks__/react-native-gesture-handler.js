// Minimal mock for react-native-gesture-handler to satisfy imports in tests
module.exports = {
  GestureHandlerRootView: 'GestureHandlerRootView',
  GestureDetector: 'GestureDetector',
  Gesture: {
    // no-op chainable API
    start: () => ({ ...this }),
  },
  swipeable: () => ({
    configure: () => undefined,
  }),
};
