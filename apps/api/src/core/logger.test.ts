import { afterEach, describe, expect, it, vi } from 'vitest'
import { consoleLogger, silentLogger } from './logger'

describe('loggers', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it.each(['info', 'error'] as const)(
    'consoleLogger.%s agrega el contexto sólo si existe',
    (level) => {
      const spy = vi.spyOn(console, level).mockReturnValue()
      consoleLogger[level]('sin contexto')
      consoleLogger[level]('con contexto', { id: 1 })
      expect(spy).toHaveBeenNthCalledWith(1, 'sin contexto')
      expect(spy).toHaveBeenNthCalledWith(2, 'con contexto', { id: 1 })
    },
  )

  it('silentLogger no escribe nada', () => {
    const info = vi.spyOn(console, 'info')
    silentLogger.info('nada')
    silentLogger.error('nada')
    expect(info).not.toHaveBeenCalled()
  })
})
