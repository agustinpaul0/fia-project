# Cómo documentar

La documentación vive en el repo, en Markdown y en español, y se actualiza **en el mismo PR** que el código.
Si el código y la doc se contradicen, el PR no está terminado.

## Qué va dónde

| Querés registrar… | Archivo | Plantilla |
|---|---|---|
| Reglas que todo agente/dev debe cumplir | `AGENTS.md` (resumen) + `docs/conventions/*.md` (detalle) | — |
| Cómo levantar el proyecto | `README.md` | — |
| Cómo está armado el sistema | `docs/architecture.md` | — |
| Cómo se trabaja (flujo, git, tests, DoD) | `docs/workflow.md`, `docs/git.md`, `docs/testing.md`, `docs/definition-of-done.md` | — |
| Comportamiento vigente de un feature | `docs/features/<feature>/README.md` | `templates/feature.md` |
| Una decisión de arquitectura | `docs/adr/NNNN-titulo.md` (+ fila en `docs/adr/README.md`) | `templates/adr.md` |
| El plan de una tarea | `docs/plans/<ID>-<slug>.md` | `templates/plan.md` |
| Estado de las tareas | `BACKLOG.md` | — |
| Dudas para el PO y sus respuestas | `docs/preguntas-po.md` | — |
| Specs del PO | `docs/specs/` (PDFs originales, no se editan) | — |

## Crear la documentación de un feature nuevo

1. `mkdir docs/features/<feature>` (kebab-case, mismo nombre que la carpeta del código).
2. Copiá `docs/templates/feature.md` a `docs/features/<feature>/README.md` y completalo.
3. Si el feature crece, agregá archivos al lado (`api.md`, `pantallas.md`) y enlazalos desde el README.
4. Agregá el feature al índice de abajo.

## Estilo

- Español rioplatense neutro, frases cortas, en presente ("la API responde 409", no "respondería").
- Tablas para reglas, permisos y errores; bloques de código para comandos y ejemplos.
- Links relativos entre documentos. Nada de capturas de pantalla para cosas que se pueden escribir.
- Lo que el código ya dice (nombres de funciones, parámetros) no se repite en la doc: se describe el *qué* y el
  *por qué*.

## Índice de features

| Feature | Doc | US |
|---|---|---|
| Salud del sistema | [`features/health`](features/health/README.md) | — |
| Categorías | [`features/categories`](features/categories/README.md) | T-2 (referencia) |
| Resultados y puntajes de carreras | [`features/race-results`](features/race-results/README.md) | US-20 |
| Notificaciones de puntaje | [`features/notifications`](features/notifications/README.md) | US-9 |
