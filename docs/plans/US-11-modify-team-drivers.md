# Plan: US-11 — Modificar la información de los pilotos y su condición de titular o suplente

- **Ítem del backlog**: US-11
- **Autor**: Argon 4 / Antigravity · **Fecha**: 2026-10-29 · **Estado**: Implementado
- **Rama**: `feat/us-11-modify-team-drivers`

> **Instrucciones Obligatorias para Argon 4:**
> 1. Consultar y aplicar todas las directivas de [`AGENTS.md`](../AGENTS.md): máximo 100 líneas por archivo de código, cero comentarios, tipado estricto, capas `routes → service → repository → db`, sin SQL plano.
> 2. Seguir el flujo de trabajo en [`docs/workflow.md`](../workflow.md) y [`docs/testing.md`](../testing.md).
> 3. Implementar mediante un máximo de 5 commits atómicos en Conventional Commits en español.

## Objetivo

Permitir al personal de las escuderías (`team_staff`) modificar en cualquier momento los datos de sus pilotos y alternar su condición entre titular (`main`) y suplente (`reserve`), garantizando que se respeten los topes reglamentarios (máx 2 titulares y 2 suplentes por equipo), unicidad de dorsal por categoría, formato de licencia deportiva, aislamiento de escudería y concurrencia optimista (`version`), disponiendo además de una vista pública de solo lectura (versión base de US-17).

## Descubrimiento (respuestas)

| Pregunta | Respuesta | Fuente (US, dev, PO) |
|---|---|---|
| ¿Qué rol ejecuta la acción? | Edición: Personal de la escudería dueña (`team_staff`). Consulta: pública (`publicAccess`) para público, escuderías y FIA. | US-11, PO |
| ¿Qué datos entran y salen? | Entrada: `firstName`, `lastName`, `number`, `license`, `role` (`main`/`reserve`), `version`. Salida: DTO de piloto actualizado con auditoría de modificación. | US-11, US-10 |
| ¿Hay concurrencia? | Sí, campo `version` en `drivers`. Si otra persona editó el piloto en simultáneo ⇒ 409 `STALE_VERSION`. | ADR 0004 |
| ¿Qué se muestra en carga / vacío / error? | Carga: skeleton de nómina. Vacío: "No hay pilotos registrados.". Error: banner o toast con reintento y opción de recarga ante 409. | UI conventions |

## Cambios por capa

| Capa | Archivos a crear/modificar | Responsabilidad |
|---|---|---|
| `shared/contracts` | `contracts/team-drivers.ts`, `contracts/drivers.ts` | Schema Zod `updateTeamDriverBodySchema` (con `version`) y schema de consulta pública. |
| `shared/domain` | `domain/errors/racing-errors.ts` | Errores `STARTER_LIMIT_EXCEEDED`, `RESERVE_LIMIT_EXCEEDED`, `DRIVER_NOT_FOUND`. |
| `shared/db` | `db/schema/drivers.ts` | Validar columnas de auditoría (`updatedAt`) y restricciones de integridad. |
| `api` | `features/team-drivers/*`, `features/drivers/*` | Métodos `updateDriver` en repositorio y servicio con control de pertenencia; endpoint público `GET /drivers`. |
| `web` | `features/team-drivers/*`, `routes/team.drivers.tsx`, `routes/drivers.tsx` | Diálogo de edición reutilizando formulario de alta, y vista de sólo lectura de nómina pública. |

## Restricciones de base de datos

- Restricción `unique(category_id, number)`: dorsal único por categoría.
- Restricción `unique(license)`: licencia deportiva única por piloto.
- `version` entero por concurrencia optimista (filtra por `id` y `version`).
- `role` check: in ('main', 'reserve').

## Errores

| Acción inválida | code | status | Mensaje |
|---|---|---|---|
| Edición con versión obsoleta | `STALE_VERSION` | 409 | Otra persona modificó este registro mientras lo editabas. Recargá para ver los cambios y volvé a intentar. |
| Supera tope de titulares (máx 2) | `STARTER_LIMIT_EXCEEDED` | 400 | La escudería ya alcanzó el cupo máximo de 2 pilotos titulares. |
| Supera tope de suplentes (máx 2) | `RESERVE_LIMIT_EXCEEDED` | 400 | La escudería ya alcanzó el cupo máximo de 2 pilotos suplentes. |
| Dorsal ya asignado en la categoría | `CAR_NUMBER_ALREADY_TAKEN` | 409 | El número de auto ya está asignado a otro piloto en esta categoría. |
| Intentar editar piloto de otra escudería | `FORBIDDEN` | 403 | No tenés permisos para gestionar los pilotos de otra escudería. |
| Piloto no encontrado | `DRIVER_NOT_FOUND` | 404 | El piloto indicado no existe en el sistema. |

## Tests

| Tipo | Casos |
|---|---|
| Unit (service) | Cambio de titular a suplente, validación de topes (2 y 2), rechazo si el piloto es de otra escudería. |
| Contrato (caja negra) | `PUT /team-drivers/:id` (200, 400, 403, 404, 409) y `GET /drivers` público con 200. |
| Fuzz | Payloads mutados aleatoriamente con fast-check no generan respuestas 500. |
| Integración | Actualización en PostgreSQL con control de `version`, elevando `STALE_VERSION` si coincide versión previa. |
| Componentes Web | Formulario de edición con precarga de valores, validaciones inline y mensaje ante 409. |

## Riesgos y decisiones

- Se reutiliza la estructura del formulario de inscripción de US-10 en un componente polimórfico (`DriverFormDialog`) para evitar duplicación.
- El endpoint público `GET /drivers` expone únicamente los datos permitidos para el público (nombre, apellido, país, número, categoría, condición y escudería), sin datos privados de auditoría.

## Secuencia de Commits Atómicos (máximo 5)

1. `feat(team-drivers): definir contratos Zod para actualizacion y consulta publica de pilotos`
2. `feat(team-drivers): implementar updateDriver con control de version en repositorio y tests int`
3. `feat(team-drivers): agregar validacion de cupos y pertenencia en servicio con tests unitarios`
4. `feat(team-drivers): exponer endpoint PUT /team-drivers/:id y GET /drivers con tests de contrato`
5. `feat(web): implementar dialogo de edicion de pilotos y vista de consulta publica`
