import { IGNORED_FROM_MUTATION, strykerBase } from '../../stryker.base.mjs'

const feature = (name) => [`src/features/${name}/**/*.{ts,tsx}`]
const SPLIT_FEATURES = ['race-results', 'team-staff', 'notifications']
const ALL = ['src/lib/**/*.ts', 'src/components/common/**/*.tsx', 'src/features/**/*.{ts,tsx}']

const SHARDS = {
  all: ALL,
  results: feature('race-results'),
  staff: feature('team-staff'),
  notifications: feature('notifications'),
  rest: [...ALL, ...SPLIT_FEATURES.map((name) => `!src/features/${name}/**`)],
}

const shard = process.env.STRYKER_SHARD ?? 'all'
const files = SHARDS[shard]
if (files === undefined) {
  throw new Error(`STRYKER_SHARD inválido: ${shard}. Opciones: ${Object.keys(SHARDS).join(', ')}`)
}

export default {
  ...strykerBase,
  mutate: [...files, ...IGNORED_FROM_MUTATION],
  incrementalFile: `reports/stryker-incremental${shard === 'all' ? '' : `-${shard}`}.json`,
  htmlReporter: { fileName: `reports/mutation/${shard === 'all' ? 'index' : shard}.html` },
}
