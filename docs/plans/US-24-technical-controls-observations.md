# Plan: US-24 — Visualizar resultados y observaciones de controles técnicos de los autos

- **Ítem del backlog**: US-24
- **Autor**: Argon 4 / Antigravity · **Fecha**: 2026-10-29 · **Estado**: Implementado
- **Rama**: `feat/us-24-technical-controls-observations`

> **Instrucciones Obligatorias para Argon 4:**
> 1. Consultar y aplicar todas las directivas de [`AGENTS.md`](../AGENTS.md): máximo 100 líneas por archivo de código, cero comentarios, tipado estricto, capas `routes → service → repository → db`, sin SQL plano.
> 2. Seguir el flujo de trabajo en [`docs/workflow.md`](../workflow.md) y [`docs/testing.md`](../testing.md).
> 3. Implementar mediante un máximo de 5 commits atómicos en Conventional Commits en español.

## Objetivo

Permitir al personal de las escuderías (`team_staff`) consultar en un panel privado ("Mis Autos") los controles técnicos correspondientes exclusivamente a sus vehículos, visualizando las observaciones completas (`notes`) y distinguiendo de forma destacada los dictámenes rechazados (`rejected`) para corregir anomalías previas a las competencias, asegurando que el público general solo vea el estado y dictamen pero no las observaciones internas.

## Descubrimiento (respuestas)

| Pregunta | Respuesta | Fuente (US, dev, PO) |
|---|---|---|
| ¿Qué rol ejecuta la acción? | `team_staff` autenticado para la vista privada "Mis Autos"; `fia_admin` tiene acceso total; el público solo ve dictamen sin observaciones. | US-24, PO |
| ¿Qué datos entran y salen? | Entrada: sesión autenticada con `teamId`. Salida: listado de controles de la escudería con fecha, hora, tipo, número de auto, dictamen (`passed`/`rejected`) y texto de observaciones (`notes`). | US-24, US-21 |
| ¿Hay concurrencia? | La consulta es de solo lectura con `version` presente para sincronización. | ADR 0004 |
| ¿Qué se muestra en carga / vacío / error? | Carga: `QueryView` con spinner. Vacío: "Tu escudería no posee controles técnicos registrados.". Error: banner brutalista con botón reintentar. | UI conventions |

## Cambios por capa

| Capa | Archivos a crear/modificar | Responsabilidad |
|---|---|---|
| `shared/contracts` | `contracts/technical-controls.ts` | Definir `publicTechnicalControlSchema` (sin `notes`) y `teamTechnicalControlSchema` (con `notes`). |
| `shared/domain` | `domain/errors/racing-errors.ts` | Validar errores relacionados al feature técnico. |
| `api` | `features/technical-controls/*` | Agregar método `listByTeam(teamId)` en repositorio y servicio; ruta `GET /technical-controls/mine` (`team_staff`). Censurar `notes` en `GET /technical-controls` público. |
| `web` | `features/technical-controls/*`, `routes/team.scrutineering.tsx`, `components/brand/ScrutineeringCard.tsx` | Pantalla "Mis Autos" con cards brutalistas, badges condicionales y observaciones resaltadas en rechazados. |

## Restricciones de base de datos

- La columna `notes` ya existe en `technical_controls` (tipo `text`); se valida que no exceda 500 caracteres en el formulario de la FIA.
- Índice en `(team_id, inspected_at)` para consulta óptima de la escudería.

## Errores

| Acción inválida | code | status | Mensaje |
|---|---|---|---|
| Consulta sin sesión autenticada | `UNAUTHENTICATED` | 401 | Tenés que iniciar sesión para acceder a este recurso. |
| Rol no perteneciente a escudería | `FORBIDDEN` | 403 | No tenés los permisos requeridos para acceder a este recurso. |
| Escudería sin identificador válido | `INVALID_MEMBERSHIP` | 403 | El usuario no tiene una escudería asociada. |

## Tests

| Tipo | Casos |
|---|---|
| Unit (service) | Aislamiento estricto: la escudería solo recibe controles de su `teamId`; censura de `notes` en listado público. |
| Contrato (caja negra) | `GET /technical-controls/mine` (200 con `notes`), `GET /technical-controls` público (200 sin `notes` o null). |
| Fuzz | Verificación de que parámetros en query no generen respuestas 500 ni fugas de información privada. |
| Integración | Consulta contra base de datos PostgreSQL filtrando por `team_id` y ordenando por `inspected_at` desc. |
| Componentes Web | Renderizado de vista "Mis Autos", destacados visuales en rojo/alerta para dictámenes `rejected` y visualización de notas. |

## Riesgos y decisiones

- Se implementa separación de DTOs en `shared/contracts` para garantizar a nivel de contrato que el endpoint público nunca filtre el campo `notes` al cliente web anónimo.
- Los controles rechazados usan el token visual `bg-secondary text-white` del sistema Bauhaus para visibilidad inmediata.

## Secuencia de Commits Atómicos (máximo 4)

1. `feat(tech-controls): segmentar contratos Zod publico y privado para observaciones tecnicas`
2. `feat(tech-controls): implementar query por escuderia en repositorio y servicio con tests int`
3. `feat(tech-controls): exponer endpoint GET /technical-controls/mine y censurar notas en ruta publica`
4. `feat(web): implementar vista Mis Autos con observaciones y alertas de controles rechazados`
