# File Monorepo

This repository is an npm workspaces monorepo containing:

- `file`: Next.js frontend
- `file-be`: NestJS backend

## Requirements
- Node.js 18+ (recommended LTS) and npm 9+

## Install

```bash
npm install
```

## Develop

- Run both apps:

```bash
npm run dev
```

- Frontend only:

```bash
npm run fe
```

- Backend only:

```bash
npm run be
```

## Build

```bash
npm run build
```

## Start (production)

```bash
npm run start
```

## Environment

- Frontend expects `NEXT_PUBLIC_BE` to point to the backend base URL.
- Backend uses Prisma; set your `DATABASE_URL` in `file-be/.env`.
