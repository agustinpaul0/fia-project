# Estrategia de tests

Todo cambio de comportamiento viene con tests. Se escriben **antes** del código (TDD, skill
`test-driven-development`). Herramientas: Vitest, Testing Library, fast-check, Stryker.

## Tipos de test

| Tipo | Dónde | Archivo | Qué verifica |
|---|---|---|---|
| **Unitario** | shared, api, web | `*.test.ts(x)` | Una unidad aislada: service con repositorio en memoria, schema Zod, hook, componente, util. |
| **Caja negra / contrato** | api | `<f>.routes.<aspecto>.test.ts` | La API desde afuera con `app.request()`: status, permisos, y que request **y** response cumplan los schemas de `@fia/shared/contracts`. No conoce internos. |
| **Fuzz / propiedades** | shared, api | `*.fuzz.test.ts` | Entradas arbitrarias (fast-check): la API nunca responde 5xx, siempre un error tipado; los schemas nunca lanzan. |
| **Integración** | **sólo api** | `*.int.test.ts` | Repositorios contra Postgres real (`db-test`): restricciones (`unique`, `check`, FKs), concurrencia optimista, migraciones. |
| **Regresión** | cualquiera | nombre `regression: …` | Todo bug se arregla escribiendo primero un test que lo reproduce y falla. Queda para siempre. |
| **Tipos** | shared | `*.test-d.ts` | Que tablas Drizzle y contratos Zod no diverjan (`expectTypeOf`). |
| **Cobertura** | todos | — | Umbral global: 90% líneas/funciones/statements, 85% branches. Bloquea `pre-push` y CI. |
| **Mutación** | todos | `stryker.config.mjs` | Stryker muta el código y exige que los tests lo detecten: umbral 70% por paquete. Mide la **calidad** de los tests, no sólo si pasan por el código. |
| E2E (diferido) | — | — | Playwright, al final del proyecto (habilitador T-3). |

### Infraestructura: integración, no mutación

Los archivos que sólo hablan con Postgres o con Better Auth —`*.repository.ts`, `*.adapter.ts`,
`*-unit-of-work.ts`, `*-constraints.ts` (mapas de restricciones) y `core/auth/better-auth.ts`— quedan fuera
de la cobertura unitaria y de la mutación, porque con fakes no se puede probar lo que importa de ellos.
**A cambio, cada uno está obligado a tener tests de integración** (`*.int.test.ts`) que cubran todas sus
operaciones y la traducción de cada restricción a su error.

### Qué **no** cubre cada capa (y por eso existen las otras)

- Drizzle y Postgres garantizan tipos y restricciones de columna, pero **no** el formato de un email, rangos
  cruzados, campos extra en el body ni la forma de la respuesta: eso lo validan los schemas Zod y lo prueban los
  tests de contrato.
- Los tests unitarios usan repositorios en memoria: no prueban SQL. Eso lo prueban los de integración.
- La cobertura dice qué líneas se ejecutaron; la mutación dice si algún test **fallaría** si esa línea estuviera
  mal.

## Criterios de aceptación → tests

Cada criterio de aceptación de la US se traduce en al menos un test con su texto en la descripción. Cada fila
de la tabla de errores del feature (`docs/features/<f>/README.md`) tiene su test.

## Reutilización (equivalentes a JUnit)

| JUnit | Vitest | Uso en este repo |
|---|---|---|
| `@BeforeEach` / `@AfterEach` | `beforeEach` / `afterEach` | Crear la app de test o el repositorio en memoria limpio para cada test; restaurar mocks. |
| `@BeforeAll` / `@AfterAll` | `beforeAll` / `afterAll` | Abrir y cerrar la conexión a Postgres en tests de integración. |
| `@ParameterizedTest` | `it.each` | Casos inválidos con su mensaje esperado. |
| Test fixtures / Object Mother | builders en `testing/` | `aCategoryBody()`, `aCategoryRow({ version: 3 })`, `aCategory()`. |

Reglas:

- **Nada de datos de prueba duplicados**: se usan los builders de `testing/` con overrides. Si falta uno, se crea.
- La app de test se arma con `createTestApp({ sessionUser, categories })`; los usuarios con
  `FIA_ADMIN`, `TEAM_STAFF` de `testing/session-users.ts`.
- Requests HTTP con `sendJson(app, { method, path, body })` y errores con `readError(response)`.
- En la web, renderizar con `renderWithQuery(<Componente />)` y mockear la red con `mockFetchOnce(...)`.
- Integración: cada test dentro de `withRollback(connection, async (tx) => …)`; nunca quedan datos.
- Cada test prueba **un** comportamiento y su nombre lo describe en español.
- Los archivos de test también respetan el tope de 100 líneas: se dividen por aspecto
  (`*.routes.read.test.ts`, `*.routes.write.test.ts`, `*.routes.errors.test.ts`).

## Cuándo se corre cada cosa

| Momento | Comando | Incluye |
|---|---|---|
| Desarrollo | `pnpm test:watch` | unit + contrato + fuzz (re-ejecuta al guardar) |
| `git push` (hook) | `pnpm test:coverage` | unit + contrato + fuzz + tipos, con umbral de cobertura |
| Antes del PR | `pnpm verify` | lo anterior + integración + mutación + build |
| CI | los mismos pasos que `pnpm verify`, en 8 jobs paralelos | calidad (lint, tipos, build), tests con Postgres de servicio y mutación en 6 shards (`shared`, `api` y 4 de `web`) con caché incremental de Stryker |

