# Arquitectura

Monorepo TypeScript con **pnpm workspaces**, organizado **por features** y en **capas**. Decisiones y
alternativas descartadas en [`adr/`](adr/).

## Vista general

```
             ┌─────────────────────────── packages/shared (@fia/shared) ───────────────────────────┐
             │  contracts/  schemas Zod de request/response + tipos inferidos + rutas de la API     │
             │  domain/     roles, catálogo de errores (AppError), reglas puras                     │
             │  db/         tablas Drizzle con restricciones + migraciones                          │
             └───────────────▲──────────────────────────────────────────────▲──────────────────────┘
                             │ contracts + domain                           │ contracts + domain + db
┌──────────── apps/web (@fia/web) ───────────┐        HTTP/JSON      ┌──────── apps/api (@fia/api) ────────┐
│ routes → features/<f>/components           │ ─────────────────────▶ │ routes → service → repository ──▶ DB │
│          features/<f>/hooks (TanStack Q.)  │ ◀───────────────────── │ core: auth, errores, seguridad      │
│          features/<f>/api  (apiRequest)    │  {…} ó {error:{code…}} │                                     │
└────────────────────────────────────────────┘                        └─────────────────────────────────────┘
```

- **Web**: SPA React. Mañana Capacitor la empaqueta como app móvil sin cambios (ADR 0001).
- **API**: Hono sobre Node. Es la única que habla con Postgres.
- **Shared**: único lugar donde viven los tipos. Front y back validan con **los mismos** schemas.

## Reglas de dependencia

| Desde | Puede importar | Nunca |
|---|---|---|
| `apps/web` | `@fia/shared/contracts`, `@fia/shared/domain` | `@fia/shared/db`, `drizzle-orm`, `pg`, `apps/api` |
| `apps/api` | `@fia/shared/*` | `apps/web` |
| `packages/shared` | `zod`, `drizzle-orm` | `apps/*` |
| `*.routes.ts` | su service, `core/http`, `core/auth` | repositorios, Drizzle |
| `*.service.ts` | su port (`*.port.ts`), `@fia/shared` | Drizzle, Hono |
| `*.repository.ts` | Drizzle, `@fia/shared/db`, `core/db`, `core/errors` | Hono, services |
| feature A | la API pública de feature B (su service) | internos de B |

Biome hace cumplir las restricciones de imports (`noRestrictedImports`) y la ausencia de ciclos
(`noImportCycles`).

## Backend (`apps/api/src`)

| Ruta | Contenido |
|---|---|
| `server.ts` | Entrypoint: carga env, conecta la DB, arma la app, escucha el puerto, apagado ordenado. |
| `env.ts` | Variables de entorno validadas con Zod. Si falta una, la API no arranca. |
| `app/create-app.ts` | Composición: middlewares de seguridad → sesión → rutas de cada feature → 404 → manejador de errores. |
| `app/app-dependencies.ts` | Tipo de las dependencias inyectables (repositorios, logger, sesión, ping de DB). |
| `app/production-dependencies.ts` | Implementaciones reales (Drizzle, consola). Los tests usan `testing/test-app.ts`. |
| `core/auth/` | `session.ts` (usuario de sesión), `access.ts` (`publicAccess`, `requireRole`). |
| `core/db/` | Conexión (`client.ts`), tipo `DbExecutor` (db o transacción), `firstOrThrow`, ping. |
| `core/errors/` | Manejador global, traducción de `HTTPException` y de violaciones de restricciones de Postgres. |
| `core/http/` | `validate` (Zod → `VALIDATION_FAILED` con errores por campo) y `ok`/`created`/`noContent` (validan la respuesta). |
| `core/security/` | Secure headers, CORS por allowlist, límite de tamaño del body. |
| `features/<f>/<f>.port.ts` | Interfaz del repositorio (lo que el service necesita). |
| `features/<f>/<f>.repository.ts` | Implementación Drizzle del port. Única capa que toca la DB. |
| `features/<f>/<f>.service.ts` | Reglas de negocio y permisos. Recibe el repositorio por inyección. Lanza `AppError`. |
| `features/<f>/<f>.mapper.ts` | Fila de DB → DTO del contrato (fechas a ISO, sin campos internos). |
| `features/<f>/<f>.routes.ts` | Rutas Hono: política de acceso + validación + delegación al service + respuesta validada. |
| `db/migrate.ts`, `seed/` | Scripts de migración y datos de ejemplo. |
| `testing/` | Builders de datos, repositorios en memoria, app de test, helpers HTTP e integración. |

