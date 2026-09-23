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
- Escala de Naranja: story points y business value en Fibonacci. SP ↔ horas: 1 = ≤ 12 h · 2 = 12–14 h ·
  3 = 14–16 h · 5 = 16–18 h.

## Sprint 1 — 22/09/2026 → 05/10/2026 (demo: martes 06/10/2026)

### Resumen

| ID | Ítem | SP | BV | Est. | Real | Estado | Dueño | Depende de | PR |
|---|---|---|---|---|---|---|---|---|---|
| T-0 | Setup del repositorio y convenciones **[equipo]** | — | — | — | — | Hecho | Agustín | — | — |
| T-1 | Autenticación mínima con roles **[equipo]** | — | — | — | 3 h | Hecho | Agustín | T-0 | |
| T-2 | Modelo de datos base y seed **[equipo]** | — | — | — | 3 h | Hecho | Agustín | T-0 | |
| US-23 | Gestión de cuentas del personal de escuderías | 5 | 13 | 17 h | | Pendiente | | T-1 | |
| US-20 | Carga y modificación del puntaje de una carrera | 1 | 21 | 12 h | | Pendiente | | T-1, T-2 | |
| US-9 | Confirmar notificación del puntaje recibido | 1 | 13 | 10 h | | Pendiente | | US-20, US-23 | |
| US-5 | Ver resultados de carreras de los últimos años | 2 | 13 | 14 h | | Pendiente | | T-2 | |

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
| Analizar y desarrollar la forma en la que se almacenarán los datos | 4 h | | [ ] |
| Diseñar e implementar la interfaz mediante la cual el personal administrativo de la FIA podrá acceder a estas funcionalidades | 4 h | | [ ] |
| Verificar la integridad y la consistencia de los datos ingresados considerando los almacenados | 2 h | | [ ] |
| Diseñar e implementar la comunicación entre la interfaz y el almacenamiento | 3 h | | [ ] |
| Realizar pruebas funcionales | 4 h | | [ ] |
| **Total** | **17 h** | | |

**Criterios de aceptación**
- [ ] Los datos almacenados perduran y son consistentes.
- [ ] Las acciones que se pueden llevar a cabo son consistentes con las acciones pasadas y la información
      guardada (p. ej. si se eliminó una cuenta ya no se puede ingresar a la misma).
- [ ] Verificar que las cuentas puedan acceder a sus funcionalidades correspondientes.

**Preguntas abiertas para el PO**
- ¿Qué datos tiene una cuenta de personal de escudería (nombre, email, cargo, escudería)? ¿Una persona puede
  pertenecer a más de una escudería?
- ¿Eliminar es borrado definitivo o baja lógica (para conservar el historial de confirmaciones de US-9)?
- ¿Cómo recibe la persona su contraseña inicial (la define el admin, se envía por email)?

**Falta para cerrar**: todo.

### US-20 — Carga y modificación del puntaje de una carrera

> **Como** Personal Administrativo de la FIA **quiero** poder cargar y modificar el puntaje de una carrera
> **de forma que** sean visibles para las escuderías y el público. — SP 1 · BV 21

| Tarea (Naranja) | Est. | Real | Hecha |
|---|---|---|---|
| Diseñar y desarrollar la forma en la que se otorgará esta opción en la interfaz de los administradores | 2 h | | [ ] |
| Analizar, diseñar y desarrollar la forma en la que se almacenarán los puntajes de las carreras | 2 h | | [ ] |
| Diseñar y desarrollar los formularios en los que se cargarán los datos sobre los puntajes | 4 h | | [ ] |
| Configurar la actualización inmediata de los datos sobre los puntajes | 4 h | | [ ] |
| **Total** | **12 h** | | |

**Criterios de aceptación**
- [ ] Rápida actualización en las modificaciones de los puntajes.
- [ ] El formulario valida adecuadamente las entradas de datos.

**Preguntas abiertas para el PO**
- ¿Qué sistema de puntos se usa (25-18-15-…-1 de F1, punto extra por vuelta rápida, sprints)? ¿Es igual en
  F2, F3 y F1 Academy?
- ¿Se cargan posiciones y el sistema calcula los puntos, o se cargan los puntos directamente?
- "Rápida actualización": ¿qué tiempo máximo se considera aceptable para que el público vea el cambio?
- ¿Modificar un puntaje ya notificado genera una nueva notificación (US-9)?

**Falta para cerrar**: todo.

### US-9 — Confirmar notificación del puntaje recibido

> **Como** Personal de las escuderías **quiero** confirmar que se me notificó sobre el puntaje recibido
> **de forma que** pueda confirmarlo con un click en una notificación de la app. — SP 1 · BV 13

| Tarea (Naranja) | Est. | Real | Hecha |
|---|---|---|---|
| Analizar, diseñar y desarrollar la forma en que el personal de las escuderías reciben las notificaciones | 2 h | | [ ] |
| Diseñar e implementar la forma en la que se confirma la notificación del puntaje recibido | 2 h | | [ ] |
| Verificar que se puede confirmar el puntaje recibido en menos de un minuto a partir de que la información sobre los puntajes esté cargada | 2 h | | [ ] |
| Realizar pruebas funcionales | 4 h | | [ ] |
| **Total** | **10 h** | | |

**Criterios de aceptación**
- [ ] Una vez que el personal confirma el puntaje recibido desaparece la notificación.
- [ ] Verificar que la confirmación quedó asentada correctamente.
- [ ] La confirmación se puede realizar de forma fácil y rápida.

**Preguntas abiertas para el PO**
- ¿"Notificación de la app" es una notificación dentro de la web (bandeja) o push al celular? Para el Sprint 1
  se propone in-app (la app móvil no existe todavía).
- ¿Confirma una persona por escudería o cada miembro del personal?
- ¿Qué queda registrado de la confirmación (quién, cuándo)? ¿Lo puede ver la FIA?

**Falta para cerrar**: todo.

### US-5 — Ver resultados de carreras de los últimos años

> **Como** Usuario **quiero** poder ver los resultados de las carreras de los últimos años **de forma que**
> pueda ver la información rápidamente. — SP 2 · BV 13

| Tarea (Naranja) | Est. | Real | Hecha |
|---|---|---|---|
| Analizar y desarrollar la forma en la que se obtendrán los datos | 3 h | | [ ] |
| Analizar y desarrollar la forma en la que se almacenarán los datos | 2 h | | [ ] |
| Optimizar las consultas sobre los datos | 3 h | | [ ] |
| Analizar y diseñar la forma en la que se mostrarán los datos | 2 h | | [ ] |
| Realizar pruebas funcionales | 4 h | | [ ] |
| **Total** | **14 h** | | |

**Criterios de aceptación**
- [ ] La información de las carreras se visualiza de forma clara y ordenada.
- [ ] La carga de los datos es rápida.

**Preguntas abiertas para el PO**
- ¿Cuántos años son "los últimos años"? ¿Qué categorías?
- ¿De dónde salen los datos históricos (carga manual, importación de una fuente pública)?
- "Carga rápida": ¿qué tiempo máximo es aceptable?

**Falta para cerrar**: todo.

---

## Diferido

| ID | Ítem | Motivo | Estado |
|---|---|---|---|
| T-3 | Tests e2e con Playwright de los flujos principales **[equipo]** | Se dejan para el final del proyecto (decisión del equipo). | Pendiente |

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
- Varios criterios de aceptación no son medibles ("rápida actualización", "carga rápida", "fácil y rápida"):
  se propone acordar umbrales concretos con el PO (ver preguntas abiertas).
