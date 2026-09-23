import { AppError } from '@fia/shared/domain'
import type { MiddlewareHandler } from 'hono'
import { bodyLimit } from 'hono/body-limit'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'

export const MAX_BODY_BYTES = 100 * 1024

export const securityMiddlewares = (webOrigin: string): readonly MiddlewareHandler[] => [
  secureHeaders(),
  cors({
    origin: [webOrigin],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  }),
  bodyLimit({
    maxSize: MAX_BODY_BYTES,
    onError: () => {
      throw new AppError('PAYLOAD_TOO_LARGE')
    },
  }),
]
