import type { ErrorDefinition } from './error-definition'

export const NOTIFICATION_ERRORS = {
  TEAM_REQUIRED: {
    status: 403,
    message:
      'Tu cuenta no está asociada a ninguna escudería. Pedile a la FIA que revise tu cuenta.',
  },
  NOTIFICATION_NOT_FOUND: {
    status: 404,
    message: 'La notificación no existe o no corresponde a tu escudería.',
  },
  NOTIFICATION_ALREADY_CONFIRMED: {
    status: 409,
    message:
      'Esta notificación ya fue confirmada por tu escudería. No hace falta volver a confirmarla.',
  },
  NOTIFICATION_SUPERSEDED: {
    status: 409,
    message:
      'El puntaje de esta carrera se corrigió después de esta notificación. Confirmá la notificación más reciente.',
  },
} as const satisfies Record<string, ErrorDefinition>
