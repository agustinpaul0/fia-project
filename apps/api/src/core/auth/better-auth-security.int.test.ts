import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { testDatabaseUrl } from '../../testing/integration/test-database-url'
import { withRollback } from '../../testing/integration/with-rollback'
import { connectDatabase, type DatabaseConnection, type DatabaseTransaction } from '../db/client'
import { createBetterAuth } from './better-auth'

const EMAIL = 'qa.seguridad@fia.com'
const PASSWORD = 'ContraseniaSegura123!'

const authFor = (tx: DatabaseTransaction) =>
  createBetterAuth({
    db: tx,
    secret: 'secreto-de-prueba-con-mas-de-32-caracteres',
    baseURL: 'http://localhost:3000',
    trustedOrigins: ['http://localhost:5173'],
  })

const signInRequest = (email: string, password: string, ip: string): Request =>
  new Request('http://localhost:3000/api/auth/sign-in/email', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'http://localhost:5173',
      'x-forwarded-for': ip,
    },
    body: JSON.stringify({ email, password }),
  })

describe('Pruebas de seguridad del login (Postgres real)', () => {
  let connection: DatabaseConnection

  beforeAll(() => {
    connection = connectDatabase(testDatabaseUrl())
  })

  afterAll(async () => {
    await connection.close()
  })

  it('bloquea con 429 tras varios intentos fallidos seguidos', () =>
    withRollback(connection, async (tx) => {
      const auth = authFor(tx)
      await auth.api.signUpEmail({ body: { email: EMAIL, password: PASSWORD, name: 'QA' } })
      const statuses: number[] = []
      for (let attempt = 0; attempt < 12; attempt++) {
        const res = await auth.handler(signInRequest(EMAIL, 'Incorrecta123456!', '203.0.113.7'))
        statuses.push(res.status)
      }
      expect(statuses[0]).toBe(401)
      expect(statuses.at(-1)).toBe(429)
      const otherIp = await auth.handler(signInRequest(EMAIL, PASSWORD, '203.0.113.8'))
      expect(otherIp.status).toBe(200)
    }))

  it.each([
    ["' OR '1'='1", "' OR '1'='1"],
    ["admin@fia.com' --", 'x'],
    ['qa.seguridad@fia.com', '\' OR 1=1; DROP TABLE "user"; --'],
  ])('rechaza el intento de inyección %s sin abrir sesión ni romper', (email, password) =>
    withRollback(connection, async (tx) => {
      const auth = authFor(tx)
      await auth.api.signUpEmail({ body: { email: EMAIL, password: PASSWORD, name: 'QA' } })
      const res = await auth.handler(signInRequest(email, password, '203.0.113.9'))
      expect([400, 401]).toContain(res.status)
      expect(res.headers.get('set-cookie')).toBeNull()
    }),
  )
})
