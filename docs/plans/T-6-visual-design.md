# Plan: T-6 — Diseño visual del Sprint 1 (mocks de Google Stitch)

- **Ítem del backlog**: T-6
- **Autor**: Agustín (asistido por Claude Code) · **Fecha**: 2026-10-03 · **Estado**: Aprobado
- **Rama**: `develop` (commit único pedido por el dev para cerrar el sprint)

## Objetivo

Replicar los 9 mocks de Google Stitch (estilo Bauhaus neo-brutalista) en las pantallas del Sprint 1 para la demo
del 06/10, sin cambiar reglas de negocio ni mostrar datos inventados.

## Descubrimiento (respuestas)

| Pregunta | Respuesta | Fuente |
|---|---|---|
| ¿Qué hacer con el contenido de relleno de los mocks (telemetría, PDF, vuelta rápida…)? | Visual fiel, sólo datos reales: lo calculable se calcula, lo inventado se omite. | dev |
| ¿Un encabezado por pantalla como en los mocks? | No: un único encabezado (el de Portada/Resultados) con ítems por rol. | dev |
| ¿Las categorías de la portada son clickeables? | Sí, llevan a los resultados de esa categoría. | dev |
| Transiciones | Sin parpadeos al navegar ni al cambiar de temporada; cursor de mano en todo botón. | dev |
| Preguntas abiertas de US-20/US-23/US-9 | Ratificadas por el PO el 2026-10-03. | PO |

**Preguntas abiertas para el PO**: ninguna.

## Cambios por capa

| Capa | Archivos | Responsabilidad |
|---|---|---|
| shared/contracts | `race-classification.ts`, `api-paths.ts` | `category` opcional (código) en la query de temporada |
| api | `race-results.read.repository.ts`, `race-results.standings.repository.ts`, `port`, `service`, `routes` | filtrar calendario y campeonato por categoría |
| web/styles | `styles/theme-bauhaus.css`, `theme-light.css`, `theme-inline.css`, `base.css`, `transitions.css` | tokens, fuentes, cursor, transiciones de vista |
| web/brand | `components/brand/*`, `components/common/page-query-view.tsx`, `stale-fade.tsx`, `components/ui/*` | encabezado, pie, logo, estados, variantes |
| web/features | pantallas de `categories`, `auth`, `race-results`, `team-staff`, `notifications` | portar los mocks |
| web/lógica pura | `season-summary.ts`, `editor-summary.ts`, `staff-roster.ts`, `audit-log.ts`, `team-color.ts`, `category-order.ts` | métricas, filtros, etiquetas |

## Restricciones de base de datos

Sin cambios de schema ni migraciones.

## Errores

| Acción inválida | code | status | Mensaje |
|---|---|---|---|
| `category` con formato inválido en `/races` o `/races/standings` | `VALIDATION_FAILED` | 400 | La categoría no es válida. |

## Tests

| Tipo | Casos |
|---|---|
| Unit | lógica pura de métricas, filtros, etiquetas, colores de escudería y orden de categorías |
| Componentes | portada clickeable, login con mostrar/ocultar contraseña, resultados (métricas, chips, tabla completa), clasificación (estados y distribución), editor (totales y cancelar), personal (búsqueda y filtros), bandeja y auditoría (filtros y totales), navegación por rol |
| Contrato | `category` válida e inválida; rutas con y sin categoría |
| Integración | repositorio filtrando calendario y resultados por categoría |
| Visual | capturas a ancho de cada mock y a 390 px sin scroll horizontal |

## Riesgos y decisiones

- [ADR 0009](../adr/0009-sistema-visual.md): tokens con los nombres de Stitch, fuentes self-hosted, íconos con
  lucide y regla de "sólo datos reales".
- Material Symbols descartado por peso (~4 MB); los íconos de lucide son equivalentes.
