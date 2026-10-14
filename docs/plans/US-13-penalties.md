# Plan: US-13 — Cargar sanciones a pilotos o escuderías

- **Ítem del backlog**: US-13
- **Autor**: Santiago / Antigravity · **Fecha**: 2026-10-14 · **Estado**: Borrador
- **Rama**: `feat/us-13-penalties`

## Objetivo

Permitir al Personal Administrativo de la FIA (`fia_admin`) registrar sanciones oficiales aplicadas a pilotos o escuderías por incidentes en pista, infracciones horarias o técnicas, y poner a disposición de las escuderías y del público general una vista de consulta con filtros por fecha, tipo de penalización y escudería.

## Descubrimiento (respuestas)

| Pregunta | Respuesta | Fuente (US, dev, PO) |
|---|---|---|
| ¿Qué rol ejecuta la acción? | Alta: `fia_admin` autenticado. Consulta: acceso público (`publicAccess`), visible para público general, escuderías y FIA. | US-13, Grupo Naranja |
| ¿Qué campos entran/salen y con qué reglas? | Entrada: `teamId` (UUID requerido), `driverId` (UUID opcional), `raceId` (UUID opcional), `type` (enum), `penalty` (3-100 car.), `reason` (5-255 car.), `issuedAt` (ISO UTC). Salida: DTO completo enriquecido con nombres de escudería/piloto/carrera y versión. | US-13, dev |
| ¿Hay concurrencia? | Sí, campo `version` entero para concurrencia optimista en updates/bajas futuras. | ADR 0007, AGENTS.md |
| ¿Qué se muestra en carga / vacío / error? | Carga: `QueryView` con spinner. Vacío: "No hay sanciones registradas que coincidan con los filtros.". Error: banner brutalista con botón reintentar. | UI system |

## Cambios por capa

| Capa | Archivos a crear/modificar | Responsabilidad |
|---|---|---|
| `shared/contracts` | `packages/shared/src/contracts/penalties.ts`, `api-paths.ts` | Schemas Zod de penalidad (`createPenaltyBodySchema`, `penaltyListSchema`), tipos de sanción y rutas API. |
| `shared/domain` | `packages/shared/src/domain/errors/racing-errors.ts` | Códigos de error de catálogo: `PENALTY_NOT_FOUND`, `INVALID_PENALTY_TARGET`. |
| `shared/db` | `packages/shared/src/db/schema/penalties.ts`, `schema/index.ts` | Tabla `penalties` con FKs (`teamId`, `driverId`, `raceId`), `version` e índices. |
| `api` | `apps/api/src/features/penalties/*` | Port, repositorio Drizzle, repositorio in-memory, servicio de dominio, rutas GET (pública) y POST (`fia_admin`). |
| `web` | `apps/web/src/features/penalties/*`, `routes/sanctions.tsx` | Hooks React Query, tabla brutalista con filtros (año, tipo, escudería), formulario de alta con diálogo para administradores FIA, ruta `/sanctions`. |

## Restricciones de base de datos

- Claves foráneas:
  - `penalties.team_id` → `teams(id)` con `onDelete: 'cascade'`.
  - `penalties.driver_id` → `drivers(id)` con `onDelete: 'set null'`.
  - `penalties.race_id` → `races(id)` con `onDelete: 'set null'`.
- Restricciones de columnas:
  - `type`: `varchar(40)` notNull.
  - `penalty`: `varchar(100)` notNull.
  - `reason`: `varchar(255)` notNull.
  - `issued_at`: `timestamp with time zone` notNull.
  - `version`: `integer` notNull default 0.
- Índices: `penalties_team_id_idx`, `penalties_driver_id_idx`, `penalties_issued_at_idx`.

## Errores

| Acción inválida | code | status | Mensaje |
|---|---|---|---|
| Sanción no encontrada | `PENALTY_NOT_FOUND` | 404 | La sanción indicada no existe en el sistema. |
| Piloto no pertenece a la escudería | `INVALID_PENALTY_TARGET` | 400 | El piloto seleccionado no pertenece a la escudería indicada. |
| Datos con formato inválido | `VALIDATION_FAILED` | 400 | (mensajes por campo según Zod) |
| Sin sesión al intentar crear | `UNAUTHENTICATED` | 401 | Tenés que iniciar sesión para acceder a este recurso. |
| Rol no administrativo al intentar crear | `FORBIDDEN` | 403 | No tenés los permisos requeridos para acceder a este recurso. |

## Tests

| Tipo | Casos |
|---|---|
| Unit (service/hooks) | Creación de sanción a escudería, a piloto de escudería, rechazo si piloto no pertenece a la escudería. |
| Contrato (caja negra) | `GET /penalties` con 200 y filtros. `POST /penalties` con 201 (fia_admin), 400 (inválido), 401 (anónimo), 403 (team_staff/public). |
| Fuzz | Generación aleatoria con fast-check de campos y payloads de sanciones. |
| Integración | Persistencia en base de datos Drizzle/Postgres con claves foráneas. |
| Componentes Web | Formulario de carga con selector piloto condicional, tabla de nómina con filtros y estados vacíos. |

## Riesgos y decisiones

- Se utiliza el término en inglés `penalties` para el código y API (`/penalties`), manteniendo las interfaces y textos en español ("Sanciones").
- Si la sanción es a nivel escudería (ej: multa económica por infracción en boxes), `driverId` es null. Si es a piloto, `driverId` y `teamId` están ambos presentes y vinculados.
- Las consultas públicas se optimizan con índices en fecha y escudería, garantizando respuesta inmediata (< 10 minutos según criterio del PO).
