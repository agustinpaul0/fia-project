# Plan: US-3 — Filtros reutilizables transversales

- **Ítem del backlog**: US-3
- **Autor**: Argon 4 / Antigravity · **Fecha**: 2026-10-29 · **Estado**: Implementado
- **Rama**: `feat/us-3-reusable-filters`

> **Instrucciones Obligatorias para Argon 4:**
> 1. Consultar y aplicar todas las directivas de [`AGENTS.md`](../AGENTS.md): máximo 100 líneas por archivo de código, cero comentarios, tipado estricto, capas `routes → service → repository → db`, sin SQL plano.
> 2. Seguir el flujo de trabajo en [`docs/workflow.md`](../workflow.md) y [`docs/testing.md`](../testing.md).
> 3. Implementar mediante un máximo de 5 commits atómicos en Conventional Commits en español.

## Objetivo

Extraer y unificar en un módulo transversal la lógica de filtrado (por fecha o rango, año/temporada, orden por relevancia, tipo de control e identificador de escudería/piloto/evento), aplicándola de manera homogénea a Calendario, Resultados y Puntajes, Sanciones y Controles Técnicos, disponiendo en el frontend de un componente reutilizable (`DataFiltersBar`) con botón "Limpiar filtros" y estado vacío accesible ("Sin resultados").

## Descubrimiento (respuestas)

| Pregunta | Respuesta | Fuente (US, dev, PO) |
|---|---|---|
| ¿Qué rol ejecuta la acción? | Acceso transversal: funciona de forma idéntica para usuarios públicos y autenticados en todas las vistas de consulta. | US-3, PO |
| ¿Qué datos entran y salen? | Entrada: query params estándar (`from`, `to`, `season`, `teamId`, `driverId`, `sort`, `type`). Salida: colecciones filtradas y ordenadas por relevancia (eventos próximos y registros recientes primero). | US-3, US-13 |
| ¿Hay concurrencia? | Operaciones de lectura y filtrado; sin efectos colaterales de concurrencia. | ADR 0004 |
| ¿Qué se muestra en carga / vacío / error? | Carga: `StaleFade` para evitar parpadeos al tipear o cambiar fechas. Vacío: "Sin resultados que coincidan con los filtros aplicados.". Error: `ErrorState`. | UI conventions |

## Cambios por capa

| Capa | Archivos a crear/modificar | Responsabilidad |
|---|---|---|
| `shared/contracts` | `contracts/common-filters.ts` | Schemas Zod unificados de parámetros de búsqueda, rango de fechas y ordenamiento. |
| `shared/domain` | `domain/filters.ts` | Tipos y criterios de ordenación por relevancia (más recientes o próximos primero). |
| `api` | `core/db/filters.ts`, repositorios de `races`, `race-results`, `penalties`, `technical-controls` | Helpers de composición de cláusulas `where` de Drizzle para queries combinadas. |
| `web` | `components/common/DataFiltersBar.tsx`, `components/common/EmptyState.tsx`, vistas de features | Componente reutilizable con inputs de fecha, selectores, botón de reseteo rápido y mensaje unificado. |

## Restricciones de base de datos

- Uso riguroso de índices existentes (`issued_at`, `inspected_at`, `date`, `team_id`, `season_id`) para asegurar tiempos de respuesta menores a 2 segundos con datasets históricos de 5 temporadas.
- Sin concatenación de SQL plano: composición exclusiva con operadores seguros de Drizzle (`and`, `gte`, `lte`, `eq`).

## Errores

| Acción inválida | code | status | Mensaje |
|---|---|---|---|
| Rango de fechas incoherente (`from > to`) | `INVALID_DATE_RANGE` | 400 | La fecha de inicio no puede ser posterior a la fecha de fin. |
| Formato de fecha inválido | `VALIDATION_FAILED` | 400 | (errores por campo según contrato Zod) |

## Tests

| Tipo | Casos |
|---|---|
| Unit (helpers/hooks) | Composición de filtros individuales y combinados, ordenamiento por relevancia ascendente/descendente. |
| Contrato (caja negra) | Endpoints de calendario, resultados, sanciones y controles respondiendo con filtros combinados y validando rango de fechas. |
| Fuzz | Generación aleatoria de query params de fechas y strings con fast-check. |
| Integración | Verificación de tiempo de respuesta y exactitud de resultados en PostgreSQL con datos de 5 años. |
| Componentes Web | Componente `DataFiltersBar`: interacción con botón "Limpiar", sincronización con URL / estado, visualización de "Sin resultados". |

## Riesgos y decisiones

- Se extrae la lógica de filtros como un componente atómico puro en `components/common/DataFiltersBar.tsx` (< 100 líneas) para ser embebido en las distintas pantallas sin duplicación.
- Los filtros existentes de sanciones (US-13) mantienen total retrocompatibilidad funcional.

## Secuencia de Commits Atómicos (máximo 4)

1. `feat(filters): definir schemas de filtros comunes en shared contracts`
2. `feat(api): crear helper de filtros dinamicos para repositorios drizzle y tests unitarios`
3. `feat(web): implementar componente reutilizable DataFiltersBar con boton de reseteo`
4. `feat(web): integrar DataFiltersBar en calendario, resultados, sanciones y controles tecnicos`
