# 0009 — Sistema visual Bauhaus neo-brutalista y regla de "sólo datos reales"

- **Estado**: Aceptado (2026-10-03)

## Contexto

Para la demo del Sprint 1 el equipo diseñó en Google Stitch las 9 pantallas del sprint (portada, login,
resultados, clasificación, carga de resultados, personal, bandeja de notificaciones y auditoría) con un estilo
Bauhaus neo-brutalista: fondo `#f5f0e8`, negro `#1a1a1a`, amarillo `#ffcc00`, rojo `#e63b2e`, azul `#0055ff`,
Space Grotesk + Inter, bordes de 2–4 px y sombras sólidas desplazadas. Los mocks traen además contenido de relleno
(telemetría, vuelta rápida, boletines, PDF/CSV) que el sistema no tiene, y cada pantalla usa un encabezado distinto.

## Decisión

- Los tokens de los mocks viven en `apps/web/src/styles/theme-bauhaus.css` con los mismos nombres que usa Stitch
  (`surface-container`, `primary-container`, `on-surface-variant`, …) para poder portar sus clases tal cual. Los
  tokens de shadcn (`theme-light.css`) apuntan a la misma paleta, así que los componentes de `components/ui`
  heredan el estilo. No hay modo oscuro.
- Fuentes self-hosted con `@fontsource` (Space Grotesk, Inter, JetBrains Mono); sin CDN. Íconos con
  `lucide-react` (equivalentes de los Material Symbols de los mocks, sin descargar una fuente de 4 MB).
- Un único encabezado para toda la app (el oscuro de Portada/Resultados) con los ítems según el rol, y
  transiciones de vista (`defaultViewTransition`) para que la píldora activa se deslice entre secciones.
- **Sólo datos reales**: se replica layout, tipografía, colores y espaciados, pero se muestran únicamente datos del
  sistema. Lo que se puede calcular se calcula (puntos por escudería, líder, conteos y porcentajes); lo inventado
  se omite. No hay botones sin funcionalidad.

## Alternativas descartadas

- Réplica literal de los mocks: en la demo habría datos falsos y botones que no hacen nada.
- Un encabezado por pantalla: la navegación cambiaría de forma al moverse entre secciones.
- Material Symbols como fuente: fiel a los mocks pero agrega ~4 MB bloqueantes al primer render.

## Consecuencias

- Cualquier pantalla nueva usa los tokens y las primitivas de `components/brand/` (ver
  `docs/conventions/ui.md`); colores fuera de la paleta se justifican (p. ej. colores de escudería en
  `team-color.ts`).
- Si un mock pide un dato que no existe, se pregunta al PO antes de agregarlo al modelo.
