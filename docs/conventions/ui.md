# Convenciones de UI (sistema visual)

Decisión y motivos: [ADR 0009](../adr/0009-sistema-visual.md). Estilo Bauhaus neo-brutalista: bloques planos,
bordes gruesos, sombras sólidas desplazadas, tipografía grande en mayúsculas.

## Tokens

- `apps/web/src/styles/theme-bauhaus.css`: paleta con los nombres de los mocks de Stitch (`primary` `#1a1a1a`,
  `primary-container` `#ffcc00`, `secondary` `#e63b2e`, `tertiary` `#0055ff`, `surface` `#f5f0e8`,
  `surface-container-*`, `on-surface-variant`, `outline-variant`…), fuentes (`font-headline`/`font-label` Space
  Grotesk, `font-body` Inter, `font-mono` JetBrains Mono) y sombras `shadow-brutal-sm/brutal/brutal-lg`.
- `theme-light.css`: los tokens de shadcn apuntan a la misma paleta, así que `components/ui` ya sale con el estilo.
- Colores fuera de la paleta sólo para datos con identidad propia (escuderías: `components/brand/team-color.ts`).

## Primitivas

| Dónde | Qué |
|---|---|
| `components/brand/` | `AppHeader` (único, ítems por rol), `AppFooter`, `FiaLogo`, `nav-link-props`, `team-color` |
| `components/common/` | `QueryView` (dentro de una sección), `PageQueryView`/`PageFrame` (página completa), `StaleFade` (datos anteriores atenuados mientras carga lo nuevo), `ErrorState`, `EmptyState`, `LoadingState` |
| `components/ui/` | Botón con variantes `default`, `accent` (amarillo), `outline`, `secondary`, `ghost`, `destructive`, `danger`, `link`; diálogos con encabezado y pie con borde |

## Reglas

- **Sólo datos reales**: lo que muestra la pantalla sale del sistema o se calcula a partir de él (funciones puras
  con test, p. ej. `season-summary.ts`, `staff-roster.ts`, `audit-log.ts`). Nada de valores de relleno ni botones
  sin funcionalidad.
- Textos en el DOM con mayúsculas y minúsculas normales; las mayúsculas se aplican con `uppercase` (los tests buscan
  por el texto real).
- Márgenes de página: contenedor `max-w-7xl` con `px-6 lg:px-8` (o `lg:px-12` en la portada).
- Al cambiar filtros o temporada usar `placeholderData: keepPreviousData` + `StaleFade` para no parpadear.
- Todo botón tiene `cursor: pointer` (regla global en `styles/base.css`); las transiciones respetan
  `prefers-reduced-motion`.
- Verificación visual: comparar contra el mock al mismo ancho y revisar 390 px sin scroll horizontal.
