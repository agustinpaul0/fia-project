import type { ErrorDefinition } from './error-definition'

export const RACING_ERRORS = {
  RACE_NOT_FOUND: {
    status: 404,
    message: 'La carrera no existe o fue eliminada.',
  },
  RACE_ALREADY_CANCELLED: {
    status: 400,
    message: 'No podés modificar un evento que ya fue cancelado.',
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
  LICENSE_ALREADY_TAKEN: {
    status: 409,
    message: 'La licencia deportiva ya está asignada a otro piloto.',
  },
  DRIVER_CODE_ALREADY_TAKEN: {
    status: 409,
    message: 'El código de tres letras ya está asignado a otro piloto.',
  },
  DRIVER_LIMIT_EXCEEDED: {
    status: 422,
    message: 'Se alcanzó el límite reglamentario de pilotos para esta condición.',
  },
  DRIVER_ACCOUNT_ALREADY_EXISTS: {
    status: 409,
    message: 'El piloto seleccionado ya cuenta con un usuario oficial registrado en el sistema.',
  },
  DRIVER_ACCOUNT_NOT_FOUND: {
    status: 404,
    message: 'La cuenta oficial del piloto solicitada no existe.',
  },
  DRIVER_EMAIL_ALREADY_EXISTS: {
    status: 409,
    message: 'Ya existe una cuenta registrada con este correo electrónico.',
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
  CHAT_KEY_NOT_FOUND: {
    status: 404,
    message: 'El destinatario aún no ha registrado sus claves de cifrado de extremo a extremo.',
  },
  CONVERSATION_NOT_FOUND: {
    status: 404,
    message: 'La conversación solicitada no existe o no tenés permiso para acceder a ella.',
  },
  INVALID_CHAT_RECIPIENT: {
    status: 400,
    message: 'No podés iniciar una conversación con vos mismo o con un usuario inválido.',
  },
} as const satisfies Record<string, ErrorDefinition>
