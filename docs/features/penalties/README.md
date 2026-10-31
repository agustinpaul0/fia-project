# Feature: sanciones oficiales a pilotos y escuderías

- **US relacionadas**: US-13 (Cargar sanciones a pilotos o escuderías — Sprint 2), US-15 (Asentar la confirmación de notificación de una sanción — Sprint 3), US-16 (Consultar el listado histórico y en vivo de sanciones emitidas — Sprint 3).
- **Código**:
  - `packages/shared/src/contracts/penalties.ts`
  - `packages/shared/src/db/schema/penalties.ts`
  - `apps/api/src/features/penalties/`
  - `apps/web/src/features/penalties/`
- **Plan**: [`docs/plans/US-13-penalties.md`](../../plans/US-13-penalties.md), [`docs/plans/US-15-penalty-notifications.md`](../../plans/US-15-penalty-notifications.md), [`docs/plans/US-16-penalties-history-live.md`](../../plans/US-16-penalties-history-live.md)

## Qué hace

Permite al personal administrativo de la FIA (`fia_admin`) cargar sanciones oficiales impuestas por los comisarios deportivos a pilotos o escuderías por incidentes o infracciones. El listado es público y consultable en tiempo real por escuderías y aficionados, con filtros por temporada, tipo de sanción y escudería.

## Reglas de negocio

| Regla | Fuente |
|---|---|
| Carga exclusiva: sólo `fia_admin` registra sanciones | US-13 |
| Listado público para escuderías y público en general | US-13 |
| Tipos: `time_penalty`, `grid_penalty`, `points_deduction`, `disqualification`, `fine`, `reprimand` (con `check` en la base) | PO |
| Datos de la sanción: categoría (la de la escudería), escudería, piloto (opcional), tipo, sanción, motivo, carrera (opcional) y fecha | PO (P4) |
| El formulario ofrece los pilotos (`GET /teams/:id/drivers`) y las carreras de la temporada de la fecha (`GET /teams/:id/races?season=`) de la categoría de la escudería elegida; si la fecha queda vacía se usa la actual | US-13 + PO |
| Retención: el listado muestra sólo las sanciones emitidas en los últimos 5 años (lo calcula el servicio) | US-13 |
| Filtros: temporada y tipo (en el servidor) y escudería (sobre el listado) | US-13 |
| Al cargarse una sanción, la escudería la ve en su bandeja de notificaciones (`/notifications`, sección "Sanciones a confirmar") y en el contador del menú, y la confirma con un clic | US-15 (reutiliza la bandeja de US-9, PO 31/10) |
| La confirmación guarda usuario y fecha (`confirmed_by_user_id`, `confirmed_at`, juntos por `check`), una sola vez por escudería (update condicionado a `confirmed_at is null` y a `version`) | US-15 |
| No existe endpoint para editar o borrar la confirmación; `confirmed_by_user_id` es FK `restrict` | US-15 |
| La FIA y la escudería dueña ven "Pendiente/Notificada" y quién confirmó y cuándo; el público no ve el estado | US-15 + US-16 |

## Roles y permisos

| Acción | fia_admin | team_staff | public |
|---|---|---|---|
| Consultar sanciones (`GET /penalties`) | ✓ | ✓ | ✓ |
| Registrar sanción (`POST /penalties`) | ✓ | ✗ (403) | ✗ (401) |
| Ver pendientes de su escudería (`GET /penalties/pending`) | ✗ (403) | ✓ | ✗ (401) |
| Confirmar sanción propia (`POST /penalties/:id/confirm`) | ✗ (403) | ✓ (ajena ⇒ 403) | ✗ (401) |

## API

| Método | Ruta | Acceso | Query / Body | Respuesta |
|---|---|---|---|---|
| GET | `/penalties` | `publicAccess` | `?season=&teamId=&type=` | 200 `Penalty[]` ordenadas por fecha descendente |
| POST | `/penalties` | `fia_admin` | `CreatePenaltyBody` | 201 `Penalty` |
| GET | `/penalties/pending` | `team_staff` | — | 200 `Penalty[]` sin confirmar de su escudería |
| POST | `/penalties/:id/confirm` | `team_staff` | — | 200 `Penalty` con `confirmedByName` y `confirmedAt` |

## Errores

| Acción inválida | code | status | Mensaje |
|---|---|---|---|
| Escudería inexistente | `TEAM_NOT_FOUND` | 404 | La escudería seleccionada no existe o fue eliminada. |
| Piloto inexistente | `DRIVER_NOT_FOUND` | 404 | Uno de los pilotos elegidos no existe. Recargá la página y volvé a intentar. |
| Carrera inexistente | `RACE_NOT_FOUND` | 404 | La carrera no existe o fue eliminada. |
| El piloto no es de esa escudería | `INVALID_PENALTY_TARGET` | 400 | El piloto seleccionado no pertenece a la escudería indicada. |
| Datos faltantes o inválidos | `VALIDATION_FAILED` | 400 | Hay datos inválidos. Revisá los campos marcados y volvé a intentar. |
| Confirmar una sanción ya confirmada | `NOTIFICATION_ALREADY_CONFIRMED` | 409 | (catálogo) |
| Confirmar una sanción de otra escudería | `FORBIDDEN` | 403 | No tenés permisos para realizar esta acción. |
| Confirmar sin escudería asociada | `TEAM_REQUIRED` | 403 | (catálogo) |
| Sanción inexistente | `PENALTY_NOT_FOUND` | 404 | La sanción solicitada no existe o fue eliminada. |
