-- Run this script in pgAdmin's Query Tool (connected to your Postgres server)
-- It creates a user and a database for the EZStore backend. Adjust names/passwords as needed.

-- Replace these values or run as a superuser and set your desired password
\set PG_USER 'ezstore_user'
\set PG_PASSWORD 'change_me'
\set PG_DB 'ezstore_db'

DO
$do$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = :'PG_USER') THEN
      EXECUTE format('CREATE ROLE %I WITH LOGIN PASSWORD %L', :'PG_USER', :'PG_PASSWORD');
   END IF;
END
$do$;

-- Create database if not exists
DO
$do$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = :'PG_DB') THEN
      EXECUTE format('CREATE DATABASE %I', :'PG_DB');
   END IF;
END
$do$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE "ezstore_db" TO ezstore_user;

-- Note: Run `npx prisma migrate dev --name init` from backend/ after creating the DB.
