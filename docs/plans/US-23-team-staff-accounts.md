# Plan: US-23 — Gestión de cuentas del personal de escuderías

- **Ítem del backlog**: US-23
- **Autor**: Joaquín · **Revisión técnica**: OpenCode · **Fecha**: 2026-09-25 · **Estado**: Aprobado
- **Rama**: `feat/us-23-team-staff-accounts`

## Objetivo

Permitir que el Personal Administrativo de la FIA cree, consulte, modifique y dé de baja cuentas del personal de
escuderías. Cada cuenta pertenece a una sola escudería, conserva su historial y puede autenticarse con rol
`team_staff` para usar las funcionalidades que el Sprint 1 asigna a ese rol.

## Alcance

### Incluido

- Alta, listado, edición y baja lógica de personal de escuderías.
- Contratos compartidos, errores propios, tabla `team_staff` y migraciones.
- Integración transaccional con las tablas de Better Auth.
- Corrección de los roles administrativos del plugin `admin` de Better Auth, necesaria para US-23.
- Lectura mínima de escuderías para el formulario de alta.
- Pantalla administrativa de gestión con formularios, confirmación y estados de UI.
- Unit, contrato, fuzz, tipos, integración y tests de componente.

### Fuera de alcance

- Reactivación de cuentas dadas de baja, cambios de email o de legajo y borrado físico.
- Envío de emails, restablecimiento de contraseña y verificación de email (US-4, US-26).
- Alta de pilotos (US-27), notificaciones y confirmación de puntajes (US-9).
- Búsqueda, paginación y permisos granulares sobre la lista de personal.

## Descubrimiento (respuestas)

| Pregunta | Respuesta | Fuente |
|---|---|---|
| ¿Qué rol ejecuta las acciones? | Sólo `fia_admin`. Sin sesión responde 401; con `team_staff` o `public` responde 403. | US-23, `docs/conventions/security.md` |
| ¿Quién ve los datos? | El listado completo, incluidas las cuentas dadas de baja, sólo para `fia_admin`. No se devuelven hashes, tokens ni motivos de ban. | US-23, seguridad |
| ¿Cómo es el alta? | `firstName`, `lastName`, `email`, `password`, `teamId`, `roleInTeam`, `phoneNumber`, `fileNumber`. Todos obligatorios. | PO, dev 2026-09-25 |
| ¿Cómo se normaliza y valida cada campo? | Nombres: 1–60 caracteres. Email: `emailSchema` (trim + minúsculas). Password: `passwordSchema` (12–128, mayúscula, minúscula y número). Cargo: texto de 2–60. Teléfono: 7–30 caracteres con dígitos, espacios, `+`, `-` o paréntesis. Legajo: 1–20 caracteres alfanuméricos con guion, normalizado a mayúsculas y único global. `teamId`: UUID de escudería existente. | `docs/features/auth/README.md`, dev 2026-09-25 |
| ¿Qué se puede editar? | `firstName`, `lastName`, `phoneNumber`, `roleInTeam`, `teamId` y `version`. `PUT` representa el reemplazo completo de esos campos. Email, legajo y estado no se editan. | dev 2026-09-25 |
| ¿Se puede reasignar de escudería? | Sí, mientras la cuenta esté activa. US-9 guardará la escudería en cada confirmación para que un cambio posterior no altere el historial. | dev 2026-09-25 |
| ¿Cómo es la baja? | Baja lógica terminal: `isActive=false`, `deactivatedAt`, `deactivatedBy` y ban de Better Auth con revocación de sesiones. No se reactiva en US-23. | PO, dev 2026-09-25 |
| ¿Se reutilizan email o legajo? | No. La fila y el usuario quedan reservados para preservar identidad e historial. | dev 2026-09-25 |
| ¿Quién recibe la contraseña inicial? | La define el administrador y se la entrega al miembro por un canal externo. La API no envía emails ni devuelve la contraseña. | PO, US-26 diferida |
| ¿Hay concurrencia? | Sí. Alta, edición y baja usan el mismo `version`; un conflicto devuelve 409 `STALE_VERSION`. | ADR 0004 |
| ¿Qué fechas se muestran? | `createdAt`, `updatedAt` y `deactivatedAt` viajan en UTC ISO 8601 y se muestran en `America/Argentina/Buenos_Aires`. | `docs/conventions/dates.md` |
| ¿Qué muestra la UI? | Carga: `LoadingState`/skeleton. Vacío: mensaje y acción de alta siempre visible en el encabezado. Error: `ErrorState` con reintento y toasts para mutaciones. Campos inválidos: mensajes inline. | `docs/conventions/react.md` |
| ¿Cómo se accede a la pantalla? | Sin sesión, el guard redirige a `/login`; con un rol distinto de `fia_admin`, redirige a `/` sin revelar la existencia de la ruta. | convención de seguridad |
| ¿Cómo se obtiene la lista de escuderías? | `GET /teams`, de sólo lectura y protegida con `requireRole('fia_admin')`. | decisión técnica US-23 |
| ¿Qué orden tiene el listado? | Por apellido, nombre e id, de forma determinista; incluye activas e inactivos. Sin paginación en Sprint 1. | decisión técnica US-23 |

