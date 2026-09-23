# 0003 — Autenticación con Better Auth, roles y bearer para mobile

- **Estado**: Aceptado (2026-09-23). Implementación: habilitador T-1.

## Contexto

Tres perfiles con permisos distintos (administración FIA, personal de escuderías, público), la seguridad es un
requisito del enunciado y en el futuro habrá una app móvil (biometría en US7).

## Decisión

- **Better Auth** (MIT, gratuito, corre dentro de nuestra API y guarda en nuestra base) con el adaptador de
  Drizzle.
- Plugins: `admin` (roles y gestión de usuarios: US23, US27, US29), `bearer` (token para Capacitor). A futuro:
  `passkey` (biometría, US7), `twoFactor`.
- Tablas de la librería generadas con su CLI en `packages/shared/src/db/schema/auth.ts`; se gestionan con su
  API, no con nuestros repositorios (excepción documentada a la regla de `version`). Los datos de negocio del
  usuario (rol, escudería) van en tablas propias con todas las reglas.
- Política de contraseña propia validada con Zod en `hooks.before` (12–128 caracteres, mayúscula, minúscula y
  número). Rate limit activo también en local. Sin registro público para roles privilegiados.
- La sesión llega a las rutas vía `resolveSession` (`core/auth/session.ts`); hoy el resolver es anónimo.

## Alternativas descartadas

- Implementación propia: demasiado riesgo en hashing, sesiones y tokens de recuperación.
- Clerk / Auth0: servicios externos, requieren internet en la demo y los usuarios quedan fuera de nuestra base.
- Supabase Auth: nos ata a su plataforma y complica correr todo en local.
- Lucia: discontinuada como librería.

## Consecuencias

- Cambiar el resolver anónimo por el de Better Auth no toca las rutas: ya declaran `requireRole`.
