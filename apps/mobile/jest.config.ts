import type { Config } from 'jest';

const config: Config = {
  displayName: 'mobile',
  // ✅ Use Expo’s preset (Universal works on web/native)
  preset: 'jest-expo',

  // JSDOM is fine for @testing-library/react-native
  // testEnvironment: 'jsdom',

  // Keep your per-project setup AFTER env
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Allow RN/Expo modules to be transformed (don’t ignore them)
  transformIgnorePatterns: [
    'node_modules/(?!(?:' +
      '(jest-)?react-native' +
      '|@react-native(-community)?' +
      '|react-native' +
      '|react-native-.*' +
      '|@react-navigation' +
      '|@react-native' +
      '|@expo(nent)?/.*' +
      '|expo(nent)?' +
      '|expo-.*' +
      '|@unimodules/.*' +
      '|unimodules-.*' +
      '|react-clone-referenced-element' +
      '|sentry-expo' +
      ')/)',
  ],

  // Mirror your Babel module-resolver aliases
  moduleNameMapper: {
    '^@ui$': '<rootDir>/src/lib/ui/index.ts',
    '^@ui/(.*)$': '<rootDir>/src/lib/ui/$1',
    '^@features/(.*)$': '<rootDir>/src/lib/features/$1',
    '^@api$': '<rootDir>/src/lib/api/index.ts',
    '^@api/(.*)$': '<rootDir>/src/lib/api/$1',
    '^@voice$': '<rootDir>/src/lib/voice/index.ts',
    '^@voice/(.*)$': '<rootDir>/src/lib/voice/$1',
    '^@vm/(.*)$': '<rootDir>/src/viewmodels/$1',
  },

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // optional: be explicit
  testMatch: ['**/*.spec.(ts|tsx)', '**/*.test.(ts|tsx)'],
};

export default config;
