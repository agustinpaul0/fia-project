# Plan: US-27 — Crear, modificar y eliminar cuentas de usuario de los pilotos

- **Ítem del backlog**: US-27
- **Autor**: Argon 4 / Antigravity · **Fecha**: 2026-10-29 · **Estado**: Implementado
- **Rama**: `feat/us-27-driver-accounts`

> **Instrucciones Obligatorias para Argon 4:**
> 1. Consultar y aplicar todas las directivas de [`AGENTS.md`](../AGENTS.md): máximo 100 líneas por archivo de código, cero comentarios, tipado estricto, capas `routes → service → repository → db`, sin SQL plano.
> 2. Seguir el flujo de trabajo en [`docs/workflow.md`](../workflow.md) y [`docs/testing.md`](../testing.md).
> 3. Implementar mediante un máximo de 5 commits atómicos en Conventional Commits en español.

## Objetivo

Permitir al Personal Administrativo de la FIA (`fia_admin`) gestionar el ciclo de vida de las cuentas de usuario oficiales para los pilotos registrados en el sistema (alta con contraseña inicial definida por el admin, modificación y baja lógica), garantizando unicidad de cuenta por piloto y mostrando una insignia oficial visible en perfil, listados y chat.

## Descubrimiento (respuestas)

| Pregunta | Respuesta | Fuente (US, dev, PO) |
|---|---|---|
| ¿Qué rol ejecuta la acción? | Exclusivamente `fia_admin`. Cualquier otro rol (`team_staff`, `driver`, `public`) recibe 401/403. | US-27, PO |
| ¿Qué datos entran y salen? | Entrada: `driverId` (UUID de piloto existente en US-10), email único, contraseña inicial, nombre de usuario. Salida: DTO de cuenta de piloto con estado (activo/inactivo), rol `driver`, insignia oficial y versión. | US-27, US-23 |
| ¿Hay concurrencia? | Sí, campo `version` en la cuenta para evitar modificaciones simultáneas (concurrencia optimista). | ADR 0004 |
| ¿Qué se muestra en carga / vacío / error? | Carga: `QueryView` con spinner. Vacío: "No hay cuentas de pilotos registradas.". Error: mensaje brutalista con reintento. | UI conventions |

## Cambios por capa

| Capa | Archivos a crear/modificar | Responsabilidad |
|---|---|---|
| `shared/contracts` | `contracts/driver-accounts.ts`, `api-paths.ts` | Schemas Zod de creación, edición, lista y DTO de cuentas de pilotos. |
| `shared/domain` | `domain/errors/error-catalog.ts` | Errores `DRIVER_ACCOUNT_ALREADY_EXISTS`, `DRIVER_NOT_FOUND`, `EMAIL_ALREADY_EXISTS`. |
| `shared/db` | `db/schema/auth.ts`, `schema/index.ts` | Agregar columna `driver_id` en `user` con FK a `drivers.id` y restricción `unique`. Migración Drizzle. |
| `api` | `features/driver-accounts/*` | Port, repositorio Drizzle, servicio (con soft delete vía Better Auth / ban), rutas FIA. |
| `web` | `features/driver-accounts/*`, `routes/admin.drivers.tsx`, `components/brand/OfficialBadge.tsx` | Pantalla de administración FIA, diálogo de alta/edición, e insignia de cuenta oficial. |

## Restricciones de base de datos

- FK `user.driver_id` → `drivers.id` (`onDelete: restrict`).
- Restricción `unique` en `user.driver_id`: un piloto solo puede tener una única cuenta de usuario.
- Restricción `unique` en `user.email`: emails únicos y no reutilizables tras baja lógica.
- Campo `version` para concurrencia optimista en updates.

## Errores

| Acción inválida | code | status | Mensaje |
|---|---|---|---|
| Piloto ya tiene cuenta asociada | `DRIVER_ACCOUNT_ALREADY_EXISTS` | 409 | El piloto seleccionado ya cuenta con un usuario oficial registrado en el sistema. |
| Piloto seleccionado no existe | `DRIVER_NOT_FOUND` | 404 | El piloto indicado no existe en el sistema. |
| Email ya registrado en otra cuenta | `EMAIL_ALREADY_EXISTS` | 409 | Ya existe una cuenta registrada con este correo electrónico. |
| No autenticado o sin rol FIA | `FORBIDDEN` | 403 | No tenés los permisos requeridos para acceder a este recurso. |
| Concurrencia de edición | `STALE_VERSION` | 409 | Otra persona modificó este registro mientras lo editabas. Recargá para ver los cambios y volvé a intentar. |

## Tests

| Tipo | Casos |
|---|---|
| Unit (service) | Creación vinculada a piloto, rechazo si ya tiene cuenta, soft delete y revocación de sesiones. |
| Contrato (caja negra) | `POST /driver-accounts` (201 fia_admin, 401 anónimo, 403 team_staff), `GET` listado, `PUT` edición y `DELETE` baja lógica. |
| Fuzz | Payloads aleatorios en endpoints de cuentas de pilotos no causan excepciones no controladas. |
| Integración | Persistencia atómica de cuenta de Better Auth y enlace con tabla `drivers` en PostgreSQL. |
| Componentes Web | Formulario de alta con selector de piloto, lista con filtro activo/inactivo e insignia oficial visible. |

## Riesgos y decisiones

- Se reutiliza la arquitectura transaccional de `team-staff` (ADR 0007) para sincronizar Better Auth y los metadatos de dominio de manera atómica.
- La eliminación es soft delete (`banned = true`), impidiendo futuros logins y preservando la trazabilidad histórica.

## Secuencia de Commits Atómicos (máximo 5)

1. `feat(drivers): agregar columna driver_id en user y contratos de cuentas de pilotos`
2. `feat(driver-accounts): crear repositorio drizzle y pruebas de integracion en postgres`
3. `feat(driver-accounts): implementar servicio de cuentas de pilotos con baja logica`
4. `feat(driver-accounts): exponer endpoints fia_admin con validacion zod y tests de contrato`
5. `feat(web): implementar vista admin de cuentas de pilotos e insignia de cuenta oficial`
