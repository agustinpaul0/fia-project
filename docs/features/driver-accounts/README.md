# Feature: cuentas oficiales de pilotos

- **US relacionadas**: US-27 (Sprint 3). Depende de US-10 (pilotos), US-23 (servicio de cuentas) y US-29 (roles).
- **Código**:
  - `packages/shared/src/contracts/driver-accounts.ts`, `packages/shared/src/db/schema/driver-accounts.ts`
  - `apps/api/src/features/driver-accounts/`
  - `apps/web/src/features/driver-accounts/`, `apps/web/src/routes/admin.drivers.tsx`

## Qué hace

El personal de la FIA crea, modifica y da de baja la cuenta de usuario oficial de cada piloto registrado por
las escuderías. La cuenta tiene rol `driver` ("Piloto") y se muestra con la insignia **Piloto oficial** en el
encabezado (perfil), en el listado de la FIA y en el chat, para distinguirla de una cuenta común.

## Reglas de negocio

- Cada piloto tiene **una sola cuenta** (`driver_accounts_driver_id_unique`).
- El mail es único en todo el sistema y **no se reutiliza**: la baja conserva el usuario (bloqueado), así que
  su mail sigue ocupado.
- La contraseña inicial la define el administrador, como en US-23.
- Se modifica el nombre visible; piloto y mail quedan fijos.
- **Baja lógica**: `is_active = false`, se registra quién y cuándo, el usuario queda `banned` y se cierran sus
  sesiones. La cuenta sigue en el listado como **Inactiva** y no se puede volver a editar.
- Concurrencia optimista con `version` en modificación y baja. Repetir la baja con la versión ya dada de baja
  es idempotente.
- La creación del usuario en Better Auth y el registro en `driver_accounts` ocurren en la misma transacción.

## Roles y permisos

| Acción | fia_admin | team_staff | driver | public |
|---|---|---|---|---|
| Listar (`GET /driver-accounts`) | ✓ | 403 | 403 | 401 |
| Crear (`POST /driver-accounts`) | ✓ | 403 | 403 | 401 |
| Modificar (`PUT /driver-accounts/:id`) | ✓ | 403 | 403 | 401 |
| Dar de baja (`DELETE /driver-accounts/:id?version=N`) | ✓ | 403 | 403 | 401 |

## API

| Método | Ruta | Body / query | Respuesta |
|---|---|---|---|
| GET | `/driver-accounts` | — | 200 `DriverAccount[]` por apellido del piloto |
| POST | `/driver-accounts` | `{ driverId, email, password, name }` | 201 `DriverAccount` |
| PUT | `/driver-accounts/:id` | `{ name, version }` | 200 `DriverAccount` |
| DELETE | `/driver-accounts/:id` | `?version=N` | 200 `DriverAccount` (inactiva) |

## Errores

| Acción inválida | code | status | Mensaje | Test |
|---|---|---|---|---|
| Piloto inexistente | `DRIVER_NOT_FOUND` | 404 | (catálogo) | `driver-accounts.routes.create.test.ts` |
| Segunda cuenta para el mismo piloto | `DRIVER_ACCOUNT_ALREADY_EXISTS` | 409 | El piloto seleccionado ya cuenta con un usuario oficial… | ídem + `.int.test.ts` |
| Mail ya usado (incluso por una cuenta dada de baja) | `USER_ALREADY_EXISTS` | 409 | Ya existe un usuario registrado con ese correo electrónico. | ídem |
| Cuenta inexistente | `DRIVER_ACCOUNT_NOT_FOUND` | 404 | La cuenta oficial del piloto solicitada no existe. | `.routes.lifecycle.test.ts` |
| Modificar una cuenta dada de baja | `DRIVER_ACCOUNT_INACTIVE` | 409 | La cuenta del piloto está dada de baja y no se puede modificar. | ídem |
| Versión vieja | `STALE_VERSION` | 409 | (catálogo) | ídem |
| Otro rol / sin sesión | `FORBIDDEN` / `UNAUTHENTICATED` | 403 / 401 | (catálogo) | `.routes.create.test.ts` |

## Pantallas

- `/admin/drivers` (sólo FIA): listado con estado, alta (ofrece sólo pilotos sin cuenta), edición del nombre y
  baja con confirmación.
