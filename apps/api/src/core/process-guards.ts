import type { Logger } from './logger'

export const registerProcessGuards = (logger: Logger): void => {
  process.on('unhandledRejection', (reason) => {
    logger.error('Promesa rechazada sin manejar', { reason })
  })
  process.on('uncaughtException', (error) => {
    logger.error('Excepción no capturada', { error })
  })
}
