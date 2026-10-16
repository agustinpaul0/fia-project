const ARGENTINA_OFFSET = '-03:00'

export const argentinaInputToUtcIso = (value: string): string =>
  value === '' ? '' : new Date(`${value}:00${ARGENTINA_OFFSET}`).toISOString()
