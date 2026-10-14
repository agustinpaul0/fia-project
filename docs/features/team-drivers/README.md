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
| Aislamiento: sólo se permite inscribir y listar pilotos pertenecientes a la escudería del usuario autenticado | PO + dev |
| Campos obligatorios: nombre (1–60), apellido (1–60), número de auto (1–99), código de 3 letras (3 letras mayúsculas), nacionalidad y rol (titular/suplente) | PO |
| Unicidad de dorsal: el número de auto no puede repetirse dentro de la misma categoría | PO |
| Tope reglamentario: máximo 2 pilotos titulares y 2 suplentes por escudería | PO |
| Licencia deportiva: opcional alfanumérica de hasta 30 caracteres | dev |

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
| Usuario sin escudería asociada | `TEAM_NOT_FOUND` | 400 | El usuario no pertenece a ninguna escudería registrada. |
| Número de coche duplicado en categoría | `DRIVER_NUMBER_ALREADY_EXISTS` | 409 | El número de auto ya se encuentra registrado en la categoría. |
| Excedido límite de titulares (máx 2) | `TOO_MANY_MAIN_DRIVERS` | 409 | La escudería ya alcanzó el límite reglamentario de 2 pilotos titulares. |
| Excedido límite de suplentes (máx 2) | `TOO_MANY_RESERVE_DRIVERS` | 409 | La escudería ya alcanzó el límite reglamentario de 2 pilotos suplentes. |
