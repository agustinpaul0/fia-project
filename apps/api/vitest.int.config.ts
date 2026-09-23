import { defineProject } from 'vitest/config'

export default defineProject({
  test: {
    name: 'api-int',
    include: ['src/**/*.int.test.ts'],
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    globalSetup: ['./vitest.int.global-setup.ts'],
    fileParallelism: false,
  },
})
