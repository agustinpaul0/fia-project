const ARGENTINA_OFFSET = '-03:00'

export const dayStartIso = (day: string): string =>
  new Date(`${day}T00:00:00.000${ARGENTINA_OFFSET}`).toISOString()

export const dayEndIso = (day: string): string =>
  new Date(`${day}T23:59:59.999${ARGENTINA_OFFSET}`).toISOString()

const pad = (n: number): string => String(n).padStart(2, '0')

export const toArgentinaLocalInput = (isoUtc: string): string => {
  const local = new Date(new Date(isoUtc).getTime() - 3 * 3_600_000)
  return `${local.getUTCFullYear()}-${pad(local.getUTCMonth() + 1)}-${pad(local.getUTCDate())}T${pad(local.getUTCHours())}:${pad(local.getUTCMinutes())}`
}

const LOCAL_INPUT_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/

export const fromArgentinaLocalInput = (local: string): string | null => {
  if (!LOCAL_INPUT_PATTERN.test(local)) {
    return null
  }
  const date = new Date(`${local}:00${ARGENTINA_OFFSET}`)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}
