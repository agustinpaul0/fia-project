# Feature: filtros comunes de listados

- **US relacionadas**: US-3 (Sprint 3). Base de los filtros de US-16 (sanciones) y US-24 (controles).
- **Código**:
  - `packages/shared/src/contracts/common-filters.ts` (campos y validación de rango),
    `packages/shared/src/domain/date-filters.ts` y `domain/filters.ts` (criterios y relevancia en memoria)
  - `apps/api/src/core/db/filter-conditions.ts` (condiciones y orden con el query builder de Drizzle)
  - `apps/web/src/components/common/use-common-filters.ts`, `data-filters-bar.tsx`, `data-filters-fields.tsx`,
    `identifier-filters.tsx` (escudería y piloto sobre el listado)

## Qué hace

Una sola lógica de filtros para calendario, resultados, sanciones y controles técnicos:

| Listado | Fecha/rango | Año | Tipo | Identificador | Orden | Dónde se filtra |
|---|---|---|---|---|---|---|
| Sanciones (`/sanctions`) | ✓ | ✓ (arranca en la actual) | tipo de sanción | escudería y piloto | ✓ | servidor (fecha, año, tipo, orden) + listado (escudería, piloto) |
| Controles técnicos (`/scrutineering`) | ✓ | ✓ | tipo de control y dictamen | escudería y piloto | ✓ | servidor (fecha, año, tipo, orden) + listado (escudería, piloto) |
| Calendario (carreras de la temporada) | ✓ | selector de temporada | — | evento (nombre o circuito) | ✓ | cliente (`applyClientFilters`) |
| Resultados (campeonato) | — | selector de temporada | — | piloto o escudería | posición | cliente |

## Reglas

- Los días elegidos se interpretan en hora de Buenos Aires (00:00 a 23:59:59.999) y viajan en UTC.
- `from > to` ⇒ la web avisa "La fecha de inicio no puede ser posterior a la fecha de fin." y no lo envía;
  la API responde `VALIDATION_FAILED` (400) con ese mensaje en el campo `to`.
- Relevancia: en sanciones y controles, lo más reciente primero; en el calendario, el evento más cercano a hoy
  primero (próximos o recientes). También se puede ordenar por "Más recientes" o "Más antiguos".
- Los filtros se combinan y se limpian todos con el botón "Limpiar filtros". Sin coincidencias ⇒ "Sin resultados.".
- Funcionan igual con o sin sesión (los endpoints de consulta son públicos).
- Rendimiento: `filters-performance.int.test.ts` carga 5 años de sanciones y controles y verifica que cada
  consulta, sola o combinada, responde en menos de 2 s.
