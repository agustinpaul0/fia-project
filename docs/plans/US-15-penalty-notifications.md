# Plan: US-15 — Asentar la confirmación de notificación de una sanción

- **Ítem del backlog**: US-15
- **Autor**: Argon 4 / Antigravity · **Fecha**: 2026-10-29 · **Estado**: Implementado
- **Rama**: `feat/us-15-penalty-notifications`

> **Instrucciones Obligatorias para Argon 4:**
> 1. Consultar y aplicar todas las directivas de [`AGENTS.md`](../AGENTS.md): máximo 100 líneas por archivo de código, cero comentarios, tipado estricto, capas `routes → service → repository → db`, sin SQL plano.
> 2. Seguir el flujo de trabajo en [`docs/workflow.md`](../workflow.md) y [`docs/testing.md`](../testing.md).
> 3. Implementar mediante un máximo de 5 commits atómicos en Conventional Commits en español.

## Objetivo

Generar automáticamente una notificación in-app para la escudería involucrada cuando la FIA emita una sanción a un equipo o a uno de sus pilotos (reutilizando el motor de notificaciones de US-9), permitiendo al personal de dicha escudería asentar la confirmación oficial con un solo clic, impidiendo la doble confirmación, garantizando la inmutabilidad del registro de confirmación y exponiendo el estado ("Pendiente" o "Notificada") para la escudería y la auditoría de la FIA.

## Descubrimiento (respuestas)

| Pregunta | Respuesta | Fuente (US, dev, PO) |
|---|---|---|
| ¿Qué rol ejecuta la acción? | Confirmación: Personal de la escudería sancionada (`team_staff`). Auditoría de estado: `fia_admin` y `team_staff`. El público no ve el estado de notificación. | US-15, US-16, PO |
| ¿Qué datos entran y salen? | Entrada: `penaltyId` a confirmar. Salida: registro inmutable con fecha/hora de confirmación (`confirmedAt`) y usuario confirmante (`confirmedByUserId`). | US-15, US-9 |
| ¿Hay concurrencia? | Sí, si dos miembros de la misma escudería intentan confirmar al mismo tiempo, solo uno asienta y el segundo recibe 409 `PENALTY_ALREADY_CONFIRMED`. | ADR 0004 |
| ¿Qué se muestra en carga / vacío / error? | Carga: botón con spinner de confirmación. Error: toast con mensaje de error claro si ya fue confirmado por un colega. | UI conventions |

## Cambios por capa

| Capa | Archivos a crear/modificar | Responsabilidad |
|---|---|---|
| `shared/contracts` | `contracts/penalty-notifications.ts` | Schemas Zod de notificación de sanción, confirmación y estados de auditoría. |
| `shared/domain` | `domain/errors/notification-errors.ts` | Errores `PENALTY_ALREADY_CONFIRMED`, `PENALTY_NOTIFICATION_NOT_FOUND`, `FORBIDDEN_PENALTY_CONFIRM`. |
| `shared/db` | `db/schema/penalty-notifications.ts`, `schema/index.ts` | Tabla `penalty_notifications` con FKs a `penalties`, `teams`, `user`, unique compuesto y checks. Migración Drizzle. |
| `api` | `features/penalties/*`, `features/notifications/*` | Conectar creación de sanción con creación de notificación pendiente; port, repositorio y servicio de confirmación inmutable. |
| `web` | `features/penalties/*`, `features/notifications/*`, `routes/sanctions.tsx` | Botón "Confirmar notificación" en sanciones pendientes de la escudería, badges de estado para escudería y FIA. |

## Restricciones de base de datos

- Tabla `penalty_notifications`:
  - `penalty_id` uuid not null con FK a `penalties.id` (`onDelete: cascade`).
  - `team_id` uuid not null con FK a `teams.id` (`onDelete: restrict`).
  - `confirmed_at` timestamp with timezone (nullable).
  - `confirmed_by_user_id` text con FK a `user.id` (`onDelete: restrict`).
  - Restricción `unique(penalty_id, team_id)`: una sola notificación por sanción para el equipo.
  - Check de coherencia: `(confirmed_at is null) = (confirmed_by_user_id is null)`.
  - Inmutabilidad: una vez confirmado no admite edición ni borrado.

## Errores

| Acción inválida | code | status | Mensaje |
|---|---|---|---|
| Sanción ya confirmada previamente | `PENALTY_ALREADY_CONFIRMED` | 409 | La notificación de esta sanción ya fue confirmada por tu escudería. |
| Confirmar sanción de otra escudería | `FORBIDDEN_PENALTY_CONFIRM` | 403 | No tenés autorización para confirmar sanciones de otra escudería. |
| Notificación de sanción no encontrada | `PENALTY_NOTIFICATION_NOT_FOUND` | 404 | La notificación de sanción solicitada no existe. |

## Tests

| Tipo | Casos |
|---|---|
| Unit (service) | Generación de notificación al crear sanción, confirmación exitosa con usuario y timestamp, rechazo de confirmación duplicada. |
| Contrato (caja negra) | `POST /penalties/:id/confirm` (200 OK para la escudería sancionada, 403 para escudería ajena, 409 ya confirmada, 401 anónimo). |
| Fuzz | Payloads concurrentes y parámetros UUID inválidos no provocan fallos de servidor. |
| Integración | Persistencia en base de datos PostgreSQL, asegurando la atomicidad de la confirmación y la restricción única. |
| Componentes Web | Visualización de badges "Pendiente" y "Notificada", botón de confirmación con 1-click y actualización del estado. |

## Riesgos y decisiones

- Se implementa un modelo desacoplado similar al de `score_notifications` (ADR 0008) para preservar el historial de auditoría de confirmaciones reglamentarias de la FIA.
- Los usuarios anónimos o públicos no acceden al estado de confirmación interno para cumplir el criterio de confidencialidad de US-16.

## Secuencia de Commits Atómicos (máximo 5)

1. `feat(penalties): crear schema penalty_notifications, migracion drizzle y contratos zod`
2. `feat(penalties): implementar repositorio de notificaciones de sanciones y pruebas de integracion`
3. `feat(penalties): emitir notificacion automatica al registrar sancion y servicio de confirmacion`
4. `feat(penalties): exponer endpoint de confirmacion con guardas de escuderia y tests de contrato`
5. `feat(web): integrar boton de confirmacion 1-click y badges de notificacion para equipo y fia`
