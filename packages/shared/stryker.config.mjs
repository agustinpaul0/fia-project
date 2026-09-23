import { IGNORED_FROM_MUTATION, strykerBase } from '../../stryker.base.mjs'

export default {
  ...strykerBase,
  mutate: ['src/contracts/**/*.ts', 'src/domain/**/*.ts', ...IGNORED_FROM_MUTATION],
}
