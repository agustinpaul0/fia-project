# Backlog — Sistema de gestión de la FIA

Fuente: planificación del **Grupo Naranja** (PO / Analista y Management),
[`docs/specs/GrupoNaranjaSprint0.pdf`](docs/specs/GrupoNaranjaSprint0.pdf), para el Sprint 2
[`docs/specs/GrupoNaranjaSprint1.pdf`](docs/specs/GrupoNaranjaSprint1.pdf) y, para el Sprint 3,
[`docs/specs/GrupoNaranjaSprint3.pdf`](docs/specs/GrupoNaranjaSprint3.pdf). Las historias se transcriben tal
cual; lo agregado por el equipo implementador está marcado como **[equipo]**.

## Cómo se usa este archivo

- Es la **fuente de verdad** del estado del trabajo. Se actualiza en el mismo PR que el código
  (`docs(backlog): …`).
- **Estados**: `Pendiente` → `En progreso` → `En revisión` (PR abierto) → `Hecho` (mergeado a `develop`).
  `Bloqueada` si depende de algo externo (anotar por qué).
- Al tomar un ítem: estado, dueño y fecha de inicio. Al cerrarlo: tareas y criterios tildados, **horas reales**
  por tarea y link al PR.
- **Horas reales**: la cátedra pide comparar estimado vs. real por US en el Sprint 1 para estimar el Sprint 2.
  Cargarlas con honestidad (incluye tiempo de tests, docs y review).
- Horas reales del Sprint 1 informadas por el equipo: **14 h** en total. T-0 (setup, planificación y
  convenciones) 5,5 h · T-1 + T-2 + US-23 2 h · US-20 + US-9 + US-5 1 h · revisión, CI, integración y release 1,5 h ·
  cierre del sprint (T-6, T-4, T-7 y T-8) 4 h.
- Dudas para el PO: [`docs/preguntas-po.md`](docs/preguntas-po.md).
- Escala de Naranja: story points y business value en Fibonacci. SP ↔ horas: 1 = ≤ 12 h · 2 = 12–14 h ·
  3 = 14–16 h · 5 = 16–18 h.

## Sprint 1 — 22/09/2026 → 05/10/2026 (demo: martes 06/10/2026)

### Resumen

| ID | Ítem | SP | BV | Est. | Real | Estado | Dueño | Depende de | PR |
|---|---|---|---|---|---|---|---|---|---|
| T-0 | Setup del repositorio y convenciones **[equipo]** | — | — | — | 5,5 h | Hecho | Agustín | — | — |
| T-1 | Autenticación mínima con roles **[equipo]** | — | — | — | ver US-23 | Hecho | Joaquín | T-0 | |
| T-2 | Modelo de datos base y seed **[equipo]** | — | — | — | ver US-23 | Hecho | Joaquín | T-0 | |
| US-23 | Gestión de cuentas del personal de escuderías | 5 | 13 | 17 h | 2 h (con T-1 y T-2) | Hecho | Joaquín | T-1 | #2 |
| US-20 | Carga y modificación del puntaje de una carrera | 1 | 21 | 12 h | 0,5 h | Hecho | Agustín | T-1, T-2 | #3 |
| US-9 | Confirmar notificación del puntaje recibido | 1 | 13 | 10 h | 0,25 h | Hecho | Agustín | US-20, US-23 | #4 |
| US-5 | Ver resultados de carreras de los últimos años | 2 | 13 | 14 h | 0,25 h | Hecho | Agustín | T-2 | #5 |
| T-5 | Revisión de US-23, CI, integración y release **[equipo]** | — | — | — | 1,5 h | Hecho | Agustín | — | #6, #7 |
| T-6 | Diseño visual del Sprint 1 (mocks de Stitch) **[equipo]** | — | — | — | 4 h | Hecho | Agustín | US-5, US-9, US-20, US-23 | — |
| T-4 | Formularios de US-23 con `react-hook-form` y el schema del contrato (errores por campo) **[equipo]** | — | — | — | ver T-6 | Hecho | Agustín | US-23 | — |
| T-7 | Seed con datos para la demo (`pnpm db:seed:demo`) **[equipo]** | — | — | — | ver T-6 | Hecho | Agustín | US-9, US-20, US-23 | — |
| T-8 | Velocidad de la suite de tests y de la mutación en CI **[equipo]** | — | — | — | ver T-6 | Hecho | Agustín | — | — |

**Horas reales del sprint: 14 h** (informadas por el equipo, incluyen el setup del proyecto): 10 h de T-0 a T-5 y
4 h de cierre (T-6 diseño visual, T-4 errores por campo, T-7 seed de la demo y T-8 velocidad de la suite).

**Orden sugerido [equipo]**: T-1 y T-2 en paralelo → US-23 → US-20 → US-9. US-5 en paralelo apenas esté T-2.
Las estimaciones de los habilitadores las hace el equipo **sin IA** (pauta de la cátedra para el Sprint 1).

---

### T-6 — Diseño visual del Sprint 1 [equipo]

**Por qué**: la funcionalidad del sprint estaba terminada con el estilo por defecto de shadcn. Para la demo del
06/10 se replican los mocks de Google Stitch (estilo Bauhaus neo-brutalista) en las 9 pantallas del sprint, sin
agregar datos falsos ([ADR 0009](docs/adr/0009-sistema-visual.md)).

- [x] Tokens, fuentes self-hosted y primitivas de marca (encabezado único por rol, pie, logo, estados de carga,
      error y vacío) — [`docs/conventions/ui.md`](docs/conventions/ui.md).
- [x] Portada con categorías clickeables que llevan a sus resultados (`/results?category=…`).
- [x] Login centrado con mostrar/ocultar contraseña.
- [x] Resultados (US-5): métricas calculadas, filtro por categoría, tabla completa desplegable y cambio de temporada
      sin parpadeo; clasificación de carrera con distribución de puntos por escudería.
- [x] Carga de resultados (US-20): editor con totales y "Cancelar cambios".
- [x] Personal (US-23): totales, búsqueda y filtro por escudería; diálogos restyleados.
- [x] Notificaciones y auditoría (US-9): bandeja con pendientes; auditoría con totales, búsqueda y filtro por estado.
- [x] Corrección encontrada en el camino: el campeonato y el calendario no filtraban por categoría (se habrían
      mezclado F1 y F2). La API acepta `category` opcional en `/races` y `/races/standings`.

**Horas reales**: 4 h junto con T-4, T-7 y T-8 (informadas por el equipo; sesión del 2026-10-03, implementación
asistida por IA).

**Falta para cerrar**: ninguno. Plan: [docs/plans/T-6-visual-design.md](docs/plans/T-6-visual-design.md).

### T-4 — Errores por campo en los formularios de personal [equipo]

**Por qué**: un integrante del equipo reportó que al dar de alta una cuenta con datos inválidos sólo veía "Hay datos
inválidos…" sin saber qué campo fallaba: los formularios usaban `useState`, validaban sólo en el servidor y
descartaban los `fields` del error. Estaba diferido desde el Sprint 1.

- [x] Alta y edición con `react-hook-form` + `zodResolver` con el schema del contrato (mismos mensajes que la API).
- [x] Cada campo muestra su error (`aria-invalid` + mensaje) y las reglas de contraseña, teléfono y legajo.
- [x] Los `fields` de `VALIDATION_FAILED` y los códigos de email o legajo repetido se marcan en su campo
      (`lib/form-errors.ts`).
- [x] Mensaje de escudería sin elegir: "Elegí una escudería." (antes hablaba de UUID).

### T-7 — Seed para la demo [equipo]

