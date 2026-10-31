# Feature: controles e inspecciones técnicas vehiculares

- **US relacionadas**: US-21 (Ingresar fechas, tipos y resultado de controles técnicos por auto — Sprint 2), US-24 (Visualizar resultados y observaciones de controles técnicos de los autos — Sprint 3).
- **Código**:
  - `packages/shared/src/contracts/technical-controls.ts`
  - `packages/shared/src/db/schema/technical-controls.ts`
  - `apps/api/src/features/technical-controls/`
  - `apps/web/src/features/technical-controls/`
- **Plan**: [`docs/plans/US-21-technical-controls.md`](../../plans/US-21-technical-controls.md), [`docs/plans/US-24-technical-controls-observations.md`](../../plans/US-24-technical-controls-observations.md)

## Qué hace

Permite al personal de comisarios de la FIA (`fia_admin`) registrar el historial de controles e inspecciones técnicas vehiculares (pesaje, combustible, alerones/dimensiones, potencia de motor, seguridad e inspección post-carrera), con el dictamen oficial (`passed` o `rejected`). El listado es público y consultable en tiempo real por escuderías y público.

## Reglas de negocio

| Regla | Fuente |
|---|---|
| Carga exclusiva: sólo `fia_admin` registra controles | US-21 |
| Listado público para escuderías y público en general | US-21 |
| Datos obligatorios: escudería, número de auto inspeccionado (1–99), tipo, dictamen (aprobado/rechazado), fecha y hora del control y vigencia ("Vigente hasta") | US-21 |
| La vigencia debe ser posterior al control (contrato y `check` en la base) | US-21 + QA |
| El listado oculta los controles cuya vigencia ya pasó | US-21 |
| Las fechas se cargan en hora de Buenos Aires y viajan en UTC | AGENTS.md |
| La vigencia la carga la FIA y el control se muestra hasta que vence | PO (P5) |
| "Mis autos" (`GET /technical-controls/mine`) muestra a la escudería sus controles con fecha, hora, tipo, vehículo, dictamen y observaciones; los rechazados se destacan | US-24 |
| Las observaciones sólo las ven la escudería dueña y la FIA; el público ve estado y dictamen | US-24 |
| El listado se vuelve a consultar solo cada 60 s (criterio: < 10 min sin recargar) | US-24 (QA) |

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
| Escudería inexistente | `TEAM_NOT_FOUND` | 404 | La escudería seleccionada no existe o fue eliminada. |
| Piloto inexistente | `DRIVER_NOT_FOUND` | 404 | Uno de los pilotos elegidos no existe. Recargá la página y volvé a intentar. |
| Carrera inexistente | `RACE_NOT_FOUND` | 404 | La carrera no existe o fue eliminada. |
| El piloto no es de esa escudería | `INVALID_TECHNICAL_CONTROL_TARGET` | 400 | El piloto o vehículo seleccionado no pertenece a la escudería. |
| Falta el auto, la fecha o la vigencia, o la vigencia no es posterior | `VALIDATION_FAILED` | 400 | Hay datos inválidos. Revisá los campos marcados y volvé a intentar. |
