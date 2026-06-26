# AGENTS

## Purpose
This file tells AI coding agents how to work productively in this repository.

## Repo summary
- Next.js 16 application using App Router and React 19.
- Tailwind CSS v4 styling with `globals.css` and utility-first UI.
- Prisma v7 with MariaDB/MySQL support via `@prisma/adapter-mariadb`.
- Minimal scripts: `dev`, `build`, `start`, `lint`.
- No existing `.github/copilot-instructions.md` or AGENTS/CLAUDE customization file was found.

## Key commands
- `npm install` — install dependencies
- `npm run dev` — run the local development server
- `npm run build` — build production assets
- `npm run start` — run production server
- `npm run lint` — run ESLint

## Architecture and conventions
- `src/app/` contains the app router routes, layouts, and server components.
- `src/components/` contains reusable UI components organized by feature areas:
  - `layout/` for shared layout pieces
  - `profile/`, `blog/`, `sharing/`, `admin/`, `playground/`
- `src/app/actions.ts` is the main server-side data service layer for Prisma operations and Next.js actions.
- `src/utils/db.ts` initializes Prisma with a direct MariaDB/MySQL adapter and supports `DATABASE_URL`.
- `prisma/schema.prisma` defines the database schema and models.
- `src/components/*` often use `"use client"` for interactive client-side behavior.
- `app/page.tsx` is dynamic (`export const dynamic = 'force-dynamic'`) and loads data on each request.

## Database / environment
- The app expects a MySQL/MariaDB database.
- `src/utils/db.ts` uses `process.env.DATABASE_URL` when available.
- Default local connection values are:
  - host: `localhost`
  - port: `3306`
  - user: `root`
  - password: ``
  - database: `porto_db`

## What agents should do first
- Preserve existing code style and conventions.
- Do not modify generated or runtime folders: `.next/`, `node_modules/`, `mysql-data/`, or `tsconfig.tsbuildinfo`.
- Prefer edits in `src/app/`, `src/components/`, `src/utils/`, and `prisma/`.
- Use root `package.json` scripts for build/test/lint tasks.

## Notable files
- `package.json` — scripts and dependencies
- `README.md` — default Next.js starter documentation
- `src/app/layout.tsx` — root HTML structure and fonts
- `src/app/page.tsx` — home page server component and data loading
- `src/app/actions.ts` — Prisma CRUD actions and server behaviors
- `src/utils/db.ts` — database connection setup
- `prisma/schema.prisma` — database schema

## Notes for AI agents
- This repo does not appear to include automated tests or CI config.
- If a change affects data models, consider Prisma schema and how `src/app/actions.ts` maps database values.
- Keep user-facing text and metadata localized in Indonesian where already present.
- Use `npm run lint` after edits to ensure ESLint compatibility.
