## Ítem del backlog

<!-- US-N / T-N / BUG-N y link al plan en docs/plans/ -->

## Qué cambia

<!-- Comportamiento nuevo o corregido, en lenguaje de negocio. -->

## Cómo probarlo

<!-- Pasos para verificarlo en local (docker compose up, usuario, pantalla, acción). -->

## Definition of Done

- [ ] Reglas de `AGENTS.md`: 100 líneas por archivo, cero comentarios, tipado estricto, capas, sin SQL plano
- [ ] Toda acción inválida mapeada a su error con mensaje y test (tabla en `docs/features/<f>/README.md`)
- [ ] Tests: unit + contrato + fuzz (+ integración si tocó repositorio/schema, + regresión si es bug)
- [ ] `pnpm verify` en verde en mi máquina
- [ ] Docs del feature / ADR / `.env.example` / seed actualizados si aplica
- [ ] `BACKLOG.md` actualizado con horas reales y criterios de aceptación tildados
- [ ] Commits en Conventional Commits

## Uso de IA

<!-- Herramienta y prompts relevantes usados (la cátedra lo valora). -->
