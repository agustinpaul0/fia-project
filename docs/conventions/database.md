# Base de datos (Drizzle + PostgreSQL)

## Reglas

- **Todo acceso por Drizzle** y sólo desde `*.repository.ts`. **Prohibido SQL plano**: Biome bloquea importar
  `sql` de `drizzle-orm` y usar `pg` fuera de `packages/shared/src/db` (donde `sql` se usa sólo en `check()`) y
  `apps/api/src/core/db`.
- El schema vive en `packages/shared/src/db/schema/<feature>.ts`, uno por feature, exportado desde `index.ts`.
- Migraciones: `pnpm db:generate --name <descripcion_en_snake_case>` y se commitean. **Nunca** se editan a mano ni
  se borran migraciones ya mergeadas: se genera una nueva.
- Timestamps con zona horaria (`timestamptz`), en UTC, generados por el reloj de la app (`columns.ts`).

## Checklist de restricciones (todas las que apliquen)

- [ ] `.notNull()` en toda columna salvo que la ausencia tenga significado de negocio.
- [ ] `varchar(n)` con el mismo largo máximo que el contrato Zod.
- [ ] `pgEnum` o `check` para dominios cerrados.
- [ ] `unique` simples y compuestos (p. ej. un piloto por número por temporada).
- [ ] `check` para rangos y coherencia (puntos ≥ 0, posición ≥ 1, fin ≥ inicio, formatos con regex).
- [ ] FKs con `onDelete` explícito (`restrict` por defecto; `cascade` sólo si es composición real).
- [ ] Índices para las columnas por las que se filtra u ordena.
- [ ] `...versionedColumns()` y `...versionedChecks(tabla, t)` en toda tabla mutable.
- [ ] Nombres de restricciones explícitos (`<tabla>_<columna>_<tipo>`), porque se usan para traducir errores.

## Traducción de violaciones

Cada repositorio declara un mapa `restricción → código de error` y envuelve inserts/updates con
`translateConstraintViolations`. Así un `unique` violado se convierte en `409 <X>_ALREADY_EXISTS` y un `check`
en `400 VALIDATION_FAILED`, nunca en un 500.

## Concurrencia optimista

- Update: `.set({ ...campos, version: version + 1 }).where(and(eq(t.id, id), eq(t.version, version)))`.
- Delete: `.where(and(eq(t.id, id), eq(t.version, version)))`.
- 0 filas afectadas ⇒ el service lanza `STALE_VERSION` (409) tras confirmar que el registro existe (404 si no).

## Excepciones documentadas

- Tablas de Better Auth (`user`, `session`, `account`, `verification`): las gestiona la librería (ADR 0003).
- `seed/`: usa Drizzle directo con `onConflictDoNothing` para ser idempotente.
