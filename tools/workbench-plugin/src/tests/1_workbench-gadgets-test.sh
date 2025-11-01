#!/usr/bin/env bash
set -euo pipefail

BASE="${BASE:-http://127.0.0.1:9102}"

need() { command -v "$1" >/dev/null || { echo "Missing dependency: $1"; exit 1; }; }
need jq
need curl

echo "• Wait for API at $BASE ..."
for i in {1..60}; do
  if curl -sf "$BASE/health" >/dev/null 2>&1; then
    echo "API is up."
    break
  fi
  sleep 1
  if [ $i -eq 60 ]; then echo "API not responding at $BASE"; exit 1; fi
done

# ───────────────── Seed
echo "• Seed supplier"
RESP=$(curl -sS -f -X POST "$BASE/suppliers" \
  -H "Content-Type: application/json" \
  -d '{"name":"Q-Branch Ltd.","country":"UK","rating":5,"contactEmail":"q@q-branch.example"}')
SUPPLIER_ID=$(echo "$RESP" | jq -r '(.supplier?.id // .id // .data?.id // empty)')
if [ -z "${SUPPLIER_ID:-}" ]; then
  echo "Failed to create supplier. Response:"; echo "$RESP"; exit 1
fi
echo "SUPPLIER_ID=$SUPPLIER_ID"

echo "• Seed gadgets (varied category/weight/discontinued)"
create_gadget () {
  local n="$1"; local cat="$2"; local w="$3"; local disc="$4"
  local resp id
  resp=$(curl -sS -f -X POST "$BASE/gadgets" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"$n\",\"category\":\"$cat\",\"weightGr\":$w,\"discontinued\":$disc,\"supplierId\":\"$SUPPLIER_ID\"}")
  id=$(echo "$resp" | jq -r '(.gadget?.id // .id // .data?.id // empty)')
  if [ -z "$id" ]; then echo "Create gadget failed: $resp"; fi
  echo "$id"
}
G1=$(create_gadget "Micro-Camera Pen" surveillance 24 false)
G2=$(create_gadget "Grapple Cufflink" infiltration 58 false)
G3=$(create_gadget "Bone-Conduction Earpiece" comms 12 false)
G4=$(create_gadget "Trauma Patch" medical 15 false)
G5=$(create_gadget "Exploding Chewing Gum" infiltration 8 true)
echo "G1=$G1 G2=$G2 G3=$G3 G4=$G4 G5=$G5"

# ───────────────── Checks
echo "• One with include=supplier"
curl -sS -f "$BASE/gadgets/${G1}?include=supplier" | jq

echo "• List with include=supplier (page 1)"
curl -sS -f "$BASE/gadgets?page=1&pageSize=3&include=supplier" | jq

echo "• Page 2 (no include)"
curl -sS -f "$BASE/gadgets?page=2&pageSize=2" | jq

echo "• Sort by name asc, then category desc"
curl -sS -f "$BASE/gadgets?sort=name:asc,category:desc" | jq '.items[].name'

echo "• Filter by category=infiltration"
curl -sS -f "$BASE/gadgets?filter=category=infiltration" | jq '.items[].category'

echo "• Filter by supplierId (FK filter)"
curl -sS -f "$BASE/gadgets?filter=supplierId=${SUPPLIER_ID}" | jq '.items | length'

# ───────────────── Idempotency
echo "• Idempotency (no file changes expected)"
pnpm nx g "@edb-workbench/plugin:workbench-api-model" --name=suppliers \
  --fields="name:string,country?:string,rating?:number,contactEmail?:string" >/dev/null
pnpm nx g "@edb-workbench/plugin:workbench-api-model" --name=gadgets \
  --fields="name:string,category:enum(surveillance|infiltration|comms|medical),weightGr?:number,discontinued?:boolean,releasedAt?:date" >/dev/null
pnpm nx g "@edb-workbench/plugin:workbench-api-resource" --name=suppliers >/dev/null
pnpm nx g "@edb-workbench/plugin:workbench-api-resource" --name=gadgets >/dev/null
pnpm nx g "@edb-workbench/plugin:workbench-api-infra" --name=suppliers >/dev/null
pnpm nx g "@edb-workbench/plugin:workbench-api-infra" --name=gadgets >/dev/null
pnpm nx g "@edb-workbench/plugin:workbench-api-rel" \
  --belongsTo="gadgets:suppliers" --fk="supplierId" --include="supplier" \
  --onDelete="cascade" --select="id,name,rating,country" >/dev/null

if git diff --quiet; then
  echo "Idempotency ✅"
else
  echo "Idempotency ❌"; git --no-pager diff --stat
fi

echo "• (Optional) run infra tests"
pnpm nx test workbench-api-infra --skip-nx-cache