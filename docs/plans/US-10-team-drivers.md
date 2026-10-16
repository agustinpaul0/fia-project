# Plan: US-10 — Cargar la información de los pilotos titulares y suplentes

- **Ítem del backlog**: US-10
- **Autor**: Santiago / Antigravity · **Fecha**: 2026-10-14 · **Estado**: Implementado
- **Rama**: `feat/us-10-team-drivers`

## Objetivo

Permitir al personal de las escuderías (`team_staff`) registrar e inscribir a los pilotos oficiales de su equipo (titulares y suplentes) con sus datos obligatorios (nombre, apellido, nacionalidad, número de coche único en la categoría, licencia deportiva y foto/documento), asegurando aislamiento estricto por escudería y validaciones reglamentarias de concurrencia e integridad.

## Descubrimiento (respuestas)

| Pregunta | Respuesta | Fuente |
|---|---|---|
| ¿Qué rol ejecuta la acción? | Personal de escudería (`team_staff`) autenticado con su `teamId`. No puede operar sobre escuderías ajenas. | US-10, ADR 0007 |
| ¿Qué datos ingresan? | `firstName`, `lastName`, `nationality`, `carNumber` (entero 1–99), `licenseNumber` (alfanumérico único), `status` (`main` / `reserve`), `photoUrl` (opcional). | US-10, dev |
| ¿Qué restricciones hay en la base? | `unique(category_id, car_number)` (número único por categoría). Clave foránea `team_id` y `category_id`. Versionado para concurrencia optimista (`version`). | Schema / US-10 |
| ¿Qué acciones inválidas existen? | Número de auto repetido en categoría, intento de alta sin ser de la escudería, cupo máximo superado (2 titulares, 2 suplentes). | US-10, PO |
| ¿Estados de UI? | Carga con skeleton, vacío ("No hay pilotos inscriptos"), error inline por campo (`react-hook-form` + Zod). | ADR 0006, ui convention |

## Cambios por capa

| Capa | Archivos a crear/modificar | Responsabilidad |
|---|---|---|
| `shared/contracts` | `contracts/team-drivers.ts` | Schemas Zod de alta y nómina de pilotos por escudería. |
| `shared/domain` | `domain/errors/error-catalog.ts` | Errores `CAR_NUMBER_ALREADY_TAKEN`, `DRIVER_LIMIT_EXCEEDED`. |
| `shared/db` | `db/schema/drivers.ts`, `schema/index.ts` | Extensión de tabla `drivers` con `licenseNumber`, `status` y constraints. Migración Drizzle. |
| `api` | `features/team-drivers/*` | Port, repositorio, servicio con validaciones de pertenencia y cupos, rutas `POST` y `GET /teams/mine/drivers`. |
| `web` | `features/team-drivers/*`, `routes/team.drivers.tsx` | Formulario de inscripción, tabla de nómina oficial y diálogo de alta. |

## Restricciones de base de datos

- `drivers.car_number` único por categoría: `uniqueIndex('drivers_category_car_number_idx').on(drivers.categoryId, drivers.carNumber)`.
- `drivers.status` enum (`main`, `reserve`).
- `drivers.version` entero not null default 0 (concurrencia optimista).
- `team_id` FK a `teams(id)` con `onDelete: cascade`.

## Errores

| Acción inválida | code | status | Mensaje |
|---|---|---|---|
| Número de coche duplicado en categoría | `CAR_NUMBER_ALREADY_TAKEN` | 409 | El número de auto ya está asignado a otro piloto en esta categoría. |
| Supera el límite de titulares o suplentes | `DRIVER_LIMIT_EXCEEDED` | 422 | Se alcanzó el límite reglamentario de pilotos para esta condición. |
| Operar sobre otra escudería | `FORBIDDEN` | 403 | No tenés permisos para gestionar los pilotos de otra escudería. |
| Datos obligatorios faltantes | `VALIDATION_FAILED` | 400 | (errores por campo) |

## Tests

| Tipo | Casos |
|---|---|
| Unit (service/hooks) | Aislamiento por `teamId`, validación de unicidad de dorsal y límites de titulares/suplentes. |
| Contrato (caja negra) | `POST /teams/mine/drivers` (201, 400, 409, 422, 401, 403) con respuestas validadas contra contrato. |
| Fuzz | Payloads inválidos al alta no provocan excepciones no controladas. |
| Integración | Persistencia en base de datos PostgreSQL, verificación de constraints e índices únicos. |
| Componentes Web | Formulario de inscripción con validaciones en vivo, selector titular/suplente y visualización de la nómina. |

## Riesgos y decisiones

- La tabla `drivers` base fue creada en T-2 para el seed; se genera una migración para agregar las columnas faltantes (`licenseNumber`, `status`) asegurando compatibilidad con los datos existentes.
