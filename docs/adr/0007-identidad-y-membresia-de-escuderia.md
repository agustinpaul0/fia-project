# 0007 — Identidad de autenticación y membresía de escudería

- **Estado**: Aceptado (2026-09-25) · **Relacionado**: [0003](0003-auth-y-roles.md), [0004](0004-concurrencia-optimista.md)

## Contexto

Better Auth es dueño de `user` y `account` (correo, hash de contraseña, sesiones, ban). El dominio necesita
además nombre, apellido, teléfono, cargo, legajo, escudería y estado de baja. Además, la baja debe revocar
sesiones y la edición debe actualizar el nombre y el equipo que la sesión expone, sin dejar datos a medias si
alguna escritura falla.

## Decisión

- `team_staff` es la fuente canónica de identidad de negocio; `user.email` sigue siendo la fuente canónica del
  correo. `user.role`, `user.team_id` y `user.name` son **proyecciones** que se escriben en la misma transacción.
- Toda escritura pasa por una `TeamStaffUnitOfWork`: una transacción Drizzle expone un repositorio y un
  `StaffAccountsPort` construidos sobre el mismo ejecutor. El adapter de Better Auth se crea con
  `transaction: false` y recibe los headers del administrador para conservar sus verificaciones internas.
- El service depende de ports; la UoW real se usa en producción e integración, y una UoW en memoria en unit.
- Better Auth expone por HTTP sólo una allowlist (`/sign-in/email`, `/sign-out`, `/session`); sus endpoints
  `admin` no se montan y sólo se usan vía port interno.
- `AccessControl` define `fia_admin` con permisos `user:create`, `user:update`, `user:set-role` y `user:ban`;
  `team_staff` y `public` no tienen permisos. El rol `fia_admin` se declara en `adminRoles`.
- `session.impersonatedBy` se agrega al schema porque el plugin `admin` de Better Auth 1.7.5 lo declara.
- `BANNED_USER` se traduce a `INVALID_CREDENTIALS` para no revelar que el correo existe.

## Alternativas descartadas

- **Duplicar el correo en `team_staff`**: genera dos fuentes de verdad y requiere sincronización y unicidad cruzada.
- **Escritura en dos pasos con compensación**: si el segundo paso falla, quedan usuarios huérfanos; no hay rollback
  real sin transacción.
- **Exponer los endpoints `admin` de Better Auth por HTTP**: duplican autorización, mensajes y versionado, y obligan
  al cliente web a hablar dos protocolos (contratos propios + plugin).
- **Copiar `user.name` como fuente de verdad**: obliga a mantener el nombre del usuario sincronizado a mano.

## Consecuencias

- Si Better Auth no puede compartir la transacción, la implementación se detiene y se revisará esta decisión
  (ver el paso 5 del plan de US-23): no se compensa con escrituras parciales.
- Un test de integración verifica que un fallo al insertar `team_staff` deshace `user` y `account`, y que las
  proyecciones (`role`, `team_id`, `name`) no divergen de `team_staff`.
- La migración de `impersonatedBy` es independiente de la de `team_staff`; ninguna migración existente se edita.
