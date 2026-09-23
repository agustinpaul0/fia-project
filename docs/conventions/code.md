# Convenciones de código

## Principios

- **SOLID**, con foco en la **S (responsabilidad única)**: un archivo hace una cosa y tiene una sola razón para
  cambiar. Si para describir un archivo necesitás "y", se divide.
  - **O**: se extiende agregando (un feature nuevo, una fila nueva en el catálogo de errores), no modificando lo
    que funciona.
  - **L**: toda implementación de un port (Drizzle o en memoria) cumple el mismo contrato; los tests del service
    valen para ambas.
  - **I**: ports chicos y específicos del feature (`CategoriesRepository`), no un repositorio genérico gigante.
  - **D**: los services dependen de ports, no de Drizzle; las dependencias se inyectan en `createApp`.
- **Clean code**: nombres que expliquen la intención, funciones chicas, sin efectos ocultos, sin duplicación,
  retornos tempranos en vez de `if` anidados.

## Límites (los aplica Biome, bloquean el commit)

| Límite | Valor |
|---|---|
| Líneas por archivo de código (incluye tests, CSS y configs) | **100** |
| Líneas por función | 40 (no aplica a los `describe` de tests) |
| Parámetros por función | 3 (más ⇒ un objeto con tipo propio) |
| Complejidad cognitiva | la de Biome por defecto |

Excepciones: sólo código generado (migraciones, `routeTree.gen.ts`) y las skills de terceros. No aplica a
Markdown, JSON ni YAML.

## Comentarios

**Cero comentarios.** El código se explica con nombres, tipos y funciones chicas. Única excepción: un
comentario **en español** que explique un *por qué* que el código no puede expresar (una regla del reglamento
de la FIA, un workaround de una librería con link al issue). Nunca comentarios que repiten el *qué*, código
comentado, `TODO` sin ítem en el backlog ni JSDoc.

## Nombres

| Qué | Estilo | Ejemplo |
|---|---|---|
| Archivos | kebab-case con sufijo de rol | `categories.service.ts`, `category-card.tsx` |
| Variables y funciones | camelCase, verbo para funciones | `findOrFail`, `createCategoriesService` |
| Tipos | PascalCase, sin prefijo `I` | `CategoriesRepository`, `SessionUser` |
| Constantes de módulo | UPPER_SNAKE_CASE | `ERROR_CATALOG`, `MAX_BODY_BYTES` |
| Componentes React | PascalCase | `CategoriesSection` |
| Hooks | `use` + sustantivo | `useCategories` |
| Tests | descripción en español del comportamiento | `'rechaza actualizar con una versión vieja'` |
| Tablas y columnas | snake_case plural (tablas) | `categories.created_at` |

Identificadores en inglés; textos visibles al usuario, mensajes de error, tests y docs en español.

## Estructura

- Exports nombrados siempre (sin `export default`, salvo configs que lo exigen).
- Factories (`createXService(deps)`) en lugar de clases con estado; datos inmutables (`readonly`).
- Sin `forEach` (usar `for…of` o `map`), sin `enum` (usar uniones `as const`), sin reasignar parámetros.
- Imports ordenados (Biome lo hace solo), `import type` para tipos.
- Sin `console.*` fuera de `core/logger.ts` y `scripts/`.
