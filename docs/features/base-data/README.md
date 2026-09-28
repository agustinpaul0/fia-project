# Feature: modelo de datos base y seed

- **US relacionadas**: T-2 (habilitador técnico), US-1 a US-10, US-23
- **Código**:
  - Esquemas Drizzle: `packages/shared/src/db/schema/{seasons,circuits,teams,drivers,races,race-results}.ts`
  - Contratos Zod: `packages/shared/src/contracts/{seasons,circuits,teams,drivers,races,race-results}.ts`
  - Seed: `apps/api/src/seed/base-data*.ts`
  - Endpoints: `apps/api/src/features/teams/`

## Qué hace

Provee el modelo relacional base para la gestión deportiva de la FIA: temporadas, circuitos, equipos, pilotos, carreras y resultados con puntuación oficial. Carga datos reales/coherentes para demos de al menos 2 temporadas completas de F1 (2024 y 2025) y la temporada 2026 planificada. Permite consultar el catálogo de escuderías activas para selectores de formularios administrativos.

## Reglas de negocio y restricciones

- **Temporadas**: Año entre 1950 y 2100 único.
- **Circuitos**: Nombre único, longitud positiva (`numeric(5, 3)` km).
- **Equipos**: Nombre único, vinculado a una categoría deportiva.
- **Pilotos**: Código de 3 letras mayúsculas único (`^[A-Z]{3}$`), número del 1 al 99 único, rol `main` (titular) o `reserve` (reserva).
- **Carreras**: Rondas secuenciales positivas por temporada y categoría (único `[season_id, category_id, round]`).
- **Resultados**: Posición positiva única por carrera, un único resultado por piloto por carrera, puntos $\ge 0$. Cascada en borrado de carrera (`cascade`), restricción en borrado de piloto/equipo (`restrict`).
- **Concurrencia**: Todas las tablas mutables cuentan con columna `version` para concurrencia optimista y auditoría `created_at` / `updated_at`.

## API

| Método | Ruta | Acceso | Body / query | Respuesta |
|---|---|---|---|---|
| GET | `/teams` | `fia_admin` | — | 200 `TeamOption[]` ordenadas por nombre |

## Datos cargados en el seed

- **Temporadas**: 2024, 2025, 2026 (F1).
- **Circuitos**: Monza, Silverstone, Spa-Francorchamps, Interlagos, Monaco, Bahrain.
- **Equipos**: Red Bull Racing, Scuderia Ferrari, McLaren, Mercedes-AMG, Aston Martin.
- **Pilotos**: 10 pilotos oficiales con dorsales y códigos reales.
- **Carreras y resultados**: 6 grandes premios oficiales (Bahréin, Mónaco, Silverstone en 2024 y 2025) con posiciones del 1 al 10 y escala de puntos oficial de la FIA (25, 18, 15, 12, 10, 8, 6, 4, 2, 1).
