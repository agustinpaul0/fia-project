import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { readError } from '../../testing/http'
import { ok } from '../http/respond'
import type { Logger } from '../logger'
import { createErrorHandler } from './error-handler'

const createFailingApp = (failure: () => never, logger: Logger) =>
  new Hono().get('/', () => failure()).onError(createErrorHandler(logger))

const spyLogger = (): Logger => ({ info: vi.fn(), error: vi.fn() })

describe('createErrorHandler', () => {
  it('convierte un error desconocido en 500 genérico y lo loguea', async () => {
    const logger = spyLogger()
    const app = createFailingApp(() => {
      throw new Error('detalle interno')
    }, logger)
    const response = await app.request('/')
    expect(response.status).toBe(500)
    expect((await readError(response)).message).not.toContain('detalle interno')
    expect(logger.error).toHaveBeenCalledWith('Error no controlado', {
      path: '/',
      method: 'GET',
      error: expect.any(Error),
    })
  })

  it('traduce una HTTPException conocida a su código', async () => {
    const app = createFailingApp(() => {
      throw new HTTPException(413)
    }, spyLogger())
    expect((await readError(await app.request('/'))).code).toBe('PAYLOAD_TOO_LARGE')
  })

  it('trata una HTTPException sin mapeo como error interno', async () => {
    const app = createFailingApp(() => {
      throw new HTTPException(418)
    }, spyLogger())
    expect((await app.request('/')).status).toBe(500)
  })

  it('no filtra respuestas que violan su contrato', async () => {
    const logger = spyLogger()
    const app = new Hono()
      .get('/', (c) => ok(c, z.strictObject({ id: z.uuid() }), { id: 'x' }))
      .onError(createErrorHandler(logger))
    expect((await app.request('/')).status).toBe(500)
  })
})
