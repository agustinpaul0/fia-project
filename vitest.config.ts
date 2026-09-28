import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      './packages/shared/vitest.config.ts',
      './apps/api/vitest.config.ts',
      './apps/api/vitest.int.config.ts',
      './apps/web/vitest.config.ts',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'html'],
      include: ['**/src/**'],
      exclude: [
        '**/.stryker-tmp/**',
        '**/*.test.{ts,tsx}',
        '**/*.test-d.ts',
        '**/testing/**',
        '**/index.ts',
        '**/src/db/**',
        '**/src/seed/**',
        '**/src/server.ts',
        '**/core/db/client.ts',
        '**/core/db/ping.ts',
        '**/*.repository.ts',
        '**/*.adapter.ts',
        '**/*-unit-of-work.ts',
        '**/*-constraints.ts',
        '**/core/auth/better-auth.ts',
        '**/app/production-dependencies.ts',
        '**/src/main.tsx',
        '**/src/routes/**',
        '**/routeTree.gen.ts',
        '**/components/ui/**',
        '**/app/create-router.ts',
        '**/app/register-router.ts',
        '**/app/root-layout.tsx',
        '**/app/not-found-page.tsx',
      ],
      thresholds: { lines: 90, functions: 90, statements: 90, branches: 85 },
    },
  },
})
