import { availableParallelism } from 'node:os'

export const strykerBase = {
  packageManager: 'pnpm',
  testRunner: 'vitest',
  plugins: [
    '@stryker-mutator/vitest-runner',
    new URL('./stryker.ignore-styles.mjs', import.meta.url).href,
  ],
  ignorers: ['style-attributes'],
  vitest: { configFile: 'vitest.config.ts' },
  coverageAnalysis: 'perTest',
  incremental: true,
  incrementalFile: 'reports/stryker-incremental.json',
  reporters: ['clear-text', 'progress', 'html'],
  htmlReporter: { fileName: 'reports/mutation/index.html' },
  thresholds: { high: 85, low: 75, break: 70 },
  timeoutMS: 10000,
  concurrency: Math.max(2, availableParallelism() - 1),
  tempDirName: '.stryker-tmp',
}

export const IGNORED_FROM_MUTATION = [
  '!**/*.test.ts',
  '!**/*.test.tsx',
  '!**/*.test-d.ts',
  '!**/index.ts',
]