**Preguntas abiertas para el PO** (copiadas a `BACKLOG.md`):

1. ¿Se ratifica que la baja es terminal y que correo y legajo no se reutilizan?
2. ¿El cargo queda como texto libre o el PO define una lista cerrada para US-23?
3. ¿Se ratifica que el teléfono es obligatorio con validación flexible?
4. ¿Se permite reasignar una cuenta activa y se ratifica que US-9 guardará la escudería histórica?
5. ¿El listado administrativo incluye siempre las cuentas dadas de baja?
6. ¿Se ratifica que la contraseña inicial se entrega fuera del sistema hasta que exista US-26?

Mientras el PO responda, rigen las decisiones provisionales del dev indicadas arriba; no bloquean el inicio. Si un cambio
afecta el schema, se genera una migración nueva.

## Decisiones de diseño

Se documentan en [ADR 0007](../adr/0007-identidad-y-membresia-de-escuderia.md).

### Fuente de verdad y proyecciones

- `team_staff` es la fuente canónica de identidad de negocio: nombre, apellido, teléfono, cargo, legajo, escudería y estado.
- `user.email` es la fuente canónica del correo y sólo existe en Better Auth.
- `user.role`, `user.team_id` y `user.name` son proyecciones de autenticación/sesión. El rol siempre es `team_staff`.
- Las proyecciones se escriben en la misma transacción que `team_staff`. Un test de integración falla si divergen.
- No se hard-deletean usuarios Better Auth desde este feature.

### Atomicidad

- `TeamStaffUnitOfWork` abre una transacción Drizzle y expone un `TeamStaffRepository` y un `StaffAccountsPort` creados
  sobre esa misma transacción.
- El adapter de Better Auth se crea con el ejecutor transaccional y `transaction: false` para no abrir una transacción
  anidada. Las llamadas internas `createUser`, `adminUpdateUser` y `banUser` reciben los headers del administrador para
  conservar la autorización de Better Auth.
- El service depende de ports, no de Drizzle ni de la instancia de Better Auth. La producción y los tests de
  integración construyen la UoW real; los tests unitarios usan una UoW en memoria.
- El primer test de integración debe demostrar que un fallo al insertar `team_staff` deshace `user` y `account`. Si
  Better Auth no puede compartir la transacción, se detiene la implementación y se vuelve a revisar esta decisión.

### Endurecimiento de Better Auth requerido

- Reemplazar `adminRole` por `adminRoles: ['fia_admin']` y definir `AccessControl` con `fia_admin`, `team_staff` y `public`.
- Dar a `fia_admin` sólo los permisos `user:create`, `user:update`, `user:set-role` y `user:ban`; los demás roles, ninguno.
- Agregar `session.impersonatedBy`, que el plugin `admin` de Better Auth 1.7.5 declara en su schema.
- Usar `createUser` con `role` y `data.teamId`; `teamId` conserva `input:false` para que el signup público no pueda elegirlo.
- Montar por allowlist sólo `/sign-in/email`, `/sign-out` y `/session`. Los endpoints admin de Better Auth no se exponen
  por HTTP; el servicio usa el port interno.
