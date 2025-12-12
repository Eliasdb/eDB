#!/usr/bin/env bash
set -euo pipefail

PLUGIN="@edb-workbench/plugin"
BASE="${BASE:-http://127.0.0.1:9102}"

# ──────────────────────────────────────────────────────────────────────────────
# Logging
# ──────────────────────────────────────────────────────────────────────────────
mkdir -p logs
STAMP="$(date +%Y%m%d-%H%M%S)"
LOG="logs/workbench-drop-${STAMP}.log"
exec > >(tee -a "$LOG") 2>&1
echo "# workbench-drop run @ $(date -Is)"
echo "# BASE=$BASE"
echo

# Optional: clean the smoke data BEFORE removing endpoints
echo "• Attempt to delete seeded missions (if API is still running)"
set +e
curl -sS "$BASE/missions?pageSize=1000" | jq -r '.items[].id' | \
  xargs -I{} -r curl -sS -X DELETE "$BASE/missions/{}"
echo "• Attempt to delete seeded agents (if API is still running)"
curl -sS "$BASE/agents?pageSize=1000" | jq -r '.items[].id' | \
  xargs -I{} -r curl -sS -X DELETE "$BASE/agents/{}"
set -e

echo "• Revert relationship missions -> agents"
pnpm nx g "$PLUGIN:workbench-api-rel" \
  --belongsTo="missions:agents" \
  --fk="agentId" \
  --include="agent" \
  --onDelete="cascade" \
  --select="id,codename,status,clearance" \
  --revert || true

echo "• Revert infra (missions, agents)"
pnpm nx g "$PLUGIN:workbench-api-infra" --name=missions --revert || true
pnpm nx g "$PLUGIN:workbench-api-infra" --name=agents  --revert || true

echo "• Revert resources (missions, agents)"
pnpm nx g "$PLUGIN:workbench-api-resource" --name=missions --revert || true
pnpm nx g "$PLUGIN:workbench-api-resource" --name=agents  --revert || true

echo "• Revert models (missions, agents)"
pnpm nx g "$PLUGIN:workbench-api-model" --name=missions --revert || true
pnpm nx g "$PLUGIN:workbench-api-model" --name=agents  --revert || true

echo "• Generate + apply drop migrations (optional, best-effort)"
pnpm nx run workbench-api-infra:migrations:generate || true
pnpm nx run workbench-api-infra:migrate || true

echo
echo "Drop complete. Full log: ${LOG}"