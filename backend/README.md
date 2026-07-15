# EZStore Backend (Phase 1)

This is the backend scaffold for the EZStore project (Phase 1).

Quick start:

1. Copy `.env.example` to `.env` and update values with your Postgres / JWT credentials.

2. Create the Postgres database and user using pgAdmin:

- Open pgAdmin and connect to your Postgres server (e.g., `localhost:5432`).
- Open the Query Tool for a superuser (e.g., `postgres`).
- Run the SQL script: `backend/db/create_database.sql` (adjust values as needed).

3. From `backend/` install dependencies:

```bash
npm install
```

4. Start the backend in dev mode:

```bash
npm run dev
```

Notes:
- Docker configuration has been removed from this repository. Use pgAdmin (or your preferred Postgres management tool) to create and manage the database.
- Keep your real secrets in `backend/.env` (this repo ignores `.env`). Do not commit secrets to the repository.
- The backend reads `DATABASE_URL` from environment variables. See `backend/.env.example` for the expected format.

Health check: `GET http://localhost:5000/api/health`
