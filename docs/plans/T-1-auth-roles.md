# Plan: T-1 — Autenticación mínima con roles

- **Ítem del backlog**: T-1 (habilitador técnico)
- **Autor**: Agustín / Antigravity · **Fecha**: 2026-09-23 · **Estado**: Aprobado
- **Rama**: `feat/t-1-auth-roles`

## Objetivo

Implementar autenticación y sesiones con Better Auth y Drizzle sobre PostgreSQL, integrando roles (`fia_admin`, `team_staff`, `public`), soporte de token bearer (para móvil), resolución real de sesión en la API y pantalla de login mínima en la web para desbloquear las historias del Sprint 1.

## Descubrimiento (respuestas)

| Pregunta | Respuesta | Fuente |
|---|---|---|
| ¿Qué rol ejecuta la acción? | `public` puede autenticarse (`/api/auth/sign-in/email`); endpoints protegidos exigen `fia_admin` o `team_staff`. | ADR 0003, BACKLOG.md |
| ¿Qué campos entran/salen y con qué reglas? | Entrada login: `email` (formato email, normalizado a minúsculas), `password` (12–128 caracteres, mayúscula, minúscula y número). Salida: sesión con datos del usuario (`id`, `name`, `email`, `role`, `teamId`). | ADR 0003 |
| ¿Hay concurrencia? | No aplica concurrencia optimista sobre las tablas internas de Better Auth (`user`, `session`, `account`, `verification`). Se gestionan mediante la API de Better Auth (excepción documentada en ADR 0003). | ADR 0003, conventions |
| ¿Qué se muestra en carga / vacío / error? | Carga: skeleton / estado deshabilitado en formulario. Error: mensaje inline o alerta ante credenciales inválidas o rate limit. | ADR 0006, conventions |

**Preguntas abiertas para el PO**: Ninguna para T-1 (diseño técnico acordado en ADR 0003).

## Cambios por capa

| Capa | Archivos a crear/modificar | Responsabilidad |
|---|---|---|
| `shared/contracts` | `contracts/auth.ts` | Schemas Zod de credenciales, login y datos de usuario autenticado. |
| `shared/domain` | `domain/errors/error-catalog.ts` | Errores de auth (`INVALID_CREDENTIALS`, etc. si corresponden). |
| `shared/db` | `db/schema/auth.ts`, `db/schema/index.ts` | Tablas Better Auth (`user`, `session`, `account`, `verification`) con campos `role` y `team_id`. |
| `api` | `core/auth/better-auth.ts`, `core/auth/session.ts`, `features/auth/auth.routes.ts`, `seed/auth.seed.ts` | Instancia Better Auth, adaptador Drizzle, resolver de sesión real, montaje de rutas y seed de admin. |
| `web` | `lib/auth-client.ts`, `features/auth/`, `routes/login.tsx`, `app/root-layout.tsx` | Cliente de autenticación, formulario de login, hook de sesión y estado en layout. |

## Restricciones de base de datos

- Tabla `user`: `id text primary key`, `name text not null`, `email text not null unique`, `emailVerified boolean not null`, `image text`, `role varchar(20) not null default 'public'`, `team_id uuid`, `created_at timestamptz not null`, `updated_at timestamptz not null`.
- Tabla `session`: `id text primary key`, `expiresAt timestamptz not null`, `token text not null unique`, `createdAt timestamptz not null`, `updatedAt timestamptz not null`, `ipAddress text`, `userAgent text`, `userId text not null references user(id) on delete cascade`.
- Tabla `account`: `id text primary key`, `accountId text not null`, `providerId text not null`, `userId text not null references user(id) on delete cascade`, `password text`, `createdAt timestamptz not null`, `updatedAt timestamptz not null`.
- Tabla `verification`: `id text primary key`, `identifier text not null`, `value text not null`, `expiresAt timestamptz not null`, `createdAt timestamptz`, `updatedAt timestamptz`.

## Errores

| Acción inválida | code | status | Mensaje |
|---|---|---|---|
| Acceso sin sesión a ruta protegida | `UNAUTHENTICATED` | 401 | Tenés que iniciar sesión para realizar esta acción. |
| Acceso con rol no autorizado | `FORBIDDEN` | 403 | No tenés permisos para realizar esta acción. |
| Credenciales incorrectas | `INVALID_CREDENTIALS` | 401 | El correo o la contraseña son incorrectos. |
| Demasiados intentos de login | `RATE_LIMITED` | 429 | Hiciste demasiados intentos. Esperá unos minutos y volvé a probar. |
| Contraseña no cumple política | `VALIDATION_FAILED` | 400 | Hay datos inválidos... |

## Tests

| Tipo | Casos |
|---|---|
| Unit (schemas & password policy) | Validación de contraseña segura (12-128 caracteres, mayúscula, minúscula, número); normalización de email. |
| Contrato / Caja negra | Rutas protegidas responden 401 sin sesión y 403 con rol incorrecto; login exitoso devuelve sesión y cookie/bearer. |
| Integración | Creación de usuario y sesión en base de datos; verificación de roles y `teamId`. |

## Riesgos y decisiones

- Se utiliza Better Auth con plugins `admin` y `bearer` según ADR 0003.
- Las tablas de Better Auth no utilizan la columna `version` ya que las sesiones y autenticaciones son administradas internamente por la librería (excepción en `docs/conventions/database.md`).
