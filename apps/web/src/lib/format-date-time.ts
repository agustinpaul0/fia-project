export const DISPLAY_TIME_ZONE = 'America/Argentina/Buenos_Aires'

const dateTimeFormatter = new Intl.DateTimeFormat('es-AR', {
  timeZone: DISPLAY_TIME_ZONE,
  dateStyle: 'short',
  timeStyle: 'short',
  hourCycle: 'h23',
})

const dateFormatter = new Intl.DateTimeFormat('es-AR', {
  timeZone: DISPLAY_TIME_ZONE,
  dateStyle: 'long',
})

const numericDateFormatter = new Intl.DateTimeFormat('es-AR', {
  timeZone: DISPLAY_TIME_ZONE,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

export const formatNumericDate = (isoUtc: string): string =>
  numericDateFormatter.format(new Date(isoUtc))

export const formatDateTime = (isoUtc: string): string => dateTimeFormatter.format(new Date(isoUtc))

export const formatDate = (isoUtc: string): string => dateFormatter.format(new Date(isoUtc))
