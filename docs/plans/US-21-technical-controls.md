# Plan: US-21 — Ingresar fechas, tipos y resultado de controles técnicos por auto

- **Ítem del backlog**: US-21
- **Autor**: Santiago / Antigravity · **Fecha**: 2026-10-14 · **Estado**: Implementado
- **Rama**: `feat/us-21-scrutineering`

## Objetivo

Permitir al Personal Administrativo de la FIA (`fia_admin`) registrar los controles técnicos realizados a los vehículos (pesaje, combustible, dimensiones, motor, seguridad o inspección post-carrera) con su dictamen final (aprobado o rechazado), y poner a disposición de las escuderías y del público general la consulta de dichos controles con filtros en tiempo real.

## Descubrimiento (respuestas)

| Pregunta | Respuesta | Fuente (US, dev, PO) |
|---|---|---|
| ¿Qué rol ejecuta la acción? | Alta/registro: `fia_admin` autenticado. Consulta: acceso público (`publicAccess`), visible para público general, escuderías y FIA. | US-21, Grupo Naranja |
| ¿Qué campos entran/salen y con qué reglas? | Entrada: `teamId` (UUID req), `driverId` (UUID opc), `carNumber` (entero 1-99 opc), `raceId` (UUID opc), `controlType` (enum: weight, fuel, dimensions, engine, safety, post_race), `status` (passed, rejected), `notes` (texto opc), `inspectedAt` (ISO UTC req), `expiresAt` (ISO UTC opc). Salida: DTO con nombres de escudería/piloto/carrera y versión. | US-21, Sprint 1 PDF |
| ¿Hay concurrencia? | Sí, campo `version` entero para concurrencia optimista en updates o bajas futuras. | ADR 0007, AGENTS.md |
| ¿Qué se muestra en carga / vacío / error? | Carga: `QueryView` con spinner. Vacío: "No hay controles técnicos registrados que coincidan con los filtros.". Error: banner brutalista con botón reintentar. | UI conventions |

## Cambios por capa

| Capa | Archivos a crear/modificar | Responsabilidad |
|---|---|---|
| `shared/contracts` | `packages/shared/src/contracts/technical-controls.ts`, `api-paths.ts` | Schemas Zod de control técnico (`createTechnicalControlBodySchema`, `technicalControlsQuerySchema`, `technicalControlListSchema`). |
| `shared/domain` | `packages/shared/src/domain/errors/racing-errors.ts` | Errores: `TECHNICAL_CONTROL_NOT_FOUND`, `INVALID_TECHNICAL_CONTROL_TARGET`. |
| `shared/db` | `packages/shared/src/db/schema/technical-controls.ts` | Tabla `technical_controls` con FKs a `teams`, `drivers`, `races`, índices y concurrencia optimista (`version`). |
| `api` | `apps/api/src/features/technical-controls/*` | Puerto, repositorio Drizzle, servicio, mapper y rutas (`GET` público, `POST` fia_admin). |
| `web` | `apps/web/src/features/technical-controls/*`, `/routes/technical-controls.tsx` | Cliente API, hooks react-query, formulario modal de alta (solo FIA), tabla de controles, filtros y página pública. |

## Restricciones de base de datos

- FK `team_id` → `teams.id` (not null, `onDelete: cascade`).
- FK `driver_id` → `drivers.id` (nullable, `onDelete: set null`).
- FK `race_id` → `races.id` (nullable, `onDelete: set null`).
- Checks de enumerados para `control_type` y `status`.
- Índices en `(team_id, inspected_at)`, `(status, inspected_at)`.
- `version` entero por concurrencia optimista.

## Errores

| Acción inválida | code | status | Mensaje |
|---|---|---|---|
| Control no encontrado | `TECHNICAL_CONTROL_NOT_FOUND` | 404 | El control técnico solicitado no existe o fue dado de baja. |
| Piloto no pertenece a la escudería | `INVALID_TECHNICAL_CONTROL_TARGET` | 400 | El piloto seleccionado no pertenece a la escudería del control técnico. |

## Tests

| Tipo | Casos |
|---|---|
| Unit (service/hooks/componentes) | Validación de objetivo, filtrado por escudería y tipo, renderizado de badges de estado (aprobado/rechazado). |
| Contrato (caja negra) | Validación de schema Zod: tipos válidos, status obligatorio, formato de fecha UTC. |
| Fuzz | Generación con fast-check de payloads aleatorios en schemas de alta y query. |
| Integración / Rutas | Rutas API: 401 unauthenticated, 403 non-admin, 201 created, 200 listado público con filtros. |
| Criterios de aceptación → test | Actualización inmediata, disponibilidad pública, campos requeridos (fecha, hora, vehículo, dictamen). |
