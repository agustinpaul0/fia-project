import * as schema from './schema'

export * from './schema'
export { schema }
export type Schema = typeof schema

export const MIGRATIONS_FOLDER: string = new URL('../../migrations', import.meta.url).pathname
