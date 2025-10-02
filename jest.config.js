const { pathsToModuleNameMapper } = require('ts-jest');

module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'text-summary', 'lcov'],
  collectCoverageFrom: [
    'src/**/*.ts',
    'libs/**/*.ts',
    '!src/**/*.d.ts',
    '!libs/**/*.d.ts',
    '!src/**/index.ts',
    '!libs/**/index.ts',
    '!src/**/*.module.ts',
    '!libs/**/*.module.ts',
    '!src/**/main.ts',
    '!src/**/polyfills.ts',
    '!src/**/*.spec.ts',
    '!libs/**/*.spec.ts',
    '!src/**/*.stories.ts',
    '!libs/**/*.stories.ts',
    '!libs/**/public-api.ts',
    '!libs/**/ng-package.json'
  ],
  testMatch: [
    '<rootDir>/src/**/*.spec.ts',
    '<rootDir>/libs/**/*.spec.ts'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  
  // Module name mapping for library imports - use source files for testing
  moduleNameMapper: {
    '^todo-lib$': '<rootDir>/libs/todo-lib/src/public-api.ts',
    '^ui-components$': '<rootDir>/libs/ui-components/src/public-api.ts',
    '^shared$': '<rootDir>/libs/shared/src/public-api.ts',
    '^store$': '<rootDir>/libs/store/src/public-api.ts',
    '^services$': '<rootDir>/libs/services/src/public-api.ts',
    '^components$': '<rootDir>/libs/components/src/public-api.ts'
  },
  
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$|@angular|@ngrx))',
  ],
  
  // Exclude dist from Jest's module resolution to avoid conflicts, but allow libs source
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/'
  ],
  
  // Additional configuration to avoid Haste map conflicts
  modulePathIgnorePatterns: [
    '<rootDir>/dist/'
  ],
  
  // Use all available CPU cores for parallel testing
  maxWorkers: '100%',
  
  // Additional performance optimizations
  workerIdleMemoryLimit: '512MB',
  detectLeaks: true,
  logHeapUsage: true
};