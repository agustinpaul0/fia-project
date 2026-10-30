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

## Roles y permisos

| Acción | fia_admin | team_staff | public |
|---|---|---|---|
| Consultar sanciones (`GET /penalties`) | ✓ | ✓ | ✓ |
| Registrar sanción (`POST /penalties`) | ✓ | ✗ (403) | ✗ (401) |

## API

| Método | Ruta | Acceso | Query / Body | Respuesta |
|---|---|---|---|---|
| GET | `/penalties` | `publicAccess` | `?season=&teamId=&type=` | 200 `Penalty[]` ordenadas por fecha descendente |
| POST | `/penalties` | `fia_admin` | `CreatePenaltyBody` | 201 `Penalty` |

## Errores

| Acción inválida | code | status | Mensaje |
|---|---|---|---|
| Escudería inexistente | `TEAM_NOT_FOUND` | 404 | La escudería seleccionada no existe o fue eliminada. |
| Piloto inexistente | `DRIVER_NOT_FOUND` | 404 | Uno de los pilotos elegidos no existe. Recargá la página y volvé a intentar. |
| Carrera inexistente | `RACE_NOT_FOUND` | 404 | La carrera no existe o fue eliminada. |
| El piloto no es de esa escudería | `INVALID_PENALTY_TARGET` | 400 | El piloto seleccionado no pertenece a la escudería indicada. |
| Datos faltantes o inválidos | `VALIDATION_FAILED` | 400 | Hay datos inválidos. Revisá los campos marcados y volvé a intentar. |
