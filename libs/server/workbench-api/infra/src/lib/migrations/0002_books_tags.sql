-- 0002_books_tags.sql
-- books table (belongs to authors)
-- tags table
-- book_tags join (many-to-many)

CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

  author_id uuid NOT NULL REFERENCES authors(id) ON DELETE CASCADE,

  title text NOT NULL,
  published_year integer,
  status text NOT NULL DEFAULT 'draft', -- 'draft' | 'published' | 'archived'

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  label text NOT NULL UNIQUE,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS book_tags (
  book_id uuid NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (book_id, tag_id)
);