**La suite completa se corre siempre antes de abrir un PR**, aunque el cambio parezca chico.

## Velocidad de la suite

- La web corre sobre `happy-dom` (no `jsdom`): mismo comportamiento en nuestros tests y la mitad del tiempo, algo
  que en mutación se multiplica por cada mutante.
- Stryker ignora los mutantes dentro de los atributos `className` y `style` (plugin
  `stryker.ignore-styles.mjs`): cambiar una clase de Tailwind no es comportamiento y sólo agregaba tiempo y ruido.
  Las reglas de negocio se siguen mutando completas.
- La concurrencia de Stryker se adapta a los núcleos de la máquina (`availableParallelism() - 1`).
- Mutación incremental: sólo se re-prueban los mutantes de archivos que cambiaron. En CI el archivo incremental se
  restaura y se **guarda siempre** (aunque el job falle o se corte), con caché por rama y respaldo en `develop`.
- `apps/web/stryker.config.mjs` acepta `STRYKER_SHARD` (`all` por defecto, `results`, `staff`, `notifications`,
  `rest`) para repartir la mutación de la web en jobs paralelos; cada shard tiene su archivo incremental y su
  reporte. Localmente se corre todo junto con `pnpm test:mutation`.
- Referencia (2026-10-03, 16 núcleos): `pnpm test:coverage` ~10 s, `pnpm test:int` ~7 s y mutación completa de la
  web desde cero ~4,5 min (antes >10 min; en CI se cortaba a los 30 min).

## Bases de datos

- Desarrollo: servicio `db` (puerto 5442, volumen persistente).
- Tests: servicio `db-test` (puerto 5443, **en memoria**: arranca vacío, las migraciones se aplican en el
  `globalSetup`). Nunca se testea contra la base de desarrollo.

## Reportes

- Cobertura HTML: `coverage/index.html`.
- Mutación HTML: `<paquete>/reports/mutation/index.html` (en la web, un archivo por shard: `results.html`,
  `staff.html`, …). Mutantes sobrevivientes = tests a mejorar.

## Matriz de pruebas del incremento — Sprint 2 (US-2)

Como parte de la **US-2** ("Realizar un testeo del nuevo incremento del producto"), se consolidó la matriz de pruebas del incremento entregable del Sprint 2, abarcando las interacciones entre los módulos de autenticación, personal/pilotos, sanciones, controles técnicos y mensajería cifrada.

| ID Caso | US | Aspecto / Flujo | Entrada | Resultado Esperado | Estado |
|---|---|---|---|---|---|
| **TC-S2-01** | US-4 | Login con credenciales válidas | Email y contraseña de admin FIA | Sesión válida creada, redirección a panel administrativo | **PASÓ** |
| **TC-S2-02** | US-4 | Rechazo de credenciales inválidas | Contraseña incorrecta | 401 con mensaje genérico ("Credenciales inválidas") sin enumeración de usuarios | **PASÓ** |
| **TC-S2-03** | US-4 | Política deny-by-default | Petición anónima a ruta protegida | 401 / 403 según corresponda, sin filtración de datos | **PASÓ** |
| **TC-S2-04** | US-10 | Inscripción de piloto en escudería | Datos válidos de titular en escudería del usuario | 201 Created, piloto visible en nómina oficial | **PASÓ** |
| **TC-S2-05** | US-10 | Aislamiento y límites de equipo | Intento de cargar tercer titular o en equipo ajeno | 409 `TOO_MANY_MAIN_DRIVERS` / 403 Forbidden | **PASÓ** |
| **TC-S2-06** | US-13 | Carga de sanciones oficiales | Comisario FIA registra multa / recargo | 201 Created, disponible en listado público de sanciones | **PASÓ** |
| **TC-S2-07** | US-13 | Filtro público de sanciones | Consulta por temporada, escudería y tipo | 200 OK con listado filtrado ordenado cronológicamente | **PASÓ** |
| **TC-S2-08** | US-21 | Control técnico vehicular | Dictamen de pesaje `passed` / `rejected` | 201 Created con fecha, tipo y notas técnicas | **PASÓ** |
| **TC-S2-09** | US-21 | Consulta pública de controles | Escudería consulta inspecciones activas | 200 OK con dictamen oficial en tiempo real | **PASÓ** |
| **TC-S2-10** | US-6 | Intercambio de claves públicas | Registro de JWKs ECDH y ECDSA | 200 OK, claves públicas indexadas por usuario | **PASÓ** |
| **TC-S2-11** | US-6 | Cifrado y firma en cliente | Mensaje cifrado AES-GCM firmado con ECDSA | El servidor almacena sólo payload opaco en Base64 | **PASÓ** |
| **TC-S2-12** | US-6 | Detección de alteración (tampering) | Payload manipulado en tránsito | Rechazo en cliente por firma digital no coincidente | **PASÓ** |
| **TC-S2-13** | US-2 | Flujo integral del incremento | Ciclo completo: inspección técnica → sanción → chat E2E | 200/201 en todas las fases sin regresiones | **PASÓ** |

### Resumen de ejecución
- **Comando unificado**: `pnpm test:coverage`
- **Total de pruebas**: 651 tests en 145 archivos.
- **Cobertura obtenida**: Statements 94.06% · Branches 85.39% · Lines 94.17%.
- **Defectos bloqueantes encontrados**: 0.
