# AGENTS.md — reglas para agentes de IA (y humanos)

Fuente **canónica** de reglas del repo. `CLAUDE.md` (Claude Code) y `GEMINI.md` (Antigravity) sólo apuntan
acá; OpenCode lo lee directo. Si una regla cambia, se cambia **acá** y en el doc detallado que corresponda.

## Contexto

Sistema de gestión de la FIA (Enunciado 1, APS 2026 — UNS). Somos la **comisión implementadora**; el
**Grupo Naranja** es Analista/Management (PO). El backlog vigente está en [`BACKLOG.md`](BACKLOG.md) y las specs
originales en [`docs/specs/`](docs/specs/). Idioma: **docs, commits, PRs y UI en español; código en inglés**.

## Antes de tocar código (obligatorio)

1. Leé [`docs/workflow.md`](docs/workflow.md) y seguilo paso a paso (skill `start-task`).
2. Identificá el ítem de `BACKLOG.md`. Si no existe, **no se programa**: se agrega primero.
3. Hacé las **preguntas de descubrimiento** al dev (lista en `docs/workflow.md` §2). No asumas reglas de negocio:
   si algo no está en la US ni en `docs/features/`, se pregunta.
4. Escribí el plan en `docs/plans/<ID>-<slug>.md` (plantilla `docs/templates/plan.md`) y esperá aprobación.

## Reglas duras (el lint/CI las hace cumplir; no se discuten en un PR)

| Regla | Detalle |
|---|---|
| Tope de líneas | **100 líneas físicas por archivo de código** (`.ts/.tsx/.js/.mjs/.css`, tests incluidos). Funciones ≤ 40 líneas, ≤ 3 parámetros (usar objeto). No aplica a `.md`/JSON/YAML. |
| Comentarios | **Cero**. El código se explica solo. Única excepción: en español y sólo cuando el código no puede expresar el *por qué*. |
| Tipado | Sin `any`, sin `!` (non-null), sin `as` salvo en fronteras ya validadas. Tipos de retorno explícitos en exports. Ausencia = `T \| null` explícito. |
| Capas | `routes → service → repository → db`. Nunca saltear ni invertir. Sólo el repositorio toca Drizzle. |
| SQL | **Prohibido SQL plano** (`sql\`\``, `pg` directo). Siempre el query builder de Drizzle. `sql` sólo en `check()` del schema. |
| Tipos compartidos | Viven **sólo** en `packages/shared`. La web importa `@fia/shared/contracts` y `@fia/shared/domain`, nunca `@fia/shared/db`. |
| Restricciones | Toda regla de datos que Postgres pueda garantizar va en el schema Drizzle (`notNull`, `varchar(n)`, `unique`, `check`, FKs con `onDelete`). |
| Concurrencia | Toda tabla mutable usa `version` (concurrencia optimista). Update/delete filtran por `id` **y** `version`; 0 filas ⇒ `STALE_VERSION` (409). |
| Errores | Toda acción inválida ⇒ `AppError(code)` del catálogo (`packages/shared/src/domain/errors`) con mensaje claro en español. Nunca `throw 'texto'` ni 500 crudo. |
| Seguridad | Toda ruta declara `publicAccess` o `requireRole(...)` (hay un test que lo verifica). Toda entrada se valida con Zod `strictObject`. Toda respuesta se valida contra su contrato. |
| Fechas | Se guardan y viajan en UTC (ISO 8601). Se muestran en `America/Argentina/Buenos_Aires` con `formatDateTime`. |
| Secretos | Jamás se commitea un `.env` real (hook + CI lo bloquean). Variables nuevas ⇒ `.env.example`. |

## Comandos

```bash
pnpm test:watch        # mientras desarrollás
pnpm lint && pnpm typecheck
pnpm test:coverage     # unit + contrato + fuzz + cobertura (lo corre pre-push)
pnpm test:int          # integración backend (requiere `docker compose up -d db-test`)
pnpm verify            # TODO: lint, tipos, cobertura, integración, mutación y build. Obligatorio antes de un PR.
```

## Definition of Done (resumen — completo en `docs/definition-of-done.md`)

- [ ] Tests nuevos: unit + contrato (caja negra) + fuzz + integración si tocó repositorio/schema.
- [ ] Cada acción inválida tiene su error, su mensaje y su test (tabla en `docs/features/<f>/README.md`).
- [ ] `pnpm verify` verde (cobertura ≥ 90/85, mutación ≥ 70).
- [ ] Docs del feature, ADR si hubo decisión, `.env.example` y seed actualizados si aplica.
- [ ] `BACKLOG.md` actualizado (estado, horas reales, checkboxes de criterios).
- [ ] Commits Conventional Commits en español; PR a `develop` con la plantilla completa.

## Mapa de documentación

`docs/architecture.md` · `docs/workflow.md` · `docs/git.md` · `docs/testing.md` ·
`docs/definition-of-done.md` · `docs/conventions/` · `docs/features/` · `docs/adr/` · `docs/how-to-document.md`

## Skills del repo

Viven en `.agents/skills/` (OpenCode, Antigravity) y `.claude/skills/` (Claude Code), versionadas.
Propias: `start-task`, `finish-task`. De terceros (registradas en `skills-lock.json`): TDD, debugging
sistemático, verificación antes de dar por terminado, recepción de code review, React/composición, Better Auth,
Hono, shadcn y Vitest. Cómo agregarlas o actualizarlas: `docs/workflow.md` §8.
