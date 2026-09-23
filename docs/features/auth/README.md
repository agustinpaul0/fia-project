# Feature: autenticación y roles

- **US relacionadas**: T-1 (habilitador técnico), US-4, US-29
- **Código**: `packages/shared/src/contracts/auth.ts`, `packages/shared/src/db/schema/auth.ts`, `apps/api/src/core/auth/`, `apps/api/src/features/auth/`, `apps/web/src/features/auth/`

## Qué hace

Permite el inicio de sesión y la resolución de sesiones de usuarios en la plataforma. Identifica el rol (`fia_admin`, `team_staff`, `public`) y la escudería vinculada (`teamId`), protegiendo los endpoints del sistema.

## Reglas de negocio

- Contraseña segura: 12 a 128 caracteres, al menos una mayúscula, una minúscula y un número.
- Normalización de correo electrónico (minúsculas y sin espacios al inicio/final).
- Sin registro público de roles administrativos: las cuentas son dadas de alta por administradores de la FIA.

## Roles y permisos

| Acción | fia_admin | team_staff | public |
|---|---|---|---|
| Iniciar sesión (`/api/auth/sign-in/email`) | ✓ | ✓ | ✓ |
| Consultar sesión actual (`/api/auth/session`) | ✓ | ✓ | ✓ |
| Rutas administrativas protegidas | ✓ | ✗ (403) | ✗ (401) |

## API

| Método | Ruta | Acceso | Body / query | Respuesta |
|---|---|---|---|---|
| POST | `/api/auth/sign-in/email` | público | `{ email, password }` | 200 con sesión y cookie |
| GET | `/api/auth/session` | público | — | 200 con sesión activa o null |
| POST | `/api/auth/sign-out` | público | — | 200 |

## Datos

Tablas Drizzle Better Auth en `packages/shared/src/db/schema/auth.ts`:
- `user`: `id`, `name`, `email` (único), `role` (por defecto `public`), `team_id`, etc.
- `session`: `id`, `token` (único), `user_id`, `expires_at`, etc.
- `account`: `id`, `user_id`, `password`, `provider_id`, etc.
- `verification`: `id`, `identifier`, `value`, `expires_at`.

## Errores

| Acción inválida | code | status | Mensaje |
|---|---|---|---|
| Acceso sin sesión a recurso protegido | `UNAUTHENTICATED` | 401 | Tenés que iniciar sesión para realizar esta acción. |
| Acceso con rol no autorizado | `FORBIDDEN` | 403 | No tenés permisos para realizar esta acción. |
| Credenciales incorrectas | `INVALID_CREDENTIALS` | 401 | El correo electrónico o la contraseña son incorrectos. |
| Demasiados intentos de autenticación | `RATE_LIMITED` | 429 | Hiciste demasiados intentos. Esperá unos minutos y volvé a probar. |
| Contraseña no cumple política | `VALIDATION_FAILED` | 400 | Hay datos inválidos... |

## Pantallas

- `/login` → `LoginForm`: formulario con email y contraseña, estado de carga y alerta de error.
- Header global (`UserNav` en `RootLayout`): estado de autenticación (nombre y rol) o botón de inicio de sesión.
