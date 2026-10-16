# Feature: gestión e inscripción de pilotos por escudería

- **US relacionadas**: US-10 (Cargar la información de los pilotos titulares y suplentes — Sprint 2).
- **Código**:
  - `packages/shared/src/contracts/team-drivers.ts`
  - `packages/shared/src/db/schema/base-data.ts` (`drivers`, `teams`, `categories`)
  - `apps/api/src/features/team-drivers/`
  - `apps/web/src/features/team-drivers/`
- **Plan**: [`docs/plans/US-10-team-drivers.md`](../../plans/US-10-team-drivers.md)

## Qué hace

Permite al personal autenticado de una escudería (`team_staff`) inscribir y consultar los pilotos (titulares y suplentes) asignados a su propio equipo. Garantiza el aislamiento estricto de escudería: un usuario sólo puede operar sobre su equipo (`teamId` del token/sesión).

## Reglas de negocio

| Regla | Fuente |
|---|---|
| Aislamiento: sólo se inscriben y listan pilotos de la escudería del usuario (`teamId` de la sesión; el cuerpo no acepta `teamId`) | US-10 |
| Datos obligatorios: nombre y apellido (2–60), código de 3 letras mayúsculas, número de auto (1–99), nacionalidad (2–60), licencia deportiva (3–20) y condición (titular/suplente) | US-10 |
| Número de auto y código únicos entre todos los pilotos (la base lo garantiza con `unique`) | dev — consulta P2 al PO |
| Tope reglamentario: máximo 2 titulares y 2 suplentes por escudería | PO |
| La licencia es obligatoria al inscribir; los pilotos cargados por el seed la traen como `FIA-<número>-<código>` | US-10 + QA |

## Roles y permisos

| Acción | fia_admin | team_staff | public |
|---|---|---|---|
| Listar pilotos de su escudería (`GET /team-drivers`) | ✗ (403) | ✓ | ✗ (401) |
| Inscribir piloto (`POST /team-drivers`) | ✗ (403) | ✓ | ✗ (401) |

## API

| Método | Ruta | Acceso | Body | Respuesta |
|---|---|---|---|---|
| GET | `/team-drivers` | `team_staff` | — | 200 `DriverRow[]` |
| POST | `/team-drivers` | `team_staff` | `CreateTeamDriverBody` | 201 `DriverRow` |

## Errores

| Acción inválida | code | status | Mensaje |
|---|---|---|---|
| Usuario sin escudería asociada | `TEAM_REQUIRED` | 403 | Tu cuenta no está asociada a ninguna escudería. Pedile a la FIA que revise tu cuenta. |
| Número de auto repetido | `CAR_NUMBER_ALREADY_TAKEN` | 409 | El número de auto ya está asignado a otro piloto de la categoría. |
| Código de 3 letras repetido | `DRIVER_CODE_ALREADY_TAKEN` | 409 | El código de tres letras ya está asignado a otro piloto. |
| Se superó el tope de titulares o suplentes | `DRIVER_LIMIT_EXCEEDED` | 422 | Se alcanzó el límite reglamentario de pilotos para esta condición. |
| Datos faltantes o con formato inválido | `VALIDATION_FAILED` | 400 | Hay datos inválidos. Revisá los campos marcados y volvé a intentar. |
