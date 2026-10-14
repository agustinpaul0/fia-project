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
| Acceso autenticado: canal privado reservado a personal FIA y de escuderías (`fia_admin` y `team_staff`) | PO |
| Acuerdo de claves: `ECDH` curva P-256 para derivación de secreto compartido en cliente | PO + dev |
| Cifrado simétrico: `AES-GCM` 256 bits con vector de inicialización (IV) de 12 bytes aleatorio | PO + dev |
| Firma digital y autenticidad: `ECDSA` (P-256 / SHA-256) en cada mensaje para verificar emisor y evitar manipulación | PO + dev |
| Servidor opaco: el backend sólo almacena claves públicas en formato JWK, payloads cifrados en Base64, IVs y firmas | PO |
| Indicadores de seguridad: la UI muestra badge de "Cifrado E2E Activo" y estado de verificación de claves | PO |

## Roles y permisos

| Acción | fia_admin | team_staff | public |
|---|---|---|---|
| Registrar claves públicas (`POST /chat/keys`) | ✓ | ✓ | ✗ (401) |
| Consultar claves de usuario (`GET /chat/keys/:userId`) | ✓ | ✓ | ✗ (401) |
| Listar conversaciones (`GET /chat/conversations`) | ✓ | ✓ | ✗ (401) |
| Iniciar conversación (`POST /chat/conversations`) | ✓ | ✓ | ✗ (401) |
| Listar mensajes (`GET /chat/conversations/:id/messages`) | ✓ | ✓ | ✗ (401) |
| Enviar mensaje cifrado (`POST /chat/conversations/:id/messages`) | ✓ | ✓ | ✗ (401) |

## API

| Método | Ruta | Acceso | Query / Body | Respuesta |
|---|---|---|---|---|
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
