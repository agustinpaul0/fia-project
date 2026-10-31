# Feature: gestión e inscripción de pilotos por escudería

- **US relacionadas**: US-10 (Cargar la información de los pilotos titulares y suplentes — Sprint 2), US-11 (Modificar la información de los pilotos y su condición de titular o suplente — Sprint 3).
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
| Datos obligatorios: nombre y apellido (2–60), código de 3 letras mayúsculas, número de auto (1–99), nacionalidad (2–60), licencia deportiva (3–20, sólo letras, números y guiones) y condición (titular/suplente) | US-10 + PO |
| El número de auto es único dentro de cada categoría (se puede repetir en otra); `unique(category_id, number)`, con la categoría tomada de la escudería | PO (P2) |
| El código de 3 letras es único entre todos los pilotos | dev |
| La licencia es única por piloto (`unique(license)`) | PO (P1) |
| La foto o documentación del piloto queda para US-22 | PO (P3) |
| Tope reglamentario: máximo 2 titulares y 2 suplentes por escudería | PO |
| La licencia es obligatoria al inscribir; los pilotos cargados por el seed la traen como `FIA-<número>-<código>` | US-10 + QA |
| La escudería modifica datos y condición en cualquier momento, con las mismas validaciones de US-10 y concurrencia optimista (`version`) | US-11 |
| Cada modificación guarda quién la hizo (`drivers.updated_by_user_id`, FK a `user`) y cuándo (`updated_at`) | US-11 (QA) |
| La nómina pública `/drivers` (FIA y público, sólo lectura) refleja los cambios en la siguiente carga de pantalla e indica qué pilotos tienen cuenta oficial | US-11 + US-27 (QA) |

## Roles y permisos

| Acción | fia_admin | team_staff | public |
|---|---|---|---|
| Listar pilotos de su escudería (`GET /team-drivers`) | ✗ (403) | ✓ | ✗ (401) |
| Inscribir piloto (`POST /team-drivers`) | ✗ (403) | ✓ | ✗ (401) |
| Modificar piloto propio (`PUT /team-drivers/:id`) | ✗ (403) | ✓ (ajeno ⇒ 403) | ✗ (401) |
| Nómina pública (`GET /team-drivers/public`) | ✓ | ✓ | ✓ |

## API

| Método | Ruta | Acceso | Body | Respuesta |
|---|---|---|---|---|
| GET | `/team-drivers/public` | `publicAccess` | — | 200 `PublicDriver[]` (con `teamName` y `hasOfficialAccount`) |
| GET | `/team-drivers` | `team_staff` | — | 200 `DriverRow[]` |
| POST | `/team-drivers` | `team_staff` | `CreateTeamDriverBody` | 201 `DriverRow` |
| PUT | `/team-drivers/:id` | `team_staff` | `UpdateTeamDriverBody` | 200 `DriverRow` |

## Errores

| Acción inválida | code | status | Mensaje |
|---|---|---|---|
| Usuario sin escudería asociada | `TEAM_REQUIRED` | 403 | Tu cuenta no está asociada a ninguna escudería. Pedile a la FIA que revise tu cuenta. |
| Número de auto repetido | `CAR_NUMBER_ALREADY_TAKEN` | 409 | El número de auto ya está asignado a otro piloto de la categoría. |
| Licencia repetida | `LICENSE_ALREADY_TAKEN` | 409 | La licencia deportiva ya está asignada a otro piloto. |
| Código de 3 letras repetido | `DRIVER_CODE_ALREADY_TAKEN` | 409 | El código de tres letras ya está asignado a otro piloto. |
| Se superó el tope de titulares o suplentes | `DRIVER_LIMIT_EXCEEDED` | 422 | Se alcanzó el límite reglamentario de pilotos para esta condición. |
| Datos faltantes o con formato inválido | `VALIDATION_FAILED` | 400 | Hay datos inválidos. Revisá los campos marcados y volvé a intentar. |
| Modificar un piloto de otra escudería | `FORBIDDEN` | 403 | No tenés permisos para realizar esta acción. |
| Modificar un piloto inexistente | `DRIVER_NOT_FOUND` | 404 | (catálogo) |
| Modificar con una versión vieja | `STALE_VERSION` | 409 | (catálogo) |
