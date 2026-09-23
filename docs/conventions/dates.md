# Fechas y zonas horarias

| Capa | Regla |
|---|---|
| Base de datos | `timestamp with time zone` (instante absoluto). Columnas de fecha pura con `date`. |
| API | ISO 8601 en UTC: `2026-10-06T18:00:00.000Z`. Nunca horas "locales" sin zona. |
| Web | Se muestra en `America/Argentina/Buenos_Aires` con `formatDateTime` / `formatDate` (`lib/format-date-time.ts`). |

- Se usa el nombre IANA de la zona, no un offset fijo `UTC-3`: si Argentina cambia de horario, se ajusta solo.
- Para eventos en circuitos del exterior se podrá mostrar además la hora local del circuito (decisión de la US
  correspondiente; guardar la zona IANA del circuito en su tabla).
- Formato `es-AR` de 24 horas. Nunca se formatean fechas a mano con `getHours()` y concatenaciones.
