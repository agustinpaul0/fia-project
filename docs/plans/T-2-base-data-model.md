# Plan: T-2 — Modelo de datos base y seed

- **Ítem del backlog**: T-2 (habilitador técnico)
- **Autor**: Agustín / Antigravity · **Fecha**: 2026-09-23 · **Estado**: Aprobado
- **Rama**: `feat/t-2-base-data-model`

## Objetivo

Implementar las entidades base del modelo de datos de la FIA (temporadas, circuitos, escuderías, pilotos, carreras y resultados) con todas las restricciones relacionales y de integridad en Drizzle/Postgres, concurrencia optimista (`version`), contratos compartidos y un seed completo con al menos 2 temporadas pasadas de F1 para la demo y el soporte de US-5 y US-20.

## Descubrimiento (respuestas)

| Pregunta | Respuesta | Fuente |
|---|---|---|
| ¿Qué rol ejecuta la acción? | `public` puede consultar resultados, calendario, escuderías y pilotos. Solo `fia_admin` y `team_staff` pueden modificarlos según las US correspondientes. | ADR 0002, BACKLOG.md |
| ¿Qué campos entran/salen y con qué reglas? | `seasons` (año único, nombre), `circuits` (nombre, país, ciudad, longitud), `teams` (nombre único, país, categoría), `drivers` (nombre, código único de 3 letras, número 1-99, país, escudería, rol titular/suplente), `races` (temporada, categoría, circuito, fecha, ronda), `race_results` (carrera, piloto, escudería, posición >= 1, puntos >= 0). | T-2, US-5, US-20, US-10 |
| ¿Hay concurrencia? | Sí, todas las entidades son mutables y aplican concurrencia optimista (`versionedColumns` y `versionedChecks`). | ADR 0004 |
| ¿Qué se muestra en carga / vacío / error? | En web: vistas con `QueryView` o estados vacíos claros cuando no hay datos. | ADR 0006 |

## Cambios por capa

| Capa | Archivos a crear/modificar | Responsabilidad |
|---|---|---|
| `shared/contracts` | `contracts/seasons.ts`, `circuits.ts`, `teams.ts`, `drivers.ts`, `races.ts`, `race-results.ts` | Schemas Zod y tipos inferidos para cada entidad. |
| `shared/db` | `db/schema/seasons.ts`, `circuits.ts`, `teams.ts`, `drivers.ts`, `races.ts`, `race-results.ts`, `index.ts` | Tablas Drizzle con checks, foreign keys con `onDelete`, uniques y columnas de versión. |
| `shared/migrations` | Migración SQL generada con `pnpm db:generate --name create_base_data_model`. | Definición DDL en PostgreSQL. |
| `api` | `seed/base-data.seed.ts`, `seed/run-seed.ts` | Seed idempotente con 2 temporadas de F1 (2024, 2025) y 2026 con carreras y resultados reales. |

## Restricciones de base de datos

- `seasons`: `year` único, check `year >= 1950 AND year <= 2100`.
- `circuits`: `name` no nulo, `length_km > 0`.
- `teams`: `name` único, FK `category_id` references `categories(id) on delete restrict`.
- `drivers`: `code` formato `^[A-Z]{3}$` único, `number` check `number >= 1 AND number <= 99`, FK `team_id` references `teams(id) on delete set null`, check `role IN ('main', 'reserve')`.
- `races`: unique `(season_id, category_id, round)`, FKs a season, category y circuit.
- `race_results`: unique `(race_id, position)`, unique `(race_id, driver_id)`, check `position >= 1`, check `points >= 0`, FK `race_id on delete cascade`, FKs a driver y team `on delete restrict`.

## Errores

| Acción inválida | code | status | Mensaje |
|---|---|---|---|
| Puesto o piloto duplicado en carrera | `RACE_RESULT_ALREADY_EXISTS` | 409 | Ya existe un resultado para esa posición o piloto en esta carrera. |
| Número de piloto repetido | `DRIVER_NUMBER_ALREADY_EXISTS` | 409 | Ya existe un piloto con ese número. |
| Código de piloto repetido | `DRIVER_CODE_ALREADY_EXISTS` | 409 | Ya existe un piloto con ese código de tres letras. |

## Tests

| Tipo | Casos |
|---|---|
| Unit (contracts) | Validación de schemas Zod para cada entidad (código de piloto, año de temporada, posición positiva, puntos >= 0). |
| Tipos | Tests `*.test-d.ts` asegurando paridad entre tablas Drizzle y contratos Zod. |
| Seed | Test que verifica la carga exitosa e idempotente del seed histórico. |
