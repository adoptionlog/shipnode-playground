# ShipNode Playground

Test bed used for **Adoption Log #01 — ShipNode**, a real-world adoption test of [ShipNode](https://shipnode.dev) (`@devalade/shipnode`): a zero-ceremony CLI for deploying Node.js apps to your own VPS over SSH, no Docker/Kubernetes involved.

Three apps, one shared VPS, one PostgreSQL instance, one Redis instance, deployed and kept alive through ShipNode's full lifecycle (`setup` → `env` → `deploy` → `harden`), then wired into a GitHub Actions CI/CD pipeline.

## Apps

| App | Stack | Live URL |
|---|---|---|
| `nestjs-api` | NestJS + TypeORM (PostgreSQL) + Redis, with real migrations | [nest-shipnode.adoptionlog.theid.dev](https://nest-shipnode.adoptionlog.theid.dev) |
| `expressjs-api` | Express + `pg`/`ioredis` | [express-shipnode.adoptionlog.theid.dev](https://express-shipnode.adoptionlog.theid.dev) |
| `nextjs-app` | Next.js (SSR via PM2) | [next-shipnode.adoptionlog.theid.dev](https://next-shipnode.adoptionlog.theid.dev) |

## Structure

An npm workspaces monorepo, one workspace per app:

```
shipnode.config.ts   # per app, deploy target + PM2/Caddy/health-check config
.github/workflows/   # one path-filtered GitHub Actions workflow per app
```

Each app ships its own `shipnode.config.ts` and `.env.example`. Deploys are triggered on push, scoped by path (`paths:` filter) so a change in one app doesn't redeploy the other two.

## Running locally

```bash
npm install
npm run start:dev --workspace=nestjs-api     # or expressjs-api / nextjs-app
```

Copy the relevant `.env.example` to `.env` and point `DATABASE_URL`/`REDIS_URL` at your own instances to run `nestjs-api`/`expressjs-api` locally.

## Context

This repo exists to support a published write-up on adopting ShipNode in a realistic setup (database, Redis, CI/CD, and a real zero-downtime test), part of the [Adoption Log](https://nathan.xdo.app/tag/theadoptionlog/) series.
