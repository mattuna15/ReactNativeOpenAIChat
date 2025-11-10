module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '^@env$': '<rootDir>/__mocks__/@env.js',
    '^react-native-gesture-handler$': '<rootDir>/__mocks__/react-native-gesture-handler.js',
  },
  testPathIgnorePatterns: ['/node_modules/', '/.github/'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-gesture-handler)/)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  coveragePathIgnorePatterns: ['<rootDir>/config.ts'],
  coverageThreshold: {
    global: {
      // Set to conservative thresholds based on current coverage; raise these over time
      branches: 40,
      functions: 80,
      lines: 75,
      statements: 75,
    },
  },
};
