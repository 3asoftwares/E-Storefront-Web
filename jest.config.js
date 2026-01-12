/** @type {import('jest').Config} */
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/tests/setup.tsx'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Handle module aliases
    '^@/(.*)$': '<rootDir>/$1',
    '^@3asoftwares/utils$': '<rootDir>/tests/__mocks__/utils.ts',
    '^@3asoftwares/utils/client$': '<rootDir>/tests/__mocks__/utils.ts',
    '^@3asoftwares/ui$': '<rootDir>/tests/__mocks__/ui-library.tsx',
    '^@3asoftwares/types$': '<rootDir>/tests/__mocks__/types.ts',
    '^@fortawesome/react-fontawesome$': '<rootDir>/tests/__mocks__/fontawesome.tsx',
  },
  testMatch: ['**/tests/**/*.test.ts', '**/tests/**/*.test.tsx'],
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'store/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    '!**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 40,
      lines: 40,
      statements: 40,
    },
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config
module.exports = createJestConfig(customJestConfig);
