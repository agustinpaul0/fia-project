# 0002 — Monorepo organizado por features y capas

- **Estado**: Aceptado (2026-09-23)

## Contexto

Tres desarrolladores trabajan en paralelo sobre US distintas; se quiere minimizar conflictos, facilitar que un
agente encuentre todo lo de un tema en un lugar y garantizar que front y back no diverjan.

## Decisión

- `apps/api`, `apps/web` y `packages/shared` en un monorepo pnpm.
- Dentro de cada app, carpetas **por feature** (`features/categories/…`), no por tipo técnico.
- Backend en capas `routes → service → repository → db` con el repositorio detrás de un *port*
  (`<f>.port.ts`) para inyectarlo (DIP) y poder testear el service con un fake en memoria.
- **Todos** los tipos compartidos en `packages/shared` (contratos Zod, dominio, tablas Drizzle). La web sólo
  puede importar `contracts` y `domain`.
- Tope de 100 líneas por archivo y responsabilidad única para forzar modularidad.

## Consecuencias

- Agregar un feature es agregar carpetas, no tocar las existentes (salvo el registro en `create-app.ts`).
- Más archivos chicos: se compensa con nombres consistentes (`<f>.service.ts`, `<f>.routes.<aspecto>.test.ts`).
- La doc también se organiza por feature (`docs/features/<f>/`).