- Traducir `BANNED_USER` al error genérico `INVALID_CREDENTIALS` para no revelar que el correo existe.
- Quitar `adminClient` del cliente web: la gestión de personal usa los contratos de la aplicación.

## Cambios por capa

| Capa | Archivos a crear/modificar | Responsabilidad |
|---|---|---|
| shared/contracts | `contracts/team-staff.ts` + `*.test.ts` + `*.fuzz.test.ts` | Schemas estrictos de alta, edición, respuesta y mensajes; reutiliza `emailSchema` y `passwordSchema`. |
| shared/contracts | `contracts/teams.ts` + test | Schemas `teamOptionSchema` y `teamOptionListSchema` para el selector. |
| shared/contracts | `contracts/api-paths.ts`, `contracts/index.ts` | `API_PATHS.teamStaff`, helper por id y export del módulo. |
| shared/domain | `domain/errors/error-catalog.ts` | `TEAM_NOT_FOUND`, `STAFF_MEMBER_NOT_FOUND`, `STAFF_FILE_NUMBER_ALREADY_EXISTS`, `STAFF_MEMBER_INACTIVE`. |
| shared/db | `db/schema/auth.ts` | `session.impersonatedBy`. El campo `role` queda definido sólo por el plugin `admin` para evitar definiciones duplicadas. |
| shared/db | `db/schema/team-staff.ts`, `team-staff.test-d.ts`, `db/schema/index.ts` | Tabla, restricciones, checks, índices y paridad con el contrato. |
| shared/db | dos migraciones generadas | `pnpm db:generate --name add_better_auth_impersonated_by` y `pnpm db:generate --name create_team_staff`; no se edita `0001`. |
| api/core | `core/auth/better-auth.ts`, nuevo `core/auth/better-auth-roles.ts` | Config Access Control, roles, permisos y opciones de seguridad. |
| api/core | nuevo `core/auth/better-auth-error.ts`, `features/auth/auth.routes.ts` | Traducción de errores Better Auth y allowlist HTTP. |
| api/core | nuevo `core/db/transaction.ts` | Tipo y helper de transacción compartidos por la UoW. |
| api/team-staff | `team-staff.port.ts`, `team-staff-accounts.port.ts`, `team-staff-unit-of-work.port.ts` | Interfaces mínimas del repositorio, cuentas y UoW. |
| api/team-staff | `team-staff.repository.ts`, `team-staff.mapper.ts` | Join `team_staff` + `user` + `teams`, constraints, concurrencia y DTO sin secretos. |
| api/team-staff | `team-staff-accounts.adapter.ts`, `team-staff-unit-of-work.ts` | Adaptador Better Auth y UoW Drizzle de producción. |
| api/team-staff | `team-staff.service.ts` + un archivo por comando de escritura | Casos de uso `list`, `create`, `update` y `deactivate`; ninguno supera 100 líneas. |
| api/team-staff | `team-staff.routes.ts` | Endpoints con `requireRole('fia_admin')`, validación Zod y respuestas validadas. |
| api/teams | `teams.port.ts`, `teams.repository.ts`, `teams.service.ts`, `teams.routes.ts` | Lectura mínima de `id` y `name` para el formulario. |
| api/composición | `app/create-app.ts`, `app/app-dependencies.ts`, `app/production-dependencies.ts` | Registrar repositorios, UoW y rutas. |
| api/testing | `test-app.ts`, `team-staff-builders.ts`, `in-memory-team-staff.repository.ts`, `in-memory-team-staff-accounts.ts`, `in-memory-team-staff-unit-of-work.ts` | Fakes alineados con los ports para tests del service y de contrato. |
| web/auth | `lib/auth-client.ts` | Quitar el plugin `adminClient`. |
| web/teams | `features/teams/api/fetch-team-options.ts`, `hooks/use-team-options.ts` | Obtener escuderías habilitadas para el selector. |
| web/team-staff | `features/team-staff/api/*`, `hooks/*` | Cliente HTTP, query keys, queries y mutations con invalidación. |
| web/team-staff | `features/team-staff/components/*` | Tabla, formulario, diálogo de alta/edición y confirmación de baja, separados por responsabilidad. |
| web/guards | `features/auth/guards/require-fia-admin.ts` | Guard de sesión y rol para la ruta administrativa. |
| web/rutas | `routes/admin.team-staff.tsx`, `routeTree.gen.ts` | Ruta `/admin/team-staff`; el route tree es generado. |
| web/ui | componentes shadcn `dialog`, `alert-dialog`, `input`, `label`, `select`, `table` | Se agregan con `npx shadcn add`; los tests no dependen de clases CSS. |
| web/testing | builders y mocks nuevos | Reutilizar `renderWithQuery` y `mockFetch` sin duplicar datos. |
| docs | `docs/features/team-staff/README.md`, `features/auth/README.md`, `features/base-data/README.md`, `docs/how-to-document.md` | Comportamiento, endpoints, errores, pantallas e índice de features. |
| docs | `BACKLOG.md` | Tareas, criterios, horas reales, preguntas PO y link al PR. |

