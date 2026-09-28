import type { ErrorDefinition } from './error-definition'
import { RACING_ERRORS } from './racing-errors'

export type { ErrorDefinition, ErrorStatus } from './error-definition'

export const ERROR_CATALOG = {
  ...RACING_ERRORS,
  VALIDATION_FAILED: {
    status: 400,
    message: 'Hay datos inválidos. Revisá los campos marcados y volvé a intentar.',
  },
  UNAUTHENTICATED: {
    status: 401,
    message: 'Tenés que iniciar sesión para realizar esta acción.',
  },
  FORBIDDEN: {
    status: 403,
    message: 'No tenés permisos para realizar esta acción.',
  },
  INVALID_CREDENTIALS: {
    status: 401,
    message: 'El correo electrónico o la contraseña son incorrectos.',
  },
  USER_ALREADY_EXISTS: {
    status: 409,
    message: 'Ya existe un usuario registrado con ese correo electrónico.',
  },
  ROUTE_NOT_FOUND: {
    status: 404,
    message: 'La dirección solicitada no existe.',
  },
  CATEGORY_NOT_FOUND: {
    status: 404,
    message: 'La categoría no existe o fue eliminada.',
  },
  TEAM_NOT_FOUND: {
    status: 404,
    message: 'La escudería seleccionada no existe o fue eliminada.',
  },
  STAFF_MEMBER_NOT_FOUND: {
    status: 404,
    message: 'El miembro del personal no existe.',
  },
  CATEGORY_ALREADY_EXISTS: {
    status: 409,
    message: 'Ya existe una categoría con ese nombre o código.',
  },
  STAFF_FILE_NUMBER_ALREADY_EXISTS: {
    status: 409,
    message: 'Ya existe un miembro del personal con ese número de legajo.',
  },
  STAFF_MEMBER_INACTIVE: {
    status: 409,
    message: 'Esta cuenta está dada de baja. Creá una cuenta nueva para reemplazarla.',
  },
  STALE_VERSION: {
    status: 409,
    message:
      'Otra persona modificó este registro mientras lo editabas. Recargá para ver los cambios y volvé a intentar.',
  },
  PAYLOAD_TOO_LARGE: {
    status: 413,
    message: 'Los datos enviados son demasiado grandes.',
  },
  RATE_LIMITED: {
    status: 429,
    message: 'Hiciste demasiados intentos. Esperá unos minutos y volvé a probar.',
  },
  INTERNAL_ERROR: {
    status: 500,
    message: 'Ocurrió un error inesperado. Intentá de nuevo en unos minutos.',
  },
  NETWORK_ERROR: {
    status: 503,
    message: 'No pudimos conectarnos con el servidor. Revisá tu conexión y volvé a intentar.',
  },
} as const satisfies Record<string, ErrorDefinition>

export type ErrorCode = keyof typeof ERROR_CATALOG

export const ERROR_CODES = Object.keys(ERROR_CATALOG) as readonly ErrorCode[]
