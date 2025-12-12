-- migrations/002_company_stage.sql

-- Ensure website exists (no-op if already present)
ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS website text;

-- Add stage with an enum-like CHECK constraint.
-- Keep it NULL-able to be backward-compatible, or set a default if you prefer.
ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS stage text
  CHECK (stage IN ('lead','prospect','customer','inactive'));

-- Optional: set a default going forward (comment out if you want it nullable)
ALTER TABLE companies
  ALTER COLUMN stage SET DEFAULT 'lead';

-- Optional: backfill existing NULLs
UPDATE companies SET stage = 'lead' WHERE stage IS NULL;
