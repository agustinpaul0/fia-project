# Seguridad

La seguridad es un requisito explícito del enunciado. Estas reglas se aplican en todo cambio.

## Autenticación y autorización

- **Deny by default**: toda ruta declara `publicAccess` o `requireRole(...)`. El test
  `core/auth/access-policy.test.ts` falla si alguna ruta no declara política.
- Roles: `fia_admin`, `team_staff`, `public` (`@fia/shared/domain`). El rol se verifica en la ruta; la
  **pertenencia** (una escudería sólo toca lo suyo) se verifica en el service.
- 401 `UNAUTHENTICATED` sin sesión; 403 `FORBIDDEN` con rol o pertenencia incorrectos. Nunca se revela si un
  recurso ajeno existe.
- Auth con Better Auth (habilitador T-1): contraseñas con hash de la librería, política de contraseña validada
  con Zod, rate limit activo también en local, sesiones con vencimiento, `trustedOrigins`, bearer token para la
  app móvil. Sin registro público para roles privilegiados: las cuentas FIA y de escuderías las crea un admin.

## Entradas y salidas

- Todo body, param y query se valida con un `z.strictObject` del contrato: campos extra ⇒ 400.
- Toda respuesta pasa por `ok`/`created`, que la validan contra su schema: nunca se filtran campos internos
  (hashes, tokens, flags).
- Límite de body: 100 KB (413 si se excede).
- Mensajes de error genéricos para lo inesperado: el detalle va al log, nunca al cliente.

## Transporte y navegador

- `secureHeaders` de Hono (nosniff, frame-options, etc.).
- CORS sólo para `WEB_ORIGIN`, con credenciales.
- La web nunca guarda tokens en `localStorage`; la sesión va en cookie `httpOnly` (web) o bearer en el
  almacenamiento seguro del dispositivo (Capacitor).

## Secretos

- `.env` real **jamás** se versiona: `.gitignore`, hook `block-env-files` y chequeo en CI.
- Toda variable nueva se agrega a `.env.example` con un valor de ejemplo inofensivo y se valida en `env.ts`.
- Nada de secretos en código, tests, logs ni issues.

## Mensajería (US6, prioridad del enunciado)

Cuando se implemente: cifrado de extremo a extremo, autorización por conversación y auditoría. Requiere ADR
propio antes de empezar.
