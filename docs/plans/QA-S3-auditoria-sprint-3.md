# Plan: QA-S3 — Auditoría de QA del Sprint 3 y corrección de criterios

- **Ítem del backlog**: US-29, US-27, US-11, US-24, US-15, US-16, US-19, US-3 (Sprint 3)
- **Autor**: Claude Code (rol QA) para Agustín Paul · **Fecha**: 2026-10-31 · **Estado**: Aplicado (aprobado por Agustín el 31/10)
- **Fuente de criterios**: `InformeSprint3GrupoNaranja.pdf`, §4.2 (Grupo Naranja)

## Estado de los gates al iniciar la auditoría (`e72607b`)

| Gate | Resultado |
|---|---|
| `pnpm lint`, `pnpm typecheck` | ✅ |
| `pnpm test:coverage` | ✅ 780 tests · 95,2 % líneas / 87,1 % ramas |
| `pnpm test:int` | ❌ **51 de 56 fallan**: `column "status" of relation "races" does not exist` |

**Bloqueante transversal**: se cambió el schema (`races.status`, `races.updated_by_user_id`,
`penalties.confirmed_at`, `penalties.confirmed_by_user_id`, `user.driver_id`) **sin generar migraciones**. La
app real no levanta estas features y la integración (US-2) queda rota. Además: `races.status` es `varchar` sin
`check`, y `confirmed_by_user_id`, `updated_by_user_id` y `driver_id` no tienen FK.

**Proceso**: 9 commits directo en la rama, sin PR ni review; BACKLOG marca todo `Hecho` sin sección de
detalle ni criterios transcriptos (regla de `docs/workflow.md` §1 y DoD). Varios ports usan métodos
**opcionales** (`listAccounts?`, `confirm?`, `updateRace?`) que permiten que el repositorio real no los
implemente sin que el typecheck lo detecte.

## Auditoría por US (✅ cumple · ⚠️ parcial · ❌ no cumple)

### US-29 — Detectar tipo de cuenta y mostrar interfaz por rol

| Criterio | Estado | Evidencia |
|---|---|---|
| El rol se identifica por un identificador de la cuenta; el usuario no lo elige | ✅ | `user.role`, `roleSchema` con `driver` |
| Cada rol ve su propia interfaz, con menú y funciones propias | ❌ | No existe área ni menú para `driver`; `RequireDriver` no se usa en ninguna ruta |
| Entrar por URL al área de otro rol ⇒ 401/403 y redirige | ⚠️ | API responde 403; la web muestra un aviso pero no redirige |
| Cuenta dada de baja o sin rol válido no accede | ⚠️ | `banned` ⇒ sesión nula ✅; rol inválido se degrada a `public` en lugar de rechazarse |
| Cuentas de sprints anteriores siguen funcionando | ✅ | Tests de sesión |
| Login redirige según rol | ⚠️ | `use-login` no contempla `driver` |

### US-27 — Cuentas oficiales de pilotos

| Criterio | Estado | Evidencia |
|---|---|---|
| La FIA crea una cuenta asociada a un piloto existente; una sola cuenta por piloto; mail único | ❌ | `DrizzleTeamDriversRepository` **no implementa** `listAccounts/createAccount/...`: en producción el listado es `[]` y el alta da `INTERNAL_ERROR`. Sólo funciona el fake en memoria |
| "Eliminar" es baja lógica; no puede iniciar sesión; se ve inactivo | ❌ | Ídem; no reutiliza el adapter de Better Auth de US-23 (ban + borrar sesiones) |
| Muestra rol "Piloto" e insignia oficial | ❌ | `OfficialBadge` existe pero no se usa en perfil, listados ni chat |
| Sólo la FIA gestiona; otro rol 401/403 | ✅ | `requireRole('fia_admin')` + tests |
| Contraseña inicial la define el admin | ⚠️ | Contrato la pide, pero nunca llega a Better Auth |
| Pantallas de listado/alta/edición/baja en el área FIA | ❌ | No existen |

