# Plan: US-29 — Detección de rol en inicio de sesión e interfaces específicas

- **Ítem del backlog**: US-29
- **Autor**: Argon 4 / Antigravity · **Fecha**: 2026-10-29 · **Estado**: Implementado
- **Rama**: `feat/us-29-role-detection-and-interfaces`

> **Instrucciones Obligatorias para Argon 4:**
> 1. Consultar y aplicar todas las directivas de [`AGENTS.md`](../AGENTS.md): máximo 100 líneas por archivo de código, cero comentarios, tipado estricto, capas `routes → service → repository → db`, sin SQL plano.
> 2. Seguir el flujo de trabajo en [`docs/workflow.md`](../workflow.md) y [`docs/testing.md`](../testing.md).
> 3. Implementar mediante un máximo de 5 commits atómicos en Conventional Commits en español.

## Objetivo

Detectar automáticamente en el inicio de sesión si la cuenta pertenece a un Administrador FIA (`fia_admin`), Personal de Escudería (`team_staff`), Piloto (`driver`) o Usuario común (`public`), persistiendo el identificador en la cuenta y en el token de sesión, redirigiendo a su área respectiva y renderizando la interfaz y menú correspondientes protegidos por guardas de ruta.

## Descubrimiento (respuestas)

| Pregunta | Respuesta | Fuente (US, dev, PO) |
|---|---|---|
| ¿Qué rol ejecuta la acción? | Cualquier usuario registrado al loguearse; las guardas aplican según los 4 roles del sistema. | US-29, Informe Sprint 3 |
| ¿Qué datos entran y salen? | Entrada: credenciales habituales (email + password). Salida: sesión con rol (`fia_admin`, `team_staff`, `driver`, `public`), identificadores (`teamId`, `driverId`) y redirección de interfaz. | US-29, Better Auth |
| ¿Hay concurrencia? | No aplica directamente en login; cuentas usan `version` si se modifican. | ADR 0004 |
| ¿Qué se muestra en carga / vacío / error? | Carga: skeleton de interfaz/dashboard. Error 401/403: redirección o vista `ForbiddenState` sin pantalla en blanco. | UI conventions |

## Cambios por capa

| Capa | Archivos a crear/modificar | Responsabilidad |
|---|---|---|
| `shared/domain` | `domain/roles.ts` | Ampliar catálogo a `fia_admin`, `team_staff`, `driver`, `public`. |
| `shared/contracts` | `contracts/auth.ts` | Schema de sesión enriquecido con rol tipado y datos de contexto. |
| `api` | `core/auth/better-auth-roles.ts`, `session.ts`, `access.ts` | Políticas de acceso para rol `driver` y tipado de `SessionUser`. |
| `web` | `routes/login.tsx`, `components/brand/AppHeader.tsx`, `app/router.tsx` | Redirección post-login por rol, menú dinámico y guardas `beforeLoad`. |

## Restricciones de base de datos

- Tabla `user`: columna `role` restringida a los 4 roles canónicos (`fia_admin`, `team_staff`, `driver`, `public`).
- Las cuentas creadas en US-23 y US-4 mantienen retrocompatibilidad sin migraciones destructivas.

## Errores

| Acción inválida | code | status | Mensaje |
|---|---|---|---|
| Acceso a área administrativa con otro rol | `FORBIDDEN` | 403 | No tenés los permisos requeridos para acceder a este recurso. |
| Intento de acceso sin autenticación | `UNAUTHENTICATED` | 401 | Tenés que iniciar sesión para acceder a este recurso. |
| Cuenta dada de baja o inactiva | `ACCOUNT_DEACTIVATED` | 403 | Esta cuenta de usuario ha sido dada de baja. |

## Tests

| Tipo | Casos |
|---|---|
| Unit (auth/session) | Asignación de rol `driver`, tipado de sesión y resolución correcta de `SessionUser`. |
| Contrato (caja negra) | Verificación de rechazo 401/403 en endpoints según la matriz de roles y rutas. |
| Fuzz | Headers de sesión y tokens arbitrarios no producen excepciones 500. |
| Integración | Cuentas existentes de sprints anteriores inician sesión y preservan su rol correspondiente. |
| Componentes Web | Redirección post-login por rol y renderizado de menús específicos en `AppHeader`. |

## Riesgos y decisiones

- Se preserva compatibilidad con cuentas creadas en Sprint 1 y 2 (`fia_admin`, `team_staff`).
- La guarda de rutas en TanStack Router utiliza `beforeLoad` para evitar flashes de contenido no autorizado.

## Secuencia de Commits Atómicos (máximo 5)

1. `feat(auth): ampliar catalogo de roles con driver y actualizar tipos de sesion`
2. `feat(api): agregar politicas de autorizacion y mapeo de sesion para nuevo rol`
3. `test(auth): agregar pruebas de matriz de acceso rol x ruta`
4. `feat(web): implementar redireccion post-login y guardas beforeLoad por rol`
5. `feat(web): adaptar AppHeader y navegacion para perfiles fia, escuderia, piloto y publico`
