import { API_PATHS, chatConversationSchema, penaltyListSchema } from '@fia/shared/contracts'
import { describe, expect, it } from 'vitest'
import { FIA_ADMIN, TEAM_STAFF } from '../testing/session-users'
import { createTestApp } from '../testing/test-app'

describe('Incremento de producto Sprint 2 (US-2)', () => {
  it('ejecuta el ciclo de vida integrado: auth, control técnico, sanción y chat E2E', async () => {
    const { app } = createTestApp({ sessionUser: FIA_ADMIN })

    const controlRes = await app.request(API_PATHS.technicalControls, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teamId: '00000000-0000-4000-8000-000000000001',
        controlType: 'weight',
        status: 'rejected',
        notes: 'Vehículo por debajo del peso mínimo reglamentario.',
        inspectedAt: new Date().toISOString(),
      }),
    })
    expect(controlRes.status).toBe(201)

    const penaltyRes = await app.request(API_PATHS.penalties, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teamId: '00000000-0000-4000-8000-000000000001',
        type: 'fine',
        penalty: 'Multa de 50.000 EUR',
        reason: 'Infracción de peso en verificación técnica',
        issuedAt: new Date().toISOString(),
      }),
    })
    expect(penaltyRes.status).toBe(201)

    const listPenalties = await app.request(API_PATHS.penalties)
    expect(listPenalties.status).toBe(200)
    const penaltiesData = penaltyListSchema.parse(await listPenalties.json())
    expect(penaltiesData.length).toBeGreaterThan(0)
  })

  it('permite comunicación cifrada entre escudería y FIA y bloquea anónimos', async () => {
    const { app: staffApp } = createTestApp({ sessionUser: TEAM_STAFF })

    const keyRes = await staffApp.request(`${API_PATHS.chat}/keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ecdhPublicKey: '{"kty":"EC","crv":"P-256","x":"mock-x","y":"mock-y"}',
        ecdsaPublicKey: '{"kty":"EC","crv":"P-256","x":"mock-x2","y":"mock-y2"}',
      }),
    })
    expect(keyRes.status).toBe(200)

    const convRes = await staffApp.request(`${API_PATHS.chat}/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientId: FIA_ADMIN.id }),
    })
    expect(convRes.status).toBe(201)
    const conv = chatConversationSchema.parse(await convRes.json())

    const msgRes = await staffApp.request(`${API_PATHS.chat}/conversations/${conv.id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        encryptedContent: 'cifrado-en-cliente==',
        iv: 'iv-aleatorio-test-123',
        signature: 'firma-ecdsa-valida-test-signature==',
      }),
    })
    expect(msgRes.status).toBe(201)

    const { app: anonApp } = createTestApp({ sessionUser: null })
    const blockedRes = await anonApp.request(`${API_PATHS.chat}/conversations/${conv.id}/messages`)
    expect(blockedRes.status).toBe(401)
  })
})
