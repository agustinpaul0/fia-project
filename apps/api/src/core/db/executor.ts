import type { Database } from './client'

export type DbExecutor = Pick<
  Database,
  'select' | 'selectDistinct' | 'insert' | 'update' | 'delete'
>
