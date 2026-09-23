# Git: ramas, commits y pull requests

Estas reglas son **convención del equipo**: GitHub no bloquea pushes a `main` ni a `develop` (por comodidad),
pero se espera que todos las sigan. El CI corre en cada PR y en cada push a `develop` y `main`.

## Ramas

| Rama | Propósito | Sale de | Entra a |
|---|---|---|---|
| `main` | "Producción": lo que se muestra en la demo del sprint. Siempre verde. | — | — |
| `develop` | Integración (similar a staging): lo terminado y revisado del sprint en curso. | `main` | `main` |
| `feat/<id>-<slug>` | Una US o habilitador. Ej.: `feat/us-20-race-points`, `feat/t-1-auth-roles`. | `develop` | `develop` |
| `fix/<id>-<slug>` | Corrección de un bug. Ej.: `fix/bug-3-stale-version-toast`. | `develop` | `develop` |
| `docs/…`, `test/…`, `chore/…`, `refactor/…` | Cambios sin comportamiento nuevo. | `develop` | `develop` |
| `hotfix/<slug>` | Bug urgente en `main` (p. ej. el día de la demo). | `main` | `main` **y** `develop` |

Reglas:

- Una rama = un ítem del backlog. Ramas cortas (idealmente ≤ 3 días). Borrarla después del merge.
- Antes de abrir el PR: `git fetch && git rebase origin/develop` y `pnpm verify`.
- Nunca se reescribe la historia de `main` ni de `develop` (`push --force` prohibido ahí).

## Flujo

```
feat/us-20-…  ──PR (squash)──▶  develop  ──PR "release: sprint N" (merge commit)──▶  main  (tag sprint-N)
```

1. PR de la feature a `develop` con **squash merge**: un commit por ítem, con mensaje Conventional Commit.
2. Antes de cada demo: PR `develop → main` titulado `release: sprint N`, merge commit y tag
   `git tag -a sprint-N -m "Demo sprint N" && git push --tags`.

## Commits: Conventional Commits en español

```
<tipo>(<scope>): <descripción en imperativo, minúscula, sin punto final>

<cuerpo opcional: qué y por qué, no cómo>

Refs: US-20
```

| Tipo | Cuándo |
|---|---|
| `feat` | Comportamiento nuevo para el usuario. |
| `fix` | Corrección de un bug. |
| `refactor` | Cambio interno sin cambiar comportamiento. |
| `test` | Sólo tests. |
| `docs` | Sólo documentación (incluye `BACKLOG.md`). |
| `chore` | Mantenimiento: dependencias, skills, configuración. |
| `build` / `ci` | Build, Docker, GitHub Actions. |
| `perf`, `style`, `revert` | Performance, formato, revertir un commit. |

- **scope** = el feature en kebab-case (`results`, `categories`, `notifications`, `auth`, `backlog`, `skills`).
- Breaking change: `feat(results)!: …` y un párrafo `BREAKING CHANGE: …` en el cuerpo.
- Ejemplos: `feat(results): permitir cargar el puntaje de una carrera`,
  `fix(categories): devolver 409 al editar con una versión vieja`, `docs(backlog): marcar US-20 en progreso`.
- commitlint lo valida en el hook `commit-msg` y en CI.

Commits hechos con asistencia de IA: se agrega el trailer que indique la herramienta
(p. ej. `Co-Authored-By: Claude …`). La cátedra valora que el uso de IA quede registrado.

## Pull requests

- Título = mensaje del commit final (Conventional Commit).
- Cuerpo = [plantilla](../.github/pull_request_template.md) completa: ítem del backlog, qué cambia, cómo
  probarlo, checklist de la Definition of Done.
- Al menos **un integrante distinto del autor** revisa y aprueba. El autor no mergea sin aprobación.
- El revisor verifica: reglas de `AGENTS.md`, tests que cubran cada criterio de aceptación y cada error,
  docs del feature y backlog actualizados. Usar la skill `receiving-code-review` para responder comentarios.
- CI verde obligatorio antes del merge.
