# 0006 — Catálogo único de errores compartido

- **Estado**: Aceptado (2026-09-23)

## Decisión

Un catálogo (`packages/shared/src/domain/errors/error-catalog.ts`) con `code → { status, message }` en
español, una clase `AppError` compartida, un manejador global en Hono que responde siempre
`{ error: { code, message, fields } }` y un cliente HTTP en la web que convierte toda falla (incluida la red) en
`AppError`. Las violaciones de restricciones de Postgres se traducen en el repositorio. Nada inesperado llega
crudo al usuario ni tira el proceso.

## Consecuencias

- Cada feature documenta su tabla de errores y la testea (Definition of Done).
- Cambiar un mensaje es cambiar una línea, y front y back quedan alineados.
