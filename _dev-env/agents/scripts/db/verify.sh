#!/usr/bin/env bash
set -euo pipefail

# Load shared PG helpers (pg_exists_db, pg_has_ext, etc.)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
source "$SCRIPT_DIR/pg-utils.sh"

DB_NAME=""
EXTS=()

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
Usage: $0 --db NAME [--ext EXT]...

Verifies that (inside Docker container "\$PG_CONTAINER"):

  - the database exists (exit code 4 if it does not), and
  - all requested extensions exist (exit code 1 if any are missing).

Exit codes:
  0 = OK
  1 = extension(s) missing
  4 = database does not exist

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
    --ext)
      EXTS+=("$2")
      shift 2
      ;;
    *)
      echo "Unknown arg: $1" >&2
      usage
      ;;
  esac
done

[[ -z "$DB_NAME" ]] && usage

box "Agent DB verify" "$BLUE"
echo -e "${GRAY}Container:${RESET} ${BOLD}${PG_CONTAINER:-edb-postgres}${RESET}"
echo -e "${GRAY}Database:${RESET}  ${BOLD}${DB_NAME}${RESET}"
if [[ ${#EXTS[@]} -gt 0 ]]; then
  echo -e "${GRAY}Extensions:${RESET} ${BOLD}${EXTS[*]}${RESET}"
fi
echo

# 1) Check DB exists
log_step "Checking database '${DB_NAME}'..."
if ! pg_exists_db "$DB_NAME"; then
  log_error "Database '${DB_NAME}' does not exist."
  exit 4
fi
log_ok "Database '${DB_NAME}' exists."
echo

# 2) Check extensions
MISSING=0

if [[ ${#EXTS[@]} -gt 0 ]]; then
  log_step "Checking extensions..."
  for ext in "${EXTS[@]}"; do
    if pg_has_ext "$DB_NAME" "$ext"; then
      log_ok "Extension '${ext}' is present."
    else
      log_warn "Extension '${ext}' is MISSING in '${DB_NAME}'."
      MISSING=1
    fi
  done
  echo
else
  log_warn "No extensions specified, skipping extension checks."
  echo
fi

if [[ $MISSING -eq 1 ]]; then
  box "Verify: extensions missing" "$YELLOW"
  exit 1
fi

box "Verify OK 🎉" "$GREEN"
