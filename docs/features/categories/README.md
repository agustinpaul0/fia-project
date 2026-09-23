# Feature: categorías

- **US relacionadas**: base del modelo de datos (T-2). Es la **implementación de referencia**: copiá su
  estructura para cada feature nuevo.
- **Código**: `packages/shared/src/contracts/categories.ts`, `packages/shared/src/db/schema/categories.ts`,
  `apps/api/src/features/categories/`, `apps/web/src/features/categories/`

## Qué hace

Administra las categorías que gestiona la FIA (Fórmula 1, Fórmula 2, Fórmula 3, F1 Academy). El público las
consulta; sólo la administración de la FIA las crea, modifica o elimina.

## Reglas de negocio

- Nombre: 2 a 60 caracteres, único.
- Código: 2 a 10 letras mayúsculas o números, único (p. ej. `F1`, `F1A`).
- Edición y borrado con concurrencia optimista (`version`).

## Roles y permisos

| Acción | fia_admin | team_staff | public |
|---|---|---|---|
| Listar / ver | ✓ | ✓ | ✓ |
| Crear / modificar / eliminar | ✓ | ✗ (403) | ✗ (401) |

## API

| Método | Ruta | Acceso | Body / query | Respuesta |
|---|---|---|---|---|
| GET | `/categories` | público | — | 200 `Category[]` ordenadas por nombre |
| GET | `/categories/:id` | público | — | 200 `Category` |
| POST | `/categories` | fia_admin | `{ name, code }` | 201 `Category` |
| PUT | `/categories/:id` | fia_admin | `{ name, code, version }` | 200 `Category` (versión + 1) |
| DELETE | `/categories/:id` | fia_admin | `?version=N` | 204 |

## Datos

Tabla `categories`: `id uuid`, `name varchar(60)`, `code varchar(10)`, `version`, `created_at`, `updated_at`.
Restricciones: `categories_name_unique`, `categories_code_unique`, `categories_name_min_length`,
`categories_code_format`, `categories_version_positive`, `categories_updated_after_created`.

## Errores

| Acción inválida | code | status | Mensaje |
|---|---|---|---|
| Crear/editar sin sesión | `UNAUTHENTICATED` | 401 | Tenés que iniciar sesión para realizar esta acción. |
| Crear/editar con otro rol | `FORBIDDEN` | 403 | No tenés permisos para realizar esta acción. |
| Nombre o código inválidos, campos extra, id no UUID | `VALIDATION_FAILED` | 400 | Hay datos inválidos… (+ mensaje por campo) |
| Nombre o código repetidos | `CATEGORY_ALREADY_EXISTS` | 409 | Ya existe una categoría con ese nombre o código. |
| Ver/editar/eliminar una inexistente | `CATEGORY_NOT_FOUND` | 404 | La categoría no existe o fue eliminada. |
| Editar/eliminar con versión vieja | `STALE_VERSION` | 409 | Otra persona modificó este registro… Recargá… |

## Pantallas

- `/` → `CategoriesSection`: lista en tarjetas con estados de carga, vacío ("Todavía no hay categorías
  cargadas.") y error con reintento.
