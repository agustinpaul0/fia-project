import { describe, expect, it } from 'vitest'
import { createTestApp } from '../../testing/test-app'

describe('rutas de auth', () => {
  const fakeAuth = async (req: Request) => {
    const pathname = new URL(req.url).pathname
    if (pathname.endsWith('/sign-in/banned')) {
      return new Response(JSON.stringify({ code: 'BANNED_USER' }), {
        status: 403,
        headers: { 'content-type': 'application/json' },
      })
    }
    return new Response(JSON.stringify({ path: pathname }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  }

  it('permite endpoints incluidos en la allowlist', async () => {
    const { app } = createTestApp({ auth: fakeAuth })

    const getSession = await app.request('/api/auth/session')
    expect(getSession.status).toBe(200)

    const getGetSession = await app.request('/api/auth/get-session')
    expect(getGetSession.status).toBe(200)

    const postSignIn = await app.request('/api/auth/sign-in/email', { method: 'POST' })
    expect(postSignIn.status).toBe(200)

    const postSignOut = await app.request('/api/auth/sign-out', { method: 'POST' })
    expect(postSignOut.status).toBe(200)
  })

  it('bloquea endpoints no allowlisteados retornando ROUTE_NOT_FOUND', async () => {
    const { app } = createTestApp({ auth: fakeAuth })

    const res1 = await app.request('/api/auth/admin/list-users')
    expect(res1.status).toBe(404)
    const body1 = (await res1.json()) as { error: { code: string } }
    expect(body1.error.code).toBe('ROUTE_NOT_FOUND')

    const res2 = await app.request('/api/auth/sign-up/email', { method: 'POST' })
    expect(res2.status).toBe(404)
  })

  it('traduce BANNED_USER a 401 INVALID_CREDENTIALS en sign-in', async () => {
    const bannedAuth = async () =>
      new Response(JSON.stringify({ code: 'BANNED_USER' }), {
        status: 403,
        headers: { 'content-type': 'application/json' },
      })
    const { app } = createTestApp({ auth: bannedAuth })

    const res = await app.request('/api/auth/sign-in/email', { method: 'POST' })
    expect(res.status).toBe(401)
    const body = (await res.json()) as { error: { code: string; message: string } }
    expect(body.error.code).toBe('INVALID_CREDENTIALS')
    expect(body.error.message).toBe('El correo electrónico o la contraseña son incorrectos.')
  })
})
