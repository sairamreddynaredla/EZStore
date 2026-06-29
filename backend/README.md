# EZStore Backend (Phase 1)

This is the backend scaffold for the EZStore project (Phase 1).

Quick start:

1. Copy `.env.example` to `.env` and update values.
2. Start Postgres with Docker Compose:

```bash
docker-compose up -d
```

3. From `backend/` install dependencies:

```bash
npm install
```

4. Generate Prisma client:

```bash
npx prisma generate
```

5. Start in dev mode:

```bash
npm run dev
```

Health check: `GET http://localhost:5000/api/health`
