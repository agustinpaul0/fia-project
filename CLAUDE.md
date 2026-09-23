# CLAUDE.md

Las reglas de este repo están en `AGENTS.md` y aplican sin excepciones:

@AGENTS.md

## Notas específicas de Claude Code

- Las skills del proyecto están en `.claude/skills/` (copia de `.agents/skills/`). Antes de programar usá
  `start-task`; antes de dar algo por terminado, `finish-task` y `verification-before-completion`.
- Para planificar una tarea nueva usá el modo plan y guardá el plan final en `docs/plans/` como pide
  `docs/workflow.md`.
- No uses `--no-verify` ni saltees hooks. Si un hook falla, se arregla la causa.