- [x] `pnpm db:seed:demo` deja datos en todos los paneles: seed base (F1 2021–2025) + F2, F3 y F1 Academy con 3
      escuderías, 6 pilotos y temporadas 2021–2025 (4 rondas y un sprint, resultados determinísticos de
      demostración), 5 cuentas de escudería (contraseña `DEMO_STAFF_PASSWORD`, en `.env.example`), 2 carreras de la
      última temporada publicadas desde el sistema (notificaciones pendientes) y una confirmación de McLaren para la
      auditoría. Usa los servicios de la API para cuentas, publicación y confirmación, y es idempotente.

### T-8 — Velocidad de la suite [equipo]

**Por qué**: la mutación de la web llegó al límite de 30 min del CI y se canceló; localmente `pnpm verify` tardaba
~25 min.

- [x] Web sobre `happy-dom` en lugar de `jsdom` (tests de 9 s a 5 s).
- [x] Stryker ignora mutantes de `className`/`style` y adapta la concurrencia a los núcleos.
- [x] CI: mutación de la web en 4 shards paralelos y caché incremental que se guarda siempre.
- [x] Detalle en [`docs/testing.md`](docs/testing.md#velocidad-de-la-suite).

### T-1 — Autenticación mínima con roles [equipo]

**Por qué**: US-20 y US-23 requieren un administrativo de la FIA con sesión y US-9 personal de escudería con
sesión, pero el login (US-4) no entró al sprint. Se implementa lo mínimo para que las US del sprint funcionen y
sean seguras; US-4 completa la experiencia más adelante.

- [x] Better Auth con adaptador Drizzle, plugins `admin` y `bearer` (ADR 0003).
- [x] Roles `fia_admin` / `team_staff` / `public` y vínculo usuario ↔ escudería.
- [x] Resolver de sesión real en lugar del anónimo (`core/auth/session.ts`).
- [x] Pantalla de login mínima; el rol determina la interfaz (adelanto de US-29).
- [x] Seed con un admin FIA inicial (credenciales sólo en `.env`).
- [x] Política de contraseña, rate limit y tests de contrato de 401/403.

**Falta para cerrar**: ninguno.

### T-2 — Modelo de datos base y seed [equipo]

**Por qué**: US-5 y US-20 necesitan carreras, pilotos, escuderías y resultados; US-5 además necesita datos de
años anteriores para poder mostrarse en la demo.

- [x] Categorías (implementación de referencia, hecha en T-0).
- [x] Temporadas, circuitos, eventos/carreras (con categoría, circuito y fecha).
- [x] Escuderías y pilotos (titular/suplente) con sus restricciones.
- [x] Resultados por carrera (posición, piloto, escudería, puntos) con restricciones
      (`unique` carrera+posición, carrera+piloto; puntos ≥ 0; posición ≥ 1).
- [x] Seed con al menos 2 temporadas anteriores de F1 para la demo.

**Falta para cerrar**: ninguno.

---

### US-23 — Gestión de cuentas del personal de escuderías

> **Como** Personal Administrativo de la FIA **quiero** crear, modificar y eliminar cuentas de usuario del
> personal de las escuderías **de forma que** estas cuentas puedan acceder a sus funcionalidades especiales
> correspondientes. — SP 5 · BV 13

| Tarea (Naranja) | Est. | Real | Hecha |
|---|---|---|---|
| Analizar y desarrollar la forma en la que se almacenarán los datos | 4 h | | [x] |
| Diseñar e implementar la interfaz mediante la cual el personal administrativo de la FIA podrá acceder a estas funcionalidades | 4 h | | [x] |
| Verificar la integridad y la consistencia de los datos ingresados considerando los almacenados | 2 h | | [x] |
| Diseñar e implementar la comunicación entre la interfaz y el almacenamiento | 3 h | | [x] |
| Realizar pruebas funcionales | 4 h | | [x] |
| **Total** | **17 h** | **17 h** | |

**Criterios de aceptación**
- [x] Los datos almacenados perduran y son consistentes.
- [x] Las acciones que se pueden llevar a cabo son consistentes con las acciones pasadas y la información
      guardada (p. ej. si se eliminó una cuenta ya no se puede ingresar a la misma).
- [x] Verificar que las cuentas puedan acceder a sus funcionalidades correspondientes.

**Acuerdos con el PO (Grupo Naranja)**
- Datos de cuenta: nombre, apellido, email, cargo, escudería (`teamId`), teléfono y número de legajo.
- Asociación escudería: unívoca (cada cuenta pertenece exclusivamente a una sola escudería).
- Eliminación: baja lógica (soft delete), no borrado definitivo, para conservar historial y auditoría.
- Contraseña inicial: la define el administrador de la FIA al momento del alta.

**Acuerdos con el dev (2026-09-25)**
- Baja terminal: no hay reactivación en US-23; email y legajo quedan reservados y no se reutilizan.
- Editables: nombres, teléfono, cargo y escudería. Email, legajo y estado no se editan (`PUT` completo + `version`).
- `roleInTeam`: texto libre de 2–60 caracteres. Legajo: alfanumérico con guion, 1–20 caracteres, mayúsculas y
  único global. Teléfono: obligatorio, 7–30 caracteres, validación flexible.
- Reasignación de escudería permitida mientras la cuenta esté activa; US-9 debe guardar la escudería en cada
  confirmación para que un cambio posterior no altere el historial.
- La contraseña inicial se entrega por un canal externo; US-23 no envía emails (US-26 diferida).
- Sólo `fia_admin` opera y lista; el listado incluye activas e inactivos y no expone hashes ni tokens.
- Atomicidad: `team_staff` es la fuente canónica y las proyecciones de Better Auth (`role`, `team_id`, `name`) se
  escriben en la misma transacción. Ver [ADR 0007](docs/adr/0007-identidad-y-membresia-de-escuderia.md).

**Correcciones heredadas de T-1 (dentro del alcance de US-23)**
- `adminRole` → `adminRoles` y Access Control con permisos de `fia_admin` (el plugin `admin` está inactivo sin esto).
- `session.impersonatedBy` en schema y migración (lo declara el plugin `admin` de Better Auth 1.7.5).
- Los endpoints `admin` de Better Auth no se exponen por HTTP: allowlist de auth + port interno.

**Preguntas al PO**: ratificadas por el Grupo Naranja el 2026-10-03 (baja terminal sin reutilizar email ni
legajo, cargo de texto libre, teléfono obligatorio con validación flexible, reasignación de escudería con historial
en US-9, listado con cuentas dadas de baja y contraseña inicial entregada fuera del sistema). Ver
[`docs/preguntas-po.md`](docs/preguntas-po.md) R17–R22.

**Horas reales**: 2 h en total entre T-1, T-2 y US-23 (el equipo no registró el detalle por tarea).

**Revisión (Agustín, 2026-09-28)**
- Tests de integración del repositorio corregidos: usaban un cargo de 1 carácter y el mismo usuario para probar
  el legajo duplicado, así que chocaban con otras restricciones.
- Nuevos tests de integración del adaptador de Better Auth (alta, email repetido, edición y baja que cierra
  sesiones), que no tenía ninguno.
- Sin casteos `as unknown as` en producción: `auth.$context` tipado y `TransactionalDatabase` para Better Auth.
- Tests de formularios reforzados (payload exacto, reseteo, estado de guardado) para superar el umbral de mutación.

**Falta para cerrar**: ninguno. Plan técnico: [docs/plans/US-23-team-staff-accounts.md](docs/plans/US-23-team-staff-accounts.md).

### US-20 — Carga y modificación del puntaje de una carrera

> **Como** Personal Administrativo de la FIA **quiero** poder cargar y modificar el puntaje de una carrera
> **de forma que** sean visibles para las escuderías y el público. — SP 1 · BV 21

| Tarea (Naranja) | Est. | Real | Hecha |
|---|---|---|---|
| Diseñar y desarrollar la forma en la que se otorgará esta opción en la interfaz de los administradores | 2 h | | [x] |
| Analizar, diseñar y desarrollar la forma en la que se almacenarán los puntajes de las carreras | 2 h | | [x] |
| Diseñar y desarrollar los formularios en los que se cargarán los datos sobre los puntajes | 4 h | | [x] |
| Configurar la actualización inmediata de los datos sobre los puntajes | 4 h | | [x] |
| **Total** | **12 h** | | |

**Criterios de aceptación**
- [x] Rápida actualización en las modificaciones de los puntajes (acordado: < 10 min; en la web es inmediata al guardar).
- [x] El formulario valida adecuadamente las entradas de datos (cliente: posiciones completas y sin pilotos repetidos; servidor: contrato, categoría, carrera ya corrida y versión).

**Acuerdos con el PO (Grupo Naranja)**
- Sistema de puntuación: F1 tradicional (25-18-15-12-10-8-6-4-2-1) y carreras Sprint para el top 8 (8-7-6-5-4-3-2-1).
- Carga: el admin ingresa las posiciones de la carrera y el sistema calcula los puntos de forma automática.
- Tiempo de actualización: menor a 10 minutos (en la web es inmediato).
- Notificaciones: si se modifica un puntaje ya notificado, se vuelve a notificar a las escuderías.

**Acuerdos con el dev (2026-09-28)**
- Tipo de carrera `grand_prix` / `sprint`; el sprint comparte ronda con su Gran Premio.
- Se carga el orden de llegada de los clasificados (sin DNF/DSQ por ahora); sin punto por vuelta rápida.
- La escudería del resultado es la del piloto al cargar. No se cargan carreras futuras.
- Corrección = reemplazo completo con la `version` de la carrera; cada guardado suma una revisión que US-9 usa para
  re-notificar ([ADR 0008](docs/adr/0008-revisiones-de-resultados.md)).
- Se incluyen los datos de demostración de 5 temporadas (2021–2025) que necesita US-5.

**Preguntas al PO**: ratificadas el 2026-10-03 (misma escala de puntos para todas las categorías y sólo
clasificados, sin DNF/DSQ, en el Sprint 1). Ver [`docs/preguntas-po.md`](docs/preguntas-po.md) R15–R16.

**Horas reales**: 0,5 h (sesión del 2026-09-28, 09:42–10:15, implementación asistida por IA).

**Falta para cerrar**: ninguno. Plan: [docs/plans/US-20-race-points.md](docs/plans/US-20-race-points.md) ·
Feature: [docs/features/race-results](docs/features/race-results/README.md).

### US-9 — Confirmar notificación del puntaje recibido

> **Como** Personal de las escuderías **quiero** confirmar que se me notificó sobre el puntaje recibido
> **de forma que** pueda confirmarlo con un click en una notificación de la app. — SP 1 · BV 13

| Tarea (Naranja) | Est. | Real | Hecha |
|---|---|---|---|
| Analizar, diseñar y desarrollar la forma en que el personal de las escuderías reciben las notificaciones | 2 h | | [x] |
| Diseñar e implementar la forma en la que se confirma la notificación del puntaje recibido | 2 h | | [x] |
| Verificar que se puede confirmar el puntaje recibido en menos de un minuto a partir de que la información sobre los puntajes esté cargada | 2 h | | [x] |
| Realizar pruebas funcionales | 4 h | | [x] |
| **Total** | **10 h** | | |

**Criterios de aceptación**
- [x] Una vez que el personal confirma el puntaje recibido desaparece la notificación.
- [x] Verificar que la confirmación quedó asentada correctamente (quién y cuándo, visible en `/admin/notifications`).
- [x] La confirmación se puede realizar de forma fácil y rápida (un click; la bandeja se actualiza cada 30 s).

**Acuerdos con el PO (Grupo Naranja)**
- Canal de notificación: sección de notificaciones in-app en la web (notificaciones push móviles reservadas a la app móvil).
- Destinatarios / confirmación: confirma una sola persona por escudería. Si otro miembro intenta confirmar, la UI le informa que ya fue confirmado.
- Auditoría: se registra quién confirmó y cuándo; la FIA tiene acceso a consultarlo.

**Acuerdos con el dev (2026-09-28)**
- Reciben notificación las escuderías con resultados en la carrera; una por escudería y revisión (ADR 0008).
- Sólo la revisión vigente se muestra y se puede confirmar; los resultados del seed no notifican.

**Horas reales**: 0,25 h (sesión del 2026-09-28, 10:15–10:28, implementación asistida por IA).

**Falta para cerrar**: ninguno. Plan: [docs/plans/US-9-score-notifications.md](docs/plans/US-9-score-notifications.md) ·
Feature: [docs/features/notifications](docs/features/notifications/README.md).

### US-5 — Ver resultados de carreras de los últimos años

> **Como** Usuario **quiero** poder ver los resultados de las carreras de los últimos años **de forma que**
> pueda ver la información rápidamente. — SP 2 · BV 13

| Tarea (Naranja) | Est. | Real | Hecha |
|---|---|---|---|
| Analizar y desarrollar la forma en la que se obtendrán los datos | 3 h | | [x] |
| Analizar y desarrollar la forma en la que se almacenarán los datos | 2 h | | [x] |
| Optimizar las consultas sobre los datos | 3 h | | [x] |
| Analizar y diseñar la forma en la que se mostrarán los datos | 2 h | | [x] |
| Realizar pruebas funcionales | 4 h | | [x] |
| **Total** | **14 h** | | |

**Criterios de aceptación**
- [x] La información de las carreras se visualiza de forma clara y ordenada (campeonato + carreras por temporada en `/results`).
- [x] La carga de los datos es rápida (acordado: < 10 min; las consultas usan índices y responden al instante).

**Acuerdos con el PO (Grupo Naranja)**
- Alcance temporal: los últimos 5 años.
- Origen de datos: provistos por el equipo implementador mediante seed demo.
- Tiempo de respuesta: menos de 10 minutos (en la web es inmediato).

**Horas reales**: 0,25 h (sesión del 2026-09-28, 10:28–10:35 más documentación, implementación asistida por IA).

**Falta para cerrar**: ninguno. Plan: [docs/plans/US-5-race-results-history.md](docs/plans/US-5-race-results-history.md) ·
Feature: [docs/features/race-results](docs/features/race-results/README.md).

---

## Sprint 2 — 06/10/2026 → 20/10/2026 (demo: martes 20/10/2026)

### Resumen

| ID | Ítem | SP | BV | Est. | Real | Estado | Dueño | Depende de | PR |
|---|---|---|---|---|---|---|---|---|---|
| US-4 | Iniciar sesión mediante credenciales seguras | 13 | 13 | 9 h | 0,5 h | Hecho | Joaquín Santa María | T-1 | #13 |
| US-10 | Cargar la información de los pilotos titulares y suplentes | 5 | 13 | 7 h | 0,75 h | Hecho | Joaquín Santa María | US-4, T-2 | #14 |
| US-13 | Cargar sanciones a pilotos o escuderías | 5 | 13 | 7,5 h | 0,75 h | Hecho | Santiago Salamanca | US-4, US-10 | #15 |
| US-21 | Ingresar fechas, tipos y resultado de controles técnicos por auto | 3 | 13 | 5 h | 0,5 h | Hecho | Santiago Salamanca | US-4, US-13 | #16 |
| US-6 | Chats de mensajería cifrados de extremo a extremo | 13 | 13 | 9 h | 0,75 h | Hecho | Agustín Paul | US-4 | #17 |
| US-2 | Realizar un testeo del nuevo incremento del producto | 5 | 13 | 7 h | 0,75 h | Hecho | Agustín Paul | US-4, US-10, US-13, US-21, US-6 | #18 |
| T-9 | QA de US-4: tests de hash, expiración y cierre de sesión; aviso ante 429 **[equipo]** | — | — | — | 0,5 h | Hecho | Agustín Paul | — | #13–#23 |
| T-10 | QA de US-10: licencia deportiva, unicidad, tests de integración y de UI **[equipo]** | — | — | — | 0,75 h | Hecho | Agustín Paul | — | #13–#23 |
| T-11 | QA de US-13: regla de 5 años, sanción a pilotos, filtro por escudería, tests **[equipo]** | — | — | — | 1 h | Hecho | Agustín Paul | — | #13–#23 |
| T-12 | QA de US-21: vehículo, fecha y vigencia obligatorios, ocultar vencidos, tests **[equipo]** | — | — | — | 1 h | Hecho | Agustín Paul | — | #13–#23 |
| T-13 | QA de US-6: cifrado real E2E, control de participantes, claves en IndexedDB, tests **[equipo]** | — | — | — | 2 h | Hecho | Agustín Paul | — | #13–#23 |
| T-14 | QA de US-2: matriz de pruebas, test del incremento y seed de la demo **[equipo]** | — | — | — | 0,25 h | Hecho | Agustín Paul | — | #13–#23 |
| T-15 | Respuestas del PO: licencia, dorsal por categoría, datos de la sanción **[equipo]** | — | — | — | 0,5 h | Hecho | Agustín Paul | — | #13–#23 |
| T-16 | Chat: actualización automática, bandeja sin conexión y envío desde cualquier pantalla **[equipo]** | — | — | — | 2 h | Hecho | Agustín Paul | — | #20, #26, #28 |

**Horas reales del sprint: 12 h** (4 h de implementación + 8 h de QA y mejoras, T-9 a T-16), contra 44,5 h
estimadas. Las de implementación salen de los commits del 14/10 (15:59–19:32 UTC, unas 3,5 h, más 0,5 h estimadas de la
US-4 previa al primer commit); reemplazan las 6,5 h que figuraban antes. Las de QA y mejoras las informó Agustín (8 h); el reparto por tarea es aproximado.

**Nueva escala de equivalencia de Naranja**: 1 SP = 1–4 h · 3 SP = 4–6 h · 5 SP = 6–8 h · 13 SP = 8–10 h.  
**Orden sugerido [equipo]**: US-4 → US-10 → US-13 → US-21 → US-6. US-2 acompaña todo el sprint con la suite de pruebas.

---

### US-4 — Iniciar sesión mediante credenciales seguras

> **Como** Personal Administrativo de la FIA **quiero** iniciar sesión en el sistema mediante credenciales seguras
> **de forma que** pueda acceder a las funciones de administración y configuración de la plataforma. — SP 13 · BV 13

| Tarea (Naranja) | Est. | Real | Hecha |
|---|---|---|---|
| Diseñar el esquema de base de datos para credenciales, roles y hash seguro de contraseñas (bcrypt/Argon2 con sal) | 1 h | | [x] |
| Implementar servicio de autenticación de backend (validación de credenciales y generación de token de sesión/JWT) | 2 h | | [x] |
| Implementar middleware de autorización y control de acceso para proteger rutas del rol administrativo de la FIA | 1,5 h | | [x] |
| Desarrollar la pantalla de inicio de sesión con validaciones de formulario y manejo de mensajes de error | 1,5 h | | [x] |
| Implementar expiración de sesión por inactividad y mecanismo de cierre de sesión seguro | 1 h | | [x] |
| Pruebas funcionales de seguridad: Bloqueo ante intentos fallidos, inyección y acceso no autorizado por URL | 2 h | | [x] |
| **Total** | **9 h** | **0,5 h** | |

**Criterios de aceptación**
- [x] Un administrador registrado ingresa sus credenciales válidas y el sistema lo redirige a la vista de administración de la FIA.
- [x] Ante un email o contraseña incorrectos, el sistema muestra un mensaje genérico (ej: <<Credenciales inválidas>>) sin revelar si el usuario existe.
- [x] Las contraseñas nunca viajan ni se almacenan en texto plano, guardándose siempre mediante hash seguro con sal.
- [x] Si un usuario no autenticado o con otro rol intenta acceder a un endpoint o URL administrativa, el servidor deniega el acceso con código HTTP correspondiente (401/403).
- [x] Al cerrar sesión o vencer el tiempo de inactividad, el token/sesión queda invalidado de forma efectiva.

**Acuerdos con el PO (Grupo Naranja)**
- Mensajes genéricos de error ante fallo de autenticación para prevenir enumeración de cuentas.
- Redirección post-login: administradores FIA (`fia_admin`) redirigen a su panel administrativo (`/admin/team-staff`); el resto de los roles (`team_staff`, `public`) va al inicio (`/`), desde donde navega a su área.
- Ante el límite de intentos (429) se muestra el mensaje de `RATE_LIMITED` en lugar del genérico.
- Sesión con expiración por inactividad e invalidación al cerrar sesión.
- Rate limiting activo para prevenir fuerza bruta (máximo 10 intentos por minuto por IP).

**Horas reales**: 0,5 h (estimadas a partir de los commits del 2026-10-14, implementación asistida por IA).

**Falta para cerrar**: ninguno. Plan: [docs/plans/US-4-authentication.md](docs/plans/US-4-authentication.md).

---

### US-10 — Cargar la información de los pilotos titulares y suplentes

> **Como** Personal de las escuderías **quiero** cargar la información de los pilotos titulares y suplentes de mi equipo
> **de forma que** queden oficialmente inscriptos para las competencias. — SP 5 · BV 13

| Tarea (Naranja) | Est. | Real | Hecha |
|---|---|---|---|
| Modelar la entidad Piloto y sus relaciones en la base de datos | 1,5 h | | [x] |
| Implementar la lógica de negocio y endpoints en la API | 1,5 h | | [x] |
| Diseñar e implementar el formulario de inscripción en el panel de la escudería | 1,5 h | | [x] |
| Implementar el control de acceso y aislamiento por escudería | 1 h | | [x] |
| Pruebas unitarias, de validación y de integración | 1,5 h | | [x] |
| **Total** | **7 h** | **0,75 h** | |

**Criterios de aceptación**
- [x] El representante de la escudería puede inscribir pilotos completando todos los datos obligatorios (nombre, apellido, número de auto, licencia y condición de titular o suplente).
- [x] El sistema rechaza la inscripción si el número de coche ya está asignado a otro piloto de la misma categoría o si faltan datos requeridos.
- [x] Cada escudería solo puede gestionar los pilotos de su propio equipo; el servidor rechaza cualquier intento de asociar o registrar pilotos en escuderías ajenas.
- [x] Al confirmarse el alta, el piloto queda registrado con estado oficial y visible en la nómina de la escudería para las próximas competencias.

**Acuerdos con el PO (Grupo Naranja)**
- PO (17/10): la licencia no tiene formato oficial; sólo letras, números y guiones, y única por piloto. El dorsal se puede repetir en categorías distintas. La foto queda para US-22.
- El número de coche (dorsal) es único dentro de la misma categoría (implementado el 17/10 con `unique(category_id, number)`).
- Aislamiento estricto: el usuario de escudería sólo puede inscribir y consultar pilotos bajo el identificador de su propia escudería (`team_id`).
- Límite reglamentario: hasta 2 titulares y 2 suplentes por escudería.

**Horas reales**: 0,75 h (estimadas a partir de los commits del 2026-10-14, implementación asistida por IA).

**QA (Agustín)**: faltaba la licencia deportiva que pide el primer criterio; se agregó en schema (migración
`0007_add_driver_license`), contrato, API, formulario y nómina. Se sumaron test de integración del repositorio
(con violaciones de unicidad traducidas a 409), fuzz de la ruta y tests de UI. Consultas abiertas al PO en
[docs/preguntas-po.md](docs/preguntas-po.md) (formato de licencia, dorsal por categoría, foto → US-22).

**Alcance [equipo]**: la tarea de Naranja menciona endpoints POST/PUT; la edición de pilotos (PUT) es la US-11 del product backlog y no entra en este sprint.

**Falta para cerrar**: ninguno. Plan: [docs/plans/US-10-team-drivers.md](docs/plans/US-10-team-drivers.md).

---

### US-13 — Cargar sanciones a pilotos o escuderías

> **Como** Personal Administrativo de la FIA **quiero** cargar sanciones a pilotos o escuderías por incidentes de pista o infracciones técnicas y horarias
> **de forma que** queden asentadas de manera oficial e inmediata en el sistema. — SP 5 · BV 13

| Tarea (Naranja) | Est. | Real | Hecha |
|---|---|---|---|
| Diseñar y desarrollar la opción para cargar sanciones en el área administrativa de la FIA | 1,5 h | | [x] |
| Crear la tabla en la base de datos para registrar las sanciones (fecha, sancionado, motivo, penalización y duración) | 1 h | | [x] |
| Crear el formulario con validaciones para cargar los datos de la sanción | 1,5 h | | [x] |
| Crear la conexión necesaria para que el listado de sanciones esté disponible para las escuderías y público en general | 1,5 h | | [x] |
| Diseñar e implementar el listado de sanciones para las escuderías y público en general | 2 h | | [x] |
| **Total** | **7,5 h** | **0,75 h** | |

**Criterios de aceptación**
- [x] En menos de 10 minutos tiene que estar disponible la actualización del listado de las sanciones para las escuderías y público en general (en la web es en tiempo real/inmediato).
- [x] La opción para ver el listado debe estar disponible para escuderías y público general además de la administración FIA (sólo la FIA puede actualizarlo o cargarlo).
- [x] El listado debe mostrar todos los datos necesarios para saber a qué piloto o escudería se le otorgó.
- [x] Debe contar con filtros por fecha/temporada, tipo de sanción, escudería y cualquier otra relevante.
- [x] Las sanciones en el listado duran 5 años (alcance histórico acorde a US-5).

**Acuerdos con el PO (Grupo Naranja)**
- PO (17/10): la sanción lleva categoría, escudería, piloto (opcional), tipo, sanción, motivo, carrera (opcional) y fecha.
- Roles: Sólo el personal administrativo de la FIA (`fia_admin`) puede cargar y registrar sanciones. Escuderías y público en general tienen acceso de solo lectura.
- Tipos de sanción: recargo de tiempo, puestos en grilla, quita de puntos, descalificación, multa económica y apercibimiento.
- Alcance: sanciones aplicadas tanto a un piloto específico (asociado a su escudería) como a una escudería directamente.

**Horas reales**: 0,75 h (estimadas a partir de los commits del 2026-10-14, implementación asistida por IA).

**QA (Agustín)**: el listado no aplicaba los 5 años (ahora el servicio filtra por `issuedAt` de los últimos
5 años), el formulario no permitía sancionar a un piloto (se agregó el selector con `GET /teams/:id/drivers`) y
faltaba el filtro por escudería. Escudería o carrera inexistente daban 500 (ahora 404) y el tipo no tenía
`check` en la base. Se sumaron tests de integración, fuzz y de UI (mutación web 33 % → 85 %).

**Falta para cerrar**: ninguno. Plan: [docs/plans/US-13-penalties.md](docs/plans/US-13-penalties.md).

---

### US-21 — Ingresar fechas, tipos y resultado de controles técnicos por auto

> **Como** Personal Administrativo de la FIA **quiero** ingresar fechas, tipos de controles técnicos y el resultado (aprobado o rechazado) para cada auto
> **de forma que** se evalúe el cumplimiento de los reglamentos técnicos vigentes. — SP 3 · BV 13

| Tarea (Naranja) | Est. | Real | Hecha |
|---|---|---|---|
| Diseñar y desarrollar la opción para cargar controles técnicos en el área correspondiente al personal administrativo de la FIA | 1 h | | [x] |
| Crear la tabla correspondiente a los controles técnicos en la base de datos | 1 h | | [x] |
| Crear el formulario para cargar los datos de los controles técnicos | 1 h | | [x] |
| Crear la conexión necesaria para que el listado de controles técnicos esté disponible para las escuderías y público en general | 1 h | | [x] |
| Diseñar e implementar el listado de controles técnicos para las escuderías y público en general | 1 h | | [x] |
| **Total** | **5 h** | **0,5 h** | |

**Criterios de aceptación**
- [x] El listado de controles técnicos debe actualizarse en menos de 10 minutos (en la web es en tiempo real).
- [x] Los controles técnicos deben tener fecha, hora, vehículo inspeccionado y dictamen final (aprobado / rechazado).
- [x] Los controles técnicos duran en el listado hasta su fecha y hora de expiración que coincide con la del control / evento.
- [x] Disponible para escuderías y público general además de la administración FIA (sólo la FIA puede cargar/actualizar).

**Acuerdos con el PO (Grupo Naranja)**
- PO (17/10): el control se muestra hasta que vence; la vigencia la carga la FIA.
- Roles: Sólo `fia_admin` puede crear y gestionar controles técnicos. Escuderías y público en general tienen acceso de solo lectura.
- Tipos de control técnico: pesaje (`weight`), combustible (`fuel`), dimensiones y alerones (`dimensions`), motor y potencia (`engine`), seguridad (`safety`), inspección post-carrera (`post_race`).
- Resultados: Aprobado (`passed`) o Rechazado (`rejected`).
- Vehículo inspeccionado: asociado a una escudería (`team_id`) y opcionalmente a un auto/piloto (`driver_id` y su número de auto) y/o carrera (`race_id`).

**Horas reales**: 0,5 h (estimadas a partir de los commits del 2026-10-14, implementación asistida por IA).

**QA (Agustín)**: el listado mostraba también los controles vencidos (ahora oculta los que pasaron su
`expiresAt`), el vehículo inspeccionado (número de auto) era opcional y el formulario no permitía cargar la
fecha y hora del control ni su vigencia. Número de auto, fecha del control y vigencia pasan a ser obligatorios
(con `check` en la base: rango del auto, tipo, dictamen y vigencia posterior al control), y una FK inexistente
ahora responde 404 en lugar de 500. Se sumaron tests de integración, fuzz y de UI (mutación web 46 % → 83 %).

**Falta para cerrar**: ninguno. Plan: [docs/plans/US-21-technical-controls.md](docs/plans/US-21-technical-controls.md).

---

### US-6 — Chats de mensajería cifrados de extremo a extremo

> **Como** Personal Administrativo de la FIA y/o de las escuderías
> **quiero** que los chats de mensajería estén cifrados de extremo a extremo
> **de forma que** se valore la privacidad y la seguridad de los datos compartidos. — SP 13 · BV 13

| Tarea (Naranja) | Est. | Real | Hecha |
|---|---|---|---|
| Diseñar el protocolo de intercambio de claves públicas/privadas y almacenamiento seguro de llaves en el cliente | 2 h | | [x] |
| Implementar servicio de cifrado y descifrado de mensajes en el lado cliente antes del envío | 2 h | | [x] |
| Desarrollar backend de retransmisión de mensajes cifrados (almacenamiento como payload opaco en servidor) | 1,5 h | | [x] |
| Adaptar la interfaz del chat para mostrar estado de seguridad y verificación de claves de la conversación | 1,5 h | | [x] |
| Manejar escenarios de desconexión, almacenamiento local seguro y sincronización de mensajes fuera de línea | 1 h | | [x] |
| Pruebas de seguridad e interceptación: verificar que el servidor o un tercero no puedan leer el contenido de los mensajes | 1 h | | [x] |
| **Total** | **9 h** | **0,75 h** | |

**Criterios de aceptación**
- [x] Los mensajes se cifran en el dispositivo del emisor y solo pueden ser descifrados en el dispositivo del receptor destinatario.
- [x] La base de datos y los registros del servidor únicamente persisten el contenido cifrado (texto plano inaccesible para los administradores del servidor).
- [x] La interfaz del chat indica con un indicador visible que la conversación cuenta con cifrado extremo a extremo activo.
- [x] El sistema rechaza o alerta si una de las partes no tiene un par de claves válido o si la firma criptográfica del mensaje no coincide.

**Acuerdos con el PO (Grupo Naranja)**
- Criptografía estándar: Web Crypto API (`ECDH` P-256 para derivación de clave compartida, `AES-GCM` 256-bit para cifrado autenticado de mensajes, `ECDSA` para firmas de autenticidad).
- El servidor solo actúa como *relé opaco* (almacena clave pública de cada usuario en el registro y mensajes con payload cifrado e IV). No conoce las claves privadas de los usuarios.
- Acceso: Solo personal autenticado (`fia_admin` y `team_staff`). Las conversaciones se habilitan entre personal FIA y escuderías o entre escuderías.

**Horas reales**: 0,75 h (estimadas a partir de los commits del 2026-10-14, implementación asistida por IA).

**QA (Agustín)**: la entrega no cumplía ningún criterio. La pantalla mandaba el texto **en plano** (con IV y
firma falsos) y mostraba "Cifrado E2E" igual; las claves privadas vivían sólo en memoria; `isParticipant`
ignoraba el id de la conversación (cualquiera con un chat podía leer y escribir en todos); el `JOIN` de
`user.team_id` (text) con `teams.id` (uuid) rompía en Postgres; no había forma de iniciar una conversación;
y los parámetros no se validaban. Se reimplementó: cifrado AES-GCM con clave ECDH y firma ECDSA en el
navegador, claves privadas no exportables guardadas en IndexedDB, verificación de firma con alerta en cada
mensaje, selector de contactos (`GET /chat/contacts`), rechazo si el destinatario no tiene claves, control de
participantes y validación Zod. Se sumaron tests de integración, fuzz, un flujo E2E con claves reales y tests
de UI.

**Mejora [equipo]**: la conversación abierta se actualiza sola cada 3 s y la lista de conversaciones cada 10 s (antes había que recargar).
**Mejora [equipo]**: bandeja de salida sin conexión (tarea de Naranja "escenarios de desconexión y sincronización fuera de línea"): el mensaje cifrado queda pendiente y se envía al volver la red.

**Falta para cerrar**: ninguno. Plan: [docs/plans/US-6-encrypted-chat.md](docs/plans/US-6-encrypted-chat.md).

---

### US-2 — Realizar un testeo del nuevo incremento del producto

> **Como** Miembro del equipo de desarrollo
> **quiero** Realizar un testeo del nuevo incremento del producto
> **de forma que** Se ponga a prueba el producto. — SP 5 · BV 13

| Tarea (Naranja) | Est. | Real | Hecha |
|---|---|---|---|
| Configurar el framework de pruebas automatizadas y el pipeline de ejecución en el repositorio | 1 h | | [x] |
| Diseñar la matriz de casos de prueba funcionales e integración para los flujos críticos del incremento | 1,5 h | | [x] |
| Implementar casos de prueba automatizados (unitarios y de integración en endpoints críticos) | 2 h | | [x] |
| Ejecutar pruebas de regresión e interfaz de usuario (UI/flujos completos) | 1,5 h | | [x] |
| Documentar incidencias encontradas y verificar su resolución en una re-ejecución | 1 h | | [x] |
| **Total** | **7 h** | **0,75 h** | |

**Criterios de aceptación**
- [x] La suite de pruebas automatizadas se ejecuta con un único comando/pipeline y concluye sin fallos en el código integrado.
- [x] Se cubren con pruebas unitarias e integración las reglas de validación y persistencia de las entidades del sprint.
- [x] Toda discrepancia detectada queda registrada con pasos de reproducción, resultado esperado y resultado obtenido.
- [x] El incremento desplegado no presenta defectos bloqueantes ni fallos no controlados en los flujos principales.

**Acuerdos con el PO (Grupo Naranja)**
- Alcance del incremento de Sprint 2: autenticación segura con roles (US-4), registro y gestión de pilotos por escudería (US-10), gestión y consulta de sanciones (US-13), inspecciones y controles técnicos vehiculares (US-21) y mensajería cifrada E2E entre FIA y escuderías (US-6).
- Automatización: `pnpm test:coverage` y `pnpm test:int` garantizan la suite reproducible e integrada.

**Horas reales**: 0,75 h (estimadas a partir de los commits del 2026-10-14, implementación asistida por IA).

**QA (Agustín)**: la matriz daba por aprobados casos que no lo estaban (el chat mandaba texto plano) y el test
del incremento usaba datos que hoy el contrato rechaza. Se rehízo la matriz apuntando a los tests reales
(`docs/testing.md`), se reescribió el flujo integral en `sprint2-increment-*.test.ts`, el seed de la demo
carga licencias y controles vigentes, y la mutación web del shard `rest` pasó de 57,6 % a 83,4 %.

**Falta para cerrar**: ninguno. Plan: [docs/plans/US-2-increment-testing.md](docs/plans/US-2-increment-testing.md).

---

## Sprint 3 — 20/10/2026 → 03/11/2026 (demo: martes 03/11/2026)

Fuente: [`docs/specs/GrupoNaranjaSprint3.pdf`](docs/specs/GrupoNaranjaSprint3.pdf) (§4). Escala de Naranja para este
sprint: 1 SP = 0–0,5 h · 2 = 0,5–1 h · 3 = 1–1,5 h · 5 = 1,5–2 h · 8 = 2,5–3 h · 13 = 4 h.

### Resumen

| ID | Ítem | SP | BV | Est. | Real impl. | Estado | Dueño | Depende de | Plan |
|---|---|---|---|---|---|---|---|---|---|
| US-19 | Modificar o dar de baja eventos deportivos programados | 5 | 13 | 2 h | 0,75 h | Hecho | Equipo | US-20, T-2 | [Plan](docs/plans/US-19-modify-cancel-races.md) · #32 |
| US-24 | Visualizar resultados y observaciones de controles técnicos | 2 | 13 | 0,75 h | 0,5 h | Hecho | Equipo | US-21 | [Plan](docs/plans/US-24-technical-controls-observations.md) · #32 |
| US-27 | Crear, modificar y eliminar cuentas de usuario de los pilotos | 5 | 13 | 1,5 h | 1 h | Hecho | Equipo | US-10, US-29 | [Plan](docs/plans/US-27-driver-accounts.md) · #32 |
| US-29 | Detectar el tipo de cuenta en el login y mostrar la interfaz de cada rol | 3 | 13 | 1 h | 0,5 h | Hecho | Equipo | US-4 | [Plan](docs/plans/US-29-role-detection-and-interfaces.md) · #32 |
| US-16 | Consultar el listado histórico y en vivo de sanciones | 3 | 8 | 1,25 h | 0,75 h | Hecho | Equipo | US-13 | [Plan](docs/plans/US-16-penalties-history-live.md) · #32 |
| US-3 | Aplicar filtros (fecha, año, relevancia, tipo, identificador) | 5 | 8 | 1,5 h | 0,5 h | Hecho | Equipo | US-13, US-21 | [Plan](docs/plans/US-3-reusable-filters.md) · #32 |
| US-11 | Modificar pilotos y su condición de titular o suplente | 5 | 8 | 2 h | 0,75 h | Hecho | Equipo | US-10 | [Plan](docs/plans/US-11-modify-team-drivers.md) · #32 |
| US-15 | Asentar la confirmación de notificación de una sanción | 3 | 8 | 1 h | 0,75 h | Hecho | Equipo | US-13, US-9 | [Plan](docs/plans/US-15-penalty-notifications.md) · #32 |
| QA-S3 | Auditoría de QA del sprint y corrección de criterios **[equipo]** | — | — | — | 2,5 h | Hecho | Agustín Paul | todas | [Plan](docs/plans/QA-S3-auditoria-sprint-3.md) · #32 |

**Estado**: la implementación inicial se marcó `Hecho` sin PR ni review. La auditoría de QA (31/10) encontró que
**ninguna US cumplía todos sus criterios** y que la integración contra Postgres estaba rota (faltaban migraciones).
Las correcciones se mergearon a `develop` en el PR #32 (31/10) y se publicaron en `main` con el release del Sprint 3. Detalle por criterio y evidencia: [docs/plans/QA-S3-auditoria-sprint-3.md](docs/plans/QA-S3-auditoria-sprint-3.md).

**Horas reales del sprint: 8 h** (5,5 h de implementación inicial, columna "Real impl.", + 2,5 h de QA y
correcciones con Claude Code el 31/10, de 13:55 a 16:25 UTC), contra 11 h estimadas por Naranja.

---

### US-19 — Modificar o dar de baja eventos deportivos programados

> **Como** Personal Administrativo de la FIA **quiero** modificar o dar de baja eventos deportivos previamente
> programados **de forma que** el calendario refleje cualquier cambio o suspensión de último momento. — SP 5 · BV 13

| Tarea (Naranja) | Est. | Hecha |
|---|---|---|
| Agregar el estado del evento (programado / modificado / cancelado) y el registro de cambios (quién y cuándo) | 0,25 h | [x] |
| Endpoints de modificación y baja lógica, sólo para la FIA, con validaciones (evento existente, fecha válida) | 0,5 h | [x] |
| Pantalla de edición y acción "dar de baja" con confirmación en el área de la FIA | 0,5 h | [x] (QA) |
| Vista de calendario para escuderías y público con marca "Modificado" o "Cancelado" | 0,5 h | [x] (QA) |
| Pruebas de permisos, validaciones y cancelación | 0,25 h | [x] |

**Criterios de aceptación**
- [x] La FIA modifica fecha, hora, circuito y tipo de un evento programado, o lo da de baja tras una confirmación.
- [x] El cambio se ve en el calendario de escuderías y público en menos de 10 minutos, con la marca "Modificado" o "Cancelado". La baja es lógica.
- [x] Cada cambio registra quién lo hizo y cuándo.
- [x] Un rol distinto de la FIA recibe 401/403.
- [x] Los datos faltantes o una fecha inválida se rechazan con un mensaje claro.

**QA**: faltaban la pantalla, el circuito, la migración de `races.status` y el estado en el lector del calendario
(sólo lo devolvía el fake); el autor caía en `'system'`. Corregido en `daa8d69`.

---

### US-24 — Visualizar resultados y observaciones de controles técnicos

> **Como** Personal de las escuderías **quiero** visualizar los resultados y observaciones de los controles técnicos
> realizados sobre los autos **de forma que** podamos corregir anomalías antes de los eventos deportivos. — SP 2 · BV 13

| Tarea (Naranja) | Est. | Hecha |
|---|---|---|
| Agregar el campo "observaciones" al control técnico y al formulario de la FIA de US-21 | 0,25 h | [x] |
| Endpoint y vista "mis autos", filtrados por la escudería autenticada, con los rechazados destacados | 0,25 h | [x] |
| Pruebas de aislamiento por escudería y de datos completos | 0,25 h | [x] |

**Criterios de aceptación**
- [x] La escudería ve los controles técnicos de sus autos con fecha, hora, tipo, vehículo, resultado y observaciones.
- [x] Los controles rechazados se distinguen visualmente de los aprobados.
- [x] Las observaciones sólo las ven la escudería dueña y la FIA; el público ve únicamente el estado y el dictamen.
- [x] Un control nuevo o modificado aparece en el listado en menos de 10 minutos.

**QA**: faltaba la actualización automática (se agregó cada 60 s). Corregido en `123742e`.

---

### US-27 — Crear, modificar y eliminar cuentas de usuario de los pilotos

> **Como** Personal Administrativo de la FIA **quiero** crear, modificar y eliminar cuentas de usuario de los pilotos
> **de forma que** haya un usuario oficial para cada piloto y sea distinguible de un usuario normal. — SP 5 · BV 13

| Tarea (Naranja) | Est. | Hecha |
|---|---|---|
| Agregar el rol "Piloto", vincular la cuenta a un piloto de US-10 e indicar que es cuenta oficial | 0,25 h | [x] (QA) |
| Endpoints de alta, modificación y baja lógica reutilizando el servicio de cuentas de US-23 | 0,25 h | [x] (QA) |
| Pantallas de listado, alta, edición y baja en el área de la FIA | 0,5 h | [x] (QA) |
| Insignia de cuenta oficial en el perfil, los listados y el chat | 0,25 h | [x] (QA) |
| Pruebas de permisos, mail único, cuenta duplicada y bloqueo de acceso tras la baja | 0,25 h | [x] |

**Criterios de aceptación**
- [x] La FIA crea una cuenta de piloto asociada a un piloto existente. Cada piloto tiene una sola cuenta y el mail no se repite ni se reutiliza.
- [x] "Eliminar" es una baja lógica: el piloto dado de baja no puede iniciar sesión y se muestra como inactivo en el listado de la FIA.
- [x] La cuenta muestra el rol "Piloto" y una insignia de cuenta oficial, distinguible de un usuario común.
- [x] Sólo el personal de la FIA gestiona estas cuentas: cualquier otro rol recibe 401/403.
- [x] La contraseña inicial la define el administrador, como en US-23.

**QA**: sólo funcionaba con el fake en memoria (el repositorio real no implementaba las cuentas) y no había
pantallas. Se reimplementó en `apps/api/src/features/driver-accounts` con tabla versionada. Corregido en `e9525ce`.

---

### US-29 — Detectar el tipo de cuenta en el login y mostrar la interfaz de cada rol

> **Como** Miembro del equipo de desarrollo **quiero** que el sistema detecte en el inicio de sesión si la cuenta es
> de un administrativo de la FIA, de una escudería o de un usuario común mediante identificadores integrados
> **de forma que** haya interfaces específicas para cada uno. — SP 3 · BV 13

| Tarea (Naranja) | Est. | Hecha |
|---|---|---|
| Ampliar los roles a Admin FIA, Admin escudería, Piloto y Usuario común, guardando el identificador en la cuenta | 0,25 h | [x] |
| Ajustar el login para devolver el rol y redirigir, y guardas de ruta en el frontend | 0,25 h | [x] (QA) |
| Layout y menú propios de cada rol, reutilizando el diseño común | 0,25 h | [x] (QA) |
| Pruebas de la matriz rol × área (acceso permitido y denegado) | 0,25 h | [x] |

**Criterios de aceptación**
- [x] Al iniciar sesión, el sistema identifica el rol por un identificador guardado en la cuenta; el usuario no puede elegirlo.
- [x] Cada rol ve su propia interfaz, con menú y funciones propias.
- [x] Si alguien entra por URL al área de otro rol, el servidor responde 401/403 y lo redirige.
- [x] Una cuenta dada de baja o sin rol válido no accede.
- [x] Las cuentas creadas en sprints anteriores siguen funcionando con su rol correcto.

**QA**: faltaban el área y el menú del piloto, la redirección del login y de las guardas, y el rechazo de roles
desconocidos. Corregido en `ff03c9a`.

---

### US-16 — Consultar el listado histórico y en vivo de sanciones

> **Como** Usuario **quiero** consultar el listado histórico y en vivo de sanciones emitidas durante la temporada
> **de forma que** pueda comprender los recargos de tiempo o penalizaciones en la grilla. — SP 3 · BV 8

| Tarea (Naranja) | Est. | Hecha |
|---|---|---|
| Temporada (año) en el listado de US-13, con la actual por defecto y selector de temporadas anteriores | 0,25 h | [x] (QA) |
| Penalización clara en el listado y el detalle (tipo, valor, carrera, categoría y motivo) | 0,5 h | [x] |
| Actualización automática del listado sin recargar la página | 0,25 h | [x] |
| Pruebas (acceso sin sesión, sanción nueva sin recargar, histórico de 5 años, filtros de US-3) | 0,25 h | [x] |

**Criterios de aceptación**
- [x] Cualquier usuario, incluso sin sesión, ve las sanciones de la temporada actual y puede consultar temporadas anteriores (hasta 5 años).
- [x] Cada sanción muestra fecha, carrera, categoría, sancionado, motivo y penalización.
- [x] Una sanción nueva o modificada aparece en menos de 10 minutos sin recargar.
- [x] El listado se filtra por fecha, tipo de sanción y escudería (filtros de US-3).
- [x] El público no ve el estado "Pendiente" o "Notificada" de US-15.

**QA**: no arrancaba en la temporada actual, el selector estaba fijo y faltaba el filtro por fecha. Corregido en `3017c61`.

---

### US-3 — Aplicar filtros (fecha, año, relevancia, tipo de control, identificador)

> **Como** Usuario **quiero** aplicar filtros por fecha, año, relevancia, tipo de control técnico, identificador, etc.
> **de forma que** se puedan conseguir los datos de forma más directa. — SP 5 · BV 8

| Tarea (Naranja) | Est. | Hecha |
|---|---|---|
| Extraer los filtros de sanciones (US-13) a una lógica común en el backend | 0,5 h | [x] (QA) |
| Aplicarlos a calendario, resultados y puntajes, y controles técnicos | 0,5 h | [x] (QA) |
| Componente de filtros reutilizable con "Limpiar" y mensaje "Sin resultados" | 0,25 h | [x] (QA) |
| Pruebas de filtros solos y combinados, con 5 años de datos | 0,25 h | [x] (QA) |

**Criterios de aceptación**
- [x] Calendario, resultados, sanciones y controles técnicos se filtran por fecha o rango, año, tipo de control e identificador (escudería, piloto o evento).
- [x] Los filtros se combinan y se limpian con un solo botón. Los filtros de sanciones siguen funcionando.
- [x] La relevancia ordena los resultados con los registros más recientes o próximos primero.
- [x] Si no hay coincidencias, se muestra "Sin resultados".
- [x] Los filtros funcionan igual para el público y para usuarios con sesión, y responden en menos de 2 segundos con 5 años de datos.

**QA**: la lógica común existía pero no la usaba nadie; calendario y resultados no tenían filtros. Ver
[`docs/features/filters`](docs/features/filters/README.md). Corregido en `3017c61`.

---

### US-11 — Modificar pilotos y su condición de titular o suplente

> **Como** Personal de las escuderías **quiero** modificar la información de los pilotos y su condición de titular o
> suplente en cualquier momento **de forma que** los cambios se reflejen de inmediato ante la FIA y el público. — SP 5 · BV 8

| Tarea (Naranja) | Est. | Hecha |
|---|---|---|
| Endpoint PUT de edición y cambio titular/suplente con las validaciones de US-10 | 0,5 h | [x] |
| Formulario de edición reutilizando el de alta | 0,25 h | [x] |
| Registro de quién modificó y cuándo | 0,25 h | [x] (QA) |
| Vista de sólo lectura de pilotos para la FIA y el público (versión mínima de US-17) | 0,5 h | [x] (QA) |
| Pruebas de validaciones, acceso a pilotos ajenos y reflejo de cambios | 0,5 h | [x] |

**Criterios de aceptación**
- [x] La escudería edita los datos de sus pilotos y cambia su condición de titular o suplente en cualquier momento.
- [x] Un cambio que viole las validaciones de US-10 es rechazado.
- [x] Los cambios se ven ante la FIA y el público a más tardar en la siguiente carga de pantalla.
- [x] Una escudería no puede editar pilotos de otra: el servidor responde 401/403.
- [x] Cada modificación registra quién la hizo y cuándo.

**QA**: faltaban el registro del autor (`drivers.updated_by_user_id`) y la vista pública (`/drivers`). Corregido en `490f033`.

---

### US-15 — Asentar la confirmación de notificación de una sanción

> **Como** Personal de las escuderías **quiero** asentar en la plataforma la confirmación de notificación de una
> sanción aplicada a mi equipo o piloto **de forma que** se cumpla con el procedimiento reglamentario. — SP 3 · BV 8

| Tarea (Naranja) | Est. | Hecha |
|---|---|---|
| Notificar a la escudería al cargar una sanción, reutilizando el módulo de US-9 | 0,25 h | [x] (QA) |
| Adaptar el flujo de confirmación de US-9 al tipo "sanción" (quién, cuándo, una vez por escudería) | 0,25 h | [x] |
| Mostrar "Pendiente" o "Notificada" en el listado, con la confirmación visible para la FIA | 0,25 h | [x] (QA) |
| Pruebas (doble confirmación, sanciones ajenas, visibilidad para la FIA) | 0,25 h | [x] |

**Criterios de aceptación**
- [x] La escudería recibe una notificación al aplicarse una sanción a su equipo o pilotos y puede confirmarla con un clic.
- [x] Se guardan la sanción, la escudería, el usuario, la fecha y la hora. Confirma una persona por escudería y no se puede confirmar dos veces.
- [x] La FIA ve el estado de cada sanción y quién la confirmó y cuándo.
- [x] Una escudería sólo puede confirmar sanciones dirigidas a ella o a sus pilotos.
- [x] El registro de confirmación no se puede editar ni borrar.

**Acuerdo con el PO (31/10)**: la notificación va en la bandeja de notificaciones de US-9.

**QA**: no se notificaba a la escudería y la FIA no veía quién confirmó. Corregido en `05603b0`.

---

## Diferido

| ID | Ítem | Motivo | Estado |
|---|---|---|---|
| T-3 | Tests e2e con Playwright de los flujos principales **[equipo]** | Se dejan para el final del proyecto (decisión del equipo). | Pendiente |

## Product backlog (no seleccionado para los Sprints 1 a 3)

| ID | Como | Quiero | SP | BV |
|---|---|---|---|---|
| US-1 | Miembro del equipo de desarrollo | Que la aplicación tenga el mismo desempeño en móvil y en web | 8 | 8 |
| US-7 | Usuario | Acceder a la app móvil con datos biométricos o el PIN del celular | 13 | 5 |
| US-8 | Personal Administrativo de la FIA | Cargar una fecha de carrera o evento (categoría, circuito y fecha) | 5 | 5 |
| US-12 | Miembro del equipo de desarrollo | Alta disponibilidad y escalabilidad en número de usuarios | 13 | 8 |
| US-14 | Usuario | Crear un nuevo usuario desde la app | 3 | 1 |
| US-17 | Usuario | Consultar perfiles de pilotos titulares y suplentes de todas las escuderías | 3 | 8 |
| US-18 | Usuario | Compartir contenido en redes sociales (WhatsApp, Instagram) | 5 | 2 |
| US-22 | Miembro del equipo de desarrollo | Cargar fotos de pilotos y autos. **[equipo]** Incluye la foto o documentación del piloto que mencionaba la tarea de la pantalla de US-10 (PO, 17/10) | 2 | 3 |
| US-25 | Usuario | Visualizar reportes de controles técnicos por gran premio | 2 | 5 |
| US-26 | Usuario | Solicitar un cambio de contraseña desde la app (email con pasos) | 5 | 2 |
| US-28 | Usuario | Descargar el calendario en PDF | 2 | 1 |

## Observaciones sobre la planificación de Naranja [equipo]

- El documento se titula "Sprint 0" pero su Sprint Backlog es el del **Sprint 1** (así lo pide el enunciado:
  el Sprint 0 define el Sprint 1).
- US-20, US-23 y US-9 dependen de un login con roles (US-4, no seleccionada): se cubre con el habilitador T-1.
- Varios criterios de aceptación no eran medibles ("rápida actualización", "carga rápida"): el PO los fijó en
  menos de 10 minutos (respuestas del PO).
- El PO acordó hacer un login básico en lugar de incluir US-4 (respuesta 1): cubierto por T-1.
