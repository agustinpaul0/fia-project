# Manejo de errores

Objetivo: **la app nunca crashea** y toda acción inválida devuelve un error claro y accionable.

## Catálogo único

`packages/shared/src/domain/errors/error-catalog.ts` define cada error una sola vez:

```ts
STALE_VERSION: {
  status: 409,
  message: 'Otra persona modificó este registro mientras lo editabas. Recargá para ver los cambios y volvé a intentar.',
},
```

- `code` en UPPER_SNAKE_CASE, específico del dominio cuando aplica (`CATEGORY_NOT_FOUND`, no sólo `NOT_FOUND`).
- `message` en español, en segunda persona, diciendo **qué pasó y qué puede hacer** el usuario. Termina en punto.
- Front y back usan el mismo catálogo: el front muestra `error.message` tal cual.

## Formato de respuesta

```json
{ "error": { "code": "VALIDATION_FAILED", "message": "Hay datos inválidos…", "fields": { "name": ["El nombre debe tener al menos 2 caracteres."] } } }
```

`fields` es `null` salvo en validaciones; `_form` agrupa errores que no son de un campo (p. ej. campos extra).

## Backend

| Origen | Resultado |
|---|---|
| `throw new AppError('X')` en un service | status y mensaje del catálogo |
| Validación Zod de entrada | 400 `VALIDATION_FAILED` con `fields` |
| JSON mal formado | 400 `VALIDATION_FAILED` |
| Restricción de Postgres violada | el código mapeado en el repositorio (409/400) |
| Ruta inexistente | 404 `ROUTE_NOT_FOUND` |
| Body demasiado grande | 413 `PAYLOAD_TOO_LARGE` |
| Respuesta que no cumple su contrato | 500 `INTERNAL_ERROR` (se loguea) |
| Cualquier otra excepción | 500 `INTERNAL_ERROR` genérico, detalle sólo en el log |
| Promesa rechazada o excepción fuera de un request | se loguea; el proceso sigue vivo |

Nunca `throw 'texto'`, nunca `throw new Error(...)` para errores de negocio, nunca `try/catch` que silencie.

## Frontend

| Situación | Cómo se muestra |
|---|---|
| Falla una query | `ErrorState` inline con botón "Reintentar" (vía `QueryView`) |
| Falla una mutación | toast con el mensaje (`notifyError`, configurado en el `MutationCache`) |
| Error de validación | mensaje inline por campo (`fields`) |
| `STALE_VERSION` | mensaje + acción de recargar el registro |
| Sin conexión | `NETWORK_ERROR`, reintento automático hasta 2 veces |
| Respuesta inválida | `INTERNAL_ERROR` genérico |
| Error de render o de ruta | `RouteErrorFallback` (nunca pantalla en blanco) |
| Ruta inexistente | `NotFoundPage` |

## Obligatorio al implementar un feature

1. Listar las acciones inválidas en el plan (skill `start-task`).
2. Agregar los códigos al catálogo.
3. Documentarlas en `docs/features/<f>/README.md` con la tabla *acción inválida → code → status → mensaje*.
4. Un test por fila; el fuzz verifica que ninguna entrada produzca 5xx.
