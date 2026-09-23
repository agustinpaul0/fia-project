import { type ErrorResponse, errorResponseSchema } from '@fia/shared/contracts'
import type { Hono } from 'hono'
import type { AppEnv } from '../core/auth/session'

export type JsonRequest = {
  readonly method: 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  readonly path: string
  readonly body?: unknown
}

export const sendJson = async (app: Hono<AppEnv>, request: JsonRequest): Promise<Response> =>
  app.request(request.path, {
    method: request.method,
    headers: { 'content-type': 'application/json' },
    ...(request.body === undefined ? {} : { body: JSON.stringify(request.body) }),
  })

export const readError = async (response: Response): Promise<ErrorResponse['error']> =>
  errorResponseSchema.parse(await response.json()).error
