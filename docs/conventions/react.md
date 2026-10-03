# React

## Diseño atómico por feature

| Nivel | Dónde | Ejemplo |
|---|---|---|
| Átomos | `components/ui/` (shadcn) | `Button`, `Card`, `Badge`, `Skeleton` |
| Moléculas reutilizables | `components/common/` | `QueryView`, `ErrorState`, `EmptyState`, `LoadingState` |
| Organismos del feature | `features/<f>/components/` | `CategoryCard`, `CategoryList`, `CategoriesSection` |
| Páginas | `routes/` | `routes/index.tsx` sólo compone organismos |

- Antes de crear un componente, buscá si ya existe algo reutilizable. Si un patrón aparece dos veces, se extrae
  a `components/common/`.
- Un componente = una responsabilidad. Si recibe más de ~5 props o tiene flags booleanos que cambian su forma,
  se divide (skill `vercel-composition-patterns`).
- **Componentes presentacionales**: reciben datos por props y no llaman a la API. La lógica vive en hooks
  (`features/<f>/hooks/`) y las llamadas en `features/<f>/api/`.
- Datos del servidor **siempre** con TanStack Query (nada de `useEffect` + `fetch`). Query keys como constantes
  en `api/` del feature.
- Todo componente que consume datos usa `QueryView` o maneja explícitamente carga, vacío y error.
- Formularios con `react-hook-form` + `@hookform/resolvers/zod` usando el schema del contrato; los errores por
  campo que devuelve la API (`fields`) se muestran inline.
- Mutaciones que editan registros envían la `version` con la que se abrió el formulario; ante
  `STALE_VERSION` se ofrece recargar.
- Accesibilidad: roles y labels en elementos interactivos; los tests buscan por rol/texto, no por clases.
- Estilos con clases de Tailwind y tokens del tema; nada de CSS suelto por componente. Sistema visual y primitivas
  de marca: [`ui.md`](ui.md).
- Skill de referencia: `vercel-react-best-practices`.
