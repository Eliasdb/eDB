#!/usr/bin/env bash
set -euo pipefail

PLUGIN="@edb-workbench/plugin"
BASE="${BASE:-http://127.0.0.1:9102}"

echo "• Build plugin"
pnpm nx build workbench-plugin

echo "• Generate NEW models (suppliers, gadgets)"
pnpm nx g "$PLUGIN:workbench-api-model" --name=suppliers \
  --fields="name:string,country?:string,rating?:number,contactEmail?:string"
pnpm nx g "$PLUGIN:workbench-api-model" --name=gadgets \
  --fields="name:string,category:enum(surveillance|infiltration|comms|medical),weightGr?:number,discontinued?:boolean,releasedAt?:date"

echo "• Generate resources"
pnpm nx g "$PLUGIN:workbench-api-resource" --name=suppliers
pnpm nx g "$PLUGIN:workbench-api-resource" --name=gadgets

echo "• Generate infra"
pnpm nx g "$PLUGIN:workbench-api-infra" --name=suppliers
pnpm nx g "$PLUGIN:workbench-api-infra" --name=gadgets

echo "• Wire relationship gadgets -> suppliers (fk=supplierId, include=supplier)"
pnpm nx g "$PLUGIN:workbench-api-rel" \
  --belongsTo="gadgets:suppliers" \
  --fk="supplierId" \
  --include="supplier" \
  --onDelete="cascade" \
  --select="id,name,rating,country"

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
echo "• Seed supplier"
SUPPLIER_ID=$(
  curl -sS -X POST "$BASE/suppliers" \
    -H "Content-Type: application/json" \
    -d '{"name":"Q-Branch Ltd.","country":"UK","rating":5,"contactEmail":"q@q-branch.example"}' \
  | jq -r '.supplier.id // .id'
)
echo "SUPPLIER_ID=$SUPPLIER_ID"

echo "• Seed gadgets (varied category/weight/discontinued)"
create_gadget () {
  local n="$1"; local cat="$2"; local w="$3"; local disc="$4"
  curl -sS -X POST "$BASE/gadgets" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"$n\",\"category\":\"$cat\",\"weightGr\":$w,\"discontinued\":$disc,\"supplierId\":\"$SUPPLIER_ID\"}" \
  | jq -r '.gadget.id // .id'
}
G1=$(create_gadget "Micro-Camera Pen" surveillance 24 false)
G2=$(create_gadget "Grapple Cufflink" infiltration 58 false)
G3=$(create_gadget "Bone-Conduction Earpiece" comms 12 false)
G4=$(create_gadget "Trauma Patch" medical 15 false)
G5=$(create_gadget "Exploding Chewing Gum" infiltration 8 true)
echo "G1=$G1 G2=$G2 G3=$G3 G4=$G4 G5=$G5"

# ───────────────── “include” checks
echo "• One with include=supplier"
curl -sS "$BASE/gadgets/$G1?include=supplier" | jq

echo "• List with include=supplier (page 1)"
curl -sS "$BASE/gadgets?page=1&pageSize=3&include=supplier" | jq

# ───────────────── Pagination checks
echo "• Page 2 (no include)"
curl -sS "$BASE/gadgets?page=2&pageSize=2" | jq

# ───────────────── Sorting checks
echo "• Sort by name asc, then category desc"
curl -sS "$BASE/gadgets?sort=name:asc,category:desc" | jq '.items[].name'

# ───────────────── Filter checks
echo "• Filter by category=infiltration"
curl -sS "$BASE/gadgets?filter=category=infiltration" | jq '.items[].category'

echo "• Filter by supplierId (FK filter)"
curl -sS "$BASE/gadgets?filter=supplierId=$SUPPLIER_ID" | jq '.items | length'

# ───────────────── Idempotency (no file changes expected)
pnpm nx g "$PLUGIN:workbench-api-model" --name=suppliers \
  --fields="name:string,country?:string,rating?:number,contactEmail?:string" >/dev/null
pnpm nx g "$PLUGIN:workbench-api-model" --name=gadgets \
  --fields="name:string,category:enum(surveillance|infiltration|comms|medical),weightGr?:number,discontinued?:boolean,releasedAt?:date" >/dev/null
pnpm nx g "$PLUGIN:workbench-api-resource" --name=suppliers >/dev/null
pnpm nx g "$PLUGIN:workbench-api-resource" --name=gadgets >/dev/null
pnpm nx g "$PLUGIN:workbench-api-infra" --name=suppliers >/dev/null
pnpm nx g "$PLUGIN:workbench-api-infra" --name=gadgets >/dev/null
pnpm nx g "$PLUGIN:workbench-api-rel" \
  --belongsTo="gadgets:suppliers" --fk="supplierId" --include="supplier" \
  --onDelete="cascade" --select="id,name,rating,country" >/dev/null

if git diff --quiet; then
  echo "Idempotency ✅"
else
  echo "Idempotency ❌"; git --no-pager diff --stat
fi

echo "• (Optional) run infra tests"
pnpm nx test workbench-api-infra --skip-nx-cache