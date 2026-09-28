import { describe, expect, it } from 'vitest'
import { translateAuthResponse } from './better-auth-error'

describe('traducción de errores de Better Auth', () => {
  it('no modifica respuestas exitosas', async () => {
    const original = new Response(JSON.stringify({ ok: true }), { status: 200 })
    const result = await translateAuthResponse(original)
    expect(result.status).toBe(200)
    expect(await result.json()).toEqual({ ok: true })
  })

  it('traduce BANNED_USER a 401 INVALID_CREDENTIALS', async () => {
    const original = new Response(JSON.stringify({ code: 'BANNED_USER' }), {
      status: 403,
      headers: { 'content-type': 'application/json' },
    })
    const result = await translateAuthResponse(original)
    expect(result.status).toBe(401)
    const body = (await result.json()) as { error: { code: string; message: string } }
    expect(body.error.code).toBe('INVALID_CREDENTIALS')
    expect(body.error.message).toBe('El correo electrónico o la contraseña son incorrectos.')
  })

  it('conserva otros errores que no sean BANNED_USER', async () => {
    const original = new Response(JSON.stringify({ code: 'OTHER_ERROR' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    })
    const result = await translateAuthResponse(original)
    expect(result.status).toBe(400)
    expect(await result.json()).toEqual({ code: 'OTHER_ERROR' })
  })

  it('tolera respuestas que no son JSON', async () => {
    const original = new Response('texto plano', { status: 500 })
    const result = await translateAuthResponse(original)
    expect(result.status).toBe(500)
    expect(await result.text()).toBe('texto plano')
  })
})
