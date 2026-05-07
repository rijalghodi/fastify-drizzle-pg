# Fastify + Drizzle + PostgreSQL

## What this is

- Small TypeScript API starter: Fastify, Drizzle, and PostgreSQL.
- Code is split so HTTP stays thin: routes → controllers → services → repos.
- Dependencies are attached to Fastify in `src/plugins/di.ts` with `fastify.decorate`.
- Auth is JWT (`@fastify/jwt` for sign + verify). Schemas use TypeBox. Logs use Pino (pretty in dev).
- Swagger documentation UI: `/docs`.

## Features

- Register / login return a JWT; `GET /auth/me` uses `Authorization: Bearer <token>`.
- Forgot-password issues a reset token (logged in dev; add email delivery for real use).
- One response shape for success and errors (`src/lib/response.ts`, `src/lib/errors.ts`).
- Biome, Husky on commit, and `tsc-alias` so `@/` paths work in `dist/`.

## Commands

- `pnpm dev` — run app with hot reload (`tsx watch src/server.ts`).
- `pnpm build` — compile to `dist/` and fix import paths for Node ESM.
- `pnpm start` — run `node dist/server.js`.
- `pnpm lint` — Biome check. `pnpm lint:fix` — Biome with autofix.
- `pnpm typecheck` — TypeScript, no emit.
- `pnpm db:generate` — generate migration SQL from schema.
- `pnpm db:migrate` — apply migrations (needs `DATABASE_URL`).
- `pnpm db:studio` — Drizzle Studio (optional).

## Endpoints

- `GET /docs` — Swagger documentation
- `GET /health` — health check.
- `POST /auth/register` — body: email, password, optional name → user + token.
- `POST /auth/login` — body: email, password → token.
- `POST /auth/forgot-password` — body: email; same message whether or not the user exists; token only created when the user exists.
- `GET /auth/me` — current user (Bearer JWT required).

## Run locally

- Node 22+ and pnpm.
- Copy `.env.example` to `.env`
- Run `pnpm db:migrate` once.
- Run `pnpm dev`. Default listen port: `8000` (override with `PORT` in `.env`).

## Docker

- Build: `docker build -t fastify-drizzle-pg .`
- Run with `DATABASE_URL`, `JWT_SECRET`, and `NODE_ENV` set; publish port `8000` unless you change `PORT`.
