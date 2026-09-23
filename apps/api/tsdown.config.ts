import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/server.ts'],
  platform: 'node',
  format: 'esm',
  noExternal: [/^@fia\//],
})
