# Plan: US-4 — Iniciar sesión mediante credenciales seguras

- **Ítem del backlog**: US-4
- **Autor**: Santiago / Antigravity · **Fecha**: 2026-10-14 · **Estado**: Aprobado
- **Rama**: `feat/us-4-authentication`

## Objetivo

Consolidar y completar el flujo de inicio de sesión seguro, protegiendo las rutas del rol administrativo de la FIA, implementando redirección automática según rol, asegurando mensajes de error genéricos que eviten enumeración de cuentas, expiración de sesión por inactividad e invalidación segura al cerrar sesión.

## Descubrimiento (respuestas)

| Pregunta | Respuesta | Fuente |
|---|---|---|
| ¿Qué rol ejecuta la acción? | Cualquier usuario puede autenticarse vía `/api/auth/sign-in/email`. Si el rol resultante es `fia_admin`, se redirige al área administrativa (`/admin/staff` o `/admin/results`). | US-4, PO |
| ¿Qué pasa con otros roles? | `team_staff` redirige a su área (`/results` / `/admin/results`), `public` al inicio (`/`). | US-4, dev |
| ¿Qué mensajes se muestran ante error? | Mensaje genérico exacto: `Credenciales inválidas.` tanto si el email no existe como si la contraseña es errónea. | Criterio de aceptación US-4 |
| ¿Expiración de sesión? | Inactividad configurada y token/sesión invalidado de forma efectiva al desloguearse o expirar. | Criterio de aceptación US-4 |
| ¿Protección de endpoints y URLs? | Middleware 401 si no autenticado, 403 si rol no autorizado. | Criterio de aceptación US-4 |
| ¿Fuerza bruta y seguridad? | Rate limiting activo por IP en intentos de autenticación; contraseñas nunca en plano (hash con sal). | US-4, Better Auth |

## Cambios por capa

| Capa | Archivos a crear/modificar | Responsabilidad |
|---|---|---|
| shared/contracts | `contracts/auth.ts` | Schema y tipo de respuesta de sesión y credenciales. |
| shared/domain | `domain/errors/error-catalog.ts` | Errores `INVALID_CREDENTIALS`, `UNAUTHENTICATED`, `FORBIDDEN`, `SESSION_EXPIRED`. |
| api | `core/auth/better-auth.ts`, `better-auth-error.ts` | Configuración de expiración de sesión, traducción estricta a mensaje genérico. |
| api | `features/auth/auth.routes.ts` | Endpoints de sesión, protección y tests de contrato. |
| web | `features/auth/hooks/use-login.ts`, `login-form.tsx` | Redirección basada en rol post-login y visualización del mensaje genérico de error. |
| web | `features/auth/guards/require-fia-admin.tsx` | Guard de ruta administrativa con redirección y estado no autorizado. |

## Restricciones de base de datos

- Tablas de Better Auth gestionadas con Drizzle (`user`, `session`, `account`, `verification`).
- Campo `role` validado en `ADMIN_ROLES` (`fia_admin`, `team_staff`, `public`).
- Contraseñas almacenadas exclusivamente con hash seguro con sal administrado por Better Auth.

## Errores

| Acción inválida | code | status | Mensaje |
|---|---|---|---|
| Credenciales inválidas o email no existente | `INVALID_CREDENTIALS` | 401 | Credenciales inválidas. |
| Acceso no autenticado | `UNAUTHENTICATED` | 401 | Tenés que iniciar sesión para realizar esta acción. |
| Acceso sin rol administrativo | `FORBIDDEN` | 403 | No tenés permisos para realizar esta acción. |
| Sesión expirada por inactividad | `SESSION_EXPIRED` | 401 | Tu sesión ha expirado por inactividad. Volvé a iniciar sesión. |
| Demasiados intentos fallidos | `RATE_LIMITED` | 429 | Hiciste demasiados intentos. Esperá unos minutos y volvé a probar. |

## Tests

| Tipo | Casos |
|---|---|
| Unit | `use-login` redirección a `/admin/staff` si el usuario es `fia_admin`, o a `/` en otros casos; captura de mensaje genérico. |
| Contrato | POST `/api/auth/sign-in/email` ante credenciales inválidas devuelve 401 con mensaje genérico; rutas `/admin/*` devuelven 401/403. |
| Integración | Verificación de expiración e invalidación de token tras `signOut`. |
| Criterios de aceptación | Redirección a administración FIA tras login válido; mensaje genérico ante datos inválidos; invalidación tras cierre. |

## Riesgos y decisiones

- Better Auth provee rate limiting y hash seguro. La traducción de errores en `better-auth-error.ts` asegura la opacidad para evitar ataques de enumeración.
