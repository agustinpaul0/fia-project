# Sistema de gestión de la FIA

Plataforma web (y a futuro app móvil) para que la FIA gestione calendario, escuderías, pilotos, puntajes,
controles técnicos y sanciones de F1, F2, F3 y F1 Academy. Proyecto de **Administración de Proyectos de
Software (UNS, 2026)**: somos la comisión implementadora del Enunciado 1; el Grupo Naranja es el PO.

| | |
|---|---|
| Stack | React + Vite · Hono · PostgreSQL + Drizzle · Zod · TypeScript (ver [ADR 0001](docs/adr/0001-stack.md)) |
| Estado del trabajo | [`BACKLOG.md`](BACKLOG.md) |
| Reglas para devs y agentes | [`AGENTS.md`](AGENTS.md) |

---

## 1. Requisitos

| Herramienta | Versión | Para qué |
|---|---|---|
| [Git](https://git-scm.com/downloads) | cualquiera reciente | clonar y versionar |
| [Docker](https://docs.docker.com/get-docker/) + Docker Compose v2 | Docker Desktop o Engine | bases de datos y, si querés, toda la app |
| [Node.js](https://nodejs.org/) | **24** (está en `.nvmrc`) | hooks de git, tests, agentes |
| pnpm | la fija `package.json` (vía corepack) | dependencias |

### Instalación por sistema operativo

**Linux / macOS**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash   # instala nvm
nvm install 24 && nvm use 24
corepack enable                 # activa pnpm; si pide permisos: corepack enable --install-directory ~/.local/bin
```

Docker: en Linux instalá Docker Engine y agregá tu usuario al grupo `docker`; en macOS, Docker Desktop.

**Windows**: usá **WSL2** (Ubuntu) y seguí los pasos de Linux *dentro de WSL*, con Docker Desktop integrado a
WSL. Cloná el repo dentro del filesystem de WSL (`~/…`), no en `C:\`, para que Docker y los watchers sean rápidos.

Verificá: `node -v` (v24.x), `pnpm -v`, `docker compose version`.

## 2. Primera vez

```bash
git clone <url-del-repo> fia-project && cd fia-project
cp .env.example .env            # valores de desarrollo; .env nunca se commitea
pnpm install                    # instala dependencias y los hooks de git (lefthook)
```

## 3. Levantar el proyecto

### Opción A — todo en Docker (un solo comando)

```bash
docker compose up --build       # o: pnpm docker:up
```

Levanta la base (`db`), la base de tests (`db-test`), aplica migraciones y datos de ejemplo (`migrate`) y corre
la API y la web con recarga en caliente. Abrí **http://localhost:5173**. La API queda en
**http://localhost:3000** (`/health` para verificar).

Cortar con `Ctrl+C`; `pnpm docker:down` para bajar los contenedores; `pnpm docker:reset` para borrar también
los datos. Si cambiaron las dependencias (`pnpm-lock.yaml`), volvé a correr con `--build`.

### Opción B — base en Docker, app en tu máquina

```bash
docker compose up -d db db-test
pnpm db:migrate && pnpm db:seed
pnpm dev                        # API en :3000 y web en :5173
```

## 4. Comandos

| Comando | Qué hace |
|---|---|
| `pnpm dev` | API + web en modo desarrollo |
| `pnpm test:watch` | tests unitarios, de contrato y fuzz en modo watch |
| `pnpm test:coverage` | tests + umbral de cobertura (lo corre el hook `pre-push`) |
| `pnpm test:int` | tests de integración del backend (requiere `db-test` levantada) |
| `pnpm test:mutation` | tests de mutación (Stryker) por paquete |
| `pnpm lint` / `pnpm format` | Biome: lint + formato (incluye el tope de 100 líneas) |
| `pnpm typecheck` | TypeScript en todo el monorepo |
| `pnpm verify` | **todo lo anterior + build**. Obligatorio antes de abrir un PR |
| `pnpm db:generate --name <x>` | genera una migración desde el schema de Drizzle |
| `pnpm db:migrate` / `pnpm db:seed` | aplica migraciones / carga datos de ejemplo |
| `pnpm db:studio` | explorador visual de la base (Drizzle Studio) |
| `pnpm skills:check` / `pnpm skills:sync` | verifica / sincroniza las skills de los agentes |

## 5. Estructura

```
apps/api          API Hono (routes → service → repository → db), por features
apps/web          SPA React (routes → features/<f>/{api,hooks,components})
packages/shared   ÚNICO lugar de tipos: contratos Zod, dominio (errores, roles), schema Drizzle + migraciones
docs/             arquitectura, workflow, convenciones, features, ADRs, planes, specs del PO
.agents/ .claude/ skills de los agentes de IA (versionadas)
```

Detalle de cada módulo en [`docs/architecture.md`](docs/architecture.md).

## 6. Cómo trabajamos

1. [`docs/workflow.md`](docs/workflow.md): de un ítem del backlog a un PR mergeado (descubrimiento, plan, TDD,
   gates).
2. [`docs/git.md`](docs/git.md): ramas `main` / `develop` / `feat/*`, Conventional Commits, PRs.
3. [`docs/testing.md`](docs/testing.md): tipos de test y cuándo se corre cada uno.
4. [`docs/definition-of-done.md`](docs/definition-of-done.md): qué tiene que cumplir un ítem para cerrarse.
5. [`docs/conventions/`](docs/conventions/): código, tipado, React, base de datos, seguridad, errores, fechas.
6. [`docs/how-to-document.md`](docs/how-to-document.md): qué se documenta, dónde y con qué plantilla.

Con agentes de IA: Claude Code lee `CLAUDE.md`, OpenCode lee `AGENTS.md` y Antigravity lee `GEMINI.md`; los tres
terminan en las mismas reglas de `AGENTS.md` y usan las mismas skills (`start-task`, `finish-task`, …).

## 7. Problemas frecuentes

| Síntoma | Solución |
|---|---|
| `port is already allocated` al levantar Docker | Otro servicio usa el puerto. Cambiá `DB_PORT`, `TEST_DB_PORT` o `API_PORT` en `.env` (y `DATABASE_URL` si corrés con la opción B). |
| `pnpm: command not found` | `corepack enable` (ver Requisitos). |
| La web muestra "Servidor no disponible" | La API no está corriendo o `VITE_API_URL` apunta mal. Probá `curl localhost:3000/health`. |
| `pnpm test:int` falla con `ECONNREFUSED` | Falta `docker compose up -d db-test`. |
| El commit se rechaza | Leé el mensaje del hook: formato del commit, lint, tipos, archivo de más de 100 líneas o un `.env` en stage. Nunca uses `--no-verify`. |
| Cambié el schema y la API falla | `pnpm db:generate --name <cambio>` y `pnpm db:migrate`. |
| Quiero empezar con la base limpia | `pnpm docker:reset` y volver a levantar. |
