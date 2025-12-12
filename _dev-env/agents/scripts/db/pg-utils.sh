#!/usr/bin/env bash
set -euo pipefail

PG_CONTAINER="${PG_CONTAINER:-edb-postgres}"
PG_SUPERUSER="${PG_SUPERUSER:-postgres}"
PG_SUPERPASSWORD="${PG_SUPERPASSWORD:-postgres}"

# Normal quiet runner: prefixes SET to hide NOTICEs
pg_run(){ # pg_run <db> "<sql>"
  local db="$1" sql="$2"
  docker exec -e PGPASSWORD="$PG_SUPERPASSWORD" -i "$PG_CONTAINER" \
    psql --no-psqlrc -q -v ON_ERROR_STOP=1 -U "$PG_SUPERUSER" -d "$db" \
      -c "SET client_min_messages TO warning; ${sql}" >/dev/null
}

# Critical DDL that must NOT be in a tx (CREATE/DROP DATABASE)
pg_run_noset(){ # pg_run_noset <db> "<sql>"
  local db="$1" sql="$2"
  docker exec -e PGPASSWORD="$PG_SUPERPASSWORD" -i "$PG_CONTAINER" \
    psql --no-psqlrc -q -v ON_ERROR_STOP=1 -U "$PG_SUPERUSER" -d "$db" \
      -c "${sql}" >/dev/null
}

pg_scalar(){ # pg_scalar <db> "<sql>"
  local db="$1" sql="$2"
  docker exec -e PGPASSWORD="$PG_SUPERPASSWORD" -i "$PG_CONTAINER" \
    psql --no-psqlrc -qAt -v ON_ERROR_STOP=1 -U "$PG_SUPERUSER" -d "$db" -c "$sql"
}

# Returns raw rows (|-delimited) for iteration
pg_rows(){ # pg_rows <db> "<sql>"
  local db="$1" sql="$2"
  docker exec -e PGPASSWORD="$PG_SUPERPASSWORD" -i "$PG_CONTAINER" \
    psql --no-psqlrc -qAt -v ON_ERROR_STOP=1 -U "$PG_SUPERUSER" -d "$db" -c "$sql"
}

pg_exists_db(){   [[ "$(pg_scalar postgres "SELECT 1 FROM pg_database WHERE datname='$1' LIMIT 1;" || true)" == "1" ]]; }
pg_exists_role(){ [[ "$(pg_scalar postgres "SELECT 1 FROM pg_roles    WHERE rolname='$1'  LIMIT 1;" || true)" == "1" ]]; }
pg_has_ext(){ local db="$1" ext="$2"; [[ "$(pg_scalar "$db" "SELECT 1 FROM pg_extension WHERE extname='${ext}' LIMIT 1;" || true)" == "1" ]]; }
