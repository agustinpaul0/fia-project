# Feature: mensajería con cifrado de extremo a extremo (E2E)

- **US relacionadas**: US-6 (Chats de mensajería cifrados de extremo a extremo — Sprint 2).
- **Código**:
  - `packages/shared/src/contracts/chat.ts`
  - `packages/shared/src/db/schema/chat.ts`
  - `apps/api/src/features/chat/`
  - `apps/web/src/features/chat/`
- **Plan**: [`docs/plans/US-6-encrypted-chat.md`](../../plans/US-6-encrypted-chat.md)

## Qué hace

Provee un canal de mensajería segura entre el personal administrativo de la FIA (`fia_admin`) y el personal de las escuderías (`team_staff`). Todo el contenido se cifra en el navegador emisor y se descifra únicamente en el navegador receptor mediante la Web Crypto API estándar. El servidor actúa exclusivamente como retransmisor opaco sin conocimiento del texto plano (cero conocimiento).

## Reglas de negocio

| Regla | Fuente |
|---|---|
| Sólo FIA (`fia_admin`) y escuderías (`team_staff`) activas usan el chat; `GET /chat/contacts` lista con quién se puede hablar | US-6 |
| Cada usuario genera en el navegador un par ECDH P-256 y otro ECDSA P-256; las claves privadas son **no exportables** y se guardan en IndexedDB (`fia-chat-keys`) | US-6 |
| Al entrar al chat se publican sólo las claves públicas (JWK) en `POST /chat/keys` | US-6 |
| Cada mensaje se cifra con AES-GCM 256 (IV aleatorio de 12 bytes) usando la clave derivada por ECDH y se firma con ECDSA/SHA-256 | US-6 |
| El servidor sólo guarda el texto cifrado, el IV y la firma: nunca ve el texto plano | US-6 |
| Al mostrar cada mensaje se verifica la firma del emisor; si no coincide se muestra una alerta en lugar del texto | US-6 |
| No se abre una conversación con alguien que no registró sus claves (`CHAT_KEY_NOT_FOUND`) | US-6 |
| Sólo los dos participantes leen o escriben en una conversación | US-6 + QA |
| Si un usuario cambia de navegador, genera claves nuevas y los mensajes anteriores ya no se pueden descifrar (se alertan) | dev |

## Roles y permisos

| Acción | fia_admin | team_staff | public |
|---|---|---|---|
| Listar contactos (`GET /chat/contacts`) | ✓ | ✓ | ✗ (403) |
| Registrar claves públicas (`POST /chat/keys`) | ✓ | ✓ | ✗ (403) |
| Consultar claves de usuario (`GET /chat/keys/:userId`) | ✓ | ✓ | ✗ (403) |
| Listar conversaciones (`GET /chat/conversations`) | ✓ | ✓ | ✗ (403) |
| Iniciar conversación (`POST /chat/conversations`) | ✓ | ✓ | ✗ (403) |
| Listar mensajes (`GET /chat/conversations/:id/messages`) | ✓ | ✓ | ✗ (403) |
| Enviar mensaje cifrado (`POST /chat/conversations/:id/messages`) | ✓ | ✓ | ✗ (403) |

## API

| Método | Ruta | Acceso | Query / Body | Respuesta |
|---|---|---|---|---|
| GET | `/chat/contacts` | `fia_admin`, `team_staff` | — | 200 `ChatContact[]` |
| POST | `/chat/keys` | `fia_admin`, `team_staff` | `RegisterPublicKeysBody` | 200 `UserPublicKeys` |
| GET | `/chat/keys/:userId` | `fia_admin`, `team_staff` | — | 200 `UserPublicKeys` |
| GET | `/chat/conversations` | `fia_admin`, `team_staff` | — | 200 `ChatConversation[]` |
| POST | `/chat/conversations` | `fia_admin`, `team_staff` | `CreateConversationBody` | 201 `ChatConversation` |
| GET | `/chat/conversations/:id/messages` | `fia_admin`, `team_staff` | — | 200 `ChatMessage[]` |
| POST | `/chat/conversations/:id/messages` | `fia_admin`, `team_staff` | `CreateEncryptedMessageBody` | 201 `ChatMessage` |

## Errores

| Acción inválida | code | status | Mensaje |
|---|---|---|---|
| Destinatario no tiene claves registradas | `CHAT_KEY_NOT_FOUND` | 404 | El destinatario aún no ha registrado sus claves de cifrado de extremo a extremo. |
| Conversación inexistente o usuario ajeno | `CONVERSATION_NOT_FOUND` | 404 | La conversación solicitada no existe o no tenés permiso para acceder a ella. |
| Destinatario inválido o consigo mismo | `INVALID_CHAT_RECIPIENT` | 400 | No podés iniciar una conversación con vos mismo o con un usuario inexistente. |
