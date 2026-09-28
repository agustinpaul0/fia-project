# Feature: notificaciones de puntaje

- **US relacionadas**: US-9 (confirmar notificación del puntaje recibido). Se apoya en las revisiones de US-20.
- **Código**: `packages/shared/src/contracts/notifications.ts`,
  `packages/shared/src/db/schema/score-notifications.ts`, `apps/api/src/features/notifications/`,
  `apps/web/src/features/notifications/`
- **Plan**: [`docs/plans/US-9-score-notifications.md`](../../plans/US-9-score-notifications.md) · **ADR**: 0008

## Qué hace

Cuando la FIA publica o corrige el resultado de una carrera, cada escudería que sumó resultados en ella recibe una
notificación en la sección **Notificaciones** de la web. Una persona de la escudería confirma con un click que la
recibió; a partir de ahí la notificación desaparece para todo el equipo. La FIA consulta quién confirmó y cuándo.

## Reglas de negocio

| Regla | Fuente |
|---|---|
| Canal: sección de notificaciones en la web; push al celular cuando exista la app móvil | PO |
| Confirma una sola persona por escudería | PO |
| Si alguien intenta confirmar algo ya confirmado, se le avisa que ya no hace falta | PO |
| Se guarda quién confirmó y cuándo; la FIA lo puede ver | PO |
| Si un puntaje notificado se modifica, se vuelve a notificar (nueva revisión) | PO |
| Sólo vale la notificación de la última revisión; las anteriores ya no se pueden confirmar | dev |
| Los resultados cargados por el seed (revisión 0) no generan notificaciones | dev |
| La web vuelve a consultar cada 30 segundos, para confirmar en menos de un minuto | PO + dev |

## Cómo se generan

No hay un proceso aparte: al consultar la bandeja (o la auditoría), la API crea las notificaciones que falten para
cada combinación de carrera, escudería y **revisión vigente** de resultados (ADR 0008). La tabla tiene
`unique(race_id, team_id, results_revision)`, así que la creación es idempotente aunque dos personas consulten a la vez.

## Roles y permisos

| Acción | fia_admin | team_staff | public |
|---|---|---|---|
| Ver las pendientes de su escudería | ✗ (403) | ✓ | ✗ (401) |
| Confirmar | ✗ (403) | ✓ (sólo de su escudería) | ✗ (401) |
| Ver la auditoría de confirmaciones | ✓ | ✗ (403) | ✗ (401) |

## API

| Método | Ruta | Acceso | Respuesta |
|---|---|---|---|
| GET | `/notifications` | team_staff | pendientes vigentes de su escudería |
| POST | `/notifications/:id/confirm` | team_staff | la notificación confirmada |
| GET | `/notifications/audit` | fia_admin | notificaciones vigentes con estado, quién y cuándo |

## Datos

Tabla `score_notifications`: carrera, escudería, revisión, `confirmed_at`, `confirmed_by_user_id` y columnas de
versión. Restricciones: única por carrera+escudería+revisión, revisión ≥ 1 y `confirmed_at` / `confirmed_by_user_id`
se completan juntos (check). La confirmación actualiza sólo si la notificación sigue sin confirmar y con la misma
versión, así que dos confirmaciones simultáneas no se pisan.

## Errores

| Acción inválida | code | status | Mensaje |
|---|---|---|---|
| Sin sesión | `UNAUTHENTICATED` | 401 | Tenés que iniciar sesión para realizar esta acción. |
| Rol incorrecto | `FORBIDDEN` | 403 | No tenés permisos para realizar esta acción. |
| Cuenta de escudería sin escudería asociada | `TEAM_REQUIRED` | 403 | Tu cuenta no está asociada a ninguna escudería… |
| Notificación inexistente o de otra escudería | `NOTIFICATION_NOT_FOUND` | 404 | La notificación no existe o no corresponde a tu escudería. |
| Id inválido | `VALIDATION_FAILED` | 400 | Hay datos inválidos… |
| Ya confirmada (por esa u otra persona de la escudería) | `NOTIFICATION_ALREADY_CONFIRMED` | 409 | Esta notificación ya fue confirmada por tu escudería. No hace falta volver a confirmarla. |
| El puntaje se corrigió después de esta notificación | `NOTIFICATION_SUPERSEDED` | 409 | El puntaje de esta carrera se corrigió después de esta notificación… |

## Pantallas

- `/notifications` (personal de escudería): tarjetas con carrera, tipo, "Puntaje publicado" o "Puntaje corregido
  (revisión N)", puntos sumados y botón **Confirmar recepción**. Al confirmar aparece un aviso y la tarjeta
  desaparece. El encabezado muestra **Notificaciones** con la cantidad de pendientes.
- `/admin/notifications` (FIA): tabla con carrera, escudería, revisión, estado y "nombre · fecha y hora" de quien
  confirmó.
