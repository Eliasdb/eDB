#!/usr/bin/env bash
set -euo pipefail

PLUGIN="@edb-workbench/plugin"
BASE="${BASE:-http://127.0.0.1:9102}"

echo "• Build plugin"
pnpm nx build workbench-plugin

echo "• Generate models"
pnpm nx g "$PLUGIN:workbench-api-model" --name=agents \
  --fields="codename:string,status:enum(active|inactive|retired),clearance?:number,specialty?:string"
pnpm nx g "$PLUGIN:workbench-api-model" --name=missions \
  --fields="title:string,status:enum(planned|active|paused|completed|failed),riskLevel?:number,eta?:date"

echo "• Generate resources"
pnpm nx g "$PLUGIN:workbench-api-resource" --name=agents
pnpm nx g "$PLUGIN:workbench-api-resource" --name=missions

echo "• Generate infra"
pnpm nx g "$PLUGIN:workbench-api-infra" --name=agents
pnpm nx g "$PLUGIN:workbench-api-infra" --name=missions

echo "• Wire relationship missions -> agents (fk=agentId, include=agent)"
pnpm nx g "$PLUGIN:workbench-api-rel" \
  --belongsTo="missions:agents" \
  --fk="agentId" \
  --include="agent" \
  --onDelete="cascade" \
  --select="id,codename,status,clearance"

echo "• Run migrations"
pnpm nx run workbench-api-infra:migrations:generate
pnpm nx run workbench-api-infra:migrate

cat <<'MSG'
In another terminal:
  pnpm nx serve workbench-api
Wait for "Server listening at http://127.0.0.1:9102", then press Enter here.
MSG
read -r _

# ───────────────── Smoke data
echo "• Seed agent"
AGENT_ID=$(
  curl -sS -X POST "$BASE/agents" \
    -H "Content-Type: application/json" \
    -d '{"codename":"Shadow-Fox","status":"active","clearance":4}' \
  | jq -r '.agent.id // .id'
)
echo "AGENT_ID=$AGENT_ID"

echo "• Seed missions (varied titles/status/riskLevel)"
create_mission () {
  local t="$1"; local st="$2"; local r="$3"
  curl -sS -X POST "$BASE/missions" \
    -H "Content-Type: application/json" \
    -d "{\"title\":\"$t\",\"status\":\"$st\",\"riskLevel\":$r,\"agentId\":\"$AGENT_ID\"}" \
  | jq -r '.mission.id // .id'
}
M1=$(create_mission "Secure Uplink" planned 3)
M2=$(create_mission "Night Courier" active 2)
M3=$(create_mission "Signal Sweep" paused 5)
echo "M1=$M1 M2=$M2 M3=$M3"

# ───────────────── “include” checks
echo "• One with include=agent"
curl -sS "$BASE/missions/$M1?include=agent" | jq

echo "• List with include=agent (page 1)"
curl -sS "$BASE/missions?page=1&pageSize=2&include=agent" | jq

# ───────────────── Pagination checks
echo "• Page 2 (no include)"
curl -sS "$BASE/missions?page=2&pageSize=2" | jq

# ───────────────── Sorting checks
echo "• Sort by title asc, then status desc (no include)"
curl -sS "$BASE/missions?sort=title:asc,status:desc" | jq '.items[].title'

# ───────────────── Filter checks
echo "• Filter by status=active (no include)"
curl -sS "$BASE/missions?filter=status=active" | jq '.items[].status'

echo "• Filter by agentId (FK filter)"
curl -sS "$BASE/missions?filter=agentId='"$AGENT_ID"'" | jq '.items | length'

# ───────────────── Idempotency (no file changes expected)
pnpm nx g "$PLUGIN:workbench-api-model" --name=agents \
  --fields="codename:string,status:enum(active|inactive|retired),clearance?:number,specialty?:string" >/dev/null
pnpm nx g "$PLUGIN:workbench-api-model" --name=missions \
  --fields="title:string,status:enum(planned|active|paused|completed|failed),riskLevel?:number,eta?:date" >/dev/null
pnpm nx g "$PLUGIN:workbench-api-resource" --name=agents >/dev/null
pnpm nx g "$PLUGIN:workbench-api-resource" --name=missions >/dev/null
pnpm nx g "$PLUGIN:workbench-api-infra" --name=agents >/dev/null
pnpm nx g "$PLUGIN:workbench-api-infra" --name=missions >/dev/null
pnpm nx g "$PLUGIN:workbench-api-rel" \
  --belongsTo="missions:agents" --fk="agentId" --include="agent" \
  --onDelete="cascade" --select="id,codename,status,clearance" >/dev/null

if git diff --quiet; then
  echo "Idempotency ✅"
else
  echo "Idempotency ❌"; git --no-pager diff --stat
fi