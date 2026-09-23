import { describe, expect, it } from 'vitest'
import { readError, sendJson } from '../../testing/http'
import { FIA_ADMIN } from '../../testing/session-users'
import { createTestApp, TEST_WEB_ORIGIN } from '../../testing/test-app'
import { MAX_BODY_BYTES } from './security-middlewares'

describe('Middlewares de seguridad', () => {
  it('permite CORS sólo al origen de la web', async () => {
    const { app } = createTestApp()
    const allowed = await app.request('/health', { headers: { origin: TEST_WEB_ORIGIN } })
    const denied = await app.request('/health', { headers: { origin: 'https://evil.test' } })
    expect(allowed.headers.get('access-control-allow-origin')).toBe(TEST_WEB_ORIGIN)
    expect(denied.headers.get('access-control-allow-origin')).toBeNull()
  })

  it('declara los métodos permitidos en el preflight', async () => {
    const response = await createTestApp().app.request('/categories', {
      method: 'OPTIONS',
      headers: { origin: TEST_WEB_ORIGIN, 'access-control-request-method': 'PUT' },
    })
    expect(response.headers.get('access-control-allow-methods')).toBe('GET,POST,PUT,PATCH,DELETE')
  })

  it('agrega cabeceras de seguridad', async () => {
    const response = await createTestApp().app.request('/health')
    expect(response.headers.get('x-content-type-options')).toBe('nosniff')
  })

  it('rechaza cuerpos demasiado grandes con 413', async () => {
    const { app } = createTestApp({ sessionUser: FIA_ADMIN })
    const body = { name: 'x'.repeat(MAX_BODY_BYTES), code: 'F9' }
    const response = await sendJson(app, { method: 'POST', path: '/categories', body })
    expect(response.status).toBe(413)
    expect((await readError(response)).code).toBe('PAYLOAD_TOO_LARGE')
  })

  it('responde 404 tipado para rutas inexistentes', async () => {
    const response = await createTestApp().app.request('/no-existe')
    expect((await readError(response)).code).toBe('ROUTE_NOT_FOUND')
  })
})
