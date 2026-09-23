# Flujo de trabajo

Cómo se encara **cualquier** tarea, sea con Claude Code, OpenCode, Antigravity o a mano. El flujo es el mismo
para todos; las skills `start-task` y `finish-task` lo automatizan.

```
Backlog → Descubrimiento → Plan aprobado → Rama → TDD → Gates → Docs → PR → Review → Merge → Backlog
```

## 1. Tomar un ítem del backlog

1. Abrí [`BACKLOG.md`](../BACKLOG.md) y elegí un ítem `Pendiente` del sprint actual cuyas dependencias estén
   `Hecho`.
2. Pasalo a `En progreso`, poné tu nombre como dueño y la fecha de inicio. Commit `docs(backlog): …`.
3. Si la tarea no está en el backlog, **se agrega primero** (con ID, descripción y criterios). No se programa nada
   que no esté registrado.

## 2. Descubrimiento: preguntas obligatorias

Antes de planificar, el agente le hace al dev (y el dev se hace) estas preguntas. Lo que no tenga respuesta en
la US, en `docs/features/` o en `docs/specs/` **se pregunta, no se inventa**.

**Actores y permisos**
- ¿Qué rol ejecuta la acción (`fia_admin`, `team_staff`, `public`)? ¿Qué pasa si la intenta otro rol?
- ¿Hay restricción de pertenencia (p. ej. una escudería sólo ve/edita lo suyo)?

**Datos**
- ¿Qué datos entran? Para cada campo: tipo, obligatorio/opcional, largo, formato, rango, unicidad.
- ¿Qué datos salen y quién puede verlos? ¿Hay campos que no deben filtrarse?
- ¿Qué restricciones puede garantizar la base (unique, check, FK)? ¿Qué pasa al borrar algo referenciado?

**Comportamiento**
- ¿Cuál es el camino feliz paso a paso? ¿Qué se ve en pantalla en cada paso?
- ¿Qué acciones inválidas existen? Para cada una: código de error, status HTTP y mensaje al usuario.
- ¿Puede haber dos personas editando lo mismo? (⇒ concurrencia optimista con `version`).
- Estados de UI: ¿qué se muestra mientras carga, si está vacío y si falla?
- ¿Hay fechas? ¿Se muestran en hora argentina o en la hora local del circuito?

**Aceptación y dependencias**
- ¿Cuáles son los criterios de aceptación **medibles** (no "rápido", sino "en menos de 1 s con 500 filas")?
- ¿Depende de otra US o habilitador? ¿Rompe algo existente?

**Qué se escala al PO (Grupo Naranja)**: ambigüedades de negocio, criterios de aceptación no medibles, reglas
que contradicen otra US, cambios de alcance. Se anotan en la sección "Preguntas abiertas" del ítem en
`BACKLOG.md` y se consultan en la daily o por el canal acordado. **Lo técnico lo decide el equipo** (y si es una
decisión de arquitectura, va en un ADR).

## 3. Plan

1. Copiá [`docs/templates/plan.md`](templates/plan.md) a `docs/plans/<ID>-<slug>.md` (p. ej.
   `docs/plans/US-20-race-points.md`).
2. Completá: objetivo, respuestas del descubrimiento, cambios por capa (shared → api → web), tabla de errores,
   tests que se van a escribir, riesgos.
3. El dev aprueba el plan **antes** de escribir código. Si el agente es quien planifica, se detiene y espera.

## 4. Rama

Desde `develop` actualizado: `git switch develop && git pull && git switch -c feat/us-20-race-points`.
Nombres y reglas en [`git.md`](git.md).

## 5. Implementación con TDD (orden recomendado)

1. **Contratos** en `packages/shared/src/contracts/<feature>.ts` + tests (válidos, inválidos con mensaje exacto,
   fuzz).
2. **Errores** nuevos en el catálogo (`packages/shared/src/domain/errors/error-catalog.ts`).
3. **Schema** en `packages/shared/src/db/schema/<feature>.ts` con todas las restricciones + test de tipos
   (`*.test-d.ts`) + `pnpm db:generate --name <descripcion>`.
4. **Repositorio** (port + implementación Drizzle + fake en memoria en `testing/`) + test de integración.
5. **Service** con tests unitarios usando el fake (reglas, permisos, versión).
6. **Rutas** con tests de contrato (caja negra) y fuzz.
7. **Web**: `api/` → `hooks/` → `components/` del feature, con tests de componente.

Ciclo por comportamiento: test que falla → código mínimo → refactor. Detalle en [`testing.md`](testing.md).

## 6. Gates

| Momento | Qué correr | Automático |
|---|---|---|
| Mientras programás | `pnpm test:watch` | — |
| `git commit` | bloqueo de `.env`, Biome (incluye tope de 100 líneas en **todos** los archivos), typecheck | lefthook |
| Mensaje de commit | commitlint (Conventional Commits) | lefthook |
| `git push` | unit + contrato + fuzz + cobertura | lefthook |
| Antes de abrir el PR | `pnpm verify` (todo + integración + mutación + build) | manual, **obligatorio** |
| PR / push a `develop` o `main` | `pnpm verify` | GitHub Actions |

Nunca `--no-verify`. Si un gate falla, se arregla la causa.

## 7. Cierre (skill `finish-task`)

1. Recorré la [Definition of Done](definition-of-done.md) completa.
2. Actualizá `docs/features/<feature>/README.md` (comportamiento vigente + tabla de errores) y, si hubo una
   decisión de arquitectura, un ADR.
3. `BACKLOG.md`: tareas tildadas, horas reales cargadas, estado `En revisión` y link al PR.
4. Abrí el PR a `develop` con la plantilla completa. Otro integrante revisa; al mergear, el ítem pasa a `Hecho`.

## 8. Skills

- Viven en `.agents/skills/` (OpenCode, Antigravity) y `.claude/skills/` (Claude Code). Ambas carpetas se
  versionan y deben ser **idénticas** (`pnpm skills:check` lo verifica en CI).
- Las de terceros están registradas en `skills-lock.json`. Para agregar una:
  `npx skills add <owner/repo> -s <skill> -a claude-code -a opencode -a antigravity --copy -y`, luego
  `pnpm skills:check` y commit `chore(skills): …`. Sólo fuentes oficiales o de mantenedores reconocidos.
- Para restaurarlas o actualizarlas: `npx skills experimental_install` / `npx skills update -p`.
- Las propias (`start-task`, `finish-task`) se editan en `.agents/skills/` y se copian con `pnpm skills:sync`.
