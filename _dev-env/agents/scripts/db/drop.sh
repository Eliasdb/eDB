#!/usr/bin/env bash
set -euo pipefail

# Load shared PG helpers (pg_run, pg_run_noset, pg_exists_db, pg_exists_role, ...)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
source "$SCRIPT_DIR/pg-utils.sh"

DB_NAME=""
DB_USER=""   # optional: role to drop after DB is removed
YES="false"

RESET='\033[0m'
BOLD='\033[1m'
GREEN='\033[32m'
YELLOW='\033[33m'
RED='\033[31m'
BLUE='\033[34m'
GRAY='\033[90m'

box() {
  local msg="$1"
  local color="${2:-$BLUE}"
  local len=${#msg}
  local line
  line=$(printf '%*s' "$len" '' | tr ' ' '─')
  echo -e "${color}┌─${line}─┐${RESET}"
  echo -e "${color}│ ${msg} │${RESET}"
  echo -e "${color}└─${line}─┘${RESET}"
}

log_step()  { echo -e "${BLUE}➜${RESET} $1"; }
log_ok()    { echo -e "${GREEN}✔${RESET} $1"; }
log_warn()  { echo -e "${YELLOW}!${RESET} $1"; }
log_error() { echo -e "${RED}✖${RESET} $1"; }

usage() {
  cat <<EOF
Usage: $0 --db NAME [--user USER] --yes

Drops a PostgreSQL database inside Docker container "\$PG_CONTAINER"
and optionally drops the associated role.

Options:
  --db   NAME   Database name to drop (required)
  --user USER   Role to drop after DB is removed (optional)
  --yes         Do not prompt (required for safety)

Environment:
  PG_CONTAINER      Name of the postgres container (default: edb-postgres)
  PG_SUPERUSER      Superuser name inside container (default: postgres)
  PG_SUPERPASSWORD  Superuser password inside container (default: postgres)
EOF
  exit 1
}

# Parse args
while [[ $# -gt 0 ]]; do
  case "$1" in
    --db)
      DB_NAME="$2"
      shift 2
      ;;
    --user)
      DB_USER="$2"
      shift 2
      ;;
    --yes)
      YES="true"
      shift 1
      ;;
    *)
      echo "Unknown arg: $1" >&2
      usage
      ;;
  esac
done

[[ -z "$DB_NAME" ]] && usage
[[ "$YES" != "true" ]] && { log_error "--yes is required for safety"; exit 1; }

box "Agent DB teardown" "$RED"
echo -e "${GRAY}Container:${RESET}  ${BOLD}${PG_CONTAINER:-edb-postgres}${RESET}"
echo -e "${GRAY}Database:${RESET}   ${BOLD}${DB_NAME}${RESET}"
if [[ -n "$DB_USER" ]]; then
  echo -e "${GRAY}Role:${RESET}       ${BOLD}${DB_USER}${RESET}"
fi
echo

# 1) Drop database if it exists
log_step "Checking database '${DB_NAME}'..."
if ! pg_exists_db "$DB_NAME"; then
  log_warn "Database '${DB_NAME}' does not exist, skipping DROP DATABASE."
else
  log_step "Terminating active connections to '${DB_NAME}'..."
  pg_run_noset postgres "
    SELECT pg_terminate_backend(pid)
    FROM pg_stat_activity
    WHERE datname = '${DB_NAME}'
      AND pid <> pg_backend_pid();
  "
  log_ok "Connections terminated."

  log_step "Dropping database '${DB_NAME}'..."
  pg_run_noset postgres "DROP DATABASE IF EXISTS ${DB_NAME};"
  log_ok "Database '${DB_NAME}' dropped."
fi
echo

# 2) Optionally drop role
if [[ -n "$DB_USER" ]]; then
  log_step "Checking role '${DB_USER}'..."
  if ! pg_exists_role "$DB_USER"; then
    log_warn "Role '${DB_USER}' does not exist, skipping DROP ROLE."
  else
    log_step "Attempting to drop role '${DB_USER}'..."
    if pg_run_noset postgres "DROP ROLE ${DB_USER};"; then
      log_ok "Role '${DB_USER}' dropped."
    else
      log_warn "Could not drop role '${DB_USER}'. It may still own objects in other databases."
    fi
  fi
  echo
fi

box "Done 🎉" "$GREEN"
