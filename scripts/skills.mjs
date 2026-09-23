import { cpSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const SOURCE = '.agents/skills'
const TARGET = '.claude/skills'

const listFiles = (root) =>
  readdirSync(root, { recursive: true })
    .map((entry) => join(root, String(entry)))
    .filter((path) => statSync(path).isFile())
    .map((path) => relative(root, path))
    .sort()

const differences = () => {
  const source = listFiles(SOURCE)
  const target = listFiles(TARGET)
  const all = [...new Set([...source, ...target])]
  return all.filter((file) => {
    if (!source.includes(file) || !target.includes(file)) {
      return true
    }
    return !readFileSync(join(SOURCE, file)).equals(readFileSync(join(TARGET, file)))
  })
}

const sync = () => {
  rmSync(TARGET, { recursive: true, force: true })
  cpSync(SOURCE, TARGET, { recursive: true, dereference: true })
  console.info(`Skills copiadas de ${SOURCE} a ${TARGET}`)
}

const check = () => {
  const diff = differences()
  if (diff.length > 0) {
    console.error(`Las skills no coinciden entre ${SOURCE} y ${TARGET}:\n${diff.join('\n')}`)
    console.error('Corré `pnpm skills:sync` y commiteá el resultado.')
    process.exit(1)
  }
  console.info('Skills sincronizadas')
}

const command = process.argv[2]
if (command === 'sync') {
  sync()
} else {
  check()
}
