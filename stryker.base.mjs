export const strykerBase = {
  packageManager: 'pnpm',
  testRunner: 'vitest',
  plugins: ['@stryker-mutator/vitest-runner'],
  vitest: { configFile: 'vitest.config.ts' },
  coverageAnalysis: 'perTest',
  incremental: true,
  incrementalFile: 'reports/stryker-incremental.json',
  reporters: ['clear-text', 'progress', 'html'],
  htmlReporter: { fileName: 'reports/mutation/index.html' },
  thresholds: { high: 85, low: 75, break: 70 },
  timeoutMS: 10000,
  concurrency: 4,
  tempDirName: '.stryker-tmp',
}

export const IGNORED_FROM_MUTATION = [
  '!**/*.test.ts',
  '!**/*.test.tsx',
  '!**/*.test-d.ts',
  '!**/index.ts',
]
