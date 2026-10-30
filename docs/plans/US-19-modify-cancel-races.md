# Plan: US-19 — Modificar o dar de baja eventos deportivos previamente programados

- **Ítem del backlog**: US-19
- **Autor**: Argon 4 / Antigravity · **Fecha**: 2026-10-29 · **Estado**: Implementado
- **Rama**: `feat/us-19-modify-cancel-races`

> **Instrucciones Obligatorias para Argon 4:**
> 1. Consultar y aplicar todas las directivas de [`AGENTS.md`](../AGENTS.md): máximo 100 líneas por archivo de código, cero comentarios, tipado estricto, capas `routes → service → repository → db`, sin SQL plano.
> 2. Seguir el flujo de trabajo en [`docs/workflow.md`](../workflow.md) y [`docs/testing.md`](../testing.md).
> 3. Implementar mediante un máximo de 5 commits atómicos en Conventional Commits en español.

## Objetivo

Permitir al Personal Administrativo de la FIA (`fia_admin`) modificar los datos de un evento deportivo previamente programado (fecha, hora, circuito y tipo) o darlo de baja lógica tras confirmación, reflejando de inmediato en el calendario público y de escuderías el estado actualizado con distintivos visibles de "Modificado" o "Cancelado", preservando la trazabilidad de quién y cuándo realizó el cambio.

## Descubrimiento (respuestas)

| Pregunta | Respuesta | Fuente (US, dev, PO) |
|---|---|---|
| ¿Qué rol ejecuta la acción? | Modificación y baja: Exclusivamente `fia_admin`. Consulta de calendario: público general (`publicAccess`), escuderías y FIA. | US-19, PO |
| ¿Qué datos entran y salen? | Entrada modificación: `date`, `circuitId`, `type`, `version`. Entrada baja: `reason` (opcional), `version`. Salida: evento deportivo con `status` (`scheduled`, `modified`, `cancelled`), fecha de modificación y usuario responsable. | US-19, US-20 |
| ¿Hay concurrencia? | Sí, concurrencia optimista mediante `version` en `races`. Conflicto simultáneo ⇒ 409 `STALE_VERSION`. | ADR 0004 |
| ¿Qué se muestra en carga / vacío / error? | Carga: `QueryView` con spinner. Vacío: "No hay eventos deportivos programados.". Error: banner brutalista con botón reintentar. | UI conventions |

## Cambios por capa

| Capa | Archivos a crear/modificar | Responsabilidad |
|---|---|---|
| `shared/contracts` | `contracts/races.ts`, `api-paths.ts` | Schemas Zod `updateRaceBodySchema`, `cancelRaceBodySchema`, `raceStatusSchema`. |
| `shared/domain` | `domain/errors/racing-errors.ts` | Errores `RACE_NOT_FOUND`, `RACE_ALREADY_CANCELLED`, `INVALID_RACE_DATE`. |
| `shared/db` | `db/schema/races.ts`, `schema/index.ts` | Agregar `status` (`scheduled`/`modified`/`cancelled`), `updated_by_user_id` (FK a `user.id`), `cancellation_reason`. Migración Drizzle. |
| `api` | `features/race-results/*`, `features/races/*` | Métodos `updateRace` y `cancelRace` en repositorio y servicio; rutas `PUT /races/:id` y `DELETE /races/:id` (`requireRole('fia_admin')`). |
| `web` | `features/race-results/*`, `routes/results.tsx`, `routes/admin.races.tsx` | Badges visuales "Modificado" y "Cancelado" en calendario, diálogo de edición y modal de confirmación de baja. |

## Restricciones de base de datos

- Columna `status`: `varchar(20)` not null default `'scheduled'`.
- Check de estados: `status in ('scheduled', 'modified', 'cancelled')`.
- FK `updated_by_user_id` → `user.id` (`onDelete: restrict`).
- Restricción de fecha: la fecha del evento debe ser válida en formato UTC.
- Control de concurrencia: filtro obligatorio por `id` y `version`.

## Errores

| Acción inválida | code | status | Mensaje |
|---|---|---|---|
| Evento no encontrado | `RACE_NOT_FOUND` | 404 | El evento deportivo indicado no existe. |
| Modificar un evento ya cancelado | `RACE_ALREADY_CANCELLED` | 400 | No podés modificar un evento que ya fue cancelado. |
| Fecha inválida o en el pasado para evento futuro | `INVALID_RACE_DATE` | 400 | La fecha del evento deportivo debe ser válida y futura. |
| Operación sin rol FIA | `FORBIDDEN` | 403 | No tenés los permisos requeridos para acceder a este recurso. |
| Edición con versión desactualizada | `STALE_VERSION` | 409 | Otra persona modificó este registro mientras lo editabas. Recargá para ver los cambios y volvé a intentar. |

## Tests

| Tipo | Casos |
|---|---|
| Unit (service) | Modificación de fecha y circuito pasando a estado `modified`, baja lógica pasando a `cancelled`, rechazo de modificación sobre cancelado. |
| Contrato (caja negra) | `PUT /races/:id` (200 fia_admin, 400 fecha inválida, 401 anónimo, 403 escudería), `DELETE /races/:id` (200 con confirmación). |
| Fuzz | Payloads mutados en actualización de carreras no generan caídas del servidor. |
| Integración | Persistencia en base de datos PostgreSQL de la baja lógica, audit trail (`updated_by_user_id`, `updated_at`) y versionado. |
| Componentes Web | Vista de calendario con badges destacados de "Modificado" (amarillo brutalista) y "Cancelado" (rojo), modal de confirmación de baja. |

## Riesgos y decisiones

- La baja es estrictamente lógica (`status = 'cancelled'`), garantizando que no se rompan claves foráneas con resultados o controles ya existentes.
- La vista de calendario público actualiza sus datos automáticamente para reflejar cualquier suspensión o reprogramación en tiempo real.

## Secuencia de Commits Atómicos (máximo 5)

1. `feat(races): agregar columnas de estado y auditoria a schema races con migracion drizzle`
2. `feat(races): implementar metodos de modificacion y baja logica en repositorio y tests int`
3. `feat(races): implementar servicio de actualizacion de eventos deportivos y control optimista`
4. `feat(races): exponer endpoints PUT y DELETE /races/:id para fia_admin con tests de contrato`
5. `feat(web): agregar distintivos de modificado/cancelado en calendario y dialogo de edicion fia`
