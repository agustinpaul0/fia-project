# Feature: personal de escuderías

- **US relacionadas**: US-23 (Gestión de cuentas del personal de escuderías — Sprint 1).
- **Código**:
  - `packages/shared/src/contracts/team-staff.ts`, `packages/shared/src/contracts/teams.ts`
  - `packages/shared/src/db/schema/team-staff.ts`
  - `apps/api/src/features/team-staff/`, `apps/api/src/features/teams/`
  - `apps/web/src/features/team-staff/`, `apps/web/src/features/teams/`

## Qué hace

Permite al administrador de la FIA (`fia_admin`) dar de alta, consultar, actualizar y dar de baja las cuentas del personal de las escuderías participantes. La baja es lógica y permanente: deshabilita el acceso de autenticación en Better Auth (`banned = true`), elimina sus sesiones activas y preserva el registro histórico sin permitir reactivaciones.

## Reglas de negocio

- **Nombre y apellido**: 1 a 60 caracteres no vacíos.
- **Cargo en la escudería**: 2 a 60 caracteres significativos.
- **Teléfono**: formato internacional o nacional `^[0-9+() -]{7,30}$`.
- **Legajo**: formato alfanumérico en mayúsculas `^[A-Z0-9-]{1,20}$`, único en el sistema.
- **Inmutabilidad**: el correo electrónico y el legajo quedan permanentemente fijados tras la creación.
- **Concurrencia optimista**: actualización y baja requieren coincidencia de `version`.
- **Baja lógica**: una cuenta dada de baja no puede volver a registrarse con el mismo legajo o email, no puede editarse y no puede iniciar sesión (devuelve 401 genérico).
- **Entrega de credenciales**: se realiza por canal externo seguro (notificaciones diferidas a US-26).

## Roles y permisos

| Acción | fia_admin | team_staff | public |
|---|---|---|---|
| Listar escuderías (`GET /teams`) | ✓ | ✗ (403) | ✗ (401) |
| Listar personal (`GET /team-staff`) | ✓ | ✗ (403) | ✗ (401) |
| Crear integrante (`POST /team-staff`) | ✓ | ✗ (403) | ✗ (401) |
| Editar integrante (`PUT /team-staff/:id`) | ✓ | ✗ (403) | ✗ (401) |
| Dar de baja (`DELETE /team-staff/:id?version=N`) | ✓ | ✗ (403) | ✗ (401) |

## API

| Método | Ruta | Acceso | Body / query | Respuesta |
|---|---|---|---|---|
| GET | `/teams` | `fia_admin` | — | 200 `TeamOption[]` ordenadas por nombre |
| GET | `/team-staff` | `fia_admin` | — | 200 `TeamStaff[]` ordenadas por apellido y nombre |
| POST | `/team-staff` | `fia_admin` | `CreateTeamStaffBody` | 201 `TeamStaff` |
| PUT | `/team-staff/:id` | `fia_admin` | `UpdateTeamStaffBody` | 200 `TeamStaff` (versión incrementada) |
| DELETE | `/team-staff/:id` | `fia_admin` | `?version=N` | 204 sin cuerpo |

## Datos

Tabla `team_staff`:
- `id uuid primary key`
- `user_id text not null unique fk -> user(id)`
- `team_id uuid not null fk -> teams(id)`
- `first_name varchar(60) not null`, `last_name varchar(60) not null`
- `role_in_team varchar(60) not null`
- `phone_number varchar(30) not null`
- `file_number varchar(20) not null unique`
- `is_active boolean not null default true`
- `deactivated_at timestamptz null`
- `deactivated_by text null fk -> user(id)`
- `version integer not null default 1`
- `created_at timestamptz not null`, `updated_at timestamptz not null`

Restricciones: `team_staff_first_name_not_blank`, `team_staff_last_name_not_blank`, `team_staff_role_in_team_length`, `team_staff_phone_number_format`, `team_staff_file_number_format`, `team_staff_deactivation_consistency`, `team_staff_version_positive`, `team_staff_updated_after_created`.
Índices: `team_staff_team_id_idx` y `team_staff_list_idx`.

## Errores

| Acción inválida | code | status | Mensaje |
|---|---|---|---|
| Acceder sin sesión | `UNAUTHENTICATED` | 401 | Tenés que iniciar sesión para realizar esta acción. |
| Acceder con un rol no administrativo | `FORBIDDEN` | 403 | No tenés permisos para realizar esta acción. |
| Datos inválidos en body, params o query | `VALIDATION_FAILED` | 400 | Hay datos inválidos. Revisá los campos marcados y volvé a intentar. |
| Correo electrónico ya registrado | `USER_ALREADY_EXISTS` | 409 | Ya existe un usuario registrado con ese correo electrónico. |
| Legajo ya registrado | `STAFF_FILE_NUMBER_ALREADY_EXISTS` | 409 | Ya existe un miembro del personal con ese número de legajo. |
| Escudería inexistente | `TEAM_NOT_FOUND` | 404 | La escudería seleccionada no existe o fue eliminada. |
| Miembro no encontrado | `STAFF_MEMBER_NOT_FOUND` | 404 | El miembro del personal no existe. |
| Intentar editar una cuenta dada de baja | `STAFF_MEMBER_INACTIVE` | 409 | Esta cuenta está dada de baja. Creá una cuenta nueva para reemplazarla. |
| Modificar o dar de baja con versión vieja | `STALE_VERSION` | 409 | Otra persona modificó este registro mientras lo editabas. Recargá para ver los cambios y volvé a intentar. |
| Iniciar sesión con cuenta dada de baja | `INVALID_CREDENTIALS` | 401 | El correo electrónico o la contraseña son incorrectos. |

## Pantallas

- `/admin/team-staff` → `TeamStaffSection`:
  - Totales de integrantes activos y escuderías vinculadas (sólo cuentas activas).
  - Búsqueda por nombre, email, escudería o legajo (sin distinguir tildes ni mayúsculas), filtro por escudería y
    botón **Limpiar**.
  - Listado completo en tabla con iniciales, nombre y legajo, email, teléfono, escudería (con su color), cargo y
    estado (activo/inactivo). Las acciones se deshabilitan en cuentas dadas de baja.
  - Diálogo de alta con `react-hook-form` y el schema del contrato: cada campo inválido se marca con su mensaje
    antes de enviar, se muestran las reglas de contraseña, teléfono y legajo, y los errores que devuelve la API
    (`fields` de `VALIDATION_FAILED`, email o legajo repetido) se pintan en el campo que corresponde.
  - Diálogo de edición precargado con bloqueo de email y legajo, con la misma validación por campo.
  - Diálogo de confirmación de baja con advertencia de irreversibilidad.
  - Protegido por el guard `RequireFiaAdmin`.
  - Estilo según [ADR 0009](../../adr/0009-sistema-visual.md).
