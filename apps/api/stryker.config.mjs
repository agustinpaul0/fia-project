import { IGNORED_FROM_MUTATION, strykerBase } from '../../stryker.base.mjs'

export default {
  ...strykerBase,
  mutate: [
    'src/core/**/*.ts',
    'src/features/**/*.ts',
    '!src/core/db/**',
    '!src/**/*.repository.ts',
    '!src/**/*.adapter.ts',
    '!src/**/*-unit-of-work.ts',
    '!src/**/*-constraints.ts',
    '!src/core/auth/better-auth.ts',
    ...IGNORED_FROM_MUTATION,
  ],
}
