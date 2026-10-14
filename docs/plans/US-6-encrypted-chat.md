# Plan: US-6 — Chats de mensajería cifrados de extremo a extremo

- **Ítem del backlog**: US-6
- **Autor**: Santiago / Antigravity · **Fecha**: 2026-10-14 · **Estado**: Borrador
- **Rama**: `feat/us-6-encrypted-chat`

## Objetivo

Implementar un sistema de mensajería segura con cifrado de extremo a extremo (E2E) entre el personal administrativo de la FIA y el personal de las escuderías, garantizando que el servidor únicamente actúe como retransmisor opaco sin acceso al contenido en texto plano de los mensajes.

## Descubrimiento (respuestas)

| Pregunta | Respuesta | Fuente (US, dev, PO) |
|---|---|---|
| ¿Qué rol ejecuta la acción? | Personal autenticado: `fia_admin` y `team_staff`. No accesible a usuarios públicos no autenticados. | US-6, Sprint 1 PDF |
| ¿Qué protocolo criptográfico se utiliza? | Web Crypto API estándar del navegador: acuerdo de llaves `ECDH` (curva P-256), cifrado simétrico autenticado `AES-GCM` (256 bits, IV de 12 bytes aleatorio), y firmas digitales `ECDSA` (P-256 / SHA-256) para verificación de autenticidad. | Especificación Grupo Naranja, OWASP |
| ¿Qué ve el servidor/administrador de BD? | Exclusivamente el payload cifrado en Base64, el vector de inicialización (IV) y la firma criptográfica. Cero texto plano persistido en servidor. | US-6 criterio 2 |
| ¿Qué se muestra en UI de seguridad? | Indicador visual permanente de "Cifrado E2E Activo" con badge verde y candado, e indicador de verificación de firmas criptográficas. Alerta en caso de inconsistencia. | US-6 criterio 3 y 4 |

## Cambios por capa

| Capa | Archivos a crear/modificar | Responsabilidad |
|---|---|---|
| `shared/contracts` | `packages/shared/src/contracts/chat.ts`, `api-paths.ts` | Schemas Zod de claves públicas, conversaciones, mensajes cifrados y validaciones estrictas. |
| `shared/domain` | `packages/shared/src/domain/errors/racing-errors.ts` | Errores de catálogo: `CHAT_KEY_NOT_FOUND`, `INVALID_CHAT_RECIPIENT`, `CONVERSATION_NOT_FOUND`. |
| `shared/db` | `packages/shared/src/db/schema/chat.ts` | Tablas `user_public_keys`, `chat_conversations` y `chat_messages` (payloads opacos) con índices y versión. |
| `api` | `apps/api/src/features/chat/*` | Endpoints de claves públicas (`GET/POST /chat/keys`), conversaciones (`GET/POST /chat/conversations`) y mensajes (`GET/POST /chat/conversations/:id/messages`). |
| `web` | `apps/web/src/features/chat/*`, `/routes/chat.tsx` | Servicio de criptografía del cliente (Web Crypto), hooks react-query, interfaz de chat con indicador de seguridad y lista de contactos. |

## Restricciones de base de datos

- `user_public_keys`: PK `user_id` con FK a `user.id` (`onDelete: cascade`), `ecdh_public_key` text not null, `ecdsa_public_key` text not null.
- `chat_conversations`: `id` UUID PK, `user_a_id` y `user_b_id` FKs a `user.id`, constraint de unicidad en par de usuarios.
- `chat_messages`: `id` UUID PK, `conversation_id` FK, `sender_id` FK, `recipient_id` FK, `encrypted_content` text not null, `iv` varchar(64) not null, `signature` text not null, `sent_at` timestamp with timezone, `version` positive.

## Errores

| Acción inválida | code | status | Mensaje |
|---|---|---|---|
| Clave pública de usuario no encontrada | `CHAT_KEY_NOT_FOUND` | 404 | El destinatario aún no ha registrado sus claves de cifrado de extremo a extremo. |
| Conversación inexistente o acceso denegado | `CONVERSATION_NOT_FOUND` | 404 | La conversación solicitada no existe o no tenés permiso para acceder a ella. |
| Destinatario no válido | `INVALID_CHAT_RECIPIENT` | 400 | No podés iniciar una conversación con vos mismo o con un usuario inexistente. |

## Tests

| Tipo | Casos |
|---|---|
| Unit (crypto / service) | Generación de par de claves, derivación de clave compartida ECDH, cifrado y descifrado AES-GCM, verificación de firma ECDSA, rechazo ante payload manipulado. |
| Contrato (caja negra) | Validación de schemas Zod para payloads cifrados, claves públicas en formato JWK y mensajes. |
| Rutas API | 401 unauthenticated, registro de claves públicas, creación de conversación, envío y recepción de payloads opacos entre participantes. |
| Web UI | Renderizado del chat, indicador de cifrado E2E activo, envío de mensaje cifrado, estado vacío y fallback de error. |
