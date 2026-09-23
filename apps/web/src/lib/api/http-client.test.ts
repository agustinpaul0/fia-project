import { healthResponseSchema } from '@fia/shared/contracts'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { jsonResponse, mockFetchOnce } from '@/testing/mock-fetch'
import { apiRequest } from './http-client'

const getHealth = () => apiRequest({ path: '/health', schema: healthResponseSchema })

describe('apiRequest', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('devuelve los datos validados por el contrato', async () => {
    mockFetchOnce(jsonResponse({ status: 'ok', database: 'up' }))
    expect(await getHealth()).toEqual({ status: 'ok', database: 'up' })
  })

  it('convierte una respuesta de error en AppError con su código', async () => {
    const error = { code: 'FORBIDDEN', message: 'x', fields: null }
    mockFetchOnce(jsonResponse({ error }, 403))
    await expect(getHealth()).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })

  it('informa NETWORK_ERROR si no hay conexión', async () => {
    mockFetchOnce(new TypeError('Failed to fetch'))
    await expect(getHealth()).rejects.toMatchObject({ code: 'NETWORK_ERROR' })
  })

  it('informa INTERNAL_ERROR si la respuesta no cumple el contrato', async () => {
    mockFetchOnce(jsonResponse({ status: 'raro' }))
    await expect(getHealth()).rejects.toMatchObject({ code: 'INTERNAL_ERROR' })
  })

  it('informa INTERNAL_ERROR si el error no es JSON válido', async () => {
    mockFetchOnce(new Response('<html>', { status: 502 }))
    await expect(getHealth()).rejects.toMatchObject({ code: 'INTERNAL_ERROR' })
  })

  it('interpreta una respuesta vacía como null', async () => {
    mockFetchOnce(new Response(null, { status: 204 }))
    expect(await apiRequest({ path: '/x', method: 'DELETE', schema: z.null() })).toBeNull()
  })

  it('envía el cuerpo serializado como JSON', async () => {
    mockFetchOnce(jsonResponse({ status: 'ok', database: 'up' }))
    await apiRequest({ path: '/x', method: 'POST', body: { a: 1 }, schema: healthResponseSchema })
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/x'),
      expect.objectContaining({ method: 'POST', body: '{"a":1}' }),
    )
  })
})
