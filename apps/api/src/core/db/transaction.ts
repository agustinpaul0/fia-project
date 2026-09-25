import type { Database } from './client'

export type TransactionExecutor = Parameters<Parameters<Database['transaction']>[0]>[0]
