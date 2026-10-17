# Plan: US-2 — Realizar un testeo del nuevo incremento del producto

- **Ítem del backlog**: US-2
- **Autor**: Santiago / Antigravity · **Fecha**: 2026-10-14 · **Estado**: Implementado
- **Rama**: `feat/us-2-increment-testing`

## Objetivo

Diseñar, implementar y ejecutar la suite integral de verificación del incremento entregable del Sprint 2, comprobando la integración fluida y sin regresiones entre las cinco funcionalidades desarrolladas (autenticación segura, inscripción de pilotos, sanciones oficiales, controles técnicos y mensajería cifrada E2E).

## Descubrimiento (respuestas)

| Pregunta | Respuesta | Fuente (US, dev, PO) |
|---|---|---|
| ¿Qué rol ejecuta la acción? | El equipo de desarrollo a través del pipeline automatizado y runners de pruebas en integración continua. | US-2, Sprint 1 PDF |
| ¿Qué alcance tiene el incremento? | La combinación interconectada de US-4 (auth), US-10 (pilotos), US-13 (sanciones), US-21 (controles técnicos) y US-6 (chat cifrado). | Planificación Sprint 2 |
| ¿Qué pipeline lo ejecuta? | Un comando unificado reproducible: `pnpm test:coverage` (649+ pruebas unitarias, de contrato, de integración y fuzzing con umbrales ≥ 90% líneas y ≥ 85% ramas). | Definición de Hecho |
| ¿Cómo se prueba el flujo integrado? | Prueba de integración de punta a punta que simula el ciclo de vida completo: login → inscripción de piloto → control técnico → emisión de sanción → intercambio de mensajes cifrados E2E entre FIA y escudería. | US-2 criterios |

## Cambios por capa

| Capa | Archivos a crear/modificar | Responsabilidad |
|---|---|---|
| `api/testing` | `apps/api/src/features/sprint2-increment.test.ts` | Test de integración del flujo completo del incremento del Sprint 2 con dependencias en memoria y contratos compartidos. |
| `docs` | `docs/testing.md` | Actualización de la documentación de pruebas para registrar la cobertura y suites del Sprint 2. |
| `backlog` | `BACKLOG.md` | Cierre de tareas, criterios de aceptación y registro de horas reales de US-2. |

## Tests

| Tipo | Casos |
|---|---|
| Integración de Incremento | Flujo cruzado FIA ↔ Escudería: login con roles, inscripción de piloto titular, verificación técnica con dictamen, sanción por irregularidad técnica, y comunicación directa cifrada E2E. |
| Regresión y Acceso | Validación de que roles no autorizados son rechazados consistentemente a lo largo de todos los endpoints nuevos (401/403). |
| Cobertura y Métricas | Ejecución limpia del pipeline unificado con más de 650 pruebas en verde y superación de umbrales estrictos. |