### US-11 — Modificar pilotos y condición titular/suplente

| Criterio | Estado | Evidencia |
|---|---|---|
| La escudería edita datos y condición | ✅ | `PUT /team-drivers/:id` + diálogo de edición |
| Cambio que viola validaciones de US-10 ⇒ rechazado | ✅ | Tests de servicio |
| Cambios visibles para FIA y público en la siguiente carga | ❌ | `GET /team-drivers/public` existe pero no hay vista de solo lectura en la web |
| Escudería no edita pilotos de otra ⇒ 401/403 | ✅ | `FORBIDDEN` + test |
| Cada modificación registra quién y cuándo | ❌ | No se guarda el usuario; sólo `updatedAt` |

### US-24 — Resultados y observaciones de controles técnicos

| Criterio | Estado | Evidencia |
|---|---|---|
| La escudería ve sus controles con fecha, hora, tipo, vehículo, resultado y observaciones | ✅ | `GET /technical-controls/mine` + "Mis autos" |
| Rechazados se distinguen visualmente | ✅ | Fila destacada |
| Observaciones sólo para escudería dueña y FIA | ✅ | `canViewNotes` + tests |
| Nuevo o modificado aparece en < 10 min | ❌ | `useTechnicalControls` no tiene `refetchInterval` |

### US-15 — Confirmación de notificación de sanción

| Criterio | Estado | Evidencia |
|---|---|---|
| La escudería recibe una notificación al aplicarse una sanción y confirma con un clic | ⚠️ | Se confirma con un clic desde el listado; no se genera notificación (no reutiliza US-9) |
| Se guarda sanción, escudería, usuario, fecha y hora; una persona; sin doble confirmación | ✅ | `confirm` con `isNull(confirmedAt)` |
| La FIA ve el estado, quién confirmó y cuándo | ❌ | Sólo ve "Pendiente/Notificada"; se envía un `userId` crudo y no se muestra |
| Sólo sanciones propias | ✅ | `FORBIDDEN` + test |
| El registro no se puede editar ni borrar | ⚠️ | No hay endpoint, pero tampoco `check`/FK que lo resguarde; falta bump de `version` |

### US-16 — Listado histórico y en vivo de sanciones

| Criterio | Estado | Evidencia |
|---|---|---|
| Cualquiera ve la temporada actual y consulta hasta 5 años | ⚠️ | Por defecto muestra "Todas", no la temporada actual; el selector está fijo en 2021–2026 |
| Muestra fecha, carrera, categoría, sancionado, motivo y penalización | ✅ | `PenaltiesRow` |
| Nueva o modificada aparece en < 10 min sin recargar | ✅ | Polling 5 s |
| Filtra por fecha, tipo y escudería | ⚠️ | Tipo y escudería ✅; **fecha** ❌ |
| El público no ve "Pendiente/Notificada" | ✅ | `sanitizeForViewer` + tests |

### US-19 — Modificar o dar de baja eventos

| Criterio | Estado | Evidencia |
|---|---|---|
| La FIA modifica fecha, hora, circuito y tipo, o da de baja con confirmación | ❌ | Backend sin **circuito**; **no hay pantalla** (`updateScheduledRace`/`cancelScheduledRace` sin usar) |
| Se ve en el calendario en < 10 min con "Modificado/Cancelado"; baja lógica | ⚠️ | Badge y baja lógica ✅; el calendario no se refresca solo |
| Cada cambio registra quién y cuándo | ⚠️ | Guarda `updatedByUserId`, con fallback `'system'` y sin FK |
| Otro rol 401/403 | ✅ | `requireRole` |
| Datos faltantes o fecha inválida ⇒ mensaje claro | ✅ | Zod |

### US-3 — Filtros reutilizables

