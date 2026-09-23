type LogContext = Readonly<Record<string, unknown>>

export type Logger = {
  readonly info: (message: string, context?: LogContext) => void
  readonly error: (message: string, context?: LogContext) => void
}

export const consoleLogger: Logger = {
  info: (message, context) => console.info(message, ...(context === undefined ? [] : [context])),
  error: (message, context) => console.error(message, ...(context === undefined ? [] : [context])),
}

export const silentLogger: Logger = {
  info: () => null,
  error: () => null,
}
