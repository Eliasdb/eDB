ALTER TABLE companies
  ADD COLUMN industry text,
  ADD COLUMN description text,
  ADD COLUMN hq jsonb,
  ADD COLUMN employees integer,
  ADD COLUMN employees_range text,
  ADD COLUMN owner_contact_id text,
  ADD COLUMN primary_email text,
  ADD COLUMN phone text;

-- (optional) foreign key to contacts
ALTER TABLE companies
  ADD CONSTRAINT companies_owner_fk
  FOREIGN KEY (owner_contact_id) REFERENCES contacts(id) ON DELETE SET NULL;
