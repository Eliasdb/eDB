#!/usr/bin/env bash
set -euo pipefail

PLUGIN="@edb-workbench/plugin"
BASE="${BASE:-http://127.0.0.1:9102}"

# ──────────────────────────────────────────────────────────────────────────────
# Logging
# ──────────────────────────────────────────────────────────────────────────────
mkdir -p logs
STAMP="$(date +%Y%m%d-%H%M%S)"
LOG="logs/workbench-gadgets-drop-${STAMP}.log"
exec > >(tee -a "$LOG") 2>&1
echo "# workbench-gadgets drop @ $(date -Is)"
echo "# BASE=$BASE"
echo

# Best-effort: clean smoke data via API first (if server is up)
echo "• Attempt to delete gadgets (if API is running)"
set +e
curl -sS "$BASE/gadgets?pageSize=1000" | jq -r '.items[].id' | \
  xargs -I{} -r curl -sS -X DELETE "$BASE/gadgets/{}" >/dev/null
echo "• Attempt to delete suppliers (if API is running)"
curl -sS "$BASE/suppliers?pageSize=1000" | jq -r '.items[].id' | \
  xargs -I{} -r curl -sS -X DELETE "$BASE/suppliers/{}" >/dev/null
set -e

echo "• Revert relationship gadgets -> suppliers"
pnpm nx g "$PLUGIN:workbench-api-rel" \
  --belongsTo="gadgets:suppliers" \
  --fk="supplierId" \
  --include="supplier" \
  --onDelete="cascade" \
  --select="id,name,rating,country" \
  --revert || true

echo "• Revert infra"
pnpm nx g "$PLUGIN:workbench-api-infra" --name=gadgets   --revert || true
pnpm nx g "$PLUGIN:workbench-api-infra" --name=suppliers --revert || true

echo "• Revert resources"
pnpm nx g "$PLUGIN:workbench-api-resource" --name=gadgets   --revert || true
pnpm nx g "$PLUGIN:workbench-api-resource" --name=suppliers --revert || true

echo "• Revert models"
pnpm nx g "$PLUGIN:workbench-api-model" --name=gadgets   --revert || true
pnpm nx g "$PLUGIN:workbench-api-model" --name=suppliers --revert || true

echo "• Generate + apply drop migrations (best-effort)"
pnpm nx run workbench-api-infra:migrations:generate || true
pnpm nx run workbench-api-infra:migrate || true

echo
echo "Drop complete. Full log: ${LOG}"