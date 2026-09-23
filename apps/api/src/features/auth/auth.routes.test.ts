import { describe, expect, it } from 'vitest'
import { createTestApp } from '../../testing/test-app'

describe('rutas de auth', () => {
  it('GET y POST delegan al handler de autenticación', async () => {
    const fakeAuth = async (req: Request) =>
      new Response(JSON.stringify({ path: new URL(req.url).pathname }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    const { app } = createTestApp({ auth: fakeAuth })

    const getRes = await app.request('/api/auth/session')
    expect(getRes.status).toBe(200)
    expect(await getRes.json()).toEqual({ path: '/api/auth/session' })

    const postRes = await app.request('/api/auth/sign-in/email', { method: 'POST' })
    expect(postRes.status).toBe(200)
    expect(await postRes.json()).toEqual({ path: '/api/auth/sign-in/email' })
  })
})
