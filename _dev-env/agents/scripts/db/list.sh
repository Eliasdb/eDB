#!/usr/bin/env bash
set -euo pipefail

# Load shared PG helpers (pg_rows, etc.)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=/dev/null
source "$SCRIPT_DIR/pg-utils.sh"

WHAT="db"
LIKE=""

RESET='\033[0m'
BOLD='\033[1m'
GREEN='\033[32m'
YELLOW='\033[33m'
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
log_warn()  { echo -e "${YELLOW}!${RESET} $1"; }

usage() {
  cat <<EOF
Usage: $0 [--what db|ext] [--like PATTERN]

--what db   List databases (default)
--what ext  List extensions in the current database
--like PAT  SQL LIKE pattern (e.g. '%agent%')

Uses Docker container:
  PG_CONTAINER=\${PG_CONTAINER:-edb-postgres}
EOF
  exit 1
}

# Parse args
while [[ $# -gt 0 ]]; do
  case "$1" in
    --what)
      WHAT="$2"
      shift 2
      ;;
    --like)
      LIKE="$2"
      shift 2
      ;;
    *)
      echo "Unknown arg: $1" >&2
      usage
      ;;
  esac
done

case "$WHAT" in
  db)
    box "List databases" "$BLUE"
    echo -e "${GRAY}Container:${RESET} ${BOLD}${PG_CONTAINER:-edb-postgres}${RESET}"
    [[ -n "$LIKE" ]] && echo -e "${GRAY}Filter:${RESET}    ${BOLD}${LIKE}${RESET}"
    echo

    SQL="SELECT datname FROM pg_database WHERE datistemplate = false"
    if [[ -n "$LIKE" ]]; then
      SQL="$SQL AND datname LIKE '${LIKE}'"
    fi
    SQL="$SQL ORDER BY 1;"

    log_step "Querying databases..."
    RESULTS="$(pg_rows postgres "$SQL" || true)"

    if [[ -z "$RESULTS" ]]; then
      log_warn "No databases matched."
      exit 0
    fi

    while IFS= read -r db; do
      [[ -z "$db" ]] && continue
      # pretty bullet for humans
      echo -e "  ${GREEN}•${RESET} ${db}"
    done <<< "$RESULTS"
    ;;

  ext)
    # For extensions we need a DB context; default to postgres if nothing else set
    DBNAME="${PGDATABASE:-postgres}"

    box "List extensions" "$BLUE"
    echo -e "${GRAY}Container:${RESET} ${BOLD}${PG_CONTAINER:-edb-postgres}${RESET}"
    echo -e "${GRAY}Database:${RESET}  ${BOLD}${DBNAME}${RESET}"
    [[ -n "$LIKE" ]] && echo -e "${GRAY}Filter:${RESET}    ${BOLD}${LIKE}${RESET}"
    echo

    SQL="SELECT extname FROM pg_extension"
    if [[ -n "$LIKE" ]]; then
      SQL="$SQL WHERE extname LIKE '${LIKE}'"
    fi
    SQL="$SQL ORDER BY 1;"

    log_step "Querying extensions..."
    RESULTS="$(pg_rows "$DBNAME" "$SQL" || true)"

    if [[ -z "$RESULTS" ]]; then
      log_warn "No extensions matched."
      exit 0
    fi

    while IFS= read -r ext; do
      [[ -z "$ext" ]] && continue
      echo -e "  ${GREEN}•${RESET} ${ext}"
    done <<< "$RESULTS"
    ;;

  *)
    echo "Unknown --what '${WHAT}'" >&2
    usage
    ;;
esac
