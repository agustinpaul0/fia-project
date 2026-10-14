# Feature: controles e inspecciones técnicas vehiculares

- **US relacionadas**: US-21 (Ingresar fechas, tipos y resultado de controles técnicos por auto — Sprint 2).
- **Código**:
  - `packages/shared/src/contracts/technical-controls.ts`
  - `packages/shared/src/db/schema/technical-controls.ts`
  - `apps/api/src/features/technical-controls/`
  - `apps/web/src/features/technical-controls/`
- **Plan**: [`docs/plans/US-21-technical-controls.md`](../../plans/US-21-technical-controls.md)

## Qué hace

Permite al personal de comisarios de la FIA (`fia_admin`) registrar el historial de controles e inspecciones técnicas vehiculares (pesaje, combustible, alerones/dimensiones, potencia de motor, seguridad e inspección post-carrera), con el dictamen oficial (`passed` o `rejected`). El listado es público y consultable en tiempo real por escuderías y público.

## Reglas de negocio

| Regla | Fuente |
|---|---|
| Carga exclusiva: sólo `fia_admin` puede asentar inspecciones técnicas y dictámenes | PO |
| Acceso público: el listado está disponible para escuderías y público general de sólo lectura | PO |
| Tipos de control: pesaje (`weight`), combustible (`fuel`), dimensiones (`dimensions`), motor (`engine`), seguridad (`safety`), post-carrera (`post_race`) | PO |
| Resultados posibles: Aprobado (`passed`) o Rechazado (`rejected`) | PO |
| Expiración: los controles duran en el listado activo hasta su fecha de expiración o finalización del evento | PO |
| Concurrencia optimista: registro con columna `version` | dev |

## Roles y permisos

| Acción | fia_admin | team_staff | public |
|---|---|---|---|
| Consultar controles (`GET /technical-controls`) | ✓ | ✓ | ✓ |
| Registrar control (`POST /technical-controls`) | ✓ | ✗ (403) | ✗ (401) |

## API

| Método | Ruta | Acceso | Query / Body | Respuesta |
|---|---|---|---|---|
| GET | `/technical-controls` | `publicAccess` | `?teamId=&controlType=&status=` | 200 `TechnicalControl[]` |
| POST | `/technical-controls` | `fia_admin` | `CreateTechnicalControlBody` | 201 `TechnicalControl` |

## Errores

| Acción inválida | code | status | Mensaje |
|---|---|---|---|
| Escudería inexistente | `TEAM_NOT_FOUND` | 404 | La escudería indicada no existe. |
| Piloto inexistente | `DRIVER_NOT_FOUND` | 404 | El piloto inspeccionado no existe. |
| Carrera inexistente | `RACE_NOT_FOUND` | 404 | El evento de carrera indicado no existe. |
| Piloto no pertenece a la escudería | `DRIVER_NOT_IN_TEAM` | 400 | El piloto inspeccionado no pertenece a la escudería seleccionada. |
