# 0005 — Estrategia de tests

- **Estado**: Aceptado (2026-09-23)

## Decisión

Unitarios, caja negra/contrato (API vía `app.request()` validando contra los schemas compartidos), fuzz con
fast-check, integración **sólo del backend** contra un Postgres efímero separado (`db-test`, en memoria),
regresión por convención, tests de tipos, cobertura (90/85) y mutación con Stryker (≥ 70 por paquete). E2E con
Playwright se difiere al final del proyecto. Detalle operativo en `docs/testing.md`.

## Motivos

- Los tests de contrato y fuzz corren en milisegundos sin DB, así que se pueden correr en cada push.
- La integración cubre lo que un fake en memoria no puede: SQL real, restricciones y concurrencia.
- La mutación mide la calidad de los tests. En su primera corrida detectó un bug real (ADR 0004).

## Consecuencias

- Stryker obliga a usar TypeScript 6 y Vitest 4 (ADR 0001) y a tener una config de Vitest y de Stryker por
  paquete (Stryker no inyecta su setup en proyectos de Vitest definidos en la raíz).
