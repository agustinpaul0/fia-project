# Feature: resultados y puntajes de carreras

- **US relacionadas**: US-20 (carga y modificación del puntaje), base para US-9 (notificaciones) y US-5
  (resultados de los últimos años).
- **Código**: `packages/shared/src/domain/scoring.ts`, `packages/shared/src/contracts/race-classification.ts`,
  `apps/api/src/features/race-results/`, `apps/web/src/features/race-results/`
- **Plan**: [`docs/plans/US-20-race-points.md`](../../plans/US-20-race-points.md) · **ADR**: 0008

## Qué hace

La administración de la FIA carga la clasificación de una carrera eligiendo el orden de llegada de los pilotos.
El sistema calcula los puntos con la escala oficial y el resultado queda visible al instante para escuderías y
público. Una corrección reemplaza la clasificación completa y genera una nueva **revisión** de resultados, que US-9
usa para volver a notificar.

## Reglas de negocio

| Regla | Fuente |
|---|---|
| Gran Premio: 25-18-15-12-10-8-6-4-2-1 para el top 10 | PO (Naranja) |
| Sprint: 8-7-6-5-4-3-2-1 para el top 8 | PO |
| Sin punto por vuelta rápida | dev (F1 lo eliminó en 2025) |
| Se cargan posiciones; los puntos los calcula el sistema | PO |
| Sólo posiciones clasificadas (sin DNF/DSQ en el Sprint 1) | dev |
| Cada resultado guarda la escudería del piloto al momento de la carga | dev |
| No se cargan resultados de carreras que todavía no se corrieron | dev |
| Los pilotos deben pertenecer a una escudería de la categoría de la carrera | dev |
| La misma escala para F1, F2, F3 y F1 Academy | dev (pregunta abierta al PO) |
| Actualización visible en menos de 10 minutos (en la web es inmediata) | PO |

## Roles y permisos

| Acción | fia_admin | team_staff | public |
|---|---|---|---|
| Ver carreras y clasificaciones | ✓ | ✓ | ✓ |
| Ver pilotos habilitados para cargar | ✓ | ✗ (403) | ✗ (401) |
| Cargar o corregir una clasificación | ✓ | ✗ (403) | ✗ (401) |

## API

| Método | Ruta | Acceso | Body / query | Respuesta |
|---|---|---|---|---|
| GET | `/races?season=YYYY` | público | — | `RaceSummary[]` con tipo, revisión y ganador |
| GET | `/races/:id/classification` | público | — | `{ race, results[] }` ordenado por posición |
| GET | `/races/:id/drivers` | fia_admin | — | pilotos de la categoría de la carrera |
| PUT | `/races/:id/classification` | fia_admin | `{ version, entries: [{ driverId }] }` en orden de llegada | clasificación guardada (versión + 1, revisión + 1) |

## Datos

- `races.type` (`grand_prix` | `sprint`), `races.results_revision` (≥ 0). Un Gran Premio y su sprint comparten
  ronda: único `(season_id, category_id, round, type)`.
- `race_results`: posición única por carrera, piloto único por carrera, posición ≥ 1, puntos entre 0 y 25.
- La carga reemplaza la clasificación en una transacción que primero verifica la `version` de la carrera.

## Errores

| Acción inválida | code | status | Mensaje |
|---|---|---|---|
| Cargar sin sesión | `UNAUTHENTICATED` | 401 | Tenés que iniciar sesión para realizar esta acción. |
| Cargar sin ser admin FIA | `FORBIDDEN` | 403 | No tenés permisos para realizar esta acción. |
| Clasificación vacía, más de 30 pilotos, piloto repetido, id inválido, temporada inválida | `VALIDATION_FAILED` | 400 | Hay datos inválidos… (+ mensaje por campo) |
| Carrera inexistente | `RACE_NOT_FOUND` | 404 | La carrera no existe o fue eliminada. |
| Carrera que todavía no se corrió | `RACE_NOT_FINISHED` | 422 | Todavía no se puede cargar el resultado: la carrera no se corrió. |
| Piloto inexistente | `DRIVER_NOT_FOUND` | 404 | Uno de los pilotos elegidos no existe. Recargá la página y volvé a intentar. |
| Piloto de otra categoría o sin escudería | `DRIVER_NOT_IN_CATEGORY` | 422 | Uno de los pilotos elegidos no corre en la categoría de esta carrera. |
| Otra persona guardó antes | `STALE_VERSION` | 409 | Otra persona modificó este registro… (la web recarga la clasificación vigente) |

## Pantallas

- `/races/$raceId` (público): encabezado con tipo, categoría, circuito y fecha en hora argentina, y tabla de
  posiciones con piloto, escudería y puntos. Si no hay resultado: "Todavía no se cargó el resultado de esta carrera."
- `/admin/results` (admin FIA): temporada (actual y 5 anteriores) y lista de carreras con su ganador.
- `/admin/results/$raceId` (admin FIA): editor de clasificación con una fila por posición, vista previa de los
  puntos, reordenamiento, pilotos ya elegidos ocultos en las demás filas y guardado deshabilitado mientras falte
  elegir un piloto. Si la carrera no se corrió, lo informa y no muestra el editor.
