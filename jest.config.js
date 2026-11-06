// Jest config for the Breadcrumbs Expo app. See https://docs.expo.dev/develop/unit-testing/
const expoPreset = require('jest-expo/jest-preset');

// Add the Firebase SDK (ESM) to the packages jest-expo already transforms, so the
// opt-in integration tests can load it. Everything else keeps the preset's rules
// (notably expo-modules-core and react-native, which must be transformed).
const transformIgnorePatterns = expoPreset.transformIgnorePatterns.map((pattern) =>
  pattern.startsWith('/node_modules/(?!(')
    ? pattern.replace('))', '|firebase|@firebase))')
    : pattern,
);

module.exports = {
  ...expoPreset,
  // Resolve the tsconfig path aliases so tests can import from "@/..." paths.
  moduleNameMapper: {
    ...expoPreset.moduleNameMapper,
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@assets/(.*)$': '<rootDir>/assets/$1',
  },
  transformIgnorePatterns,
  // Only files ending in .test.ts(x) are tests; helpers (testing/memory-store.ts) are not.
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
};
