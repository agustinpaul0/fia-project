# Plan: <ID> — <título>

- **Ítem del backlog**: <US-N / T-N / BUG-N>
- **Autor**: <nombre> · **Fecha**: <AAAA-MM-DD> · **Estado**: Borrador | Aprobado
- **Rama**: `feat/<id>-<slug>`

## Objetivo

<Qué problema resuelve y para quién, en 2-3 líneas.>

## Descubrimiento (respuestas)

| Pregunta | Respuesta | Fuente (US, dev, PO) |
|---|---|---|
| ¿Qué rol ejecuta la acción? | | |
| ¿Qué campos entran/salen y con qué reglas? | | |
| ¿Hay concurrencia? | | |
| ¿Qué se muestra en carga / vacío / error? | | |

**Preguntas abiertas para el PO**: <copiarlas también a `BACKLOG.md`>

## Cambios por capa

| Capa | Archivos a crear/modificar | Responsabilidad |
|---|---|---|
| shared/contracts | | |
| shared/domain (errores) | | |
| shared/db (schema + migración) | | |
| api (port, repository, service, routes) | | |
| web (api, hooks, components, routes) | | |

## Restricciones de base de datos

<unique, check, FKs con onDelete, índices, version>

## Errores

| Acción inválida | code | status | Mensaje |
|---|---|---|---|
| | | | |

## Tests

| Tipo | Casos |
|---|---|
| Unit (service/hooks/componentes) | |
| Contrato (caja negra) | |
| Fuzz | |
| Integración | |
| Criterios de aceptación → test | |

## Riesgos y decisiones

<Riesgos, alternativas consideradas, si hace falta ADR.>
