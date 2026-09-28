# Plan: US-9 — Confirmar notificación del puntaje recibido

- **Ítem del backlog**: US-9
- **Autor**: Agustín (con Claude Code) · **Fecha**: 2026-09-28 · **Estado**: Aprobado
- **Rama**: `feat/us-9-score-notifications`

## Objetivo

Que el personal de cada escudería se entere en la web de que se publicó o corrigió su puntaje y confirme la
recepción con un click, dejando registrado quién y cuándo para la FIA.

## Descubrimiento

| Pregunta | Respuesta | Fuente |
|---|---|---|
| Canal | Sección de notificaciones en la web; push cuando exista la app | PO |
| ¿Quién confirma? | Una persona por escudería; a los demás se les avisa que ya no hace falta | PO |
| Auditoría | Quién y cuándo, visible para la FIA | PO |
| ¿Re-notificar si cambia el puntaje? | Sí, por cada revisión nueva | PO (US-20) |
| ¿Qué escuderías reciben? | Las que tienen resultados en esa carrera | dev |
| ¿Revisiones viejas? | Sólo se muestra y confirma la vigente | dev |
| "Menos de un minuto" | La web consulta cada 30 s | dev |

## Cambios por capa

| Capa | Archivos |
|---|---|
| shared | `domain/errors/notification-errors.ts`, `contracts/notifications.ts`, `db/schema/score-notifications.ts` + migración |
| api | `features/notifications/*` (port, sync/read/write repositories, service, mapper, routes) |
| web | `features/notifications/*`, guard genérico `RequireRole`, rutas `/notifications` y `/admin/notifications` |

## Errores

Ver la tabla de `docs/features/notifications/README.md`.

## Tests

Unit (servicio: pertenencia, ya confirmada, revisión vieja, sin escudería, carrera entre dos confirmaciones),
contrato y fuzz (rutas), integración (sincronización idempotente, revisión vigente, puntos sumados, confirmación
única, check de la base) y web (bandeja, confirmación, 409, auditoría, contador, guard).

## Riesgos

- La sincronización corre en cada consulta: con el volumen del proyecto es barata; si creciera, se pasaría a
  generar las notificaciones al publicar el resultado.
