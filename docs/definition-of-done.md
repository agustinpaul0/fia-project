# Definition of Ready y Definition of Done

## Definition of Ready (para empezar un ítem)

Un ítem del backlog se puede tomar cuando:

- [ ] Tiene ID, historia ("Como… quiero… de forma que…") y criterios de aceptación.
- [ ] Sus dependencias están en `Hecho`.
- [ ] Las preguntas de descubrimiento (`workflow.md` §2) están respondidas o registradas como "Preguntas
      abiertas" que no bloquean el inicio.
- [ ] Existe un plan aprobado en `docs/plans/<ID>-<slug>.md`.

## Definition of Done (para cerrarlo)

### Código
- [ ] Respeta todas las reglas duras de `AGENTS.md` (100 líneas, cero comentarios, tipado estricto, capas,
      sin SQL plano, restricciones en el schema, concurrencia optimista).
- [ ] Componentes y funciones con una sola responsabilidad; lo reutilizable está en `components/common` o en
      `core/` y no duplicado.

### Errores
- [ ] Cada acción inválida tiene código en el catálogo, status correcto y mensaje claro en español.
- [ ] La tabla *acción inválida → code → status → mensaje* está en `docs/features/<f>/README.md`, con un test
      por fila.
- [ ] La UI muestra estados de carga, vacío y error; ningún error deja la pantalla en blanco.

### Tests
- [ ] Unit + contrato + fuzz; integración si cambió un repositorio o el schema; regresión si es un bug.
- [ ] Cada criterio de aceptación tiene su test.
- [ ] `pnpm verify` en verde: cobertura ≥ 90/85, mutación ≥ 70 por paquete, build OK.

### Documentación
- [ ] `docs/features/<f>/README.md` actualizado (comportamiento vigente, endpoints, pantallas, roles).
- [ ] ADR si hubo una decisión de arquitectura.
- [ ] Migración con nombre descriptivo si cambió el schema; seed actualizado si hacen falta datos de demo.
- [ ] `.env.example` y `README.md` actualizados si cambió la configuración o el setup.

### Proceso
- [ ] `BACKLOG.md`: tareas y criterios tildados, **horas reales** por tarea, estado y link al PR.
- [ ] Commits Conventional Commits; PR a `develop` con la plantilla; CI verde.
- [ ] Aprobado por al menos otro integrante y mergeado (squash). Recién ahí el estado pasa a `Hecho`.