## API

| Método | Ruta | Acceso | Body / query | Respuesta |
|---|---|---|---|---|
| GET | `/teams` | `fia_admin` | — | 200 `TeamOption[]` |
| GET | `/team-staff` | `fia_admin` | — | 200 `TeamStaff[]`, activos e inactivos |
| POST | `/team-staff` | `fia_admin` | `CreateTeamStaffBody` | 201 `TeamStaff` |
| PUT | `/team-staff/:id` | `fia_admin` | `UpdateTeamStaffBody` con `version` | 200 `TeamStaff` |
| DELETE | `/team-staff/:id?version=N` | `fia_admin` | query `version` | 204 sin cuerpo |

No se agrega prefijo `/api`: las rutas de negocio siguen la convención de `/categories`; sólo Better Auth usa
`/api/auth`.

## Flujos

### Alta

1. La ruta valida sesión, rol y body.
2. La UoW confirma que la escudería existe.
3. `createUser` crea `user` con rol `team_staff`, nombre proyectado y `teamId`, y `account` con el hash de contraseña.
4. Se inserta `team_staff`; una violación de legajo o FK hace rollback de `user` y `account`.
5. La respuesta se valida contra `teamStaffSchema` y no incluye password, token, hash ni motivo de ban.

### Edición

1. Se valida el body completo y `version`.
2. La UoW obtiene la fila; 404 si no existe y 409 si está inactiva.
3. Se actualiza `team_staff` con `WHERE id AND version`; 0 filas ⇒ `STALE_VERSION`.
4. Se sincronizan `user.name` y `user.team_id`; un fallo de Better Auth hace rollback del cambio de negocio.
5. Se devuelve la fila con `version` incrementada.

### Baja

1. Se valida `version`.
2. La UoW actualiza `team_staff` con `isActive=false`, `deactivatedAt`, `deactivatedBy` y `version+1`, filtrando por
   `id` y `version`.
3. `banUser` marca `banned=true` y elimina las sesiones activas dentro de la misma transacción.
4. Se responde 204. Una baja repetida con la versión vigente es idempotente; una versión vieja sobre una cuenta activa
   devuelve `STALE_VERSION`.

## Restricciones de base de datos

Tabla `team_staff`:

| Columna | Tipo y regla |
|---|---|
| `id` | `uuid` primary key con `defaultRandom()`. |
| `user_id` | `text not null unique`, FK a `user(id) on delete restrict`. |
| `team_id` | `uuid not null`, FK a `teams(id) on delete restrict`, índice. |
| `first_name`, `last_name` | `varchar(60) not null`, no vacíos. |
| `role_in_team` | `varchar(60) not null`, largo efectivo ≥ 2. |
| `phone_number` | `varchar(30) not null`, formato `^[0-9+() -]{7,30}$`. |
| `file_number` | `varchar(20) not null unique`, formato `^[A-Z0-9-]{1,20}$`. |
| `is_active` | `boolean not null default true`. |
| `deactivated_at` | `timestamptz null`. |
| `deactivated_by` | `text null`, FK a `user(id) on delete restrict`. |
| `version` | `integer not null default 1`, `version >= 1`. |
| `created_at`, `updated_at` | `timestamptz not null`, `updated_at >= created_at`. |

