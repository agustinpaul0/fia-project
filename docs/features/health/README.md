# Feature: salud del sistema

- **US relacionadas**: ninguna (soporte técnico).
- **Código**: `packages/shared/src/contracts/health.ts`, `apps/api/src/features/health/`,
  `apps/web/src/features/health/`

## Qué hace

Informa si la API está viva y si puede hablar con la base. La web lo muestra como un indicador en el
encabezado ("Servidor en línea" / "Servidor no disponible").

## API

| Método | Ruta | Acceso | Respuesta |
|---|---|---|---|
| GET | `/health` | público | `{ status: 'ok', database: 'up' \| 'down' }` |

## Errores

| Situación | Resultado |
|---|---|
| La base no responde | 200 con `database: 'down'` (la API sigue respondiendo) |
| La API no responde | la web muestra "Servidor no disponible" (`NETWORK_ERROR`) |
