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
  CAR_NUMBER_ALREADY_TAKEN: {
    status: 409,
    message: 'El número de auto ya está asignado a otro piloto de la categoría.',
  },
  DRIVER_CODE_ALREADY_TAKEN: {
    status: 409,
    message: 'El código de tres letras ya está asignado a otro piloto.',
  },
  DRIVER_LIMIT_EXCEEDED: {
    status: 422,
    message: 'Se alcanzó el límite reglamentario de pilotos para esta condición.',
  },
  PENALTY_NOT_FOUND: {
    status: 404,
    message: 'La sanción solicitada no existe o fue eliminada.',
  },
  INVALID_PENALTY_TARGET: {
    status: 400,
    message: 'El piloto seleccionado no pertenece a la escudería indicada.',
  },
  TECHNICAL_CONTROL_NOT_FOUND: {
    status: 404,
    message: 'El control técnico solicitado no existe o fue eliminado.',
  },
  INVALID_TECHNICAL_CONTROL_TARGET: {
    status: 400,
    message: 'El piloto o vehículo seleccionado no pertenece a la escudería.',
  },
} as const satisfies Record<string, ErrorDefinition>
