import { healthResponseSchema } from '@fia/shared/contracts'
import { describe, expect, it } from 'vitest'
import { createTestApp } from '../../testing/test-app'

const getHealth = async (databaseUp: boolean) => {
  const response = await createTestApp({ databaseUp }).app.request('/health')
  return { status: response.status, body: healthResponseSchema.parse(await response.json()) }
}

describe('GET /health', () => {
  it('informa la base como disponible', async () => {
    expect(await getHealth(true)).toEqual({ status: 200, body: { status: 'ok', database: 'up' } })
  })

  it('informa la base como caída sin fallar', async () => {
    expect((await getHealth(false)).body.database).toBe('down')
  })
})
