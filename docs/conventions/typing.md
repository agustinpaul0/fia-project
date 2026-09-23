# Tipado

TypeScript en modo estricto al máximo (`tsconfig.base.json`): `strict`, `noUncheckedIndexedAccess`,
`exactOptionalPropertyTypes`, `noImplicitReturns`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`,
`noUnusedLocals/Parameters`.

## Reglas

- **Prohibido `any`** (Biome `noExplicitAny`). Para datos desconocidos: `unknown` + validación con Zod o type
  guard.
- **Prohibido `!`** (non-null assertion). Se maneja el caso `null`/`undefined` explícitamente.
- **`as` sólo en fronteras ya validadas** y justificado; nunca para "callar" al compilador.
- **Tipos de retorno explícitos** en toda función exportada y en todo componente (`: ReactNode`).
- **Ausencia explícita**: un valor que puede faltar se modela como `T | null`, no con `undefined` ni props
  opcionales. Las props/campos opcionales (`?`) sólo para inputs realmente opcionales (overrides de builders,
  opciones con default).
- **Estructuras de datos con tipo propio**: nada de objetos anónimos repetidos. Si una forma se usa en más de
  un lugar, tiene nombre.
- **Una sola fuente de tipos**: los DTOs se infieren de los schemas Zod de `@fia/shared/contracts`
  (`z.infer<typeof schema>`); las filas, de las tablas Drizzle (`$inferSelect`). Nunca se redeclaran a mano en
  la web ni en la API. Un test de tipos (`*.test-d.ts`) verifica que tabla y contrato no diverjan.
- `readonly` en propiedades y arrays de datos que no se mutan.
- Variables de entorno con índice: `process.env['X']` / `import.meta.env['X']` (lo exige
  `noPropertyAccessFromIndexSignature`) y siempre validadas con Zod.
