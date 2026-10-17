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

Matriz de la **US-2** ("Realizar un testeo del nuevo incremento del producto"), revisada en la pasada de QA del
2026-10-16. Cada caso apunta al test que lo prueba; todos corren con `pnpm test:coverage` / `pnpm test:int`.

| ID | US | Caso | Test que lo prueba |
|---|---|---|---|
| TC-S2-01 | US-4 | Contraseña guardada con hash y sal; rechazo de contraseña incorrecta | `core/auth/better-auth.int.test.ts` |
| TC-S2-02 | US-4 | Sesión vence a las 8 h sin actividad e invalida al cerrar sesión | `core/auth/better-auth.int.test.ts` |
| TC-S2-03 | US-4 | Mensaje genérico ante error y aviso propio ante 429 | `features/auth/components/login-form.test.tsx` |
| TC-S2-04 | US-10 | Inscripción con licencia y aislamiento por escudería | `team-drivers.routes.write.test.ts`, `team-drivers-enroll-flow.test.tsx` |
| TC-S2-05 | US-10 | Dorsal o código repetidos ⇒ 409 aunque se saltee el servicio | `team-drivers.repository.int.test.ts` |
| TC-S2-06 | US-13 | Sanción a escudería o a uno de sus pilotos; sólo la FIA carga | `penalties-section-flow.test.tsx`, `sprint2-increment-racing.test.ts` |
| TC-S2-07 | US-13 | Listado de los últimos 5 años con filtros de temporada, tipo y escudería | `penalties.repository.int.test.ts`, `penalties-list.test.tsx` |
| TC-S2-08 | US-21 | Control con auto, fecha, hora, dictamen y vigencia obligatorios | `technical-controls-required.test.ts`, `technical-control-create-form.test.tsx` |
| TC-S2-09 | US-21 | El listado oculta los controles vencidos | `technical-controls.repository.int.test.ts`, `technical-controls.routes.read.test.ts` |
| TC-S2-10 | US-6 | El servidor recibe sólo texto cifrado y firmado | `chat-e2e-flow.test.tsx` |
| TC-S2-11 | US-6 | Firma alterada ⇒ alerta en lugar del texto | `chat-e2e-flow.test.tsx` |
| TC-S2-12 | US-6 | Claves privadas no exportables persistidas en IndexedDB | `key-manager.test.ts`, `key-storage.test.ts` |
| TC-S2-13 | US-6 | Un tercero no lee ni escribe en una conversación ajena | `chat.routes.test.ts`, `chat.repository.int.test.ts` |
| TC-S2-15 | US-4 | Bloqueo con 429 tras intentos fallidos e intentos de inyección sin sesión | `core/auth/better-auth-security.int.test.ts` |
| TC-S2-14 | US-2 | Flujo integral: piloto → control → sanción → consulta pública → chat | `sprint2-increment-racing.test.ts`, `sprint2-increment-chat.test.ts` |

### Defectos encontrados en la pasada de QA (todos corregidos)

| # | US | Pasos para reproducir | Resultado esperado | Resultado obtenido | Corrección |
|---|---|---|---|---|---|
| D-1 | US-6 | Enviar un mensaje en el chat y mirar el cuerpo del `POST` | Texto cifrado (AES-GCM) y firma ECDSA | El texto en plano, con IV y firma falsos | Cifrado y firma reales en el navegador (#17) |
| D-2 | US-6 | Con un usuario que tiene un chat, pedir `GET /chat/conversations/<id ajeno>/messages` | 404 | 200 con los mensajes ajenos | `isParticipant` filtra por conversación (#17) |
| D-3 | US-6 | Pedir `GET /chat/keys/<id>` o las conversaciones contra Postgres real | 200 | 500 (`text = uuid`) | Nombres de escudería sin `JOIN` text/uuid (#17) |
| D-4 | US-6 | Recargar la página del chat | Se descifran los mensajes anteriores | Claves nuevas y mensajes ilegibles | Claves no exportables en IndexedDB (#17) |
| D-5 | US-21 | Cargar un control con vigencia vencida y listar | No aparece | Aparece | El listado filtra por `expiresAt` (#16) |
| D-6 | US-21 | Cargar un control sin número de auto ni fechas | Rechazo con mensaje | Se guarda | Campos obligatorios y `check` en la base (#16) |
| D-7 | US-13 | Listar sanciones de hace más de 5 años | No aparecen | Aparecen | Filtro de 5 años en el servicio (#15) |
| D-8 | US-13 | Querer sancionar a un piloto desde el formulario | Se puede elegir el piloto | No hay selector | Selector con `GET /teams/:id/drivers` (#15) |
| D-9 | US-13 | `POST /penalties` con una escudería inexistente | 404 | 500 | Traducción de FK (#15) |
| D-10 | US-10 | Inscribir un piloto | Pide licencia deportiva | No hay campo de licencia | Licencia en schema, API y formulario (#14) |
| D-11 | US-2 | Correr la mutación del shard `web rest` | ≥ 70 % | 57,6 % | Tests de UI de los cuatro features (#15–#18) |
