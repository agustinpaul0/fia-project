import { AppError } from '@fia/shared/domain'
import { describe, expect, it } from 'vitest'
import { createQueryClient, shouldRetry } from './query-client'
import { toUserMessage } from './to-user-message'

describe('política de reintentos y mensajes', () => {
  it('reintenta sólo errores de red y hasta dos veces', () => {
    expect(shouldRetry(0, new AppError('NETWORK_ERROR'))).toBe(true)
    expect(shouldRetry(2, new AppError('NETWORK_ERROR'))).toBe(false)
    expect(shouldRetry(0, new AppError('FORBIDDEN'))).toBe(false)
  })

  it('muestra el mensaje del catálogo o uno genérico', () => {
    expect(toUserMessage(new AppError('FORBIDDEN'))).toContain('permisos')
    expect(toUserMessage(new Error('interno'))).toContain('error inesperado')
  })

  it('crea un QueryClient configurado', () => {
    expect(createQueryClient().getDefaultOptions().queries?.retry).toBe(shouldRetry)
  })
})
