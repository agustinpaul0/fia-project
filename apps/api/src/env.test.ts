import { describe, expect, it } from 'vitest'
import { loadEnv } from './env'

const VALID = { WEB_ORIGIN: 'http://localhost:5173', DATABASE_URL: 'postgres://u:p@h:1/db' }

describe('loadEnv', () => {
  it('aplica valores por defecto', () => {
    expect(loadEnv(VALID)).toMatchObject({ NODE_ENV: 'development', API_PORT: 3000 })
  })

  it('falla si falta una variable obligatoria', () => {
    expect(() => loadEnv({ WEB_ORIGIN: VALID.WEB_ORIGIN })).toThrow()
  })
})
