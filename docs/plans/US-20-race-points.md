# Plan: US-20 — Carga y modificación del puntaje de una carrera

- **Ítem del backlog**: US-20 (+ datos de 5 temporadas para la demo, pedido del dev)
- **Autor**: Agustín (con Claude Code) · **Fecha**: 2026-09-28 · **Estado**: Aprobado
- **Rama**: `feat/us-20-race-points`

## Objetivo

Que la administración de la FIA cargue la clasificación de una carrera (Gran Premio o Sprint) indicando el
orden de llegada de los pilotos, que el sistema calcule los puntos con la escala oficial y que escuderías y
público vean el resultado. Cada carga o corrección deja una revisión que US-9 usará para notificar.

## Descubrimiento (respuestas)

| Pregunta | Respuesta | Fuente |
|---|---|---|
| Escala de puntos | GP: 25-18-15-12-10-8-6-4-2-1. Sprint: 8-7-6-5-4-3-2-1. Sin punto por vuelta rápida. | PO + dev |
| ¿Qué se carga? | Orden de llegada completo de los clasificados; los puntos los calcula el sistema. | PO |
| DNF/DSQ | Fuera de alcance del Sprint 1: sólo posiciones clasificadas. | dev |
| Escudería del resultado | La del piloto al momento de la carga; queda guardada. | dev |
| Edición | Se reemplaza la clasificación completa; concurrencia con la `version` de la carrera. | dev |
| Carreras futuras | No se pueden cargar resultados si la fecha de la carrera no pasó. | dev |
| Pilotos válidos | Deben existir y su escudería debe pertenecer a la categoría de la carrera. | dev |
| Visibilidad | Pública (escuderías y público), en la web inmediatamente tras guardar (< 10 min pedido por el PO). | PO |
| Re-notificación | Cada guardado incrementa `results_revision`; US-9 notifica por revisión. | PO + dev |
| Categorías | Misma escala para todas por ahora. | dev (pregunta abierta al PO) |
| Datos de demo | Temporadas 2021–2025 con resultados (+2026 planificada). | PO (US-5) + dev |

**Pregunta abierta para el PO**: ¿F2, F3 y F1 Academy usan la misma escala que F1?

## Cambios por capa

| Capa | Archivos | Responsabilidad |
|---|---|---|
| shared/domain | `scoring.ts` | `RACE_TYPES`, escalas y `pointsFor(type, position)` |
| shared/domain | `error-catalog.ts` | `RACE_NOT_FOUND`, `RACE_NOT_FINISHED`, `DRIVER_NOT_FOUND`, `DRIVER_NOT_IN_CATEGORY` |
| shared/contracts | `race-classification.ts` | body de carga, respuesta de clasificación y resumen de carreras |
| shared/db | `races.ts` + migración | `type` (enum), `results_revision`, `results_updated_at`; unique por temporada+categoría+ronda+tipo |
| api | `features/race-results/*` | port, repositorio, servicio, mapper, rutas |
| api | `seed/*` | 5 temporadas con GP y sprints, puntos calculados con `pointsFor` |
| web | `features/race-results/*` | lista de carreras, tabla de clasificación, editor admin |
| web | `routes/races.$raceId.tsx`, `routes/admin.results.tsx` | página pública y editor |

## API

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/races?season=YYYY` | público | resumen de carreras de una temporada (con indicador de resultados) |
| GET | `/races/:id/classification` | público | carrera + clasificación con pilotos, escuderías y puntos |
| PUT | `/races/:id/classification` | fia_admin | `{ version, entries: [{ driverId }] }` en orden de llegada |

## Restricciones de base de datos

- `races.type` enum `race_type` (`grand_prix`, `sprint`), default `grand_prix`.
- `unique(season_id, category_id, round, type)` reemplaza al unique sin tipo.
- `races.results_revision >= 0`.
- `race_results.points` entre 0 y 25 (check).
- Existentes: posición única por carrera, piloto único por carrera, posición ≥ 1.

## Errores

| Acción inválida | code | status | Mensaje |
|---|---|---|---|
| Cargar sin sesión | `UNAUTHENTICATED` | 401 | (catálogo) |
| Cargar sin ser admin FIA | `FORBIDDEN` | 403 | (catálogo) |
| Clasificación vacía, piloto repetido, id inválido | `VALIDATION_FAILED` | 400 | por campo |
| Carrera inexistente | `RACE_NOT_FOUND` | 404 | La carrera no existe o fue eliminada. |
| Carrera que todavía no se corrió | `RACE_NOT_FINISHED` | 422 | Todavía no se puede cargar el resultado: la carrera no se corrió. |
| Piloto inexistente | `DRIVER_NOT_FOUND` | 404 | Uno de los pilotos elegidos no existe. |
| Piloto de otra categoría | `DRIVER_NOT_IN_CATEGORY` | 422 | Uno de los pilotos no corre en la categoría de esta carrera. |
| Otra persona guardó antes | `STALE_VERSION` | 409 | (catálogo) |

## Tests

| Tipo | Casos |
|---|---|
| Unit | escalas de puntos; service: reglas, errores, revisión |
| Contrato | 200/401/403/400/404/409/422 de las tres rutas, respuestas validadas contra el contrato |
| Fuzz | payloads arbitrarios al PUT nunca dan 5xx |
| Integración | reemplazo transaccional de la clasificación, versión y revisión, restricciones |
| Web | editor (payload exacto, preview de puntos, error 409), tabla pública, lista de carreras |
| Criterios de aceptación | "el formulario valida las entradas" → contrato 400 + validación en el editor; "rápida actualización" → la página pública refleja el cambio al volver a consultar |

## Riesgos

- Cambiar el unique de `races` requiere migración con datos existentes: el seed se regenera en demo.
- Los resultados históricos 2021–2023 son datos de demostración coherentes, no oficiales (se aclara en la doc).
