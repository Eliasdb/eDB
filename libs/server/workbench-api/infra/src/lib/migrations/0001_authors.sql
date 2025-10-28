-- 0001_authors.sql
-- create the authors table used by AuthorRepoPg
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS authors (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

  first_name  text      NOT NULL,
  last_name   text      NOT NULL,

  bio         text,
  is_active   boolean   NOT NULL DEFAULT true,

  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);