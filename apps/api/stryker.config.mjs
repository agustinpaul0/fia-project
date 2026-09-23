import { IGNORED_FROM_MUTATION, strykerBase } from '../../stryker.base.mjs'

export default {
  ...strykerBase,
  mutate: [
    'src/core/**/*.ts',
    'src/features/**/*.ts',
    '!src/core/db/**',
    '!src/**/*.repository.ts',
    ...IGNORED_FROM_MUTATION,
  ],
}
