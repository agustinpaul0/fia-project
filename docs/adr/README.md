# Architecture Decision Records (ADR)

Un ADR registra **una** decisión de arquitectura: contexto, decisión, alternativas descartadas y
consecuencias. Sirve para que dentro de meses cualquiera (persona o agente) sepa **por qué** algo es como es
sin rediscutirlo.

- Numeración correlativa `NNNN-titulo-en-kebab.md`, desde `docs/templates/adr.md`.
- Un ADR aceptado **no se edita**: si la decisión cambia, se escribe uno nuevo con estado `Reemplaza a NNNN` y
  el viejo pasa a `Reemplazado por MMMM`.
- Se escribe un ADR cuando se elige/cambia una tecnología, un patrón transversal o una regla que afecta a
  más de un feature.

| # | Decisión | Estado |
|---|---|---|
| [0001](0001-stack.md) | Stack: SPA React + API Hono + Postgres/Drizzle + Capacitor | Aceptado |
| [0002](0002-arquitectura-por-features-y-capas.md) | Monorepo por features y capas, tipos en `packages/shared` | Aceptado |
| [0003](0003-auth-y-roles.md) | Better Auth con roles y bearer para mobile | Aceptado |
| [0004](0004-concurrencia-optimista.md) | Concurrencia optimista con columna `version` | Aceptado |
| [0005](0005-estrategia-de-tests.md) | Pirámide de tests con contrato, fuzz, integración y mutación | Aceptado |
| [0006](0006-manejo-de-errores.md) | Catálogo único de errores compartido | Aceptado |
| [0007](0007-identidad-y-membresia-de-escuderia.md) | Identidad de autenticación (Better Auth) y membresía de escudería (`team_staff`) | Aceptado |
| [0008](0008-revisiones-de-resultados.md) | Revisiones de resultados como base de las notificaciones | Aceptado |