## Frontend (`apps/web/src`)

| Ruta | Contenido |
|---|---|
| `main.tsx` | Entrypoint: providers (TanStack Query) y router. |
| `app/` | Shell: layout raíz, router, fallback de errores por ruta, página 404. |
| `routes/` | Rutas de TanStack Router por archivo. **Finas**: sólo componen componentes de features. |
| `features/<f>/api/` | Funciones que llaman a la API con `apiRequest` y el schema del contrato. |
| `features/<f>/hooks/` | Hooks de TanStack Query (`useQuery`/`useMutation`). Toda la lógica de datos. |
| `features/<f>/components/` | Componentes del feature (organismos). Sólo presentan; reciben datos por props o hooks. |
| `components/ui/` | Átomos de shadcn/ui (botón, card, badge…). Se agregan con `npx shadcn add`. |
| `components/common/` | Moléculas reutilizables propias: `QueryView`, `LoadingState`, `EmptyState`, `ErrorState`. |
| `lib/api/` | Cliente HTTP: valida respuestas con Zod, traduce errores a `AppError`, maneja errores de red. |
| `lib/` | `queryClient`, `notifyError` (toasts), `toUserMessage`, `formatDateTime` (hora argentina). |
| `styles/` | Tokens de tema de Tailwind/shadcn, partidos en archivos de menos de 100 líneas. |
| `testing/` | Render con QueryClient, mocks de `fetch`, builders de datos. |

## Shared (`packages/shared/src`)

| Ruta | Contenido |
|---|---|
| `contracts/<f>.ts` | Schemas Zod de bodies, params, queries y respuestas del feature, más sus tipos. |
| `contracts/common.ts` | `idParamsSchema`, `versionSchema`, `errorResponseSchema`, mensajes de Zod en español. |
| `contracts/api-paths.ts` | Rutas de la API, usadas por back y front. |
| `domain/errors/` | `ERROR_CATALOG` (código → status + mensaje) y `AppError`. |
| `domain/roles.ts` | Roles del sistema. |
| `db/schema/columns.ts` | Columnas comunes (`id`, `version`, `createdAt`, `updatedAt`) y checks de versión. |
| `db/schema/<f>.ts` | Tabla del feature con **todas** sus restricciones. |
| `../migrations/` | Migraciones SQL generadas por drizzle-kit (no se editan a mano). |

## Flujo de una petición

`PUT /categories/:id` con `{ name, code, version }`:

1. `securityMiddlewares`: headers, CORS, límite de body (413 si se excede).
2. `resolveSession`: carga el usuario de sesión (o `null`).
3. `requireRole('fia_admin')`: 401 sin sesión, 403 con otro rol.
4. `validate('param')` y `validate('json')`: 400 `VALIDATION_FAILED` con errores por campo.
5. `service.update`: 404 si no existe; el repositorio hace `UPDATE … WHERE id AND version`; 0 filas ⇒ 409
   `STALE_VERSION`; restricción `unique` violada ⇒ 409 `CATEGORY_ALREADY_EXISTS`.
6. `ok(c, categorySchema, dto)`: valida la respuesta contra el contrato (si no cumple ⇒ 500, nunca se filtra).
7. Cualquier error ⇒ `createErrorHandler` ⇒ `{ error: { code, message, fields } }` con su status.

## Concurrencia optimista

Cada fila mutable tiene `version`. El formulario guarda la `version` con la que se abrió y la manda al guardar.
El repositorio actualiza sólo si la versión coincide y la incrementa. Si otra persona guardó antes, no se
actualiza ninguna fila y la API responde 409 con un mensaje que invita a recargar. Detalle en ADR 0004.

## Mobile (Capacitor)

La SPA ya está preparada: URL de la API configurable (`VITE_API_URL`), sin SSR ni APIs de Node en el front.
Cuando se agregue: `pnpm --filter @fia/web add @capacitor/core @capacitor/cli`, `npx cap init`,
`npx cap add android`, y la app apunta a la IP de la notebook en la red local durante las demos.
