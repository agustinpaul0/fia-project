import { defineProject } from 'vitest/config'

export default defineProject({
  test: {
    name: 'api',
    include: ['src/**/*.test.ts'],
    exclude: ['src/**/*.int.test.ts'],
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
  },
})
