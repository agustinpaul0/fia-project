import type { ErrorDefinition } from './error-definition'

export const RACING_ERRORS = {
  RACE_NOT_FOUND: {
    status: 404,
    message: 'La carrera no existe o fue eliminada.',
  },
  RACE_NOT_FINISHED: {
    status: 422,
    message: 'Todavía no se puede cargar el resultado: la carrera no se corrió.',
  },
  DRIVER_NOT_FOUND: {
    status: 404,
    message: 'Uno de los pilotos elegidos no existe. Recargá la página y volvé a intentar.',
  },
  DRIVER_NOT_IN_CATEGORY: {
    status: 422,
    message: 'Uno de los pilotos elegidos no corre en la categoría de esta carrera.',
  },
} as const satisfies Record<string, ErrorDefinition>