Checks con nombres explícitos: `team_staff_first_name_not_blank`, `team_staff_last_name_not_blank`,
`team_staff_role_in_team_length`, `team_staff_phone_number_format`, `team_staff_file_number_format`,
`team_staff_deactivation_consistency`, `team_staff_version_positive` y `team_staff_updated_after_created`. Un único
constraint garantiza que una cuenta activa no tenga baja registrada y que una inactiva tenga ambos campos.

Índices: `team_staff_team_id_idx` para las consultas por escudería y `team_staff_list_idx` sobre
`(is_active, last_name, first_name)` para el listado. Los uniques se llaman `team_staff_user_id_unique` y
`team_staff_file_number_unique` para traducirlos a errores de dominio.

## Errores

| Acción inválida | code | status | Mensaje |
|---|---|---|---|
| Acceder sin sesión | `UNAUTHENTICATED` | 401 | Tenés que iniciar sesión para realizar esta acción. |
| Acceder con un rol no administrativo | `FORBIDDEN` | 403 | No tenés permisos para realizar esta acción. |
| Body, param, query o campo inválido | `VALIDATION_FAILED` | 400 | Hay datos inválidos. Revisá los campos marcados y volvé a intentar. |
| Email ya registrado | `USER_ALREADY_EXISTS` | 409 | Ya existe un usuario registrado con ese correo electrónico. |
| Legajo ya registrado | `STAFF_FILE_NUMBER_ALREADY_EXISTS` | 409 | Ya existe un miembro del personal con ese número de legajo. |
| Escudería inexistente | `TEAM_NOT_FOUND` | 404 | La escudería seleccionada no existe o fue eliminada. |
| Miembro inexistente | `STAFF_MEMBER_NOT_FOUND` | 404 | El miembro del personal no existe. |
| Editar una cuenta dada de baja | `STAFF_MEMBER_INACTIVE` | 409 | Esta cuenta está dada de baja. Creá una cuenta nueva para reemplazarla. |
| Editar o dar de baja con versión vieja | `STALE_VERSION` | 409 | Otra persona modificó este registro mientras lo editabas. Recargá para ver los cambios y volvé a intentar. |
| Iniciar sesión con una cuenta dada de baja | `INVALID_CREDENTIALS` | 401 | El correo electrónico o la contraseña son incorrectos. |
| Falla inesperada de Better Auth/DB | `INTERNAL_ERROR` | 500 | Ocurrió un error inesperado. Intentá de nuevo en unos minutos. |

No se agrega `STAFF_EMAIL_ALREADY_EXISTS` ni un error que diferencie una cuenta baneada: se reutiliza el catálogo y se
mantiene la enumeración de cuentas cerrada.

## Tests

| Tipo | Casos |
|---|---|
| Unit — contratos | Casos válidos e inválidos con mensaje exacto; normalización; campos extra; password; email; nombres; cargo; teléfono; legajo; `teamId`; `version`. |
| Fuzz — contratos | `fast-check` sobre el schema de alta y ninguno lanza ni acepta datos fuera del dominio. |
| Tipos | `team-staff.test-d.ts` verifica que DTO, body y fila Drizzle no diverjan. |
| Unit — Better Auth | Access Control: `fia_admin` puede crear/actualizar/banear; `team_staff` y `public` no; allowlist HTTP bloquea `/admin/*`; `BANNED_USER` se traduce. |
| Unit — service | Listado; alta; edición; baja; email y legajo duplicados; equipo inexistente; inactiva; versión vieja; orden de escrituras; Better Auth no escribe si falla el negocio. |
| Contrato — lectura | 401/403, 200 de lista y 200 de escuderías; request y response cumplen contratos; nunca se filtra password. |
| Contrato — escritura | 201, 200, 204, 400, 404 y cada 409 de la tabla de errores; un test por fila. |
| Fuzz — rutas | Ninguna entrada arbitraria produce 5xx; los errores conservan `{ error: { code, message, fields } }`. |
| Integración | Crear `user` + `account` + `team_staff`; fallo de FK/unique hace rollback; update stale no toca `user`; baja cambia `banned`, elimina sesiones y no borra historial; login posterior devuelve 401 genérico; escritura visible desde una conexión nueva. |
| Web | Tabla con activos/inactivos; formulario y validaciones inline; mutation correcta; error con reintento; toasts; confirmación de baja; guard sin sesión y con rol incorrecto. |

