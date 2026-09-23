import { z } from 'zod'

export const testDatabaseUrl = (): string =>
  z.url().parse(process.env['TEST_DATABASE_URL'] ?? 'postgres://fia:fia@localhost:5443/fia_test')
