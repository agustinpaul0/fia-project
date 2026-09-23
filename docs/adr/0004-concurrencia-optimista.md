# 0004 — Concurrencia optimista con columna `version`

- **Estado**: Aceptado (2026-09-23)

## Contexto

Varios administradores pueden editar el mismo registro (calendario, puntajes, sanciones). Sin control, el
último que guarda pisa en silencio los cambios del otro ("lost update").

## Decisión

- Toda tabla mutable tiene `version integer not null default 1` (+ `check version >= 1`) y `updated_at`.
- La respuesta incluye `version`; el formulario la reenvía al guardar (body en PUT, query `?version=` en DELETE).
- El repositorio actualiza/borra con `WHERE id = ? AND version = ?` y setea `version + 1`.
- 0 filas afectadas ⇒ el service confirma que el registro existe (si no, 404) y lanza `STALE_VERSION` (409)
  con un mensaje que invita a recargar.
- `created_at` y `updated_at` salen del mismo reloj (la app) para que el check `updated_at >= created_at` no
  falle por diferencias entre el reloj de Postgres y el de Node (bug detectado por los tests de mutación).

## Alternativas descartadas

- Bloqueo pesimista (`SELECT … FOR UPDATE`): mantiene locks mientras el usuario edita; no escala en una web.
- Comparar `updated_at`: frágil por la precisión de los timestamps; un entero es exacto.

## Consecuencias

- La UI debe manejar el 409 (mensaje + recargar). Tests de contrato e integración cubren el caso.
