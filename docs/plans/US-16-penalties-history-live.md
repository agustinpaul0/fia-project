# Plan: US-16 — Consultar el listado histórico y en vivo de sanciones emitidas

- **Ítem del backlog**: US-16
- **Autor**: Argon 4 / Antigravity · **Fecha**: 2026-10-29 · **Estado**: Implementado
- **Rama**: `feat/us-16-penalties-history-live`

> **Instrucciones Obligatorias para Argon 4:**
> 1. Consultar y aplicar todas las directivas de [`AGENTS.md`](../AGENTS.md): máximo 100 líneas por archivo de código, cero comentarios, tipado estricto, capas `routes → service → repository → db`, sin SQL plano.
> 2. Seguir el flujo de trabajo en [`docs/workflow.md`](../workflow.md) y [`docs/testing.md`](../testing.md).
> 3. Implementar mediante un máximo de 5 commits atómicos en Conventional Commits en español.

## Objetivo

Permitir a cualquier usuario, con o sin inicio de sesión (`publicAccess`), consultar el listado de sanciones de la temporada en curso por defecto y navegar el historial de hasta 5 temporadas anteriores, visualizando con total claridad el impacto de la penalización (recargo en segundos, puestos en grilla, etc.), con actualización automática en vivo sin recargar la página (polling de TanStack Query estilo US-6) y ocultando al público los estados internos de notificación reglamentaria (US-15).

## Descubrimiento (respuestas)

| Pregunta | Respuesta | Fuente (US, dev, PO) |
|---|---|---|
| ¿Qué rol ejecuta la acción? | Acceso público abierto (`publicAccess`). No requiere sesión. | US-16, PO |
| ¿Qué datos entran y salen? | Entrada: query params opcionales (temporada, tipo, escudería, fecha). Salida: array de sanciones con fecha, carrera, categoría, sancionado (piloto o escudería), motivo, tipo y detalle de la penalización. | US-16, US-13 |
| ¿Hay concurrencia? | Es una vista de consulta; las nuevas sanciones aparecen en vivo vía polling. | US-6, UI conventions |
| ¿Qué se muestra en carga / vacío / error? | Carga: `StaleFade` para no parpadear al cambiar de año. Vacío: "No hay sanciones registradas en la temporada seleccionada.". Error: `ErrorState` con botón de reintento. | UI conventions |

## Cambios por capa

| Capa | Archivos a crear/modificar | Responsabilidad |
|---|---|---|
| `shared/contracts` | `contracts/penalties.ts` | Schema Zod de consulta con soporte de temporada actual por defecto y rango de 5 años. |
| `shared/domain` | `domain/errors/racing-errors.ts` | Errores de temporada inválida si se solicitan años fuera del rango de 5 años. |
| `api` | `features/penalties/*` | Optimización de índices y queries por año/temporada; discriminación de datos para no exponer auditoría interna al público. |
| `web` | `features/penalties/*`, `routes/sanctions.tsx` | Selector de temporadas (año actual predeterminado), polling de refresco continuo (`refetchInterval: 5000`) y tabla brutalista descriptiva. |

## Restricciones de base de datos

- Índice existente `penalties_issued_at_idx` para filtrado veloz por rango de fechas/años.
- Regla de retención histórica: limitar consultas hasta 5 años hacia atrás desde la fecha actual.

## Errores

| Acción inválida | code | status | Mensaje |
|---|---|---|---|
| Temporada fuera del rango histórico (5 años) | `SEASON_OUT_OF_RANGE` | 400 | Solo podés consultar sanciones de las últimas 5 temporadas. |

## Tests

| Tipo | Casos |
|---|---|
| Unit (service/hooks) | Filtrado por temporada actual por defecto, exclusión de metadatos de confirmación para público. |
| Contrato (caja negra) | `GET /penalties?season=2026` sin sesión (200 OK con payload público), query con temporada de hace 6 años rechazada con 400. |
| Fuzz | Consultas concurrentes con queries arbitrarias no generan errores de servidor. |
| Integración | Verificación de consultas sobre Postgres con dataset de 5 temporadas de datos de demostración. |
| Componentes Web | Selector de temporadas sin parpadeo visual, aparición automática de una nueva sanción simulando actualización en tiempo real. |

## Riesgos y decisiones

- Se configura `refetchInterval` en TanStack Query de 5 segundos cuando la pestaña está activa, garantizando el criterio de actualización en menos de 10 minutos sin recarga de página.
- El público anónimo no recibe el campo `notificationStatus` en la respuesta pública (`publicAccess`), resguardando la privacidad de las gestiones administrativas de escuderías.

## Secuencia de Commits Atómicos (máximo 4)

1. `feat(penalties): actualizar contrato de consulta de sanciones con soporte de temporadas`
2. `feat(penalties): optimizar filtro de 5 temporadas en repositorio y censura de auditoria publica`
3. `feat(web): configurar auto-actualizacion por polling y selector de temporadas en sanciones`
4. `feat(web): mejorar representacion visual del impacto de penalizaciones en la grilla`
