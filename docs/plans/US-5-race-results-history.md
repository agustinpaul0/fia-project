# Plan: US-5 — Ver resultados de carreras de los últimos años

- **Ítem del backlog**: US-5
- **Autor**: Agustín (con Claude Code) · **Fecha**: 2026-09-28 · **Estado**: Aprobado
- **Rama**: `feat/us-5-race-results-history`

## Objetivo

Que cualquier persona (sin iniciar sesión) consulte de forma clara y ordenada los resultados de las últimas 5
temporadas: el campeonato de pilotos de cada año y el resultado de cada carrera.

## Descubrimiento

| Pregunta | Respuesta | Fuente |
|---|---|---|
| ¿Cuántos años? | Los últimos 5 (2021–2025) más la temporada en curso | PO |
| ¿De dónde salen los datos? | Los carga el equipo (seed de US-20) | PO |
| "Carga rápida" | Menos de 10 minutos; en la web la respuesta es inmediata | PO |
| ¿Quién puede verlo? | Todos, sin sesión | US ("Como Usuario") |
| ¿Qué se muestra? | Campeonato de pilotos (puntos y victorias) y la lista de carreras con su ganador, con acceso al detalle | dev |

## Cambios por capa

| Capa | Archivos |
|---|---|
| shared | `driverStandingSchema`, `seasonStandingsPath` |
| api | `race-results.standings.ts` (agregación pura), `race-results.standings.repository.ts`, ruta `GET /races/standings` |
| web | `SeasonResultsView`, `StandingsTable`, `useSeasonSelection`, ruta `/results`, `MainNav` |

## Rendimiento

Las consultas filtran por temporada a través de `seasons.year` (índice único) y `races.season_id` (primera columna
del índice único de carreras); los resultados se buscan por `race_id` (primera columna del índice único de
posiciones). No hace falta ningún índice nuevo con este volumen de datos.

## Tests

Unit (agregación del campeonato con desempates), contrato (público, validación de temporada), integración
(resultados de la temporada) y web (campeonato, carreras, cambio de temporada, estados vacíos, navegación).
