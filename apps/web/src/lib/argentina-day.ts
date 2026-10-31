const ARGENTINA_OFFSET = '-03:00'

export const dayStartIso = (day: string): string =>
  new Date(`${day}T00:00:00.000${ARGENTINA_OFFSET}`).toISOString()

export const dayEndIso = (day: string): string =>
  new Date(`${day}T23:59:59.999${ARGENTINA_OFFSET}`).toISOString()
