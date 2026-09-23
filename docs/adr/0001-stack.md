# 0001 — Stack tecnológico

- **Estado**: Aceptado (2026-09-23)

## Contexto

Sistema web de la FIA que, según el enunciado, debe estar disponible también como app móvil. Equipo de 3
personas con agentes de IA distintos, 3 sprints de 2 semanas, demos presenciales corriendo en local. Se prioriza:
un solo lenguaje, tipos compartidos, simplicidad y un camino corto hacia mobile.

## Decisión

| Capa | Elección |
|---|---|
| Lenguaje | TypeScript 6 estricto en todo el repo |
| Monorepo | pnpm workspaces (sin Turborepo), Node 24 LTS |
| Web | React 19 + Vite + TanStack Router + TanStack Query + Tailwind v4 + shadcn/ui + react-hook-form |
| API | Hono sobre Node (`@hono/node-server`) + `@hono/zod-validator` |
| Datos | PostgreSQL 17 + Drizzle ORM + drizzle-kit |
| Validación | Zod 4, schemas en `packages/shared` usados por front y back |
| Auth | Better Auth (ADR 0003) |
| Mobile | Capacitor envolviendo la SPA |
| Calidad | Biome, lefthook, commitlint, Vitest 4, fast-check, Stryker |
| Infra local | Docker Compose (db, db-test, migrate, api, web) |

## Alternativas descartadas

- **Next.js fullstack**: Capacitor necesita una SPA estática; con SSR/Server Actions habría que mantener igual
  una API aparte y la app móvil quedaría de segunda.
- **Expo (React Native + web)**: mejor app nativa, pero web menos flexible (sin shadcn/Tailwind) y más curva.
- **Prisma**: DSL propio y generación de cliente; no soporta restricciones `CHECK` en el schema (habría que
  editar SQL a mano, contra la regla de "todo por el ORM").
- **Express/Fastify/NestJS**: Express sin tipos ni validación integrada; Fastify más complejo; NestJS
  demasiado pesado para el tamaño del proyecto.
- **Cliente RPC de Hono (`hc`)**: obligaba a la web a compilar código del backend. Se prefiere un cliente HTTP
  propio que valida con los contratos de `packages/shared`.
- **TypeScript 7 (nativo) y Vitest 5**: se probaron; Stryker 10 no es compatible (necesita la API JS del
  compilador y el mecanismo de setup de Vitest 4). Se revisará cuando Stryker los soporte.

## Consecuencias

- Todo el equipo trabaja en un solo lenguaje y los contratos se comparten sin duplicar tipos.
- Deploy futuro (no requerido por la materia): SPA estática + API como función serverless (Vercel) o contenedor
  (Render/Railway/Fly) + **Supabase** como Postgres gestionado (sólo la base; no su auth ni su SDK). Hono corre
  en todos esos entornos sin cambios. En serverless no hay websockets persistentes: las notificaciones usarían
  polling o SSE corto.
