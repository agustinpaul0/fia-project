---
name: finish-task
description: Use when a task in the fia-project repo seems done, BEFORE claiming completion, committing the final changes or opening a PR. Walks the Definition of Done, runs the full verification suite, updates docs and the backlog, and prepares the PR.
---

# finish-task — cerrar una tarea en fia-project

No declares la tarea terminada hasta que **todos** los ítems estén verificados con evidencia (salida de
comandos), no con suposiciones. Usá también la skill `verification-before-completion`.

## 1. Código

- [ ] Ningún archivo de código supera 100 líneas; cada archivo tiene una sola responsabilidad.
- [ ] Cero comentarios (salvo un *por qué* imposible de expresar en código, en español).
- [ ] Sin `any`, `!`, `as` injustificados; tipos de retorno explícitos en exports.
- [ ] Capas respetadas: `routes → service → repository → db`; sin SQL plano.
- [ ] Toda ruta nueva declara `publicAccess` o `requireRole(...)`.
- [ ] Tablas mutables nuevas con `version`; updates/deletes filtran por versión.

## 2. Errores

- [ ] Cada acción inválida está en el catálogo con mensaje claro en español.
- [ ] Tabla *acción inválida → code → status → mensaje* en `docs/features/<feature>/README.md`.
- [ ] Un test por fila (contrato en back, componente en front). El fuzz no produce 5xx.

## 3. Tests y gates

Corré y mostrá la salida de:

```bash
docker compose up -d db-test
pnpm verify
```

- [ ] Unit, contrato, fuzz, integración (si tocó repositorio/schema) en verde.
- [ ] Cobertura ≥ 90% líneas/funciones/statements y ≥ 85% branches.
- [ ] Mutación ≥ 70% en cada paquete.
- [ ] Si se arregló un bug: test `regression: …` que fallaba antes del fix.

## 4. Documentación

- [ ] `docs/features/<feature>/README.md` refleja el comportamiento vigente.
- [ ] ADR nuevo si hubo una decisión de arquitectura (`docs/templates/adr.md`).
- [ ] `.env.example`, seed y README actualizados si cambió la configuración o los datos base.
- [ ] Migración generada con nombre descriptivo si cambió el schema.

## 5. Backlog y PR

- [ ] `BACKLOG.md`: tareas tildadas, **horas reales** cargadas, criterios de aceptación tildados, estado
      `En revisión`, link al PR.
- [ ] Commits en Conventional Commits (español, scope = feature, footer `Refs: <ID>`).
- [ ] PR a `develop` con la plantilla completa (`.github/pull_request_template.md`).
