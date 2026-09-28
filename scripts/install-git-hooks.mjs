import { spawnSync } from 'node:child_process'

const hasGit = spawnSync('git', ['rev-parse', '--git-dir'], { stdio: 'ignore' }).status === 0

if (hasGit) {
  const result = spawnSync('lefthook', ['install'], { stdio: 'inherit', shell: true })
  process.exit(result.status ?? 1)
} else {
  console.info('Sin repositorio git (por ejemplo, dentro de Docker): no se instalan los hooks.')
}
