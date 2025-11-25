#!/usr/bin/env bash
set -euo pipefail

# Location of the helper file you showed
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
source "$SCRIPT_DIR/pg-utils.sh"

DB_NAME=""
APP_USER=""
APP_PASS=""
DB_EXT=""

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

log_step() { echo -e "${BLUE}➜${RESET} $1"; }
log_ok()   { echo -e "${GREEN}✔${RESET} $1"; }
log_warn() { echo -e "${YELLOW}!${RESET} $1"; }
log_error(){ echo -e "${RED}✖${RESET} $1"; }

usage() {
  cat <<EOF
Usage: $0 --db NAME --user USER --pass PASS [--ext EXT]

Creates a PostgreSQL role + database in Docker container '$PG_CONTAINER'
and optionally enables an extension.

Arguments:
  --db   NAME   Name of the new database (required)
  --user USER   Name of the new role / DB owner (required)
  --pass PASS   Password for that role (required)
  --ext  EXT    Extension to CREATE EXTENSION IF NOT EXISTS (optional)

The script connects using:
  - container: \$PG_CONTAINER (default: edb-postgres)
  - superuser: \$PG_SUPERUSER (default: postgres)
EOF
  exit 1
}

# Parse args
while [[ $# -gt 0 ]]; do
  case "$1" in
    --db)   DB_NAME="$2"; shift 2 ;;
    --user) APP_USER="$2"; shift 2 ;;
    --pass) APP_PASS="$2"; shift 2 ;;
    --ext)  DB_EXT="$2"; shift 2 ;;
    *) echo "Unknown arg: $1" >&2; usage ;;
  esac
done

[[ -z "$DB_NAME" || -z "$APP_USER" || -z "$APP_PASS" ]] && usage

box "Agent DB setup" "$BLUE"
echo -e "${GRAY}Target DB:${RESET}   ${BOLD}${DB_NAME}${RESET}"
echo -e "${GRAY}Role:${RESET}        ${BOLD}${APP_USER}${RESET}"
if [[ -n "${DB_EXT:-}" ]]; then
  echo -e "${GRAY}Extension:${RESET}   ${BOLD}${DB_EXT}${RESET}"
fi
echo

# 1) Ensure role exists
log_step "Checking role '${APP_USER}'..."
if pg_exists_role "$APP_USER"; then
  log_ok "Role '${APP_USER}' already exists."
else
  log_step "Creating role '${APP_USER}'..."
  pg_run_noset postgres "CREATE ROLE ${APP_USER} LOGIN PASSWORD '${APP_PASS}';"
  log_ok "Role '${APP_USER}' created."
fi
echo

# 2) Ensure database exists
log_step "Checking database '${DB_NAME}'..."
if pg_exists_db "$DB_NAME"; then
  log_warn "Database '${DB_NAME}' already exists, skipping create."
else
  log_step "Creating database '${DB_NAME}' owned by '${APP_USER}'..."
  pg_run_noset postgres "CREATE DATABASE ${DB_NAME} OWNER ${APP_USER};"
  log_ok "Database '${DB_NAME}' created."
fi
echo

# 3) Grant privileges on schema
log_step "Granting privileges on '${DB_NAME}' to '${APP_USER}'..."
pg_run "$DB_NAME" "
  GRANT ALL PRIVILEGES ON SCHEMA public TO ${APP_USER};
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES    TO ${APP_USER};
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${APP_USER};
"
log_ok "Privileges granted."
echo

# 4) Optional extension
if [[ -n "${DB_EXT:-}" ]]; then
  log_step "Ensuring extension '${DB_EXT}' exists on '${DB_NAME}'..."
  if pg_has_ext "$DB_NAME" "$DB_EXT"; then
    log_ok "Extension '${DB_EXT}' already present."
  else
    # quote name for extensions like uuid-ossp
    pg_run "$DB_NAME" "CREATE EXTENSION IF NOT EXISTS \"${DB_EXT}\";"
    log_ok "Extension '${DB_EXT}' installed."
  fi
  echo
fi

box "Done 🎉" "$GREEN"
