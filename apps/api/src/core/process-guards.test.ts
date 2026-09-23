import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Logger } from './logger'
import { registerProcessGuards } from './process-guards'

type Listener = (value: unknown) => void

describe('registerProcessGuards', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('loguea rechazos y excepciones sin terminar el proceso', () => {
    const listeners = new Map<string, Listener>()
    vi.spyOn(process, 'on').mockImplementation(((event: string, listener: Listener) => {
      listeners.set(event, listener)
      return process
    }) as typeof process.on)
    const logger: Logger = { info: vi.fn(), error: vi.fn() }
    registerProcessGuards(logger)
    listeners.get('unhandledRejection')?.('motivo')
    listeners.get('uncaughtException')?.(new Error('boom'))
    expect(logger.error).toHaveBeenCalledTimes(2)
  })
})
