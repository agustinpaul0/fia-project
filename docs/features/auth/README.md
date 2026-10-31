# Feature: autenticación y roles

- **US relacionadas**: T-1 (habilitador técnico), US-4, US-29
- **Código**: `packages/shared/src/contracts/auth.ts`, `packages/shared/src/db/schema/auth.ts`, `apps/api/src/core/auth/`, `apps/api/src/features/auth/`, `apps/web/src/features/auth/`

## Qué hace

Permite el inicio de sesión y la resolución de sesiones de usuarios en la plataforma. Identifica el rol (`fia_admin`, `team_staff`, `driver`, `public`) y el vínculo con la escudería (`teamId`); el piloto se vincula por `driver_accounts` (US-27). Redirige a la interfaz correspondiente y protegiendo los endpoints del sistema.

## Reglas de negocio

- Contraseña segura: 12 a 128 caracteres, al menos una mayúscula, una minúscula y un número.
- Normalización de correo electrónico (minúsculas y sin espacios al inicio/final).
- Sin registro público de roles administrativos: las cuentas son dadas de alta por administradores de la FIA.
- **US-29**: el rol sale de `user.role` (lo asigna la FIA, el usuario no lo elige). Etiquetas: Admin FIA,
  Admin escudería, Piloto y Usuario común (`ROLE_LABELS`).
- Una cuenta dada de baja (`banned`) o con un rol desconocido no obtiene sesión (`null` ⇒ 401).
- Inicio por rol tras el login: FIA → `/admin/team-staff`, escudería → `/team/drivers`, piloto → `/driver`,
  usuario común → `/`. Si alguien entra por URL al área de otro rol, la API responde 401/403 y la web lo
  redirige a su inicio (o a `/login` si no hay sesión).

## Roles y permisos

| Área (web) / API | fia_admin | team_staff | driver | public |
|---|---|---|---|---|
| Iniciar sesión (`/api/auth/sign-in/email`) | ✓ | ✓ | ✓ | ✓ |
| `/admin/*` (personal, cuentas de pilotos, resultados, confirmaciones) | ✓ | 403 ⇒ redirige | 403 ⇒ redirige | 401 ⇒ `/login` |
| `/team/drivers`, `/notifications` | 403 ⇒ redirige | ✓ | 403 ⇒ redirige | 401 ⇒ `/login` |
| `/driver` (`GET /driver-accounts/me`) | 403 ⇒ redirige | 403 ⇒ redirige | ✓ | 401 ⇒ `/login` |
| `/chat` | ✓ | ✓ | ✓ | 403 |

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
- Header global (`UserNav` en `RootLayout`): nombre, etiqueta del rol e insignia "Piloto oficial" para pilotos.
- Menú principal (`MainNav`): enlaces propios de cada rol (`ROLE_LINKS`).
- `/driver` → `DriverHome`: perfil oficial del piloto, accesos y sus sanciones.
