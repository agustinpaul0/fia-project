# Feature: modelo de datos base y seed

- **US relacionadas**: T-2 (habilitador técnico), US-1 a US-10, US-23
- **Código**:
  - Esquemas Drizzle: `packages/shared/src/db/schema/{seasons,circuits,teams,drivers,races,race-results}.ts`
  - Contratos Zod: `packages/shared/src/contracts/{seasons,circuits,teams,drivers,races,race-results}.ts`
  - Seed: `apps/api/src/seed/base-data*.ts`
  - Endpoints: `apps/api/src/features/teams/`

## Qué hace

Provee el modelo relacional base para la gestión deportiva de la FIA: temporadas, circuitos, equipos, pilotos, carreras y resultados con puntuación oficial. Carga datos de demostración de las últimas 5 temporadas de F1 (2021–2025, pedido del PO para US-5) y la temporada 2026 planificada. Permite consultar el catálogo de escuderías activas para selectores de formularios administrativos.

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

- **Temporadas**: 2021 a 2026 (F1).
- **Circuitos**: Monza, Silverstone, Spa-Francorchamps, Interlagos, Monaco, Bahrain.
- **Equipos**: Red Bull Racing, Scuderia Ferrari, McLaren, Mercedes-AMG, Aston Martin.
- **Pilotos**: 10 pilotos oficiales con dorsales y códigos reales.
- **Carreras y resultados**: por temporada, 4 Grandes Premios y 1 Sprint (Bahréin, Mónaco y Silverstone, más un Gran Premio en Monza, Interlagos o Spa; el Sprint se corre en Silverstone, Interlagos o Spa), con el top 10 de los 10 pilotos cargados. Los puntos se calculan con `pointsFor` (escala de Gran Premio o de Sprint). **Son datos de demostración coherentes, no los resultados oficiales**: sólo hay 10 pilotos y se usa su escudería actual.
- **2026**: Gran Premio de Bahréin planificado para diciembre, sin resultados (sirve para probar que no se pueden cargar carreras futuras).
