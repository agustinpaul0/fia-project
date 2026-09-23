import type { Database } from './client'

export type DbExecutor = Pick<Database, 'select' | 'insert' | 'update' | 'delete'>