| Criterio | Estado | Evidencia |
|---|---|---|
| Calendario, resultados, sanciones y controles se filtran por fecha/rango, año, tipo de control e identificador | ❌ | `applyClientFilters` y `commonFiltersQuerySchema` son **código muerto**; calendario y resultados sin filtros; sin rango de fechas |
| Se combinan y se limpian con un botón; los de sanciones siguen funcionando | ⚠️ | Sólo en sanciones y controles |
| Relevancia: más recientes o próximos primero | ❌ | No se aplica en ninguna vista |
| Sin coincidencias ⇒ "Sin resultados" | ⚠️ | Cada vista usa un mensaje distinto |
| Igual para público y con sesión; < 2 s con 5 años | ❌ | Sin test |

## Plan de corrección (orden)

1. **Migraciones** que faltan + `check` de `races.status` + FKs ⇒ `test:int` verde.
2. **US-27**: repositorio Drizzle de cuentas de piloto reutilizando el adapter de Better Auth de US-23 (alta,
   edición, baja con ban + cierre de sesiones), ports **no opcionales**, pantalla `/admin/drivers` e insignia.
3. **US-29**: área y menú de piloto, redirección del login por rol y redirección en guardas.
4. **US-11**: `updated_by_user_id` en `drivers` y vista pública de pilotos.
5. **US-15**: notificación al crear la sanción y "confirmó X el dd/mm hh:mm" para la FIA.
6. **US-16**: temporada actual por defecto, temporadas dinámicas (5 años) y filtro por fecha.
7. **US-19**: circuito en el PUT y pantalla de edición/baja con confirmación; polling del calendario.
8. **US-24**: polling de controles técnicos.
9. **US-3**: aplicar filtros comunes (rango de fechas, orden por relevancia, "Sin resultados") en calendario y
   resultados; test de rendimiento con 5 años.
10. BACKLOG con criterios del Sprint 3, horas reales y estado `En revisión`; `pnpm verify`.

## Resultado de la corrección (31/10)

| US | Commit | Qué se hizo |
|---|---|---|
| — | `67eebdd` | Migración `0012` del schema del sprint, `check` de estado de carrera, FKs y consistencia de la confirmación. |
| US-27 | `e9525ce` | Módulo `driver-accounts` de punta a punta (tabla versionada `driver_accounts`, adapter de US-23, `/admin/drivers`, insignia en perfil/listados/chat, piloto habilitado en el chat). |
| US-29 | `ff03c9a` | Inicio por rol, redirección de guardas, menú por rol, área `/driver` (`GET /driver-accounts/me`), rechazo de roles desconocidos. |
| US-11 | `490f033` | `drivers.updated_by_user_id` y nómina pública `/drivers` con escudería e insignia oficial. |
| US-24 | `123742e` | Polling de controles técnicos cada 60 s. |
| US-15 | `05603b0` | `GET /penalties/pending`, sección en la bandeja de US-9 y contador, `confirmedByName` visible para la FIA, confirmación con versión. |
| US-3 + US-16 | `3017c61` | Filtros comunes (contrato, helper Drizzle, dominio y barra web), temporada actual por defecto, rango de fechas, orden por relevancia, filtros en calendario y campeonato, test de 5 años < 2 s. |
| US-19 | `daa8d69` | Circuito en el PUT, `GET /races/circuits`, estado en el lector, pantalla de modificación y baja con confirmación, polling del calendario. |

Decisiones tomadas durante la corrección:

- **US-27**: la cuenta del piloto vive en `driver_accounts` (con `version`, baja con quién y cuándo) en lugar de
  `user.driver_id`; se elimina esa columna para no tener dos fuentes de verdad.
- **US-27/US-6**: el rol `driver` se suma a los roles de chat para que la insignia oficial tenga sentido en el chat.
- **US-3**: la relevancia de sanciones y controles es "más reciente primero" (en SQL con `orderBy`); la del
  calendario, "evento más cercano a hoy primero", se resuelve en memoria con `applyClientFilters`, porque
  ordenar por distancia en SQL requeriría SQL plano (prohibido).
- **US-15**: la notificación es la sanción pendiente listada en la bandeja de US-9 (acuerdo con el PO);
  no se crea una tabla aparte porque la confirmación ya vive en `penalties`.
