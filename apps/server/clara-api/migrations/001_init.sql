-- migrations/001_init.sql
create table if not exists companies(
  id text primary key,
  name text not null,
  website text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists contacts(
  id text primary key,
  name text not null,
  email text,
  phone text,
  company_id text references companies(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists activities(
  id text primary key,
  type text not null,              -- 'note' | 'call' | ...
  summary text not null,
  contact_id text references contacts(id) on delete set null,
  company_id text references companies(id) on delete set null,
  at timestamptz not null default now(), -- event timestamp
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists tasks(
  id text primary key,
  title text not null,
  done boolean not null default false,
  due date,
  contact_id text references contacts(id) on delete set null,
  company_id text references companies(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- helpful indexes
create index if not exists idx_contacts_company on contacts(company_id);
create index if not exists idx_acts_company on activities(company_id);
create index if not exists idx_acts_contact on activities(contact_id);
create index if not exists idx_tasks_company on tasks(company_id);
create index if not exists idx_tasks_contact on tasks(contact_id);
create index if not exists idx_tasks_due on tasks(due);
