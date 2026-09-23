import { IGNORED_FROM_MUTATION, strykerBase } from '../../stryker.base.mjs'

export default {
  ...strykerBase,
  mutate: [
    'src/lib/**/*.ts',
    'src/components/common/**/*.tsx',
    'src/features/**/*.{ts,tsx}',
    ...IGNORED_FROM_MUTATION,
  ],
}