## Criterios de aceptación → test

| Criterio de `BACKLOG.md` | Verificación |
|---|---|
| Los datos almacenados perduran y son consistentes | Integración de escritura/relectura, constraints, rollback atómico e invariante de proyecciones. |
| Acciones consistentes: una cuenta dada de baja no vuelve a ingresarse | Integración create → deactivate → sign-in 401 → email y legajo reservados. |
| Las cuentas acceden a sus funcionalidades | Sign-in real devuelve rol `team_staff` y `teamId` correctos. La confirmación funcional de US-9 se cubre en US-9. |
| Interfaz de gestión | Tests de componente del alta, edición, listado y baja; estados de carga, vacío y error. |

## Orden de implementación (TDD)

1. **Contratos y errores**: tests de contratos, fuzz y catálogo; recién después implementación.
2. **Better Auth**: test de Access Control y migración `impersonated_by`; corregir roles antes de usar el plugin admin.
3. **Schema**: `team_staff.test-d.ts`, checks, índices y migración generada.
4. **Ports y fakes**: repositorio, cuentas, UoW y sus implementaciones en memoria.
5. **Prueba de viabilidad de integración**: Better Auth + Drizzle sobre la misma transacción; debe pasar rollback antes de seguir.
6. **Repositorio y adapter reales**: joins, traducción de constraints y errores de Better Auth.
7. **Service por comandos**: reglas, permisos, versión y sincronización.
8. **Rutas**: lectura, escritura, `/teams`, tests de contrato y fuzz.
9. **Web**: API → hooks → componentes → guard/ruta → shadcn.
10. **Cierre**: `docs/features/team-staff/README.md`, auth/base-data, `BACKLOG.md`, horas reales y `pnpm verify`.

## Riesgos y decisiones

- **Compatibilidad de Better Auth con la UoW**: riesgo principal. Se reduce con un test de rollback como segundo paso
  obligatorio; no se construye UI antes de demostrarlo.
- **Correcciones heredadas de T-1**: `adminRole`, permisos de Access Control e `impersonatedBy` forman parte del alcance
  de US-23 porque la historia depende de crear y banear cuentas reales.
- **Deriva de proyecciones**: la integración comprueba `role`, `team_id` y `name` contra `team_staff` después de cada
  operación de escritura.
- **Escritura de dos dominios**: cualquier error de Better Auth se traduce en el límite de `StaffAccountsPort`; nunca
  sale un `APIError` crudo.
- **Estimación**: los 17 h del PO no incluyen necesariamente el arreglo de Better Auth, la UoW y `GET /teams`. El equipo
  registra horas reales por tarea y no amplía el alcance con reactivación, email, búsqueda o paginación.
- **Entrega de credenciales**: sin email hasta US-26; la UI indica que el administrador debe entregarla por un canal
  externo.

## Cierre y puertas

- [ ] Cada fila de errores tiene un test y aparece en `docs/features/team-staff/README.md`.
- [ ] Cada criterio de aceptación tiene al menos un test.
- [ ] Los archivos de código y tests respetan 100 líneas; funciones ≤ 40 líneas y ≤ 3 parámetros.
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test:coverage` e integración verdes.
- [ ] `pnpm verify` verde: cobertura ≥ 90/85, mutación ≥ 70 y build OK.
- [ ] `BACKLOG.md` con tareas/criterios tildados, horas reales y link al PR.
- [ ] ADR 0007 y README del feature actualizados en el mismo PR.
