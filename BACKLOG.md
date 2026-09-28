# Backlog — Sistema de gestión de la FIA

Fuente: planificación del **Grupo Naranja** (PO / Analista y Management),
[`docs/specs/GrupoNaranjaSprint0.pdf`](docs/specs/GrupoNaranjaSprint0.pdf). Las historias se transcriben tal
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
- Horas reales del Sprint 1 informadas por el equipo: **10 h** en total. T-0 (setup, planificación y
  convenciones) 5,5 h · T-1 + T-2 + US-23 2 h · US-20 + US-9 + US-5 1 h · revisión, CI, integración y release 1,5 h.
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

**Horas reales del sprint: 10 h** (informadas por el equipo, incluyen el setup del proyecto).

**Orden sugerido [equipo]**: T-1 y T-2 en paralelo → US-23 → US-20 → US-9. US-5 en paralelo apenas esté T-2.
Las estimaciones de los habilitadores las hace el equipo **sin IA** (pauta de la cátedra para el Sprint 1).

---

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

**Preguntas abiertas para el PO**
1. ¿Se ratifica que la baja es terminal y que email y legajo no se reutilizan?
2. ¿El cargo queda como texto libre o se define una lista cerrada para US-23?
3. ¿Se ratifica que el teléfono es obligatorio con validación flexible?
4. ¿Se permite reasignar escudería en una cuenta activa y US-9 guardará la escudería histórica?
5. ¿El listado administrativo incluye siempre las cuentas dadas de baja?
6. ¿Se ratifica que la contraseña inicial se entrega fuera del sistema hasta que exista US-26?

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

**Preguntas abiertas para el PO**
1. ¿F2, F3 y F1 Academy usan la misma escala de puntos que F1?

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

## Diferido

| ID | Ítem | Motivo | Estado |
|---|---|---|---|
| T-3 | Tests e2e con Playwright de los flujos principales **[equipo]** | Se dejan para el final del proyecto (decisión del equipo). | Pendiente |
| T-4 | Migrar los formularios de US-23 a `react-hook-form` + resolver Zod del contrato **[equipo]** | Hoy usan `useState` y validan sólo en el servidor; la convención (`docs/conventions/react.md`) pide validación en el cliente con el mismo schema. | Pendiente |

## Product backlog (no seleccionado para el Sprint 1)

| ID | Como | Quiero | SP | BV |
|---|---|---|---|---|
| US-1 | Miembro del equipo de desarrollo | Que la aplicación tenga el mismo desempeño en móvil y en web | 8 | 8 |
| US-2 | Miembro del equipo de desarrollo | Realizar un testeo del nuevo incremento del producto | 5 | 13 |
| US-3 | Usuario | Aplicar filtros (fecha, año, relevancia, tipo de control técnico, identificador, etc.) | 5 | 8 |
| US-4 | Personal Administrativo de la FIA | Iniciar sesión mediante credenciales seguras | 13 | 13 |
| US-6 | Personal Administrativo de la FIA y/o de las escuderías | Chats de mensajería cifrados de extremo a extremo | 13 | 13 |
| US-7 | Usuario | Acceder a la app móvil con datos biométricos o el PIN del celular | 13 | 5 |
| US-8 | Personal Administrativo de la FIA | Cargar una fecha de carrera o evento (categoría, circuito y fecha) | 5 | 5 |
| US-10 | Personal de las escuderías | Cargar la información de los pilotos titulares y suplentes | 5 | 13 |
| US-11 | Personal de las escuderías | Modificar la información de los pilotos y su condición de titular/suplente | 5 | 8 |
| US-12 | Miembro del equipo de desarrollo | Alta disponibilidad y escalabilidad en número de usuarios | 13 | 8 |
| US-13 | Personal Administrativo de la FIA | Cargar sanciones a pilotos o escuderías | 5 | 13 |
| US-14 | Usuario | Crear un nuevo usuario desde la app | 3 | 1 |
| US-15 | Personal de las escuderías | Asentar la confirmación de notificación de una sanción | 3 | 8 |
| US-16 | Usuario | Consultar el listado histórico y en vivo de sanciones de la temporada | 3 | 8 |
| US-17 | Usuario | Consultar perfiles de pilotos titulares y suplentes de todas las escuderías | 3 | 8 |
| US-18 | Usuario | Compartir contenido en redes sociales (WhatsApp, Instagram) | 5 | 2 |
| US-19 | Personal Administrativo de la FIA | Modificar o dar de baja eventos deportivos programados | 5 | 13 |
| US-21 | Personal Administrativo de la FIA | Ingresar fechas, tipos y resultado de controles técnicos por auto | 3 | 13 |
| US-22 | Miembro del equipo de desarrollo | Cargar fotos de pilotos y autos | 2 | 3 |
| US-24 | Personal de las escuderías | Visualizar resultados y observaciones de controles técnicos | 2 | 13 |
| US-25 | Usuario | Visualizar reportes de controles técnicos por gran premio | 2 | 5 |
| US-26 | Usuario | Solicitar un cambio de contraseña desde la app (email con pasos) | 5 | 2 |
| US-27 | Personal Administrativo de la FIA | Crear, modificar y eliminar cuentas de usuario de los pilotos | 5 | 13 |
| US-28 | Usuario | Descargar el calendario en PDF | 2 | 1 |
| US-29 | Miembro del equipo de desarrollo | Detectar en el login el tipo de cuenta y mostrar la interfaz correspondiente | 3 | 13 |

## Observaciones sobre la planificación de Naranja [equipo]

- El documento se titula "Sprint 0" pero su Sprint Backlog es el del **Sprint 1** (así lo pide el enunciado:
  el Sprint 0 define el Sprint 1).
- US-20, US-23 y US-9 dependen de un login con roles (US-4, no seleccionada): se cubre con el habilitador T-1.
- Varios criterios de aceptación no eran medibles ("rápida actualización", "carga rápida"): el PO los fijó en
  menos de 10 minutos (respuestas del PO).
- El PO acordó hacer un login básico en lugar de incluir US-4 (respuesta 1): cubierto por T-1.
