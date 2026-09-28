# Dudas para el PO (Grupo Naranja)

Registro único de las consultas al Grupo Naranja. Las respuestas se copian al ítem correspondiente de
[`BACKLOG.md`](../BACKLOG.md) y, si cambian una regla, a `docs/features/<feature>/README.md`.

## Pendientes

| # | US | Pregunta | Propuesta del equipo (lo implementado hoy) |
|---|---|---|---|
| 1 | US-20 | ¿F2, F3 y F1 Academy usan la misma escala de puntos que F1? | Misma escala para todas las categorías. |
| 2 | US-20 | ¿Hace falta registrar abandonos y descalificaciones (DNF/DSQ) o alcanza con los clasificados? | Sólo clasificados en el Sprint 1. |
| 3 | US-23 | ¿La baja de una cuenta es definitiva? ¿Se pueden reutilizar su email y su legajo? | Baja definitiva; email y legajo no se reutilizan. |
| 4 | US-23 | ¿El cargo es texto libre o una lista cerrada? | Texto libre (2 a 60 caracteres). |
| 5 | US-23 | ¿El teléfono es obligatorio? | Obligatorio, con validación flexible. |
| 6 | US-23 | ¿Se puede cambiar de escudería a una cuenta activa? | Sí; las confirmaciones pasadas conservan la escudería original. |
| 7 | US-23 | ¿El listado de la FIA muestra también las cuentas dadas de baja? | Sí, marcadas como inactivas. |
| 8 | US-23 | ¿La contraseña inicial se entrega por fuera del sistema hasta que exista la recuperación por email (US-26)? | Sí, la entrega la FIA por un canal externo. |
| 9 | US-9 | ¿Notificamos sólo a las escuderías con resultados en esa carrera, o a todas las de la categoría? | Sólo a las que tienen resultados. |

## Respondidas

| # | US | Pregunta | Respuesta del PO |
|---|---|---|---|
| R1 | — | ¿Login básico o incluir US-4 en el sprint? | Login básico (habilitador T-1). |
| R2 | US-20 | Sistema de puntos | F1: 25-18-15-12-10-8-6-4-2-1; Sprint: 8-7-6-5-4-3-2-1 (top 8). |
| R3 | US-20 | ¿Se cargan posiciones o puntos? | Posiciones; el sistema calcula los puntos. |
| R4 | US-20 | "Rápida actualización" | Menos de 10 minutos. |
| R5 | US-20 | ¿Re-notificar si cambia un puntaje ya notificado? | Sí. |
| R6 | US-9 | Canal de notificación | Apartado de notificaciones en el sistema; push cuando exista la app. |
| R7 | US-9 | ¿Quién confirma? | Una persona por escudería; si ya está confirmado, se avisa que no hace falta. |
| R8 | US-9 | Registro | Quién confirmó y cuándo, visible para la FIA. |
| R9 | US-23 | Datos de la cuenta | Nombre, apellido, email, cargo, escudería, teléfono y legajo; una sola escudería. |
| R10 | US-23 | Eliminar | Baja lógica, no borrado definitivo. |
| R11 | US-23 | Contraseña inicial | La define el administrador. |
| R12 | US-5 | "Últimos años" | Los últimos 5. |
| R13 | US-5 | Origen de los datos históricos | Los carga el equipo implementador. |
| R14 | US-5 | "Carga rápida" | Menos de 10 minutos. |
