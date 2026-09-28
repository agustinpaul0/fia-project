# 0008 — Revisiones de resultados como base de las notificaciones

- **Estado**: Aceptado (2026-09-28)

## Contexto

US-20 permite cargar y corregir la clasificación de una carrera. El PO pidió que, si se modifica un puntaje ya
notificado, se vuelva a notificar a las escuderías (US-9). US-20 y US-9 se implementan por separado y no conviene
que la carga de resultados dependa del sistema de notificaciones.

## Decisión

- Cada carrera tiene `results_revision` (entero ≥ 0). Cada carga o corrección exitosa lo incrementa en la misma
  transacción que reemplaza la clasificación y sube la `version` de la carrera.
- US-9 genera sus notificaciones a partir de la revisión: una notificación por escudería y por
  `(carrera, revisión)`. Una revisión nueva es un puntaje nuevo que hay que confirmar.
- La clasificación se reemplaza completa (no se editan posiciones sueltas), con concurrencia optimista sobre la
  `version` de la carrera.

## Alternativas descartadas

- Notificar directo desde el servicio de US-20: acopla dos features y obliga a hacer ambas a la vez.
- Comparar la clasificación anterior con la nueva para detectar cambios: más complejo y no aporta al PO, que pidió
  re-notificar ante cualquier modificación.

## Consecuencias

- US-9 puede construirse sobre un dato simple y auditable ("revisión N de la carrera X").
- Guardar la misma clasificación dos veces genera una revisión nueva: se acepta, porque el admin lo hizo a propósito.
