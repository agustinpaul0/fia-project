# Feature: sanciones oficiales a pilotos y escuderías

- **US relacionadas**: US-13 (Cargar sanciones a pilotos o escuderías — Sprint 2).
- **Código**:
  - `packages/shared/src/contracts/penalties.ts`
  - `packages/shared/src/db/schema/penalties.ts`
  - `apps/api/src/features/penalties/`
  - `apps/web/src/features/penalties/`
- **Plan**: [`docs/plans/US-13-penalties.md`](../../plans/US-13-penalties.md)

## Qué hace

Permite al personal administrativo de la FIA (`fia_admin`) cargar sanciones oficiales impuestas por los comisarios deportivos a pilotos o escuderías por incidentes o infracciones. El listado es público y consultable en tiempo real por escuderías y aficionados, con filtros por temporada, tipo de sanción y escudería.

## Reglas de negocio

| Regla | Fuente |
|---|---|
| Carga exclusiva: sólo `fia_admin` puede registrar sanciones oficiales | PO |
| Acceso público: el listado está disponible para escuderías y público en general de sólo lectura | PO |
| Tipos de sanción: recargo de tiempo (`time_penalty`), puestos en grilla (`grid_penalty`), quita de puntos (`points_deduction`), descalificación (`disqualification`), multa económica (`fine`) y apercibimiento (`reprimand`) | PO |
| Alcance: aplicadas a una escudería obligatoriamente, y opcionalmente a un piloto y/o evento de carrera | PO |
| Retención histórica: las sanciones permanecen en el listado durante 5 temporadas (coherente con US-5) | PO |
| Concurrencia optimista: la tabla maneja columna de `version` para prevenir colisiones | dev |

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
| Escudería inexistente | `TEAM_NOT_FOUND` | 404 | La escudería indicada no existe. |
| Piloto inexistente | `DRIVER_NOT_FOUND` | 404 | El piloto sancionado no existe. |
| Carrera inexistente | `RACE_NOT_FOUND` | 404 | El evento de carrera indicado no existe. |
| Piloto no pertenece a la escudería | `DRIVER_NOT_IN_TEAM` | 400 | El piloto sancionado no pertenece a la escudería indicada. |
