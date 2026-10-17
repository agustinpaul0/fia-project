# Plan: respuestas del PO a las consultas de QA del Sprint 2 (US-10, US-13, US-21)

- **Ítem del backlog**: US-10, US-13 (ajustes por respuestas del PO)
- **Autor**: Agustín / Claude · **Fecha**: 2026-10-17 · **Estado**: Aprobado (Agustín: "hacé todo lo que dijeron")
- **Rama**: `feat/po-respuestas-sprint-2`

## Objetivo

Aplicar las respuestas del Grupo Naranja a las consultas P1–P5 que dejó la QA del Sprint 2.

## Descubrimiento (respuestas)

| Pregunta | Respuesta | Fuente |
|---|---|---|
| P1 ¿Formato de la licencia? | Sin formato oficial; sólo letras, números y guiones, y única por piloto | PO |
| P2 ¿Dorsal repetido entre categorías? | Sí, se puede repetir en categorías distintas | PO |
| P3 ¿Foto del piloto? | Queda para US-22 | PO |
| P4 ¿Datos de la sanción? | Categoría, escudería, piloto (opcional), tipo, sanción, motivo, carrera (opcional) y fecha | PO |
| P5 ¿Vigencia del control? | Se muestra hasta que vence (ya implementado) | PO |

## Cambios por capa

| Capa | Cambio |
|---|---|
| shared/contracts | Licencia con regex `^[A-Za-z0-9-]+$`. Sanción con `categoryCode`. `teamRaceOptionSchema` |
| shared/domain | `LICENSE_ALREADY_TAKEN` (409) |
| shared/db | `drivers.category_id` (FK, backfill desde la escudería), `unique(category_id, number)` en lugar de `unique(number)`, `unique(license)` y `check` de formato |
| api | Dorsal repetido por categoría en team-drivers. `GET /teams/:id/races?season=` (fia_admin). Sanciones con categoría |
| web | Formulario de sanción con fecha y carrera (opcional); listado con categoría |

## Tests

Contrato (regex de licencia), integración (dorsal repetido en otra categoría permitido y en la misma rechazado; licencia repetida ⇒ 409; carreras de la escudería; categoría en sanciones), fuzz de la ruta nueva y UI del formulario.
